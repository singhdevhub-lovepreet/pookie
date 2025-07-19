import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Environment, OrbitControls, Cloud, Stars } from '@react-three/drei';
import { Terrain as GameTerrain } from './Terrain';
import { Trees } from './Trees';
import { Water } from './Water';
import { Houses } from './Houses';
import { Players } from './Players';
import { Session } from '../../models/Session';
import * as THREE from 'three';
import { getDefaultColorSpace } from '../../utils/ThreeUtils';

interface GameEnvironmentProps {
  session: Session;
  currentPlayerId?: string;
}

export const GameEnvironment: React.FC<GameEnvironmentProps> = ({ session, currentPlayerId }) => {
  const terrainRef = useRef(null);

  // Fix THREE color management for newer versions
  useEffect(() => {
    // Set up global THREE settings
    THREE.ColorManagement.enabled = true;
  }, []);

  return (
    <Canvas 
      camera={{ position: [0, 5, 15], fov: 75 }}
      style={{ height: '100vh', width: '100%' }}
      gl={{ 
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0
      }}
    >
      {/* Sky, clouds, and stars */}
      <Sky 
        distance={450000} 
        sunPosition={[0, 1, 0]} 
        inclination={0.5} 
        azimuth={0.25} 
      />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <Cloud position={[-10, 15, 0]} args={[3, 2]} />
      <Cloud position={[10, 15, -10]} args={[3, 2]} />
      <Cloud position={[-10, 15, 10]} args={[3, 2]} />
      
      {/* Environment lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
      />
      <Environment preset="sunset" />
      
      {/* Game world components */}
      <GameTerrain ref={terrainRef} />
      <Water />
      <Trees />
      <Houses />
      
      {/* Players */}
      <Players session={session} currentPlayerId={currentPlayerId} />
      
      {/* Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below the ground
        minDistance={1}
        maxDistance={30}
      />
    </Canvas>
  );
};