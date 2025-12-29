import React, { useState } from 'react';
import { WorkoutPlan } from '../types';
import { CheckCircle2, Circle, Brain, Terminal, ChevronDown, ChevronUp, Clock, Info, Activity, ChevronRight, XCircle, AlertTriangle, X, Timer, ZapOff, Ghost, Calendar } from 'lucide-react';

interface WorkoutViewProps {
  workout: WorkoutPlan;
  agentText: string;
  onFinish: (status: 'completed' | 'skipped' | 'partial', feedback: string, difficulty: number) => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({ workout, agentText, onFinish }) => {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [showReasoning, setShowReasoning] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [skipReason, setSkipReason] = useState('');
  const [selectedQuickReason, setSelectedQuickReason] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState(5);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const totalPossible = (workout?.warmup?.length || 0) + (workout?.mainExercises?.length || 0) + (workout?.cooldown?.length || 0);
  const progress = totalPossible > 0 ? Math.round((completedExercises.length / totalPossible) * 100) : 0;

  const toggleExercise = (name: string) => {
    setCompletedExercises(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  };

  const quickReasons = [
    { id: 'fatigue', label: 'High Fatigue', icon: <ZapOff className="w-3 h-3" />, context: 'Recovery needed' },
    { id: 'time', label: 'No Time', icon: <Timer className="w-3 h-3" />, context: 'Busy schedule' },
    { id: 'pain', label: 'Pain', icon: <AlertTriangle className="w-3 h-3 text-rose-500" />, context: 'Injury concern' },
    { id: 'other', label: 'Other', icon: <Ghost className="w-3 h-3" />, context: 'Custom reason' }
  ];

  const handleSkipConfirm = () => {
    const finalReason = selectedQuickReason
      ? `[${selectedQuickReason.toUpperCase()}] ${skipReason || 'No detailed notes.'}`
      : skipReason || 'No reason provided.';
    onFinish('skipped', finalReason, 0);
  };

  const isSkipDisabled = !selectedQuickReason && !skipReason.trim();

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 pb-24 relative max-w-5xl mx-auto">
      {/* Compact Abort Modal */}
      {isSkipping && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-100/80 dark:bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsSkipping(false)} />
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-2xl relative z-10 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic">Abort Session?</h3>
              <button onClick={() => setIsSkipping(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickReasons.map(r => (
                <button key={r.id} onClick={() => setSelectedQuickReason(r.label)} className={`p-3 rounded-xl border text-left transition-all ${selectedQuickReason === r.label ? 'bg-rose-500/10 border-rose-500 text-rose-600' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-2 mb-1">{r.icon} <span className="text-[10px] font-black uppercase">{r.label}</span></div>
                </button>
              ))}
            </div>
            <textarea
              value={skipReason} onChange={e => setSkipReason(e.target.value)}
              placeholder="Optional details..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs min-h-[60px] mb-4 focus:outline-none focus:border-rose-500"
            />
            <button onClick={handleSkipConfirm} disabled={isSkipDisabled} className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl font-black uppercase text-xs tracking-wider">Confirm Abort</button>
          </div>
        </div>
      )}

      {/* Sync Screen */}
      {isFinishing ? (
        <div className="max-w-xl mx-auto py-8 space-y-6">
          <h2 className="text-3xl font-black text-center text-slate-900 dark:text-white uppercase italic tracking-tight">Session Complete</h2>
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-xl space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-slate-500 uppercase">Effort Rating (RPE)</span>
                <span className="text-4xl font-black text-brand-600">{difficulty}</span>
              </div>
              <input type="range" min="1" max="10" value={difficulty} onChange={e => setDifficulty(Number(e.target.value))} className="w-full accent-brand-500" />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase"><span>Easy</span><span>Max Effort</span></div>
            </div>
            <textarea
              value={feedback} onChange={e => setFeedback(e.target.value)}
              placeholder="How did it feel? Any pain or records?"
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm min-h-[120px] focus:outline-none focus:border-brand-500"
            />
            <div className="flex gap-3">
              <button onClick={() => onFinish('completed', feedback, difficulty)} className="flex-1 py-4 bg-brand-600 text-white rounded-xl font-black uppercase tracking-wider text-sm hover:bg-brand-500 transition-colors">Save & Sync</button>
              <button onClick={() => setIsFinishing(false)} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-black uppercase tracking-wider text-sm">Back</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex gap-2 mb-2">
                <span className="px-2 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase rounded-lg border border-brand-500/20">{workout.phase}</span>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-[10px] font-black uppercase rounded-lg border border-emerald-500/20">{workout.agentFocus}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">{workout.title}</h2>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex-1 md:w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl flex items-center gap-3">
                <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">{progress}%</span>
              </div>
              <button onClick={() => setIsSkipping(true)} className="p-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/10 dark:hover:bg-rose-900/20 text-rose-500 rounded-xl transition-colors"><X size={20} /></button>
            </div>
          </header>

          {/* Agent Insight Collapsible */}
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <button onClick={() => setShowReasoning(!showReasoning)} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <Brain className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Strategy Insight</span>
              </div>
              {showReasoning ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showReasoning && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">"{workout.reasoning}"</p>
              </div>
            )}
          </div>

          {/* Exercises List */}
          <div className="space-y-8">
            <WorkoutSection title="Activation" icon={<Activity size={16} />} exercises={workout.warmup} completed={completedExercises} onToggle={toggleExercise} />
            <WorkoutSection title="Force Production" icon={<Activity size={16} />} exercises={workout.mainExercises} completed={completedExercises} onToggle={toggleExercise} isMain />
            <WorkoutSection title="Recovery" icon={<Activity size={16} />} exercises={workout.cooldown} completed={completedExercises} onToggle={toggleExercise} />
          </div>

          {/* Floating Complete Button */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs px-4">
            <button
              onClick={() => setIsFinishing(true)}
              className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Complete Session
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const WorkoutSection = ({ title, icon, exercises, completed, onToggle, isMain }: any) => {
  if (!exercises || exercises.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 px-2">
        <div className={`p-2 rounded-lg ${isMain ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'}`}>{icon}</div>
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercises.map((ex: any, i: number) => (
          <ExerciseRow key={i} ex={ex} isDone={completed.includes(ex.name)} onToggle={() => onToggle(ex.name)} isMain={isMain} />
        ))}
      </div>
    </section>
  );
};

const ExerciseRow = ({ ex, isDone, onToggle, isMain }: any) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-2xl border transition-all ${isDone ? 'opacity-60 bg-slate-50/80 border-slate-200' : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-brand-500/30'} ${isMain && !isDone ? 'shadow-sm' : ''}`}>
      <div className="p-5 flex items-start gap-4 cursor-pointer" onClick={() => !isDone && setExpanded(!expanded)}>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`mt-1 shrink-0 ${isDone ? 'text-emerald-500' : 'text-slate-300 hover:text-brand-500'}`}
        >
          {isDone ? <CheckCircle2 size={28} /> : <Circle size={28} />}
        </button>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-col gap-1">
            <h4 className={`font-bold text-base leading-tight ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>{ex.name}</h4>
            <div className="flex flex-wrap gap-2">
              {ex.sets && <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-md">{ex.sets} Sets</span>}
              {ex.reps && <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{ex.reps} Reps</span>}
              {ex.duration && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">{ex.duration}</span>}
            </div>
          </div>
          {ex.notes && !expanded && !isDone && <p className="text-xs text-slate-500 truncate mt-1">{ex.notes}</p>}
        </div>
        {!isDone && <ChevronDown size={20} className={`text-slate-300 transition-transform mt-1 ${expanded ? 'rotate-180' : ''}`} />}
      </div>

      {expanded && !isDone && (
        <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium border border-slate-100 dark:border-slate-800">
            {ex.notes}
          </div>
        </div>
      )}
    </div>
  );
};