import React, { useState, useEffect } from 'react';
import { mythsService } from '../services/mythsService';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronDown,
  Sparkles,
  BookOpen,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

const MythsFactsPage = () => {
  const [items, setItems] = useState([]);
  const [revealedIds, setRevealedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyths = async () => {
      try {
        setLoading(true);
        const data = await mythsService.getMythsFacts();
        setItems(data);
      } catch (err) {
        console.error('Failed to load myths:', err);
        setError('Could not load myths & facts catalogue.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyths();
  }, []);

  const toggleReveal = (id) => {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const revealAll = () => {
    setRevealedIds(items.map((i) => i.id));
  };

  const hideAll = () => {
    setRevealedIds([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
            Evidence-Based Debunks
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Menstrual Myths vs. Scientific Facts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Dismantle historical stigmas, taboos, and misconceptions using peer-reviewed physiological facts.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={revealAll}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold shadow-2xs"
            >
              Reveal All
            </button>
            <button
              onClick={hideAll}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold shadow-2xs"
            >
              Hide All
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of Interactive Myth/Fact Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-white rounded-3xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-2">
          <HelpCircle className="w-10 h-10 text-rose-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Myth/Fact Entries Loaded</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => {
            const isRevealed = revealedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                  isRevealed
                    ? 'border-emerald-200 shadow-md ring-1 ring-emerald-100'
                    : 'border-slate-100 shadow-xs hover:border-rose-200 hover:shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  {/* Myth section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Persistent Myth</span>
                    </div>
                    <p className="text-base font-bold text-slate-800 leading-snug">
                      "{item.myth}"
                    </p>
                  </div>

                  {/* Revealed Fact & Explanation */}
                  {isRevealed && (
                    <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-100 space-y-1.5">
                        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Scientific Fact</span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-emerald-950 leading-relaxed">
                          {item.fact}
                        </p>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600 leading-relaxed pl-1">
                        <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          Medical Explanation:
                        </p>
                        <p>{item.explanation}</p>
                      </div>

                      {item.source && (
                        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50">
                          <span>Ref: {item.source}</span>
                          {item.source_url && (
                            <a
                              href={item.source_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 font-semibold"
                            >
                              <span>Learn More</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Toggle Button */}
                <div className="mt-5 pt-3 border-t border-slate-50 text-right">
                  <button
                    onClick={() => toggleReveal(item.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isRevealed
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
                    }`}
                  >
                    <span>{isRevealed ? 'Hide Explanation' : 'Reveal Fact & Evidence'}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isRevealed ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MythsFactsPage;
