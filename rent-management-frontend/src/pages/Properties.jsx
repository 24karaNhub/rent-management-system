import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProperties, createProperty, deleteProperty } from "../services/api";
import { getPropertiesByLandlord } from "../services/api.js";
import { Card } from "../components/ui/Card";
import { Table } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";

const PROPERTY_TYPES = ["Building", "Independent House", "Apartment", "Commercial"];

function generateRooms(floors, roomsPerFloor) {
  const rooms = [];
  for (let f = 1; f <= floors; f++) {
    for (let r = 1; r <= roomsPerFloor; r++) {
      const roomNumber = `${f}${String(r).padStart(2, "0")}`;
      rooms.push({ roomNumber, rent: "", status: "VACANT" });
    }
  }
  return rooms;
}

function AddPropertyModal({ isOpen, onClose, onSaved }) {
  const [step, setStep] = useState(1); // 1 = basic info, 2 = building config, 3 = review rooms
  const [form, setForm] = useState({
    name: "", type: "Apartment", rent: "", city: "", address: "", landlord_id: ""
  });
  const [floors, setFloors] = useState(2);
  const [roomsPerFloor, setRoomsPerFloor] = useState(5);
  const [generatedRooms, setGeneratedRooms] = useState([]);
  const [saving, setSaving] = useState(false);

  // Location autocomplete
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const isBuilding = form.type === "Building";

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setForm({ name: "", type: "Apartment", rent: "", city: "", address: "", landlord_id: "" });
      setFloors(2);
      setRoomsPerFloor(5);
      setGeneratedRooms([]);
      setQuery("");
      setSuggestions([]);
      setSelectedLocation(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.length < 3) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`);
        if (res.ok) setSuggestions(await res.json());
      } catch (e) { console.error(e); }
      finally { setLoadingSuggestions(false); }
    }, 500);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const h = () => setShowDropdown(false);
    window.addEventListener("click", h);
    return () => window.removeEventListener("click", h);
  }, []);

  const handleSelectLocation = (item) => {
    const addr = item.address || {};
    const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "Unknown City";
    setSelectedLocation({ formattedAddress: item.display_name, city, state: addr.state || "", country: addr.country || "", lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
    setForm(f => ({ ...f, city, address: item.display_name }));
    setQuery(item.display_name);
    setShowDropdown(false);
  };

  const handleNext = () => {
    if (!form.name.trim()) { alert("Property Name is required."); return; }
    if (!form.type) { alert("Property Type is required."); return; }
    if (!form.rent || parseFloat(form.rent) <= 0) { alert("Rent must be a positive number."); return; }
    if (!form.address.trim()) { alert("Please select a property location."); return; }

    if (isBuilding) {
      setGeneratedRooms(generateRooms(floors, roomsPerFloor));
      setStep(2);
    } else {
      handleSave([]);
    }
  };

  const handleGenerateRooms = () => {
    setGeneratedRooms(generateRooms(floors, roomsPerFloor));
    setStep(3);
  };

  const updateRoom = (i, field, val) => {
    setGeneratedRooms(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };

  async function handleSave(rooms) {
    setSaving(true);
    try {
      const landlordId = localStorage.getItem("landlordId") 
        || JSON.parse(localStorage.getItem("user") || "{}").id;
      
      if (!landlordId || isNaN(parseInt(landlordId))) {
        alert("Session expired. Please log out and log back in.");
        setSaving(false);
        return;
      }

      await createProperty({
        name: form.name,
        type: form.type,
        rent: parseFloat(form.rent) || 0,
        city: form.city,
        address: form.address,
        totalRooms: rooms.length || 1,
        landlord_id: parseInt(landlordId),
        rooms: rooms.map(r => ({ roomNumber: r.roomNumber, rent: parseFloat(r.rent) || parseFloat(form.rent) || 0, status: r.status }))
      });
      onSaved();
      onClose();
    } catch (e) {
      alert("Could not save: " + e.message);
    } finally {
      setSaving(false);
    }
  }


  const inputClass = "w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all placeholder:text-slate-400";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={step === 1 ? "Add New Property" : step === 2 ? "Building Configuration" : "Review Rooms"}>
      <div className="space-y-5" onClick={(e) => e.stopPropagation()}>

        {step === 1 && (
          <>
            {/* Property Name */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-brand-chalk mb-1.5">Property Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Sunrise Residency, Block A" className={inputClass} />
            </div>

            {/* Type Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-brand-chalk mb-1.5">Property Type</label>
              <div className="grid grid-cols-2 gap-2">
                {PROPERTY_TYPES.map(t => (
                  <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all ${form.type === t ? "bg-brand-brass text-white border-brand-brass" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-brass/50"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Rent */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-brand-chalk mb-1.5">Base Rent (₹)</label>
              <input type="number" value={form.rent} onChange={e => setForm(f => ({ ...f, rent: e.target.value }))} placeholder="e.g. 12000" className={inputClass} />
            </div>

            {/* Location */}
            <div className="relative">
              <label className="block text-xs font-mono uppercase tracking-widest text-brand-chalk mb-1.5">Property Location</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input type="text" placeholder="Search address, landmark, locality..." value={query}
                  onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  className={`${inputClass} pl-11`} />
              </div>
              {showDropdown && (suggestions.length > 0 || loadingSuggestions) && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
                  {loadingSuggestions ? (
                    <div className="p-3.5 text-xs text-slate-400 font-mono animate-pulse">Searching locations...</div>
                  ) : suggestions.map((item, i) => {
                    const parts = item.display_name.split(",");
                    return (
                      <div key={i} onClick={() => handleSelectLocation(item)} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-start gap-3">
                        <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{parts[0]}</p>
                          <p className="text-xs text-slate-400">{parts.slice(1).join(",").trim()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedLocation && (
              <div className="text-[10px] font-mono text-brand-chalk/80 bg-brand-plaster/40 border border-brand-ink/5 p-3 rounded-xl">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div><span className="text-brand-brass font-bold">CITY:</span> {selectedLocation.city}</div>
                  <div><span className="text-brand-brass font-bold">STATE:</span> {selectedLocation.state}</div>
                </div>
              </div>
            )}

            {/* Mini map */}
            <div className="relative h-36 rounded-2xl overflow-hidden border border-brand-ink/10 shadow-inner bg-brand-plaster">
              <iframe title="Map Preview"
                src={`https://maps.openstreetmap.org/export/embed.html?bbox=${(selectedLocation?.lng || 77.327) - 0.003}%2C${(selectedLocation?.lat || 28.57) - 0.002}%2C${(selectedLocation?.lng || 77.327) + 0.003}%2C${(selectedLocation?.lat || 28.57) + 0.002}&layer=mapnik&marker=${selectedLocation?.lat || 28.57}%2C${selectedLocation?.lng || 77.327}`}
                className="w-full h-full border-0 filter grayscale" />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button variant="primary" onClick={handleNext}>{isBuilding ? "Next: Configure Rooms →" : "Save Property"}</Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="bg-brand-plaster/30 border border-brand-brass/20 rounded-2xl p-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-brass mb-3">Building Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-brand-chalk mb-1.5">Total Floors</label>
                  <input type="number" min="1" max="20" value={floors} onChange={e => setFloors(parseInt(e.target.value) || 1)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-brand-chalk mb-1.5">Rooms Per Floor</label>
                  <input type="number" min="1" max="20" value={roomsPerFloor} onChange={e => setRoomsPerFloor(parseInt(e.target.value) || 1)} className={inputClass} />
                </div>
              </div>
              <div className="mt-4 p-3 bg-brand-ink/5 rounded-xl">
                <p className="text-xs font-mono text-brand-chalk">
                  This will generate <span className="text-brand-brass font-bold">{floors * roomsPerFloor} rooms</span> across {floors} floor{floors !== 1 ? "s" : ""}.
                </p>
                <p className="text-xs font-mono text-brand-chalk/60 mt-1">
                  Rooms: {floors >= 1 ? `${1}01–${1}${String(roomsPerFloor).padStart(2, "0")}` : ""}{floors >= 2 ? `, ${2}01–${2}${String(roomsPerFloor).padStart(2, "0")}` : ""}{floors > 2 ? "..." : ""}
                </p>
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
              <Button variant="primary" onClick={handleGenerateRooms}>Generate Rooms →</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-brass mb-3">Review & Edit Rooms ({generatedRooms.length})</h3>
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {generatedRooms.map((room, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-brand-ink/10 bg-brand-plaster/20">
                    <span className="font-mono text-sm font-bold text-brand-ink w-12 shrink-0">{room.roomNumber}</span>
                    <input type="number" placeholder={`Rent (default: ${form.rent})`} value={room.rent}
                      onChange={e => updateRoom(i, "rent", e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm bg-white dark:bg-slate-800 dark:text-slate-200 outline-none focus:border-brand-brass/50" />
                    <select value={room.status} onChange={e => updateRoom(i, "status", e.target.value)}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1.5 text-xs bg-white dark:bg-slate-800 dark:text-slate-200 outline-none">
                      <option value="VACANT">Vacant</option>
                      <option value="OCCUPIED">Occupied</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
              <Button variant="primary" loading={saving} onClick={() => handleSave(generatedRooms)}>Save Building</Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const landlordId = localStorage.getItem("landlordId");
      if (!landlordId) { setError("Not logged in."); return; }

      const data = await getPropertiesByLandlord(landlordId);
      const props = Array.isArray(data) ? data : [];
      setProperties(props);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const columns = [
    {
      header: "Property Details",
      render: (p) => (
        <div className="flex items-center gap-3 w-max">
          <div className="w-9 h-9 rounded-xl bg-brand-plaster text-brand-brass border border-brand-brass/25 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-brand-ink">{p.name || p.type || "Unnamed Property"}</p>
            <p className="text-xs font-medium text-brand-chalk mt-0.5">{p.type} · {p.address || "No address"}</p>
          </div>
        </div>
      )
    },
    {
      header: "Occupancy",
      render: (p) => {
        const rooms = p.rooms || [];
        const occupied = rooms.filter(r => r.status === "OCCUPIED").length;
        const total = rooms.length || 1;
        const pct = Math.round((occupied / total) * 100);
        return (
          <div className="flex items-center gap-3 w-max">
            <div className="flex flex-wrap gap-1 max-w-[120px]">
              {rooms.slice(0, 12).map((r, i) => (
                <span key={i}
                  className={`w-3.5 h-3.5 rounded-sm transition-all duration-300 ${r.status === "OCCUPIED" ? "bg-brand-brass border border-brand-brass" : "bg-transparent border border-dashed border-brand-ink/20"}`}
                  title={r.roomNumber + ": " + r.status} />
              ))}
              {rooms.length > 12 && <span className="text-[10px] font-mono text-brand-chalk/60">+{rooms.length - 12}</span>}
            </div>
            <span className="font-mono text-xs font-semibold text-brand-ink">{occupied}/{total} · {pct}%</span>
          </div>
        );
      }
    },
    {
      header: "Revenue",
      className: "text-right",
      render: (p) => <span className="font-mono font-bold text-brand-ink bg-brand-plaster/50 border border-brand-ink/5 px-2.5 py-1.5 rounded-lg">₹{(p.rent || 0).toLocaleString("en-IN")}</span>
    },
    {
      header: "",
      render: (p) => (
        <button
          onClick={() => navigate(`/properties/${p.id}`)}
          className="text-xs font-mono uppercase tracking-widest text-brand-brass hover:text-brand-ink transition-colors px-3 py-1.5 rounded-lg border border-brand-brass/20 hover:border-brand-brass/50">
          View →
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 pb-6 border-b border-brand-ink/10">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-ink tracking-tight">Properties</h1>
          <p className="text-xs font-mono uppercase tracking-widest text-brand-brass mt-1.5">Portfolio Architectural Index</p>
        </div>
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Property
        </Button>
      </div>

      {error ? (
        <div className="p-4 bg-brand-rust/5 border border-brand-rust/15 text-brand-rust rounded-2xl text-xs font-mono shadow-sm">Warning: {error}</div>
      ) : loading ? (
        <div className="h-96 bg-brand-plaster border border-brand-ink/5 rounded-3xl animate-pulse" />
      ) : (
        <Card title="All Properties">
          <Table columns={columns} data={properties} keyExtractor={p => p.id} emptyMessage="No properties found. Click 'Add Property' to get started." />
        </Card>
      )}

      <AddPropertyModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSaved={load} />
    </div>
  );
}