import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 1. Import the GameProvider
import { GameProvider } from './context/GameContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. Wrap App in GameProvider */}
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>
);

// 3. Keep measuring performance if you like
reportWebVitals();
