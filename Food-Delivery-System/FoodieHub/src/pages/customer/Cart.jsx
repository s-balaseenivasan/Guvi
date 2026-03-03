import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiShoppingCart, FiTrash2, FiMapPin, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { authAPI, orderAPI, paymentAPI } from '../../services/api';

const DELIVERY_FEE = 3.99;

// Dynamically loads the Razorpay checkout script
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const CartPage = () => {
  const { cartItems, restaurantId, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deliveryType, setDeliveryType] = useState('asap');
  const [scheduledAt, setScheduledAt] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(null);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '' });
  const [addrLoading, setAddrLoading] = useState(true);
  const [specialInstructions, setSpecialInstructions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Track the pending order so we don't create duplicates if user retries within the same session
  const [pendingOrderId, setPendingOrderId] = useState(null);

  // Fetch fresh profile on mount to get the latest saved addresses
  useEffect(() => {
    const applyAddresses = (addrs) => {
      setSavedAddresses(addrs);
      if (addrs.length > 0) {
        setSelectedAddressIdx(0);
        const first = addrs[0];
        setAddress({ street: first.street || '', city: first.city || '', state: first.state || '', zipCode: first.zipCode || '' });
      }
    };
    authAPI.getMe()
      .then((res) => applyAddresses(res.data?.addresses || []))
      .catch(() => applyAddresses(user?.addresses || []))
      .finally(() => setAddrLoading(false));
  }, []);

  const selectSavedAddress = (idx) => {
    setSelectedAddressIdx(idx);
    const a = savedAddresses[idx];
    setAddress({ street: a.street || '', city: a.city || '', state: a.state || '', zipCode: a.zipCode || '' });
  };

  const subtotal = getCartTotal();
  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0);

  const updateInstruction = (itemId, value) => {
    setSpecialInstructions((prev) => ({ ...prev, [itemId]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city) {
      setError('Please provide a delivery address');
      return;
    }
    if (deliveryType === 'scheduled' && !scheduledAt) {
      setError('Please select a scheduled delivery time');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // 1. Create the food order only if no pending order exists for this session.
      //    This prevents duplicate food orders when the user retries after a cancel/fail.
      let orderId = pendingOrderId;
      if (!orderId) {
        const items = cartItems.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
          selectedAddOns: item.selectedAddOns || [],
          specialInstructions: specialInstructions[item._id] || '',
        }));

        const orderRes = await orderAPI.create({
          restaurantId,
          items,
          deliveryAddress: address,
          deliveryType,
          ...(deliveryType === 'scheduled' && { scheduledAt }),
        });
        orderId = orderRes.data._id;
        setPendingOrderId(orderId);
      }

      // 2. Create Razorpay order on backend (safe to call again for payment_failed orders)
      const rzpRes = await paymentAPI.createOrder({ orderId });
      const { razorpayOrderId, amount, currency, keyId } = rzpRes.data;

      // 3. Load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Failed to load Razorpay. Check your internet connection.');
        setLoading(false);
        return;
      }

      // 4. Open Razorpay checkout modal
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'FoodieHub',
        description: 'Food Order Payment',
        order_id: razorpayOrderId,
        prefill: {
          name: user?.username || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: '#ea580c' },

        handler: async (response) => {
          // 5. Payment succeeded — verify signature then confirm order
          try {
            await paymentAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setPendingOrderId(null);
            clearCart();
            navigate('/customer/orders', { state: { newOrderId: orderId, paid: true } });
          } catch (verifyErr) {
            setError(verifyErr.message || 'Payment verification failed');
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            // Payment cancelled by user — mark order as payment_failed (hides from restaurant)
            paymentAPI.fail(orderId).catch(() => {});
            setPendingOrderId(null);
            setLoading(false);
            setError('Payment cancelled. Your cart is still here — try again when ready.');
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response) => {
        // Payment gateway reported failure — mark order as payment_failed
        paymentAPI.fail(orderId).catch(() => {});
        setPendingOrderId(null);
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <FiShoppingCart className="mx-auto text-6xl text-slate-300" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Add items from a restaurant to get started.</p>
        <Link to="/customer/restaurants" className="btn-primary mt-6 inline-block">
          Browse Restaurants
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <section className="space-y-3 lg:col-span-2">
          {cartItems.map((item) => (
            <article key={item._id} className="card space-y-3">
              <div className="flex items-center gap-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                    🍽️
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-slate-500">₹{Number(item.price).toFixed(2)} each</p>
                  {item.restaurant?.name && (
                    <p className="text-xs text-slate-400">{item.restaurant.name}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="btn-secondary p-1.5"
                    aria-label="Decrease"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-6 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="btn-secondary p-1.5"
                    aria-label="Increase"
                  >
                    <FiPlus />
                  </button>
                </div>
                <p className="w-24 text-right font-semibold">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-400 hover:text-red-600"
                  aria-label="Remove"
                >
                  <FiTrash2 />
                </button>
              </div>
              <input
                className="input-field text-sm"
                placeholder="Special instructions (optional)"
                value={specialInstructions[item._id] || ''}
                onChange={(e) => updateInstruction(item._id, e.target.value)}
              />
            </article>
          ))}
        </section>

        {/* Order Summary & Checkout */}
        <aside className="space-y-4">
          {/* Summary */}
          <div className="card">
            <h2 className="mb-3 text-lg font-semibold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Delivery Fee</span>
                <span>₹{DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Secure payment via Razorpay (Test Mode)
            </p>
          </div>

          {/* Delivery Options */}
          <div className="card space-y-3">
            <h2 className="font-semibold">Delivery Options</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setDeliveryType('asap')}
                className={`flex-1 ${deliveryType === 'asap' ? 'btn-primary' : 'btn-secondary'}`}
              >
                ASAP
              </button>
              <button
                onClick={() => setDeliveryType('scheduled')}
                className={`flex-1 ${deliveryType === 'scheduled' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Schedule
              </button>
            </div>
            {deliveryType === 'scheduled' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Select Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  min={new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16)}
                />
              </div>
            )}
          </div>

          {/* Delivery Address */}
          <div className="card space-y-3">
            <h2 className="font-semibold flex items-center gap-2">
              <FiMapPin className="text-primary-600" /> Delivery Address
            </h2>

            {/* Saved address cards */}
            {addrLoading ? (
              <p className="text-xs text-slate-400 animate-pulse">Loading saved addresses…</p>
            ) : savedAddresses.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Saved Addresses</p>
                {savedAddresses.map((a, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectSavedAddress(i)}
                    className={`w-full flex items-start justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-150 ${
                      selectedAddressIdx === i
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{a.label || `Address ${i + 1}`}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {[a.street, a.city, a.state, a.zipCode].filter(Boolean).join(', ')}
                      </p>
                    </div>
                    {selectedAddressIdx === i && (
                      <FiCheck className="mt-0.5 shrink-0 text-primary-600 text-lg" />
                    )}
                  </button>
                ))}
                <p className="text-xs text-slate-400 pt-1">Or enter a different address below:</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No saved addresses.{' '}
                <Link to="/profile" className="text-primary-600 hover:underline">
                  Add one in your Profile
                </Link>{' '}
                or enter below:
              </p>
            )}

            {/* Manual address fields */}
            <input
              className="input-field"
              placeholder="Street address *"
              value={address.street}
              onChange={(e) => { setSelectedAddressIdx(null); setAddress((a) => ({ ...a, street: e.target.value })); }}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className="input-field"
                placeholder="City *"
                value={address.city}
                onChange={(e) => { setSelectedAddressIdx(null); setAddress((a) => ({ ...a, city: e.target.value })); }}
              />
              <input
                className="input-field"
                placeholder="State"
                value={address.state}
                onChange={(e) => { setSelectedAddressIdx(null); setAddress((a) => ({ ...a, state: e.target.value })); }}
              />
            </div>
            <input
              className="input-field"
              placeholder="ZIP Code"
              value={address.zipCode}
              onChange={(e) => { setSelectedAddressIdx(null); setAddress((a) => ({ ...a, zipCode: e.target.value })); }}
            />
          </div>

          {error && (
            <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>
          )}

          <button
            disabled={loading}
            onClick={handlePlaceOrder}
            className="btn-primary w-full py-3 text-base"
          >
            {loading ? 'Opening Payment...' : `Pay ₹${total.toFixed(2)} via Razorpay`}
          </button>
        </aside>
      </div>
    </main>
  );
};

export default CartPage;
