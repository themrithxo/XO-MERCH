import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, ShieldCheck, Flame, Star, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import DuotoneImage from '../components/DuotoneImage';
import RatingStars from '../components/RatingStars';

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [useDuotone, setUseDuotone] = useState(true);

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [slug]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${slug}`);
      setProduct(res.data);
      if (res.data.images && res.data.images.length) {
        setSelectedImage(res.data.images[0]);
      }
      const availableSize = res.data.sizes?.find(s => s.stock > 0)?.size || res.data.sizes?.[0]?.size || 'M';
      setSelectedSize(availableSize);

      // Fetch reviews
      if (res.data._id) {
        const revRes = await api.get(`/products/${res.data._id}/reviews`);
        setReviews(revRes.data || []);
      }
    } catch (err) {
      console.error('Fetch product detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addToCart(product, selectedSize, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to post a review');
      return;
    }
    if (!newComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating: newRating,
        comment: newComment
      });
      setReviews([res.data, ...reviews]);
      setNewComment('');
      alert('Review posted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-black text-danger">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center bg-black text-white">
        <h2>RELIC NOT FOUND</h2>
        <p className="text-muted">This product item may have been archived or deleted.</p>
        <Link to="/shop" className="xo-btn-primary btn-sm">Return to Shop</Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);
  const selectedSizeObj = product.sizes?.find(s => s.size === selectedSize);
  const currentStock = selectedSizeObj ? selectedSizeObj.stock : 0;

  return (
    <div className="bg-black text-white py-5">
      <div className="container px-4 px-lg-5">
        {/* Back Link */}
        <Link to="/shop" className="text-muted text-decoration-none d-inline-flex align-items-center gap-1 mb-4 fs-7 hover-crimson">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>

        <div className="row g-5">
          {/* LEFT: GALLERY & DUOTONE TOGGLE */}
          <div className="col-lg-6">
            <div className="xo-card p-2 mb-3 bg-dark text-center overflow-hidden position-relative" style={{ height: '480px' }}>
              <DuotoneImage
                src={selectedImage}
                alt={product.name}
                applyDuotone={useDuotone}
                className="w-100 h-100"
              />
              {/* Duotone toggle checkbox */}
              <div className="position-absolute bottom-0 end-0 m-3 p-2 bg-black bg-opacity-75 border border-secondary rounded fs-8">
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input bg-dark border-secondary"
                    type="checkbox"
                    id="duotoneToggle"
                    checked={useDuotone}
                    onChange={(e) => setUseDuotone(e.target.checked)}
                  />
                  <label className="form-check-label text-muted" htmlFor="duotoneToggle">
                    Gothic Filter
                  </label>
                </div>
              </div>
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="d-flex gap-2 overflow-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`btn p-0 border rounded overflow-hidden ${selectedImage === img ? 'border-danger' : 'border-dark'}`}
                    style={{ width: '80px', height: '80px', flexShrink: 0 }}
                  >
                    <DuotoneImage src={img} alt="thumb" applyDuotone={useDuotone} className="w-100 h-100" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS & ACTIONS */}
          <div className="col-lg-6">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span className="text-uppercase text-muted fs-8" style={{ letterSpacing: '0.15em' }}>
                  {product.category?.name || 'Streetwear Archive'}
                </span>
                <h1 className="display-6 fw-bold text-white mb-2" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                  {product.name}
                </h1>
              </div>
              <button
                onClick={() => toggleWishlist(product._id)}
                className="btn btn-outline-dark text-white p-2 rounded-circle border-secondary"
                title={isFavorited ? "In Wishlist" : "Add to Wishlist"}
              >
                <Heart size={20} className={isFavorited ? "text-danger fill-danger" : "text-light"} />
              </button>
            </div>

            {/* Rating */}
            <div className="mb-3 d-flex align-items-center gap-2">
              <RatingStars rating={product.rating} numReviews={product.numReviews} size={16} />
              <span className="text-muted fs-8">| Colorway: <strong className="text-white">{product.colorway}</strong></span>
            </div>

            {/* Price */}
            <div className="d-flex align-items-baseline gap-3 mb-4">
              <span className="display-5 fw-bold" style={{ color: 'var(--xo-crimson-accent)', fontFamily: 'var(--xo-font-heading)' }}>
                ${product.price}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-muted text-decoration-line-through fs-5">
                  ${product.compareAtPrice}
                </span>
              )}
              {product.isLimitedEdition && (
                <span className="xo-badge-limited ms-auto">⚡ LIMITED MICRO DROP</span>
              )}
            </div>

            <p className="text-muted fs-6 mb-4" style={{ lineHeight: '1.7' }}>
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-uppercase text-muted fs-8 fw-bold" style={{ letterSpacing: '0.1em' }}>
                  Select Garment Size
                </span>
                <span className="fs-8 text-muted">
                  Stock: {currentStock > 0 ? <strong className="text-success">{currentStock} units left</strong> : <strong className="text-danger">Out of Stock</strong>}
                </span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {product.sizes?.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => setSelectedSize(s.size)}
                    className={`btn py-2 px-3 fs-7 ${selectedSize === s.size ? 'btn-danger' : 'btn-outline-dark text-white border-secondary'} ${s.stock === 0 ? 'opacity-25' : ''}`}
                    style={{ minWidth: '55px', fontFamily: 'var(--xo-font-heading)' }}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart CTA */}
            <div className="d-flex gap-3 mb-4 align-items-center">
              <div className="btn-group border border-secondary" style={{ width: '120px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn btn-dark text-white"
                >
                  -
                </button>
                <span className="btn btn-dark text-white disabled fw-bold d-flex align-items-center justify-content-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))}
                  className="btn btn-dark text-white"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={currentStock === 0}
                className="xo-btn-primary py-3 px-4 flex-grow-1 text-uppercase"
              >
                <ShoppingBag size={18} /> Add to Relic Cart
              </button>
            </div>

            {/* Authenticity Guarantees */}
            <div className="p-3 xo-card bg-dark border-dark rounded fs-8 text-muted">
              <div className="d-flex align-items-center gap-2 mb-2">
                <CheckCircle size={16} color="var(--xo-crimson-accent)" />
                <span className="text-white">Authentic Numbered Garment</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <ShieldCheck size={16} color="var(--xo-crimson-accent)" />
                <span>Insured Global Dispatch in Stealth Matte Box</span>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS SECTION */}
        <section className="mt-5 pt-5 border-top border-dark">
          <h3 className="fw-bold mb-4" style={{ fontFamily: 'var(--xo-font-heading)' }}>
            RELICT REVIEWS & FEEDBACK ({reviews.length})
          </h3>

          <div className="row g-4">
            {/* Review Form */}
            <div className="col-lg-5">
              <div className="p-4 xo-card">
                <h5 className="text-white mb-3" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                  WRITE A REVIEW
                </h5>
                {!user ? (
                  <div className="text-muted fs-8">
                    Please <Link to="/login" className="text-danger fw-bold">Sign In</Link> to submit a product review.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label className="form-label text-muted fs-8">Rating (1 to 5 Stars)</label>
                      <select
                        className="xo-input form-select text-white"
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                      >
                        <option value="5">5 Stars — Flawless Dark Luxury</option>
                        <option value="4">4 Stars — Exceptional Quality</option>
                        <option value="3">3 Stars — Standard</option>
                        <option value="2">2 Stars — Subpar</option>
                        <option value="1">1 Star — Poor</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted fs-8">Your Review Comment</label>
                      <textarea
                        required
                        rows="4"
                        className="xo-input form-control text-white"
                        placeholder="Detail the garment weight, fit, stitching, and hardware..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="xo-btn-primary btn-sm w-100"
                    >
                      {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Reviews List */}
            <div className="col-lg-7">
              {reviews.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="p-3 xo-card">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-white fs-7" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                          {rev.user?.name || 'Gothic Enthusiast'}
                        </span>
                        <RatingStars rating={rev.rating} size={14} />
                      </div>
                      <p className="text-muted fs-7 mb-1">{rev.comment}</p>
                      <span className="text-secondary fs-8" style={{ fontSize: '0.7rem' }}>
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 xo-card text-center text-muted fs-7">
                  No reviews yet for this garment. Be the first to leave feedback!
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
