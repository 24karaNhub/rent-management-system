import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLandlordById, updateLandlord, getPropertiesByLandlord, getTenantsByLandlord } from "../services/api";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";

function EditProfileModal({ isOpen, onClose, landlord, onSaved }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && landlord) {
      setForm({
        name: landlord.name || "",
        email: landlord.email || "",
        phone: landlord.phone || "",
      });
      setErrors({});
    }
  }, [isOpen, landlord]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  async function handleSave() {
    setErrors({});
    setSaving(true);
    try {
      if (!form.name.trim()) {
        setErrors(prev => ({ ...prev, name: "Name is required" }));
        setSaving(false);
        return;
      }
      if (form.phone && form.phone.length !== 10) {
        setErrors(prev => ({ ...prev, phone: "Phone must be exactly 10 digits" }));
        setSaving(false);
        return;
      }
      const updated = await updateLandlord(landlord.id, form);
      // Update local storage so header name and sidebar initials update
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...user, ...updated }));
      
      onSaved(updated);
      onClose();
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "object" && !Array.isArray(data)) {
          setErrors(data);
        } else {
          setErrors({ general: data.message || "Failed to update profile" });
        }
      } else {
        setErrors({ general: "Cannot connect to server!" });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile Details" maxWidth="max-w-md">
      <div className="space-y-5">
        {errors.general && (
          <div className="p-3 bg-brand-rust/5 border border-brand-rust/15 text-brand-rust rounded-xl text-xs font-mono text-center">
            {errors.general}
          </div>
        )}
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-brand-chalk mb-1.5">Full Name</label>
          <input
            type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Karan Chaudhary"
            className={`w-full bg-transparent border-b ${errors.name ? 'border-brand-rust' : 'border-brand-ink/15 focus:border-brand-brass'} py-2.5 text-sm outline-none transition-all placeholder:text-brand-chalk/50`}
          />
          {errors.name && <p className="text-brand-rust text-xs mt-1 font-mono pl-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-brand-chalk mb-1.5">Email Address</label>
          <input
            type="email" name="email" value={form.email} onChange={handleChange} placeholder="e.g. karan@gmail.com"
            className={`w-full bg-transparent border-b ${errors.email ? 'border-brand-rust' : 'border-brand-ink/15 focus:border-brand-brass'} py-2.5 text-sm outline-none transition-all placeholder:text-brand-chalk/50`}
          />
          {errors.email && <p className="text-brand-rust text-xs mt-1 font-mono pl-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-brand-chalk mb-1.5">Phone Number</label>
          <input
            type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="10 Digits"
            className={`w-full bg-transparent border-b ${errors.phone ? 'border-brand-rust' : 'border-brand-ink/15 focus:border-brand-brass'} py-2.5 text-sm outline-none transition-all placeholder:text-brand-chalk/50`}
          />
          {errors.phone && <p className="text-brand-rust text-xs mt-1 font-mono pl-1">{errors.phone}</p>}
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-brand-ink/5">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={saving} onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}

export default function Landlords() {
  const [landlord, setLandlord] = useState(null);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  const navigate = useNavigate();

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const landlordId = localStorage.getItem("landlordId");
      if (!landlordId) {
        setError("Not logged in. Please log in first.");
        setLoading(false);
        return;
      }

      const [lData, pData, tData] = await Promise.all([
        getLandlordById(landlordId),
        getPropertiesByLandlord(landlordId).catch(() => []),
        getTenantsByLandlord(landlordId).catch(() => [])
      ]);

      setLandlord(lData);
      setProperties(Array.isArray(pData) ? pData : []);
      setTenants(Array.isArray(tData) ? tData : []);
    } catch (err) {
      console.error("ERROR FETCHING PROFILE:", err);
      setError(err.message || "Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleProfileSaved = (updatedLandlord) => {
    setLandlord(updatedLandlord);
    setSuccessMsg("Profile details updated successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="h-48 bg-brand-plaster border border-brand-ink/5 rounded-3xl animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 h-80 bg-brand-plaster border border-brand-ink/5 rounded-3xl animate-pulse"></div>
          <div className="lg:col-span-2 h-80 bg-brand-plaster border border-brand-ink/5 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !landlord) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[50vh] text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-brand-rust/5 text-brand-rust flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <p className="text-xl font-bold text-brand-ink mb-2">Could Not Load Profile</p>
        <p className="text-brand-chalk max-w-sm mb-6">{error || "Ensure you are properly logged in to access this page."}</p>
        <Button variant="primary" onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  const initials = landlord.name?.charAt(0).toUpperCase() || "L";
  const potentialMonthlyRent = properties.reduce((sum, p) => sum + (p.rent || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {successMsg && (
        <div className="fixed top-24 right-8 bg-brand-forest text-brand-plaster font-semibold text-sm px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          {successMsg}
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden bg-brand-ink rounded-3xl p-8 lg:p-10 shadow-lg text-brand-plaster border border-brand-ink/20">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_40%,rgba(197,168,128,0.08),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-20 h-20 rounded-2xl bg-brand-plaster/10 border border-brand-plaster/20 flex items-center justify-center text-4xl font-display font-extrabold text-brand-plaster shadow-lg">
              <span>{initials}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1.5">
                <h1 className="text-3xl font-display font-bold tracking-tight text-brand-plaster">{landlord.name}</h1>
                <span className="bg-brand-forest/20 text-brand-forest border border-brand-forest/35 text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full">
                  Active Landlord
                </span>
              </div>
              <p className="text-brand-chalk font-mono text-sm">{landlord.email || "No email linked"}</p>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Button
              onClick={() => setShowEditModal(true)}
              className="w-full md:w-auto bg-brand-plaster/10 hover:bg-brand-plaster/20 text-brand-plaster border border-brand-plaster/20 font-bold px-5 py-3 rounded-xl transition-all shadow-md backdrop-blur-md"
            >
              <svg className="w-4 h-4 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Profile Details and Quick Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-brand-alabaster border border-brand-ink/10 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-display font-bold text-brand-ink mb-6 tracking-tight flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Contact Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-plaster/50 border border-brand-ink/5">
                <span className="text-[10px] font-mono font-medium text-brand-chalk uppercase tracking-widest pl-1">Name</span>
                <span className="text-sm font-semibold text-brand-ink">{landlord.name}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-plaster/50 border border-brand-ink/5">
                <span className="text-[10px] font-mono font-medium text-brand-chalk uppercase tracking-widest pl-1">Email</span>
                <span className="text-sm font-semibold text-brand-ink truncate max-w-[170px]">{landlord.email || "—"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-plaster/50 border border-brand-ink/5">
                <span className="text-[10px] font-mono font-medium text-brand-chalk uppercase tracking-widest pl-1">Phone</span>
                <span className="text-sm font-semibold text-brand-ink">{landlord.phone || "—"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-brand-plaster/50 border border-brand-ink/5">
                <span className="text-[10px] font-mono font-medium text-brand-chalk uppercase tracking-widest pl-1">ID Code</span>
                <span className="text-xs font-mono font-bold bg-brand-brass/10 text-brand-brass px-2.5 py-1 rounded-lg border border-brand-brass/25">
                  {landlord.id}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Column */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-alabaster border border-brand-ink/10 rounded-3xl p-5 flex flex-col justify-between shadow-sm min-h-[110px] group transition-all duration-200">
              <span className="text-3xl font-display font-bold text-brand-brass">{properties.length}</span>
              <span className="text-[10px] font-mono font-medium text-brand-chalk uppercase tracking-widest">Properties</span>
            </div>

            <div className="bg-brand-alabaster border border-brand-ink/10 rounded-3xl p-5 flex flex-col justify-between shadow-sm min-h-[110px] group transition-all duration-200">
              <span className="text-3xl font-display font-bold text-brand-brass">{tenants.length}</span>
              <span className="text-[10px] font-mono font-medium text-brand-chalk uppercase tracking-widest">Tenants</span>
            </div>

            <div className="col-span-2 bg-brand-alabaster border border-brand-ink/10 rounded-3xl p-5 flex items-center justify-between shadow-sm group transition-all duration-200">
              <div>
                <span className="text-[10px] font-mono font-medium text-brand-chalk uppercase tracking-widest block mb-1">Potential rent</span>
                <span className="text-2xl font-mono font-bold text-brand-forest">
                  ₹{potentialMonthlyRent.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-forest/10 border border-brand-forest/20 text-brand-forest flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Properties & Tenants list */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Properties Section */}
          <div className="bg-brand-alabaster border border-brand-ink/10 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-display font-bold text-brand-ink tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-plaster text-brand-brass border border-brand-ink/5 flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                My Properties ({properties.length})
              </h3>
              <button onClick={() => navigate("/properties")} className="text-xs font-semibold text-brand-brass hover:text-brand-ink hover:underline">
                Manage All
              </button>
            </div>

            {properties.length === 0 ? (
              <div className="border border-dashed border-brand-ink/10 rounded-2xl p-8 text-center bg-brand-plaster/50">
                <p className="text-brand-chalk text-sm font-semibold mb-3">No properties listed yet.</p>
                <Button variant="secondary" onClick={() => navigate("/properties")}>Add New Property</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
                {properties.slice(0, 4).map(p => (
                  <div key={p.id} className="p-4 rounded-2xl bg-brand-plaster/30 border border-brand-ink/5 flex flex-col justify-between hover:border-brand-brass/35 transition-colors">
                    <div>
                      <h4 className="font-semibold text-brand-ink truncate text-sm">{p.type || "Building Property"}</h4>
                      <p className="text-xs text-brand-chalk mt-1 truncate">{p.address || "No address details"}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-brand-ink/5 flex justify-between items-center">
                      <span className="text-[9px] font-mono font-medium text-brand-chalk uppercase tracking-widest">Est. Rent</span>
                      <span className="text-sm font-mono font-bold text-brand-forest">₹{(p.rent || 0).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tenants Section */}
          <div className="bg-brand-alabaster border border-brand-ink/10 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-display font-bold text-brand-ink tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-plaster text-brand-brass border border-brand-ink/5 flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                My Tenants ({tenants.length})
              </h3>
              <button onClick={() => navigate("/tenants")} className="text-xs font-semibold text-brand-brass hover:text-brand-ink hover:underline">
                Manage All
              </button>
            </div>

            {tenants.length === 0 ? (
              <div className="border border-dashed border-brand-ink/10 rounded-2xl p-8 text-center bg-brand-plaster/50">
                <p className="text-brand-chalk text-sm font-semibold mb-3">No tenants added yet.</p>
                <Button variant="secondary" onClick={() => navigate("/tenants")}>Add New Tenant</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
                {tenants.slice(0, 4).map(t => (
                  <div key={t.id} className="p-4 rounded-2xl bg-brand-plaster/30 border border-brand-ink/5 flex items-center gap-3 hover:border-brand-brass/35 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-brand-plaster text-brand-brass border border-brand-brass/25 flex items-center justify-center text-xs font-mono font-bold shadow-sm">
                      {t.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-brand-ink truncate text-sm">{t.name}</h4>
                      <p className="text-xs font-mono text-brand-chalk truncate mt-0.5">{t.email || "No email ID"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        landlord={landlord}
        onSaved={handleProfileSaved}
      />
    </div>
  );
}
