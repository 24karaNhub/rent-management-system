import { useEffect, useState } from "react";
import { 
  getAllLandlords, 
  getAllProperties, 
  getAllTenants, 
  getAllPayments, 
  createPayment 
} from "../services/api";
import { Card } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";

function fmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function StatCard({ label, value, sub, icon, gradient }) {
  return (
    <Card className={`relative overflow-hidden group border-0 ring-1 ring-slate-200/50 ${gradient}`}>
      <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div className="relative z-10 flex flex-col items-start h-full justify-between gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-1 ring-white/30 shadow-lg mb-2">
          {icon}
        </div>
        <div>
          <h4 className="text-3xl font-display font-bold text-white tracking-tight mb-1 drop-shadow-sm">{value}</h4>
          <p className="text-sm font-medium text-white/90 drop-shadow-sm">{label}</p>
          <p className="text-xs text-white/70 mt-1">{sub}</p>
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
          <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-1.5">Tenant Name</label>
          <input 
            type="text" name="tenantName" placeholder="e.g. Ramesh Gupta"
            value={form.tenantName} onChange={handleChange} 
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50/50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-1.5">Property / Unit</label>
          <input 
            type="text" name="propertyName" placeholder="e.g. Flat 2B"
            value={form.propertyName} onChange={handleChange} 
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50/50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-1.5">Amount (₹)</label>
          <input 
            type="number" name="amount" placeholder="e.g. 12000"
            value={form.amount} onChange={handleChange} 
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50/50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-1.5">Status</label>
          <select 
            name="status" value={form.status} onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50/50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
          >
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-1.5">Due / Paid Date</label>
          <input 
            type="date" name="dueDate"
            value={form.dueDate} onChange={handleChange} 
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50/50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
          />
        </div>
        
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={saving} onClick={handleSave}>Save Payment</Button>
        </div>
      </div>
    </Modal>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState({ landlords: 0, properties: 0, tenants: 0, revenue: 0 });
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [l, p, t, pay] = await Promise.all([
        getAllLandlords(),
        getAllProperties(),
        getAllTenants(),
        getAllPayments()
      ]);
      
      const landlords = Array.isArray(l) ? l.length : 0;
      const properties = Array.isArray(p) ? p.length : 0;
      const tenants = Array.isArray(t) ? t.length : 0;
      
      const paymentsList = Array.isArray(pay) ? pay : [];
      const revenue = paymentsList
        .filter(p => (p.status || "").toUpperCase() === "PAID")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      setSummary({ landlords, properties, tenants, revenue });
      
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

  const columns = [
    { 
      header: "Tenant", 
      render: (p) => (
        <div className="flex items-center gap-3 w-max">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
            {(p.tenantName || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900 leading-tight">{p.tenantName || "—"}</p>
            <p className="text-xs text-slate-500 mt-0.5">{p.propertyName || p.unitNumber || "Unknown Property"}</p>
          </div>
        </div>
      ) 
    },
    { 
      header: "Amount", 
      className: "text-right",
      render: (p) => <span className="font-semibold text-slate-900 bg-slate-100/50 px-2.5 py-1 rounded-md">{fmt(p.amount || p.rentAmount)}</span>
    },
    { 
      header: "Status", 
      className: "text-center",
      render: (p) => {
        const s = (p.status || "pending").toLowerCase();
        const colors = {
          paid: "bg-emerald-100 border-emerald-200 text-emerald-700 drop-shadow-sm",
          pending: "bg-amber-100 border-amber-200 text-amber-700 drop-shadow-sm",
          overdue: "bg-rose-100 border-rose-200 text-rose-700 drop-shadow-sm"
        };
        return (
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${colors[s] || colors.pending}`}>
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
        return <span className="text-slate-500 font-medium">{d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>;
      }
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 bg-white/40 p-6 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Metrics and performance of your real estate portfolio.</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Payment
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50/80 backdrop-blur-sm text-rose-700 border border-rose-200 rounded-2xl text-sm shadow-sm">
          <span className="font-semibold">⚠️ Warning:</span> Could not fetch data. {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-200/50 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              label="Total Landlords" value={summary.landlords} sub="Registered platform owners" 
              gradient="bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-500/20"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            />
            <StatCard 
              label="Total Properties" value={summary.properties} sub="Managed physical buildings" 
              gradient="bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/20"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            />
            <StatCard 
              label="Total Tenants" value={summary.tenants} sub="Active lease contracts" 
              gradient="bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/20"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
            <StatCard 
              label="Total Revenue" value={fmt(summary.revenue)} sub="Collected during this period" 
              gradient="bg-gradient-to-br from-rose-500 to-red-500 shadow-rose-500/20"
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
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