
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Plan, ResearchResult, StrategyResult, RefereeResult, Milestone, Message, ResearchContext } from '../types';

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

export async function runInterviewer(history: Message[], currentInput: string): Promise<{ message: string, isComplete: boolean, context?: ResearchContext }> {
    const systemInstruction = `You are an expert Project Manager and Goal Analyst.
    Your job is to interview the user to clarify their goal.
    
    Rules:
    1. Ask ONE clarifying question at a time.
    2. Keep questions short and conversational.
    3. Focus on: Specificity, Constraints (Budget, Time), Experience Level, and Preferences.
    4. If the user's goal is already very clear, you can finish early.
    5. When you have enough information to form a solid plan, set "isComplete" to true and populate the "context" object.
    6. The "context" object MUST be populated if "isComplete" is true.
    
    Current Goal Context:
    User's initial input might be vague. Dig deeper.
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

const N8N_WEBHOOK_URL = "https://n8n-63lu.onrender.com/webhook/6017428e-785b-4e59-ac62-8fe0a5a2c8f6";

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
        return data as ResearchResult;

    } catch (error) {
        console.error("Deep Research Error:", error);
        // Fallback or re-throw? Let's re-throw so the UI shows the error.
        throw error;
    }
}

// --- ORCHESTRATOR ---

export type AgentCallback = (agentName: string, data: any) => void;

export async function runOrchestration(goal: string, onStepComplete: AgentCallback): Promise<Plan> {
    // 1. Researcher
    const researchData = await runResearcher(goal);
    onStepComplete('Researcher Agent', researchData);

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
