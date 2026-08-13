import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, CheckCircle, ShieldCheck, Truck, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Checkout() {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const stateData = location.state || {};
  const discountPercent = stateData.appliedDiscount || 0;
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const shippingFee = cartSubtotal > 500 || cartSubtotal === 0 ? 0 : 25;
  const totalPrice = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Form State
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '13 Obsidiana Way');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'New York');
  const [state, setState] = useState(user?.addresses?.[0]?.state || 'NY');
  const [postalCode, setPostalCode] = useState(user?.addresses?.[0]?.postalCode || '10001');
  const [country, setCountry] = useState('USA');
  const [paymentMethod, setPaymentMethod] = useState('Card (Stripe Test Mode)');

  // Mock Payment Fields
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('777');
  const [submitting, setSubmitting] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to complete your checkout');
      navigate('/login');
      return;
    }

    if (cart.items.length === 0) {
      alert('Your cart is empty!');
      navigate('/shop');
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = cart.items.map(item => ({
        product: item.product._id || item.product,
        name: item.product.name || 'XO Relic',
        size: item.size,
        quantity: item.quantity,
        price: item.product.price || item.priceAtAdd,
        image: (item.product.images && item.product.images[0]) || ''
      }));

      const res = await api.post('/orders', {
        items: orderItems,
        shippingAddress: { street, city, state, postalCode, country },
        paymentMethod,
        itemsPrice: cartSubtotal,
        shippingPrice: shippingFee,
        totalPrice
      });

      await clearCart();
      alert('ORDER PLACED SUCCESSFULLY! Inventory reserved.');
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order. Check stock availability.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white py-5 min-vh-100">
      <div className="container px-4 px-lg-5">
        <h1 className="display-6 fw-bold mb-4" style={{ fontFamily: 'var(--xo-font-heading)' }}>
          DISPATCH CHECKOUT
        </h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="row g-5">
            {/* LEFT COLUMN: SHIPPING & PAYMENT */}
            <div className="col-lg-7">
              {/* SHIPPING ADDRESS */}
              <div className="p-4 xo-card mb-4">
                <h5 className="text-white mb-3 d-flex align-items-center gap-2" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                  <Truck size={18} color="var(--xo-crimson-accent)" /> 1. SHIPPING ADDRESS
                </h5>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-muted fs-8">Street Address</label>
                    <input
                      type="text"
                      required
                      className="xo-input form-control text-white"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>
                  <div className="col-md-5">
                    <label className="form-label text-muted fs-8">City</label>
                    <input
                      type="text"
                      required
                      className="xo-input form-control text-white"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-muted fs-8">State</label>
                    <input
                      type="text"
                      required
                      className="xo-input form-control text-white"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted fs-8">Postal Code</label>
                    <input
                      type="text"
                      required
                      className="xo-input form-control text-white"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div className="p-4 xo-card">
                <h5 className="text-white mb-3 d-flex align-items-center gap-2" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                  <CreditCard size={18} color="var(--xo-crimson-accent)" /> 2. PAYMENT GATEWAY (STUB TEST MODE)
                </h5>

                <div className="mb-3">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input bg-dark border-danger"
                      type="radio"
                      name="paymentType"
                      id="cardStripe"
                      checked={paymentMethod === 'Card (Stripe Test Mode)'}
                      onChange={() => setPaymentMethod('Card (Stripe Test Mode)')}
                    />
                    <label className="form-check-label text-white fw-bold" htmlFor="cardStripe">
                      Credit / Debit Card (Stripe Test Mode)
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input bg-dark border-secondary"
                      type="radio"
                      name="paymentType"
                      id="razorpayMock"
                      checked={paymentMethod === 'Razorpay Mock'}
                      onChange={() => setPaymentMethod('Razorpay Mock')}
                    />
                    <label className="form-check-label text-white" htmlFor="razorpayMock">
                      Razorpay Sandbox Integration
                    </label>
                  </div>
                </div>

                {/* Card Fields */}
                <div className="p-3 bg-dark rounded border border-dark mb-3">
                  <div className="mb-3">
                    <label className="form-label text-muted fs-8">Card Number (Test Stub)</label>
                    <input
                      type="text"
                      className="xo-input form-control text-white"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label text-muted fs-8">Expiry Date</label>
                      <input
                        type="text"
                        className="xo-input form-control text-white"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted fs-8">Security Code (CVV)</label>
                      <input
                        type="password"
                        className="xo-input form-control text-white"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY */}
            <div className="col-lg-5">
              <div className="p-4 xo-card position-sticky" style={{ top: '90px' }}>
                <h5 className="text-white mb-3" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                  SUMMARY ({cart.items.length} ITEMS)
                </h5>

                <div className="mb-4 overflow-auto pe-1" style={{ maxHeight: '240px' }}>
                  {cart.items.map((item) => (
                    <div key={item._id} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-dark fs-8">
                      <div>
                        <span className="fw-bold text-white">{item.product.name}</span>
                        <div className="text-muted">Size: {item.size} × {item.quantity}</div>
                      </div>
                      <span className="text-danger fw-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between mb-2 fs-7">
                  <span className="text-muted">Subtotal:</span>
                  <span className="text-white">${cartSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="d-flex justify-content-between mb-2 fs-7 text-success">
                    <span>Discount ({discountPercent}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-3 fs-7">
                  <span className="text-muted">Express Shipping:</span>
                  <span className="text-white">{shippingFee === 0 ? <strong className="text-success">FREE</strong> : `$${shippingFee}`}</span>
                </div>

                <hr className="border-secondary border-opacity-25" />

                <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
                  <span className="text-white" style={{ fontFamily: 'var(--xo-font-heading)' }}>TOTAL DUE:</span>
                  <span className="text-danger" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting || cart.items.length === 0}
                  className="xo-btn-primary w-100 py-3 text-uppercase"
                >
                  <Lock size={16} /> {submitting ? 'Processing Dispatch...' : `Authorize Payment ($${totalPrice.toFixed(2)})`}
                </button>

                <div className="mt-3 text-center text-muted fs-8">
                  <ShieldCheck size={14} className="me-1" /> Inventory guaranteed upon authorization.
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
