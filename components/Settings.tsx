import React from 'react';
import { Navbar } from './Navbar';
import { View } from '../types';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface SettingsProps {
    onNavigate: (view: View) => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            onNavigate('landing');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black pt-24 pb-20">
            <Navbar onNavigate={onNavigate} currentView="settings" />

            <main className="container mx-auto px-4 max-w-2xl animate-fade-in">
                <h1 className="text-3xl font-light text-white mb-8">Settings</h1>

                <div className="space-y-8">

                    {/* Profile */}
                    <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
                        <h2 className="text-lg font-medium text-white mb-6">Profile & Account</h2>
                        <div className="flex items-center gap-6 mb-6">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full border border-zinc-700" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-400">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                            <div>
                                <div className="text-white font-medium">{user?.displayName || 'User'}</div>
                                <div className="text-zinc-500 text-sm">{user?.email}</div>
                            </div>
                        </div>
                        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white">Manage Subscription</Button>
                    </section>

                    {/* Integrations */}
                    <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
                        <h2 className="text-lg font-medium text-white mb-6">Integrations</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">Google Account</div>
                                        <div className="text-zinc-500 text-xs">Connected via Firebase</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-zinc-400">Active</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Data */}
                    <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
                        <h2 className="text-lg font-medium text-white mb-6">Data & Privacy</h2>
                        <div className="flex justify-between items-center">
                            <p className="text-zinc-500 text-sm max-w-xs">Export all your goals, plans, and reflection journals.</p>
                            <Button variant="outline" className="border-zinc-700 text-zinc-300">Export Data</Button>
                        </div>
                    </section>

                    <div className="text-center pt-8">
                        <button onClick={handleLogout} className="text-red-500 hover:text-red-400 text-sm transition-colors">Sign Out</button>
                    </div>
                </div>
            </main>
        </div>
    );
}
