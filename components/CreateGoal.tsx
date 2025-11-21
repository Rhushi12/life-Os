import React from 'react';
import { View } from '../types';
import { Navbar } from './Navbar';

interface CreateGoalProps {
    onNavigate: (view: View) => void;
}

export default function CreateGoal({ onNavigate }: CreateGoalProps) {
    return (
        <div className="min-h-screen w-full flex flex-col bg-black text-white">
            <Navbar onNavigate={onNavigate} currentView="landing" />

            <div className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5100fd]/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />

                <div className="relative z-10 max-w-2xl text-center">
                    <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-6 animate-fade-in-up">
                        Welcome to <span className="text-[#5100fd]">LifeOS.</span>
                    </h1>

                    <p className="text-xl text-zinc-400 mb-12 leading-relaxed max-w-lg mx-auto animate-fade-in-up animation-delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
                        Your autonomous journey begins with a single goal. Let's define what you want to achieve.
                    </p>

                    <button
                        onClick={() => onNavigate('goal-intake')}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-lg font-medium hover:bg-zinc-200 transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-400 opacity-0"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <span>Create New Goal</span>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>

                    <div className="mt-16 grid grid-cols-3 gap-8 text-center border-t border-zinc-900 pt-8 animate-fade-in-up animation-delay-400 opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <div>
                            <div className="text-2xl font-light text-white mb-1">AI</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Powered</div>
                        </div>
                        <div>
                            <div className="text-2xl font-light text-white mb-1">Auto</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Planning</div>
                        </div>
                        <div>
                            <div className="text-2xl font-light text-white mb-1">Live</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Execution</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
