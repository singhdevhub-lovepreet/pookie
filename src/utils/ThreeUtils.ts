import * as THREE from 'three';

// Helper functions to handle Three.js version compatibility issues

// Get the default encoding for Three.js (v0.150.1 still uses encoding)
export const getDefaultColorSpace = (): string => {
  return 'srgb';
};

// For any other deprecated constants or methods that might be used
export const getDefaultEncoding = (): number => {
  return THREE.LinearEncoding;
};

// Use this when setting encoding on textures
export const setTextureEncoding = (texture: THREE.Texture): void => {
  texture.encoding = THREE.sRGBEncoding;
};