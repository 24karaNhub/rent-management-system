export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled = false, 
  loading = false, 
  ...props 
}) {
  const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden shadow-sm";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white focus:ring-indigo-500 shadow-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/40 hover:-translate-y-0.5",
    secondary: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 focus:ring-slate-200 dark:focus:ring-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
    danger: "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white focus:ring-rose-500 shadow-rose-500/20 hover:shadow-md hover:shadow-rose-500/40 hover:-translate-y-0.5",
    ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 focus:ring-indigo-100 dark:focus:ring-slate-700 hover:text-indigo-700 dark:hover:text-slate-200 shadow-none",
    success: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white focus:ring-emerald-500 shadow-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/40 hover:-translate-y-0.5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? "opacity-60 cursor-not-allowed transform-none shadow-none" : ""} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </button>
  );
}
