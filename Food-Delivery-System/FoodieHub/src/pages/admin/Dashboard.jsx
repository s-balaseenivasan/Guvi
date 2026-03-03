import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiShoppingBag, FiStar, FiTrendingUp,
  FiActivity, FiAlertCircle,
} from 'react-icons/fi';
import Loading from '../../common/Loading';
import { adminAPI } from '../../services/api';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="card flex items-start gap-4">
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white text-xl ${color}`}>
      <Icon />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminAPI.getStats()
      .then((r) => setStats(r.data))
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullScreen />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-slate-500">Platform overview and quick actions</p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <FiAlertCircle /> {error}
        </div>
      )}

      {stats && (
        <>
          {/* Stat cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div className="xl:col-span-2">
              <StatCard icon={FiUsers} label="Total Users" value={stats.users} color="bg-blue-500" />
            </div>
            <div className="xl:col-span-2">
              <StatCard icon={FiShoppingBag} label="Restaurants" value={stats.restaurants} color="bg-amber-500" />
            </div>
            <div className="xl:col-span-2">
              <StatCard icon={FiActivity} label="Total Orders" value={stats.orders} sub={`${stats.activeOrders} active now`} color="bg-violet-500" />
            </div>
            <div className="xl:col-span-3">
              <StatCard icon={FiTrendingUp} label="Revenue (delivered)" value={`₹${Number(stats.revenue).toFixed(2)}`} color="bg-emerald-500" />
            </div>
            <div className="xl:col-span-3">
              <StatCard icon={FiStar} label="Total Reviews" value={stats.reviews} color="bg-pink-500" />
            </div>
          </div>

          {/* Quick links */}
          <h2 className="mb-4 text-lg font-bold text-slate-800">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: '/admin/users', emoji: '👥', title: 'Manage Users', desc: `${stats.users} registered users` },
              { to: '/admin/restaurants', emoji: '🍽️', title: 'Restaurants', desc: `${stats.restaurants} partner restaurants` },
              { to: '/admin/orders', emoji: '📦', title: 'All Orders', desc: `${stats.activeOrders} active orders` },
              { to: '/admin/reviews', emoji: '⭐', title: 'Moderate Reviews', desc: `${stats.reviews} total reviews` },
            ].map(({ to, emoji, title, desc }) => (
              <Link key={to} to={to} className="card-hover flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                  {emoji}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default AdminDashboard;
