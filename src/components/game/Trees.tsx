import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

export const Trees: React.FC = () => {
  // Tree positions - these would ideally be generated based on the terrain
  // or loaded from a more complex environment setup
  const treePositions = [
    [-15, 0, -15],
    [-10, 0, -12],
    [-5, 0, -8],
    [5, 0, -6],
    [10, 0, -10],
    [15, 0, -15],
    [-15, 0, 5],
    [-10, 0, 10],
    [-5, 0, 12],
    [5, 0, 8],
    [10, 0, 15],
    [20, 0, -5],
    [25, 0, 5],
    [-20, 0, 15],
    [-25, 0, -10],
  ];

  // Group of tree refs for animation
  const treeRefs = useRef<THREE.Group[]>([]);
  
  // Gentle wind animation effect for trees
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    treeRefs.current.forEach((tree, i) => {
      if (tree) {
        // Apply a subtle swaying motion
        tree.rotation.z = Math.sin(time * 0.5 + i * 0.3) * 0.05;
      }
    });
  });

  return (
    <group>
      {/* Tree trunks */}
      <Instances limit={treePositions.length}>
        <cylinderGeometry args={[0.2, 0.4, 2, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
        
        {treePositions.map((position, i) => (
          <group 
            key={i} 
            position={[position[0], position[1], position[2]]}
            ref={el => { if (el) treeRefs.current[i] = el; }}
          >
            <Instance position={[0, 1, 0]} />
          </group>
        ))}
      </Instances>
      
      {/* Tree foliage */}
      <Instances limit={treePositions.length}>
        <coneGeometry args={[1, 3, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.7} />
        
        {treePositions.map((position, i) => (
          <group key={i} position={[position[0], position[1] + 3, position[2]]}>
            <Instance />
          </group>
        ))}
      </Instances>
      
      {/* Smaller trees/bushes */}
      <Instances limit={20}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color="#006400" roughness={0.8} />
        
        {Array.from({ length: 20 }).map((_, i) => {
          const x = Math.random() * 40 - 20;
          const z = Math.random() * 40 - 20;
          return (
            <Instance 
              key={i}
              position={[x, 0.8, z]}
              scale={[1, 1 + Math.random() * 0.5, 1]}
            />
          );
        })}
      </Instances>
    </group>
  );
};