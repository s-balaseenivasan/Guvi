import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const onChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(formData);
      navigate(res.data.role === 'restaurant' ? '/restaurant/dashboard' : '/customer/restaurants');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">

      {/* ── Left brand panel ── */}
      <div className="hidden flex-col items-center justify-center gap-8 bg-gradient-to-br from-primary-800 via-primary-700 to-amber-600 px-12 lg:flex lg:w-1/2">
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative text-center animate-fade-in">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-5xl shadow-lg backdrop-blur-sm animate-bounce-gentle">
            🍔
          </div>
          <h1 className="text-4xl font-extrabold text-white">FoodieHub</h1>
          <p className="mt-3 text-lg text-primary-100">Delicious food, delivered fast</p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-col gap-3 text-left">
            {[
              { emoji: '🚀', text: 'Delivery in under 30 minutes' },
              { emoji: '🍽️', text: '100+ partner restaurants' },
              { emoji: '🔒', text: 'Secure payments via Razorpay' },
              { emoji: '⭐', text: 'Trusted by 50,000+ customers' },
            ].map(({ emoji, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                <span className="text-xl">{emoji}</span>
                <span className="text-sm font-medium text-white">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-10">
        <div className="w-full max-w-md animate-slide-up">

          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-3xl shadow-lg">🍔</div>
            <h1 className="text-2xl font-extrabold text-slate-900">FoodieHub</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">Welcome back!</h2>
            <p className="mt-1 text-slate-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span>⚠️</span> {error}
              </div>
            )}

            <div>
              <label className="input-label" htmlFor="email">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  className="input-field pl-10"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="password">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  className="input-field pl-10"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button disabled={loading} className="btn-primary w-full !py-3 text-base" type="submit">
              {loading ? 'Signing in…' : (
                <span className="flex items-center gap-2">Sign In <FiArrowRight /></span>
              )}
            </button>
          </form>

          <div className="divider mt-6">or</div>

          <p className="mt-5 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
