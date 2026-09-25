import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Lock,
  BookOpen,
  HelpCircle,
  Award,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const AIAssistantPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold shadow-xs">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>AI Health Assistant</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI-Powered Health Assistant
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          AI-powered menstrual health assistance will be available here.
        </p>
      </div>

      {/* Informational Status Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-100 via-rose-50 to-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>

        <div className="max-w-xl mx-auto space-y-2">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Intelligent Health Guidance
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Our intelligent health assistant is designed to provide reliable, evidence-grounded answers to your menstrual health inquiries with strict privacy and safety guidelines.
          </p>
        </div>
      </div>

      {/* Guiding Principles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Evidence-Based Grounding</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Guidance drawn from peer-reviewed literature and authoritative clinical health standards.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Strict Privacy</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your personal cycle logs and account identity remain confidential, secure, and protected.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Educational Focus</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Structured to enhance menstrual health literacy, bodily awareness, and self-advocacy.
          </p>
        </div>
      </div>

      {/* Available Resources Navigation */}
      <div className="bg-rose-50/60 rounded-3xl p-6 sm:p-8 border border-rose-100 space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            Explore Active Educational Resources
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover peer-reviewed guides, debunk common stigmas, and assess your health literacy today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/education"
            className="p-4 bg-white rounded-2xl border border-rose-100/80 shadow-2xs hover:shadow-sm hover:border-rose-200 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                Health Library
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Verified articles covering biology, symptoms, and self-care.
              </p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
              <span>Read Articles</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            to="/myths-facts"
            className="p-4 bg-white rounded-2xl border border-rose-100/80 shadow-2xs hover:shadow-sm hover:border-rose-200 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                Myths & Facts
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Scientific debunks of widespread misconceptions and taboos.
              </p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
              <span>Explore Debunks</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            to="/quiz"
            className="p-4 bg-white rounded-2xl border border-rose-100/80 shadow-2xs hover:shadow-sm hover:border-rose-200 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                Literacy Quiz
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Interactive self-assessments with instant explanations.
              </p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
              <span>Take Quiz</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Health Safety Notice */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>Health Notice:</strong> MenstruAI provides educational information and is not a substitute for professional medical diagnosis or personalized clinical evaluation.
        </span>
      </div>
    </div>
  );
};

export default AIAssistantPage;
