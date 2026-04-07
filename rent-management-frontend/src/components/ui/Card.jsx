export function Card({ children, className = "", title, headerAction }) {
  return (
    <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-200/20 dark:shadow-none overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/30 dark:hover:shadow-indigo-500/10 group ${className}`}>
      {(title || headerAction) && (
        <div className="px-6 py-5 border-b border-slate-100/80 dark:border-slate-700/50 flex justify-between items-center bg-white/40 dark:bg-slate-800/40">
          {title && <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg tracking-tight group-hover:text-indigo-900 dark:group-hover:text-indigo-300 transition-colors">{title}</h3>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
