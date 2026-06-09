"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginClient, signupClient } from "../services/api";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function InputField({ icon: Icon, ...props }) {
  return (
    <div className="relative border-b border-brand-ink/15 focus-within:border-brand-brass transition-all duration-300 group">
      {Icon && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-chalk pointer-events-none transition-colors group-focus-within:text-brand-ink">
          <Icon size={14} />
        </span>
      )}
      <input
        {...props}
        className={cn(
          "w-full bg-transparent text-brand-ink placeholder:text-brand-chalk/50",
          "py-3 text-sm outline-none transition-all",
          Icon ? "pl-7" : "",
          props.className
        )}
      />
    </div>
  );
}

function Btn({ loading, children, className, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        "w-full h-11 rounded-xl bg-brand-ink text-brand-plaster font-semibold text-sm tracking-tight",
        "hover:opacity-95 active:scale-[0.98] transition-all duration-150",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-brand-plaster" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
          </svg>
          Processing...
        </span>
      ) : children}
    </button>
  );
}

function ErrorBox({ msg }) {
  if (!msg) return null;
  return (
    <div className="p-3 rounded-xl bg-brand-rust/5 border border-brand-rust/15 text-brand-rust text-xs font-mono text-center">
      {typeof msg === "string" ? msg : "Something went wrong."}
    </div>
  );
}

const MailIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const LockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const UserIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const PhoneIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.33 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const EyeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const landlord = await loginClient(form);
      localStorage.clear();
      localStorage.setItem("user", JSON.stringify(landlord));
      localStorage.setItem("landlordId", landlord.id);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Login failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
      <ErrorBox msg={error} />

      <div className="space-y-1">
        <label className="text-[10px] font-mono uppercase tracking-widest text-brand-chalk">Email Address</label>
        <InputField icon={MailIcon} type="email" name="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-mono uppercase tracking-widest text-brand-chalk">Password</label>
        <div className="relative">
          <InputField icon={LockIcon} type={showPw ? "text" : "password"} name="password" required placeholder="••••••••" value={form.password} onChange={handleChange} className="pr-10" />
          <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-chalk hover:text-brand-ink transition-colors">
            {showPw ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-3.5 h-3.5 rounded border-brand-ink/15 bg-transparent accent-brand-brass cursor-pointer" />
          <span className="text-xs text-brand-chalk">Remember details</span>
        </label>
        <a href="#" className="text-xs text-brand-chalk hover:text-brand-ink font-medium transition-colors">Forgot password?</a>
      </div>

      <Btn loading={loading} type="submit" className="mt-4">Sign In</Btn>
    </form>
  );
}

function SignupForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const landlord = await signupClient(form);
      localStorage.clear();
      localStorage.setItem("user", JSON.stringify(landlord));
      localStorage.setItem("landlordId", landlord.id);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <ErrorBox msg={error} />

      <div className="space-y-1">
        <label className="text-[10px] font-mono uppercase tracking-widest text-brand-chalk">Full Name</label>
        <InputField icon={UserIcon} type="text" name="name" required placeholder="Ramesh Gupta" value={form.name} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-mono uppercase tracking-widest text-brand-chalk">Email Address</label>
        <InputField icon={MailIcon} type="email" name="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-mono uppercase tracking-widest text-brand-chalk">Phone Number</label>
        <InputField icon={PhoneIcon} type="text" name="phone" required placeholder="9876543210" value={form.phone} onChange={handleChange} />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-mono uppercase tracking-widest text-brand-chalk">Password</label>
        <div className="relative">
          <InputField icon={LockIcon} type={showPw ? "text" : "password"} name="password" required placeholder="••••••••" value={form.password} onChange={handleChange} className="pr-10" />
          <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-chalk hover:text-brand-ink transition-colors">
            {showPw ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <Btn loading={loading} type="submit" className="mt-4">Create Account</Btn>
    </form>
  );
}

export default function AuthPage() {
  const [tab, setTab] = useState("login");

  return (
    <section className="fixed inset-0 flex bg-brand-plaster text-brand-ink overflow-hidden">
      {/* Left Side: Dramatic Editorial Panel */}
      <div className="hidden lg:flex w-1/2 bg-brand-ink relative flex-col justify-between p-16 select-none overflow-hidden">
        {/* Subtle architectural radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_40%,rgba(197,168,128,0.12),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl border border-brand-brass/40 flex items-center justify-center bg-brand-plaster/5">
            <svg className="w-4 h-4 text-brand-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </div>
          <span className="text-sm font-mono tracking-widest text-brand-plaster uppercase">Atrium</span>
        </div>

        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <h1 className="text-4xl xl:text-5xl font-display text-brand-plaster tracking-tight leading-[1.15] font-bold">
            The editorial ledger for <span className="italic font-normal text-brand-brass">extraordinary</span> properties.
          </h1>
          <p className="text-sm font-medium text-brand-chalk leading-relaxed">
            Designed for property managers who value architectural design details and absolute ledger clarity. Track assets, manage active lease contracts, and organize revenue streams in a unified, tactile system.
          </p>
        </div>

        {/* Graphical Mockup Element representing Floorplan Grid */}
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-[400px] h-[400px] border border-brand-plaster/10 rounded-full flex items-center justify-center opacity-30">
          <div className="w-[300px] h-[300px] border border-brand-plaster/10 rounded-full flex items-center justify-center">
            <div className="w-[200px] h-[200px] border border-brand-plaster/10 rounded-full" />
          </div>
        </div>

        <div className="relative z-10 text-[9px] font-mono tracking-widest uppercase text-brand-chalk">
          © 2026 Atrium Spatial Systems. All rights reserved.
        </div>
      </div>

      {/* Right Side: Clean login form column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 md:px-24 bg-brand-plaster relative overflow-y-auto">
        {/* Mobile logo header */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-ink flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-brand-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </div>
          <span className="text-sm font-display font-bold tracking-widest text-brand-ink uppercase">Atrium</span>
        </div>

        <div className="w-full max-w-md mx-auto space-y-8 py-12">
          <div>
            <h2 className="text-3xl font-display font-bold text-brand-ink tracking-tight">
              {tab === "login" ? "Welcome Back" : "Establish Account"}
            </h2>
            <p className="text-sm font-medium text-brand-chalk mt-2">
              {tab === "login" ? "Access your real estate ledger dashboard." : "Get started with premium property ledger tools."}
            </p>
          </div>

          {/* Custom minimalist tabs */}
          <div className="flex border-b border-brand-ink/10">
            <button
              onClick={() => setTab("login")}
              className={cn(
                "pb-3 text-sm font-medium tracking-tight transition-all relative px-1 mr-6",
                tab === "login" ? "text-brand-ink font-semibold animate-fade-in" : "text-brand-chalk hover:text-brand-ink"
              )}
            >
              {tab === "login" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-ink rounded-full" />}
              Log In
            </button>
            <button
              onClick={() => setTab("signup")}
              className={cn(
                "pb-3 text-sm font-medium tracking-tight transition-all relative px-1",
                tab === "signup" ? "text-brand-ink font-semibold animate-fade-in" : "text-brand-chalk hover:text-brand-ink"
              )}
            >
              {tab === "signup" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-ink rounded-full" />}
              Sign Up
            </button>
          </div>

          <div className="transition-all duration-300">
            {tab === "login" ? <LoginForm /> : <SignupForm />}
          </div>

          <div className="text-center pt-4 border-t border-brand-ink/5">
            <p className="text-xs text-brand-chalk font-medium">
              {tab === "login" ? (
                <>
                  New to Atrium?{" "}
                  <button onClick={() => setTab("signup")} className="text-brand-ink font-semibold hover:text-brand-brass transition-colors underline underline-offset-4 decoration-brand-brass/35">
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button onClick={() => setTab("login")} className="text-brand-ink font-semibold hover:text-brand-brass transition-colors underline underline-offset-4 decoration-brand-brass/35">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}