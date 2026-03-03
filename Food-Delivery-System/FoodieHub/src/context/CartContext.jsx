import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [restaurantId, setRestaurantId] = useState(() => localStorage.getItem('cartRestaurantId'));

  const persist = (items, rid = restaurantId) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
    if (rid) localStorage.setItem('cartRestaurantId', rid);
    if (!items.length) localStorage.removeItem('cartRestaurantId');
  };

  const addToCart = (item, restaurant) => {
    // Use a local variable so we don't read stale cartItems after clearing.
    // setState is async — if we called persist([], null) then immediately read
    // cartItems, we'd still get the OLD array from the closure.
    let baseItems = cartItems;

    if (cartItems.length > 0 && restaurantId && restaurantId !== restaurant._id) {
      const confirmClear = window.confirm('Cart has items from another restaurant. Clear cart?');
      if (!confirmClear) return;
      // Clear synchronously in local scope; persist will flush to state + localStorage
      baseItems = [];
    }

    setRestaurantId(restaurant._id);
    const existing = baseItems.find((ci) => ci._id === item._id);

    if (existing) {
      const nextItems = baseItems.map((ci) =>
        ci._id === item._id ? { ...ci, quantity: ci.quantity + 1 } : ci
      );
      persist(nextItems, restaurant._id);
      return;
    }

    const nextItems = [...baseItems, { ...item, quantity: 1, restaurant }];
    persist(nextItems, restaurant._id);
  };

  const removeFromCart = (itemId) => {
    const nextItems = cartItems.filter((item) => item._id !== itemId);
    if (!nextItems.length) setRestaurantId(null);
    persist(nextItems, nextItems.length ? restaurantId : null);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const nextItems = cartItems.map((item) => item._id === itemId ? { ...item, quantity } : item);
    persist(nextItems);
  };

  const clearCart = () => {
    setRestaurantId(null);
    persist([], null);
  };

  const value = useMemo(() => ({
    cartItems,
    restaurantId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal: () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    getItemCount: () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
  }), [cartItems, restaurantId]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
