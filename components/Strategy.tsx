
import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { View, Plan } from '../types';
import { Button } from './ui/button';
import { BarChart3, Clock, Zap } from 'lucide-react';

interface StrategyProps {
    onNavigate: (view: View) => void;
    plan?: Plan | null;
}

export default function Strategy({ onNavigate, plan }: StrategyProps) {
    const [milestones, setMilestones] = useState<any[]>([]);

    useEffect(() => {
        if (plan) {
            setMilestones(plan.milestones.map(m => ({
                id: m.id,
                title: m.title,
                hours: m.estimatedHours,
                feasibility: 90 // Mock feasibility per milestone for now
            })));
        }
    }, [plan]);

    const [simulating, setSimulating] = useState(false);

    const adjustHours = (id: number, delta: number) => {
        setMilestones(prev => prev.map(m => m.id === id ? { ...m, hours: Math.max(0, m.hours + delta) } : m));
    };

    const runSimulation = () => {
        setSimulating(true);
        setTimeout(() => {
            setSimulating(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full bg-black pt-24 pb-20">
            <Navbar onNavigate={onNavigate} currentView="strategy" />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl animate-fade-in">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-light text-white mb-2">Strategy Lab</h1>
                        <p className="text-zinc-400">Fine-tune your milestones. The Strategist Agent will recalculate feasibility.</p>
                    </div>
                    <Button
                        onClick={runSimulation}
                        className="bg-white text-black hover:bg-zinc-200 gap-2"
                        disabled={simulating}
                    >
                        {simulating ? <Zap className="w-4 h-4 animate-pulse" /> : <Zap className="w-4 h-4 text-[#5100fd]" />}
                        {simulating ? "Simulating..." : "Run Simulation"}
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {milestones.map((m, idx) => (
                            <div key={m.id} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-mono text-zinc-400">
                                            0{idx + 1}
                                        </div>
                                        <h3 className="text-xl text-white font-medium">{m.title}</h3>
                                    </div>
                                    <div className={`text-sm font-bold ${m.feasibility > 90 ? 'text-green-500' : m.feasibility > 80 ? 'text-yellow-500' : 'text-red-500'}`}>
                                        {m.feasibility}% Feasible
                                    </div>
                                </div>

                                <div className="bg-black rounded-xl p-4 flex items-center justify-between border border-zinc-800/50">
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm">Allocated Effort</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => adjustHours(m.id, -5)} className="w-8 h-8 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 flex items-center justify-center">-</button>
                                        <span className="text-white font-mono w-12 text-center">{m.hours}h</span>
                                        <button onClick={() => adjustHours(m.id, 5)} className="w-8 h-8 rounded bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center">+</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Simulation Results */}
                    <div className="lg:col-span-1">
                        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sticky top-28">
                            <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-[#5100fd]" />
                                Impact Analysis
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-zinc-400">Total Project Effort</span>
                                        <span className="text-white font-mono">{milestones.reduce((acc, m) => acc + m.hours, 0)}h</span>
                                    </div>
                                    <div className="w-full bg-zinc-900 rounded-full h-1.5">
                                        <div className="bg-zinc-600 h-1.5 rounded-full" style={{ width: '60%' }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-zinc-400">Estimated Completion</span>
                                        <span className="text-white font-mono">4.2 Weeks</span>
                                    </div>
                                    <div className="w-full bg-zinc-900 rounded-full h-1.5">
                                        <div className="bg-[#5100fd] h-1.5 rounded-full" style={{ width: '75%' }} />
                                    </div>
                                </div>

                                <div className="p-4 bg-[#5100fd]/5 border border-[#5100fd]/20 rounded-xl">
                                    <h4 className="text-[#5100fd] text-sm font-bold mb-1">Strategist Note</h4>
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        Increasing "MVP Development" hours by 10% significantly drops risk, but pushes the timeline by 3 days. Acceptable trade-off.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
