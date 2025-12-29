import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Target, Shield, Zap, ChevronRight, Clock, Box, Scale, TrendingDown, TrendingUp, Heart } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    goal: '',
    equipment: [],
    level: 'beginner',
    availability: '',
    limitations: '',
    initialWeight: 0,
    targetWeight: 0,
    unit: 'kg'
  });

  const nextStep = () => setStep(s => s + 1);

  const goalOptions = [
    { id: 'Fat Loss', fullId: 'Fat Loss & Conditioning', icon: <TrendingDown className="w-5 h-5" />, color: 'text-rose-500', desc: 'Burn fat & metabolism' },
    { id: 'Muscle', fullId: 'Muscle Hypertrophy', icon: <TrendingUp className="w-5 h-5" />, color: 'text-indigo-500', desc: 'Build size & volume' },
    { id: 'Strength', fullId: 'Raw Strength', icon: <Shield className="w-5 h-5" />, color: 'text-brand-500', desc: 'Max power & CNS' },
    { id: 'Health', fullId: 'General Health & Mobility', icon: <Heart className="w-5 h-5" />, color: 'text-emerald-500', desc: 'Longevity & flow' }
  ];

  const equipmentOptions = [
    { id: 'Bodyweight', icon: '🧘' },
    { id: 'Dumbbells', icon: '💪' },
    { id: 'Kettlebells', icon: '🔔' },
    { id: 'Bands', fullId: 'Resistance Bands', icon: '🎗️' },
    { id: 'Full Gym', icon: '🏋️' },
    { id: 'Pullup Bar', icon: '🏗️' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 relative overflow-hidden flex flex-col max-h-[92vh]">

        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {/* Header */}
        <div className="mb-8 relative z-10 shrink-0">
          <div className="flex gap-2.5 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-700 ${i <= step ? 'bg-brand-600' : 'bg-slate-100 dark:bg-slate-800'}`} />
            ))}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {step === 1 && "What's your main goal?"}
            {step === 2 && "Available equipment?"}
            {step === 3 && "Experience level?"}
            {step === 4 && "Final details"}
          </h2>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mt-2">Step {step} of 4</p>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto mb-6 pr-2 -mr-2 scrollbar-hide">
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {goalOptions.map(g => (
                <button
                  key={g.id}
                  onClick={() => { setProfile({ ...profile, goal: g.fullId }); nextStep(); }}
                  className={`p-6 rounded-2xl text-left transition-all border relative overflow-hidden group hover:scale-[1.02] active:scale-95 ${profile.goal === g.fullId ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-500 ring-1 ring-brand-500' : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-600'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${profile.goal === g.fullId ? 'bg-brand-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-500'} transition-colors shadow-sm`}>
                    {g.icon}
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">{g.id}</h4>
                  <p className="text-xs font-medium text-slate-500 leading-snug">{g.desc}</p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {equipmentOptions.map(e => {
                  const val = e.fullId || e.id;
                  const isSelected = profile.equipment.includes(val);
                  return (
                    <button
                      key={e.id}
                      onClick={() => {
                        const newEq = isSelected ? profile.equipment.filter(x => x !== val) : [...profile.equipment, val];
                        setProfile({ ...profile, equipment: newEq });
                      }}
                      className={`p-4 rounded-xl flex flex-col items-center gap-3 transition-all border text-center ${isSelected ? 'bg-brand-500 text-white border-brand-600 shadow-lg shadow-brand-500/20' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                    >
                      <span className="text-2xl">{e.icon}</span>
                      <span className={`text-xs font-bold uppercase tracking-wide ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>{e.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {(['beginner', 'intermediate', 'advanced'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => { setProfile({ ...profile, level: l }); nextStep(); }}
                  className="w-full p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-slate-900 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-2 h-12 rounded-full ${l === 'beginner' ? 'bg-emerald-400' : l === 'intermediate' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                    <div className="text-left">
                      <span className="text-base font-bold uppercase tracking-wide text-slate-900 dark:text-white block mb-1">{l}</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {l === 'beginner' ? 'New to consistent training' : l === 'intermediate' ? 'Training regularly for 6mo+' : 'Years of dedicated training'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Current</label>
                  <div className="relative group">
                    <input
                      type="number"
                      className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-brand-500 outline-none text-2xl font-bold text-slate-900 dark:text-white transition-all pl-5"
                      placeholder="0"
                      onChange={(e) => setProfile({ ...profile, initialWeight: Number(e.target.value) })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{profile.unit}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-500 uppercase tracking-widest pl-1">Target</label>
                  <div className="relative group">
                    <input
                      type="number"
                      className="w-full p-4 bg-brand-50/50 dark:bg-slate-950 rounded-2xl border border-brand-200 dark:border-brand-900/30 focus:border-brand-500 outline-none text-2xl font-bold text-brand-700 dark:text-brand-400 transition-all pl-5"
                      placeholder="0"
                      onChange={(e) => setProfile({ ...profile, targetWeight: Number(e.target.value) })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-400">{profile.unit}</span>
                  </div>
                </div>
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
                {(['kg', 'lbs'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setProfile({ ...profile, unit: u })}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${profile.unit === u ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Availability <Clock size={12} />
                </div>
                <input
                  type="text"
                  className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-brand-500 outline-none text-base font-medium text-slate-900 dark:text-white"
                  placeholder="e.g. 3 days/week, 45 mins"
                  onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer/Actions */}
        <div className="shrink-0 pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
          {step === 2 && (
            <button
              onClick={nextStep}
              disabled={profile.equipment.length === 0}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue <ChevronRight size={16} />
            </button>
          )}

          {step === 4 && (
            <button
              onClick={() => onComplete(profile)}
              disabled={!profile.initialWeight || !profile.targetWeight}
              className="w-full py-5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap size={18} fill="currentColor" /> Generate Program
            </button>
          )}
        </div>
      </div>
    </div>
  );
};