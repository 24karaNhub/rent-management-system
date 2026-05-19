import { useEffect, useState } from "react";
import {getAllPayments, createPayment, getPaymentsByLandlord} from "../services/api";
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
      const landlordId=localStorage.getItem("landlordId")
      const data = await getPaymentsByLandlord(landlordId);
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
          <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-400 flex items-center justify-center font-bold">
            {(p.tenantName || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{p.tenantName || "—"}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{p.propertyName || p.unitNumber || "—"}</p>
          </div>
        </div>
      )
    },
    {
      header: "Amount",
      render: (p) => <span className="font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">₹{(p.amount || p.rentAmount || 0).toLocaleString("en-IN")}</span>
    },
    {
      header: "Status",
      render: (p) => {
        const s = (p.status || "pending").toLowerCase();
        const colors = {
          paid: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 shadow-sm",
          pending: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 shadow-sm",
          overdue: "bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 shadow-sm"
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
        return <span className="text-slate-500 dark:text-slate-400 font-medium">{d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>;
      }
    }
  ];

  const totalCollected = payments
    .filter(p => (p.status || "").toUpperCase() === "PAID")
    .reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Payments</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Review all rent and asset transactions globally.</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-0.5">Total Collected</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 block">₹{totalCollected.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-rose-50/80 dark:bg-rose-900/30 backdrop-blur-sm text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 rounded-2xl text-sm shadow-sm">
          Warning: Could not fetch data. {error}
        </div>
      ) : loading ? (
        <div className="h-96 bg-slate-200/50 dark:bg-slate-700/50 rounded-3xl animate-pulse"></div>
      ) : (
        <Card title="Global Ledger">
          <Table columns={columns} data={payments} keyExtractor={p => p.id} emptyMessage="No transactions stored in database." />
        </Card>
      )}
    </div>
  );
}