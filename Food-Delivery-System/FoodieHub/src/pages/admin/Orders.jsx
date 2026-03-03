import { useEffect, useState } from 'react';
import { FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Loading from '../../common/Loading';
import { adminAPI } from '../../services/api';

const STATUS_COLORS = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  preparing: 'status-preparing',
  out_for_delivery: 'badge bg-violet-100 text-violet-700',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

const STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const fetch = async (p = page) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: p, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const res = await adminAPI.getOrders(params);
      setData(res.data);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(1); setPage(1); }, [statusFilter]);

  const goPage = (p) => { setPage(p); fetch(p); };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">All Orders</h1>
          <p className="mt-1 text-slate-500">Platform-wide order management</p>
        </div>
        <button onClick={() => fetch(page)} className="btn-secondary gap-2">
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Status filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${!statusFilter ? 'bg-primary-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${statusFilter === s ? 'bg-primary-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? <Loading /> : !data?.data?.length ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="mb-3 text-5xl">📦</span>
          <p className="font-semibold text-slate-600">No orders found</p>
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm text-slate-500">{data.total} order{data.total !== 1 ? 's' : ''}</p>
          <div className="space-y-3">
            {data.data.map((order) => (
              <article key={order._id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 truncate">{order.restaurant?.name || 'Unknown'}</p>
                    <span className={STATUS_COLORS[order.status] || 'badge-slate'}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    #{order._id.slice(-8)} · by {order.customer?.username || 'Unknown'} ({order.customer?.email})
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''} ·{' '}
                    {order.deliveryType === 'scheduled' ? 'Scheduled' : 'ASAP'}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-bold text-primary-700">₹{Number(order.totalAmount).toFixed(2)}</p>
                  <p className="text-xs text-slate-400">
                    {order.deliveryAddress?.city || '—'}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {data.pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
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

export default AdminOrders;
