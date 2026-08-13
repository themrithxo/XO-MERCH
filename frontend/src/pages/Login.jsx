import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@xo.com');
    setPassword('admin123');
  };

  const fillDemoCustomer = () => {
    setEmail('kaelen@xo-vault.com');
    setPassword('customer123');
  };

  return (
    <div className="bg-black text-white py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container px-4" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-black text-white text-uppercase" style={{ fontFamily: 'var(--xo-font-heading)', letterSpacing: '0.15em' }}>
            AUTHENTICATE ACCESS
          </h2>
          <p className="text-muted fs-7">Enter your credentials to enter the Relic Vault.</p>
        </div>

        {/* Demo Login Shortcuts */}
        <div className="p-3 bg-dark border border-secondary border-opacity-25 rounded mb-4 text-center">
          <div className="fs-8 text-uppercase text-muted mb-2 fw-bold" style={{ letterSpacing: '0.1em' }}>
            Quick Demo Access (Seeded Accounts)
          </div>
          <div className="d-flex gap-2">
            <button onClick={fillDemoAdmin} className="btn btn-sm btn-outline-warning w-50 fs-8 d-flex align-items-center justify-content-center gap-1">
              <Shield size={12} /> Fill Admin
            </button>
            <button onClick={fillDemoCustomer} className="btn btn-sm btn-outline-light w-50 fs-8 d-flex align-items-center justify-content-center gap-1">
              <UserCheck size={12} /> Fill Customer
            </button>
          </div>
        </div>

        <div className="p-4 xo-card">
          {error && <div className="alert alert-danger fs-8 py-2 mb-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted fs-8">Email Address</label>
              <div className="position-relative">
                <input
                  type="email"
                  required
                  className="xo-input form-control text-white pe-4"
                  placeholder="vault@xo-gothic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail size={16} className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-muted fs-8">Password</label>
              <div className="position-relative">
                <input
                  type="password"
                  required
                  className="xo-input form-control text-white pe-4"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={16} className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="xo-btn-primary w-100 py-3 text-uppercase"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center fs-7 text-muted">
            New to XO Gothic? <Link to="/register" className="text-danger font-bold text-decoration-none ms-1">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
