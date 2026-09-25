import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Calendar,
  BarChart3,
  BookOpen,
  HelpCircle,
  Award,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Brain,
  Compass,
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Smart Health Tracking',
      description: 'Record flow, symptoms, mood, and sleep variations with intuitive input designed for daily clarity.',
      icon: Calendar,
      color: 'rose',
      link: isAuthenticated ? '/track' : '/register',
    },
    {
      title: 'Personal Analytics',
      description: 'Visualize your cycle observations and symptom frequencies without confusing medical jargon.',
      icon: BarChart3,
      color: 'purple',
      link: isAuthenticated ? '/analytics' : '/register',
    },
    {
      title: 'Evidence-Based Education',
      description: 'Access peer-reviewed articles covering biology, hygiene best practices, PMS, nutrition, and red flags.',
      icon: BookOpen,
      color: 'pink',
      link: '/education',
    },
    {
      title: 'Myth vs Fact Explorer',
      description: 'Debunk persistent menstrual stigmas with evidence-grounded scientific explanations and citations.',
      icon: HelpCircle,
      color: 'amber',
      link: '/myths-facts',
    },
    {
      title: 'Health Literacy Quiz',
      description: 'Assess your menstrual awareness, receive instant breakdown explanations, and track your literacy progress.',
      icon: Award,
      color: 'emerald',
      link: isAuthenticated ? '/quiz' : '/login',
    },
    {
      title: 'AI Health Assistant',
      description: 'An intelligent companion designed to answer menstrual health questions with evidence-grounded insights and privacy.',
      icon: Sparkles,
      color: 'indigo',
      link: '/ai-assistant',
    },
  ];

  return (
    <div className="space-y-20 pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/40 via-pink-200/30 to-purple-200/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/70 border border-rose-200/60 text-rose-700 text-xs font-semibold tracking-wide shadow-xs animate-in fade-in duration-500">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>AI-Powered Menstrual Health Intelligence & Awareness Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Understand Your Health.{' '}
            <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 bg-clip-text text-transparent">
              Learn. Track. Grow.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            An AI-powered menstrual health awareness and education platform designed to help users understand their health through tracking, reliable education, personalized insights and AI-assisted learning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25 transition-all active:scale-95 group"
            >
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-rose-50/60 border border-slate-200 hover:border-rose-200 shadow-xs transition-all"
            >
              Learn More
            </Link>
          </div>

          {/* Quick Pillars */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3.5 bg-white rounded-xl border border-rose-100/80 shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Holistic Tracking</span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-rose-100/80 shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Non-Diagnostic Safety</span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-rose-100/80 shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Health Literacy Focus</span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-rose-100/80 shadow-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-xs font-semibold text-slate-700">Strict Data Privacy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why MenstruAI Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-900 via-rose-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-rose-300" />
              Why MenstruAI?
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Moving Beyond Calendar Counting to True Health Intelligence
            </h2>
            <p className="text-rose-100/90 text-sm sm:text-base leading-relaxed">
              Many existing solutions focus heavily on basic calendar dates and prediction guessing. While tracking dates is valuable, MenstruAI is engineered around the belief that <strong>understanding</strong> your body is the real superpower.
            </p>
            <p className="text-rose-100/80 text-sm sm:text-base leading-relaxed">
              We combine structured observation tracking with verified health education, interactive myth-busting, health literacy assessments, and personalized educational guidance—creating a compassionate companion that builds agency and confidence.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
                <p className="text-2xl font-bold text-rose-200">50%+</p>
                <p className="text-xs text-rose-100 mt-1">Of individuals report feeling undertrained in menstrual physiology.</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
                <p className="text-2xl font-bold text-rose-200">100%</p>
                <p className="text-xs text-rose-100 mt-1">Evidence-backed educational guidelines from ACOG, WHO & NHS.</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
                <p className="text-2xl font-bold text-rose-200">Zero</p>
                <p className="text-xs text-rose-100 mt-1">Commercial ad trackers or third-party behavioral data sales.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
            Core Features
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Agency, Knowledge & Well-being
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            A balanced ecosystem connecting health tracking with educational mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-lg hover:border-rose-100 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    {feature.badge && (
                      <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-rose-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50">
                  <Link
                    to={feature.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    <span>Explore Feature</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rose-50/70 border border-rose-100 rounded-3xl p-8 sm:p-12 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-white px-3 py-1 rounded-full shadow-xs">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Track → Learn → Understand
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mt-2">
            A three-step cycle that turns daily observations into lasting health empowerment.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center text-lg">
                1
              </div>
              <h4 className="text-base font-bold text-slate-800">Track Observations</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Log flow volume, specific symptoms like cramps or fatigue, mood variations, and sleep quality in seconds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-lg">
                2
              </div>
              <h4 className="text-base font-bold text-slate-800">Learn & Quiz</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Study evidence-backed articles, dismantle myths with scientific facts, and test your knowledge with interactive quizzes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-rose-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg">
                3
              </div>
              <h4 className="text-base font-bold text-slate-800">Understand Patterns</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Receive non-diagnostic personalized educational recommendations based on what you actually log.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Lock className="w-10 h-10" />
          </div>
          <div className="space-y-3 flex-1 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Privacy First Design
            </span>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              Your Health Data Belongs Exclusively to You
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Menstrual health information is deeply sensitive. MenstruAI uses secure password hashing, strict user-data isolation, encrypted token sessions, and explicit privacy consents. We will never sell health observations or harvest private profiles for advertising.
            </p>
          </div>
          <div>
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shrink-0"
            >
              Get Started Securely
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
