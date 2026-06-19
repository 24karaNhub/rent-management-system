import { useEffect, useState } from "react";
import { getPaymentsByLandlord, updatePayment, updatePaymentStatus, getPropertiesByLandlord, getTenantsOfProperty } from "../services/api";
import { Card } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";

const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

function EditPaymentModal({ isOpen, onClose, payment, onSaved }) {
  const [form, setForm] = useState({
    rent: "", status: "PAID", month: "", date: "", propertyId: "", tenantId: ""
  });
  const [propertiesList, setPropertiesList] = useState([]);
  const [tenantsList, setTenantsList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (isOpen && payment) {
      setForm({
        rent: payment.amount || payment.rentAmount || "",
        status: payment.status || "PENDING",
        month: payment.month || "",
        date: payment.date || "",
        propertyId: payment.propertyId || "",
        tenantId: payment.tenantId || ""
      });
      setValidationError(null);

      const landlordId = localStorage.getItem("landlordId");
      if (landlordId) {
        getPropertiesByLandlord(landlordId)
          .then(data => setPropertiesList(data || []))
          .catch(err => console.error("Error fetching properties:", err));
      }
    }
  }, [isOpen, payment]);

  useEffect(() => {
    if (isOpen && form.propertyId) {
      getTenantsOfProperty(form.propertyId)
        .then(data => setTenantsList(data || []))
        .catch(err => console.error("Error fetching tenants:", err));
    } else {
      setTenantsList([]);
    }
  }, [isOpen, form.propertyId]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setValidationError(null);
  };

  const handlePropertyChange = (e) => {
    const propId = e.target.value;
    setForm(prev => ({ ...prev, propertyId: propId, tenantId: "" }));
  };

  async function handleSave() {
    if (!form.propertyId) { setValidationError("Property is required."); return; }
    if (!form.tenantId) { setValidationError("Tenant is required."); return; }
    if (!form.rent || parseFloat(form.rent) <= 0) { setValidationError("Rent amount must be greater than zero"); return; }
    if (!form.month) { setValidationError("Month is required."); return; }
    if (!form.date) { setValidationError("Date is required."); return; }

    setSaving(true);
    setValidationError(null);
    try {
      const landlordId = localStorage.getItem("landlordId");
      await updatePayment(payment.id, {
        rent: parseFloat(form.rent),
        month: form.month.toUpperCase(),
        date: form.date,
        status: form.status,
        tenantId: parseInt(form.tenantId),
        propertyId: parseInt(form.propertyId),
        landlordId: parseInt(landlordId)
      });
      onSaved("Payment updated successfully");
      onClose();
    } catch (e) {
      let msg = "Could not save: " + e.message;
      if (e.response?.data) {
        const data = e.response.data;
        if (typeof data === "string") msg = data;
        else if (data.message) msg = data.message;
        else if (typeof data === "object") {
          const vals = Object.values(data);
          if (vals.length > 0) msg = vals.join(", ");
        }
      }
      setValidationError(msg);
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Payment" maxWidth="max-w-xl">
      {validationError && (
        <div className="mb-6 p-4 bg-brand-rust/5 border border-brand-rust/15 text-brand-rust rounded-xl text-xs font-mono">
          {validationError}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Property</label>
          <select name="propertyId" value={form.propertyId} onChange={handlePropertyChange} className={inputClass}>
            <option value="">Select a property</option>
            {propertiesList.map(p => (
              <option key={p.id} value={p.id}>{p.name || p.type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Tenant</label>
          <select name="tenantId" value={form.tenantId} onChange={handleChange} className={inputClass} disabled={!form.propertyId}>
            <option value="">Select a tenant</option>
            {tenantsList.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Amount (₹)</label>
          <input type="number" name="rent" value={form.rent} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Month</label>
          <select name="month" value={form.month} onChange={handleChange} className={inputClass}>
            <option value="">Select Month</option>
            {MONTHS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300 mb-1.5">Due / Payment Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className={inputClass} />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-700">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" loading={saving} onClick={handleSave}>Save Changes</Button>
      </div>
    </Modal>
  );
}

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  async function load(successMsg = null) {
    setLoading(true);
    try {
      const landlordId = localStorage.getItem("landlordId");
      const data = await getPaymentsByLandlord(landlordId);
      setPayments(Array.isArray(data) ? data : []);
      if (successMsg && typeof successMsg === "string") {
        showToast(successMsg);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkPaid(p) {
    try {
      await updatePaymentStatus(p.id, "PAID");
      load("Payment marked as paid");
    } catch (e) {
      const backendMsg = e.response?.data?.message || e.response?.data;
      const friendly = typeof backendMsg === "string"
        ? backendMsg
        : "Unable to update payment status. Please try again.";
      showToast(friendly);
    }
  }

  useEffect(() => { load(); }, []);

  const columns = [
    {
      header: "Origination",
      render: (p) => (
        <div className="flex items-center gap-3 w-max">
          <div className="w-9 h-9 rounded-xl bg-brand-plaster text-brand-brass border border-brand-brass/25 flex items-center justify-center font-bold text-xs">
            {(p.tenantName || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-brand-ink leading-tight">{p.tenantName || "—"}</p>
            <p className="text-xs font-medium text-brand-chalk mt-0.5">{p.propertyName || p.unitNumber || "—"}</p>
          </div>
        </div>
      )
    },
    {
      header: "Amount",
      render: (p) => <span className="font-mono font-bold text-brand-ink bg-brand-plaster/50 border border-brand-ink/5 px-2.5 py-1.5 rounded-lg">₹{(p.amount || p.rentAmount || 0).toLocaleString("en-IN")}</span>
    },
    {
      header: "Status",
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
      header: "Due/Paid Date",
      className: "text-right",
      render: (p) => {
        const d = p.date || p.paidDate || p.dueDate;
        return <span className="text-brand-chalk font-mono text-xs">{d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>;
      }
    },
    {
      header: "",
      render: (p) => (
        <div className="flex gap-2">
          {(p.status || "").toUpperCase() !== "PAID" && (
            <button
              onClick={() => handleMarkPaid(p)}
              className="text-xs font-mono uppercase tracking-widest text-brand-forest hover:text-brand-ink transition-colors px-2.5 py-1.5 rounded-lg border border-brand-forest/20 hover:border-brand-forest/50">
              Mark Paid
            </button>
          )}
          <button
            onClick={() => {
              setSelectedPayment(p);
              setShowEdit(true);
            }}
            className="text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-brand-ink transition-colors px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-400">
            Edit
          </button>
        </div>
      )
    }
  ];

  const totalCollected = payments
    .filter(p => (p.status || "").toUpperCase() === "PAID")
    .reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {successToast && (
        <div className="fixed top-24 right-8 bg-brand-forest text-brand-plaster font-semibold text-sm px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
          <span>✅</span>
          <span>{successToast}</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 pb-6 border-b border-brand-ink/10">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-ink tracking-tight">Payments Ledger</h1>
          <p className="text-xs font-mono uppercase tracking-widest text-brand-brass mt-1.5">Review all transaction receipts globally</p>
        </div>
        <div className="bg-brand-plaster border border-brand-ink/10 p-4 rounded-2xl shadow-sm flex flex-col min-w-[180px]">
          <span className="text-[10px] font-mono font-medium text-brand-chalk uppercase tracking-widest block mb-1">Total Collected</span>
          <span className="text-2xl font-mono font-bold text-brand-forest block">₹{totalCollected.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-brand-rust/5 border border-brand-rust/15 text-brand-rust rounded-2xl text-xs font-mono shadow-sm">
          Warning: Could not fetch data. {error}
        </div>
      ) : loading ? (
        <div className="h-96 bg-brand-plaster border border-brand-ink/5 rounded-3xl animate-pulse"></div>
      ) : (
        <Card title="Global Ledger">
          <Table columns={columns} data={payments} keyExtractor={p => p.id} emptyMessage="No transactions stored in database." />
        </Card>
      )}

      <EditPaymentModal isOpen={showEdit} onClose={() => setShowEdit(false)} payment={selectedPayment} onSaved={load} />
    </div>
  );
}