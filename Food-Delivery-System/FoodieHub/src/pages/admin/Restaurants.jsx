import { useEffect, useState } from 'react';
import { FiSearch, FiMapPin, FiStar } from 'react-icons/fi';
import Loading from '../../common/Loading';
import { restaurantAPI } from '../../services/api';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (search) params.search = search;
        const res = await restaurantAPI.getAll(params);
        setRestaurants(res.data?.data || []);
      } catch {
        setError('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Restaurants</h1>
        <p className="mt-1 text-slate-500">Overview of all registered restaurants</p>
      </div>

      <div className="mb-6 relative max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input-field pl-10"
          placeholder="Search restaurants…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? <Loading /> : restaurants.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="mb-3 text-5xl">🍽️</span>
          <p className="font-semibold text-slate-600">No restaurants found</p>
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm text-slate-500">{restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}</p>
          <div className="card overflow-hidden !p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">City</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {restaurants.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{r.name}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{r.description || '—'}</td>
                    <td className="px-4 py-3">
                      {r.location?.city ? (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <FiMapPin size={12} /> {r.location.city}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {r.rating > 0 ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                          <FiStar size={12} /> {Number(r.rating).toFixed(1)}
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={r.isOpen ? 'badge-green' : 'badge-red'}>
                        {r.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
};

export default AdminRestaurants;
