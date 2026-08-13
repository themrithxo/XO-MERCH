import React from 'react';

export default function DuotoneImage({ src, alt, className = '', style = {}, applyDuotone = true }) {
  const fallbackUrl = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80';
  const imageSrc = src && src.length ? src : fallbackUrl;

  return (
    <img
      src={imageSrc}
      alt={alt || 'XO Streetwear Relic'}
      className={`img-fluid ${applyDuotone ? 'xo-duotone-img' : ''} ${className}`}
      style={{
        objectFit: 'cover',
        display: 'block',
        ...style
      }}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = fallbackUrl;
      }}
    />
  );
}
