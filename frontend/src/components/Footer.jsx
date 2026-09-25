import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-rose-100 text-slate-600 mt-auto">
      {/* Health Disclaimer Banner */}
      <div className="bg-rose-50/70 border-b border-rose-100 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-rose-800 text-center font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            <strong>Health Notice:</strong> MenstruAI is an educational and health awareness platform. It does not provide medical diagnoses, treatment prescriptions, or replace consultation with qualified healthcare professionals.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">MenstruAI</span>
            </div>
            <p className="text-sm text-slate-500 max-w-md leading-relaxed">
              An AI-powered menstrual health intelligence and awareness platform designed to help users understand their health, not just track it. Grounded in reliable education, respectful privacy, and personalized insights.
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> End-to-End Privacy
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-rose-600" /> Evidence-Based
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Personalized Insights
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/education" className="hover:text-rose-600 transition-colors">
                  Health Library
                </Link>
              </li>
              <li>
                <Link to="/myths-facts" className="hover:text-rose-600 transition-colors">
                  Myths & Facts
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-rose-600 transition-colors">
                  Health Literacy Quiz
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-rose-600 transition-colors">
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-rose-600 transition-colors">
                  About MenstruAI
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-rose-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-rose-600 transition-colors">
                  Data Terms & Consent
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} MenstruAI Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-600">About</Link>
            <Link to="/settings" className="hover:text-slate-600">Privacy Policy</Link>
            <Link to="/settings" className="hover:text-slate-600">Data Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
