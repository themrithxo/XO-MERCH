import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Shield, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItemCount, setIsCartOpen, wishlist } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-black border-bottom border-secondary border-opacity-25 py-3">
      <div className="container-fluid px-4 px-lg-5">
        {/* Brand Logo in Orbitron */}
        <Link className="navbar-brand d-flex align-items-center me-4" to="/">
          <span className="fs-2 fw-black text-white pe-1" style={{ fontFamily: 'var(--xo-font-heading)', letterSpacing: '0.15em' }}>
            X<span style={{ color: 'var(--xo-crimson-accent)' }}>O</span>
          </span>
          <span className="d-none d-sm-inline-block text-muted text-uppercase ms-2 ps-2 border-start border-secondary fs-7" style={{ letterSpacing: '0.25em', fontSize: '0.7rem' }}>
            Luxury Gothic
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 text-white d-lg-none"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={26} color="var(--xo-crimson-accent)" /> : <Menu size={26} />}
        </button>

        {/* Navbar Collapsible */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show bg-black p-3 border-top border-dark mt-2' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-3">
            <li className="nav-item">
              <Link className="nav-link" to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shop?isLimitedEdition=true" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-danger fw-bold me-1">⚡</span>Limited Drops
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shop?category=hoodies" onClick={() => setMobileMenuOpen(false)}>Hoodies</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shop?category=outerwear" onClick={() => setMobileMenuOpen(false)}>Outerwear</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shop?category=accessories" onClick={() => setMobileMenuOpen(false)}>Hardware</Link>
            </li>
          </ul>

          {/* Search Form */}
          <form className="d-flex me-lg-4 mb-3 mb-lg-0 position-relative" onSubmit={handleSearch}>
            <input
              type="text"
              className="xo-input form-control form-control-sm pe-4 text-white"
              style={{ width: '200px', fontSize: '0.85rem' }}
              placeholder="Search relic or sigil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-sm text-muted position-absolute end-0 top-50 translate-middle-y me-1 border-0">
              <Search size={16} />
            </button>
          </form>

          {/* User & Cart Icons */}
          <div className="d-flex align-items-center gap-3">
            {/* Wishlist Link */}
            <Link to="/profile" className="text-white text-decoration-none position-relative p-1" title="Wishlist">
              <Heart size={22} className={wishlist.length > 0 ? "text-danger fill-danger" : "text-light"} />
              {wishlist.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fs-8" style={{ fontSize: '0.65rem' }}>
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn btn-link text-white position-relative p-1 text-decoration-none border-0"
              title="Cart Drawer"
            >
              <ShoppingBag size={22} />
              {totalItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fs-8" style={{ fontSize: '0.65rem', backgroundColor: 'var(--xo-crimson-accent)' }}>
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-dark btn-sm dropdown-toggle d-flex align-items-center gap-1 text-white border-secondary"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <User size={16} />
                  <span className="d-none d-md-inline" style={{ fontFamily: 'var(--xo-font-heading)', fontSize: '0.8rem' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg">
                  <li className="dropdown-header text-uppercase text-muted fs-8" style={{ letterSpacing: '0.1em' }}>
                    Signed in as {user.name}
                  </li>
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/profile">
                      <User size={14} /> Profile & Orders
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 text-warning fw-bold" to="/admin">
                        <Shield size={14} /> Admin Panel
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center gap-2 text-danger" onClick={logout}>
                      <LogOut size={14} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="xo-btn-outline py-1 px-3 fs-7" style={{ fontSize: '0.8rem' }}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
