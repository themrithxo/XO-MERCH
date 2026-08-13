import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import DuotoneImage from './DuotoneImage';
import RatingStars from './RatingStars';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.find(s => s.stock > 0)?.size || 'M'
  );
  const [showSizePicker, setShowSizePicker] = useState(false);

  const isFavorited = isInWishlist(product._id);
  const firstImage = product.images && product.images[0] ? product.images[0] : '';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
  };

  return (
    <div className="xo-card h-100 position-relative d-flex flex-column overflow-hidden">
      {/* Top Badges & Wishlist Toggle */}
      <div className="position-absolute top-0 start-0 w-100 p-2 d-flex justify-content-between align-items-center" style={{ zIndex: 10 }}>
        <div>
          {product.isLimitedEdition && (
            <span className="xo-badge-limited text-uppercase">⚡ Limited Drop</span>
          )}
          {product.compareAtPrice > product.price && (
            <span className="badge bg-dark border border-danger text-danger ms-1 fs-8">
              SALE
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="btn btn-dark btn-sm rounded-circle p-1 d-flex align-items-center justify-content-center border-secondary border-opacity-50"
          style={{ width: '32px', height: '32px', backgroundColor: 'rgba(10,10,10,0.7)' }}
          title={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={16} className={isFavorited ? "text-danger fill-danger" : "text-light"} />
        </button>
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.slug}`} className="text-decoration-none d-block position-relative bg-dark" style={{ height: '280px', overflow: 'hidden' }}>
        <DuotoneImage
          src={firstImage}
          alt={product.name}
          className="w-100 h-100"
          style={{ transition: 'transform 0.5s ease' }}
        />
      </Link>

      {/* Product Content Body */}
      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <div className="text-uppercase text-muted fs-8 mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            {product.category?.name || 'Streetwear'}
          </div>
          <h6 className="fw-bold text-white mb-2 text-truncate" title={product.name} style={{ fontFamily: 'var(--xo-font-heading)', fontSize: '0.95rem' }}>
            <Link to={`/product/${product.slug}`} className="text-white text-decoration-none hover-crimson">
              {product.name}
            </Link>
          </h6>
          <div className="mb-2">
            <RatingStars rating={product.rating} numReviews={product.numReviews} />
          </div>
        </div>

        <div>
          {/* Price & Compare At Price */}
          <div className="d-flex align-items-baseline gap-2 mb-3">
            <span className="fs-5 fw-bold" style={{ color: 'var(--xo-crimson-accent)', fontFamily: 'var(--xo-font-heading)' }}>
              ${product.price}
            </span>
            {product.compareAtPrice > product.price && (
              <span className="text-muted text-decoration-line-through fs-7">
                ${product.compareAtPrice}
              </span>
            )}
          </div>

          {/* Quick Add Size Buttons */}
          {showSizePicker ? (
            <div className="mb-2">
              <div className="d-flex flex-wrap gap-1 mb-2">
                {product.sizes?.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => setSelectedSize(s.size)}
                    className={`btn btn-sm px-2 py-0 fs-8 ${selectedSize === s.size ? 'btn-danger' : 'btn-outline-secondary text-white'} ${s.stock === 0 ? 'opacity-25' : ''}`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
              <div className="d-flex gap-1">
                <button onClick={handleQuickAdd} className="xo-btn-primary py-1 px-2 fs-8 w-100" style={{ fontSize: '0.75rem' }}>
                  Confirm Size {selectedSize}
                </button>
                <button onClick={() => setShowSizePicker(false)} className="btn btn-dark border-secondary py-1 px-2 fs-8 text-white">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <button
                onClick={() => setShowSizePicker(true)}
                className="xo-btn-primary py-2 px-3 fs-8 w-100 text-uppercase"
                style={{ fontSize: '0.8rem' }}
              >
                <ShoppingBag size={14} /> Quick Add
              </button>
              <Link
                to={`/product/${product.slug}`}
                className="xo-btn-outline py-2 px-2 fs-8 d-flex align-items-center justify-content-center"
                title="View Relic Details"
              >
                <Eye size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
