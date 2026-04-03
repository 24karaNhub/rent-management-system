export function Card({ children, className = "", title, headerAction }) {
  return (
    <div className={`bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/30 group ${className}`}>
      {(title || headerAction) && (
        <div className="px-6 py-5 border-b border-slate-100/80 flex justify-between items-center bg-white/40">
          {title && <h3 className="font-semibold text-slate-900 text-lg tracking-tight group-hover:text-indigo-900 transition-colors">{title}</h3>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
