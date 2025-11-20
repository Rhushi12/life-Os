
import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { View } from '../types';
import { Button } from './ui/button';
import { CheckCircleIcon } from './icons';

interface FeedbackProps {
    onNavigate: (view: View) => void;
}

export default function Feedback({ onNavigate }: FeedbackProps) {
    const [submitted, setSubmitted] = useState(false);
    const [energy, setEnergy] = useState(7);
    const [focus, setFocus] = useState(6);
    
    const tasks = [
        { id: 1, text: "Finalize Landing Page Copy", completed: true },
        { id: 2, text: "Review Q1 Strategy", completed: false },
        { id: 3, text: "Client Meeting", completed: true },
    ];

    const [taskState, setTaskState] = useState(tasks);

    const toggleTask = (id: number) => {
        setTaskState(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen w-full bg-black pt-24 pb-20">
            <Navbar onNavigate={onNavigate} currentView="feedback" />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl animate-fade-in">
                <div className="mb-10 text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest mb-4 border border-purple-500/20">
                        Daily Reflection
                    </div>
                    <h1 className="text-3xl md:text-4xl font-light text-white mb-4">How was today, <span className="text-[#5100fd]">Builder?</span></h1>
                    <p className="text-zinc-400">Your input helps the Coach Agent optimize tomorrow's schedule.</p>
                </div>

                {!submitted ? (
                    <div className="space-y-8">
                        {/* Task Completion */}
                        <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                            <h2 className="text-lg font-medium text-white mb-4">Task Completion</h2>
                            <div className="space-y-3">
                                {taskState.map(task => (
                                    <div 
                                        key={task.id} 
                                        onClick={() => toggleTask(task.id)}
                                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                                            task.completed 
                                            ? 'bg-[#5100fd]/10 border-[#5100fd]/50' 
                                            : 'bg-black border-zinc-800 hover:border-zinc-700'
                                        }`}
                                    >
                                        <span className={task.completed ? 'text-white line-through opacity-70' : 'text-zinc-300'}>
                                            {task.text}
                                        </span>
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                                            task.completed ? 'bg-[#5100fd] border-[#5100fd]' : 'border-zinc-600'
                                        }`}>
                                            {task.completed && <CheckCircleIcon className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Metrics */}
                        <section className="grid md:grid-cols-2 gap-6">
                            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                                <div className="flex justify-between mb-4">
                                    <label className="text-zinc-300 font-medium">Energy Level</label>
                                    <span className="text-[#5100fd] font-bold">{energy}/10</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="10" 
                                    value={energy} 
                                    onChange={(e) => setEnergy(parseInt(e.target.value))}
                                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#5100fd]" 
                                />
                            </div>
                            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                                <div className="flex justify-between mb-4">
                                    <label className="text-zinc-300 font-medium">Focus Score</label>
                                    <span className="text-[#5100fd] font-bold">{focus}/10</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="10" 
                                    value={focus} 
                                    onChange={(e) => setFocus(parseInt(e.target.value))}
                                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#5100fd]" 
                                />
                            </div>
                        </section>

                        {/* Journal */}
                        <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                            <h2 className="text-lg font-medium text-white mb-4">Observations</h2>
                            <textarea 
                                placeholder="What blocked you today? What went well?"
                                className="w-full h-32 bg-black border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:border-[#5100fd] outline-none transition-all resize-none"
                            />
                        </section>

                        <div className="flex justify-end">
                            <Button onClick={handleSubmit} className="bg-[#5100fd] hover:bg-[#6610ff] text-white px-8 py-6 rounded-xl text-lg">
                                Submit Reflection
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
                        <div className="w-20 h-20 bg-[#5100fd]/10 rounded-full flex items-center justify-center mb-6">
                            <CheckCircleIcon className="w-10 h-10 text-[#5100fd]" />
                        </div>
                        <h2 className="text-2xl text-white font-medium mb-2">Reflection Recorded</h2>
                        <p className="text-zinc-400 text-center max-w-md mb-8">
                            The Coach Agent has analyzed your inputs. Tomorrow's schedule has been adjusted: <br/>
                            <span className="text-white font-medium">Deep work blocks moved to 10:00 AM based on your high energy score.</span>
                        </p>
                        <Button onClick={() => onNavigate('dashboard')} variant="outline" className="border-zinc-800 text-white hover:bg-zinc-800">
                            Return to Mission Control
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
