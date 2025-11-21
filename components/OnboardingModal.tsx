import React, { useState } from 'react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

export default function OnboardingModal() {
    const { updateUserProfile } = useAuth();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [occupation, setOccupation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !age || !occupation) return;

        setLoading(true);
        try {
            await updateUserProfile({
                displayName: name,
                age,
                occupation,
                onboardingCompleted: true
            });
        } catch (error) {
            console.error("Failed to save profile", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
                {/* Background Ambient */}
                <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-purple-900/20 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                    <h2 className="text-2xl font-semibold text-white mb-2">Welcome to Life-OS</h2>
                    <p className="text-zinc-400 text-sm mb-6">
                        To help our AI agents serve you better, please tell us a bit about yourself.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">What should we call you?</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Alex"
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:border-[#5100fd] focus:ring-0 outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">How old are you?</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="e.g. 25"
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:border-[#5100fd] focus:ring-0 outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">What do you do?</label>
                            <input
                                type="text"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                placeholder="e.g. Student, Software Engineer, Designer"
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:border-[#5100fd] focus:ring-0 outline-none transition-all"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#5100fd] hover:bg-[#6610ff] text-white h-12 rounded-xl font-medium mt-4"
                        >
                            {loading ? 'Saving...' : 'Complete Setup'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
