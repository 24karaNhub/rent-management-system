import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginClient } from '../services/api';
import { Button } from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const landlord = await loginClient(form);
      // For now, simple redirect. You can store user data in LocalStorage/Context here.
      localStorage.setItem('user', JSON.stringify(landlord));
      localStorage.setItem("landlordId", landlord.id);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-transparent overflow-hidden px-4">
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-500/20 blur-[120px] -z-10 rounded-full mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-0 -right-1/4 w-3/4 h-3/4 bg-purple-500/20 blur-[120px] -z-10 rounded-full mix-blend-multiply pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-slate-200/50 shadow-2xl shadow-slate-200/20 animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30 mb-6">
            <svg className="w-8 h-8 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 font-medium mt-2">Sign in to your RentOS account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50/80 border border-rose-200/80 rounded-2xl text-sm font-medium text-rose-600 text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-2">Email Address</label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200/80 px-4 py-3 bg-white/50 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold tracking-tight text-slate-700 mb-2 flex justify-between">
              Password
            </label>
            <input
              type="password" name="password" required
              value={form.password} onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200/80 px-4 py-3 bg-white/50 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm transition-all placeholder:text-slate-400 font-medium tracking-widest"
            />
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full py-3.5 text-base shadow-indigo-500/25">
            Sign In
          </Button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-all">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
