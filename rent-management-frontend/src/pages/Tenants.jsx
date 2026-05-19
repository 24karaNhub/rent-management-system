import { useEffect, useState } from "react";
import {getAllTenants, createTenant, getTenantsByLandlord} from "../services/api";
import { Card } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";

function fmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function AddTenantModal({ isOpen, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    rentAmount: "", aadharNumber: "",
    moveInDate: "", property_id: ""  // ✅ add property_id, remove unused fields
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSave() {
    if (!form.name || !form.phone) { alert("Name and phone are required."); return; }
    setSaving(true);
    try {
      const landlordId = localStorage.getItem("landlordId"); // ✅ dynamic, not hardcoded 1
      await createTenant({
        name: form.name,
        email: form.email,
        phone: form.phone,
        rent: parseFloat(form.rentAmount) || 0,
        aadhar: form.aadharNumber,       // ✅ field name must match DTO
        MoveInDate: form.MoveInDate,     // ✅ capital M — must match DTO exactly
        moveOutDate: null,
        landlord_id: parseInt(landlordId), // ✅ from localStorage, not hardcoded
        property_id: parseInt(form.property_id) // ✅ from form
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
      <Modal isOpen={isOpen} onClose={onClose} title="Add New Tenant" maxWidth="max-w-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Ramesh Gupta" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="ramesh@example.com" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Monthly Rent (₹)</label>
            <input type="number" name="rentAmount" value={form.rentAmount} onChange={handleChange} placeholder="12000" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Move-in Date</label>
            <input type="date" name="moveInDate" value={form.moveInDate} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all [color-scheme:light_dark]" />
          </div>
          <div>
            <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Property ID</label>
            <input type="number" name="property_id" value={form.property_id} onChange={handleChange} placeholder="Enter property ID" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Aadhaar Number</label>
            <input type="text" name="aadharNumber" value={form.aadharNumber} onChange={handleChange} placeholder="1234-5678-9012" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-700">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={saving} onClick={handleSave}>Add Tenant</Button>
        </div>
      </Modal>
  );
}

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAdd, setShowAdd] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const landlordId=localStorage.getItem("landlordId")
      const data = await getTenantsByLandlord(landlordId);
      setTenants(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = tenants.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (t.name || "").toLowerCase().includes(q) ||
      (t.propertyName || "").toLowerCase().includes(q) ||
      (t.phone || "").includes(q);
    const matchStatus = statusFilter === "ALL" ||
      (t.status || "").toUpperCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCount = tenants.filter(t => (t.status || "").toUpperCase() === "ACTIVE").length;

  const columns = [
    {
      header: "Tenant Overview",
      render: (t) => (
        <div className="flex items-center gap-4 w-max">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 flex items-center justify-center font-bold">
              {(t.name || "U").charAt(0).toUpperCase()}
            </div>
            {(t.status || "").toUpperCase() === "ACTIVE" && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">{t.name}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{t.email || "No Email Provided"}</p>
          </div>
        </div>
      )
    },
    {
      header: "Unit Details",
      render: (t) => (
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.unitNumber || "—"}</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5 mt-0.5 inline-block">{t.propertyName || "Unknown Property"}</p>
        </div>
      )
    },
    {
      header: "Contact",
      render: (t) => (
        <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          {t.phone || "—"}
        </span>
      )
    },
    {
      header: "Rent",
      render: (t) => <span className="font-bold text-slate-900 dark:text-slate-100">{fmt(t.rentAmount)}</span>
    },
    {
      header: "Status",
      render: (t) => {
        const isActive = (t.status || "").toUpperCase() === "ACTIVE";
        return (
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${isActive ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 shadow-sm'}`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Tenants</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{activeCount} active tenant{activeCount !== 1 ? "s" : ""} across your properties</p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Tenant
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50/80 backdrop-blur-sm text-rose-700 border border-rose-200 rounded-2xl text-sm shadow-sm">
          Warning: Could not fetch data. {error}
        </div>
      )}

      <Card title="Tenant Directory">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 group">
            <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by name, property, or phone..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 transition-all font-medium placeholder:text-slate-400"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-full sm:w-auto bg-slate-50/50 dark:bg-slate-800/50 font-medium text-slate-700 dark:text-slate-300 transition-all"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {loading ? (
          <div className="h-96 bg-slate-50/50 rounded-2xl animate-pulse ring-1 ring-slate-100"></div>
        ) : (
          <Table columns={columns} data={filtered} keyExtractor={t => t.id} emptyMessage="No tenants found." />
        )}
      </Card>

      <AddTenantModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSaved={load} />
    </div>
  );
}