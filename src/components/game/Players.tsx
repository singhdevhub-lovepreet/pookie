import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html, useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Session } from '../../models/Session';
import { Player } from '../../models/Player';
import { SocketService } from '../../services/SocketService';

interface PlayersProps {
  session: Session;
  currentPlayerId?: string;
}

export const Players: React.FC<PlayersProps> = ({ session, currentPlayerId }) => {
  const players = session.getAllPlayers();
  
  return (
    <group>
      {players.map((player) => (
        <PlayerAvatar 
          key={player.id} 
          player={player} 
          isCurrentPlayer={player.id === currentPlayerId} 
        />
      ))}
    </group>
  );
};

interface PlayerAvatarProps {
  player: Player;
  isCurrentPlayer: boolean;
}

// This component represents a single player in the 3D world
const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ player, isCurrentPlayer }) => {
  const characterRef = useRef<THREE.Group>(null);
  const socket = SocketService.getInstance();
  
  // Load character model (using a placeholder cube for now)
  // In a real implementation, this would load a GLTF model
  
  // Handle player movement
  const [movementKeys, setMovementKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });
  
  // Moving speed
  const speed = 0.1;
  
  // Handle keyboard input for current player
  useEffect(() => {
    if (!isCurrentPlayer) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovementKeys(prev => ({ ...prev, forward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovementKeys(prev => ({ ...prev, backward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovementKeys(prev => ({ ...prev, left: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovementKeys(prev => ({ ...prev, right: true }));
          break;
        case 'Space':
          setMovementKeys(prev => ({ ...prev, jump: true }));
          break;
      }
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovementKeys(prev => ({ ...prev, forward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovementKeys(prev => ({ ...prev, backward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovementKeys(prev => ({ ...prev, left: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovementKeys(prev => ({ ...prev, right: false }));
          break;
        case 'Space':
          setMovementKeys(prev => ({ ...prev, jump: false }));
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCurrentPlayer]);
  
  // Handle movement based on key presses
  useFrame(() => {
    if (isCurrentPlayer && characterRef.current) {
      let moved = false;
      const newPosition = player.position.clone();
      
      if (movementKeys.forward) {
        newPosition.z -= speed;
        moved = true;
      }
      if (movementKeys.backward) {
        newPosition.z += speed;
        moved = true;
      }
      if (movementKeys.left) {
        newPosition.x -= speed;
        moved = true;
      }
      if (movementKeys.right) {
        newPosition.x += speed;
        moved = true;
      }
      
      if (moved) {
        // Update character position
        characterRef.current.position.set(
          newPosition.x,
          newPosition.y,
          newPosition.z
        );
        
        // Send update to server
        socket.updatePosition(newPosition.x, newPosition.y, newPosition.z);
      }
    } else if (characterRef.current) {
      // Update non-current player positions based on their current position
      characterRef.current.position.set(
        player.position.x,
        player.position.y,
        player.position.z
      );
    }
  });
  
  // Calculate color based on player id for visual distinction
  const idToColor = () => {
    let hash = 0;
    for (let i = 0; i < player.id.length; i++) {
      hash = player.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const c = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    
    return `#${'00000'.substring(0, 6 - c.length)}${c}`;
  };

  return (
    <group ref={characterRef} position={[player.position.x, player.position.y, player.position.z]}>
      {/* Character model (placeholder cube) */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 1.8, 0.5]} />
        <meshStandardMaterial color={isCurrentPlayer ? "#FF0000" : idToColor()} />
      </mesh>
      
      {/* Player name and country flag */}
      <group position={[0, 2.2, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {player.name}
        </Text>
        
        <Html
          position={[0, 0.3, 0]}
          transform
          occlude
          distanceFactor={10}
          sprite
        >
          <div style={{ 
            width: '30px', 
            height: '20px', 
            background: `url(https://flagcdn.com/w40/${player.country.toLowerCase()}.png) no-repeat center center`,
            backgroundSize: 'cover' 
          }} />
        </Html>
      </group>
      
      {/* Visual indicator for speaking players */}
      {player.isSpeaking && (
        <mesh position={[0, 2.6, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#00FF00" />
        </mesh>
      )}
    </group>
  );
};