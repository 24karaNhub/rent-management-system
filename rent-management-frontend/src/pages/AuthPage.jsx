"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginClient, signupClient } from "../services/api";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function InputField({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
          <Icon size={16} />
        </span>
      )}
      <input
        {...props}
        className={cn(
          "w-full rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-50 placeholder:text-zinc-600",
          "px-4 py-2.5 text-sm outline-none transition-all",
          "focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20",
          Icon ? "pl-10" : "",
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
        "w-full h-10 rounded-xl bg-zinc-50 text-zinc-900 font-semibold text-sm",
        "hover:bg-zinc-200 active:bg-zinc-300 transition-colors",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
          </svg>
          Please wait…
        </span>
      ) : children}
    </button>
  );
}

function ErrorBox({ msg }) {
  if (!msg) return null;
  return (
    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-400 text-xs font-medium text-center">
      {typeof msg === "string" ? msg : "Something went wrong."}
    </div>
  );
}

const MailIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const LockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const UserIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const PhoneIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.33 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const EyeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);
const HomeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    setSize();
    let ps = [], raf = 0;
    const make = () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, v: Math.random() * 0.25 + 0.05, o: Math.random() * 0.35 + 0.15 });
    const init = () => { ps = []; for (let i = 0; i < Math.floor((canvas.width * canvas.height) / 9000); i++) ps.push(make()); };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach(p => {
        p.y -= p.v;
        if (p.y < 0) Object.assign(p, make(), { y: canvas.height + Math.random() * 40 });
        ctx.fillStyle = `rgba(250,250,250,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.7, 2.2);
      });
      raf = requestAnimationFrame(draw);
    };
    const onResize = () => { setSize(); init(); };
    window.addEventListener("resize", onResize);
    init(); raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40 mix-blend-screen pointer-events-none" />;
}

function LoginForm({ onSuccess }) {
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
    console.log("landlord object:", landlord); // 👈 check this
    
    // Clear old user data first
    localStorage.clear(); // 👈 wipe stale landlordId

    localStorage.setItem("user", JSON.stringify(landlord));
    localStorage.setItem("landlordId", landlord.id);
    navigate("/");
  } catch (err) {
    setError(err.response?.data?.message || err.response?.data || "Signup failed.");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <ErrorBox msg={error} />

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</label>
        <InputField icon={MailIcon} type="email" name="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
        <div className="relative">
          <InputField icon={LockIcon} type={showPw ? "text" : "password"} name="password" required placeholder="••••••••" value={form.password} onChange={handleChange} className="pr-10" />
          <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
            {showPw ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-950 accent-zinc-300" />
          <span className="text-xs text-zinc-500">Remember me</span>
        </label>
        <a href="#" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Forgot password?</a>
      </div>

      <Btn loading={loading} type="submit" className="mt-2">Sign In</Btn>
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
      console.log("signup response:", landlord);
console.log("id:", landlord.id);
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

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Full Name</label>
        <InputField icon={UserIcon} type="text" name="name" required placeholder="Ramesh Gupta" value={form.name} onChange={handleChange} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</label>
        <InputField icon={MailIcon} type="email" name="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Phone Number</label>
        <InputField icon={PhoneIcon} type="text" name="phone" required placeholder="9876543210" value={form.phone} onChange={handleChange} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
        <div className="relative">
          <InputField icon={LockIcon} type={showPw ? "text" : "password"} name="password" required placeholder="••••••••" value={form.password} onChange={handleChange} className="pr-10" />
          <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
            {showPw ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <Btn loading={loading} type="submit" className="mt-2">Create Account</Btn>
    </form>
  );
}

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [dir, setDir] = useState(1);

  const switchTab = (t) => {
    setDir(t === "signup" ? 1 : -1);
    setTab(t);
  };

  return (
    <section className="fixed inset-0 bg-zinc-950 text-zinc-50 overflow-hidden">
      <style>{`
        .al{position:absolute;inset:0;pointer-events:none}
        .hl,.vl{position:absolute;background:#27272a}
        .hl{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50%;animation:dX .7s ease forwards}
        .vl{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0;animation:dY .8s ease forwards}
        .hl:nth-child(1){top:18%;animation-delay:.1s}
        .hl:nth-child(2){top:50%;animation-delay:.2s}
        .hl:nth-child(3){top:82%;animation-delay:.3s}
        .vl:nth-child(4){left:22%;animation-delay:.25s}
        .vl:nth-child(5){left:50%;animation-delay:.35s}
        .vl:nth-child(6){left:78%;animation-delay:.45s}
        @keyframes dX{to{transform:scaleX(1)}}
        @keyframes dY{to{transform:scaleY(1)}}

        .card-in{opacity:0;transform:translateY(16px);animation:fUp .6s ease .3s forwards}
        @keyframes fUp{to{opacity:1;transform:translateY(0)}}

        /* ── Smooth tab transition fix ── */
        .tp-wrap{
          position: relative;
          overflow: hidden;
        }
        .tp{
          transition: opacity 0.28s ease, transform 0.28s ease;
          will-change: opacity, transform;
        }
        .tp[data-state=inactive]{
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: translateX(var(--slide-out, 20px));
          pointer-events: none;
        }
        .tp[data-state=active]{
          position: relative;
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(70%_50%_at_50%_30%,rgba(99,102,241,0.08),transparent_60%)]" />

      <div className="al opacity-60">
        <div className="hl"/><div className="hl"/><div className="hl"/>
        <div className="vl"/><div className="vl"/><div className="vl"/>
      </div>

      <Particles />

      <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/70 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <HomeIcon size={14} />
          </div>
          <span className="text-sm font-bold tracking-tight text-zinc-100">RentOS</span>
        </div>
        <span className="text-xs text-zinc-500 tracking-widest uppercase">Property Management</span>
      </header>

      <div className="h-full w-full grid place-items-center px-4">
        <div className="card-in w-full max-w-md border border-zinc-800 rounded-2xl bg-zinc-900/70 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">

          <div className="px-8 pt-8 pb-0">
            <h1 className="text-2xl font-bold text-zinc-50 tracking-tight">Welcome to RentOS</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage your properties with ease</p>

            <div className="flex mt-6 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
              {["login", "signup"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => switchTab(t)}
                  className={cn(
                    "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
                    tab === t
                      ? "bg-zinc-800 text-zinc-50 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {t === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>
          </div>

          {/* Tab panels — fixed height so card doesn't jump */}
          <div
            className="tp-wrap px-8 pb-8 pt-2"
            style={{
              "--slide-out": dir === 1 ? "-20px" : "20px",
              minHeight: tab === "signup" ? "370px" : "260px",
              transition: "min-height 0.28s ease",
            }}
          >
            <div className="tp" data-state={tab === "login" ? "active" : "inactive"}>
              <LoginForm />
            </div>
            <div className="tp" data-state={tab === "signup" ? "active" : "inactive"}>
              <SignupForm />
            </div>
          </div>

          <div className="px-8 pb-6 text-center border-t border-zinc-800/60 pt-4">
            <p className="text-xs text-zinc-600">
              {tab === "login" ? (
                <>No account?{" "}
                  <button type="button" onClick={() => switchTab("signup")} className="text-zinc-400 hover:text-zinc-200 font-semibold transition-colors">
                    Create one free
                  </button>
                </>
              ) : (
                <>Already a member?{" "}
                  <button type="button" onClick={() => switchTab("login")} className="text-zinc-400 hover:text-zinc-200 font-semibold transition-colors">
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