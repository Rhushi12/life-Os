
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Plan, ResearchResult, StrategyResult, RefereeResult, Milestone, Message, ResearchContext, UserProfile } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("API key is missing. Please ensure the API_KEY environment variable is set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || '' });
const COMPLEX_MODEL = 'gemini-2.5-flash';
const FAST_MODEL = 'gemini-2.5-flash';

// --- SCHEMAS ---

const researchSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        keySuccessFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
        potentialRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendedResources: { type: Type.ARRAY, items: { type: Type.STRING } },
        marketAnalysis: { type: Type.STRING },
    },
    required: ['keySuccessFactors', 'potentialRisks', 'recommendedResources', 'marketAnalysis'],
};

const strategySchema: Schema = {
    type: Type.OBJECT,
    properties: {
        milestones: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    kpi: { type: Type.STRING },
                    estimatedHours: { type: Type.NUMBER },
                    tasks: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING },
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                durationMinutes: { type: Type.NUMBER },
                            },
                            required: ['id', 'title', 'description', 'durationMinutes'],
                        },
                    },
                },
                required: ['id', 'title', 'kpi', 'estimatedHours', 'tasks'],
            },
        },
        strategyRationale: { type: Type.STRING },
    },
    required: ['milestones', 'strategyRationale'],
};

const refereeSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        feasibilityScore: { type: Type.NUMBER },
        assessment: { type: Type.STRING },
        approved: { type: Type.BOOLEAN },
    },
    required: ['feasibilityScore', 'assessment', 'approved'],
};

// --- AGENT FUNCTIONS ---

async function runResearcher(goal: string): Promise<ResearchResult> {
    const systemInstruction = `You are the RESEARCHER AGENT. 
    Your job is to analyze the user's goal using internal knowledge of verified data, best practices, and potential pitfalls.
    Output a rigorous analysis including Success Factors and Risks. Do not sugarcoat.`;

    const response = await ai.models.generateContent({
        model: COMPLEX_MODEL,
        contents: `Goal: "${goal}"`,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: researchSchema,
            temperature: 0.3, // Low temp for factual accuracy
        }
    });
    return JSON.parse(response.text.trim()) as ResearchResult;
}

async function runStrategist(goal: string, research: ResearchResult): Promise<StrategyResult> {
    const systemInstruction = `You are the STRATEGIST AGENT.
    Using the provided Research Data, construct a high-level roadmap.
    Break the goal into 3-5 sequential milestones.
    For each milestone, define specific tasks.
    Ensure IDs are unique (e.g., m-1, t-1-1).`;

    const prompt = `
    Goal: "${goal}"
    
    Research Data:
    ${JSON.stringify(research, null, 2)}

    ${research.initialStrategy ? `
    Proposed High-Level Strategy (Use this as a base):
    ${JSON.stringify(research.initialStrategy, null, 2)}
    ` : ''}
    
    Create a strategic roadmap.`;

    const response = await ai.models.generateContent({
        model: COMPLEX_MODEL,
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: strategySchema,
            temperature: 0.5,
        }
    });
    return JSON.parse(response.text.trim()) as StrategyResult;
}

async function runReferee(goal: string, strategy: StrategyResult, research: ResearchResult): Promise<RefereeResult> {
    const systemInstruction = `You are the REFEREE AGENT.
    Your job is to validate the feasibility of the strategy against the research and the goal.
    Assign a Feasibility Score (0-100).
    If the plan is unrealistic (e.g., running a marathon in 1 week), give a low score.`;

    const prompt = `
    Goal: "${goal}"
    Research Risks: ${JSON.stringify(research.potentialRisks)}
    Proposed Strategy: ${JSON.stringify(strategy.milestones)}
    
    Evaluate this plan.`;

    const response = await ai.models.generateContent({
        model: FAST_MODEL,
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: refereeSchema,
            temperature: 0.1,
        }
    });
    return JSON.parse(response.text.trim()) as RefereeResult;
}

// --- INTERVIEWER AGENT ---

const interviewerSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        message: { type: Type.STRING },
        isComplete: { type: Type.BOOLEAN },
        context: {
            type: Type.OBJECT,
            properties: {
                goal: { type: Type.STRING },
                constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
                preferences: { type: Type.ARRAY, items: { type: Type.STRING } },
                experienceLevel: { type: Type.STRING },
                budget: { type: Type.STRING },
                timeline: { type: Type.STRING },
            },
            nullable: true
        }
    },
    required: ['message', 'isComplete'],
};

export async function runInterviewer(history: Message[], currentInput: string, userProfile?: UserProfile | null): Promise<{ message: string, isComplete: boolean, context?: ResearchContext }> {
    const systemInstruction = `You are an expert Project Manager and Goal Analyst.
    Your job is to interview the user to clarify their goal.
    
    User Context:
    Name: ${userProfile?.displayName || 'User'}
    Age: ${userProfile?.age || 'Unknown'}
    Occupation: ${userProfile?.occupation || 'Unknown'}

    Rules:
    1. Address the user by name occasionally.
    2. Tailor your questions based on their occupation and age if relevant (e.g., for a student, ask about exams; for a professional, ask about work-life balance).
    3. Ask ONE clarifying question at a time.
    4. Keep questions short and conversational.
    5. **CRITICAL**: If the goal involves an exam, certification, or standard (e.g., "Class 12", "Driving License", "Bar Exam"), you MUST ask for the specific **Board, Region, Year, or Variant** (e.g., "CBSE or ICSE?", "California or Texas?", "2024 or 2025?").
    6. Focus on: Specificity, Constraints (Budget, Time), Experience Level, and Preferences.
    7. If the user's goal is already very clear, you can finish early.
    8. When you have enough information to form a solid plan, set "isComplete" to true and populate the "context" object.
    9. The "context" object MUST be populated if "isComplete" is true.
    
    Current Goal Context:
    User's initial input might be vague. Dig deeper to find the exact standard/curriculum needed.
    `;

    const chatHistory = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    const prompt = `
    Conversation History:
    ${chatHistory}
    
    User's Latest Input: "${currentInput}"
    
    Respond in JSON.`;

    const response = await ai.models.generateContent({
        model: FAST_MODEL,
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: interviewerSchema,
            temperature: 0.7,
        }
    });

    return JSON.parse(response.text.trim());
}



// --- N8N DEEP RESEARCH ---

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://n8n-63lu.onrender.com/webhook/b7f2b640-9a16-4fca-9c73-74ee427f4606";

export async function runDeepResearch(context: ResearchContext): Promise<ResearchResult> {
    console.log("Sending context to N8n:", context);

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(context)
        });

        if (!response.ok) {
            throw new Error(`N8n Webhook failed: ${response.statusText}`);
        }

        const data = await response.json();

        // N8n usually returns an array of items, or a single object
        // The Strategist Agent should return { output: { report: "...", strategy: { ... } } }
        // Or sometimes just the string if the JSON parsing failed in the agent.

        let outputData: any = data;
        if (Array.isArray(data) && data.length > 0) {
            outputData = data[0];
        }

        console.log("N8n Output Keys:", Object.keys(outputData));
        if (outputData.output) {
            console.log("N8n Agent Output Keys:", typeof outputData.output === 'object' ? Object.keys(outputData.output) : "Output is string");
        }

        // Extract the 'output' field which contains the agent's response
        let agentResponse = outputData.output || outputData;

        // If agentResponse is a string (which it often is from N8n agents), try to parse it as JSON
        if (typeof agentResponse === 'string') {
            try {
                // Remove markdown code blocks if present
                const cleaned = agentResponse.replace(/```json|```/g, '').trim();
                agentResponse = JSON.parse(cleaned);
            } catch (e) {
                console.warn("Failed to parse N8n output as JSON, treating as raw report:", e);
                // Fallback: treat entire string as report
                return {
                    keySuccessFactors: ["Derived from Deep Research Report"],
                    potentialRisks: ["See detailed report for risks"],
                    recommendedResources: ["See detailed report for resources"],
                    marketAnalysis: "Deep Research Analysis Completed",
                    report: agentResponse
                };
            }
        }

        // Now we expect agentResponse to have { report, strategy }
        const reportText = agentResponse.report || (typeof agentResponse === 'string' ? agentResponse : JSON.stringify(agentResponse));
        const strategy = agentResponse.strategy || null;

        return {
            keySuccessFactors: ["Derived from Deep Research Report"],
            potentialRisks: ["See detailed report for risks"],
            recommendedResources: ["See detailed report for resources"],
            marketAnalysis: "Deep Research Analysis Completed",
            report: reportText,
            initialStrategy: strategy // Pass this through to the UI/Orchestrator
        };

    } catch (error) {
        console.error("Deep Research Error:", error);
        throw error;
    }
}

// --- ORCHESTRATOR ---

export type AgentCallback = (agentName: string, data: any) => void;

export async function runOrchestration(goal: string, onStepComplete: AgentCallback, initialResearch?: ResearchResult): Promise<Plan> {
    // 1. Researcher
    let researchData: ResearchResult;

    if (initialResearch) {
        researchData = initialResearch;
        onStepComplete('Researcher Agent', { ...researchData, note: "Using Deep Research Data" });
    } else {
        researchData = await runResearcher(goal);
        onStepComplete('Researcher Agent', researchData);
    }

    // 2. Strategist (Consumes Researcher Output)
    const strategyData = await runStrategist(goal, researchData);
    onStepComplete('Strategist Agent', strategyData);

    // 3. Planner (Simulated here as part of Strategist/Final assembly for speed in demo)
    // In a full backend, this would run OR-Tools. Here we calculate totals.
    const totalHours = strategyData.milestones.reduce((acc, m) => acc + m.estimatedHours, 0);
    const plannerData = { totalHours, scheduleOptimized: true };
    onStepComplete('Planner Agent', plannerData);

    // 4. Referee (Validates the assembly)
    const refereeData = await runReferee(goal, strategyData, researchData);
    onStepComplete('Referee Agent', refereeData);

    // 5. Final Assembly (The Blackboard State)
    const finalPlan: Plan = {
        goalTitle: goal.length > 50 ? `${goal.substring(0, 47)}...` : goal,
        totalEstimatedHours: totalHours,
        feasibilityScore: refereeData.feasibilityScore,
        realismAssessment: refereeData.assessment,
        milestones: strategyData.milestones
    };

    return finalPlan;
}
