import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export default function Battlefield() {
  const { state, dispatch } = useContext(GameContext);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Battlefield</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '1rem'
        }}
      >
        {state.battlefield.map(card => (
          <div
            key={card.id}
            onClick={() => dispatch({ type: 'TOGGLE_TAP', id: card.id })}
            style={{
              textAlign: 'center',
              transform: card.tapped ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
          >
            <img
              src={card.imageUrl}
              alt={card.name}
              style={{ width: '100%', borderRadius: '4px' }}
            />
            <div style={{ marginTop: '0.5rem' }}>
              {card.name}
              {card.power != null ? ` (${card.power}/${card.toughness})` : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
