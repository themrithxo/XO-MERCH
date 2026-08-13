import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, numReviews = 0, size = 14 }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="d-flex align-items-center gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating) ? 'text-danger fill-danger' : 'text-secondary opacity-50'}
        />
      ))}
      {numReviews > 0 && (
        <span className="text-muted ms-1 fs-8" style={{ fontSize: '0.75rem' }}>
          ({numReviews})
        </span>
      )}
    </div>
  );
}
