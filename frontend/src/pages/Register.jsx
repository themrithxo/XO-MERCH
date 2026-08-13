import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password, phone);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container px-4" style={{ maxWidth: '460px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-black text-white text-uppercase" style={{ fontFamily: 'var(--xo-font-heading)', letterSpacing: '0.15em' }}>
            JOIN THE OBSIDIAN VAULT
          </h2>
          <p className="text-muted fs-7">Create an account to track limited drops and save wishlist relics.</p>
        </div>

        <div className="p-4 xo-card">
          {error && <div className="alert alert-danger fs-8 py-2 mb-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted fs-8">Full Name</label>
              <div className="position-relative">
                <input
                  type="text"
                  required
                  className="xo-input form-control text-white pe-4"
                  placeholder="Vespera Noir"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <User size={16} className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted fs-8">Email Address</label>
              <div className="position-relative">
                <input
                  type="email"
                  required
                  className="xo-input form-control text-white pe-4"
                  placeholder="name@gothmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail size={16} className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted fs-8">Phone Number (Optional)</label>
              <div className="position-relative">
                <input
                  type="tel"
                  className="xo-input form-control text-white pe-4"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Phone size={16} className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted fs-8">Password</label>
              <div className="position-relative">
                <input
                  type="password"
                  required
                  className="xo-input form-control text-white pe-4"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={16} className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-muted fs-8">Confirm Password</label>
              <div className="position-relative">
                <input
                  type="password"
                  required
                  className="xo-input form-control text-white pe-4"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Lock size={16} className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="xo-btn-primary w-100 py-3 text-uppercase"
            >
              {submitting ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <div className="mt-4 text-center fs-7 text-muted">
            Already have an account? <Link to="/login" className="text-danger font-bold text-decoration-none ms-1">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
