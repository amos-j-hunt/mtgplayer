import React from 'react';

export default function GraveyardZone({ player }) {
  return (
    <div style={{ color: '#ccc', fontStyle: 'italic' }}>
      Graveyard (Player {player})
    </div>
  );
}
