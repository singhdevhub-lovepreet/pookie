// Compatibility patch for THREE.LinearEncoding in Three.js >= 0.178
// This is needed because many libraries still reference the old encoding system

// Original value of LinearEncoding was 3000
export const LinearEncoding = 3000;
export const SRGBColorSpace = 'srgb';
export const LinearSRGBColorSpace = 'srgb-linear';

// Export for direct import
export default {
  LinearEncoding,
  SRGBColorSpace,
  LinearSRGBColorSpace
};