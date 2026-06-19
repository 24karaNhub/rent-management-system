import { useEffect, useState } from "react";
import { getPaymentsOfTenant } from "../services/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const [year, month, day] = String(dateStr).split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[parseInt(month) - 1]} ${year}`;
}

function formatMonth(monthStr) {
  if (!monthStr) return "—";
  const m = monthStr.charAt(0).toUpperCase() + monthStr.slice(1).toLowerCase();
  return m;
}

// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = (status || "").toUpperCase();
  const config = {
    PAID:    { dot: "bg-emerald-500", bg: "bg-emerald-50 border-emerald-200 text-emerald-700",    label: "Paid" },
    PENDING: { dot: "bg-amber-400",   bg: "bg-amber-50 border-amber-200 text-amber-700",          label: "Pending" },
    OVERDUE: { dot: "bg-rose-500",    bg: "bg-rose-50 border-rose-200 text-rose-700",             label: "Overdue" },
  };
  const c = config[s] || { dot: "bg-slate-400", bg: "bg-slate-50 border-slate-200 text-slate-600", label: status || "—" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold tracking-wide ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Summary Cards ─────────────────────────────────────────────────────────────

function SummaryCard({ label, value, sub, accent }) {
  const accents = {
    green:  "from-emerald-500/10 to-emerald-500/5 border-emerald-200/60",
    amber:  "from-amber-400/10 to-amber-400/5 border-amber-200/60",
    blue:   "from-indigo-500/10 to-indigo-500/5 border-indigo-200/60",
    slate:  "from-slate-400/10 to-slate-400/5 border-slate-200/60",
  };
  const valAccents = {
    green: "text-emerald-700",
    amber: "text-amber-700",
    blue:  "text-indigo-700",
    slate: "text-slate-700",
  };
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 ${accents[accent] || accents.slate}`}>
      <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold font-display tracking-tight ${valAccents[accent] || "text-slate-800"}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Info Row ──────────────────────────────────────────────────────────────────

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 w-32 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm font-semibold text-slate-800 text-right">{value || "—"}</span>
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p className="font-semibold text-slate-600 text-sm">No payment history available</p>
      <p className="text-xs text-slate-400 mt-1">Payments recorded for this tenant will appear here</p>
    </div>
  );
}

// ─── Tenant Profile Modal ──────────────────────────────────────────────────────

export default function TenantProfileModal({ isOpen, onClose, tenant }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !tenant?.id) return;
    setLoading(true);
    setError(null);
    getPaymentsOfTenant(tenant.id)
      .then(data => setPayments(Array.isArray(data) ? data : []))
      .catch(e => setError("Could not load payments: " + e.message))
      .finally(() => setLoading(false));
  }, [isOpen, tenant?.id]);

  if (!isOpen || !tenant) return null;

  // ── Summary computations ──
  const paid       = payments.filter(p => (p.status || "").toUpperCase() === "PAID");
  const pending    = payments.filter(p => (p.status || "").toUpperCase() === "PENDING");
  const overdue    = payments.filter(p => (p.status || "").toUpperCase() === "OVERDUE");
  const totalPaid  = paid.reduce((s, p) => s + Number(p.amount || 0), 0);
  const totalPending = [...pending, ...overdue].reduce((s, p) => s + Number(p.amount || 0), 0);

  const isActive = (tenant.status || "").toUpperCase() === "ACTIVE";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel — full-screen slide-over */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-3xl flex flex-col bg-white shadow-2xl animate-slide-in-right overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 border border-amber-300/40 flex items-center justify-center font-bold text-xl font-display shadow-sm">
              {(tenant.name || "T").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                {tenant.name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border ${
                  isActive
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-rose-50 border-rose-200 text-rose-700"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                  {tenant.status || "—"}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID #{tenant.id}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Tenant Information ── */}
          <div className="px-8 py-6 border-b border-slate-100">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-4">Tenant Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <div>
                <InfoRow label="Phone"      value={tenant.phone} />
                <InfoRow label="Email"      value={tenant.email} />
                <InfoRow label="Property"   value={tenant.propertyAddress} />
                <InfoRow label="Room"       value={tenant.roomNumber ? `Room ${tenant.roomNumber}` : null} />
              </div>
              <div>
                <InfoRow label="Monthly Rent" value={fmt(tenant.rent || tenant.rentAmount)} />
                <InfoRow label="Due Date"     value={formatDate(tenant.dueDate)} />
                <InfoRow label="Move-in"      value={formatDate(tenant.moveInDate)} />
                <InfoRow label="Move-out"     value={formatDate(tenant.moveOutDate)} />
              </div>
            </div>
          </div>

          {/* ── Payment History ── */}
          <div className="px-8 py-6">

            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Payment History</p>
                <h3 className="text-lg font-display font-bold text-slate-900 mt-0.5">Rent Ledger</h3>
              </div>
              {/* Future-ready: export/download stubs */}
              <div className="flex items-center gap-2">
                <button disabled className="text-[11px] font-mono uppercase tracking-widest text-slate-300 border border-slate-200 px-3 py-1.5 rounded-lg cursor-not-allowed" title="Coming soon">
                  Export PDF
                </button>
              </div>
            </div>

            {/* ── Summary Cards ── */}
            {!loading && payments.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <SummaryCard
                  label="Total Paid"
                  value={fmt(totalPaid)}
                  sub={`${paid.length} payment${paid.length !== 1 ? "s" : ""}`}
                  accent="green"
                />
                <SummaryCard
                  label="Pending Amount"
                  value={fmt(totalPending)}
                  sub={`${pending.length + overdue.length} outstanding`}
                  accent="amber"
                />
                <SummaryCard
                  label="Payments Made"
                  value={paid.length}
                  sub="completed"
                  accent="blue"
                />
                <SummaryCard
                  label="Pending"
                  value={pending.length + overdue.length}
                  sub={overdue.length > 0 ? `${overdue.length} overdue` : "all on track"}
                  accent={overdue.length > 0 ? "amber" : "slate"}
                />
              </div>
            )}

            {/* ── Table / States ── */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-mono">
                {error}
              </div>
            ) : payments.length === 0 ? (
              <EmptyHistory />
            ) : (
              <div className="rounded-2xl border border-slate-100 overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-100 px-5 py-3">
                  {["Month", "Amount", "Status", "Payment Date"].map(h => (
                    <span key={h} className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{h}</span>
                  ))}
                </div>
                {/* Table rows */}
                <div className="divide-y divide-slate-50">
                  {payments.map((p, idx) => (
                    <div
                      key={p.id ?? idx}
                      className="grid grid-cols-4 items-center px-5 py-3.5 hover:bg-slate-50/70 transition-colors"
                    >
                      <span className="text-sm font-semibold text-slate-800">
                        {formatMonth(p.month)}
                      </span>
                      <span className="font-mono text-sm font-semibold text-slate-700">
                        {fmt(p.amount)}
                      </span>
                      <StatusBadge status={p.status} />
                      <span className="text-xs font-mono text-slate-500">
                        {p.date ? formatDate(p.date) : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex items-center justify-between">
          <p className="text-[11px] font-mono text-slate-400">
            {payments.length > 0 ? `${payments.length} record${payments.length !== 1 ? "s" : ""} · newest first` : "No records"}
          </p>
          <button
            onClick={onClose}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-5 py-2 rounded-xl border border-slate-200 hover:border-slate-400 bg-white transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
