import React, { forwardRef, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { setTextureEncoding } from '../../utils/ThreeUtils';

export const Terrain = forwardRef<THREE.Mesh>((props, ref) => {
  // Create a default texture in case loading fails
  const defaultTexture = {
    map: new THREE.DataTexture(new Uint8Array([100, 150, 100]), 1, 1)
  };

  // Set proper encoding for default texture
  defaultTexture.map.needsUpdate = true;
  setTextureEncoding(defaultTexture.map);

  // Try loading just the ground texture
  const textures = useTexture({
    map: '/textures/grassland_texture.jpg'
  }, (loadedTextures) => {
    setTextureEncoding(loadedTextures.map);
  });

  // Create the terrain mesh
  const localRef = useRef<THREE.Mesh>(null);
  const meshRef = ref || localRef;
  
  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -1, 0]} 
      receiveShadow
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        map={textures.map}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
});