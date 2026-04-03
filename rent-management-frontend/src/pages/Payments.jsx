import { useEffect, useState } from "react";
import { getAllPayments, createPayment } from "../services/api";
import { Card } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { Button } from "../components/ui/Button";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await getAllPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const columns = [
    {
      header: "Origination",
      render: (p) => (
        <div className="flex items-center gap-3 w-max">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/30">
            {(p.tenantName || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{p.tenantName || "—"}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{p.propertyName || p.unitNumber || "—"}</p>
          </div>
        </div>
      )
    },
    {
      header: "Amount",
      render: (p) => <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">₹{(p.amount || p.rentAmount || 0).toLocaleString("en-IN")}</span>
    },
    {
      header: "Status",
      render: (p) => {
        const s = (p.status || "pending").toLowerCase();
        const colors = {
          paid: "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm",
          pending: "bg-amber-50 border-amber-200 text-amber-700 shadow-sm",
          overdue: "bg-rose-50 border-rose-200 text-rose-700 shadow-sm"
        };
        return (
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${colors[s] || colors.pending}`}>
            {s}
          </span>
        );
      }
    },
    {
      header: "Due/Paid Date",
      className: "text-right",
      render: (p) => {
        const d = (p.status || "").toLowerCase() === "paid" ? p.paidDate : p.dueDate;
        return <span className="text-slate-500 font-medium">{d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>;
      }
    }
  ];

  const totalCollected = payments
    .filter(p => (p.status || "").toUpperCase() === "PAID")
    .reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 bg-white/40 p-6 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Payments</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Review all rent and asset transactions globally.</p>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-[2px] rounded-2xl shadow-lg shadow-emerald-500/20">
          <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Total Collected</span>
              <span className="text-xl font-display font-bold text-emerald-600 block">₹{totalCollected.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-rose-50/80 backdrop-blur-sm text-rose-700 border border-rose-200 rounded-2xl text-sm shadow-sm">
          Warning: Could not fetch data. {error}
        </div>
      ) : loading ? (
        <div className="h-96 bg-slate-200/50 rounded-3xl animate-pulse"></div>
      ) : (
        <Card title="Global Ledger">
          <Table columns={columns} data={payments} keyExtractor={p => p.id} emptyMessage="No transactions stored in database." />
        </Card>
      )}
    </div>
  );
}