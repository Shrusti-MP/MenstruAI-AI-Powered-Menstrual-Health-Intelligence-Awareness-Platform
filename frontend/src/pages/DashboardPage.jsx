import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trackingService } from '../services/trackingService';
import { analyticsService } from '../services/analyticsService';
import { quizService } from '../services/quizService';
import { recommendationService } from '../services/recommendationService';
import StatCard from '../components/StatCard';
import RecommendationCard from '../components/RecommendationCard';
import {
  Calendar,
  BarChart3,
  BookOpen,
  Award,
  Plus,
  ArrowRight,
  Activity,
  Droplet,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [quizStats, setQuizStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [recordsData, analyticsData, quizData, recsData] = await Promise.all([
          trackingService.getRecords(),
          analyticsService.getSummary(),
          quizService.getQuizHistory(),
          recommendationService.getRecommendations(),
        ]);
        setRecords(recordsData);
        setAnalytics(analyticsData);
        setQuizStats(quizData);
        setRecommendations(recsData);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError('Could not load some dashboard metrics. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="h-24 bg-rose-100/50 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Derive recent symptoms string
  const recentSymptomsList = records.slice(0, 3).flatMap((r) => r.symptoms.map((s) => s.name));
  const uniqueRecentSymptoms = [...new Set(recentSymptomsList)].slice(0, 3);
  const recentSymptomsDisplay = uniqueRecentSymptoms.length > 0
    ? uniqueRecentSymptoms.join(', ')
    : 'None logged yet';

  const latestDateFormatted = analytics?.latest_observation_date
    ? new Date(analytics.latest_observation_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No logs yet';

  const quizScoreDisplay = quizStats?.latest_score !== null && quizStats?.latest_score !== undefined
    ? `${quizStats.latest_score}/10`
    : 'Not taken';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-rose-600/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Health Companion Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Friend'}
          </h1>
          <p className="text-rose-100 text-sm max-w-xl">
            Here is your verified personal health overview and learning progress.
          </p>
        </div>

        {/* Quick Add Button */}
        <div>
          <Link
            to="/track"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-rose-700 font-bold text-sm shadow-md hover:bg-rose-50 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Observation</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 5 Real Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Records"
          value={analytics?.total_records ?? 0}
          subtitle="Cycle observations logged"
          icon={Activity}
          color="rose"
        />
        <StatCard
          title="Latest Flow"
          value={analytics?.latest_flow || 'N/A'}
          subtitle="Most recent volume"
          icon={Droplet}
          color="purple"
        />
        <StatCard
          title="Recent Symptoms"
          value={uniqueRecentSymptoms.length > 0 ? `${uniqueRecentSymptoms.length} Types` : 'None'}
          subtitle={recentSymptomsDisplay}
          icon={Calendar}
          color="amber"
        />
        <StatCard
          title="Latest Date"
          value={latestDateFormatted}
          subtitle="Last logged entry"
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Quiz Score"
          value={quizScoreDisplay}
          subtitle={quizStats?.total_attempts ? `${quizStats.total_attempts} attempt(s)` : 'Test awareness'}
          icon={Award}
          color="emerald"
        />
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
          Quick Actions:
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/track"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Observation
          </Link>
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            View History
          </Link>
          <Link
            to="/analytics"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            View Analytics
          </Link>
          <Link
            to="/education"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Learn
          </Link>
          <Link
            to="/quiz"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            Take Quiz
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Records & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Records (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                  Recent Tracking Observations
                </h3>
                <p className="text-xs text-slate-500">Your latest logged cycle entries</p>
              </div>
              <Link
                to="/history"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
              >
                <span>View Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {records.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-rose-100 bg-rose-50/20 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No Observations Recorded Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Begin tracking your flow, physical sensations, mood, and sleep patterns to populate your history and personal analytics.
                </p>
                <Link
                  to="/track"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Log First Observation
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {records.slice(0, 5).map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-rose-100 bg-slate-50/40 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">
                          {new Date(rec.start_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        {rec.flow && (
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              rec.flow === 'Heavy'
                                ? 'bg-red-100 text-red-700'
                                : rec.flow === 'Medium'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-pink-100 text-pink-700'
                            }`}
                          >
                            {rec.flow} Flow
                          </span>
                        )}
                      </div>

                      {/* Symptoms chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {rec.symptoms.length > 0 ? (
                          rec.symptoms.map((s) => (
                            <span
                              key={s.id}
                              className="text-[10px] font-medium bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md"
                            >
                              {s.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400">No specific symptoms logged</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 self-end sm:self-center">
                      {rec.mood && (
                        <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-100 text-[11px]">
                          Mood: {rec.mood}
                        </span>
                      )}
                      {rec.sleep && (
                        <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full border border-blue-100 text-[11px]">
                          Sleep: {rec.sleep}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Educational Recommendations & Learning Progress */}
        <div className="space-y-6">
          {/* Personalized Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-600" />
                Personalized Learning Insights
              </h3>
            </div>

            <div className="space-y-3">
              {recommendations.length > 0 ? (
                recommendations.slice(0, 3).map((rec) => (
                  <RecommendationCard key={rec.id} recommendation={rec} />
                ))
              ) : (
                <div className="p-4 bg-white rounded-2xl border border-slate-100 text-xs text-slate-500">
                  Log your symptoms and complete the health quiz to receive custom educational guidance.
                </div>
              )}
            </div>
          </div>

          {/* Quick Learning & Quiz Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">Health Literacy Status</h4>
              <Award className="w-5 h-5 text-purple-600" />
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-900 font-semibold">Latest Quiz Score</span>
                <span className="text-sm font-bold text-purple-700">{quizScoreDisplay}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-purple-800/80">
                <span>Best Score Recorded</span>
                <span className="font-semibold">{quizStats?.best_score ? `${quizStats.best_score}/10` : 'None'}</span>
              </div>
            </div>

            <Link
              to="/quiz"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center text-purple-700 bg-purple-100/70 hover:bg-purple-100 transition-colors block"
            >
              {quizStats?.total_attempts ? 'Retake Literacy Quiz' : 'Take Your First Quiz'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
