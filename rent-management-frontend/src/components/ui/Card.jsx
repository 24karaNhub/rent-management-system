export function Card({ children, className = "", title, headerAction }) {
  return (
    <div className={`bg-brand-alabaster rounded-2xl border border-brand-ink/10 shadow-[0_1px_2px_rgba(18,19,20,0.02),0_4px_8px_rgba(18,19,20,0.04)] overflow-hidden ${className}`}>
      {(title || headerAction) && (
        <div className="px-6 sm:px-8 py-4 sm:py-5 border-b border-brand-ink/10 flex justify-between items-center bg-brand-plaster/50">
          {title && <h3 className="font-display font-semibold text-brand-ink text-lg tracking-tight">{title}</h3>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}
