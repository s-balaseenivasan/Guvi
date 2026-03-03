import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './common/Navbar';
import ProtectedRoute from './common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import RestaurantsList from './pages/customer/RestaurantsList';
import RestaurantDetails from './pages/RestaurantDetails';
import CartPage from './pages/customer/Cart';
import CustomerOrders from './pages/customer/Orders';
import RestaurantDashboard from './pages/restaurant/Dashboard';
import RestaurantMenu from './pages/restaurant/MenuManager';
import RestaurantOrders from './pages/restaurant/Orders';
import ProfilePage from './pages/Profile';
import NotificationsPage from './pages/Notifications';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminRestaurants from './pages/admin/Restaurants';
import AdminOrders from './pages/admin/Orders';
import AdminReviews from './pages/admin/Reviews';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/customer/restaurants" element={<ProtectedRoute requiredRole="customer"><RestaurantsList /></ProtectedRoute>} />
        <Route path="/customer/restaurant/:id" element={<ProtectedRoute requiredRole="customer"><RestaurantDetails /></ProtectedRoute>} />
        <Route path="/customer/cart" element={<ProtectedRoute requiredRole="customer"><CartPage /></ProtectedRoute>} />
        <Route path="/customer/orders" element={<ProtectedRoute requiredRole="customer"><CustomerOrders /></ProtectedRoute>} />

        <Route path="/restaurant/dashboard" element={<ProtectedRoute requiredRole="restaurant"><RestaurantDashboard /></ProtectedRoute>} />
        <Route path="/restaurant/menu" element={<ProtectedRoute requiredRole="restaurant"><RestaurantMenu /></ProtectedRoute>} />
        <Route path="/restaurant/orders" element={<ProtectedRoute requiredRole="restaurant"><RestaurantOrders /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/restaurants" element={<ProtectedRoute requiredRole="admin"><AdminRestaurants /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute requiredRole="admin"><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/reviews" element={<ProtectedRoute requiredRole="admin"><AdminReviews /></ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
