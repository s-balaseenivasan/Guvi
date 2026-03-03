import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiBell, FiLogOut, FiShoppingCart, FiUser, FiShield, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';

const NavLink = ({ to, children, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname.startsWith(to) && to !== '/';
  return (
    <Link to={to} onClick={onClick} className={active ? 'nav-link-active' : 'nav-link'}>
      {children}
    </Link>
  );
};

const buildNotifIds = (orders) => {
  const ids = [];
  orders.forEach((o) => {
    if (o.status === 'delivered') ids.push(`${o._id}-review`);
    else if (o.status === 'out_for_delivery') ids.push(`${o._id}-otd`);
    else if (o.status === 'preparing') ids.push(`${o._id}-prep`);
    else if (o.status === 'confirmed') ids.push(`${o._id}-conf`);
    else if (o.status === 'pending') ids.push(`${o._id}-placed`);
  });
  return ids;
};

const Navbar = () => {
  const { user, logout, isAuthenticated, isCustomer, isRestaurant, isAdmin } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [notifCount, setNotifCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (!isAuthenticated) { setNotifCount(0); return; }
    const compute = async () => {
      try {
        const res = await orderAPI.getMy();
        const orders = res.data || [];
        if (isCustomer) {
          const ids = buildNotifIds(orders);
          const readSet = new Set(JSON.parse(localStorage.getItem('readNotifications') || '[]'));
          setNotifCount(ids.filter((id) => !readSet.has(id)).length);
        } else if (isRestaurant) {
          setNotifCount(orders.filter((o) => o.status === 'pending').length);
        }
      } catch { /* ignore */ }
    };
    compute();
    const interval = setInterval(compute, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, isCustomer, isRestaurant]);

  const handleLogout = () => { logout(); navigate('/login'); };
  const cartCount = getItemCount();
  const close = () => setMobileOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600 transition-colors hover:text-primary-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white text-base shadow-sm">
              🍔
            </span>
            <span>FoodieHub</span>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden items-center gap-1 md:flex">
            {!isAuthenticated ? (
              <>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn-primary ml-2 !px-4 !py-2">Sign Up</Link>
              </>
            ) : (
              <>
                {isCustomer && (
                  <>
                    <NavLink to="/customer/restaurants">Restaurants</NavLink>
                    <NavLink to="/customer/orders">My Orders</NavLink>
                    <Link
                      to="/customer/cart"
                      className="relative ml-1 flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-primary-700"
                    >
                      <FiShoppingCart className="text-lg" />
                      {cartCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow">
                          {cartCount > 9 ? '9+' : cartCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {isRestaurant && (
                  <>
                    <NavLink to="/restaurant/dashboard">Dashboard</NavLink>
                    <NavLink to="/restaurant/menu">Menu</NavLink>
                    <NavLink to="/restaurant/orders">Orders</NavLink>
                  </>
                )}

                {isAdmin && (
                  <>
                    <NavLink to="/admin/dashboard">Dashboard</NavLink>
                    <NavLink to="/admin/users">Users</NavLink>
                    <NavLink to="/admin/restaurants">Restaurants</NavLink>
                    <NavLink to="/admin/orders">Orders</NavLink>
                    <NavLink to="/admin/reviews">Reviews</NavLink>
                  </>
                )}

                {/* Notification bell */}
                <Link
                  to="/notifications"
                  className="relative ml-1 flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-primary-700"
                >
                  <FiBell className="text-lg" />
                  {notifCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
                      {notifCount > 9 ? '9+' : notifCount}
                    </span>
                  )}
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  className="ml-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                >
                  {isAdmin ? <FiShield className="text-purple-600" /> : <FiUser className="text-base" />}
                  <span className="hidden sm:inline">{user?.username}</span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                  title="Logout"
                >
                  <FiLogOut className="text-lg" />
                </button>
              </>
            )}
          </div>

          {/* ── Mobile right side ── */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Cart icon on mobile (customers) */}
            {isCustomer && (
              <Link to="/customer/cart" className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100">
                <FiShoppingCart className="text-lg" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}
            {/* Notification bell on mobile */}
            {isAuthenticated && (
              <Link to="/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100">
                <FiBell className="text-lg" />
                {notifCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </Link>
            )}
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile slide-down menu ── */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-30 border-b border-slate-200 bg-white shadow-lg animate-slide-up md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-1">
            {!isAuthenticated ? (
              <>
                <Link to="/" onClick={close} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Home</Link>
                <Link to="/login" onClick={close} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Login</Link>
                <Link to="/register" onClick={close} className="btn-primary w-full !justify-start">Sign Up</Link>
              </>
            ) : (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    {isAdmin ? <FiShield /> : <FiUser />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user?.username}</p>
                    <p className="text-xs capitalize text-slate-500">{user?.role}</p>
                  </div>
                </div>

                {isCustomer && (
                  <>
                    <Link to="/customer/restaurants" onClick={close} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">Restaurants</Link>
                    <Link to="/customer/orders" onClick={close} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">My Orders</Link>
                  </>
                )}
                {isRestaurant && (
                  <>
                    <Link to="/restaurant/dashboard" onClick={close} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">Dashboard</Link>
                    <Link to="/restaurant/menu" onClick={close} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">Menu</Link>
                    <Link to="/restaurant/orders" onClick={close} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">Orders</Link>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Link to="/admin/dashboard" onClick={close} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">Dashboard</Link>
                    <Link to="/admin/users" onClick={close} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">Users</Link>
                    <Link to="/admin/restaurants" onClick={close} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">Restaurants</Link>
                    <Link to="/admin/orders" onClick={close} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">Orders</Link>
                    <Link to="/admin/reviews" onClick={close} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">Reviews</Link>
                  </>
                )}

                <Link to="/profile" onClick={close} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">Profile</Link>

                <div className="border-t border-slate-200 pt-2 mt-2">
                  <button
                    onClick={() => { close(); handleLogout(); }}
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
