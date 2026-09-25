import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const RecommendationCard = ({ recommendation }) => {
  return (
    <div className="bg-gradient-to-br from-rose-50/70 via-white to-pink-50/40 rounded-2xl p-5 border border-rose-100/80 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-rose-600/10 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 bg-rose-100/70 px-2 py-0.5 rounded-full">
              {recommendation.category || 'Educational Insight'}
            </span>
          </div>
          <h4 className="text-base font-bold text-slate-800 tracking-tight">
            {recommendation.title}
          </h4>
          <p className="text-xs text-rose-900/70 font-medium mt-1">
            {recommendation.reason}
          </p>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {recommendation.recommendation}
          </p>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-rose-100/50">
            <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Educational guidance • Non-diagnostic
            </span>

            {recommendation.article_id ? (
              <Link
                to={`/education/${recommendation.article_id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 group"
              >
                Read Guide
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <Link
                to="/quiz"
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 group"
              >
                Start Quiz
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
