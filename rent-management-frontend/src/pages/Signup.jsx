import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupClient } from '../services/api';
import { Button } from '../components/ui/Button';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const landlord = await signupClient(form);
      localStorage.setItem('user', JSON.stringify(landlord));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-transparent overflow-hidden px-4 py-12">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/10 blur-[120px] -z-10 rounded-full mix-blend-multiply pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] -z-10 rounded-full mix-blend-multiply pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-lg bg-white/60 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-slate-200/50 shadow-2xl shadow-slate-200/20 animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-3 block">Join RentOS Platform</span>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Create an account</h1>
          <p className="text-slate-500 font-medium mt-2">Start managing your properties effortlessly.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50/80 border border-rose-200/80 rounded-2xl text-sm font-medium text-rose-600 text-center backdrop-blur-sm">
            {typeof error === "string" ? error : "Signup Failed."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-2">Full Name</label>
              <input
                type="text" name="name" required
                value={form.name} onChange={handleChange}
                placeholder="Ramesh Gupta"
                className="w-full rounded-xl border border-slate-200/80 px-4 py-3 bg-white/50 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-2">Email Address</label>
              <input
                type="email" name="email" required
                value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200/80 px-4 py-3 bg-white/50 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-2">Phone Number</label>
              <input
                type="text" name="phone" required
                value={form.phone} onChange={handleChange}
                placeholder="9876543210"
                className="w-full rounded-xl border border-slate-200/80 px-4 py-3 bg-white/50 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-2">Password</label>
              <input
                type="password" name="password" required
                value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200/80 px-4 py-3 bg-white/50 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm transition-all placeholder:text-slate-400 font-medium tracking-widest"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full py-3.5 mt-4 text-base shadow-indigo-500/25">
            Create Account
          </Button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
