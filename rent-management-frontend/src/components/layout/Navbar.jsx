export function Navbar() {
  return (
    <header className="h-20 bg-white/40 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-8 z-10 w-full sticky top-0 shadow-sm shadow-slate-200/20">
      <div className="flex-1">
        {/* Breadcrumb or Search area could go here */}
        <div className="relative w-96 hidden lg:block group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white/60 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 sm:text-sm shadow-sm" 
            placeholder="Search anything (⌘K)" 
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-slate-400 hover:text-indigo-600 p-2.5 rounded-full hover:bg-indigo-50 transition-all duration-200">
          <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full ring-2 ring-white bg-rose-500"></span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>
    </header>
  );
}
