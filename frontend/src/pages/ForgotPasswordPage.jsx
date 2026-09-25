import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Heart, Mail, Lock, Key, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = request reset, 2 = reset password
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const data = await authService.forgotPassword(email.trim());
      setMessage(data.message);
      if (data.detail && data.detail.includes('Dev Reset Token: ')) {
        const extracted = data.detail.replace('Dev Reset Token: ', '').trim();
        setResetToken(extracted);
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.resetPassword(resetToken.trim(), newPassword);
      setMessage(data.message);
      setStep(3); // completed
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-rose-600 text-white items-center justify-center shadow-md shadow-rose-500/20 mb-2">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Reset Your Password
          </h2>
          <p className="text-sm text-slate-500">
            {step === 1 && 'Enter your registered email address to receive reset instructions'}
            {step === 2 && 'Set your new secure password'}
            {step === 3 && 'Password successfully updated'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestToken} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-sm text-slate-800 outline-hidden"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : 'Continue to Reset'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Reset Verification Token
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Paste your reset token"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-xs font-mono text-slate-800 outline-hidden"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  In development mode, token was automatically filled from the simulated server dispatch.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-sm text-slate-800 outline-hidden"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <p className="text-sm text-slate-600">
                You can now log in using your newly created password.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20"
              >
                Go to Sign In
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="text-center pt-2 border-t border-slate-100">
            <Link to="/login" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
