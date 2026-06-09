import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteLandlord, getLandlordById, getPropertiesByLandlord, getTenantsByLandlord } from '../services/api';
import { Button } from '../components/ui/Button';

export default function LandlordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [landlord, setLandlord] = useState(null);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loggedInId = localStorage.getItem("landlordId");
    if (id && loggedInId && String(id) !== String(loggedInId)) {
      navigate('/landlords');
      return;
    }

    Promise.all([
      getLandlordById(id),
      getPropertiesByLandlord(id).catch(() => ({ data: [] })),
      getTenantsByLandlord(id).catch(() => ({ data: [] }))
    ]).then(([lRes, pRes, tRes]) => {
      setLandlord(lRes);
      setProperties(Array.isArray(pRes) ? pRes : (Array.isArray(pRes?.data) ? pRes.data : []));
      setTenants(Array.isArray(tRes) ? tRes : (Array.isArray(tRes?.data) ? tRes.data : []));
      setLoading(false);
    }).catch(err => {
      console.error("Error loading landlord details:", err);
      setLoading(false);
    });
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this landlord? This action cannot be undone.")) {
      setDeleting(true);
      try {
        await deleteLandlord(id);
        navigate('/landlords');
      } catch (err) {
        console.error("Failed to delete landlord:", err);
        alert(err.response?.data?.message || "Failed to delete landlord.");
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-brand-brass/20"></div>
          <div className="w-12 h-12 rounded-full border-4 border-brand-brass border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!landlord) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[50vh] text-center">
        <svg className="w-16 h-16 text-brand-chalk mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-xl font-display font-medium text-brand-ink">Landlord profile not found.</p>
        <button onClick={() => navigate('/landlords')} className="mt-4 text-brand-brass hover:text-brand-ink font-semibold text-sm underline">Return to List</button>
      </div>
    );
  }

  const initials = landlord.name?.charAt(0).toUpperCase() || "L";

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/landlords')}
          className="text-brand-chalk hover:text-brand-ink font-semibold text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-1.5 w-max bg-brand-alabaster px-4 py-2.5 rounded-xl border border-brand-ink/10 shadow-sm"
        >
          <svg className="w-4 h-4 text-brand-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Directory Index
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-brand-rust hover:bg-brand-rust/10 bg-brand-rust/5 border border-brand-rust/20 px-4 py-2.5 rounded-xl shadow-sm font-semibold text-sm transition-colors flex items-center gap-1.5"
        >
          {deleting ? (
            <span className="w-4 h-4 rounded-full border-2 border-brand-rust border-t-transparent animate-spin inline-block"></span>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          )}
          {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-brand-alabaster border border-brand-ink/10 rounded-3xl p-8 flex flex-col md:flex-row md:justify-between md:items-center gap-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-xl bg-brand-plaster text-brand-brass border border-brand-brass/25 flex items-center justify-center text-3xl font-display font-bold">
            <span>{initials}</span>
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-brand-ink tracking-tight mb-2">{landlord.name}</h1>
            <div className="bg-brand-brass/10 text-brand-brass px-3 py-1 rounded-full text-[10px] font-mono font-bold border border-brand-brass/25 inline-block shadow-sm">
              LANDLORD ID: {landlord.id}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 min-w-[200px] bg-brand-plaster/50 p-4 rounded-2xl border border-brand-ink/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-alabaster flex items-center justify-center shadow-sm border border-brand-ink/5 text-brand-brass">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-brand-ink font-mono text-xs">{landlord.email || "No Email"}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-alabaster flex items-center justify-center shadow-sm border border-brand-ink/5 text-brand-brass">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <span className="text-brand-ink font-mono text-xs">{landlord.phone || "No Phone"}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="bg-brand-alabaster border border-brand-ink/10 rounded-2xl px-8 py-5 flex flex-col justify-center gap-1 shadow-sm flex-1">
          <span className="text-3xl font-display font-bold text-brand-brass">{properties.length}</span>
          <span className="text-[10px] font-mono font-medium text-brand-chalk uppercase tracking-widest mt-1">Properties Owned</span>
        </div>
        <div className="bg-brand-alabaster border border-brand-ink/10 rounded-2xl px-8 py-5 flex flex-col justify-center gap-1 shadow-sm flex-1">
          <span className="text-3xl font-display font-bold text-brand-brass">{tenants.length}</span>
          <span className="text-[10px] font-mono font-medium text-brand-chalk uppercase tracking-widest mt-1">Active Tenants</span>
        </div>
      </div>

      <div className="space-y-10 pt-4">
        {/* Properties Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-plaster text-brand-brass border border-brand-ink/5 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-brand-ink tracking-tight">Properties</h2>
          </div>
          {properties.length === 0 ? (
            <div className="border border-dashed border-brand-ink/10 rounded-[24px] p-12 text-center bg-brand-plaster/40">
              <p className="text-brand-chalk font-medium">No properties associated with this landlord.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(p => (
                <div key={p.id} className="bg-brand-alabaster border border-brand-ink/10 rounded-2xl p-6 transition-all duration-200 group">
                  <h3 className="font-bold text-brand-ink mb-1 text-lg">{p.name || p.address || 'Property'}</h3>
                  {p.address && <p className="text-sm font-medium text-brand-chalk mb-4">{p.address}</p>}
                  
                  <div className="bg-brand-plaster/50 rounded-xl p-4 border border-brand-ink/5">
                      <p className="text-[10px] font-mono uppercase tracking-widest font-semibold text-brand-chalk mb-1">Monthly Rent</p>
                      {p.rent || p.monthlyRent ? (
                         <p className="text-lg font-mono font-bold text-brand-forest">₹{(p.rent || p.monthlyRent).toLocaleString("en-IN")}</p>
                      ) : (
                         <p className="text-lg font-bold text-brand-ink">N/A</p>
                      )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <span className="bg-brand-plaster text-brand-chalk text-[9px] font-mono font-bold px-3 py-1.5 rounded-full border border-brand-ink/5">
                      ID: {p.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tenants Section */}
        <div>
           <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-plaster text-brand-brass border border-brand-ink/5 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-brand-ink tracking-tight">Active Tenants</h2>
          </div>
          {tenants.length === 0 ? (
            <div className="border border-dashed border-brand-ink/10 rounded-[24px] p-12 text-center bg-brand-plaster/40">
              <p className="text-brand-chalk font-medium">No tenants currently managed by this landlord.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenants.map(t => (
                <div key={t.id} className="bg-brand-alabaster border border-brand-ink/10 rounded-2xl p-6 flex flex-col items-center transition-all duration-200 group">
                  <div className="w-14 h-14 bg-brand-plaster text-brand-brass flex justify-center items-center rounded-xl mb-4 text-xl font-display font-bold border border-brand-brass/20 shadow-sm">
                    <span>{t.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <h3 className="font-semibold text-brand-ink text-lg tracking-tight mb-2">{t.name}</h3>
                  <div className="w-full bg-brand-plaster/50 rounded-2xl p-4 border border-brand-ink/5 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-brand-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <p className="text-xs font-mono text-brand-chalk truncate">{t.email || 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <svg className="w-4 h-4 text-brand-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <p className="text-xs font-mono text-brand-chalk truncate">{t.phone || 'N/A'}</p>
                    </div>
                    {t.propertyAddress && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-brand-ink/5">
                            <span className="px-2 py-0.5 bg-brand-alabaster border border-brand-ink/5 rounded text-[9px] font-mono font-bold text-brand-chalk uppercase tracking-widest">UNIT</span>
                            <p className="text-xs font-semibold text-brand-ink truncate">{t.propertyAddress}</p>
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}