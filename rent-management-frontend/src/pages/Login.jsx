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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl p-8 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm relative z-10">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-slate-500 mt-2 text-sm">Sign in to your RentOS account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
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
