// Type definitions to fix THREE typings for version 0.150.1
import * as THREE from 'three';

// Extend the THREE namespace with missing or renamed properties
declare module 'three' {
  // Formats that exist but TypeScript doesn't recognize
  export const RGBFormat: number;
  export const RedFormat: number;
  export const UnsignedByteType: number;
  export const ACESFilmicToneMapping: number;
  export const ColorManagement: {
    enabled: boolean;
    legacyMode: boolean;
  };

  // Add class references TypeScript doesn't recognize
  export class Vector3 {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): Vector3;
    copy(v: Vector3): Vector3;
    clone(): Vector3;
  }

  export class Vector2 {
    constructor(x?: number, y?: number);
    x: number;
    y: number;
    set(x: number, y: number): Vector2;
    copy(v: Vector2): Vector2;
    clone(): Vector2;
  }

  export class DataTexture extends Texture {
    constructor(
      data: ArrayBufferView, 
      width: number, 
      height: number, 
      format?: number, 
      type?: number
    );
  }

  export class Group extends Object3D {
    constructor();
    type: string;
  }

  export class Mesh extends Object3D {
    constructor(geometry?: BufferGeometry, material?: Material | Material[]);
    geometry: BufferGeometry;
    material: Material | Material[];
    type: string;
  }

  export class Texture {
    constructor();
    encoding: number;
    colorSpace: string;
    needsUpdate: boolean;
  }
}

// Declare global THREE property on window
declare global {
  interface Window {
    THREE: typeof THREE;
  }
}