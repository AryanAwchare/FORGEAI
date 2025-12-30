import React, { useState, useEffect } from 'react';
import './animations.css';
import { UserProfile, HistoryEntry, WorkoutPlan, AppState } from './types';
import { generateForgeResponse, getStructuredWorkout } from './geminiService';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { WorkoutView } from './components/WorkoutView';
import { HistoryView } from './components/HistoryView';
import { Loader2, Dumbbell, Calendar, History, Activity, Brain, ShieldAlert, Scale, Sun, Moon, Sparkles, User as UserIcon, ChevronRight } from 'lucide-react';

import { supabase } from './supabaseClient';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Login } from './components/Login';
import { Profile } from './components/Profile';

const AppContent: React.FC = () => {
  const { user, profile, isLoading, signOut } = useAuth();
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('forge_agent_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // We will validate ownership in a useEffect, for now load it but risk is handled below
        return parsed;
      } catch (e) {
        // invalid json
      }
    }
    return {
      profile: null,
      history: [],
      currentWorkout: null,
      isInitialLoading: false,
      globalPhase: 'Initialization',
      globalConsistency: 0,
      globalFatigue: 'low',
      currentWeight: 0
    };
  });

  // Clear state when user changes or if loaded state doesn't match current user
  useEffect(() => {
    // Define the initial empty state
    const initialState: AppState = {
      profile: null,
      history: [],
      currentWorkout: null,
      isInitialLoading: false,
      globalPhase: 'Initialization',
      globalConsistency: 0,
      globalFatigue: 'low',
      currentWeight: 0
    };

    const loadUserData = async (userId: string) => {
      try {
        console.log('Fetching user history from Supabase...');
        const { data: historyData, error } = await supabase
          .from('workout_history')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (error) throw error;

        // Map Supabase history to AppState history format if needed
        // Assuming the structure matches or needs slight adaptation. 
        // Note: We might need to parse 'workout' json column if it's stored as JSONB
        // For now, assuming direct mapping or basic compatibility.
        const mappedHistory: HistoryEntry[] = (historyData || []).map(h => ({
          date: h.date,
          status: h.status,
          difficulty: h.difficulty,
          feedback: h.feedback,
          workout: h.workout_details || { title: 'Past Workout', exercises: [] } // Fallback if full object isn't stored
        }));

        // Calculate stats
        const consistency = Math.round(Math.min(100, (mappedHistory.filter(h => h.status === 'completed').length / (mappedHistory.length || 1)) * 100));

        setState(prev => ({
          ...prev,
          history: mappedHistory,
          globalConsistency: consistency
        }));

      } catch (err) {
        console.error('Error loading user history:', err);
      }
    };

    if (user) {
      // If we have a user, check if the current state belongs to them.
      const isProfileMismatch = state.profile && state.profile.user_id !== user.id;
      // Also check if we have history/workout data but no verified profile (orphaned data)
      const isOrphanedData = !state.profile && (state.history.length > 0 || state.currentWorkout);

      // If mismatch, clear state AND fetch new data
      if (isProfileMismatch || isOrphanedData) {
        console.log('User mismatch or orphaned data detected. Clearing state and reloading.');
        setState(initialState);
        loadUserData(user.id);
      } else if (state.history.length === 0) {
        // If state matches but history is empty (e.g. fresh refresh), fetch it
        loadUserData(user.id);
      }
    } else {
      // If user logs out (user is null), strictly clear any personal data from memory/view
      if (state.profile || state.history.length > 0 || state.currentWorkout) {
        console.log('User logged out. Clearing state.');
        setState(initialState);
      }
    }
  }, [user]);

  const [view, setView] = useState<'dashboard' | 'workout' | 'history' | 'profile' | 'edit-profile'>('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentRawText, setAgentRawText] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  const hasSyncedProfile = React.useRef(false);

  // Sync profile from Supabase to AppState when loaded
  useEffect(() => {
    // Only update if profile exists and we haven't synced OR if the IDs match so we can trust the update
    if (profile && user && profile.user_id === user.id) {
      // Check if we need to update to avoid infinite loops
      if (!state.profile || state.profile.user_id !== profile.user_id || state.currentWeight !== profile.current_weight) {
        setState(prev => ({
          ...prev,
          profile: profile,
          currentWeight: profile.current_weight || profile.initialWeight || prev.currentWeight
        }));
      }
    }
  }, [profile, user]);

  useEffect(() => {
    localStorage.setItem('forge_agent_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleOnboardingComplete = async (newProfile: UserProfile) => {
    setIsProcessing(true);
    try {
      const response = await generateForgeResponse(
        `Start my journey. Goal: ${newProfile.goal}. Initial weight: ${newProfile.initialWeight}${newProfile.unit}. Target: ${newProfile.targetWeight}${newProfile.unit}. Create a long-term strategy.`,
        newProfile,
        [],
        { phase: state.globalPhase, consistency: state.globalConsistency, fatigue: state.globalFatigue }
      );
      const structured = await getStructuredWorkout(response.text);
      setAgentRawText(response.text);

      // Save to Supabase (update existing profile)
      if (user) {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            goal: newProfile.goal,
            equipment: newProfile.equipment,
            fitness_level: newProfile.level,
            availability: newProfile.availability,
            limitations: newProfile.limitations,
            initial_weight: newProfile.initialWeight,
            target_weight: newProfile.targetWeight,
            current_weight: newProfile.initialWeight,
            unit: newProfile.unit
          })
          .eq('user_id', user.id);

        if (error) console.error('Error saving profile to Supabase:', error);
      }

      setState(prev => ({
        ...prev,
        profile: newProfile,
        currentWorkout: structured,
        globalPhase: structured.phase,
        globalConsistency: 0,
        currentWeight: newProfile.initialWeight
      }));

      // Navigate to dashboard after completing onboarding
      setView('dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinishWorkout = (status: 'completed' | 'skipped' | 'partial', feedback: string, difficulty: number) => {
    if (!state.currentWorkout) return;

    const newEntry: HistoryEntry = {
      date: new Date().toISOString(),
      workout: state.currentWorkout,
      status,
      feedback,
      difficulty
    };

    // Save history to Supabase
    if (user) {
      supabase.from('workout_history').insert({
        user_id: user.id,
        workout_id: null, // we don't have ID unless we saved workout first. For now just history.
        date: new Date().toISOString(),
        status,
        difficulty,
        feedback: feedback + ` | Workout: ${state.currentWorkout.title}` // Store workout details in feedback or specific column
      }).then(({ error }) => {
        if (error) console.error('Error saving history:', error);
      });
    }

    const newHistory = [newEntry, ...state.history];
    const newConsistency = Math.round(Math.min(100, (newHistory.filter(h => h.status === 'completed').length / (newHistory.length || 1)) * 100));

    setState(prev => ({
      ...prev,
      history: newHistory,
      currentWorkout: null,
      globalConsistency: newConsistency
    }));
    setView('dashboard');
  };

  const updateWeight = async (newWeight: number) => {
    setState(prev => ({ ...prev, currentWeight: newWeight }));
    if (user) {
      // Try update first, if no rows affected, do an insert
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          current_weight: newWeight,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating weight:', error);
        alert('Failed to save weight. Please check your connection.');
      } else {
        console.log('Weight updated successfully to:', newWeight);
      }
    }
  };

  const [iscustomizing, setIsCustomizing] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const requestNextWorkout = async (userContext?: string) => {
    if (!state.profile) return;
    setIsProcessing(true);
    setIsCustomizing(false);
    try {
      const lastEntry = state.history[0];
      let prompt = `Current weight: ${state.currentWeight}. Global Phase: ${state.globalPhase}. Consistency: ${state.globalConsistency}%.`;

      if (userContext) {
        prompt += ` USER REQUEST FOR TODAY: "${userContext}". Adjust the session to strictly follow this request.`;
      } else {
        prompt += ` Evaluate progress and decide the next optimal session.`;
      }

      if (lastEntry) {
        prompt += ` Last session was ${lastEntry.workout.title} (${lastEntry.status}).`;
      }

      const response = await generateForgeResponse(prompt, state.profile, state.history, {
        phase: state.globalPhase,
        consistency: state.globalConsistency,
        fatigue: state.globalFatigue
      });

      const structured = await getStructuredWorkout(response.text);

      setAgentRawText(response.text);
      setState(prev => ({
        ...prev,
        currentWorkout: structured,
        globalPhase: structured.phase || prev.globalPhase,
        globalFatigue: structured.fatigueLevel || prev.globalFatigue
      }));
      setView('workout');
    } catch (error) {
      console.error('Error generating workout:', error);
      alert(`Failed to generate workout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-6 h-6 text-brand-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // If user is logged in but hasn't completed onboarding (no goal set), show onboarding
  // Check both state.profile and Supabase profile
  // Check if profile is complete. We STRICTLY check for a goal.
  // If we have a user but no profile from Supabase yet (and not loading), it means they are new.
  // Or if they have a profile but 'goal' is missing.
  const hasCompletedProfile = !!(profile?.goal && profile?.goal.length > 0);

  if (!hasCompletedProfile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Processing State
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8 text-center transition-colors duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-full animate-pulse" />
          <Brain className="w-16 h-16 text-brand-500 animate-pulse relative z-10" />
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase text-slate-900 dark:text-white">Agent Reasoning Loop</h2>
        <div className="max-w-md space-y-3">
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Status: Analyzing Adherence Trends...</p>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
            ForgeAI is evaluating your biometrics, historical volume, and phase targets to autonomously calibrate your next session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans selection:bg-brand-500/30 transition-colors duration-500">

      {/* Customization Modal */}
      {iscustomizing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsCustomizing(false)} />
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-2xl relative z-10 max-w-lg w-full animate-in zoom-in-95 duration-200">
            <div className="mb-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Workout Generation Mode</h3>
              <p className="text-slate-500 text-sm mt-2">Choose how ForgeAI should generate your next session.</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-brand-50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest">Custom Mode</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Provide specific instructions or context about your workout preferences. The AI will tailor the session to your exact needs.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Auto-Pilot</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Let ForgeAI analyze your progress and automatically generate the optimal workout based on your history and goals.
                </p>
              </div>
            </div>

            <textarea
              autoFocus
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Examples:
• 'Low energy today, lighter session please'
• 'Focus on upper body strength'
• 'Only have 30 minutes available'
• 'Want to target chest and triceps'
• 'Feeling sore, need active recovery'"
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl min-h-[140px] mb-6 focus:outline-none focus:border-brand-500 text-sm font-medium resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => requestNextWorkout(customInput)}
                className="flex-1 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              >
                <Sparkles size={16} /> {customInput ? 'Generate with AI' : 'Enter Custom Request'}
              </button>
              <button
                onClick={() => requestNextWorkout()}
                className="px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
              >
                Auto-Pilot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 lg:w-72 bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800/50 p-4 md:p-6 flex flex-col gap-4 md:gap-8 md:sticky md:top-0 md:h-screen z-50 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="bg-gradient-to-br from-brand-600 to-indigo-700 p-2.5 rounded-2xl shadow-lg shadow-brand-900/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">FORGE AI</h1>
              <p className="text-[10px] text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase">System Active</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-colors"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        {/* User Mini Profile */}
        <div
          onClick={() => setView('profile')}
          className="p-3 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-brand-500/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-500 transition-colors">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">Settings & Account</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Intelligence Panel */}
        <div className="p-5 bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Consistency</span>
            <span className="text-xs font-mono text-brand-600 dark:text-brand-400">{state.globalConsistency}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-cyan-500 transition-all duration-1000 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
              style={{ width: `${state.globalConsistency}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="bg-white dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/50">
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">Fatigue</p>
              <p className={`text-[11px] font-black capitalize ${state.globalFatigue === 'low' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {state.globalFatigue}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/50">
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">Weight</p>
              <p className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase">{state.currentWeight}{state.profile?.unit}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${view === 'dashboard' ? 'bg-brand-600/10 text-brand-600 dark:text-brand-400 border border-brand-500/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'}`}
          >
            <Activity className="w-5 h-5" />
            <span className="font-bold text-sm">Dashboard</span>
          </button>
          <button
            onClick={() => {
              if (state.currentWorkout) setView('workout');
              else setIsCustomizing(true);
            }}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${view === 'workout' ? 'bg-brand-600/10 text-brand-600 dark:text-brand-400 border border-brand-500/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'}`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-bold text-sm">Daily Plan</span>
          </button>
          <button
            onClick={() => setView('history')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${view === 'history' ? 'bg-brand-600/10 text-brand-600 dark:text-brand-400 border border-brand-500/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'}`}
          >
            <History className="w-5 h-5" />
            <span className="font-bold text-sm">Adherence Log</span>
          </button>
          <button
            onClick={() => setView('profile')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${view === 'profile' ? 'bg-brand-600/10 text-brand-600 dark:text-brand-400 border border-brand-500/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'}`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="font-bold text-sm">Profile</span>
          </button>
        </div>

        <div className="mt-auto space-y-4">
          <div className="bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/10 dark:border-amber-500/20 p-4 rounded-[1.5rem] flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
            <div>
              <p className="text-[10px] font-black text-amber-600 dark:text-amber-500/80 uppercase">Safety Protocol</p>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5 font-medium">Agent guidance is simulated. Consult professionals.</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-12 relative scroll-smooth">
        <div className="max-w-6xl mx-auto w-full">
          {view === 'dashboard' && (
            <Dashboard
              state={state}
              onStartWorkout={() => setView('workout')}
              onRequestNext={() => setIsCustomizing(true)}
              onUpdateWeight={updateWeight}
            />
          )}
          {view === 'workout' && (
            state.currentWorkout ? (
              <WorkoutView
                workout={state.currentWorkout}
                onFinish={handleFinishWorkout}
                agentText={agentRawText}
              />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 rounded-full blur-xl opacity-50" />
                  <div className="relative p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-2xl">
                    <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                  </div>
                </div>
                <div className="space-y-3 max-w-lg">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">No Active Protocol</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Your neural path is currently clear. Initialize the ForgeAI agent to generate your next optimal training session.
                  </p>
                </div>
                <button
                  onClick={() => setIsCustomizing(true)}
                  className="px-10 py-5 bg-brand-600 hover:bg-brand-500 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-brand-900/20 hover:scale-105 transition-all flex items-center gap-3"
                >
                  <Brain className="w-5 h-5" /> Initialize Session
                </button>
              </div>
            )
          )}
          {view === 'history' && <HistoryView history={state.history} />}
          {view === 'profile' && <Profile onEditProfile={() => setView('edit-profile')} />}
          {view === 'edit-profile' && <Onboarding onComplete={handleOnboardingComplete} />}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;