import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllLandlords, createLandlord } from "../services/api";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";

function AddLandlordModal({ isOpen, onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) { setForm({ name: "", email: "", phone: "" }); setErrors({}); }
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  async function handleSave() {
    setErrors({});
    setSaving(true);
    try {
      await createLandlord(form);
      onSaved();
      onClose();
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "object" && !Array.isArray(data)) setErrors(data);
        else setErrors({ general: data.message || "Validation failed" });
      } else {
        setErrors({ general: "Cannot connect to server!" });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Landlord" maxWidth="max-w-md">
      <div className="space-y-5">
        {errors.general && (
          <div className="p-4 bg-rose-50/80 backdrop-blur-sm text-rose-700 border border-rose-200 rounded-2xl text-sm shadow-sm font-medium">
            {errors.general}
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
          <input
            type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Karan Singh"
            className={`w-full rounded-xl border ${errors.name ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'} px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:ring-2 text-sm transition-all placeholder:text-slate-400`}
          />
          {errors.name && <p className="text-rose-500 text-xs mt-1.5 font-medium pl-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
          <input
            type="email" name="email" value={form.email} onChange={handleChange} placeholder="e.g. karan@gmail.com"
            className={`w-full rounded-xl border ${errors.email ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'} px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:ring-2 text-sm transition-all placeholder:text-slate-400`}
          />
          {errors.email && <p className="text-rose-500 text-xs mt-1.5 font-medium pl-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
          <input
            type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="10 Digits"
            className={`w-full rounded-xl border ${errors.phone ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'} px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:ring-2 text-sm transition-all placeholder:text-slate-400`}
          />
          {errors.phone && <p className="text-rose-500 text-xs mt-1.5 font-medium pl-1">{errors.phone}</p>}
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-700">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={saving} onClick={handleSave}>Save Landlord</Button>
        </div>
      </div>
    </Modal>
  );
}

export default function Landlords() {
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getAllLandlords();
      setLandlords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const total = landlords.length;
  const active = landlords.filter(l => l.name).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Landlords</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Manage platform property owners and their details.</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Landlord
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-6 py-4 flex items-center gap-4 shadow-sm min-w-[11rem]">
          <div>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{total}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Total</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-6 py-4 flex items-center gap-4 shadow-sm min-w-[11rem]">
          <div>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{active}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Active</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-200/50 dark:bg-slate-700/50 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {landlords.map((l) => (
            <div
              key={l.id}
              onClick={() => navigate(`/landlords/${l.id}`)}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold">
                  <span>{l.name?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/50">
                  ID: {l.id}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-3 group-hover:text-indigo-600 transition-colors">{l.name}</h3>
              <div className="space-y-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {l.email || "No Email Provided"}
                </p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {l.phone || "No Phone Provided"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddLandlordModal isOpen={showForm} onClose={() => setShowForm(false)} onSaved={loadData} />
    </div>
  );
}
