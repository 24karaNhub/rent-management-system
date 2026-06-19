import { useEffect, useState } from "react";
import { getPaymentsByLandlord } from "../services/api";
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
      const landlordId = localStorage.getItem("landlordId");
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
        const d = (p.status || "").toLowerCase() === "paid" ? p.paidDate : p.dueDate;
        return <span className="text-brand-chalk font-mono text-xs">{d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>;
      }
    }
  ];

  const totalCollected = payments
    .filter(p => (p.status || "").toUpperCase() === "PAID")
    .reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
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
    </div>
  );
}