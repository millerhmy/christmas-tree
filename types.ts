import * as THREE from 'three';

export interface OrnamentData {
  id: number;
  chaosPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  color: THREE.Color;
  scale: number;
  rotationSpeed: THREE.Vector3;
  type: 'ball' | 'box' | 'light' | 'car' | 'polaroid';
  textureIndex?: number;
}

export enum AppState {
  CHAOS = 'CHAOS',
  FORMED = 'FORMED'
}

export interface Uniforms {
  uTime: { value: number };
  uProgress: { value: number };
}