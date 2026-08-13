import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-secondary border-top border-secondary border-opacity-25 pt-5 pb-4 mt-5">
      <div className="container px-4 px-lg-5">
        <div className="row g-4 mb-5">
          <div className="col-lg-4 col-md-6">
            <h4 className="fw-black text-white mb-3" style={{ fontFamily: 'var(--xo-font-heading)', letterSpacing: '0.15em' }}>
              X<span style={{ color: 'var(--xo-crimson-accent)' }}>O</span> GOTHIC
            </h4>
            <p className="fs-7 text-muted pe-lg-4" style={{ fontSize: '0.9rem' }}>
              Architectural luxury streetwear fashion house. Limited-drop silhouettes forged in heavy loopback terry, Japanese selvedge denim, full-grain Italian leather, and sterling silver hardware.
            </p>
            <div className="d-flex gap-3 mt-3">
              <span className="badge bg-dark border border-secondary text-light px-3 py-2 fs-8" style={{ letterSpacing: '0.15em' }}>
                EST. 2026 / NEW YORK
              </span>
            </div>
          </div>

          <div className="col-lg-2 col-6">
            <h6 className="text-white text-uppercase mb-3" style={{ fontFamily: 'var(--xo-font-heading)', letterSpacing: '0.1em' }}>
              Collections
            </h6>
            <ul className="list-unstyled fs-7 space-y-2">
              <li className="mb-2"><Link to="/shop?category=hoodies" className="text-secondary text-decoration-none hover-crimson">Hoodies & Sweats</Link></li>
              <li className="mb-2"><Link to="/shop?category=tees" className="text-secondary text-decoration-none hover-crimson">Heavyweight Tees</Link></li>
              <li className="mb-2"><Link to="/shop?category=outerwear" className="text-secondary text-decoration-none hover-crimson">Outerwear & Leather</Link></li>
              <li className="mb-2"><Link to="/shop?category=bottoms" className="text-secondary text-decoration-none hover-crimson">Modular Cargo</Link></li>
              <li className="mb-2"><Link to="/shop?category=accessories" className="text-secondary text-decoration-none hover-crimson">Hardware & Chains</Link></li>
              <li className="mb-2"><Link to="/shop?isLimitedEdition=true" className="text-danger text-decoration-none font-bold">Limited Drops</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-6">
            <h6 className="text-white text-uppercase mb-3" style={{ fontFamily: 'var(--xo-font-heading)', letterSpacing: '0.1em' }}>
              Client Care
            </h6>
            <ul className="list-unstyled fs-7">
              <li className="mb-2"><Link to="/profile" className="text-secondary text-decoration-none">Order Tracking</Link></li>
              <li className="mb-2"><span className="text-secondary">Shipping & Authenticity</span></li>
              <li className="mb-2"><span className="text-secondary">Returns & Exchanges</span></li>
              <li className="mb-2"><span className="text-secondary">Size & Fit Guide</span></li>
              <li className="mb-2"><span className="text-secondary">Care Instructions</span></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="text-white text-uppercase mb-3" style={{ fontFamily: 'var(--xo-font-heading)', letterSpacing: '0.1em' }}>
              Drop Dispatch Sentinel
            </h6>
            <p className="fs-7 text-muted" style={{ fontSize: '0.85rem' }}>
              Subscribe to receive instant encrypted notifications for upcoming micro-drops and unreleased archival pieces.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to XO Drop Sentinel.'); }} className="d-flex gap-2">
              <input
                type="email"
                required
                className="xo-input form-control form-control-sm text-white"
                placeholder="enter your email..."
              />
              <button type="submit" className="xo-btn-primary py-1 px-3 fs-7" style={{ fontSize: '0.8rem' }}>
                Join
              </button>
            </form>
          </div>
        </div>

        <hr className="border-secondary border-opacity-25" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center fs-8 text-muted pt-2" style={{ fontSize: '0.8rem' }}>
          <div>© 2026 XO LUXURY GOTHIC STREETWEAR PLATFORM. ALL RIGHTS RESERVED.</div>
          <div className="d-flex gap-3 mt-2 mt-sm-0">
            <span>PRIVACY PROTOCOL</span>
            <span>TERMS OF SERVICE</span>
            <span>RESTRICTED ACCESS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
