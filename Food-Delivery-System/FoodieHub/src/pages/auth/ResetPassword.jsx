import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { authAPI } from '../../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-6">
        <div className="card w-full max-w-md text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 text-3xl">
            <FiAlertCircle />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Invalid Reset Link</h2>
          <p className="text-sm text-slate-500">This link is missing a reset token. Please request a new one.</p>
          <Link to="/forgot-password" className="btn-primary inline-flex w-full justify-center">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword({ token, newPassword: form.newPassword });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Invalid or expired link. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md animate-slide-up">

        {done ? (
          <div className="card text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl">
              <FiCheckCircle />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Password reset!</h2>
            <p className="text-slate-500 text-sm">Your password has been updated. Redirecting you to login…</p>
            <Link to="/login" className="btn-primary inline-flex w-full justify-center">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900">Set new password</h2>
              <p className="mt-1 text-slate-500">Choose a strong password for your account.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <FiAlertCircle /> {error}
                </div>
              )}

              <div>
                <label className="input-label" htmlFor="newPassword">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="newPassword"
                    className="input-field pl-10"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={form.newPassword}
                    onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="input-label" htmlFor="confirmPassword">Confirm New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="confirmPassword"
                    className="input-field pl-10"
                    type="password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <button disabled={loading} className="btn-primary w-full !py-3 text-base" type="submit">
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Link expired?{' '}
              <Link to="/forgot-password" className="font-semibold text-primary-600 hover:text-primary-700">
                Request a new one →
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
