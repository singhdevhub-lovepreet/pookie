import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { setTextureEncoding } from '../../utils/ThreeUtils';

export const Water: React.FC = () => {
  const waterRef = useRef<THREE.Mesh>(null);
  
  // Create default textures in case the files don't exist
  const defaultTextures = {
    map: new THREE.DataTexture(new Uint8Array([0, 100, 200]), 1, 1, THREE.RGBFormat),
    normalMap: new THREE.DataTexture(new Uint8Array([127, 127, 255]), 1, 1, THREE.RGBFormat)
  };
  
  // Apply proper encoding to default textures
  Object.values(defaultTextures).forEach(tex => {
    tex.needsUpdate = true;
    setTextureEncoding(tex);
  });
  
  // Try to load actual textures
  const textures = useTexture({
    map: '/textures/water_texture.jpg',
    normalMap: '/textures/water_normal.jpg',
  }, (loadedTextures) => {
    // Apply proper encoding to loaded textures
    Object.values(loadedTextures).forEach(tex => {
      setTextureEncoding(tex);
    });
  });

  // Animate the water
  useFrame((state) => {
    if (waterRef.current) {
      // Get the material and cast it appropriately
      const material = waterRef.current.material as any;
      
      if (material && material.normalMap) {
        // Animate normal map for moving water effect
        const time = state.clock.getElapsedTime() * 0.2;
        material.normalMap.offset.set(time % 1, (time * 0.5) % 1);
      }
    }
  });

  return (
    <mesh
      ref={waterRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[10, -0.2, 10]} // Position the lake in the world
      receiveShadow
    >
      <planeGeometry args={[20, 15, 32, 32]} />
      <MeshReflectorMaterial
        {...textures}
        color="#00BFFF"
        roughness={0.1}
        metalness={0.8}
        mirror={0.8}
        resolution={512}
        blur={[400, 100]}
        mixBlur={1}
        mixStrength={8}
        opacity={0.9}
        transparent={true}
        depthScale={1}
        minDepthThreshold={0.9}
        maxDepthThreshold={1}
        depthToBlurRatioBias={0.25}
      />
    </mesh>
  );
};