// This file contains monkey patches for Three.js to fix compatibility issues

// Import three to ensure it's loaded
import * as THREE_ORIGINAL from 'three';

// Create a custom encoding patch module for compatibility
// This will be used by other components that import 'three-encoding-patch'
const createEncodingPatch = () => {
  if (!(window as any).encodingPatchModule) {
    (window as any).encodingPatchModule = {
      LinearEncoding: 3000,
      SRGBColorSpace: 'srgb',
      LinearSRGBColorSpace: 'srgb-linear'
    };
  }
  
  // Add the module to window for direct imports
  (window as any).threeEncodingPatch = (window as any).encodingPatchModule;
};

// Apply the monkey patch before importing three
// Add missing THREE properties that older libraries might use
const applyThreeJsPatches = () => {
  // Create the encoding patch module
  createEncodingPatch();
  // Create a dummy THREE object if it doesn't exist yet
  if (!(window as any).THREE) {
    (window as any).THREE = {};
  }
  
  // Add deprecated constants used by @react-three/drei and other libraries
  const THREE = (window as any).THREE;
  
  // Merge the original THREE exports
  Object.assign(THREE, THREE_ORIGINAL);

  // Old encoding system constants
  THREE.LinearEncoding = 3000;
  THREE.sRGBEncoding = 3001;
  THREE.GammaEncoding = 2;
  THREE.RGBEEncoding = 3002;
  THREE.LogLuvEncoding = 3003;
  THREE.RGBM7Encoding = 3004;
  THREE.RGBM16Encoding = 3005;
  THREE.RGBDEncoding = 3006;
  THREE.BasicDepthPacking = 3200;
  THREE.RGBADepthPacking = 3201;
  
  // Old format constants
  THREE.RGBAFormat = 1023;
  THREE.RGBFormat = 1022;
  
  // New color space properties
  THREE.SRGBColorSpace = 'srgb';
  THREE.LinearSRGBColorSpace = 'srgb-linear';
  
  // Tone mapping modes
  THREE.ACESFilmicToneMapping = 5;
  
  // Color management
  if (!THREE.ColorManagement) {
    THREE.ColorManagement = {
      enabled: true,
      legacyMode: false
    };
  }

  // Add Vector3 class if it doesn't exist
  if (!THREE.Vector3) {
    THREE.Vector3 = THREE_ORIGINAL.Vector3 || class Vector3 {
      x: number;
      y: number;
      z: number;
      
      constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
      }
    };
  }

  // Make the patched THREE globally available
  (window as any).THREE = THREE;

  console.log('Applied Three.js monkey patches for compatibility.');
};

export default applyThreeJsPatches;