import React from 'react';
import { useAuth } from './AuthContext';
import { LogOut, User as UserIcon, Settings, Award, TrendingUp, Calendar, Mail, Target } from 'lucide-react';

interface ProfileProps {
    onEditProfile?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onEditProfile }) => {
    const { user, profile, signOut } = useAuth();

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to decouple from the ForgeAI system?')) {
            await signOut();
        }
    };

    const username = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Forge User';
    const email = user?.email || 'No email linked';
    const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown';

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800/60 pb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">Agent Identity</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Manage your neural profile and system access.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 dark:opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <UserIcon size={200} />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-brand-500/30 ring-4 ring-white dark:ring-slate-900">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-center md:text-left space-y-2 flex-1">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{username}</h2>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm">
                                    <Mail className="w-4 h-4" /> {email}
                                </div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold uppercase tracking-widest mt-2 border border-brand-500/20">
                                    <Award className="w-3 h-3" /> Level: {profile?.level || 'Initiate'}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 text-center">
                                <span className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Current Weight</span>
                                <span className="text-xl font-black text-brand-600 dark:text-brand-400">{profile?.current_weight || '--'} <span className="text-xs text-slate-400">{profile?.unit || 'kg'}</span></span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 text-center">
                                <span className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Initial</span>
                                <span className="text-xl font-black text-slate-900 dark:text-white">{profile?.initial_weight || '--'} <span className="text-xs text-slate-400">{profile?.unit || 'kg'}</span></span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 text-center">
                                <span className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Target</span>
                                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{profile?.target_weight || '--'} <span className="text-xs text-slate-400">{profile?.unit || 'kg'}</span></span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 text-center">
                                <span className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Goal</span>
                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{profile?.goal?.split(' ')[0] || 'Not Set'}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 text-center">
                                <span className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Joined</span>
                                <span className="text-xs font-black text-slate-900 dark:text-white">{joinDate}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 text-center">
                                <span className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Status</span>
                                <span className="text-xs font-black text-emerald-500">Active</span>
                            </div>
                        </div>

                        {/* Additional Fitness Info */}
                        <div className="mt-6 space-y-3">
                            {profile?.equipment && profile.equipment.length > 0 && (
                                <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                    <span className="block text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-2">Equipment</span>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.equipment.map((eq: string, idx: number) => (
                                            <span key={idx} className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                                {eq}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {profile?.availability && (
                                <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                    <span className="block text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Availability</span>
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{profile.availability}</span>
                                </div>
                            )}
                            {profile?.limitations && (
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30">
                                    <span className="block text-[9px] uppercase font-black text-amber-600 dark:text-amber-500 tracking-widest mb-1">Limitations</span>
                                    <span className="text-xs font-medium text-amber-700 dark:text-amber-400">{profile.limitations}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                                <Settings className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">System Configuration</h3>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={onEditProfile}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-2xl transition-colors group border border-slate-200 dark:border-slate-800/50 hover:border-brand-500/30">
                                <div className="flex items-center gap-4">
                                    <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                                    <span className="font-bold text-slate-700 dark:text-slate-300">Update Fitness Goals</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions Column */}
                <div className="space-y-6">
                    <div className="bg-brand-500/5 dark:bg-slate-900/40 border border-brand-500/10 dark:border-slate-800 p-8 rounded-[2.5rem] h-full flex flex-col justify-center items-center text-center space-y-6">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Access</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Securely decouple your biometric feed from the ForgeAI neural network. All session data will be encrypted and stored.
                        </p>

                        {onEditProfile && (
                            <button
                                onClick={onEditProfile}
                                className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                <Target className="w-5 h-5" /> Edit Preferences
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className="w-full py-4 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-colors border border-red-200 dark:border-red-500/20"
                        >
                            <LogOut className="w-5 h-5" /> Terminate Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
