import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import DuotoneImage from './DuotoneImage';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 500;
  const progressToFreeShipping = Math.min((cartSubtotal / freeShippingThreshold) * 100, 100);
  const amountNeededForFreeShipping = Math.max(freeShippingThreshold - cartSubtotal, 0);

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
      <div
        className="position-absolute top-0 end-0 h-100 bg-black border-start border-danger border-opacity-50 text-white d-flex flex-column"
        style={{ width: '100%', maxWidth: '420px', transition: 'transform 0.3s ease', boxShadow: '-5px 0 25px rgba(201, 24, 74, 0.3)' }}
      >
        {/* Drawer Header */}
        <div className="p-3 border-bottom border-dark d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <ShoppingBag size={20} color="var(--xo-crimson-accent)" />
            <h5 className="mb-0 text-white" style={{ fontFamily: 'var(--xo-font-heading)', letterSpacing: '0.1em' }}>
              RELICT VAULT CART
            </h5>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="btn btn-sm btn-dark text-muted border-0">
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-3 bg-dark border-bottom border-secondary border-opacity-25 fs-8">
          {amountNeededForFreeShipping > 0 ? (
            <div className="text-center text-muted mb-2" style={{ fontSize: '0.8rem' }}>
              Add <strong className="text-white">${amountNeededForFreeShipping.toFixed(2)}</strong> for Free Express Shipping
            </div>
          ) : (
            <div className="text-center text-success fw-bold mb-2" style={{ fontSize: '0.8rem' }}>
              ⚡ Free Express Shipping Unlocked!
            </div>
          )}
          <div className="progress" style={{ height: '4px', backgroundColor: '#222' }}>
            <div
              className="progress-bar bg-danger"
              role="progressbar"
              style={{ width: `${progressToFreeShipping}%`, backgroundColor: 'var(--xo-crimson-accent)' }}
            ></div>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-grow-1 overflow-auto p-3">
          {cart.items && cart.items.length > 0 ? (
            cart.items.map((item) => {
              const product = item.product || {};
              const title = product.name || 'Gothic Relic';
              const price = product.price || item.priceAtAdd || 0;
              const img = (product.images && product.images[0]) || '';

              return (
                <div key={item._id} className="d-flex gap-3 mb-3 p-2 border-bottom border-dark align-items-center">
                  <div style={{ width: '65px', height: '75px', flexShrink: 0 }} className="bg-dark rounded overflow-hidden">
                    <DuotoneImage src={img} alt={title} className="w-100 h-100" />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fs-7 fw-bold text-white text-truncate" title={title} style={{ maxWidth: '180px' }}>
                      {title}
                    </h6>
                    <div className="text-muted fs-8 mb-2" style={{ fontSize: '0.75rem' }}>
                      Size: <span className="text-white fw-bold">{item.size}</span> | Price: ${price}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="btn-group btn-group-sm border border-secondary">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="btn btn-dark text-white px-2 py-0"
                        >
                          -
                        </button>
                        <span className="btn btn-dark text-white disabled px-2 py-0 fs-8 fw-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="btn btn-dark text-white px-2 py-0"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="btn btn-sm btn-link text-muted p-0 border-0"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="text-end fw-bold fs-7 text-danger" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                    ${(price * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted py-5">
              <ShoppingBag size={48} className="mb-3 text-secondary opacity-50" />
              <h6>YOUR VAULT CART IS EMPTY</h6>
              <p className="fs-8">Browse the drop catalog and acquire exclusive gothic relics.</p>
              <button
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                className="xo-btn-outline btn-sm mt-2"
              >
                Explore Shop
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer / Checkout CTA */}
        {cart.items && cart.items.length > 0 && (
          <div className="p-3 border-top border-dark bg-dark">
            <div className="d-flex justify-content-between align-items-center mb-2 fs-6">
              <span className="text-uppercase text-muted">Subtotal:</span>
              <span className="fw-bold text-white fs-5" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                ${cartSubtotal.toFixed(2)}
              </span>
            </div>
            <p className="fs-8 text-muted mb-3">Taxes and shipping calculated at checkout.</p>
            <div className="d-flex gap-2">
              <button
                onClick={() => { setIsCartOpen(false); navigate('/cart'); }}
                className="xo-btn-outline w-50 py-2 fs-7"
              >
                View Cart
              </button>
              <button
                onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                className="xo-btn-primary w-50 py-2 fs-7"
              >
                Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
