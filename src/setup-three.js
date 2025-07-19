// This script must be imported before any three.js imports
// It fixes compatibility issues with Three.js v0.178.0 and libraries 
// that still use older imports

// Save the original require function
const originalRequire = window.require;

// Create a custom require function that intercepts three.js imports
window.require = function(modulePath) {
  // If requesting 'three', return our patched version
  if (modulePath === 'three') {
    // Import actual three.js
    const THREE = originalRequire('three');
    
    // Add back deprecated constants
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
    THREE.RGBAFormat = 1023;
    THREE.RGBFormat = 1022;
    THREE.SRGBColorSpace = 'srgb';
    THREE.LinearSRGBColorSpace = 'srgb-linear';
    
    // Ensure all required exports exist
    if (!THREE.ColorManagement) {
      THREE.ColorManagement = {
        enabled: true,
        legacyMode: false
      };
    }
    
    return THREE;
  }
  
  // Otherwise, use the original require
  return originalRequire(modulePath);
};

console.log('Three.js compatibility patch applied');