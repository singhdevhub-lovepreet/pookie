// This patch file replaces Three.js LinearEncoding with SRGBColorSpace
// In Three.js v0.178.0, the encoding system changed to color spaces

// Original value of LinearEncoding was 3000
const LinearEncoding = 3000;

// Export replacement values for compatibility with older libraries
module.exports = {
  LinearEncoding
};