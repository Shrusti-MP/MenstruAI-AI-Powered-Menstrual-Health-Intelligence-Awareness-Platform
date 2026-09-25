import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trackingService } from '../services/trackingService';
import Modal from '../components/Modal';
import {
  Calendar,
  Clock,
  Trash2,
  Edit2,
  Eye,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Droplet,
  Smile,
  Moon,
} from 'lucide-react';

const HistoryPage = () => {
  const [records, setRecords] = useState([]);
  const [symptomsList, setSymptomsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFlow, setFilterFlow] = useState('ALL');

  // Modals state
  const [viewRecord, setViewRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    start_date: '',
    end_date: '',
    flow: 'Medium',
    mood: 'Good',
    sleep: 'Good',
    notes: '',
    symptom_ids: [],
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const [recs, syms] = await Promise.all([
        trackingService.getRecords(),
        trackingService.getSymptoms(),
      ]);
      setRecords(recs);
      setSymptomsList(syms);
    } catch (err) {
      console.error('Failed to load records:', err);
      setError('Could not retrieve tracking records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const openEditModal = (rec) => {
    setEditRecord(rec);
    setEditForm({
      start_date: rec.start_date,
      end_date: rec.end_date || '',
      flow: rec.flow || 'Medium',
      mood: rec.mood || 'Good',
      sleep: rec.sleep || 'Good',
      notes: rec.notes || '',
      symptom_ids: rec.symptoms.map((s) => s.id),
    });
  };

  const toggleEditSymptom = (symId) => {
    setEditForm((prev) => ({
      ...prev,
      symptom_ids: prev.symptom_ids.includes(symId)
        ? prev.symptom_ids.filter((id) => id !== symId)
        : [...prev.symptom_ids, symId],
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editRecord) return;
    setSavingEdit(true);
    try {
      await trackingService.updateRecord(editRecord.id, {
        start_date: editForm.start_date,
        end_date: editForm.end_date || null,
        flow: editForm.flow,
        mood: editForm.mood,
        sleep: editForm.sleep,
        notes: editForm.notes,
        symptom_ids: editForm.symptom_ids,
      });
      setEditRecord(null);
      await fetchRecords();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update record');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteRecord = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await trackingService.deleteRecord(deleteTargetId);
      setDeleteTargetId(null);
      await fetchRecords();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete record');
    } finally {
      setDeleting(false);
    }
  };

  // Filtered records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.symptoms.some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.start_date.includes(searchTerm);

    const matchesFlow = filterFlow === 'ALL' || r.flow === filterFlow;

    return matchesSearch && matchesFlow;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
            History Log
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Tracking History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Chronological log of your health observations, flow trends, and symptoms.
          </p>
        </div>

        <Link
          to="/track"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Observation</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search symptoms, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Flow:</span>
          {['ALL', 'Light', 'Medium', 'Heavy'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterFlow(opt)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterFlow === opt
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Records Table / Cards View */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Loading your history logs...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Matching Observations Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {records.length === 0
              ? 'You have not recorded any health observations yet. Click "New Observation" to begin.'
              : 'Try changing your search keywords or flow filter.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Date</th>
                  <th className="py-3.5 px-4">Flow</th>
                  <th className="py-3.5 px-4">Symptoms</th>
                  <th className="py-3.5 px-4">Mood</th>
                  <th className="py-3.5 px-4">Sleep</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-semibold text-slate-800">
                      <div>
                        {new Date(r.start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      {r.end_date && r.end_date !== r.start_date && (
                        <span className="text-[11px] text-slate-400 font-normal">
                          to {new Date(r.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {r.flow ? (
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            r.flow === 'Heavy'
                              ? 'bg-red-100 text-red-700'
                              : r.flow === 'Medium'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-pink-100 text-pink-700'
                          }`}
                        >
                          {r.flow}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {r.symptoms.length > 0 ? (
                          r.symptoms.map((s) => (
                            <span
                              key={s.id}
                              className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                            >
                              {s.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">None</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-slate-700">
                      {r.mood ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-100 text-[11px]">
                          {r.mood}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-slate-700">
                      {r.sleep ? (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-100 text-[11px]">
                          {r.sleep}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewRecord(r)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(r)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Edit Record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(r.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      <Modal
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
        title="Observation Details"
        maxWidth="max-w-md"
      >
        {viewRecord && (
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-rose-600 font-semibold uppercase">Date Logged</span>
                <p className="font-bold text-slate-800">
                  {viewRecord.start_date}
                  {viewRecord.end_date && ` to ${viewRecord.end_date}`}
                </p>
              </div>
              {viewRecord.flow && (
                <span className="px-2.5 py-1 bg-white border border-rose-200 text-rose-700 font-bold rounded-lg text-xs">
                  {viewRecord.flow} Flow
                </span>
              )}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Symptoms
              </span>
              <div className="flex flex-wrap gap-1.5">
                {viewRecord.symptoms.length > 0 ? (
                  viewRecord.symptoms.map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium"
                    >
                      {s.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">None logged</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-400 block">Mood</span>
                <span className="font-semibold text-slate-700">{viewRecord.mood || 'Not recorded'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-400 block">Sleep Quality</span>
                <span className="font-semibold text-slate-700">{viewRecord.sleep || 'Not recorded'}</span>
              </div>
            </div>

            {viewRecord.notes && (
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-xs text-slate-400 font-semibold block uppercase">Notes</span>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {viewRecord.notes}
                </p>
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setViewRecord(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={!!editRecord}
        onClose={() => setEditRecord(null)}
        title="Edit Observation"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Start Date</label>
              <input
                type="date"
                value={editForm.start_date}
                onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl text-xs outline-hidden"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">End Date</label>
              <input
                type="date"
                value={editForm.end_date}
                onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl text-xs outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Flow</label>
            <select
              value={editForm.flow}
              onChange={(e) => setEditForm({ ...editForm, flow: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-xl text-xs outline-hidden"
            >
              <option value="Light">Light</option>
              <option value="Medium">Medium</option>
              <option value="Heavy">Heavy</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Symptoms</label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 border border-slate-100 rounded-xl">
              {symptomsList.map((s) => {
                const active = editForm.symptom_ids.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleEditSymptom(s.id)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      active
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Mood</label>
              <select
                value={editForm.mood}
                onChange={(e) => setEditForm({ ...editForm, mood: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl text-xs outline-hidden"
              >
                <option value="Good">Good</option>
                <option value="Okay">Okay</option>
                <option value="Low">Low</option>
                <option value="Irritated">Irritated</option>
                <option value="Stressed">Stressed</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Sleep</label>
              <select
                value={editForm.sleep}
                onChange={(e) => setEditForm({ ...editForm, sleep: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl text-xs outline-hidden"
              >
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Notes</label>
            <textarea
              rows={2}
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-xl text-xs outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditRecord(null)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingEdit}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              {savingEdit ? 'Saving...' : 'Update Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Confirm Deletion"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete this observation record? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteTargetId(null)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteRecord}
              disabled={deleting}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HistoryPage;
