import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackingService } from '../services/trackingService';
import {
  Calendar,
  Droplet,
  Smile,
  Moon,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Save,
} from 'lucide-react';

const TrackingPage = () => {
  const navigate = useNavigate();

  // Form states
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [flow, setFlow] = useState('Medium');
  const [selectedSymptomIds, setSelectedSymptomIds] = useState([]);
  const [mood, setMood] = useState('Good');
  const [sleep, setSleep] = useState('Good');
  const [notes, setNotes] = useState('');

  // Auxiliary states
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const symptoms = await trackingService.getSymptoms();
        setAvailableSymptoms(symptoms);
      } catch (err) {
        console.error('Failed to load symptoms:', err);
        setError('Could not fetch symptom catalogue.');
      } finally {
        setLoadingSymptoms(false);
      }
    };
    fetchSymptoms();
  }, []);

  const toggleSymptom = (id) => {
    setSelectedSymptomIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!startDate) {
      setError('Please choose a start date.');
      return;
    }
    if (endDate && endDate < startDate) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    setSubmitting(true);
    try {
      await trackingService.createRecord({
        start_date: startDate,
        end_date: endDate || null,
        flow: flow || null,
        mood: mood || null,
        sleep: sleep || null,
        notes: notes.trim() || null,
        symptom_ids: selectedSymptomIds,
      });

      setSuccess('Health observation recorded successfully in your history!');
      setTimeout(() => {
        navigate('/history');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save health observation.');
    } finally {
      setSubmitting(false);
    }
  };

  const flowOptions = [
    { label: 'Light', desc: 'Minimal bleeding, liners or light pad', color: 'pink' },
    { label: 'Medium', desc: 'Standard daytime flow, regular changes', color: 'rose' },
    { label: 'Heavy', desc: 'Substantial flow, peak days', color: 'red' },
  ];

  const moodOptions = [
    { label: 'Good', emoji: '😊' },
    { label: 'Okay', emoji: '🙂' },
    { label: 'Low', emoji: '😔' },
    { label: 'Irritated', emoji: '😤' },
    { label: 'Stressed', emoji: '😰' },
  ];

  const sleepOptions = [
    { label: 'Good', desc: 'Restful, continuous sleep' },
    { label: 'Average', desc: 'Fair rest with brief waking' },
    { label: 'Poor', desc: 'Restless, difficult sleep' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-xs text-rose-600 font-bold uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-full">
          Observation Logging
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Record Health Observation
        </h1>
        <p className="text-sm text-slate-500">
          Log daily physical symptoms, flow level, mood, and sleep quality to build your personal baseline.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-sm text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        {/* Section 1: Dates */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-600" />
            1. Observation Dates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-sm text-slate-800 outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                End Date <span className="text-slate-400 font-normal">(Optional for single day)</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-sm text-slate-800 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Flow Intensity */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Droplet className="w-4 h-4 text-rose-600" />
            2. Menstrual Flow Intensity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {flowOptions.map((opt) => {
              const selected = flow === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setFlow(opt.label)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selected
                      ? 'border-rose-600 bg-rose-50/70 shadow-xs ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-bold ${selected ? 'text-rose-700' : 'text-slate-800'}`}>
                      {opt.label} Flow
                    </span>
                    <span className={`w-3 h-3 rounded-full ${selected ? 'bg-rose-600' : 'bg-slate-200'}`} />
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Physical Symptoms Multi-select */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              3. Recorded Symptoms
            </h3>
            <span className="text-xs text-slate-400">Select all that apply</span>
          </div>

          {loadingSymptoms ? (
            <div className="py-4 text-xs text-slate-400">Loading symptom options...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {availableSymptoms.map((sym) => {
                const isSelected = selectedSymptomIds.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => toggleSymptom(sym.id)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
                        : 'border-slate-200 hover:border-rose-200 text-slate-700 bg-slate-50/50 hover:bg-rose-50/30'
                    }`}
                  >
                    <span>{sym.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 4: Mood & Sleep */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          {/* Mood */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Smile className="w-4 h-4 text-amber-500" />
              4. Emotional Mood
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {moodOptions.map((opt) => {
                const selected = mood === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setMood(opt.label)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      selected
                        ? 'border-amber-500 bg-amber-50 shadow-xs ring-2 ring-amber-400/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xl block mb-1">{opt.emoji}</span>
                    <span className={`text-xs font-bold ${selected ? 'text-amber-900' : 'text-slate-700'}`}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sleep */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-500" />
              5. Sleep Quality
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sleepOptions.map((opt) => {
                const selected = sleep === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSleep(opt.label)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selected
                        ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-400/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className={`text-xs font-bold block ${selected ? 'text-blue-900' : 'text-slate-800'}`}>
                      {opt.label} Sleep
                    </span>
                    <span className="text-[11px] text-slate-500">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 5: Notes */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            6. Personal Notes <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add context e.g. 'Used heating pad in afternoon', 'Drank peppermint tea'..."
            className="w-full p-3.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-sm text-slate-800 placeholder:text-slate-400 outline-hidden"
          />
        </div>

        {/* Form Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving Observation...' : 'Save Record'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrackingPage;
