import { useEffect, useState } from "react";
import { getAllProperties, createProperty } from "../services/api";
import { getPropertiesByLandlord } from"../services/api.js";
import { Card } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";

function AddPropertyModal({ isOpen, onClose, onSaved }) {
  const [form, setForm] = useState({ type: "", rent: "", city: "", address: "" , landlord_id: ""});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSave() {
    setSaving(true);
    try {
      const landlordId=localStorage.getItem("landlordId")
      await createProperty({
        ...form,
        type:form.type,
        rent: parseFloat(form.rent) || 0,
        city: form.city,
        address: form.address,
        landlord_id: parseInt(landlordId)
      });
      onSaved();
      onClose();
    } catch (e) {
      alert("Could not save: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
      <Modal isOpen={isOpen} onClose={onClose} title="Add New Property">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Property Type</label>
            <input type="text" name="type" value={form.type} onChange={handleChange}
                   placeholder="e.g. Flat, Villa, Shop"
                   className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Rent (₹)</label>
            <input type="number" name="rent" value={form.rent} onChange={handleChange}
                   placeholder="e.g. 12000"
                   className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange}
                     placeholder="e.g. Noida"
                     className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange}
                     placeholder="e.g. Sector 12"
                     className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={handleSave}>Save Property</Button>
          </div>
        </div>
      </Modal>
  );
}

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const landlordId=localStorage.getItem("landlordId")
      if(!landlordId){setError("Not logged In."); return;}
      const data = await getPropertiesByLandlord(landlordId);
      setProperties(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const columns = [
    {
      header: "Property Details",
      render: (p) => (
        <div className="flex items-center gap-3 w-max">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{p.name || "Unnamed Property"}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{p.address || "No address provided"}</p>
          </div>
        </div>
      )
    },
    {
      header: "Occupancy Rate",
      render: (p) => {
        const occ = p.occupiedUnits || 0;
        const tot = p.totalUnits || p.units || 1;
        const pct = Math.round((occ / tot) * 100);
        return (
          <div className="w-full max-w-[160px]">
            <div className="flex justify-between text-xs mb-1.5 px-0.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{occ} / {tot} Units</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{pct}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-700/50 inset-shadow-sm">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                style={{ width: `${pct}%` }}
              ></div>
            </div>
          </div>
        );
      }
    },
    {
      header: "Est. Monthly Revenue",
      className: "text-right",
      render: (p) => <span className="font-bold text-slate-900 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">₹{(p.monthlyRent || 0).toLocaleString("en-IN")}</span>
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 bg-white/40 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm shadow-sm">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 tracking-tight">Properties</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Manage physical locations and track occupancy.</p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Property
        </Button>
      </div>

      {error ? (
        <div className="p-4 bg-rose-50/80 dark:bg-rose-900/30 backdrop-blur-sm text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 rounded-2xl text-sm shadow-sm">
          Warning: Could not fetch data. {error}
        </div>
      ) : loading ? (
        <div className="h-96 bg-slate-200/50 dark:bg-slate-700/50 rounded-3xl animate-pulse"></div>
      ) : (
        <Card title="All Properties">
          <Table columns={columns} data={properties} keyExtractor={p => p.id} emptyMessage="No properties found. Click 'Add Property' to get started." />
        </Card>
      )}

      <AddPropertyModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSaved={load} />
    </div>
  );
}