import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiCheckCircle, FiPackage, FiStar, FiTruck, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const TYPE_CONFIG = {
  order_placed:     { icon: FiPackage,     color: 'text-blue-500 bg-blue-50',       label: 'Order Placed' },
  order_confirmed:  { icon: FiCheckCircle, color: 'text-green-500 bg-green-50',     label: 'Order Confirmed' },
  order_preparing:  { icon: FiPackage,     color: 'text-orange-500 bg-orange-50',   label: 'Being Prepared' },
  out_for_delivery: { icon: FiTruck,       color: 'text-purple-500 bg-purple-50',   label: 'Out for Delivery' },
  delivered:        { icon: FiCheckCircle, color: 'text-green-500 bg-green-50',     label: 'Delivered' },
  review_reminder:  { icon: FiStar,        color: 'text-amber-500 bg-amber-50',     label: 'Leave a Review' },
  new_order:        { icon: FiShoppingBag, color: 'text-primary-600 bg-primary-50', label: 'New Order' },
};

const buildCustomerNotifications = (orders) => {
  const notifs = [];
  orders.forEach((order) => {
    const restaurant = order.restaurant?.name || 'restaurant';
    if (order.status === 'delivered') {
      notifs.push({ id: `${order._id}-review`, type: 'review_reminder',
        message: `How was your order from ${restaurant}? Leave a review!`,
        createdAt: order.updatedAt || order.createdAt, link: '/customer/orders' });
    } else if (order.status === 'out_for_delivery') {
      notifs.push({ id: `${order._id}-otd`, type: 'out_for_delivery',
        message: `Your order from ${restaurant} is on its way${order.etaMinutes ? ` (~${order.etaMinutes} min)` : ''}!`,
        createdAt: order.updatedAt || order.createdAt, link: '/customer/orders' });
    } else if (order.status === 'preparing') {
      notifs.push({ id: `${order._id}-prep`, type: 'order_preparing',
        message: `${restaurant} is preparing your order.`,
        createdAt: order.updatedAt || order.createdAt, link: '/customer/orders' });
    } else if (order.status === 'confirmed') {
      notifs.push({ id: `${order._id}-conf`, type: 'order_confirmed',
        message: `${restaurant} has confirmed your order!`,
        createdAt: order.updatedAt || order.createdAt, link: '/customer/orders' });
    } else if (order.status === 'pending') {
      notifs.push({ id: `${order._id}-placed`, type: 'order_placed',
        message: `Your order was placed at ${restaurant}. Waiting for confirmation...`,
        createdAt: order.createdAt, link: '/customer/orders' });
    }
  });
  return notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const buildRestaurantNotifications = (orders) =>
  orders
    .filter((o) => o.status === 'pending')
    .map((order) => ({
      id: `${order._id}-new`,
      type: 'new_order',
      message: `New order #${order._id.slice(-8)} received — ₹${Number(order.totalAmount).toFixed(2)}`,
      createdAt: order.createdAt,
      link: '/restaurant/orders',
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const NotificationsPage = () => {
  const { isCustomer, isRestaurant } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState(() => {
    const saved = localStorage.getItem('readNotifications');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await orderAPI.getMy();
        const orders = res.data || [];
        if (isCustomer) {
          setNotifications(buildCustomerNotifications(orders));
        } else if (isRestaurant) {
          setNotifications(buildRestaurantNotifications(orders));
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isCustomer, isRestaurant]);

  const markAllRead = () => {
    const allIds = new Set(notifications.map((n) => n.id));
    setRead(allIds);
    localStorage.setItem('readNotifications', JSON.stringify([...allIds]));
  };

  const markRead = (id) => {
    const next = new Set([...read, id]);
    setRead(next);
    localStorage.setItem('readNotifications', JSON.stringify([...next]));
  };

  const unreadCount = notifications.filter((n) => !read.has(n.id)).length;

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-slate-200" />
          <div className="mx-auto h-4 w-48 rounded bg-slate-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="mt-1 text-sm text-slate-500">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <FiBell className="text-3xl text-slate-400" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-700">You&apos;re all caught up!</h2>
          <p className="mt-2 text-sm text-slate-400">
            {isCustomer
              ? 'Notifications about your orders will appear here.'
              : isRestaurant
              ? 'New orders will appear here.'
              : 'No notifications yet.'}
          </p>
          {isCustomer && (
            <Link to="/customer/restaurants" className="btn-primary mt-6">
              Browse Restaurants
            </Link>
          )}
          {isRestaurant && (
            <Link to="/restaurant/orders" className="btn-primary mt-6">
              View Orders
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.order_placed;
            const Icon = config.icon;
            const isUnread = !read.has(notif.id);
            return (
              <Link
                key={notif.id}
                to={notif.link || '#'}
                onClick={() => markRead(notif.id)}
                className={`card flex items-start gap-4 transition hover:shadow-md ${
                  isUnread ? 'border-l-4 border-l-primary-500' : ''
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.color}`}>
                  <Icon className="text-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${isUnread ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                    {notif.message}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
                {isUnread && (
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary-600" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default NotificationsPage;
