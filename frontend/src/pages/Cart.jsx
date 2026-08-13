import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import DuotoneImage from '../components/DuotoneImage';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartSubtotal } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'XO10') {
      setAppliedDiscount(10);
      alert('Promo Code XO10 applied! 10% discount applied.');
    } else if (code === 'NOCTURNE20') {
      if (cartSubtotal >= 500) {
        setAppliedDiscount(20);
        alert('Promo Code NOCTURNE20 applied! 20% discount applied.');
      } else {
        setPromoError('NOCTURNE20 requires a minimum order subtotal of $500.');
      }
    } else {
      setPromoError('Invalid promo code. Try XO10 or NOCTURNE20.');
    }
  };

  const discountAmount = (cartSubtotal * appliedDiscount) / 100;
  const shippingFee = cartSubtotal > 500 || cartSubtotal === 0 ? 0 : 25;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  return (
    <div className="bg-black text-white py-5 min-vh-100">
      <div className="container px-4 px-lg-5">
        <h1 className="display-6 fw-bold mb-4" style={{ fontFamily: 'var(--xo-font-heading)' }}>
          RELICT VAULT CART ({cart.items.length} ITEMS)
        </h1>

        {cart.items && cart.items.length > 0 ? (
          <div className="row g-5">
            {/* ITEM LIST */}
            <div className="col-lg-8">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-dark">
                <span className="text-uppercase text-muted fs-8">Item Details</span>
                <button onClick={clearCart} className="btn btn-sm btn-link text-danger p-0 text-decoration-none fs-8">
                  Clear All Items
                </button>
              </div>

              <div className="d-flex flex-column gap-3">
                {cart.items.map((item) => {
                  const product = item.product || {};
                  const title = product.name || 'Gothic Relic';
                  const price = product.price || item.priceAtAdd || 0;
                  const img = (product.images && product.images[0]) || '';

                  return (
                    <div key={item._id} className="p-3 xo-card d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: '80px', height: '90px', flexShrink: 0 }} className="bg-dark rounded overflow-hidden">
                          <DuotoneImage src={img} alt={title} className="w-100 h-100" />
                        </div>
                        <div>
                          <h6 className="fw-bold text-white mb-1" style={{ fontFamily: 'var(--xo-font-heading)', fontSize: '0.95rem' }}>
                            <Link to={`/product/${product.slug || ''}`} className="text-white text-decoration-none hover-crimson">
                              {title}
                            </Link>
                          </h6>
                          <div className="text-muted fs-8 mb-2">
                            Size: <span className="text-white fw-bold">{item.size}</span> | Unit Price: ${price}
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <div className="btn-group btn-group-sm border border-secondary">
                              <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="btn btn-dark text-white px-2 py-0">-</button>
                              <span className="btn btn-dark text-white disabled px-2 py-0 fs-8 fw-bold">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="btn btn-dark text-white px-2 py-0">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item._id)} className="btn btn-sm btn-link text-muted p-0 border-0 ms-2">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-end">
                        <div className="fs-5 fw-bold text-danger" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                          ${(price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SUMMARY & PROMO */}
            <div className="col-lg-4">
              <div className="p-4 xo-card position-sticky" style={{ top: '90px' }}>
                <h5 className="text-white mb-3" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                  ORDER SUMMARY
                </h5>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="mb-4">
                  <label className="form-label text-muted fs-8 d-flex align-items-center gap-1">
                    <Tag size={14} color="var(--xo-crimson-accent)" /> Promo Code (Try XO10)
                  </label>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="xo-input form-control form-control-sm text-white uppercase"
                      placeholder="e.g. XO10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button type="submit" className="xo-btn-outline btn-sm py-0 px-3 fs-8">
                      Apply
                    </button>
                  </div>
                  {promoError && <div className="text-danger fs-8 mt-1">{promoError}</div>}
                  {appliedDiscount > 0 && <div className="text-success fs-8 mt-1">✔ {appliedDiscount}% Discount Applied</div>}
                </form>

                <div className="d-flex justify-content-between mb-2 fs-7">
                  <span className="text-muted">Subtotal:</span>
                  <span className="text-white">${cartSubtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="d-flex justify-content-between mb-2 fs-7 text-success">
                    <span>Promo Discount ({appliedDiscount}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-3 fs-7">
                  <span className="text-muted">Express Shipping:</span>
                  <span className="text-white">{shippingFee === 0 ? <strong className="text-success">FREE</strong> : `$${shippingFee}`}</span>
                </div>

                <hr className="border-secondary border-opacity-25" />

                <div className="d-flex justify-content-between mb-4 fs-5 fw-bold">
                  <span className="text-white" style={{ fontFamily: 'var(--xo-font-heading)' }}>TOTAL:</span>
                  <span className="text-danger" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/checkout', { state: { appliedDiscount, finalTotal } })}
                  className="xo-btn-primary w-100 py-3 text-uppercase"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                <div className="mt-3 text-center text-muted fs-8">
                  <ShieldCheck size={14} className="me-1" /> Encrypted SSL 256-Bit Checkout
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5 xo-card p-5">
            <ShoppingBag size={54} className="mb-3 text-secondary opacity-50" />
            <h4 className="text-white mb-2">YOUR CART IS EMPTY</h4>
            <p className="text-muted fs-7 mb-4">Discover our limited drops and heavy apparel catalog.</p>
            <Link to="/shop" className="xo-btn-primary">
              Explore Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
