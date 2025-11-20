
import React, { useState } from 'react';
import { Plan } from '../types';
import { Navbar } from './Navbar';
import { View } from '../types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

interface GoalDetailProps {
    plan: Plan;
    onNavigate: (view: View) => void;
}

export default function GoalDetail({ plan, onNavigate }: GoalDetailProps) {
    const [activeTab, setActiveTab] = useState("roadmap");

    return (
        <div className="min-h-screen w-full bg-black pt-24 pb-20">
             <Navbar onNavigate={onNavigate} currentView="goal-detail" />

             <main className="container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-zinc-800 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="px-2 py-0.5 rounded bg-[#5100fd]/20 text-[#5100fd] text-xs font-bold uppercase tracking-wider border border-[#5100fd]/20">Active Plan</span>
                             <span className="text-zinc-500 text-xs">Generated today</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-light text-white max-w-3xl leading-tight">{plan.goalTitle}</h1>
                    </div>
                    <div className="flex gap-8">
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">{plan.feasibilityScore}<span className="text-lg text-[#5100fd]">%</span></div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Feasibility</div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">{plan.totalEstimatedHours}<span className="text-lg text-[#5100fd]">h</span></div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Total Effort</div>
                        </div>
                    </div>
                </div>

                {/* Realism Assessment Card */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 mb-12 backdrop-blur-sm">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Referee Assessment</h3>
                    <p className="text-zinc-300 leading-relaxed">{plan.realismAssessment}</p>
                </div>

                <Tabs defaultValue="roadmap" className="w-full">
                    <div className="mb-8">
                         <TabsList className="bg-zinc-900 border border-zinc-800">
                            <TabsTrigger value="roadmap">Strategic Roadmap</TabsTrigger>
                            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                         </TabsList>
                    </div>

                    <TabsContent value="roadmap">
                        <div className="space-y-6 relative">
                             {/* Vertical Line */}
                            <div className="absolute left-8 top-8 bottom-8 w-px bg-zinc-800 hidden md:block" />

                            {plan.milestones.map((milestone, index) => (
                                <div key={milestone.id} className="relative pl-0 md:pl-24 group">
                                    
                                    {/* Number Indicator */}
                                    <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 items-center justify-center font-mono text-xl text-zinc-500 z-10 group-hover:border-[#5100fd] group-hover:text-[#5100fd] transition-colors">
                                        0{index + 1}
                                    </div>

                                    <div className="p-8 bg-zinc-950 border border-zinc-800 rounded-2xl hover:bg-zinc-900/30 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                                            <h3 className="text-xl font-medium text-white">{milestone.title}</h3>
                                            <span className="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-1 rounded bg-black">~{milestone.estimatedHours}h effort</span>
                                        </div>
                                        
                                        <div className="mb-6">
                                            <div className="text-sm text-[#5100fd] font-medium mb-1">Success Metric (KPI)</div>
                                            <p className="text-zinc-400 text-sm">{milestone.kpi}</p>
                                        </div>

                                        <div className="space-y-3">
                                            {milestone.tasks.map((task) => (
                                                <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                                                    <div className="mt-1 w-4 h-4 rounded-full border border-zinc-600 shrink-0" />
                                                    <div>
                                                        <div className="text-sm text-zinc-200 font-medium">{task.title}</div>
                                                        <div className="text-xs text-zinc-500 mt-0.5">{task.description} • {task.durationMinutes}m</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="calendar">
                        <div className="w-full h-[600px] bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center flex-col p-8">
                            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl text-white font-light mb-2">Planner Agent View</h3>
                            <p className="text-zinc-500 text-center max-w-md">
                                In a full version, this view would allow you to drag and drop generated tasks into your actual weekly schedule, syncing with Google Calendar.
                            </p>
                            <button className="mt-6 px-6 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-full text-sm text-white transition-colors">
                                Sync Calendar (Demo)
                            </button>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-12 flex justify-center gap-4">
                    <button 
                        onClick={() => onNavigate('dashboard')}
                        className="px-6 py-3 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Save for Later
                    </button>
                    <button className="px-8 py-3 rounded-full bg-[#5100fd] hover:bg-[#6610ff] text-white font-medium shadow-[0_0_30px_-10px_rgba(81,0,253,0.5)] transition-all hover:scale-105">
                        Activate Plan
                    </button>
                </div>

             </main>
        </div>
    );
}
