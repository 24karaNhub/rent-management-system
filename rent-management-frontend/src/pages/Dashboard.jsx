import { useEffect, useState, useRef } from "react";
import { 
  getAllLandlords, 
  getPropertiesByLandlord, 
  getTenantsByLandlord, 
  getPaymentsByLandlord, 
  createPayment,
  importFromExcel
} from "../services/api";
import { Card } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";

function fmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function StatCard({ label, value, sub, icon, highlight = false, propertiesCount = 0, tenantsCount = 0 }) {
  if (highlight) {
    const totalUnits = propertiesCount;
    const occupiedUnits = Math.min(tenantsCount, totalUnits);
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    return (
      <Card className="relative overflow-hidden group border border-brand-ink/10 lg:col-span-2 bg-brand-ink text-brand-plaster border-brand-ink shadow-lg shadow-brand-ink/5 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10 h-full">
          {/* Left Side */}
          <div className="flex flex-col justify-between h-full gap-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-plaster/10 text-brand-brass">
              {icon}
            </div>
            <div>
              <h4 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-brand-plaster mb-1">{value}</h4>
              <p className="text-[10px] font-mono uppercase tracking-widest text-brand-brass">{label}</p>
              <div className="flex items-center gap-1.5 mt-2.5 text-xs text-brand-forest font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+12.4% this month</span>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col justify-between h-full gap-4 border-t md:border-t-0 md:border-l border-brand-plaster/10 pt-6 md:pt-0 md:pl-6">
            {/* Minimalist Brass Line Chart */}
            <div className="w-full">
              <p className="text-[9px] font-mono uppercase tracking-widest text-brand-chalk mb-2">Revenue Trend</p>
              <div className="h-16 flex items-end">
                <svg className="w-full h-full text-brand-brass/65" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
                  <path
                    d="M0,38 L15,30 L30,35 L45,15 L60,25 L75,5 L90,18 L100,2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0,38 L15,30 L30,35 L45,15 L60,25 L75,5 L90,18 L100,2 L100,40 L0,40 Z"
                    fill="url(#brass-grad)"
                    opacity="0.08"
                  />
                  <defs>
                    <linearGradient id="brass-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C5A880" />
                      <stop offset="100%" stopColor="#C5A880" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Occupancy Grid */}
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-brand-chalk mb-2">Occupancy Grid</p>
              {totalUnits > 0 ? (
                <>
                  <div className="flex flex-wrap gap-1.5 max-w-[200px] mb-3">
                    {Array.from({ length: totalUnits }).map((_, i) => (
                      <div
                        key={i}
                        title={i < occupiedUnits ? "Occupied Unit" : "Vacant Unit"}
                        className={`w-3 h-3 rounded-sm transition-all ${
                          i < occupiedUnits 
                            ? "bg-brand-brass" 
                            : "border border-brand-plaster/20 bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-baseline text-xs mt-1">
                    <span className="font-mono text-brand-plaster/90">{occupiedUnits} / {totalUnits} Occupied</span>
                    <span className="font-mono text-brand-brass font-bold text-sm">{occupancyRate}%</span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-brand-chalk/60 font-mono">No properties listed</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Non-highlight standard card layout
  return (
    <Card className="relative overflow-hidden group border border-brand-ink/10 transition-all duration-300 bg-brand-alabaster p-6 sm:p-8">
      <div className="relative z-10 flex flex-col items-start h-full justify-between gap-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-plaster text-brand-brass">
          {icon}
        </div>
        <div>
          <h4 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-1 text-brand-ink">{value}</h4>
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-chalk">{label}</p>
          <p className="text-xs mt-1.5 text-brand-chalk/60">{sub}</p>
        </div>
      </div>
    </Card>
  );
}

function AddPaymentModal({ isOpen, onClose, onSaved }) {
  const [form, setForm] = useState({ tenantName: "", propertyName: "", amount: "", status: "PAID", dueDate: "" });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSave() {
    setSaving(true);
    try {
      await createPayment({ ...form, amount: parseFloat(form.amount) || 0 });
      onSaved();
      onClose();
    } catch (e) { 
      alert("Could not save: " + e.message); 
    } finally { 
      setSaving(false); 
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Payment" maxWidth="max-w-md">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Tenant Name</label>
          <input 
            type="text" name="tenantName" placeholder="e.g. Ramesh Gupta"
            value={form.tenantName} onChange={handleChange} 
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Property / Unit</label>
          <input 
            type="text" name="propertyName" placeholder="e.g. Flat 2B"
            value={form.propertyName} onChange={handleChange} 
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Amount (₹)</label>
          <input 
            type="number" name="amount" placeholder="e.g. 12000"
            value={form.amount} onChange={handleChange} 
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
          <select 
            name="status" value={form.status} onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
          >
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Due / Paid Date</label>
          <input 
            type="date" name="dueDate"
            value={form.dueDate} onChange={handleChange} 
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all [color-scheme:light_dark]"
          />
        </div>
        
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-700">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={saving} onClick={handleSave}>Save Payment</Button>
        </div>
      </div>
    </Modal>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState({ landlords: 0, properties: 0, tenants: 0, revenue: 0, totalRooms: 0, occupiedRooms: 0, vacantRooms: 0 });
  const [recentPayments, setRecentPayments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [importing, setImporting] = useState(false);
  
  const fileInputRef = useRef(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const landlordId = localStorage.getItem("landlordId");
      if (!landlordId) {
        setError("Not logged in. Please log in.");
        setLoading(false);
        return;
      }

      const [p, t, pay] = await Promise.all([
        getPropertiesByLandlord(landlordId).catch(() => []),
        getTenantsByLandlord(landlordId).catch(() => []),
        getPaymentsByLandlord(landlordId).catch(() => [])
      ]);
      
      const propertiesList = Array.isArray(p) ? p : [];
      const landlords = 1;
      const properties = propertiesList.length;
      const tenants = Array.isArray(t) ? t.filter(x => (x.status || "").toUpperCase() === "ACTIVE").length : 0;

      // Aggregate room occupancy across all properties
      let totalRooms = 0, occupiedRooms = 0;
      propertiesList.forEach(prop => {
        const rooms = prop.rooms || [];
        totalRooms += rooms.length;
        occupiedRooms += rooms.filter(r => r.status === "OCCUPIED").length;
      });
      const vacantRooms = totalRooms - occupiedRooms;
      
      const paymentsList = Array.isArray(pay) ? pay : [];
      const revenue = paymentsList
        .filter(p => (p.status || "").toUpperCase() === "PAID")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      setSummary({ landlords, properties, tenants, revenue, totalRooms, occupiedRooms, vacantRooms });
      setProperties(propertiesList);
      setTenants(Array.isArray(t) ? t : []);
      setAllPayments(paymentsList);
      
      setRecentPayments([...paymentsList]
        .sort((a, b) => new Date(b.paidDate || b.dueDate) - new Date(a.paidDate || a.dueDate))
        .slice(0, 5)
      );

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const landlordId = localStorage.getItem("landlordId");
    if (!landlordId) {
      alert("Please login first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("landlordId", landlordId);

    setImporting(true);
    try {
      const res = await importFromExcel(formData);
      alert(res || "Import successful!");
      loadData(); // refresh dashboard data
    } catch (err) {
      alert("Failed to import Excel file: " + (err.response?.data?.message || err.message));
    } finally {
      setImporting(false);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const columns = [
    { 
      header: "Tenant", 
      render: (p) => (
        <div className="flex items-center gap-3 w-max">
          <div className="w-8 h-8 rounded-full bg-brand-plaster text-brand-brass border border-brand-brass/25 flex items-center justify-center font-bold text-xs">
            {(p.tenantName || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-brand-ink leading-tight">{p.tenantName || "—"}</p>
            <p className="text-xs text-brand-chalk mt-0.5">{p.propertyName || p.unitNumber || "Unknown Property"}</p>
          </div>
        </div>
      ) 
    },
    { 
      header: "Amount", 
      className: "text-right",
      render: (p) => <span className="font-mono font-bold text-brand-ink bg-brand-plaster/50 border border-brand-ink/5 px-2.5 py-1.5 rounded-lg">{fmt(p.amount || p.rentAmount)}</span>
    },
    { 
      header: "Status", 
      className: "text-center",
      render: (p) => {
        const s = (p.status || "pending").toLowerCase();
        const colors = {
          paid: "bg-brand-forest/10 border-brand-forest/20 text-brand-forest",
          pending: "bg-brand-brass/10 border-brand-brass/20 text-brand-brass",
          overdue: "bg-brand-rust/10 border-brand-rust/20 text-brand-rust"
        };
        return (
          <span className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest rounded-lg border ${colors[s] || colors.pending}`}>
            {s}
          </span>
        );
      }
    },
    { 
      header: "Date",
      className: "text-right",
      render: (p) => {
        const d = (p.status || "").toLowerCase() === "paid" ? p.paidDate : p.dueDate;
        return <span className="text-brand-chalk font-mono text-xs">{d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>;
      }
    }
  ];

  // Dynamic Personalization of Upcoming panel
  const activeTenants = tenants.filter(x => (x.status || "").toUpperCase() === "ACTIVE");
  
  // Item 1: Rent Collection
  const pendingOrOverduePayment = allPayments.find(payItem => {
    const s = (payItem.status || "").toUpperCase();
    return s === "PENDING" || s === "OVERDUE";
  });

  let rentCollectionItem = {
    title: "Rent Collection",
    property: "Flat A-101",
    amount: "₹12,000",
    dueText: "Due in 2 days",
    statusColor: "bg-brand-forest",
    statusName: "On Track"
  };

  if (pendingOrOverduePayment) {
    const isOverdue = (pendingOrOverduePayment.status || "").toUpperCase() === "OVERDUE";
    let dueStr = "Pending";
    if (pendingOrOverduePayment.dueDate) {
      const diffTime = new Date(pendingOrOverduePayment.dueDate) - new Date();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        dueStr = `Overdue by ${Math.abs(diffDays)} days`;
      } else if (diffDays === 0) {
        dueStr = "Due today";
      } else {
        dueStr = `Due in ${diffDays} days`;
      }
    }
    
    rentCollectionItem = {
      title: "Rent Collection",
      property: pendingOrOverduePayment.propertyName || pendingOrOverduePayment.tenantName || "Leased Unit",
      amount: fmt(pendingOrOverduePayment.amount),
      dueText: dueStr,
      statusColor: isOverdue ? "bg-brand-rust" : "bg-brand-forest",
      statusName: isOverdue ? "Urgent" : "On Track"
    };
  } else if (activeTenants.length > 0) {
    // Pick the first active tenant to schedule a collection
    const sampleTenant = activeTenants[0];
    rentCollectionItem = {
      title: "Rent Collection",
      property: sampleTenant.propertyAddress || sampleTenant.name || "Flat A-101",
      amount: fmt(sampleTenant.rent || sampleTenant.rentAmount),
      dueText: "Due in 5 days",
      statusColor: "bg-brand-forest",
      statusName: "On Track"
    };
  } else {
    rentCollectionItem = {
      title: "Rent Collection",
      property: "No active tenants",
      amount: "₹0",
      dueText: "No pending collection",
      statusColor: "bg-brand-brass",
      statusName: "Scheduled"
    };
  }

  // Item 2: Painting Work (Scheduled maintenance)
  let paintingItem = {
    title: "Painting Work",
    property: "Block B",
    dueText: "Jun 12",
    statusColor: "bg-brand-brass",
    statusName: "Scheduled"
  };

  if (properties.length > 0) {
    paintingItem.property = properties[0].address || properties[0].name || "Block B";
    // We can show a scheduled date next week
    const schedDate = new Date();
    schedDate.setDate(schedDate.getDate() + 4);
    paintingItem.dueText = schedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  // Item 3: Plumbing Repair (Awaiting approval/urgent maintenance)
  let plumbingItem = {
    title: "Plumbing Repair",
    property: "Flat C-203",
    dueText: "High Priority",
    statusColor: "bg-brand-rust",
    statusName: "Pending Approval"
  };

  if (properties.length > 1) {
    plumbingItem.property = properties[1].address || properties[1].name || "Flat C-203";
  } else if (activeTenants.length > 0) {
    plumbingItem.property = activeTenants[activeTenants.length - 1].propertyAddress || "Flat C-203";
  } else if (properties.length > 0) {
    plumbingItem.property = properties[0].address || "Flat C-203";
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 pb-6 border-b border-brand-ink/10">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-ink tracking-tight">Executive Dashboard</h1>
          <p className="text-xs font-mono uppercase tracking-widest text-brand-brass mt-1.5">Portfolio Metrics & Performance Ledger</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            accept=".xlsx, .xls"
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <Button variant="secondary" loading={importing} onClick={() => fileInputRef.current?.click()}>
             <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
             {importing ? "Importing..." : "Import Excel"}
          </Button>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Payment
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-brand-rust/5 border border-brand-rust/15 text-brand-rust rounded-2xl text-xs font-mono shadow-sm">
          <span className="font-semibold">⚠️ Alert:</span> Could not fetch data. {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-brand-plaster border border-brand-ink/5 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              label="Total Revenue" 
              value={fmt(summary.revenue)} 
              sub="Collected ledger receipts in period" 
              highlight={true}
              propertiesCount={summary.properties}
              tenantsCount={summary.tenants}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard 
              label="Welcome Back" value={JSON.parse(localStorage.getItem('user'))?.name || "Landlord"} sub="Executive profile overview"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            />
            <StatCard 
              label="Total Properties" value={summary.properties} sub="Managed buildings & units" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            />
            <StatCard 
              label="Total Tenants" value={summary.tenants} sub="Active lease contracts" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
            <StatCard 
              label="Occupied Rooms" value={summary.occupiedRooms} sub={`of ${summary.totalRooms} total rooms`}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
            />
            <StatCard 
              label="Vacant Rooms" value={summary.vacantRooms} sub="Available for new tenants"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>}
            />
            <Card className="relative overflow-hidden border border-brand-ink/10 bg-brand-alabaster p-6 sm:p-8 sm:col-span-2 lg:col-span-3 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-baseline mb-5 pb-3 border-b border-brand-ink/5">
                  <h3 className="font-display text-lg font-bold text-brand-ink uppercase tracking-wider">Upcoming</h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-brass font-bold">Next 7 Days</span>
                </div>
                
                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-brand-ink/10 hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${rentCollectionItem.statusColor} shrink-0`} title={rentCollectionItem.statusName} />
                      <div>
                        <h5 className="text-sm font-semibold text-brand-ink">{rentCollectionItem.title}</h5>
                        <p className="text-xs text-brand-chalk/80">{rentCollectionItem.property}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-bold text-brand-ink">{rentCollectionItem.amount}</p>
                      <p className={`text-[10px] font-mono ${rentCollectionItem.statusColor === "bg-brand-rust" ? "text-brand-rust" : "text-brand-forest"} font-semibold uppercase tracking-wider`}>{rentCollectionItem.dueText}</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-brand-ink/10 hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${paintingItem.statusColor} shrink-0`} title={paintingItem.statusName} />
                      <div>
                        <h5 className="text-sm font-semibold text-brand-ink">{paintingItem.title}</h5>
                        <p className="text-xs text-brand-chalk/80">{paintingItem.property}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-brand-brass uppercase tracking-wider">{paintingItem.statusName}</p>
                      <p className="text-[10px] font-mono text-brand-chalk/60 uppercase">{paintingItem.dueText}</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center justify-between hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${plumbingItem.statusColor} shrink-0`} title={plumbingItem.statusName} />
                      <div>
                        <h5 className="text-sm font-semibold text-brand-ink">{plumbingItem.title}</h5>
                        <p className="text-xs text-brand-chalk/80">{plumbingItem.property}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-brand-rust uppercase tracking-wider">{plumbingItem.statusName}</p>
                      <p className="text-[10px] font-mono text-brand-chalk/60 uppercase">{plumbingItem.dueText}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-brand-ink/5">
                <a href="#" className="text-xs font-semibold text-brand-brass hover:text-brand-brass/80 transition-colors inline-flex items-center gap-1 font-mono uppercase tracking-widest">
                  View Full Schedule →
                </a>
              </div>
            </Card>
          </div>

          <Card title="Recent Transactions" className="mt-8">
            <Table 
              columns={columns} 
              data={recentPayments} 
              keyExtractor={(item) => item.id} 
              emptyMessage="No recent payments." 
            />
          </Card>
        </>
      )}

      <AddPaymentModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSaved={loadData} 
      />
    </div>
  );
}