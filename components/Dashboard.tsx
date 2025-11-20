
import React from 'react';
import { Navbar } from './Navbar';
import { View } from '../types';
import { CheckCircleIcon } from './icons';

interface DashboardProps {
    onNavigate: (view: View) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    // Mock Data for the dashboard
    const activeGoals = [
        { id: 1, title: "Launch SaaS Product", progress: 65, nextTask: "Finalize Landing Page Copy", due: "2:00 PM" },
        { id: 2, title: "Marathon Training", progress: 30, nextTask: "10k Run - Zone 2", due: "6:00 PM" }
    ];

    const timeline = [
        { time: "09:00 AM", task: "Review Q1 Strategy", goal: "Career Growth", status: "completed" },
        { time: "11:00 AM", task: "Finalize Landing Page Copy", goal: "Launch SaaS Product", status: "current" },
        { time: "02:00 PM", task: "Client Meeting", goal: "Career Growth", status: "upcoming" },
        { time: "06:00 PM", task: "10k Run - Zone 2", goal: "Marathon Training", status: "upcoming" },
    ];

    return (
        <div className="min-h-screen w-full bg-black pt-24 pb-20">
            <Navbar onNavigate={onNavigate} currentView="dashboard" />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl animate-fade-in">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="text-zinc-500 text-sm mb-1 uppercase tracking-wider">{dateStr}</div>
                        <h1 className="text-3xl md:text-5xl font-light text-white">Good afternoon, <span className="text-[#5100fd]">Builder.</span></h1>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Active Goals */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-lg font-medium text-zinc-300 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#5100fd]" />
                                Active Goals
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {activeGoals.map(goal => (
                                    <div key={goal.id} className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl hover:border-[#5100fd]/50 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white group-hover:bg-[#5100fd] transition-colors">
                                                {goal.progress}%
                                            </div>
                                            <div className="text-xs text-zinc-500 bg-black px-2 py-1 rounded border border-zinc-800">On Track</div>
                                        </div>
                                        <h3 className="text-xl font-medium text-white mb-1">{goal.title}</h3>
                                        <p className="text-sm text-zinc-400 mb-4">Next: {goal.nextTask}</p>
                                        <div className="w-full bg-zinc-900 rounded-full h-1">
                                            <div className="bg-[#5100fd] h-1 rounded-full" style={{ width: `${goal.progress}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                             <h2 className="text-lg font-medium text-zinc-300 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                Recent Insights
                            </h2>
                            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Productivity Trend Detected</h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        You consistently complete "Deep Work" blocks 15% faster in the morning. The Strategist Agent suggests moving your "SaaS Coding" blocks to 9:00 AM starting next week.
                                    </p>
                                    <div className="mt-4 flex gap-3">
                                        <button className="text-xs bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-1.5 rounded border border-zinc-700 transition-colors">Apply Change</button>
                                        <button className="text-xs text-zinc-500 hover:text-white px-3 py-1.5">Dismiss</button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Today's Plan */}
                    <div className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm h-fit sticky top-28">
                        <h2 className="text-xl font-light text-white mb-6">Today's Schedule</h2>
                        <div className="space-y-0 relative">
                            <div className="absolute top-2 bottom-2 left-[65px] w-px bg-zinc-800" />
                            
                            {timeline.map((item, idx) => (
                                <div key={idx} className={`relative flex gap-4 py-4 ${item.status === 'completed' ? 'opacity-50' : 'opacity-100'}`}>
                                    <div className="w-14 text-right text-xs text-zinc-500 font-mono pt-1">{item.time}</div>
                                    
                                    <div className={`relative z-10 w-3 h-3 rounded-full mt-1.5 border-2 ${
                                        item.status === 'current' ? 'bg-[#5100fd] border-[#5100fd] shadow-[0_0_10px_rgba(81,0,253,0.5)]' : 
                                        item.status === 'completed' ? 'bg-zinc-800 border-zinc-800' : 'bg-black border-zinc-600'
                                    }`} />
                                    
                                    <div className="flex-1">
                                        <div className={`text-sm font-medium ${item.status === 'current' ? 'text-white' : 'text-zinc-300'}`}>
                                            {item.task}
                                        </div>
                                        <div className="text-xs text-zinc-500">{item.goal}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
