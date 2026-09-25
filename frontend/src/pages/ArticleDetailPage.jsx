import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { educationService } from '../services/educationService';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle,
  Lightbulb,
  HelpCircle,
  Tag,
  Stethoscope,
} from 'lucide-react';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticleAndRelated = async () => {
      try {
        setLoading(true);
        setError('');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const data = await educationService.getArticleById(id);
        setArticle(data);

        // Fetch related articles
        try {
          const related = await educationService.getRelatedArticles(id);
          setRelatedArticles(related);
        } catch (rErr) {
          console.error('Failed to load related articles:', rErr);
        }
      } catch (err) {
        console.error('Failed to load article:', err);
        setError('Educational guide not found or temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticleAndRelated();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-12 w-3/4 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-96 bg-white rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Article Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This article could not be loaded.'}</p>
        <button
          onClick={() => navigate('/education')}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Return to Library
        </button>
      </div>
    );
  }

  // Parse structured blocks from markdown content
  const sections = article.content.split('\n\n');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation & Category Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/education')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/60 px-3 py-1 rounded-full">
          {article.category}
        </span>
      </div>

      {/* Main Reader Card */}
      <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs space-y-8">
        {/* Title Header */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> Peer-Verified Literature
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 3–4 min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {article.short_description}
          </p>
        </div>

        {/* Content Body with Smart Structured Blocks */}
        <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
          {sections.map((block, idx) => {
            const trimmed = block.trim();

            // 1. Key Takeaways Block
            if (trimmed.startsWith('### Key Takeaways') || trimmed.startsWith('### Key Points')) {
              const lines = trimmed
                .replace(/^### (Key Takeaways|Key Points)\s*/, '')
                .split('\n')
                .filter((l) => l.trim().length > 0);

              return (
                <div
                  key={idx}
                  className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 space-y-3"
                >
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm sm:text-base">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Essential Key Points</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
                    {lines.map((line, lidx) => (
                      <li key={lidx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold mt-0.5">•</span>
                        <span>{line.replace(/^(\*|\-|\d+\.)\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            // 2. Actionable Awareness Tips Block
            if (
              trimmed.startsWith('### Actionable Awareness Tips') ||
              trimmed.startsWith('### Actionable Tips') ||
              trimmed.startsWith('### Awareness Tips')
            ) {
              const lines = trimmed
                .replace(/^### (Actionable Awareness Tips|Actionable Tips|Awareness Tips)\s*/, '')
                .split('\n')
                .filter((l) => l.trim().length > 0);

              return (
                <div
                  key={idx}
                  className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-5 sm:p-6 space-y-3"
                >
                  <div className="flex items-center gap-2 text-sky-900 font-bold text-sm sm:text-base">
                    <Lightbulb className="w-5 h-5 text-sky-600 shrink-0" />
                    <span>Actionable Health Awareness Tips</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-sky-950">
                    {lines.map((line, lidx) => (
                      <li key={lidx} className="flex items-start gap-2">
                        <span className="text-sky-500 font-bold mt-0.5">→</span>
                        <span>{line.replace(/^(\*|\-|\d+\.)\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            // 3. Myth vs Reality / Myth vs Fact Block
            if (
              trimmed.startsWith('### Myth vs Fact') ||
              trimmed.startsWith('### Myth vs. Reality') ||
              trimmed.startsWith('### Debunking Common Myths') ||
              trimmed.startsWith('### Myths & Facts')
            ) {
              const contentInside = trimmed
                .replace(/^### (Myth vs Fact|Myth vs\. Reality|Debunking Common Myths|Myths & Facts)\s*/, '')
                .split('\n')
                .filter((l) => l.trim().length > 0);

              return (
                <div
                  key={idx}
                  className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 sm:p-6 space-y-3"
                >
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base">
                    <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Evidence-Based Myth vs Fact</span>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm text-amber-950">
                    {contentInside.map((line, lidx) => (
                      <p key={lidx} className="leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              );
            }

            // 4. When to Seek Professional Help / Clinical Caution Block
            if (
              trimmed.startsWith('### When to Seek Professional Help') ||
              trimmed.startsWith('### Red Flags') ||
              trimmed.startsWith('### When to Consult')
            ) {
              const contentInside = trimmed
                .replace(/^### (When to Seek Professional Help|Red Flags|When to Consult)\s*/, '')
                .split('\n')
                .filter((l) => l.trim().length > 0);

              return (
                <div
                  key={idx}
                  className="bg-rose-50/80 border border-rose-200 rounded-2xl p-5 sm:p-6 space-y-3"
                >
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-sm sm:text-base">
                    <Stethoscope className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>When to Seek Professional Medical Care</span>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm text-rose-950 leading-relaxed">
                    {contentInside.map((line, lidx) => (
                      <p key={lidx}>{line}</p>
                    ))}
                  </div>
                </div>
              );
            }

            // 5. Related Topics Block
            if (trimmed.startsWith('### Related Topics')) {
              const topicsString = trimmed.replace('### Related Topics', '').trim();
              const topics = topicsString.split(',').map((t) => t.trim()).filter(Boolean);

              return (
                <div key={idx} className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    Related Topics:
                  </span>
                  {topics.map((topic, tidx) => (
                    <span
                      key={tidx}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              );
            }

            // 6. Generic Subheaders (### Heading)
            if (trimmed.startsWith('### ')) {
              return (
                <h3
                  key={idx}
                  className="text-lg sm:text-xl font-bold text-slate-900 pt-3 border-b border-slate-100 pb-2"
                >
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }

            // 7. Bullet lists or numbered points
            if (trimmed.includes('* ') || trimmed.includes('1. ')) {
              const lines = trimmed.split('\n');
              return (
                <div key={idx} className="space-y-2 pl-2">
                  {lines.map((line, lidx) => (
                    <p key={lidx} className="leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              );
            }

            // 8. Standard paragraph
            return (
              <p key={idx} className="leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Source Citation & Clinical Safety Notice */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Authoritative Reference & Source
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-700">{article.source || 'Clinical Guidelines'}</span>
              {article.source_url && (
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold"
                >
                  <span>View Clinical Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-start gap-3 text-xs text-rose-800 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>
              <strong>Clinical Safety & Health Literacy Notice:</strong> This material is provided strictly for educational purposes to foster menstrual health literacy. MenstruAI does not diagnose medical conditions or prescribe medications. Consider speaking with a qualified healthcare professional if you are concerned about your symptoms, experiencing severe pain, or observing unusual changes in your cycle.
            </span>
          </div>
        </div>
      </article>

      {/* Related Resources Section */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Related Educational Guides
              </h2>
              <p className="text-xs text-slate-500">
                Continue building your cycle health literacy with related topics.
              </p>
            </div>
            <Link
              to="/education"
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <span>Explore All Guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                to={`/education/${rel.id}`}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-rose-100 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                    {rel.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-2">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {rel.short_description}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-rose-600">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetailPage;
