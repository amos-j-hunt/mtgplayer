import React, { useState } from 'react';
import DeckImporter from './components/DeckImporter';
import PlayScreen from './components/PlayScreen';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [decks, setDecks] = useState({ 1: [], 2: [] });

  // Called when each DeckImporter loads its deck
  const handleDeckLoaded = (player, deck) => {
    setDecks(current => ({ ...current, [player]: deck }));
  };

  if (!gameStarted) {
    // Lobby view: two importers + Start Game button
    return (
      <div style={{ padding: '1rem' }}>
        <button
          onClick={() => setGameStarted(true)}
          style={{ padding: '0.5rem 1rem', marginBottom: '1rem', fontSize: '1rem' }}
        >
          Start Game
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <DeckImporter
            player={2}
            onDeckLoaded={deck => handleDeckLoaded(2, deck)}
          />
          <DeckImporter
            player={1}
            onDeckLoaded={deck => handleDeckLoaded(1, deck)}
          />
        </div>
      </div>
    );
  }

  // Once game is started, render PlayScreen with decks prop
  return <PlayScreen decks={decks} />;
}
