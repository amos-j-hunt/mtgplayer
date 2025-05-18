import React from 'react';

export default function DeckZone({ player, deck = [], faceDown }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {deck.map((card, idx) => {
        // Compressed fan: 10% of previous spread (2px -> 0.2px)
        const offset = idx * 0.2;
        return (
          <img
            key={idx}
            src={
              faceDown
                ? '/card-back.png'
                : card.imageUrl
            }
            alt={faceDown ? 'Card Back' : card.name}
            style={{
              width: '100px',
              height: '140px',
              position: 'absolute',
              top: `${offset}px`,
              left: `${offset}px`,
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          />
        );
      })}
    </div>
  );
}
