import * as THREE from 'three';

export type SpinState = { active: boolean; angle: number; speed: number };
export type HingeState = { active: boolean; angle: number };

export function stepSpin(
  node: THREE.Object3D,
  axis: 'x' | 'y' | 'z',
  state: SpinState,
  maxSpeed: number,
  delta: number,
  reducedMotion: boolean
) {
  const target = state.active ? maxSpeed : 0;
  state.speed = reducedMotion ? target : THREE.MathUtils.lerp(state.speed, target, 0.08);
  state.angle += state.speed * delta;
  node.rotation[axis] = state.angle;
}

export function stepHinge(
  node: THREE.Object3D,
  axis: 'x' | 'y' | 'z',
  state: HingeState,
  maxAngle: number,
  delta: number,
  reducedMotion: boolean
) {
  const target = state.active ? maxAngle : 0;
  state.angle = reducedMotion ? target : THREE.MathUtils.lerp(state.angle, target, 0.08);
  node.rotation[axis] = state.angle;
}
