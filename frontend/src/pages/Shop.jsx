import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter state
  const categoryParam = searchParams.get('category') || '';
  const isLimitedParam = searchParams.get('isLimitedEdition') === 'true';
  const searchParam = searchParams.get('search') || '';
  const sizeParam = searchParams.get('size') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = Number(searchParams.get('page')) || 1;

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (e) {
      console.warn('Category fetch error:', e);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryString = searchParams.toString();
      const res = await api.get(`/products?${queryString}`);
      setProducts(res.data.products || []);
      setTotalPages(res.data.pages || 1);
      setTotalProducts(res.data.totalProducts || 0);
    } catch (err) {
      console.error('Products fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter update
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (minPrice) newParams.set('minPrice', minPrice);
    else newParams.delete('minPrice');
    if (maxPrice) newParams.set('maxPrice', maxPrice);
    else newParams.delete('maxPrice');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="bg-black text-white min-vh-100 py-5">
      <div className="container px-4 px-lg-5">
        {/* Page Header */}
        <div className="border-bottom border-dark pb-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-end">
          <div>
            <h1 className="display-5 fw-bold text-white mb-2" style={{ fontFamily: 'var(--xo-font-heading)' }}>
              RELIC VAULT CATALOG
            </h1>
            <p className="text-muted mb-0 fs-7">
              Showing {products.length} of {totalProducts} authenticated gothic streetwear items.
            </p>
          </div>

          {/* Sorting Dropdown */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
            <SlidersHorizontal size={16} className="text-danger" />
            <span className="fs-8 text-muted text-uppercase">Sort:</span>
            <select
              className="xo-input form-select form-select-sm text-white"
              style={{ width: '180px', fontSize: '0.85rem' }}
              value={sortParam}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="row g-4">
          {/* SIDEBAR FILTERS */}
          <div className="col-lg-3">
            <div className="p-4 xo-card position-sticky" style={{ top: '90px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-dark">
                <h5 className="mb-0 text-white d-flex align-items-center gap-2 fs-6" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                  <Filter size={16} color="var(--xo-crimson-accent)" /> FILTERS
                </h5>
                <button onClick={clearFilters} className="btn btn-sm btn-link text-muted p-0 fs-8 text-decoration-none">
                  Reset All
                </button>
              </div>

              {/* Limited Edition Toggle */}
              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input bg-dark border-secondary"
                  type="checkbox"
                  id="limitedSwitch"
                  checked={isLimitedParam}
                  onChange={(e) => updateFilter('isLimitedEdition', e.target.checked ? 'true' : '')}
                />
                <label className="form-check-input-label text-white fw-bold fs-7" htmlFor="limitedSwitch">
                  ⚡ Limited Drops Only
                </label>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <h6 className="text-muted text-uppercase fs-8 mb-2" style={{ letterSpacing: '0.1em' }}>Categories</h6>
                <div className="d-flex flex-column gap-1">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`btn btn-sm text-start py-1 px-2 border-0 fs-7 ${!categoryParam ? 'text-danger fw-bold bg-dark' : 'text-secondary'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => updateFilter('category', cat.slug)}
                      className={`btn btn-sm text-start py-1 px-2 border-0 fs-7 ${categoryParam === cat.slug ? 'text-danger fw-bold bg-dark' : 'text-secondary'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-4">
                <h6 className="text-muted text-uppercase fs-8 mb-2" style={{ letterSpacing: '0.1em' }}>Size</h6>
                <div className="d-flex flex-wrap gap-1">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => updateFilter('size', sizeParam === sz ? '' : sz)}
                      className={`btn btn-sm fs-8 ${sizeParam === sz ? 'btn-danger' : 'btn-outline-dark text-white border-secondary'}`}
                      style={{ fontSize: '0.75rem', minWidth: '36px' }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-3">
                <h6 className="text-muted text-uppercase fs-8 mb-2" style={{ letterSpacing: '0.1em' }}>Price Range ($)</h6>
                <form onSubmit={handlePriceApply} className="d-flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="xo-input form-control form-control-sm text-white px-2"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="xo-input form-control form-control-sm text-white px-2"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                  <button type="submit" className="xo-btn-outline btn-sm py-0 px-2 fs-8">
                    Go
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* MAIN CATALOG PRODUCTS GRID */}
          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5 text-danger">
                <div className="spinner-border mb-2" role="status"></div>
                <div className="fs-7 text-muted">Retrieving obsidian relics...</div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="row g-4 mb-5">
                  {products.map((product) => (
                    <div key={product._id} className="col-12 col-sm-6 col-md-4">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <button
                      disabled={pageParam <= 1}
                      onClick={() => updateFilter('page', String(pageParam - 1))}
                      className="btn btn-sm btn-dark border-secondary text-white"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => updateFilter('page', String(p))}
                        className={`btn btn-sm ${p === pageParam ? 'btn-danger' : 'btn-dark border-secondary text-white'}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={pageParam >= totalPages}
                      onClick={() => updateFilter('page', String(pageParam + 1))}
                      className="btn btn-sm btn-dark border-secondary text-white"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-5 xo-card p-5">
                <h5 className="text-white mb-2">NO RELICS FOUND MATCHING YOUR CRITERIA</h5>
                <p className="text-muted fs-7 mb-4">Try clearing your filters or searching for another streetwear query.</p>
                <button onClick={clearFilters} className="xo-btn-primary btn-sm">
                  Reset Catalog Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
