import React, { createContext, useReducer } from 'react';

// Initial zones: battlefield (visible cards in play for now)
const initialState = {
  battlefield: []
  // later: hand: [], library: [], graveyard: [], exile: []
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'PLAY_CARD':
      // action.card = { id, name, imageUrl, power?, toughness? }
      return {
        ...state,
        battlefield: [
          ...state.battlefield,
          { ...action.card, tapped: false }
        ]
      };
    case 'TOGGLE_TAP':
      return {
        ...state,
        battlefield: state.battlefield.map(c =>
          c.id === action.id
            ? { ...c, tapped: !c.tapped }
            : c
        )
      };
    default:
      return state;
  }
}

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
