import React, { useState, useMemo } from 'react';
import { HistoryEntry } from '../types';
import { Calendar, Filter, Download, ArrowDown, ArrowUp, Check } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryEntry[];
}

type SortOrder = 'latest' | 'oldest';

export const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Helper for safe date parsing
  const getSafeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const sortedHistory = useMemo(() => {
    const sorted = [...(history || [])]; // Handle undefined history
    return sorted.sort((a, b) => {
      const dateA = getSafeDate(a.date).getTime();
      const dateB = getSafeDate(b.date).getTime();
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });
  }, [history, sortOrder]);

  const toggleSort = (order: SortOrder) => {
    setSortOrder(order);
    setShowSortMenu(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Activity Log</h2>
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm mt-1">Telemetry archives of your forged evolution and session adherence.</p>
        </div>
        <div className="flex gap-4 relative">
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest ${showSortMenu || sortOrder !== 'latest' ? 'bg-brand-500/10 border-brand-500/30 text-brand-600 dark:text-brand-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Filter size={16} />
              Sort: {sortOrder}
            </button>

            {showSortMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSortMenu(false)}
                />
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl z-50 p-3 overflow-hidden animate-in zoom-in-95 duration-200 shadow-slate-200/50 dark:shadow-none">
                  <button
                    onClick={() => toggleSort('latest')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${sortOrder === 'latest' ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <div className="flex items-center gap-3">
                      <ArrowDown size={14} /> Latest First
                    </div>
                    {sortOrder === 'latest' && <Check size={14} />}
                  </button>
                  <button
                    onClick={() => toggleSort('oldest')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${sortOrder === 'oldest' ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <div className="flex items-center gap-3">
                      <ArrowUp size={14} /> Oldest First
                    </div>
                    {sortOrder === 'oldest' && <Check size={14} />}
                  </button>
                </div>
              </>
            )}
          </div>

          <button className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-black text-[10px] uppercase tracking-widest">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {sortedHistory.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-900/40 rounded-[3rem] border border-slate-200 dark:border-slate-800 border-dashed shadow-sm">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-brand-500/10 blur-3xl rounded-full" />
              <Calendar className="w-20 h-20 text-slate-200 dark:text-slate-800 relative z-10 mx-auto" />
            </div>
            <h3 className="text-2xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter italic">No Protocols Executed</h3>
            <p className="text-slate-400 dark:text-slate-500 font-semibold max-w-xs mx-auto mt-3">The neural path of your evolution begins with your first Daily Plan execution.</p>
          </div>
        ) : (
          sortedHistory.map((entry, i) => (
            <div key={i} className="group bg-white dark:bg-slate-900/40 backdrop-blur-sm rounded-[3rem] border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700 transition-all overflow-hidden animate-in slide-in-from-bottom-6 duration-500 shadow-lg shadow-slate-200/40 dark:shadow-none" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="p-10 md:p-12 flex flex-col md:flex-row gap-12">
                <div className="md:w-64 shrink-0 space-y-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-4">Timestamp</p>
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-brand-500/10 rounded-2xl border border-brand-500/20">
                        <Calendar className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
                          {getSafeDate(entry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase mt-1.5">
                          {getSafeDate(entry.date).getFullYear()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">Telemetry Data</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Strain (RPE)</span>
                        <span className="font-mono text-brand-600 dark:text-brand-400 font-black text-lg italic">{entry.difficulty || '-'}/10</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Execution</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${entry.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {entry.status || 'unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[9px] font-black uppercase px-3 py-1 rounded-xl border border-brand-500/20 tracking-widest">{entry.workout?.phase || 'General'}</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-6">{entry.workout?.title || 'Untitled Session'}</h3>
                    <div className="bg-slate-50 dark:bg-slate-950/60 p-8 rounded-[2rem] italic text-slate-600 dark:text-slate-400 border-l-[6px] border-brand-500/50 text-base leading-relaxed font-semibold shadow-inner">
                      "{entry.feedback || "Protocol synchronization successful. No subjective feedback provided."}"
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">Agentic Retrospective</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-medium">
                      {entry.workout?.reasoning || 'No archival data available for this session.'}
                    </p>
                  </div>

                  <div className="pt-6 flex flex-wrap gap-3">
                    {(entry.workout?.mainExercises || []).map((ex, idx) => (
                      <span key={idx} className="bg-white dark:bg-slate-800/50 px-5 py-2 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 uppercase tracking-widest">
                        {ex.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};