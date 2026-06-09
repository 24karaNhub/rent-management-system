import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById, getRoomsOfProperty, getTenantsOfProperty } from "../services/api";

const statusColor = {
  OCCUPIED: { bg: "bg-brand-brass", border: "border-brand-brass", text: "text-white", label: "Occupied" },
  VACANT:   { bg: "bg-transparent", border: "border-dashed border-brand-ink/25", text: "text-brand-chalk", label: "Vacant" },
};

function OccupancyGrid({ rooms }) {
  const occupied = rooms.filter(r => r.status === "OCCUPIED").length;
  const total = rooms.length;
  const pct = total ? Math.round((occupied / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="font-mono text-3xl font-bold text-brand-ink">{occupied}</span>
          <span className="font-mono text-lg text-brand-chalk">/{total}</span>
          <span className="ml-2 text-xs font-mono uppercase tracking-widest text-brand-chalk">Occupied</span>
        </div>
        <span className="font-mono text-2xl font-bold text-brand-brass">{pct}%</span>
      </div>

      {/* Grid */}
      <div className="flex flex-wrap gap-1.5">
        {rooms.map((room, i) => {
          const s = statusColor[room.status] || statusColor.VACANT;
          return (
            <div
              key={room.id || i}
              title={`${room.roomNumber}: ${room.status}${room.tenantName ? " — " + room.tenantName : ""}`}
              className={`w-8 h-8 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${s.bg} ${s.border}`}
            >
              <span className={`text-[9px] font-mono font-bold ${room.status === "OCCUPIED" ? "text-white" : "text-brand-chalk/40"}`}>
                {room.roomNumber}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-brand-ink/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-brass rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-brand-chalk/60">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-brand-brass inline-block" /> Occupied
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm border border-dashed border-brand-ink/25 inline-block" /> Vacant
        </span>
      </div>
    </div>
  );
}

function RoomCard({ room }) {
  const s = statusColor[room.status] || statusColor.VACANT;
  return (
    <div className={`rounded-2xl border p-4 transition-all hover:shadow-sm ${room.status === "OCCUPIED" ? "border-brand-brass/30 bg-brand-brass/5" : "border-brand-ink/10 bg-brand-plaster/30"}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-lg font-bold text-brand-ink">#{room.roomNumber}</span>
        <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${room.status === "OCCUPIED" ? "bg-brand-brass text-white border-brand-brass" : "border-brand-ink/15 text-brand-chalk"}`}>
          {room.status}
        </span>
      </div>

      {room.tenantName && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-brand-brass/20 text-brand-brass flex items-center justify-center text-xs font-bold">
            {room.tenantName[0]}
          </div>
          <span className="text-sm font-medium text-brand-ink">{room.tenantName}</span>
        </div>
      )}

      <div className="mt-2 pt-2 border-t border-brand-ink/5">
        <span className="font-mono text-sm font-bold text-brand-ink">
          {room.rent ? `₹${Number(room.rent).toLocaleString("en-IN")}/mo` : "—"}
        </span>
      </div>
    </div>
  );
}

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prop, roomsData, tenantsData] = await Promise.all([
          getPropertyById(id),
          getRoomsOfProperty(id),
          getTenantsOfProperty(id)
        ]);
        setProperty(prop);
        setRooms(roomsData);
        setTenants(tenantsData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-brand-plaster rounded-xl w-48" />
      <div className="h-64 bg-brand-plaster rounded-3xl" />
    </div>
  );

  if (error) return (
    <div className="p-4 bg-brand-rust/5 border border-brand-rust/15 text-brand-rust rounded-2xl text-xs font-mono">
      Error: {error}
    </div>
  );

  const occupied = rooms.filter(r => r.status === "OCCUPIED").length;
  const totalRevenue = rooms.reduce((sum, r) => sum + (r.status === "OCCUPIED" && r.rent ? Number(r.rent) : 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-brand-ink/10">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl border border-brand-ink/15 flex items-center justify-center text-brand-chalk hover:border-brand-brass/50 hover:text-brand-brass transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-ink tracking-tight">
            {property?.name || property?.type || "Property"}
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-brand-brass mt-1">
            {property?.type} · {property?.city}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Rooms", value: rooms.length, mono: true },
          { label: "Occupied", value: occupied, mono: true },
          { label: "Vacant", value: rooms.length - occupied, mono: true },
          { label: "Monthly Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, mono: true }
        ].map(m => (
          <div key={m.label} className="rounded-2xl border border-brand-ink/10 bg-brand-alabaster p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-brand-chalk/70 mb-1">{m.label}</p>
            <p className="font-mono text-2xl font-bold text-brand-ink">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Occupancy + Room List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Occupancy Overview */}
        <div className="lg:col-span-1 rounded-3xl border border-brand-ink/10 bg-brand-alabaster p-6">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-chalk mb-4">Occupancy Grid</p>
          <OccupancyGrid rooms={rooms} />

          <div className="mt-6 pt-4 border-t border-brand-ink/5 space-y-2">
            <div className="flex justify-between text-xs font-mono text-brand-chalk">
              <span>Address</span>
              <span className="text-brand-ink text-right max-w-[60%] leading-snug">{property?.address || "—"}</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-brand-chalk">
              <span>Base Rent</span>
              <span className="text-brand-ink">₹{(property?.rent || 0).toLocaleString("en-IN")}/mo</span>
            </div>
          </div>
        </div>

        {/* Right: Room Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-mono uppercase tracking-widest text-brand-chalk">All Rooms</p>
            <span className="text-[10px] font-mono text-brand-chalk/60">{rooms.length} units</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
            {rooms.map((room, i) => <RoomCard key={room.id || i} room={room} />)}
          </div>
        </div>
      </div>

      {/* Tenants Section */}
      {tenants.length > 0 && (
        <div className="rounded-3xl border border-brand-ink/10 bg-brand-alabaster p-6">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-chalk mb-4">Active Tenants</p>
          <div className="divide-y divide-brand-ink/5">
            {tenants.map(t => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-brass/15 text-brand-brass flex items-center justify-center font-bold text-sm">
                    {t.name?.[0] || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-ink">{t.name}</p>
                    <p className="text-[10px] font-mono text-brand-chalk/60">
                      {t.roomNumber ? `Room ${t.roomNumber}` : "No room assigned"} · {t.phone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-brand-ink">₹{(t.rent || 0).toLocaleString("en-IN")}</p>
                  <span className={`text-[10px] font-mono uppercase ${t.status === "ACTIVE" ? "text-brand-forest" : "text-brand-rust"}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
