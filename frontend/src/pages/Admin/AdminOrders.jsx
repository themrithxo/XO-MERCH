import React, { useEffect, useState } from 'react';
import { Eye, Clock, Check, X, ShieldAlert } from 'lucide-react';
import api from '../../services/api';
import OrderBadge from '../../components/OrderBadge';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/all');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Fetch all orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders(orders.map(o => o._id === orderId ? res.data : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(res.data);
      }
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(o =>
    statusFilter === 'all' ? true : o.orderStatus === statusFilter
  );

  return (
    <div className="bg-black text-white py-4 min-vh-100">
      <div className="container-fluid px-4 px-lg-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom border-dark pb-3 mb-4 gap-3">
          <div>
            <span className="badge bg-danger text-uppercase fs-8 mb-1">DISPATCH CONTROL</span>
            <h2 className="display-6 fw-bold mb-0 text-white" style={{ fontFamily: 'var(--xo-font-heading)' }}>
              CUSTOMER ORDERS MANAGEMENT ({orders.length})
            </h2>
          </div>

          {/* Status Filter Buttons */}
          <div className="d-flex flex-wrap gap-1">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm text-uppercase fs-8 ${statusFilter === st ? 'btn-danger' : 'btn-dark border-secondary text-white'}`}
                style={{ fontSize: '0.75rem' }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
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
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Placed Date</th>
                    <th>Total ($)</th>
                    <th>Status</th>
                    <th className="text-end">Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="fw-bold text-white">#{order._id.substring(0, 10).toUpperCase()}</td>
                      <td>
                        <div className="fw-bold">{order.user?.name || 'Customer'}</div>
                        <div className="text-muted fs-8">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td>{order.items?.length || 0} items</td>
                      <td className="text-muted">{new Date(order.placedAt || order.createdAt).toLocaleDateString()}</td>
                      <td className="text-danger fw-bold">${order.totalPrice.toFixed(2)}</td>
                      <td>
                        <OrderBadge status={order.orderStatus} />
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end align-items-center gap-2">
                          <select
                            className="xo-input form-select form-select-sm text-white py-0 fs-8"
                            style={{ width: '130px' }}
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button onClick={() => setSelectedOrder(order)} className="btn btn-sm btn-outline-light p-1 px-2" title="View Details">
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ORDER DETAIL MODAL */}
        {selectedOrder && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1080, backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <div className="xo-card p-4 text-white bg-black border-danger" style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-dark">
                <div>
                  <h5 className="mb-0 text-white" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                    ORDER DETAILS #{selectedOrder._id.substring(0, 10).toUpperCase()}
                  </h5>
                  <div className="fs-8 text-muted">Customer: {selectedOrder.user?.name} ({selectedOrder.user?.email})</div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="btn btn-sm btn-dark text-muted border-0">
                  <X size={20} />
                </button>
              </div>

              {/* Items List */}
              <div className="mb-4">
                <h6 className="text-uppercase text-muted fs-8 mb-2">Purchased Relics</h6>
                <div className="d-flex flex-column gap-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="p-2 bg-dark rounded d-flex align-items-center justify-content-between border border-dark fs-7">
                      <div className="d-flex align-items-center gap-2">
                        <img src={item.image} alt={item.name} className="rounded" style={{ width: '40px', height: '48px', objectFit: 'cover' }} />
                        <div>
                          <div className="fw-bold text-white">{item.name}</div>
                          <div className="text-muted fs-8">Size: {item.size} | Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <span className="text-danger fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-3 bg-dark rounded border border-dark mb-4 fs-7">
                <h6 className="text-uppercase text-muted fs-8 mb-1">Shipping Destination</h6>
                <div>{selectedOrder.shippingAddress?.street}</div>
                <div>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</div>
                <div>{selectedOrder.shippingAddress?.country}</div>
              </div>

              <div className="d-flex justify-content-between align-items-center fs-5 fw-bold text-danger border-top border-dark pt-3">
                <span>TOTAL PAID:</span>
                <span>${selectedOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
