import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiRefreshCw,
  FiStar,
  FiTruck,
  FiXCircle,
} from 'react-icons/fi';
import Loading from '../../common/Loading';
import { orderAPI, reviewAPI } from '../../services/api';

const STATUS_CONFIG = {
  pending:          { label: 'Pending',          color: 'bg-yellow-100 text-yellow-800', icon: FiClock },
  confirmed:        { label: 'Confirmed',        color: 'bg-blue-100 text-blue-800',     icon: FiCheckCircle },
  preparing:        { label: 'Preparing',        color: 'bg-orange-100 text-orange-800', icon: FiPackage },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800', icon: FiTruck },
  delivered:        { label: 'Delivered',        color: 'bg-green-100 text-green-800',   icon: FiCheckCircle },
  cancelled:        { label: 'Cancelled',        color: 'bg-red-100 text-red-800',       icon: FiXCircle },
};

const ACTIVE_STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery'];
// Orders still waiting for / having failed payment are hidden from the customer view
const HIDDEN_STATUSES = ['pending_payment', 'payment_failed'];

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className={`text-2xl transition ${star <= value ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'}`}
      >
        <FiStar />
      </button>
    ))}
  </div>
);

const ReviewModal = ({ order, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await onSubmit({ orderId: order._id, rating, comment });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="card w-full max-w-md p-6">
        <h2 className="mb-1 text-xl font-semibold">Leave a Review</h2>
        <p className="mb-4 text-sm text-slate-500">
          How was your experience at <strong>{order.restaurant?.name}</strong>?
        </p>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Rating</label>
          <StarRating value={rating} onChange={setRating} />
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Comment (optional)</label>
          <textarea
            className="input-field h-24 resize-none"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        {error && <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <div className="flex gap-2">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1">
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderStatusBar = ({ status }) => {
  const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
  const currentIdx = steps.indexOf(status);

  if (status === 'cancelled') {
    return (
      <p className="mt-2 text-sm font-medium text-red-600">
        This order was cancelled.
      </p>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const done = i <= currentIdx;
        const config = STATUS_CONFIG[step];
        return (
          <div key={step} className="flex items-center">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                done ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-400'
              }`}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-1 w-8 shrink-0 ${i < currentIdx ? 'bg-primary-600' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
      <span className="ml-2 text-xs text-slate-500 whitespace-nowrap">
        {STATUS_CONFIG[status]?.label}
      </span>
    </div>
  );
};

const CustomerOrders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [reviewedOrders, setReviewedOrders] = useState(new Set());
  const [error, setError] = useState('');
  const pollingRef = useRef(null);

  const newOrderId = location.state?.newOrderId;

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await orderAPI.getMy();
      setOrders(res.data || []);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll every 30s for active orders
    pollingRef.current = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(pollingRef.current);
  }, []);

  const handleReviewSubmit = async (payload) => {
    await reviewAPI.create(payload);
    setReviewedOrders((prev) => new Set([...prev, payload.orderId]));
  };

  const visibleOrders = orders.filter((o) => !HIDDEN_STATUSES.includes(o.status));
  const activeOrders  = visibleOrders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const pastOrders    = visibleOrders.filter((o) => !ACTIVE_STATUSES.includes(o.status));

  if (loading) return <Loading fullScreen />;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {newOrderId && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
          Order placed successfully! Payment verified via Razorpay.
        </div>
      )}

      {error && (
        <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>
      )}

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">
            Active Orders
            <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-sm font-medium text-primary-700">
              {activeOrders.length}
            </span>
          </h2>
          <div className="space-y-4">
            {activeOrders.map((order) => {
              const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = config.icon;
              return (
                <article
                  key={order._id}
                  className={`card border-l-4 ${order._id === newOrderId ? 'border-l-primary-500' : 'border-l-transparent'}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-semibold">{order.restaurant?.name}</h2>
                      <p className="text-xs text-slate-400">
                        #{order._id.slice(-8)} · {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${config.color}`}
                    >
                      <StatusIcon size={12} />
                      {config.label}
                    </span>
                  </div>

                  <OrderStatusBar status={order.status} />

                  {order.etaMinutes && order.status === 'out_for_delivery' && (
                    <p className="mt-2 text-sm font-medium text-primary-600">
                      ETA: ~{order.etaMinutes} minutes
                    </p>
                  )}

                  <div className="mt-3 space-y-2">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} alt={item.name}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            onError={(e) => (e.target.style.display = 'none')} />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-base">🍽️</div>
                        )}
                        <p className="text-sm text-slate-600">
                          {item.quantity}× {item.name}
                          {item.specialInstructions && (
                            <span className="text-slate-400"> ({item.specialInstructions})</span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <p className="font-semibold">₹{Number(order.totalAmount).toFixed(2)}</p>
                    <p className="text-xs text-slate-400 capitalize">
                      {order.deliveryType === 'scheduled' && order.scheduledAt
                        ? `Scheduled: ${new Date(order.scheduledAt).toLocaleString()}`
                        : 'ASAP delivery'}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Past Orders */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Order History</h2>
        {pastOrders.length === 0 && activeOrders.length === 0 ? (
          <p className="text-slate-500">No orders yet. Start browsing restaurants!</p>
        ) : pastOrders.length === 0 ? (
          <p className="text-slate-400 text-sm">No past orders.</p>
        ) : (
          <div className="space-y-3">
            {pastOrders.map((order) => {
              const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.delivered;
              const StatusIcon = config.icon;
              const canReview =
                order.status === 'delivered' && !reviewedOrders.has(order._id);
              return (
                <article key={order._id} className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-semibold">{order.restaurant?.name}</h2>
                      <p className="text-xs text-slate-400">
                        #{order._id.slice(-8)} · {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${config.color}`}
                    >
                      <StatusIcon size={12} />
                      {config.label}
                    </span>
                  </div>

                  <div className="mt-2 space-y-2">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} alt={item.name}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            onError={(e) => (e.target.style.display = 'none')} />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-base">🍽️</div>
                        )}
                        <p className="text-sm text-slate-600">{item.quantity}× {item.name}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <p className="font-semibold">₹{Number(order.totalAmount).toFixed(2)}</p>
                    {canReview && (
                      <button
                        onClick={() => setReviewingOrder(order)}
                        className="btn-secondary flex items-center gap-1 text-sm"
                      >
                        <FiStar /> Leave Review
                      </button>
                    )}
                    {reviewedOrders.has(order._id) && (
                      <span className="text-sm text-green-600 font-medium">Review submitted</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {reviewingOrder && (
        <ReviewModal
          order={reviewingOrder}
          onClose={() => setReviewingOrder(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </main>
  );
};

export default CustomerOrders;
