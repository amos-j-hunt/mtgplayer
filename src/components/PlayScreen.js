import React, { useState, useEffect, useMemo } from 'react';
import DeckZone from './DeckZone';
import GraveyardZone from './GraveyardZone';
import ExileZone from './ExileZone';
import HandZone from './HandZone';
import BattlefieldZone from './BattlefieldZone';

const phases = [
  { name: 'Beginning', steps: ['Untap', 'Upkeep', 'Draw'] },
  { name: 'Main 1', steps: [] },
  { name: 'Combat', steps: ['Beginning', 'Declare Attackers', 'Declare Blockers', 'Combat Damage', 'End of Combat'] },
  { name: 'Main 2', steps: [] },
  { name: 'End', steps: ['End', 'Cleanup'] }
];

// Fisher–Yates shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PlayScreen({ decks }) {
  // Prepare shuffled library & initial hand for each player
  const gameState = useMemo(() => {
    const state = {};
    [1, 2].forEach(player => {
      const expanded = [];
      (decks[player] || []).forEach(entry => {
        for (let i = 0; i < entry.count; i++) {
          expanded.push({
            id: entry.id,
            name: entry.name,
            imageUrl: `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
              entry.name
            )}&format=image&version=normal`
          });
        }
      });
      const shuffled = shuffle(expanded);
      state[player] = {
        hand: shuffled.slice(0, 7),
        library: shuffled.slice(7)
      };
    });
    return state;
  }, [decks]);

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [activePlayer, setActivePlayer] = useState(1);

  // Handle Ctrl+P for priority passing
  useEffect(() => {
    const onKey = e => {
      if (e.ctrlKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setPassCount(prev => {
          const next = prev + 1;
          if (next >= 2) {
            advance();
            return 0;
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentPhaseIndex, currentStepIndex, activePlayer]);

          const advance = () => {
    // Reset priority passes
    setPassCount(0);
    const phaseDef = phases[currentPhaseIndex];

    // 1) If current phase has steps, and not at last step -> next step
    if (phaseDef.steps.length > 0 && currentStepIndex < phaseDef.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      return;
    }

    // 2) Otherwise, end of phase: move to next phase or wrap
    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1);
      setCurrentStepIndex(0);
    } else {
      // 3) Last phase ended -> wrap to first phase and toggle active player
      setCurrentPhaseIndex(0);
      setCurrentStepIndex(0);
      setActivePlayer(activePlayer === 1 ? 2 : 1);
    }
  };

  const phase = phases[currentPhaseIndex];
  const stepName = phase.steps.length ? phase.steps[currentStepIndex] : '';
  const indicator = `${phase.name}${stepName ? `: ${stepName}` : ''} - ${passCount + 1} - P${activePlayer}`;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
        gridTemplateRows: '0.2fr 0.8fr 2px 0.8fr 0.2fr',
        height: '100vh',
        background: '#1a1a1a',
        color: '#fff'
      }}
    >
      {/* Sidebar: Deck, Graveyard, Exile */}
      <div
        style={{
          gridRow: '1 / span 5',
          gridColumn: '1 / 2',
          display: 'grid',
          gridTemplateRows: '1fr 1fr',
          borderRight: '1px solid #444'
        }}
      >
        <div style={{ padding: '1rem', borderBottom: '1px solid #444' }}>
          <DeckZone player={2} deck={gameState[2].library} faceDown />
          <GraveyardZone player={2} />
          <ExileZone player={2} />
        </div>
        <div style={{ padding: '1rem' }}>
          <DeckZone player={1} deck={gameState[1].library} faceDown />
          <GraveyardZone player={1} />
          <ExileZone player={1} />
        </div>
      </div>

      {/* Player 2 Hand */}
      <div style={{ gridRow: '1 / 2', gridColumn: '2 / 3', padding: '1rem', overflow: 'auto' }}>
        <HandZone player={2} cards={gameState[2].hand} faceDown={false} />
      </div>

      {/* Player 2 Battlefield */}
      <div style={{ gridRow: '2 / 3', gridColumn: '2 / 3', position: 'relative', padding: '1rem', overflow: 'auto' }}>
        <BattlefieldZone player={2} />
        {activePlayer === 2 && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.6)',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            {indicator}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ gridRow: '3 / 4', gridColumn: '2 / 3', background: '#444', height: '2px' }} />

      {/* Player 1 Battlefield */}
      <div style={{ gridRow: '4 / 5', gridColumn: '2 / 3', position: 'relative', padding: '1rem', overflow: 'auto' }}>
        <BattlefieldZone player={1} />
        {activePlayer === 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.6)',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            {indicator}
          </div>
        )}
      </div>

      {/* Player 1 Hand */}
      <div style={{ gridRow: '5 / 6', gridColumn: '2 / 3', padding: '1rem', overflow: 'auto' }}>
        <HandZone player={1} cards={gameState[1].hand} faceDown={false} />
      </div>
    </div>
  );
}
