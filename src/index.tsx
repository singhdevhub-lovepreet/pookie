import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Make THREE available globally (following StackOverflow approach)
import * as THREE from 'three';

// Make THREE available globally to fix import issues in dependencies
window.THREE = THREE;

// Import CSS files for components
import './components/ui/LoginScreen.css';
import './components/ui/AudioPermissionDialog.css';
import './components/game/GameLobby.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);