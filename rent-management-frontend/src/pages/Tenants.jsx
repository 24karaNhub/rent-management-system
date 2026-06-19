import { useEffect, useState } from "react";
import {getAllTenants, createTenant, getTenantsByLandlord, getPropertiesByLandlord, getRoomsOfProperty, updateTenantStatus} from "../services/api";
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
    moveInDate: "", property_id: "", roomId: ""
  });
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: "", phone: "", email: "",
        rentAmount: "", aadharNumber: "",
        moveInDate: "", property_id: "", roomId: ""
      });
      setRooms([]);
      setValidationError(null);
      
      const landlordId = localStorage.getItem("landlordId");
      if (landlordId) {
        getPropertiesByLandlord(landlordId)
          .then(data => {
            const list = Array.isArray(data) ? data : [];
            setProperties(list);
            if (list.length > 0) {
              const firstId = list[0].id.toString();
              setForm(prev => ({ ...prev, property_id: firstId }));
              fetchRooms(firstId);
            }
          })
          .catch(err => console.error("Failed to fetch properties", err));
      }
    }
  }, [isOpen]);

  async function fetchRooms(propertyId) {
    if (!propertyId) { setRooms([]); return; }
    setLoadingRooms(true);
    try {
      const data = await getRoomsOfProperty(propertyId);
      const vacantRooms = (Array.isArray(data) ? data : []).filter(r => r.status === "VACANT");
      setRooms(vacantRooms);
    } catch (e) {
      console.error("Failed to fetch rooms", e);
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === "property_id") {
      setForm(prev => ({ ...prev, roomId: "" }));
      fetchRooms(value);
    }
    setValidationError(null);
  };

  async function handleSave() {
    if (!form.name || !form.phone) {
      setValidationError("Name and phone are required.");
      return;
    }
    if (!form.property_id) {
      setValidationError("Please select a property.");
      return;
    }
    setSaving(true);
    setValidationError(null);
    try {
      const landlordId = localStorage.getItem("landlordId");
      await createTenant({
        name: form.name,
        email: form.email,
        phone: form.phone,
        rent: parseFloat(form.rentAmount) || 0,
        aadhar: form.aadharNumber,
        moveInDate: form.moveInDate || null,
        moveOutDate: null,
        landlord_id: parseInt(landlordId),
        property_id: parseInt(form.property_id),
        roomId: form.roomId ? parseInt(form.roomId) : null
      });
      onSaved();
      onClose();
    } catch (e) {
      setValidationError("Could not save: " + (e.response?.data?.message || e.message));
    } finally {
      setSaving(false);
    }
  }

  return (
      <Modal isOpen={isOpen} onClose={onClose} title="Add New Tenant" maxWidth="max-w-xl">
        {validationError && (
          <div className="mb-6 p-4 bg-brand-rust/5 border border-brand-rust/15 text-brand-rust rounded-xl text-xs font-mono">
            {validationError}
          </div>
        )}
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
            <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Property</label>
            <select name="property_id" value={form.property_id} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all">
              <option value="">Select a property</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name || p.type} — {p.city}
                </option>
              ))}
            </select>
          </div>
          {rooms.length > 0 && (
            <div>
              <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">
                Room Assignment
                <span className="ml-2 text-[10px] font-mono uppercase text-brand-chalk/60">({rooms.length} vacant)</span>
              </label>
              <select name="roomId" value={form.roomId} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all">
                <option value="">No specific room</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    Room {r.roomNumber}{r.rent ? ` — ₹${Number(r.rent).toLocaleString("en-IN")}/mo` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
          {loadingRooms && (
            <div className="text-[10px] font-mono text-brand-chalk/60 animate-pulse">Loading rooms...</div>
          )}
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

  async function toggleStatus(tenant) {
    const newStatus = (tenant.status || "").toUpperCase() === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await updateTenantStatus(tenant.id, newStatus);
      load();
    } catch (e) {
      alert("Could not update status: " + e.message);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = tenants.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (t.name || "").toLowerCase().includes(q) ||
      (t.propertyAddress || "").toLowerCase().includes(q) ||
      (t.phone || "").includes(q);
    const matchStatus = statusFilter === "ALL" ||
      (t.status || "").toUpperCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCount = tenants.filter(t => (t.status || "").toUpperCase() === "ACTIVE").length;

  const columns = [
    {
      header: "Tenant Overview",
      render: (t) => {
        const isActive = (t.status || "").toUpperCase() === "ACTIVE";
        return (
          <div className="flex items-center gap-4 w-max">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-brand-plaster text-brand-brass border border-brand-brass/25 flex items-center justify-center font-bold">
                {(t.name || "U").charAt(0).toUpperCase()}
              </div>
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border border-brand-alabaster rounded-full transition-colors ${isActive ? 'bg-brand-forest' : 'bg-brand-rust'}`}></span>
            </div>
            <div>
              <p className={`font-semibold leading-tight transition-colors ${isActive ? 'text-brand-ink' : 'text-brand-chalk/70'}`}>{t.name}</p>
              <p className="text-xs font-mono text-brand-chalk mt-0.5">{t.email || "No Email Provided"}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: "Unit Details",
      render: (t) => (
        <div>
          <p className="text-sm font-semibold text-brand-ink">{t.propertyAddress || "—"}</p>
          <p className="text-[10px] font-mono text-brand-chalk bg-brand-plaster border border-brand-ink/5 rounded px-1.5 py-0.5 mt-0.5 inline-block">ID: {t.property_id}</p>
        </div>
      )
    },
    {
      header: "Contact",
      render: (t) => (
        <span className="text-xs font-mono text-brand-chalk flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-brand-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          {t.phone || "—"}
        </span>
      )
    },
    {
      header: "Rent",
      render: (t) => <span className="font-mono font-semibold text-brand-ink bg-brand-plaster/50 px-2 py-0.5 rounded border border-brand-ink/5">{fmt(t.rent || t.rentAmount)}</span>
    },
    {
      header: "Status",
      render: (t) => {
        const isActive = (t.status || "").toUpperCase() === "ACTIVE";
        return (
          <button
            onClick={() => toggleStatus(t)}
            title={`Click to mark as ${isActive ? "Inactive" : "Active"}`}
            className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest rounded-lg border transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer ${
              isActive 
                ? 'bg-brand-forest/10 border-brand-forest/20 text-brand-forest hover:bg-brand-forest/15' 
                : 'bg-brand-rust/10 border-brand-rust/20 text-brand-rust hover:bg-brand-rust/15'
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </button>
        );
      }
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 pb-6 border-b border-brand-ink/10">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-ink tracking-tight">Tenants</h1>
          <p className="text-xs font-mono uppercase tracking-widest text-brand-brass mt-1.5">{activeCount} active tenant{activeCount !== 1 ? "s" : ""} across your properties</p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Tenant
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-brand-rust/5 border border-brand-rust/15 text-brand-rust rounded-2xl text-xs font-mono shadow-sm">
          Warning: Could not fetch data. {error}
        </div>
      )}

      <Card title="Tenant Directory">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 group">
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-chalk group-focus-within:text-brand-brass transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by name, property, or phone..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-brand-ink/10 rounded-xl text-sm focus:ring-1 focus:ring-brand-brass/30 focus:border-brand-brass outline-none bg-brand-plaster/50 text-brand-ink transition-all placeholder:text-brand-chalk/50"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-brand-ink/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-brand-brass/30 focus:border-brand-brass outline-none w-full sm:w-auto bg-brand-plaster/50 text-brand-ink transition-all"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {loading ? (
          <div className="h-96 bg-brand-plaster border border-brand-ink/5 rounded-[24px] animate-pulse"></div>
        ) : (
          <Table columns={columns} data={filtered} keyExtractor={t => t.id} emptyMessage="No tenants found." />
        )}
      </Card>

      <AddTenantModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSaved={load} />
    </div>
  );
}