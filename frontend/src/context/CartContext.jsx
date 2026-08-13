import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart on user load or change
  useEffect(() => {
    if (user) {
      fetchServerCart();
      if (user.wishlist) {
        setWishlist(user.wishlist.map(item => typeof item === 'object' ? item._id : item));
      }
    } else {
      const localCart = localStorage.getItem('xo_local_cart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch (e) {
          setCart({ items: [] });
        }
      }
      const localWishlist = localStorage.getItem('xo_local_wishlist');
      if (localWishlist) {
        try {
          setWishlist(JSON.parse(localWishlist));
        } catch (e) {
          setWishlist([]);
        }
      }
    }
  }, [user]);

  const fetchServerCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (e) {
      console.warn('Cart fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, size, quantity = 1) => {
    if (user) {
      try {
        const res = await api.post('/cart/add', {
          productId: product._id || product.id,
          size,
          quantity
        });
        setCart(res.data);
        setIsCartOpen(true);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to add item to cart');
      }
    } else {
      // Guest local cart
      const newItems = [...cart.items];
      const prodId = product._id || product.id;
      const index = newItems.findIndex(i => (i.product._id || i.product) === prodId && i.size === size);

      if (index > -1) {
        newItems[index].quantity += quantity;
      } else {
        newItems.push({
          _id: `guest-${Date.now()}`,
          product,
          size,
          quantity,
          priceAtAdd: product.price
        });
      }
      const updatedCart = { items: newItems };
      setCart(updatedCart);
      localStorage.setItem('xo_local_cart', JSON.stringify(updatedCart));
      setIsCartOpen(true);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (user) {
      try {
        const res = await api.put('/cart/update', { itemId, quantity });
        setCart(res.data);
      } catch (err) {
        console.error('Update cart item error:', err);
      }
    } else {
      const newItems = cart.items
        .map(item => item._id === itemId ? { ...item, quantity } : item)
        .filter(item => item.quantity > 0);
      const updatedCart = { items: newItems };
      setCart(updatedCart);
      localStorage.setItem('xo_local_cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        const res = await api.delete(`/cart/remove/${itemId}`);
        setCart(res.data);
      } catch (err) {
        console.error('Remove cart item error:', err);
      }
    } else {
      const newItems = cart.items.filter(item => item._id !== itemId);
      const updatedCart = { items: newItems };
      setCart(updatedCart);
      localStorage.setItem('xo_local_cart', JSON.stringify(updatedCart));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart/clear');
      } catch (e) {}
    }
    setCart({ items: [] });
    localStorage.removeItem('xo_local_cart');
  };

  const toggleWishlist = (productId) => {
    const id = typeof productId === 'object' ? productId._id : productId;
    let updated;
    if (wishlist.includes(id)) {
      updated = wishlist.filter(item => item !== id);
    } else {
      updated = [...wishlist, id];
    }
    setWishlist(updated);
    if (!user) {
      localStorage.setItem('xo_local_wishlist', JSON.stringify(updated));
    }
  };

  const isInWishlist = (productId) => {
    const id = typeof productId === 'object' ? productId._id : productId;
    return wishlist.includes(id);
  };

  const totalItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.items.reduce((sum, item) => {
    const price = item.product?.price || item.priceAtAdd || 0;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      isInWishlist,
      totalItemCount,
      cartSubtotal,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
