export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled = false, 
  loading = false, 
  ...props 
}) {
  const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-brand-brass/40 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-brand-ink text-brand-plaster border border-brand-ink hover:opacity-95",
    secondary: "bg-brand-alabaster text-brand-ink border border-brand-ink/15 hover:bg-brand-plaster",
    danger: "bg-brand-rust/10 text-brand-rust border border-brand-rust/15 hover:bg-brand-rust/20",
    ghost: "bg-transparent text-brand-chalk hover:text-brand-ink hover:bg-brand-plaster",
    success: "bg-brand-forest/10 text-brand-forest border border-brand-forest/15 hover:bg-brand-forest/20",
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
