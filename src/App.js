import React, { useState } from 'react';
import DeckImporter from './components/DeckImporter';
import Battlefield  from './components/Battlefield'; // assume you’ll adapt it next

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [decks, setDecks] = useState({ 1: [], 2: [] });

  // called by each importer
  const handleDeckLoaded = (player, deck) => {
    setDecks(current => ({ ...current, [player]: deck }));
  };

  if (!gameStarted) {
    // LOBBY VIEW
    return (
      <div style={{ padding: '1rem' }}>
        <button
          onClick={() => setGameStarted(true)}
          style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}
        >
          Start Game
        </button>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <DeckImporter
            player={1}
            onDeckLoaded={deck => handleDeckLoaded(1, deck)}
          />
          <DeckImporter
            player={2}
            onDeckLoaded={deck => handleDeckLoaded(2, deck)}
          />
        </div>
      </div>
    );
  }

  // BATTLEFIELD VIEW
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Battlefield</h1>
      {/* 
        For now, just render your Battlefield component.
        Later you can pass `decks` into it to populate hands, etc.
      */}
      <Battlefield />
    </div>
  );
}
