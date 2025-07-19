import React, { useState, useEffect } from 'react';
import { GameEnvironment } from './GameEnvironment';
import { LoginScreen } from '../ui/LoginScreen';
import { AudioPermissionDialog } from '../ui/AudioPermissionDialog';
import { Session } from '../../models/Session';
import { Player } from '../../models/Player';
import { SocketService } from '../../services/SocketService';

export const GameLobby: React.FC = () => {
  const [session] = useState<Session>(new Session());
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [showAudioPermission, setShowAudioPermission] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Initialize socket service
  useEffect(() => {
    const socketService = SocketService.getInstance();
    socketService.initializeSession(session);
    
    // Try to connect to the socket server
    try {
      socketService.connect();
      setIsConnected(socketService.isConnected());
    } catch (error) {
      console.error('Failed to connect to socket server:', error);
    }
    
    // Cleanup on component unmount
    return () => {
      socketService.disconnect();
    };
  }, [session]);
  
  // Handle player login
  const handleLogin = (player: Player) => {
    setCurrentPlayer(player);
    setShowAudioPermission(true);
    
    // Join the lobby
    const socketService = SocketService.getInstance();
    socketService.joinLobby(player);
  };
  
  // Handle audio permission response
  const handleAudioPermissionGranted = () => {
    setShowAudioPermission(false);
    setHasAudioPermission(true);
    // TODO: Initialize audio service here
  };
  
  const handleAudioPermissionDenied = () => {
    setShowAudioPermission(false);
    setHasAudioPermission(false);
  };
  
  // Handle player logout/disconnect
  const handleLogout = () => {
    if (currentPlayer) {
      const socketService = SocketService.getInstance();
      socketService.leaveLobby();
      setCurrentPlayer(null);
    }
  };
  
  // Render the appropriate component based on login state
  if (!currentPlayer) {
    return <LoginScreen onLogin={handleLogin} />;
  }
  
  return (
    <div className="game-lobby">
      {showAudioPermission && (
        <AudioPermissionDialog
          onPermissionGranted={handleAudioPermissionGranted}
          onPermissionDenied={handleAudioPermissionDenied}
        />
      )}
      
      <div className="game-controls">
        <div className="player-info">
          <span className="player-name">{currentPlayer.name}</span>
          <img 
            src={`https://flagcdn.com/w20/${currentPlayer.country.toLowerCase()}.png`} 
            alt={currentPlayer.country} 
            className="player-flag"
          />
        </div>
        
        <button className="logout-button" onClick={handleLogout}>
          Leave Game
        </button>
      </div>
      
      <GameEnvironment 
        session={session} 
        currentPlayerId={currentPlayer.id} 
      />
    </div>
  );
};