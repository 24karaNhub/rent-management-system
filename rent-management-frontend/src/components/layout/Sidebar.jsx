import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { name: "Properties", path: "/properties", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { name: "Tenants", path: "/tenants", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { name: "Payments", path: "/payments", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
  { name: "Profile", path: "/landlords", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const userStr = localStorage.getItem("user");
      setUser(userStr ? JSON.parse(userStr) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const username = user?.name || "Admin User";
  const userInitials = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("landlordId");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-brand-plaster border-r border-brand-ink/10 flex flex-col h-full transition-all duration-300">
      <div className="h-20 flex items-center px-8 border-b border-brand-ink/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl border border-brand-ink/10 flex items-center justify-center bg-brand-alabaster shadow-sm">
            <svg className="w-4 h-4 text-brand-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </div>
          <span className="text-lg font-display font-bold tracking-widest text-brand-ink uppercase">
            Atrium
          </span>
        </div>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2.5 overflow-y-auto">
        <p className="px-4 text-[10px] font-mono font-medium text-brand-chalk uppercase tracking-widest mb-4">Main Menu</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive 
                  ? "text-brand-ink font-display italic font-semibold translate-x-1" 
                  : "text-brand-chalk hover:text-brand-ink hover:translate-x-1"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 w-1.5 h-1.5 bg-brand-brass rounded-full nav-dot-active" />
              )}
              <svg 
                className={`w-4 h-4 mr-3 transition-colors duration-200 ${isActive ? "text-brand-brass" : "text-brand-chalk group-hover:text-brand-ink"}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.2 : 1.8} d={item.icon} />
              </svg>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-brand-ink/10 m-4 bg-brand-alabaster rounded-2xl border border-brand-ink/5 shadow-sm group">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-brand-plaster p-[1.5px] border border-brand-brass/30">
              <div className="bg-brand-alabaster rounded-full h-full w-full flex items-center justify-center">
                <span className="text-brand-brass font-bold text-xs">{userInitials}</span>
              </div>
            </div>
            <div className="ml-3 max-w-[110px]">
              <p className="text-xs font-bold text-brand-ink truncate leading-tight">{username}</p>
              <p className="text-[10px] font-mono text-brand-chalk tracking-tighter">Premium Ledger</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 text-brand-chalk hover:text-brand-rust hover:bg-brand-rust/5 rounded-lg transition-all duration-200"
            title="Log out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
