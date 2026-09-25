import React from 'react';
import { Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/70 text-rose-700 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
          About MenstruAI
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Empowering Health Literacy Through Intelligent Design
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          MenstruAI bridges the gap between passive calendar logging and active, informed bodily agency through comprehensive education, personal observations, and health literacy.
        </p>
      </div>

      {/* Problem Statement & Mission */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-800">The Problem & Our Mission</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Billions of individuals experience menstrual cycles, yet pervasive societal stigmas, inadequate school curriculums, and misleading online rumors perpetuate widespread health illiteracy. Most commercial cycle-tracking applications treat users simply as data points for advertising or focus solely on algorithmic period date estimates.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          <strong>MenstruAI</strong> transforms this paradigm. Rather than merely recording past dates, MenstruAI connects observations (symptoms, flow, mood, sleep) with verified educational literature, interactive myth debunks, health literacy self-assessments, and rule-based learning recommendations.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;

