import React, { useEffect, useState } from 'react';
import { User, Package, Heart, MapPin, LogOut, Clock, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import OrderBadge from '../components/OrderBadge';
import ProductCard from '../components/ProductCard';

export default function Profile() {
  const { user, logout } = useAuth();
  const { wishlist } = useCart();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetchOrders();
    if (wishlist.length > 0) {
      fetchWishlistProducts();
    }
  }, [wishlist]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Fetch my orders error:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchWishlistProducts = async () => {
    try {
      const prods = await Promise.all(
        wishlist.map(id => api.get(`/products/${id}`).then(r => r.data).catch(() => null))
      );
      setWishlistProducts(prods.filter(Boolean));
    } catch (e) {
      console.warn('Wishlist fetch error:', e);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-black text-white py-5 min-vh-100">
      <div className="container px-4 px-lg-5">
        {/* Profile Header Card */}
        <div className="p-4 xo-card mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: '60px', height: '60px', fontFamily: 'var(--xo-font-heading)' }}>
              {user.name ? user.name.charAt(0) : 'X'}
            </div>
            <div>
              <h3 className="mb-1 text-white fw-bold" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                {user.name}
              </h3>
              <div className="text-muted fs-7">
                {user.email} | <span className="text-uppercase text-danger fw-bold">{user.role}</span>
              </div>
            </div>
          </div>
          <button onClick={logout} className="xo-btn-outline btn-sm py-2 px-3 align-self-start align-self-md-auto">
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <ul className="nav nav-tabs border-dark mb-4">
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('orders')}
              className={`nav-link border-0 ${activeTab === 'orders' ? 'active text-danger border-bottom border-danger fw-bold' : 'text-muted'}`}
            >
              <Package size={16} className="me-1" /> Order History ({orders.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`nav-link border-0 ${activeTab === 'wishlist' ? 'active text-danger border-bottom border-danger fw-bold' : 'text-muted'}`}
            >
              <Heart size={16} className="me-1" /> Wishlist Vault ({wishlist.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab('address')}
              className={`nav-link border-0 ${activeTab === 'address' ? 'active text-danger border-bottom border-danger fw-bold' : 'text-muted'}`}
            >
              <MapPin size={16} className="me-1" /> Saved Addresses
            </button>
          </li>
        </ul>

        {/* TAB CONTENTS */}
        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div className="text-center py-5 text-danger">
                <div className="spinner-border" role="status"></div>
              </div>
            ) : orders.length > 0 ? (
              <div className="d-flex flex-column gap-4">
                {orders.map((order) => (
                  <div key={order._id} className="p-4 xo-card">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom border-dark pb-3 mb-3 gap-2">
                      <div>
                        <div className="fs-8 text-muted text-uppercase mb-1">
                          ORDER # {order._id.substring(0, 10).toUpperCase()}
                        </div>
                        <div className="d-flex align-items-center gap-2 fs-7">
                          <Clock size={14} className="text-muted" />
                          <span>Placed: {new Date(order.placedAt || order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <OrderBadge status={order.orderStatus} />
                        <span className="fs-5 fw-bold text-danger" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="row g-3">
                      {order.items?.map((item, i) => (
                        <div key={i} className="col-md-6 d-flex align-items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=200&auto=format&fit=crop'}
                            alt={item.name}
                            className="rounded bg-dark border border-dark"
                            style={{ width: '50px', height: '60px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-bold text-white fs-7">{item.name}</div>
                            <div className="text-muted fs-8">Size: {item.size} | Qty: {item.quantity} × ${item.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 xo-card text-center text-muted">
                <Package size={48} className="mb-3 text-secondary opacity-50" />
                <h5>NO ORDERS PLACED YET</h5>
                <p className="fs-7">Your order history will appear here once you acquire relics.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length > 0 ? (
              <div className="row g-4">
                {wishlistProducts.map((p) => (
                  <div key={p._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 xo-card text-center text-muted">
                <Heart size={48} className="mb-3 text-secondary opacity-50" />
                <h5>YOUR WISHLIST VAULT IS EMPTY</h5>
                <p className="fs-7">Click the heart icon on any garment to save it here for later.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'address' && (
          <div className="p-4 xo-card">
            <h5 className="text-white mb-3" style={{ fontFamily: 'var(--xo-font-heading)' }}>
              SAVED SHIPPING ADDRESS
            </h5>
            {user.addresses && user.addresses.length > 0 ? (
              <div className="p-3 bg-dark rounded border border-dark mb-3">
                <div className="fw-bold text-white mb-1">{user.name}</div>
                <div className="text-muted fs-7">{user.addresses[0].street}</div>
                <div className="text-muted fs-7">
                  {user.addresses[0].city}, {user.addresses[0].state} {user.addresses[0].postalCode}
                </div>
                <div className="text-muted fs-7">{user.addresses[0].country}</div>
              </div>
            ) : (
              <div className="text-muted fs-7">No default address saved yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
