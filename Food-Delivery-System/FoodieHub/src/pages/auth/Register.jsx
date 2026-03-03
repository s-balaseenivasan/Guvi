import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register({ username: formData.username, email: formData.email, password: formData.password, phone: formData.phone, role });
      navigate(role === 'restaurant' ? '/restaurant/dashboard' : '/customer/restaurants');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">

      {/* ── Left brand panel ── */}
      <div className="hidden flex-col items-center justify-center gap-8 bg-gradient-to-br from-primary-800 via-primary-700 to-amber-600 px-12 lg:flex lg:w-2/5">
        <div className="relative text-center animate-fade-in">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-5xl shadow-lg backdrop-blur-sm animate-bounce-gentle">
            🍽️
          </div>
          <h1 className="text-4xl font-extrabold text-white">Join FoodieHub</h1>
          <p className="mt-3 text-lg text-primary-100">It's free and takes 30 seconds</p>

          <div className="mt-8 flex flex-col gap-3 text-left">
            {[
              { emoji: '🛒', text: 'Order from 100+ restaurants' },
              { emoji: '📍', text: 'Save delivery addresses' },
              { emoji: '🔔', text: 'Real-time order tracking' },
              { emoji: '💳', text: 'Multiple payment options' },
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

          <div className="mb-7">
            <h2 className="text-3xl font-extrabold text-slate-900">Create an account</h2>
            <p className="mt-1 text-slate-500">Join thousands of food lovers today</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Role selector */}
            <div>
              <p className="input-label">I am a…</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'customer',   emoji: '🛒', label: 'Customer'   },
                  { key: 'restaurant', emoji: '🍽️', label: 'Restaurant' },
                ].map(({ key, emoji, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRole(key)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3.5 text-sm font-semibold transition-all duration-150 ${
                      role === key
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="input-label" htmlFor="username">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="username" className="input-field pl-10" placeholder="johndoe" name="username" value={formData.username} onChange={onChange} required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="input-label" htmlFor="reg-email">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="reg-email" className="input-field pl-10" placeholder="you@example.com" type="email" name="email" value={formData.email} onChange={onChange} required />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="input-label" htmlFor="phone">
                Phone <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="phone" className="input-field pl-10" placeholder="+91 99999 99999" name="phone" value={formData.phone} onChange={onChange} />
              </div>
            </div>

            {/* Passwords row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label" htmlFor="reg-password">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="reg-password" className="input-field pl-10" placeholder="Min. 6 chars" type="password" name="password" value={formData.password} onChange={onChange} required />
                </div>
              </div>
              <div>
                <label className="input-label" htmlFor="confirmPassword">Confirm</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="confirmPassword" className="input-field pl-10" placeholder="Repeat" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={onChange} required />
                </div>
              </div>
            </div>

            <button disabled={loading} className="btn-primary w-full !py-3 text-base" type="submit">
              {loading ? 'Creating account…' : (
                <span className="flex items-center gap-2">Create Account <FiArrowRight /></span>
              )}
            </button>
          </form>

          <div className="divider mt-6">or</div>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
