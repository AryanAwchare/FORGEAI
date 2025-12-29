import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Sparkles, ArrowRight, Mail, Lock, Zap } from 'lucide-react';

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
        <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-500 overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[100px] animate-pulse-soft pointer-events-none" />

            <div className="relative z-10 w-full max-w-md animate-slide-up">
                <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    {/* Decorative Icon */}
                    <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 pointer-events-none">
                        <Zap size={120} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col items-center mb-10 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 mb-6 animate-float">
                                <Sparkles className="text-white w-8 h-8" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">
                                Forge<span className="text-brand-600 dark:text-brand-400">AI</span> Access
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                                Enter the neural fitness optimization protocol.
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
                                        placeholder="User Identification"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border-0 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 rounded-xl font-medium transition-colors"
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
                                        placeholder="Access Code"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border-0 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 rounded-xl font-medium transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-brand-900/20 text-sm font-black text-white bg-brand-600 hover:bg-brand-500 dark:hover:bg-brand-500 uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:pointer-events-none gap-2"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {isSignUp ? 'Initialize Profile' : 'Access System'} <ArrowRight className="w-4 h-4" />
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
