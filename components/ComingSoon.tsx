import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, ArrowRight, Sparkles } from 'lucide-react';

const ComingSoon: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const launchDate = new Date('2025-12-31T00:00:00');
            const now = new Date();
            const difference = launchDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 text-center max-w-3xl mx-auto space-y-8"
            >
                {/* Logo/Brand Area */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    <span className="text-xl font-medium tracking-wider text-white/80">LIFE OS</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                    Architect Your <br />
                    <span className="text-white">Future Self</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    The ultimate autonomous goal planner is currently in private beta.
                    We are crafting an experience that will redefine how you achieve your ambitions.
                </p>

                {/* Countdown Timer */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 py-8">
                    {[
                        { label: 'Days', value: timeLeft.days },
                        { label: 'Hours', value: timeLeft.hours },
                        { label: 'Minutes', value: timeLeft.minutes },
                        { label: 'Seconds', value: timeLeft.seconds }
                    ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="text-3xl md:text-4xl font-bold font-mono text-white">
                                {String(item.value).padStart(2, '0')}
                            </span>
                            <span className="text-xs uppercase tracking-widest text-gray-500 mt-2">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Notify Form */}
                <div className="max-w-md mx-auto w-full relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative flex items-center bg-black rounded-lg p-1 border border-white/10">
                        <input
                            type="email"
                            placeholder="Enter your email for early access"
                            className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-gray-600"
                        />
                        <button className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                            Notify Me <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="pt-12 text-sm text-gray-600">
                    <p>Launching December 31st, 2025</p>
                </div>
            </motion.div>
        </div>
    );
};

export default ComingSoon;
