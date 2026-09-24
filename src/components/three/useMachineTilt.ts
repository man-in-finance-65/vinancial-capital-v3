import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Shared "whole machine" motion: a slow idle turntable, a subtle tilt toward the
 * cursor on desktop, and a clamped drag rotation on touch. Used by both the real
 * GLTF-based machine and the procedural placeholder so they behave identically.
 */
export function useMachineTilt(
  pointerRef: { current: { x: number; y: number } },
  dragRotationRef: { current: number },
  isTouch: boolean,
  reducedMotion: boolean
) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || reducedMotion) return;

    if (!isTouch) {
      const targetY = pointerRef.current.x * THREE.MathUtils.degToRad(6);
      const targetX = -pointerRef.current.y * THREE.MathUtils.degToRad(3);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetY, 0.06);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, 0.06);
    } else {
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, dragRotationRef.current, 0.15);
    }
    group.rotation.y += THREE.MathUtils.degToRad(4) * delta;
  });

  return groupRef;
}
