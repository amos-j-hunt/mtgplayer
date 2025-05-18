// src/components/DeckImporter.js
import React, { useState } from 'react';

export default function DeckImporter({ player, onDeckLoaded }) {
  const [deck, setDeck] = useState([]);

  const handleImport = () => {
    window.require('electron')
      .ipcRenderer
      .invoke('import-mtgo-deck')
      .then(list => {
        setDeck(list);
        onDeckLoaded(list);           // ← inform App of the new deck
      })
      .catch(err => console.error('Deck import failed:', err));
  };

  return (
    <div style={{ flex: 1, padding: '1rem' }}>
      <h3>Player {player} Deck</h3>
      <button onClick={handleImport}>
        Select &amp; Load Deck
      </button>
      
      {deck.length > 0 && (
        <table
          style={{
            marginTop: '1rem',
            width: '100%',
            borderCollapse: 'collapse'
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>#</th>
              <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Preview</th>
            </tr>
          </thead>
          <tbody>
            {deck.map(({ count, name }, i) => {
              const imageUrl = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
                name
              )}&format=image&version=small`;

              return (
                <tr key={`${name}-${i}`}>
                  <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                    {count}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                    {name}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                    <img
                      src={imageUrl}
                      alt={name}
                      style={{ height: '60px', display: 'block', margin: '0 auto' }}
                      onError={e => { e.currentTarget.style.opacity = 0.3 }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
