import React, { forwardRef, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { setTextureEncoding } from '../../utils/ThreeUtils';

export const Terrain = forwardRef<THREE.Mesh>((props, ref) => {
  // Placeholder for texture until real assets are added
  const defaultTexture = {
    map: new THREE.DataTexture(new Uint8Array([100, 150, 100]), 1, 1),
    displacementMap: new THREE.DataTexture(new Uint8Array([0]), 1, 1),
    normalMap: new THREE.DataTexture(new Uint8Array([127, 127, 255]), 1, 1, THREE.RGBFormat),
    roughnessMap: new THREE.DataTexture(new Uint8Array([150]), 1, 1),
    aoMap: new THREE.DataTexture(new Uint8Array([255]), 1, 1)
  };

  // Set proper encoding for all textures
  Object.values(defaultTexture).forEach(tex => {
    tex.needsUpdate = true;
    setTextureEncoding(tex);
  });

  // Try loading textures, fall back to defaults if files don't exist
  const textures = useTexture({
    map: '/textures/grassland_texture.jpg',  // This will need to be added to public/textures
    displacementMap: '/textures/height_map.jpg',
    normalMap: '/textures/normal_map.jpg',
    roughnessMap: '/textures/roughness_map.jpg',
    aoMap: '/textures/ao_map.jpg',
  }, (loadedTextures) => {
    // Set proper encoding for all loaded textures
    Object.values(loadedTextures).forEach(tex => {
      setTextureEncoding(tex);
    });
  });

  // Create the terrain mesh
  const localRef = useRef<THREE.Mesh>(null);
  const meshRef = ref || localRef;

  // Generate heightmap data for a more interesting terrain
  const generateHeightmap = () => {
    const size = 128;
    const data = new Uint8Array(size * size);
    
    // Generate simple hills and valleys
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // Generate some noise-like values
        const x = i / size * 10;
        const y = j / size * 10;
        const value = (
          Math.sin(x) * Math.sin(y) * 10 + 
          Math.sin(x * 2) * Math.sin(y * 2) * 5 +
          Math.sin(x * 4) * Math.sin(y * 4) * 2.5
        );
        
        // Normalize to 0-255 range
        data[i * size + j] = Math.max(0, Math.min(255, (value + 15) * 8));
      }
    }
    
    // Create a DataTexture with the heightmap data
    const heightMap = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RedFormat,
      THREE.UnsignedByteType
    );
    
    heightMap.needsUpdate = true;
    setTextureEncoding(heightMap);
    return heightMap;
  };

  // Procedurally generated heightmap
  const heightMap = generateHeightmap();
  
  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -1, 0]} 
      receiveShadow
    >
      <planeGeometry args={[100, 100, 128, 128]} />
      <meshStandardMaterial
        {...textures}
        displacementScale={5}
        roughness={0.8}
        metalness={0.1}
        displacementMap={heightMap}
      />
    </mesh>
  );
});