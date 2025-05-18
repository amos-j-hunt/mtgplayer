// src/components/HandZone.js
import React from 'react';
import HoverPreview from './HoverPreview';

export default function HandZone({ player, cards = [], faceDown }) {
  const smallStyle = {
    width: '100px',
    height: '140px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
  };
  const largeStyle = { width: 200, height: 280, borderRadius: 4 };

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {cards.map((card, idx) => (
        <HoverPreview
          key={idx}
          src={faceDown ? '/card-back.png' : card.imageUrl}
          alt={faceDown ? 'Card Back' : card.name}
          smallStyle={smallStyle}
          largeStyle={largeStyle}
        />
      ))}
    </div>
  );
}
