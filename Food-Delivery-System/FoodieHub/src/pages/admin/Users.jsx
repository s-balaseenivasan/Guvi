import { useEffect, useState } from 'react';
import { FiSearch, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Loading from '../../common/Loading';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ROLE_COLORS = {
  customer: 'badge-blue',
  restaurant: 'badge-orange',
  admin: 'badge bg-purple-100 text-purple-700',
};

const ROLES = ['customer', 'restaurant', 'admin'];

const AdminUsers = () => {
  const { user: me } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const fetch = async (p = page) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: p, limit: 15 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await adminAPI.getUsers(params);
      setData(res.data);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(1); setPage(1); }, [search, roleFilter]);

  const handleRoleChange = async (id, role) => {
    setActionLoading(id + role);
    try {
      const res = await adminAPI.updateUserRole(id, role);
      setData((d) => ({ ...d, data: d.data.map((u) => u._id === id ? res.data : u) }));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    setActionLoading('del' + id);
    try {
      await adminAPI.deleteUser(id);
      setData((d) => ({ ...d, data: d.data.filter((u) => u._id !== id), total: d.total - 1 }));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const goPage = (p) => { setPage(p); fetch(p); };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">User Management</h1>
        <p className="mt-1 text-slate-500">View, change roles, and delete users</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-field pl-10"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field w-auto min-w-36"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? <Loading /> : !data?.data?.length ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="mb-3 text-5xl">👥</span>
          <p className="font-semibold text-slate-600">No users found</p>
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm text-slate-500">{data.total} user{data.total !== 1 ? 's' : ''} found</p>
          <div className="card overflow-hidden !p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.data.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{u.username}</td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={ROLE_COLORS[u.role] || 'badge-slate'}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u._id !== me?._id && (
                          <>
                            <select
                              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-primary-400"
                              value={u.role}
                              disabled={!!actionLoading}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            >
                              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <button
                              onClick={() => handleDelete(u._id, u.username)}
                              disabled={!!actionLoading}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                              title="Delete user"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                        {u._id === me?._id && <span className="text-xs text-slate-400">You</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => goPage(page - 1)}
                disabled={page === 1}
                className="btn-secondary !px-3 !py-2 disabled:opacity-40"
              >
                <FiChevronLeft />
              </button>
              <span className="text-sm text-slate-600">Page {page} of {data.pages}</span>
              <button
                onClick={() => goPage(page + 1)}
                disabled={page === data.pages}
                className="btn-secondary !px-3 !py-2 disabled:opacity-40"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default AdminUsers;
