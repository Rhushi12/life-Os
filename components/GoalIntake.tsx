
import React, { useState, useEffect, useRef } from 'react';
import { Plan, AgentStatus, ResearchContext } from '../types';
import { LoadingSpinnerIcon, CheckCircleIcon, ErrorCircleIcon } from './icons';
import { Navbar } from './Navbar';
import { View } from '../types';
import { runOrchestration, runDeepResearch } from '../services/geminiService';
import { Terminal, Database } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { useAuth } from '../contexts/AuthContext';

const initialAgentStatuses: AgentStatus[] = [
    { name: 'Interviewer', status: 'complete', message: 'Context gathered.' },
    { name: 'Deep Research Agent', status: 'pending', message: 'Waiting for context...' },
    { name: 'Strategist Agent', status: 'pending', message: 'Mapping milestones & KPIs...' },
    { name: 'Referee Agent', status: 'pending', message: 'Validating feasibility score...' },
];

// Agent Visualization Component
const AgentProgress: React.FC<{ agents: AgentStatus[]; activeLog: any }> = ({ agents, activeLog }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeLog]);

    return (
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 animate-fade-in">
            {/* Left: Agent Status List */}
            <div className="bg-zinc-950/80 p-6 rounded-3xl border border-zinc-800 backdrop-blur-xl h-fit">
                <h3 className="text-lg font-light mb-6 flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#5100fd]" />
                    Swarm Orchestration
                </h3>
                <div className="space-y-4">
                    {agents.map((agent, index) => (
                        <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-500 ${agent.status === 'running'
                            ? 'bg-zinc-900/80 border-[#5100fd]/50 shadow-[0_0_15px_-5px_rgba(81,0,253,0.3)]'
                            : 'bg-zinc-900/30 border-zinc-800/50'
                            }`}>
                            <div className="flex-shrink-0">
                                {agent.status === 'running' && <LoadingSpinnerIcon className="w-5 h-5 text-[#5100fd] animate-spin" />}
                                {agent.status === 'complete' && <CheckCircleIcon className="w-5 h-5 text-emerald-500" />}
                                {agent.status === 'pending' && <div className="w-5 h-5 border-2 border-zinc-800 rounded-full" />}
                                {agent.status === 'error' && <ErrorCircleIcon className="w-5 h-5 text-red-500" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h3 className={`text-sm font-medium ${agent.status === 'running' || agent.status === 'complete' ? 'text-white' : 'text-zinc-500'}`}>{agent.name}</h3>
                                    {agent.status === 'running' && <span className="text-[10px] uppercase tracking-wider text-[#5100fd] animate-pulse">Processing</span>}
                                </div>
                                <p className="text-xs text-zinc-500">{agent.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Live Blackboard / JSON Log */}
            <div className="bg-black p-6 rounded-3xl border border-zinc-800 font-mono text-xs flex flex-col h-[400px]">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-900">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <Terminal className="w-4 h-4" />
                        <span>Blackboard Stream</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                    </div>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                    {agents.map((agent, i) => agent.result && (
                        <div key={i} className="animate-fade-in">
                            <div className="text-[#5100fd] mb-1"># {agent.name} Output:</div>
                            {agent.name === 'Deep Research Agent' && agent.result?.report ? (
                                <div className="text-zinc-400 bg-zinc-900/30 p-4 rounded-lg border border-zinc-900 overflow-x-auto prose prose-invert prose-sm max-w-none">
                                    {/* Simple Markdown Rendering (Headers, Lists, Bold) */}
                                    {agent.result.report.split('\n').map((line: string, idx: number) => {
                                        if (line.startsWith('# ')) return <h1 key={idx} className="text-xl font-bold text-white mb-2 mt-4">{line.replace('# ', '')}</h1>;
                                        if (line.startsWith('## ')) return <h2 key={idx} className="text-lg font-bold text-white mb-2 mt-4">{line.replace('## ', '')}</h2>;
                                        if (line.startsWith('### ')) return <h3 key={idx} className="text-md font-bold text-white mb-1 mt-2">{line.replace('### ', '')}</h3>;
                                        if (line.startsWith('- ')) return <li key={idx} className="ml-4 list-disc">{line.replace('- ', '')}</li>;
                                        return <p key={idx} className="mb-1 whitespace-pre-wrap">{line}</p>;
                                    })}
                                </div>
                            ) : (
                                <pre className="text-zinc-400 bg-zinc-900/30 p-3 rounded-lg border border-zinc-900 overflow-x-auto whitespace-pre-wrap break-all">
                                    {JSON.stringify(agent.result, null, 2)}
                                </pre>
                            )}
                        </div>
                    ))}
                    {agents.every(a => a.status === 'pending') && (
                        <div className="text-zinc-600 italic text-center mt-20">Waiting for input...</div>
                    )}
                    {agents.some(a => a.status === 'running') && !activeLog && (
                        <div className="text-zinc-500 animate-pulse">{'>'} Awaiting stream data...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface GoalIntakeProps {
    onNavigate: (view: View) => void;
    onPlanGenerated: (plan: Plan) => void;
}

export default function GoalIntake({ onNavigate, onPlanGenerated }: GoalIntakeProps) {
    const { userProfile } = useAuth();
    const [mode, setMode] = useState<'interview' | 'processing' | 'strategy-review'>('interview');
    const [error, setError] = useState<string | null>(null);
    const [agents, setAgents] = useState<AgentStatus[]>(initialAgentStatuses);
    const [researchContext, setResearchContext] = useState<ResearchContext | null>(null);
    const [researchData, setResearchData] = useState<any | null>(null);

    const handleStepComplete = (agentName: string, data: any) => {
        setAgents(prev => prev.map(agent => {
            if (agent.name === agentName) {
                return { ...agent, status: 'complete', result: data };
            }
            // Start next agent logic
            const agentIndex = prev.findIndex(a => a.name === agentName);
            if (agent.name !== agentName && prev.findIndex(a => a.name === agent.name) === agentIndex + 1) {
                return { ...agent, status: 'running' };
            }
            return agent;
        }));
    };

    const handleInterviewComplete = async (context: ResearchContext) => {
        setMode('processing');
        setResearchContext(context);
        setAgents(prev => prev.map(a => a.name === 'Deep Research Agent' ? { ...a, status: 'running' } : a));

        try {
            // 1. Deep Research Agent (Now returns Strategy too)
            // Inject User Tier and Profile into context
            const contextWithExtras = {
                ...context,
                userTier: 'Free' as const,
                userProfile: userProfile || undefined
            };
            const data = await runDeepResearch(contextWithExtras);
            setResearchData(data);
            handleStepComplete('Deep Research Agent', data);

            // Pause for Strategy Review
            setMode('strategy-review');

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Orchestration Failure: ${errorMessage}`);
            setAgents(prev => prev.map(agent => agent.status === 'running' ? { ...agent, status: 'error', message: 'Failed' } : agent));
        }
    };

    const handleStrategyApproved = async () => {
        if (!researchContext || !researchData) return;
        setMode('processing');

        try {
            // 2. Continue Orchestration (Strategist -> Referee)
            // Pass the REAL research data (including the N8n strategy) to the orchestrator
            const finalPlan = await runOrchestration(researchContext.goal, handleStepComplete, researchData);

            // Ensure all agents marked complete
            setAgents(prev => prev.map(agent => ({ ...agent, status: 'complete' })));

            // Transition delay
            setTimeout(() => {
                onPlanGenerated(finalPlan);
            }, 1500);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Orchestration Failure: ${errorMessage}`);
            setAgents(prev => prev.map(agent => agent.status === 'running' ? { ...agent, status: 'error', message: 'Failed' } : agent));
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-black pt-24">
            <Navbar onNavigate={onNavigate} currentView="goal-intake" />

            {/* Background Glow */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-[#5100fd]/10 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 flex flex-1 flex-col items-center w-full px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">

                {mode === 'interview' ? (
                    <div className="w-full animate-fade-in-up">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight mb-4">
                                Let's discuss your <span className="text-[#5100fd]">Goal.</span>
                            </h1>
                            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                                I'll ask a few questions to understand your constraints and preferences.
                            </p>
                        </div>
                        <ChatInterface onComplete={handleInterviewComplete} userProfile={userProfile} />
                    </div>
                ) : mode === 'strategy-review' ? (
                    <div className="w-full animate-fade-in">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-light text-white mb-2">Strategy Proposal</h2>
                            <p className="text-zinc-400">Review the AI-generated strategy before we break it down.</p>
                        </div>

                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {researchData?.initialStrategy ? (
                                <div className="space-y-6">
                                    {researchData.initialStrategy.phases?.map((phase: any, idx: number) => (
                                        <div key={idx} className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                                            <h3 className="text-lg font-medium text-[#5100fd] mb-1">{phase.name}</h3>
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{phase.duration}</div>
                                            <p className="text-zinc-300 text-sm">{phase.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-zinc-500 italic">
                                    No structured strategy returned. Please review the research report below.
                                    <div className="mt-4 p-4 bg-zinc-950 rounded-lg text-xs font-mono text-zinc-400 whitespace-pre-wrap">
                                        {researchData?.report}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setMode('interview')} // Ideally this would go back to a "refine" state, but for now reset or maybe add a chat loop later
                                className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
                            >
                                Reject / Retry
                            </button>
                            <button
                                onClick={handleStrategyApproved}
                                className="px-6 py-3 rounded-xl bg-[#5100fd] hover:bg-[#6610ff] text-white font-medium transition-colors flex items-center gap-2"
                            >
                                <CheckCircleIcon className="w-5 h-5" />
                                Approve Strategy
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center justify-center min-h-[50vh]">
                        <AgentProgress agents={agents} activeLog={null} />
                        {error && (
                            <div className="mt-8 text-center p-4 bg-red-950/30 border border-red-900/50 rounded-lg text-red-400 animate-fade-in max-w-lg">
                                <div className="flex items-center gap-2 justify-center mb-2">
                                    <ErrorCircleIcon className="w-5 h-5" />
                                    <span className="font-bold">System Halted</span>
                                </div>
                                {error}
                                <button onClick={() => setMode('interview')} className="block mx-auto mt-4 text-sm underline text-red-300 hover:text-white">Reset System</button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
