import React, { useState } from 'react';
import { AppState } from '../types';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Brain, Play, ChevronRight, Sparkles, Award, Dumbbell, Zap, Target, TrendingUp, History, Calendar, Scale, ChevronLeft, Plus, Info, ExternalLink } from 'lucide-react';

interface DashboardProps {
  state: AppState;
  onStartWorkout: () => void;
  onRequestNext: () => void;
  onUpdateWeight: (w: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, onStartWorkout, onRequestNext, onUpdateWeight }) => {
  const [isUpdatingWeight, setIsUpdatingWeight] = useState(false);
  const [weightInput, setWeightInput] = useState(state.currentWeight.toString());

  const chartData = state.history.length > 0
    ? state.history.slice(0, 10).reverse().map((h, i) => ({
      name: `S${i + 1}`,
      val: h.difficulty
    }))
    : [{ name: 'S0', val: 0 }];

  const now = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      const dateStr = new Date(now.getFullYear(), now.getMonth(), dayNumber).toISOString().split('T')[0];
      const sessions = state.history.filter(h => h.date.startsWith(dateStr));
      return { day: dayNumber, sessions, active: true };
    }
    return { day: null, sessions: [], active: false };
  });

  const weightProgress = state.profile
    ? Math.min(100, Math.max(0,
      ((state.currentWeight - state.profile.initialWeight) / (state.profile.targetWeight - state.profile.initialWeight)) * 100
    ))
    : 0;

  const weightDelta = state.profile ? (state.currentWeight - state.profile.initialWeight).toFixed(1) : "0";
  const remainingToGoal = state.profile ? (state.profile.targetWeight - state.currentWeight).toFixed(1) : "0";

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800/60 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase rounded border border-brand-500/20">Agent Online</span>
            <span className="text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest">• Biometrics Synced</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">System Overview</h1>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl flex items-center gap-4 px-6 shadow-sm">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Phase</p>
            <p className="text-sm font-black text-brand-600 dark:text-brand-400">{state.globalPhase}</p>
          </div>
          <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-800" />
          <div className="text-right">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Consistency</p>
            <p className="text-sm font-black text-slate-900 dark:text-white">{state.globalConsistency}%</p>
          </div>
        </div>
      </header>

      {/* Mission Journey Matrix (Weights Focus) */}
      <section className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 relative overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 text-slate-900 dark:text-white">
          <Scale size={100} />
        </div>
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-brand-600 rounded-2xl shadow-lg shadow-brand-900/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Mission Journey Matrix</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Initial Benchmark</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-700 dark:text-slate-300 italic tracking-tighter">{state.profile?.initialWeight}</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase">{state.profile?.unit}</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold mt-2 uppercase">Start State</p>
          </div>

          <div className="bg-brand-500/5 dark:bg-brand-500/10 p-6 rounded-3xl border border-brand-500/20 dark:border-brand-500/30 flex flex-col justify-between relative group">
            <button
              onClick={() => setIsUpdatingWeight(!isUpdatingWeight)}
              className="absolute top-4 right-4 p-1.5 bg-brand-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </button>
            <p className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-4">Current Real-Time</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter">{state.currentWeight}</span>
              <span className="text-xs font-bold text-brand-500 uppercase">{state.profile?.unit}</span>
            </div>
            <div className={`text-[10px] font-black mt-2 uppercase ${Number(weightDelta) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {Number(weightDelta) >= 0 ? '+' : ''}{weightDelta} {state.profile?.unit} Total Delta
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Target Objective</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 italic tracking-tighter">{state.profile?.targetWeight}</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase">{state.profile?.unit}</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold mt-2 uppercase">{remainingToGoal} {state.profile?.unit} To Goal</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-4">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Journey Completion</span>
            <span className="text-xs font-black text-brand-600 dark:text-brand-400 font-mono">{Math.round(weightProgress)}%</span>
          </div>
          <div className="h-5 w-full bg-slate-100 dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 p-1 relative">
            <div
              className="h-full bg-gradient-to-r from-brand-700 via-brand-500 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)] dark:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-1000"
              style={{ width: `${weightProgress}%` }}
            />
          </div>
        </div>
      </section>

      {/* Workout Planner & Calendar Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main CTA: Daily Plan */}
        <div className="xl:col-span-8 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-[2rem] p-6 md:p-8 relative overflow-hidden flex flex-col min-h-[300px] group shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="absolute inset-0 bg-brand-600 blur-[120px] opacity-5 group-hover:opacity-10 transition-opacity" />

          <div className="max-w-xl relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-500 rounded-lg shadow-lg shadow-brand-900/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-[10px] font-black text-brand-600 dark:text-brand-500 uppercase tracking-[0.2em]">Daily Agent Protocol</h2>
            </div>

            {state.currentWorkout ? (
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-[1.1] uppercase italic tracking-tighter">{state.currentWorkout.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  "{state.currentWorkout.reasoning && state.currentWorkout.reasoning.length > 150 ? state.currentWorkout.reasoning.substring(0, 150) + '...' : state.currentWorkout.reasoning || 'Agent-optimized session ready for execution.'}"
                </p>
                <div className="pt-2">
                  <button
                    onClick={onStartWorkout}
                    className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(124,58,237,0.3)] text-sm"
                  >
                    <Play className="w-4 h-4 fill-current" /> EXECUTE SESSION
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-[1.1] uppercase italic tracking-tighter">Awaiting Agent Signal</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  Neural patterns analyzed. Ready to calculate your next performance loop.
                </p>
                <button
                  onClick={onRequestNext}
                  className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(124,58,237,0.3)] text-sm"
                >
                  <Brain className="w-4 h-4" /> SYNCHRONIZE & PLAN
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Weight Update Card */}
        <div className="xl:col-span-4 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-[2rem] flex flex-col justify-center shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[300px]">
          {isUpdatingWeight ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-xl">
                  <Scale className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Update Weight</p>
              </div>
              <input
                autoFocus
                type="number"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-4xl font-black text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { onUpdateWeight(Number(weightInput)); setIsUpdatingWeight(false); }}
                  className="flex-1 py-4 bg-brand-600 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-brand-900/20 active:scale-95 transition-all text-xs"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsUpdatingWeight(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest rounded-xl active:scale-95 transition-all text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Live Mission Tracker</p>
              <h4 className="text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter">
                {state.currentWeight}<span className="text-xl ml-1 text-slate-400 dark:text-slate-600 not-italic uppercase font-bold">{state.profile?.unit}</span>
              </h4>
              <button
                onClick={() => setIsUpdatingWeight(true)}
                className="w-full py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest rounded-xl hover:bg-white dark:hover:bg-slate-900 transition-all border-dashed"
              >
                Log Weight Point
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Google Calendar Integrated Grid */}
      <section className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-1 rounded-[2rem] border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-2xl border border-brand-500/20">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Forge Calendar</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1">
                {monthNames[now.getMonth()]} {now.getFullYear()} • Protocol Synchronicity
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"><ChevronLeft size={20} /></button>
            <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-xl">Today</button>
            <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-transparent">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <div key={d} className="py-2 text-center text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase border-r border-slate-200 dark:border-slate-800 last:border-0">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-5">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className={`min-h-[60px] border-r border-b border-slate-200 dark:border-slate-800 p-1 relative group transition-all ${day.active ? 'bg-white dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-800/20' : 'bg-slate-50/50 dark:bg-slate-950/40 opacity-40'
                } last:border-r-0`}
            >
              {day.day && (
                <span className={`text-[10px] font-black ${day.day === now.getDate() ? 'bg-brand-600 text-white w-6 h-6 flex items-center justify-center rounded-lg shadow-lg' : 'text-slate-400 dark:text-slate-600'}`}>
                  {day.day}
                </span>
              )}

              <div className="mt-1 space-y-0.5">
                {day.sessions.map((session, sIdx) => (
                  <div
                    key={sIdx}
                    className={`p-0.5 px-1 rounded border text-[7px] font-bold uppercase tracking-tight truncate flex items-center gap-1 ${session.status === 'completed'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                      }`}
                  >
                    <div className={`w-1 h-1 rounded-full ${session.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {(session.workout?.title || 'Workout').substring(0, 10)}...
                  </div>
                ))}
              </div>

              {day.sessions.length > 0 && (
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Info className="w-3 h-3 text-slate-300 dark:text-slate-700 cursor-help" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Analytics Footer Section */}
      <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800/80 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">System Strain</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">Recent performance telemetry</p>
          </div>
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <TrendingUp className="text-emerald-600 dark:text-emerald-500 w-5 h-5" />
          </div>
        </div>
        <div className="h-56 min-h-[224px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  color: '#1e293b',
                  fontSize: '11px',
                  fontWeight: '800',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ color: '#8b5cf6' }}
              />
              <Area
                type="monotone"
                dataKey="val"
                stroke="#8b5cf6"
                strokeWidth={5}
                fillOpacity={1}
                fill="url(#colorVal)"
                isAnimationActive={true}
                animationDuration={1500}
                dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 0 }}
                activeDot={{ r: 9, fill: '#fff', stroke: '#8b5cf6', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};