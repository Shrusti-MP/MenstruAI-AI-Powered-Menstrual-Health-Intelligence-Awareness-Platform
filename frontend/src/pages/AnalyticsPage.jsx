import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Calendar,
  Droplet,
  Smile,
  Moon,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';

const COLORS = ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3'];
const FLOW_COLORS = {
  Light: '#f472b6',
  Medium: '#e11d48',
  Heavy: '#9f1239',
};
const MOOD_COLORS = {
  Good: '#10b981',
  Okay: '#3b82f6',
  Low: '#6366f1',
  Irritated: '#f59e0b',
  Stressed: '#ef4444',
};
const SLEEP_COLORS = {
  Good: '#059669',
  Average: '#0284c7',
  Poor: '#dc2626',
};

const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getSummary();
        setSummary(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Could not retrieve analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-20 bg-rose-100/40 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-white rounded-3xl animate-pulse" />
          <div className="h-64 bg-white rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  const hasData = summary && summary.total_records > 0;

  // Format data for charts
  const symptomData = (summary?.symptom_frequencies || []).filter((s) => s.count > 0);
  const flowData = (summary?.flow_distribution || []).filter((f) => f.count > 0);
  const moodData = (summary?.mood_distribution || []).filter((m) => m.count > 0);
  const sleepData = (summary?.sleep_distribution || []).filter((s) => s.count > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
          Observation Analytics
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Health Pattern Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Descriptive summaries derived directly from your personal tracking records.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-rose-950/80 leading-relaxed">
          <strong>Non-Diagnostic Observational Boundary:</strong> The charts below represent statistical counts of your logged inputs. MenstruAI does not diagnose medical conditions or calculate clinical risk scores. For questions regarding reproductive health or symptom severity, consult a licensed healthcare professional.
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Statements Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-600" />
          Key Factual Observations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {summary?.factual_statements?.map((statement, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed"
            >
              <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{statement}</span>
            </div>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Observations Recorded Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Analytics will dynamically update with interactive charts once you begin logging your cycle observations.
          </p>
        </div>
      ) : (
        /* Visual Charts Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Symptom Frequency Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-600" />
                Symptom Frequency Count
              </h3>
              <p className="text-xs text-slate-400">Total times each physical sensation was recorded</p>
            </div>

            <div className="h-64 w-full">
              {symptomData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={symptomData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="symptom"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" fill="#e11d48" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No specific symptoms logged in records yet.
                </div>
              )}
            </div>
          </div>

          {/* 2. Flow Distribution Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Droplet className="w-4 h-4 text-rose-600" />
                Flow Distribution
              </h3>
              <p className="text-xs text-slate-400">Breakdown of recorded flow levels</p>
            </div>

            <div className="h-64 w-full">
              {flowData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={flowData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="flow"
                    >
                      {flowData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={FLOW_COLORS[entry.flow] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No flow levels recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* 3. Mood Overview Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Smile className="w-4 h-4 text-amber-500" />
                Mood Observations Overview
              </h3>
              <p className="text-xs text-slate-400">Frequency of recorded emotional states</p>
            </div>

            <div className="h-64 w-full">
              {moodData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                    <XAxis dataKey="mood" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {moodData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={MOOD_COLORS[entry.mood] || '#f59e0b'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No mood states logged yet.
                </div>
              )}
            </div>
          </div>

          {/* 4. Sleep Quality Distribution */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Moon className="w-4 h-4 text-blue-500" />
                Sleep Quality Observations
              </h3>
              <p className="text-xs text-slate-400">Distribution of logged sleep experiences</p>
            </div>

            <div className="h-64 w-full">
              {sleepData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sleepData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                    <XAxis dataKey="sleep" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {sleepData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={SLEEP_COLORS[entry.sleep] || '#3b82f6'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No sleep observations logged yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
