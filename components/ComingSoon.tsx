import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Check, Loader2, ChevronDown, Brain, Zap, BarChart3 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LogoIcon } from './icons';

const ComingSoon: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0.2, 0.8], [1, 0]);
    const scale = useTransform(scrollYProgress, [0.2, 0.8], [1, 0.95]);

    useEffect(() => {
        document.title = "Life OS - Coming Soon";
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError('');

        try {
            await addDoc(collection(db, 'waiting_list'), {
                email,
                timestamp: serverTimestamp(),
                source: 'coming_soon_page'
            });
            setSubmitted(true);
            setEmail('');
        } catch (err) {
            console.error('Error adding document: ', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: Brain,
            title: "Autonomous Intelligence",
            description: "Agents that research, plan, and adapt your schedule while you sleep."
        },
        {
            icon: Zap,
            title: "Adaptive Execution",
            description: "A dynamic system that evolves with your real-time progress and energy levels."
        },
        {
            icon: BarChart3,
            title: "Deep Insights",
            description: "Data-driven analytics that reveal the hidden patterns of your productivity."
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-purple-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '5s' }} />
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px]" />

                {/* Foggy Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-0" />
                <div className="absolute bottom-0 left-0 right-0 h-[60vh] bg-gradient-to-t from-[#5100fd]/10 via-purple-900/5 to-transparent blur-[100px]" />

                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
            </div>

            {/* Hero Section */}
            <motion.div
                style={{ opacity, scale }}
                className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
            >
                <div className="flex flex-col items-center justify-center gap-6 mb-10 md:mb-12">
                    <div className="relative group cursor-default">
                        <div className="absolute -inset-4 bg-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <LogoIcon className="w-16 h-16 md:w-20 md:h-20 text-[#5100fd] relative z-10 drop-shadow-[0_0_15px_rgba(81,0,253,0.5)]" />
                    </div>
                    <span className="text-sm md:text-base font-medium tracking-[0.3em] text-white/50 uppercase">Life OS</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 leading-[1.1] mb-6 md:mb-8 px-4 text-center">
                    Your Life, <br />
                    <span className="bg-gradient-to-r from-[#5100fd] to-purple-400 bg-clip-text text-transparent">Engineered.</span>
                </h1>

                <p className="text-base md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light mb-10 md:mb-14 px-6 text-center">
                    The world's first autonomous life operating system.
                    Experience the future of achievement before anyone else.
                </p>

                {/* Countdown Timer */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-12 w-full max-w-3xl px-4">
                    {[
                        { label: 'Days', value: timeLeft.days },
                        { label: 'Hours', value: timeLeft.hours },
                        { label: 'Minutes', value: timeLeft.minutes },
                        { label: 'Seconds', value: timeLeft.seconds }
                    ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl ring-1 ring-white/5 hover:bg-white/10 transition-colors duration-300">
                            <span className="text-2xl md:text-5xl font-bold font-mono text-white tracking-tight tabular-nums">
                                {String(item.value).padStart(2, '0')}
                            </span>
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 mt-2 font-medium">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Notify Form */}
                <div className="max-w-md mx-auto w-full relative group px-4 mb-24">
                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center justify-center gap-3 text-green-400"
                        >
                            <Check className="w-5 h-5" />
                            <span className="font-medium">You're on the list! We'll be in touch.</span>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="relative w-full">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5100fd] to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                            <div className="relative flex flex-col sm:flex-row items-center bg-black rounded-xl p-1.5 border border-white/10 shadow-2xl gap-2 sm:gap-0">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email for early access"
                                    required
                                    className="w-full sm:flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-zinc-600 text-base text-center sm:text-left"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            Notify Me <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                            {error && <p className="text-red-400 text-sm mt-3 absolute -bottom-8 left-0 w-full text-center sm:text-left">{error}</p>}
                        </form>
                    )}
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500 flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    <span className="text-xs tracking-[0.2em] uppercase">Explore</span>
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </motion.div>

            {/* Vision Section */}
            <div className="relative z-10 bg-black min-h-screen flex items-center py-24 px-4 md:px-8">
                <div className="max-w-6xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Beyond Traditional Planning</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                            We are building a system that understands you better than you understand yourself.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="bg-zinc-900/30 border border-white/5 p-8 rounded-3xl backdrop-blur-sm hover:bg-zinc-900/50 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-[#5100fd]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-6 h-6 text-[#5100fd]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="mt-32 text-center"
                    >
                        <p className="text-sm text-zinc-600 font-medium tracking-[0.2em]">
                            LAUNCHING DECEMBER 31ST, 2025
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
