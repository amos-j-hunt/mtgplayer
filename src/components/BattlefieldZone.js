import React from 'react';

export default function BattlefieldZone({ player }) {
  return (
    <div style={{ color: '#ccc', fontStyle: 'italic' }}>
      Battlefield (Player {player})
    </div>
  );
}
