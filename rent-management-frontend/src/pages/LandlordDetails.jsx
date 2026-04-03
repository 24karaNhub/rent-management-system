import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLandlordById, getPropertiesByLandlord, getTenantsByLandlord } from '../services/api';

export default function LandlordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [landlord, setLandlord] = useState(null);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200"></div>
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!landlord) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[50vh] text-center">
        <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-xl font-display font-medium text-slate-600">Landlord profile not found.</p>
        <button onClick={() => navigate('/landlords')} className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold text-sm">Return to List</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <button
        onClick={() => navigate('/landlords')}
        className="text-slate-500 hover:text-indigo-600 font-semibold text-sm transition-colors flex items-center gap-1.5 w-max bg-slate-50 px-4 py-2 rounded-lg border border-slate-200/60 shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Directory
      </button>

      {/* Hero Profile Card */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-8 flex flex-col md:flex-row md:justify-between md:items-center gap-8 shadow-xl shadow-slate-200/20 relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 mix-blend-multiply pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-indigo-500 to-fuchsia-600 text-white flex items-center justify-center text-4xl font-bold flex-shrink-0 shadow-lg shadow-indigo-500/30">
            <span className="drop-shadow-sm">{landlord.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight mb-2">{landlord.name}</h1>
            <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100 inline-block shadow-sm">
              LANDLORD ID: {landlord.id}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 min-w-[200px] bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-slate-600 font-medium text-sm">{landlord.email || "No Email"}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <span className="text-slate-600 font-medium text-sm">{landlord.phone || "No Phone"}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-3xl px-8 py-5 flex flex-col justify-center gap-1 shadow-sm flex-1">
          <span className="text-4xl font-display font-bold text-indigo-600">{properties.length}</span>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Properties Owned</span>
        </div>
        <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-3xl px-8 py-5 flex flex-col justify-center gap-1 shadow-sm flex-1">
          <span className="text-4xl font-display font-bold text-teal-600">{tenants.length}</span>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Active Tenants</span>
        </div>
      </div>

      <div className="space-y-10 pt-4">
        {/* Properties Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Properties</h2>
          </div>
          {properties.length === 0 ? (
            <div className="border border-dashed border-slate-300 rounded-3xl p-12 text-center bg-white/40 backdrop-blur-sm">
              <p className="text-slate-500 font-medium">No properties associated with this landlord.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(p => (
                <div key={p.id} className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 group">
                  <h3 className="font-display font-bold text-slate-900 mb-1 text-xl group-hover:text-purple-600 transition-colors">{p.name || p.address || 'Property'}</h3>
                  {p.address && <p className="text-sm font-medium text-slate-500 mb-4">{p.address}</p>}
                  
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-1">Monthly Rent</p>
                      {p.rent || p.monthlyRent ? (
                         <p className="text-lg font-bold text-emerald-600 drop-shadow-sm">₹{(p.rent || p.monthlyRent).toLocaleString("en-IN")}</p>
                      ) : (
                         <p className="text-lg font-bold text-slate-800 drop-shadow-sm">N/A</p>
                      )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200">
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
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Active Tenants</h2>
          </div>
          {tenants.length === 0 ? (
            <div className="border border-dashed border-slate-300 rounded-3xl p-12 text-center bg-white/40 backdrop-blur-sm">
              <p className="text-slate-500 font-medium">No tenants currently managed by this landlord.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tenants.map(t => (
                <div key={t.id} className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 flex flex-col items-center hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex justify-center items-center rounded-[20px] mb-4 text-2xl font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                    <span className="drop-shadow-sm">{t.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-xl tracking-tight mb-2 group-hover:text-teal-600 transition-colors">{t.name}</h3>
                  <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <p className="text-xs font-medium text-slate-600 truncate">{t.email || 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <p className="text-xs font-medium text-slate-600 truncate">{t.phone || 'N/A'}</p>
                    </div>
                    {t.propertyAddress && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200">
                            <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">UNIT</span>
                            <p className="text-xs font-semibold text-slate-800 truncate">{t.propertyAddress}</p>
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