import React, { useEffect, useState } from 'react';
import { Users, Mail, Phone, Calendar, Search } from 'lucide-react';
import api from '../../services/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/customers');
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Fetch customers error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-black text-white py-4 min-vh-100">
      <div className="container-fluid px-4 px-lg-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom border-dark pb-3 mb-4 gap-3">
          <div>
            <span className="badge bg-danger text-uppercase fs-8 mb-1">CLIENT REGISTRY</span>
            <h2 className="display-6 fw-bold mb-0 text-white" style={{ fontFamily: 'var(--xo-font-heading)' }}>
              REGISTERED CLIENT DIRECTORY ({customers.length})
            </h2>
          </div>

          <div style={{ width: '300px' }}>
            <div className="position-relative">
              <input
                type="text"
                className="xo-input form-control form-control-sm text-white pe-4"
                placeholder="Search by client name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={16} className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
            </div>
          </div>
        </div>

        {/* Customer Directory Table */}
        <div className="xo-card p-3">
          {loading ? (
            <div className="text-center py-5 text-danger">
              <div className="spinner-border" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0 fs-7">
                <thead>
                  <tr className="text-muted text-uppercase fs-8 border-bottom border-dark">
                    <th>Client Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c._id}>
                      <td className="fw-bold text-white">
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-dark rounded-circle text-danger d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                            {c.name.charAt(0)}
                          </div>
                          {c.name}
                        </div>
                      </td>
                      <td className="text-muted"><Mail size={12} className="me-1" />{c.email}</td>
                      <td className="text-muted">{c.phone || 'N/A'}</td>
                      <td><span className="badge bg-dark border border-secondary text-white text-uppercase">{c.role}</span></td>
                      <td className="text-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
