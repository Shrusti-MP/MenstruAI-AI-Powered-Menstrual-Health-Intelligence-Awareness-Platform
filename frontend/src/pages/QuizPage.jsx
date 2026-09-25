import React, { useState, useEffect } from 'react';
import { quizService } from '../services/quizService';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  History,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Trophy,
  Check,
  TrendingUp,
  Brain,
  ShieldCheck,
} from 'lucide-react';

const QuizPage = () => {
  const [activeTab, setActiveTab] = useState('take'); // 'take' | 'history'

  // Quiz taking state
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [question_id]: option_id }
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // quiz results from server
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quiz history state
  const [historyStats, setHistoryStats] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchQuiz();
    fetchHistory();
  }, []);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await quizService.getQuizQuestions();
      setQuestions(data);
      setSelectedAnswers({});
      setResult(null);
    } catch (err) {
      console.error('Failed to load quiz:', err);
      setError('Could not retrieve quiz questions. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await quizService.getQuizHistory();
      setHistoryStats(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSelectOption = (questionId, optionId) => {
    if (result) return; // quiz already submitted
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitQuiz = async () => {
    const unansweredCount = questions.length - Object.keys(selectedAnswers).length;
    if (unansweredCount > 0) {
      if (
        !window.confirm(
          `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit your quiz now?`
        )
      ) {
        return;
      }
    }

    setSubmitting(true);
    setError('');
    try {
      const answersList = Object.entries(selectedAnswers).map(([qid, oid]) => ({
        question_id: parseInt(qid),
        selected_option_id: oid,
      }));

      const res = await quizService.submitQuiz(answersList);
      setResult(res);
      // Refresh history stats immediately
      await fetchHistory();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = async () => {
    setSelectedAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Fetch fresh set of unseen questions from the backend anti-repetition engine
    await fetchQuiz();
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  // Helper for difficulty badge
  const renderDifficultyBadge = (difficulty) => {
    const diff = (difficulty || 'Medium').toLowerCase();
    if (diff === 'easy') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
          Easy
        </span>
      );
    }
    if (diff === 'hard') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md">
          Hard
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
        Medium
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
              Adaptive Knowledge Assessment
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Balanced 10-Question Evaluation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Menstrual Health Literacy Quiz
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Test your understanding across menstrual physiology, hygiene, symptoms, and debunked myths. Fresh questions are selected each attempt.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('take')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'take'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            Take Quiz
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>My Quiz History</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: TAKE QUIZ */}
      {activeTab === 'take' && (
        <div className="space-y-6">
          {/* RESULT BANNER (when submitted) */}
          {result && (
            <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Attempt Evaluated Successfully</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Your Score: {result.score} / {result.total_questions} ({result.percentage}%)
                  </h2>
                  <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
                    {result.percentage >= 80
                      ? 'Outstanding health literacy! You demonstrate a strong, evidence-grounded grasp of menstrual biology and hygiene.'
                      : result.percentage >= 60
                      ? 'Solid foundation! Review the evidence explanations below to strengthen specific areas.'
                      : 'Great learning step! Read the detailed explanations below to debunk myths and build your cycle literacy.'}
                  </p>
                </div>

                {/* Retake Button with Anti-Repetition Trigger */}
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-5 py-3 rounded-xl bg-white text-rose-700 font-bold text-xs shadow-md hover:bg-rose-50 transition-all flex items-center gap-2 self-start sm:self-auto shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Literacy Quiz</span>
                </button>
              </div>

              {/* Quick Status Stats Row */}
              <div className="pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                  <span className="text-rose-100 block text-[11px]">Correct Answers</span>
                  <span className="text-base font-bold text-white">
                    {result.score} of {result.total_questions}
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                  <span className="text-rose-100 block text-[11px]">Literacy Status</span>
                  <span className="text-base font-bold text-white">
                    {result.percentage >= 80 ? 'Proficient' : result.percentage >= 60 ? 'Developing' : 'Foundational'}
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                  <span className="text-rose-100 block text-[11px]">Previous Best</span>
                  <span className="text-base font-bold text-white">
                    {historyStats?.best_score !== null && historyStats?.best_score !== undefined
                      ? `${historyStats.best_score}/10`
                      : `${result.score}/10`}
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                  <span className="text-rose-100 block text-[11px]">Total Attempts</span>
                  <span className="text-base font-bold text-white">
                    {historyStats?.total_attempts ?? 1}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar (when answering) */}
          {!result && questions.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Quiz Progress</span>
                <span className="text-rose-600 font-bold">
                  {answeredCount} of {questions.length} Answered ({Math.round(progressPercent)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Questions List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-44 bg-white rounded-3xl animate-pulse border border-slate-100 p-6 space-y-3">
                  <div className="h-4 w-32 bg-slate-100 rounded-full" />
                  <div className="h-6 w-3/4 bg-slate-100 rounded-xl" />
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="h-10 bg-slate-100 rounded-xl" />
                    <div className="h-10 bg-slate-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, qIndex) => {
                const questionResult = result?.results.find((r) => r.question_id === q.id);
                const isTrueFalse = q.options.length === 2 &&
                  q.options.some((o) => o.option_text.toLowerCase() === 'true') &&
                  q.options.some((o) => o.option_text.toLowerCase() === 'false');

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all ${
                      questionResult
                        ? questionResult.is_correct
                          ? 'border-emerald-200 bg-emerald-50/10'
                          : 'border-red-200 bg-red-50/10'
                        : 'border-slate-100 shadow-xs'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                            Question {qIndex + 1}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {q.category}
                          </span>
                          {renderDifficultyBadge(q.difficulty)}
                          {isTrueFalse && (
                            <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200/80 px-2 py-0.5 rounded-md">
                              True / False
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug pt-1">
                          {q.question}
                        </h3>
                      </div>

                      {questionResult && (
                        <div className="shrink-0">
                          {questionResult.is_correct ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                              <XCircle className="w-4 h-4 text-red-600" />
                              Incorrect
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Options Grid */}
                    <div
                      className={`grid gap-3 ${
                        isTrueFalse ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
                      }`}
                    >
                      {q.options.map((opt) => {
                        const isSelected = selectedAnswers[q.id] === opt.id;
                        let optionStyle =
                          'border-slate-200 hover:border-rose-200 text-slate-700 bg-white hover:bg-rose-50/20';

                        if (result && questionResult) {
                          if (opt.id === questionResult.correct_option_id) {
                            optionStyle =
                              'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                          } else if (isSelected && !questionResult.is_correct) {
                            optionStyle =
                              'border-red-400 bg-red-50 text-red-950 font-semibold ring-2 ring-red-400/20';
                          } else {
                            optionStyle = 'border-slate-200 text-slate-400 bg-slate-50/50';
                          }
                        } else if (isSelected) {
                          optionStyle =
                            'border-rose-600 bg-rose-50 text-rose-900 font-bold ring-2 ring-rose-500/20';
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={!!result}
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`p-3.5 rounded-2xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
                          >
                            <span className="leading-relaxed">{opt.option_text}</span>
                            <span
                              className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                                isSelected
                                  ? 'border-rose-600 bg-rose-600 text-white text-[10px]'
                                  : 'border-slate-300'
                              }`}
                            >
                              {isSelected && '✓'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Box (Visible after submission) */}
                    {questionResult && (
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-700 leading-relaxed bg-slate-50 rounded-2xl p-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <HelpCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Educational Explanation & Clinical Evidence</span>
                        </div>
                        <p className="text-slate-600 pl-5">{questionResult.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Submit Button */}
          {!result && questions.length > 0 && (
            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {questions.length - answeredCount === 0
                  ? 'All questions answered. Ready to submit!'
                  : `${questions.length - answeredCount} question(s) remaining`}
              </span>
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={submitting || answeredCount === 0}
                className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <span>{submitting ? 'Evaluating Literacy...' : 'Submit Answers'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY QUIZ HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
              <span className="text-xs font-semibold uppercase text-slate-400 block">Total Attempts</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {historyStats?.total_attempts ?? 0}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
              <span className="text-xs font-semibold uppercase text-slate-400 block">Latest Score</span>
              <p className="text-2xl font-bold text-rose-600 mt-1">
                {historyStats?.latest_score !== null && historyStats?.latest_score !== undefined
                  ? `${historyStats.latest_score}/10`
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
              <span className="text-xs font-semibold uppercase text-slate-400 block">Best Score</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {historyStats?.best_score !== null && historyStats?.best_score !== undefined
                  ? `${historyStats.best_score}/10`
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
              <span className="text-xs font-semibold uppercase text-slate-400 block">Literacy Progress</span>
              <p className="text-base font-bold text-indigo-600 mt-2">
                {historyStats?.best_score !== null && historyStats?.best_score !== undefined
                  ? historyStats.best_score >= 8
                    ? 'Proficient'
                    : historyStats.best_score >= 6
                    ? 'Developing'
                    : 'Foundational'
                  : 'Not Assessed'}
              </p>
            </div>
          </div>

          {/* Attempts Table */}
          {loadingHistory ? (
            <div className="text-center py-10 text-xs text-slate-400">Loading attempt history...</div>
          ) : !historyStats || historyStats.attempts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
              <Award className="w-10 h-10 text-rose-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Attempts Recorded Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Complete your first health literacy quiz to record your progress in the database.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('take')}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Take Quiz Now
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-6">Attempt Date</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-6 text-right">Assessment Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyStats.attempts.map((att) => (
                    <tr key={att.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-slate-800">
                        {new Date(att.attempted_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {att.score} / {att.total_questions}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            att.percentage >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : att.percentage >= 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {att.percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right text-xs text-slate-500 font-medium">
                        {att.percentage >= 80 ? 'Proficient' : att.percentage >= 60 ? 'Developing' : 'Foundational'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
