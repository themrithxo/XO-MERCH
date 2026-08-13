import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import DuotoneImage from '../components/DuotoneImage';
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from '../data/fallbackData';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState(FALLBACK_PRODUCTS);
  const [limitedProducts, setLimitedProducts] = useState(FALLBACK_PRODUCTS.filter(p => p.isLimitedEdition));
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(false);

  // Countdown for Limited Drop
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 35, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, limitedRes, catRes] = await Promise.all([
          api.get('/products?limit=8'),
          api.get('/products?isLimitedEdition=true&limit=4'),
          api.get('/categories')
        ]);
        if (prodRes.data?.products?.length) setFeaturedProducts(prodRes.data.products);
        if (limitedRes.data?.products?.length) setLimitedProducts(limitedRes.data.products);
        if (catRes.data?.length) setCategories(catRes.data);
      } catch (err) {
        console.warn('Backend API spin-up in progress. Displaying static archive catalog:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-black text-white">
      {/* 1. HERO SECTION */}
      <section className="position-relative min-vh-100 d-flex align-items-center justify-content-center overflow-hidden border-bottom border-dark">
        <div
          className="position-absolute top-0 start-0 w-100 h-100 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'url(#xo-gothic-duotone)'
          }}
        ></div>

        <div className="position-relative container text-center px-4 py-5" style={{ zIndex: 10 }}>
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-4 rounded-pill border border-danger border-opacity-50 bg-black bg-opacity-75">
            <span className="badge rounded-circle bg-danger p-1" style={{ width: '8px', height: '8px' }}></span>
            <span className="fs-8 text-uppercase text-danger fw-bold" style={{ letterSpacing: '0.2em' }}>
              AUTUMN / WINTER 2026 ARCHIVE DROP LIVE
            </span>
          </div>

          <h1 className="display-1 fw-black text-white mb-3 text-uppercase" style={{ fontFamily: 'var(--xo-font-heading)', letterSpacing: '0.2em', textShadow: '0 0 30px rgba(0,0,0,0.9)' }}>
            X<span style={{ color: 'var(--xo-crimson-accent)' }}>O</span> GOTHIC
          </h1>

          <p className="lead mx-auto text-muted mb-5 max-w-2xl" style={{ maxWidth: '700px', fontSize: '1.25rem', fontFamily: 'var(--xo-font-body)' }}>
            Obsidian silhouettes, 500GSM loopback terry, full-grain Italian leather, and hand-cast sterling silver hardware. Limited run Relics forged for the dark underground.
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Link to="/shop" className="xo-btn-primary py-3 px-5 fs-6">
              Acquire Relics <ArrowRight size={18} />
            </Link>
            <Link to="/shop?isLimitedEdition=true" className="xo-btn-outline py-3 px-5 fs-6">
              View Micro Drops
            </Link>
          </div>
        </div>
      </section>

      {/* 2. LIMITED DROP COUNTDOWN BANNER */}
      <section className="bg-dark border-bottom border-dark py-4" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="container px-4">
          <div className="row align-items-center text-center text-md-start g-3">
            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                <Flame color="var(--xo-crimson-accent)" size={20} />
                <h5 className="mb-0 text-white text-uppercase" style={{ fontFamily: 'var(--xo-font-heading)', letterSpacing: '0.1em' }}>
                  NEXT SERIALIZED DROP: DROP 001 LEATHER DUSTER
                </h5>
              </div>
              <p className="text-muted fs-8 mb-0">Limited to 50 numbered pieces worldwide. Hand-painted crimson typography.</p>
            </div>
            <div className="col-md-6 d-flex justify-content-center justify-content-md-end">
              <div className="d-flex gap-3 text-center">
                <div className="bg-black p-2 border border-secondary rounded min-w-60" style={{ width: '65px' }}>
                  <div className="fs-4 fw-bold text-danger" style={{ fontFamily: 'var(--xo-font-heading)' }}>{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="fs-8 text-muted text-uppercase">DAYS</div>
                </div>
                <div className="bg-black p-2 border border-secondary rounded min-w-60" style={{ width: '65px' }}>
                  <div className="fs-4 fw-bold text-danger" style={{ fontFamily: 'var(--xo-font-heading)' }}>{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="fs-8 text-muted text-uppercase">HRS</div>
                </div>
                <div className="bg-black p-2 border border-secondary rounded min-w-60" style={{ width: '65px' }}>
                  <div className="fs-4 fw-bold text-danger" style={{ fontFamily: 'var(--xo-font-heading)' }}>{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="fs-8 text-muted text-uppercase">MIN</div>
                </div>
                <div className="bg-black p-2 border border-secondary rounded min-w-60" style={{ width: '65px' }}>
                  <div className="fs-4 fw-bold text-danger" style={{ fontFamily: 'var(--xo-font-heading)' }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="fs-8 text-muted text-uppercase">SEC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY TILES GRID */}
      <section className="py-5 container px-4 px-lg-5">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold mb-2">CURATED ARCHIVES</h2>
          <div className="text-muted fs-7 text-uppercase" style={{ letterSpacing: '0.2em' }}>Select Your Domain</div>
        </div>

        <div className="row g-4">
          {categories.slice(0, 4).map((cat, idx) => (
            <div key={cat._id} className={idx === 0 ? "col-md-6" : "col-md-6 col-lg-4"}>
              <Link to={`/shop?category=${cat.slug}`} className="text-decoration-none d-block position-relative rounded overflow-hidden xo-card" style={{ height: '320px' }}>
                <DuotoneImage src={cat.image} alt={cat.name} className="w-100 h-100" />
                <div className="position-absolute top-0 start-0 w-100 h-100 p-4 d-flex flex-column justify-content-end" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95), transparent)' }}>
                  <h4 className="text-white mb-1" style={{ fontFamily: 'var(--xo-font-heading)' }}>{cat.name}</h4>
                  <p className="text-muted fs-8 text-truncate mb-2" style={{ maxWidth: '300px' }}>{cat.description}</p>
                  <span className="text-danger fs-8 fw-bold text-uppercase d-flex align-items-center gap-1">
                    Explore Vault <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS GRID */}
      <section className="py-5 bg-dark border-top border-bottom border-dark" style={{ backgroundColor: '#0b0b0b' }}>
        <div className="container px-4 px-lg-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <h2 className="display-6 fw-bold text-white mb-1">FEATURED RELICS</h2>
              <p className="text-muted mb-0">Engineered with extreme precision and heavyweight textiles.</p>
            </div>
            <Link to="/shop" className="xo-btn-outline btn-sm mt-3 mt-md-0">
              View All 30+ Relics
            </Link>
          </div>

          <div className="row g-4">
            {featuredProducts.slice(0, 8).map((product) => (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BRAND VALUE PROPOSITION */}
      <section className="py-5 container px-4 px-lg-5">
        <div className="row g-4 text-center">
          <div className="col-md-3">
            <div className="p-4 xo-card h-100">
              <Sparkles size={36} color="var(--xo-crimson-accent)" className="mb-3" />
              <h5 className="text-white mb-2" style={{ fontFamily: 'var(--xo-font-heading)' }}>500GSM TERRY</h5>
              <p className="text-muted fs-8 mb-0">Double-faced loopback terry engineered for indestructible structural volume.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-4 xo-card h-100">
              <Zap size={36} color="var(--xo-crimson-accent)" className="mb-3" />
              <h5 className="text-white mb-2" style={{ fontFamily: 'var(--xo-font-heading)' }}>925 STERLING</h5>
              <p className="text-muted fs-8 mb-0">Hand-cast solid silver hardware and laser-engraved serialized tags.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-4 xo-card h-100">
              <Flame size={36} color="var(--xo-crimson-accent)" className="mb-3" />
              <h5 className="text-white mb-2" style={{ fontFamily: 'var(--xo-font-heading)' }}>NUMBERED DROPS</h5>
              <p className="text-muted fs-8 mb-0">Micro-batch production runs. Once sold out, items enter permanent archive.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-4 xo-card h-100">
              <ShieldCheck size={36} color="var(--xo-crimson-accent)" className="mb-3" />
              <h5 className="text-white mb-2" style={{ fontFamily: 'var(--xo-font-heading)' }}>GLOBAL COURIER</h5>
              <p className="text-muted fs-8 mb-0">Insured express dispatch in stealth matte black protective casing.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
