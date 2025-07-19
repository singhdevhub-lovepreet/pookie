import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { setTextureEncoding } from '../../utils/ThreeUtils';

export const Houses: React.FC = () => {
  // House positions
  const housePositions = [
    [-8, 0, 0],
    [8, 0, -3],
    [3, 0, 8],
  ];

  // Create default texture in case the file doesn't exist
  const defaultTexture = {
    map: new THREE.DataTexture(new Uint8Array([210, 180, 140]), 1, 1, THREE.RGBFormat)
  };
  
  // Apply proper encoding to default texture
  defaultTexture.map.needsUpdate = true;
  setTextureEncoding(defaultTexture.map);

  // Try to load actual texture
  const texture = useTexture({
    map: '/textures/house_texture.jpg',
  }, (loadedTextures) => {
    // Apply proper encoding to loaded texture
    if (loadedTextures.map) {
      setTextureEncoding(loadedTextures.map);
    }
  });

  return (
    <group>
      {housePositions.map((position, idx) => (
        <House key={idx} position={new THREE.Vector3(...position)} texture={texture} />
      ))}
    </group>
  );
};

interface HouseProps {
  position: THREE.Vector3;
  texture: {
    map: THREE.Texture;
  };
}

const House: React.FC<HouseProps> = ({ position, texture }) => {
  // Randomly determine house size and rotation for variety
  const width = 2 + Math.random() * 1;
  const height = 2 + Math.random() * 1;
  const depth = 2 + Math.random() * 1;
  const rotation = Math.random() * Math.PI * 2;

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* House base/walls */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial {...texture} color="#D2B48C" roughness={0.8} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, height + 0.5, 0]} castShadow>
        <coneGeometry args={[Math.max(width, depth) * 0.8, 1, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>

      {/* Door */}
      <mesh position={[0, height / 2 - 0.2, depth / 2 + 0.001]} receiveShadow>
        <planeGeometry args={[0.8, 1.5]} />
        <meshStandardMaterial color="#4B3621" roughness={0.9} />
      </mesh>

      {/* Windows */}
      {/* Front window */}
      <mesh position={[width / 3, height / 2 + 0.2, depth / 2 + 0.001]} receiveShadow>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial color="#87CEEB" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Side windows */}
      <mesh position={[width / 2 + 0.001, height / 2 + 0.2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[0.6, 0.5]} />
        <meshStandardMaterial color="#87CEEB" roughness={0.2} metalness={0.8} />
      </mesh>

      <mesh position={[-width / 2 - 0.001, height / 2 + 0.2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[0.6, 0.5]} />
        <meshStandardMaterial color="#87CEEB" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
};