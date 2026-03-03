import { useEffect, useRef, useState } from 'react';
import {
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPackage,
  FiRefreshCw,
  FiTruck,
  FiXCircle,
} from 'react-icons/fi';
import Loading from '../../common/Loading';
import { orderAPI } from '../../services/api';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: FiClock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: FiCheckCircle },
  preparing: { label: 'Preparing', color: 'bg-orange-100 text-orange-800', icon: FiPackage },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800', icon: FiTruck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: FiXCircle },
};

const NEXT_STATUS = {
  pending: { value: 'confirmed', label: 'Confirm Order' },
  confirmed: { value: 'preparing', label: 'Start Preparing' },
  preparing: { value: 'out_for_delivery', label: 'Send for Delivery' },
  out_for_delivery: { value: 'delivered', label: 'Mark Delivered' },
};

const ACTIVE_STATUSES = new Set(['pending', 'confirmed', 'preparing', 'out_for_delivery']);

const OrderCard = ({ order, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [eta, setEta] = useState('');
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = config.icon;
  const next = NEXT_STATUS[order.status];

  const handleAdvance = async () => {
    if (!next) return;
    setUpdating(true);
    try {
      const payload = { status: next.value };
      if (order.status === 'confirmed' && eta) payload.etaMinutes = Number(eta);
      const res = await orderAPI.updateStatus(order._id, payload);
      onUpdate(res.data);
    } catch (err) {
      alert(err.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setUpdating(true);
    try {
      const res = await orderAPI.updateStatus(order._id, { status: 'cancelled' });
      onUpdate(res.data);
    } catch (err) {
      alert(err.message || 'Cancel failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <article className="card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">Order #{order._id.slice(-8)}</p>
          <p className="text-xs text-slate-400">
            {new Date(order.createdAt).toLocaleString()}
          </p>
          {order.deliveryType === 'scheduled' && order.scheduledAt && (
            <p className="mt-0.5 text-xs font-medium text-primary-600">
              Scheduled: {new Date(order.scheduledAt).toLocaleString()}
            </p>
          )}
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${config.color}`}
        >
          <StatusIcon size={12} />
          {config.label}
        </span>
      </div>

      {/* Items */}
      <div className="mt-3 space-y-1 rounded-lg bg-slate-50 p-3 text-sm">
        {order.items?.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span>
              {item.quantity}× {item.name}
              {item.specialInstructions && (
                <span className="ml-1 text-slate-400 italic">({item.specialInstructions})</span>
              )}
            </span>
            <span className="text-slate-600">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        {order.selectedAddOns?.length > 0 && (
          <p className="text-xs text-slate-400">
            Add-ons: {order.selectedAddOns.map((a) => a.name).join(', ')}
          </p>
        )}
      </div>

      {/* Delivery Address */}
      {order.deliveryAddress && (
        <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
          <FiMapPin size={12} />
          {[
            order.deliveryAddress.street,
            order.deliveryAddress.city,
            order.deliveryAddress.state,
          ]
            .filter(Boolean)
            .join(', ')}
        </p>
      )}

      {/* Footer */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <div className="text-sm">
          <span className="font-semibold">₹{Number(order.totalAmount).toFixed(2)}</span>
          <span
            className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
              order.paymentStatus === 'paid'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {order.paymentStatus}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {order.status === 'confirmed' && (
            <input
              type="number"
              className="input-field w-24 text-sm"
              placeholder="ETA min"
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              min="1"
            />
          )}
          {next && (
            <button
              disabled={updating}
              onClick={handleAdvance}
              className="btn-primary text-sm"
            >
              {updating ? '...' : next.label}
            </button>
          )}
          {['pending', 'confirmed', 'preparing'].includes(order.status) && (
            <button
              disabled={updating}
              onClick={handleCancel}
              className="btn-secondary text-sm text-red-600 hover:bg-red-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('active');
  const pollingRef = useRef(null);

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
    pollingRef.current = setInterval(() => fetchOrders(true), 20000);
    return () => clearInterval(pollingRef.current);
  }, []);

  const handleUpdate = (updated) => {
    setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
  };

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.has(o.status));
  const pastOrders = orders.filter((o) => !ACTIVE_STATUSES.has(o.status));
  const displayed = tab === 'active' ? activeOrders : pastOrders;

  if (loading) return <Loading fullScreen />;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1">
        <button
          onClick={() => setTab('active')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
            tab === 'active' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Active
          {activeOrders.length > 0 && (
            <span className="ml-1.5 rounded-full bg-primary-600 px-1.5 py-0.5 text-xs text-white">
              {activeOrders.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('history')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
            tab === 'history' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          History ({pastOrders.length})
        </button>
      </div>

      {displayed.length === 0 ? (
        <div className="card py-16 text-center text-slate-500">
          {tab === 'active' ? 'No active orders right now.' : 'No past orders.'}
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((order) => (
            <OrderCard key={order._id} order={order} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </main>
  );
};

export default RestaurantOrders;
