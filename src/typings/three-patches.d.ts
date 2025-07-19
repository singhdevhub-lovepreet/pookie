// This file adds type definitions for patches to fix Three.js compatibility issues

declare module 'three-encoding-patch' {
  export const LinearEncoding: number;
  export const SRGBColorSpace: string;
  export const LinearSRGBColorSpace: string;
}

// Augment Three.js module
declare module 'three' {
  // Add back LinearEncoding for backwards compatibility
  export const LinearEncoding: number;
}