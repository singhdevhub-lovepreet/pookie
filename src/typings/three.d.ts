// Type definitions for Three.js compatibility patching

declare namespace THREE {
  // Constants from older Three.js versions
  const LinearEncoding: number;
  const sRGBEncoding: number;
  const GammaEncoding: number;
  const RGBEEncoding: number;
  const LogLuvEncoding: number;
  const RGBM7Encoding: number;
  const RGBM16Encoding: number;
  const RGBDEncoding: number;
  const BasicDepthPacking: number;
  const RGBADepthPacking: number;
  
  // Format constants
  const RGBAFormat: number;
  const RGBFormat: number;
  
  // New color space properties
  const SRGBColorSpace: string;
  const LinearSRGBColorSpace: string;
  
  // Tone mapping modes
  const ACESFilmicToneMapping: number;
  
  // Color management
  const ColorManagement: {
    enabled: boolean;
    legacyMode: boolean;
  };
  
  // These are interfaces for types used throughout the codebase
  interface Vector3 {
    x: number;
    y: number;
    z: number;
  }
  
  interface Texture {
    colorSpace: string;
  }
  
  interface DataTexture extends Texture {
    needsUpdate: boolean;
  }
  
  interface Mesh {}
  
  interface Group {}
}