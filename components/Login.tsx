import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Sparkles, ArrowRight, Mail, Lock, Zap, Dumbbell } from 'lucide-react';

interface LoginProps {
    onSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            let result;
            if (isSignUp) {
                result = await supabase.auth.signUp({
                    email,
                    password
                });
            } else {
                result = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
            }

            if (result.error) throw result.error;

            if (isSignUp && result.data.user && !result.data.session) {
                setError('Please check your email for confirmation link.');
                setIsLoading(false);
            } else if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-500 overflow-hidden relative">
            {/* Background Ambience & Shark Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-[120px] animate-pulse-soft" />

                {/* Shark Silhouette */}
                <div className="absolute top-1/3 left-0 w-full animate-swim opacity-10 dark:opacity-20 text-slate-400 dark:text-slate-600">
                    <svg width="400" height="200" viewBox="0 0 200 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(200, 0) scale(-1, 1)">
                            {/* Body */}
                            <path d="M 10 55 Q 50 40, 80 35 L 95 5 Q 105 30, 120 40 Q 160 45, 180 50 L 195 25 Q 190 50, 195 75 L 180 55 Q 140 70, 110 65 L 90 90 L 80 60 Q 50 65, 10 55 Z" />
                            {/* Gills */}
                            <path d="M 60 50 Q 65 55, 60 60 M 65 50 Q 70 55, 65 60 M 70 50 Q 75 55, 70 60" stroke="currentColor" strokeWidth="2" fill="none" />
                            {/* Eye */}
                            <circle cx="35" cy="48" r="2" fill="transparent" stroke="currentColor" strokeWidth="1" />
                        </g>
                    </svg>
                </div>

                {/* Floating Gym Stickers */}
                <div className="absolute top-[15%] left-[10%] opacity-20 animate-float-particle delay-100">
                    <Dumbbell className="w-12 h-12 text-slate-400 dark:text-slate-600" />
                </div>
                <div className="absolute bottom-[20%] right-[10%] opacity-20 animate-float-particle delay-300">
                    <Zap className="w-16 h-16 text-brand-500" />
                </div>
                <div className="absolute top-[20%] right-[20%] opacity-10 animate-float-particle delay-500">
                    <div className="w-8 h-8 rounded-full border-4 border-slate-400" />
                </div>
                <div className="absolute bottom-[25%] left-[20%] opacity-10 animate-float-particle delay-200">
                    <div className="w-12 h-12 rounded-full border-4 border-slate-400 border-dashed" />
                </div>
            </div>

            <div className="relative z-10 w-full max-w-md animate-slide-up">
                <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden ring-1 ring-white/20">
                    {/* Decorative Icon */}
                    <div className="absolute -top-6 -right-6 p-8 opacity-5 -rotate-12 pointer-events-none">
                        <Zap size={140} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col items-center mb-10 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-brand-600 to-slate-900 rounded-3xl flex items-center justify-center shadow-xl shadow-brand-500/20 mb-6 animate-float ring-4 ring-white/10">
                                <Sparkles className="text-white w-10 h-10" />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">
                                Forge<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-500">AI</span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs tracking-widest uppercase">
                                Elite Performance Protocol
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold animate-fade-in flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div className="space-y-2 group">
                                <div className="relative input-focus-ring rounded-xl transition-all">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Agent Identification"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-0 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 rounded-xl font-medium transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <div className="relative input-focus-ring rounded-xl transition-all">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Access Key"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-0 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 rounded-xl font-medium transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-brand-900/20 text-sm font-black text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:pointer-events-none gap-2"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {isSignUp ? 'Initialize Profile' : 'Enter System'} <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                                className="text-xs font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 uppercase tracking-widest transition-colors"
                            >
                                {isSignUp ? 'Already have an ID? Login' : 'New User? Create Protocol ID'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
