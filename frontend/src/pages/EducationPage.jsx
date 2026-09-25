import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { educationService } from '../services/educationService';
import {
  BookOpen,
  Search,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Tag,
  Clock,
  Filter,
  X,
  CheckCircle,
  HelpCircle,
  HeartHandshake,
  Layers,
} from 'lucide-react';

const CATEGORIES = [
  'ALL',
  'Menstrual Health Basics',
  'Understanding Menstruation',
  'Period Hygiene',
  'Menstrual Products',
  'Common Menstrual Symptoms',
  'Cramps and Discomfort',
  'Mood and Emotional Well-being',
  'Sleep and Menstrual Health',
  'Nutrition and Hydration',
  'Exercise and Daily Activity',
  'Myths and Facts',
  'When to Seek Professional Help',
  'Menstrual Health and Health Literacy',
  'Common Questions',
  'Self-care and Healthy Habits',
];

const EducationPage = () => {
  const [articles, setArticles] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all articles and category counts on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [articlesRes, catRes] = await Promise.all([
          educationService.getArticles(),
          educationService.getCategories().catch(() => []),
        ]);
        setArticles(articlesRes);
        setCategoriesData(catRes);
      } catch (err) {
        console.error('Failed to load educational library:', err);
        setError('Could not retrieve educational articles from the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map category counts
  const categoryCounts = useMemo(() => {
    const map = { ALL: articles.length };
    categoriesData.forEach((item) => {
      map[item.category] = item.count;
    });
    // Fallback if catRes empty
    if (Object.keys(map).length <= 1) {
      articles.forEach((a) => {
        map[a.category] = (map[a.category] || 0) + 1;
      });
      map['ALL'] = articles.length;
    }
    return map;
  }, [articles, categoriesData]);

  // Filter articles based on selected category and search term
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesCategory =
        selectedCategory === 'ALL' || a.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchTerm.trim()) return true;

      const term = searchTerm.toLowerCase().trim();
      return (
        a.title.toLowerCase().includes(term) ||
        a.short_description.toLowerCase().includes(term) ||
        a.category.toLowerCase().includes(term) ||
        (a.content && a.content.toLowerCase().includes(term))
      );
    });
  }, [articles, selectedCategory, searchTerm]);

  const clearSearch = () => setSearchTerm('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-rose-100/60 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100/80 px-3 py-1 rounded-full">
            Evidence-Based Health Literacy
          </span>
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            15 Categories • Peer-Grounded Curriculum
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Menstrual Health Education & Knowledge Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Explore structured, evidence-grounded guides designed to demystify cycle physiology, daily hygiene, nutrition, symptom self-care, and when professional medical consultation is appropriate.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar & Mobile Category Selector */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, symptom, myth, or question (e.g., cramps, iron, hygiene, sleep)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-hidden bg-white shadow-xs transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Category Dropdown for Compact / Mobile Navigation */}
          <div className="sm:w-72 relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 bg-white shadow-xs focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-hidden appearance-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? `All Guides (${categoryCounts['ALL'] || articles.length})` : `${cat} (${categoryCounts[cat] || 0})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills (Wrapping on Desktop / Tablets) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] ?? 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50/30'
                }`}
              >
                <span>{cat === 'ALL' ? 'All Guides' : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filter Status & Match Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
          <span>
            Showing <strong className="text-slate-800">{filteredArticles.length}</strong> of{' '}
            <strong className="text-slate-800">{articles.length}</strong> educational guides
            {selectedCategory !== 'ALL' && (
              <span>
                {' '}in <span className="font-semibold text-rose-600">{selectedCategory}</span>
              </span>
            )}
            {searchTerm && (
              <span>
                {' '}matching "<span className="font-semibold text-slate-800">{searchTerm}</span>"
              </span>
            )}
          </span>

          {(selectedCategory !== 'ALL' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchTerm('');
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 bg-white rounded-3xl border border-slate-100 animate-pulse p-6 space-y-4"
            >
              <div className="h-4 w-28 bg-slate-100 rounded-full" />
              <div className="h-6 w-3/4 bg-slate-100 rounded-xl" />
              <div className="h-16 w-full bg-slate-100 rounded-xl" />
              <div className="h-4 w-1/2 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-4">
          <BookOpen className="w-12 h-12 text-rose-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Educational Articles Match Your Search</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Try searching for broader keywords (e.g. "flow", "nutrition", "pain", "cramps") or switch category to "All Guides".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchTerm('');
            }}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Browse All Guides
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const hasMyth = article.content && (article.content.includes('Myth') || article.category === 'Myths and Facts');
            const hasTips = article.content && article.content.includes('Actionable Awareness');
            const hasWarning = article.content && article.content.includes('Professional Help');

            return (
              <div
                key={article.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:shadow-lg hover:border-rose-100 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  {/* Category Badge & Read Time */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full truncate max-w-[200px]">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      3–4 min read
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-rose-600 transition-colors leading-snug">
                    <Link to={`/education/${article.id}`}>
                      {article.title}
                    </Link>
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {article.short_description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {hasTips && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        ✓ Actionable Tips
                      </span>
                    )}
                    {hasMyth && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        ★ Myth vs Fact
                      </span>
                    )}
                    {hasWarning && (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                        ✦ Clinical Guidance
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Link & Source */}
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 truncate max-w-[150px]" title={article.source}>
                    Src: {article.source || 'Medical Guidelines'}
                  </span>

                  <Link
                    to={`/education/${article.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 group/link"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Educational & Clinical Safety Disclaimer */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-start gap-3 max-w-3xl">
          <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Evidence-Based Health Literacy Notice:</strong> MenstruAI educational resources are synthesized from authoritative clinical guidelines (including ACOG, WHO, and Endocrine Society) to empower healthy cycle literacy. This content does not provide medical diagnoses or prescribe medications. If you have concerns about severe pelvic pain, heavy bleeding, or sudden cycle changes, consider speaking with a qualified healthcare professional.
          </p>
        </div>
        <Link
          to="/quiz"
          className="shrink-0 px-4 py-2.5 bg-white border border-rose-200 text-rose-600 font-bold text-xs rounded-xl shadow-2xs hover:bg-rose-50 transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Test Literacy in Quiz</span>
        </Link>
      </div>
    </div>
  );
};

export default EducationPage;
