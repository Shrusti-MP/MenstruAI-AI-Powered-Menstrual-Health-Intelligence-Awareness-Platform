import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import {
  ShieldCheck,
  Lock,
  Trash2,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

const SettingsPage = () => {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmInput.trim().toUpperCase() !== 'DELETE') {
      setError("Please type 'DELETE' exactly to confirm account deletion.");
      return;
    }

    setDeleting(true);
    setError('');
    try {
      await deleteAccount(confirmInput.trim());
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete account.');
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const consentDateFormatted = user?.privacy_consent?.consent_date
    ? new Date(user.privacy_consent.consent_date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'On registration';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
          Platform Preferences
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Settings & Privacy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Control your privacy consent records, session security, and account status.
        </p>
      </div>

      {/* Section 1: Privacy & Consent Information */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Privacy & Data Governance</h3>
            <p className="text-xs text-slate-500">Your registered health consent details</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500">Consent Status</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Active & Granted
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500">Consent Policy Version</span>
            <span className="font-mono font-semibold text-slate-700">
              v{user?.privacy_consent?.consent_version || '1.0'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Consent Timestamp</span>
            <span className="font-semibold text-slate-700">{consentDateFormatted}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          In compliance with health privacy design guidelines, all health observations and quiz responses remain securely isolated to your account.
        </p>
      </div>

      {/* Section 2: Session & Security */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Session Management</h3>
            <p className="text-xs text-slate-500">Sign out of active sessions on this device</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-600">
            Terminate the current authenticated JWT bearer token and return to guest mode.
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Section 3: Danger Zone (Delete Account) */}
      <div className="bg-red-50/50 rounded-3xl p-6 sm:p-8 border border-red-200/80 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-red-900">Danger Zone</h3>
            <p className="text-xs text-red-700">Irreversible account actions</p>
          </div>
        </div>

        <p className="text-xs text-red-800/80 leading-relaxed">
          Permanently delete your user profile and all associated data including cycle logs, symptoms, and quiz attempts from the database.
        </p>

        <div className="pt-1">
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account Permanently</span>
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setConfirmInput('');
          setError('');
        }}
        title="Confirm Account Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>
              <strong>Warning:</strong> This will erase all your tracking records, quiz history, and profile records from the MySQL database.
            </span>
          </div>

          {error && (
            <div className="p-2.5 bg-red-100 text-red-800 rounded-lg text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Type <span className="font-mono font-bold text-red-600">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="DELETE"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setDeleteModalOpen(false);
                setConfirmInput('');
                setError('');
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleting || confirmInput.trim().toUpperCase() !== 'DELETE'}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors"
            >
              {deleting ? 'Deleting Account...' : 'Permanently Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
