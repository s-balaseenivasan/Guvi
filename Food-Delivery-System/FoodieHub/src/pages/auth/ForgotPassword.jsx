import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { authAPI } from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md animate-slide-up">

        <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600">
          <FiArrowLeft /> Back to Login
        </Link>

        {sent ? (
          <div className="card text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl">
              <FiCheckCircle />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Check your email</h2>
            <p className="text-slate-500 text-sm">
              If <strong>{email}</strong> is registered, you'll receive a password reset link shortly.
              The link expires in <strong>1 hour</strong>.
            </p>
            <p className="text-xs text-slate-400">Don't see it? Check your spam folder.</p>
            <Link to="/login" className="btn-primary inline-flex w-full justify-center">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900">Forgot password?</h2>
              <p className="mt-1 text-slate-500">Enter your email and we'll send you a reset link.</p>
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
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button disabled={loading} className="btn-primary w-full !py-3 text-base" type="submit">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Remembered it?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                Sign in →
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
