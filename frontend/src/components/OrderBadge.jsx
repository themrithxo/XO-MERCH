import React from 'react';

export default function OrderBadge({ status }) {
  const getBadgeStyle = (st) => {
    switch (st) {
      case 'delivered':
        return 'bg-success border-success text-white';
      case 'shipped':
        return 'bg-primary border-primary text-white';
      case 'processing':
        return 'bg-warning text-dark border-warning fw-bold';
      case 'pending':
        return 'bg-dark border-danger text-danger';
      case 'cancelled':
        return 'bg-secondary text-light border-secondary';
      default:
        return 'bg-dark text-white border-secondary';
    }
  };

  return (
    <span className={`badge border text-uppercase fs-8 px-2 py-1 ${getBadgeStyle(status)}`} style={{ letterSpacing: '0.1em' }}>
      {status}
    </span>
  );
}
