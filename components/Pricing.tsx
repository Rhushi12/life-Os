
import React from 'react';
import { Button } from './ui/button';
import { CheckCircle } from 'lucide-react';
import { Navbar } from './Navbar';
import { View } from '../types';

export default function Pricing({ onNavigate }: { onNavigate: (view: View) => void }) {
    const plans = [
        {
            name: 'Starter',
            price: 'Free',
            description: 'For individuals exploring autonomous planning.',
            features: ['1 Active Goal', 'Basic Strategy Generation', 'Daily Task Breakdown', 'Community Support'],
            cta: 'Start Free',
            highlight: false
        },
        {
            name: 'Pro',
            price: '$19',
            period: '/mo',
            description: 'Full autonomous agent swarm for serious achievers.',
            features: ['Unlimited Active Goals', 'Advanced Market Research', 'Calendar Integration (GCal)', 'Daily Adaptive Replanning', 'Priority Support'],
            cta: 'Get Pro',
            highlight: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            description: 'For teams and organizations.',
            features: ['Team Goal Alignment', 'API Access', 'Dedicated Success Manager', 'SSO & Advanced Security', 'Custom Agent Training'],
            cta: 'Contact Sales',
            highlight: false
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
             <Navbar onNavigate={onNavigate} currentView="pricing" />
             
            {/* Background Lines */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 L100 0" stroke="url(#grad1)" strokeWidth="0.5" />
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#5100fd" stopOpacity="0" />
                            <stop offset="50%" stopColor="#5100fd" />
                            <stop offset="100%" stopColor="#5100fd" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-6xl font-light mb-6">Invest in your <span className="text-[#5100fd]">Future Self</span></h1>
                    <p className="text-xl text-zinc-400">Choose the plan that fits your ambition level. Upgrade, downgrade, or cancel anytime.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div 
                            key={idx} 
                            className={`relative p-8 rounded-3xl border flex flex-col ${
                                plan.highlight 
                                ? 'bg-zinc-900/40 border-[#5100fd] shadow-[0_0_50px_-20px_rgba(81,0,253,0.3)]' 
                                : 'bg-zinc-950/40 border-zinc-800'
                            } backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02]`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5100fd] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-zinc-300 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    {plan.period && <span className="text-zinc-500">{plan.period}</span>}
                                </div>
                                <p className="text-sm text-zinc-500 mt-4">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-[#5100fd] shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Button 
                                onClick={() => onNavigate('auth')}
                                className={`w-full py-6 rounded-xl font-medium ${
                                    plan.highlight 
                                    ? 'bg-[#5100fd] hover:bg-[#6610ff] text-white' 
                                    : 'bg-white text-black hover:bg-zinc-200'
                                }`}
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
