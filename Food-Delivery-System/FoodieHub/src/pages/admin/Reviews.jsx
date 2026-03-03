import { useEffect, useState } from 'react';
import { FiStar, FiCheck, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Loading from '../../common/Loading';
import { adminAPI } from '../../services/api';

const MOD_COLORS = {
  approved: 'badge-green',
  rejected: 'badge-red',
  pending: 'badge-orange',
};

const STATUSES = ['pending', 'approved', 'rejected'];

const StarDisplay = ({ value }) => (
  <span className="inline-flex items-center gap-0.5 text-amber-500">
    {[1, 2, 3, 4, 5].map((s) => (
      <FiStar key={s} className={s <= value ? 'fill-amber-400' : 'text-slate-200'} size={12} />
    ))}
    <span className="ml-1 text-xs font-medium text-slate-600">{value}/5</span>
  </span>
);

const AdminReviews = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const fetch = async (p = page) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: p, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const res = await adminAPI.getReviews(params);
      setData(res.data);
    } catch {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(1); setPage(1); }, [statusFilter]);

  const moderate = async (id, newStatus) => {
    setActionLoading(id + newStatus);
    try {
      await adminAPI.moderateReview(id, newStatus);
      setData((d) => ({
        ...d,
        data: d.data.map((r) => r._id === id ? { ...r, moderationStatus: newStatus } : r),
      }));
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
        <h1 className="text-3xl font-extrabold text-slate-900">Review Moderation</h1>
        <p className="mt-1 text-slate-500">Approve or reject customer reviews</p>
      </div>

      {/* Filter pills */}
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
            {s}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? <Loading /> : !data?.data?.length ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="mb-3 text-5xl">⭐</span>
          <p className="font-semibold text-slate-600">No reviews found</p>
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm text-slate-500">{data.total} review{data.total !== 1 ? 's' : ''}</p>
          <div className="space-y-3">
            {data.data.map((review) => (
              <article key={review._id} className="card">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">{review.restaurant?.name || 'Unknown'}</p>
                      <span className={MOD_COLORS[review.moderationStatus] || 'badge-slate'}>
                        {review.moderationStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      By {review.customer?.username || 'Unknown'} · {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <StarDisplay value={review.rating} />
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">
                        "{review.comment}"
                      </p>
                    )}
                    {review.restaurantResponse?.message && (
                      <div className="mt-2 rounded-lg bg-slate-50 border-l-2 border-primary-400 px-3 py-2">
                        <p className="text-xs font-semibold text-slate-500 mb-0.5">Restaurant response:</p>
                        <p className="text-sm text-slate-600">{review.restaurantResponse.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Moderation actions */}
                  <div className="flex shrink-0 gap-2">
                    {review.moderationStatus !== 'approved' && (
                      <button
                        onClick={() => moderate(review._id, 'approved')}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                      >
                        <FiCheck /> Approve
                      </button>
                    )}
                    {review.moderationStatus !== 'rejected' && (
                      <button
                        onClick={() => moderate(review._id, 'rejected')}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        <FiX /> Reject
                      </button>
                    )}
                    {review.moderationStatus !== 'pending' && (
                      <button
                        onClick={() => moderate(review._id, 'pending')}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {data.pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button onClick={() => goPage(page - 1)} disabled={page === 1} className="btn-secondary !px-3 !py-2 disabled:opacity-40">
                <FiChevronLeft />
              </button>
              <span className="text-sm text-slate-600">Page {page} of {data.pages}</span>
              <button onClick={() => goPage(page + 1)} disabled={page === data.pages} className="btn-secondary !px-3 !py-2 disabled:opacity-40">
                <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default AdminReviews;
