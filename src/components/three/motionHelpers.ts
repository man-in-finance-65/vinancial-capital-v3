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

/** Subtle "pop" scale-up used as hover/touch feedback on interactive parts. */
export function stepHoverScale(node: THREE.Object3D, active: boolean, reducedMotion: boolean, maxScale = 1.06) {
  const target = active ? maxScale : 1;
  const next = reducedMotion ? target : THREE.MathUtils.lerp(node.scale.x, target, 0.15);
  node.scale.setScalar(next);
}

/** Brightens an accent mesh's emissive glow as hover/touch feedback. */
export function stepHoverGlow(
  material: THREE.MeshStandardMaterial,
  active: boolean,
  reducedMotion: boolean,
  baseIntensity: number,
  maxIntensity: number
) {
  const target = active ? maxIntensity : baseIntensity;
  material.emissiveIntensity = reducedMotion ? target : THREE.MathUtils.lerp(material.emissiveIntensity, target, 0.12);
}
