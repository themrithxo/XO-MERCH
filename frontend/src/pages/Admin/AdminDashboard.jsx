import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, AlertTriangle, TrendingUp, Package, ArrowUpRight } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../../services/api';
import OrderBadge from '../../components/OrderBadge';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Fetch admin stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-black text-danger">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  // Prepare chart data
  const categoryNames = stats?.categorySales?.map(c => c._id) || ['Hoodies', 'Outerwear', 'Tees', 'Bottoms', 'Hardware'];
  const categoryRevenues = stats?.categorySales?.map(c => c.totalRevenue) || [4200, 3100, 1800, 2400, 1200];

  const barChartData = {
    labels: categoryNames,
    datasets: [
      {
        label: 'Revenue ($)',
        data: categoryRevenues,
        backgroundColor: '#8b0000',
        borderColor: '#c9184a',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#e8e8e8', font: { family: 'Rajdhani' } } },
    },
    scales: {
      x: { ticks: { color: '#8a8a8a' }, grid: { color: '#222' } },
      y: { ticks: { color: '#8a8a8a' }, grid: { color: '#222' } },
    },
  };

  return (
    <div className="bg-black text-white py-4 min-vh-100">
      <div className="container-fluid px-4 px-lg-5">
        {/* Admin Header Nav */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom border-dark pb-3 mb-4 gap-3">
          <div>
            <span className="badge bg-danger text-uppercase fs-8 mb-1">COMMAND CENTER</span>
            <h2 className="display-6 fw-bold mb-0 text-white" style={{ fontFamily: 'var(--xo-font-heading)' }}>
              ADMIN DASHBOARD ANALYTICS
            </h2>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/products" className="xo-btn-outline btn-sm">Manage Products</Link>
            <Link to="/admin/orders" className="xo-btn-primary btn-sm">Manage Orders</Link>
            <Link to="/admin/customers" className="xo-btn-outline btn-sm">Customers</Link>
          </div>
        </div>

        {/* 1. KPI CARDS ROW */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="p-4 xo-card h-100 d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted text-uppercase fs-8 mb-1" style={{ letterSpacing: '0.1em' }}>Total Revenue</div>
                <div className="fs-3 fw-bold text-white" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                  ${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}
                </div>
                <div className="fs-8 text-success d-flex align-items-center mt-1">
                  <TrendingUp size={14} className="me-1" /> Avg Order: ${stats?.avgOrderValue ? stats.avgOrderValue.toFixed(0) : '0'}
                </div>
              </div>
              <div className="p-3 bg-dark rounded border border-danger">
                <DollarSign size={24} color="var(--xo-crimson-accent)" />
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="p-4 xo-card h-100 d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted text-uppercase fs-8 mb-1" style={{ letterSpacing: '0.1em' }}>Total Orders</div>
                <div className="fs-3 fw-bold text-white" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                  {stats?.totalOrders || 0}
                </div>
                <div className="fs-8 text-muted mt-1">Across all order statuses</div>
              </div>
              <div className="p-3 bg-dark rounded border border-dark">
                <ShoppingBag size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="p-4 xo-card h-100 d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted text-uppercase fs-8 mb-1" style={{ letterSpacing: '0.1em' }}>Active Customers</div>
                <div className="fs-3 fw-bold text-white" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                  {stats?.totalCustomers || 0}
                </div>
                <div className="fs-8 text-muted mt-1">Registered clients</div>
              </div>
              <div className="p-3 bg-dark rounded border border-dark">
                <Users size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="p-4 xo-card h-100 d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted text-uppercase fs-8 mb-1" style={{ letterSpacing: '0.1em' }}>Low Stock Warnings</div>
                <div className="fs-3 fw-bold text-warning" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                  {stats?.lowStockCount || 0} Items
                </div>
                <div className="fs-8 text-warning mt-1">Total Stock ≤ 15 units</div>
              </div>
              <div className="p-3 bg-dark rounded border border-warning">
                <AlertTriangle size={24} className="text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. REVENUE CHART & LOW STOCK ALERTS */}
        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div className="p-4 xo-card h-100">
              <h5 className="text-white mb-3" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                REVENUE BY CATEGORY ($)
              </h5>
              <div style={{ maxHeight: '300px' }}>
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="p-4 xo-card h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-white mb-0" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                  LOW STOCK ALERTS
                </h5>
                <Link to="/admin/products" className="fs-8 text-danger text-decoration-none">Restock Inventory</Link>
              </div>

              {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '280px' }}>
                  {stats.lowStockProducts.map(p => (
                    <div key={p._id} className="p-2 bg-dark rounded d-flex justify-content-between align-items-center fs-8 border border-dark">
                      <div>
                        <div className="fw-bold text-white">{p.name}</div>
                        <div className="text-muted">{p.category?.name || 'Category'}</div>
                      </div>
                      <span className="badge bg-warning text-dark fw-bold px-2 py-1 fs-8">
                        {p.totalStock} left
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted fs-7">
                  All inventory levels are healthy above threshold.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. RECENT ORDERS FEED TABLE */}
        <div className="p-4 xo-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-white mb-0" style={{ fontFamily: 'var(--xo-font-heading)' }}>
              RECENT DISPATCH ORDERS
            </h5>
            <Link to="/admin/orders" className="xo-btn-outline btn-sm fs-8">
              View All Orders <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0 fs-7">
              <thead>
                <tr className="text-muted text-uppercase fs-8 border-bottom border-dark">
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map(order => (
                  <tr key={order._id}>
                    <td className="fw-bold text-white">#{order._id.substring(0, 10).toUpperCase()}</td>
                    <td>{order.user?.name || 'Customer'}</td>
                    <td className="text-muted">{new Date(order.placedAt || order.createdAt).toLocaleDateString()}</td>
                    <td className="text-danger fw-bold">${order.totalPrice.toFixed(2)}</td>
                    <td><OrderBadge status={order.orderStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
