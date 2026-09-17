import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { IndustryKey } from '../../config/machines';
import { useMachineTilt } from './useMachineTilt';
import { stepHinge, stepSpin, type HingeState, type SpinState } from './motionHelpers';

// Stylized, low-poly stand-ins for the real .glb models, built from primitives so the
// hero works with zero external assets. Same hover/touch interactivity (spin, hinge,
// tilt, idle turntable) as the real models — swap in real .glb files in public/models
// and this component is bypassed automatically (see HeroScene.tsx).

const COLOR_BODY = '#152337';
const COLOR_BODY_DARK = '#0B1628';
const COLOR_ACCENT = '#86D2F3';
const COLOR_TRIM = '#23344D';
const COLOR_WHEEL = '#0B1628';

type InteractionProps = { isTouch: boolean; reducedMotion: boolean };

function usePartState(isTouch: boolean) {
  const state = useRef<SpinState & HingeState>({ active: false, angle: 0, speed: 0 });
  const timerRef = useRef<number>();

  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (isTouch) return;
    e.stopPropagation();
    state.current.active = true;
    document.body.style.cursor = 'pointer';
  };
  const onPointerOut = (e: ThreeEvent<PointerEvent>) => {
    if (isTouch) return;
    e.stopPropagation();
    state.current.active = false;
    document.body.style.cursor = 'auto';
  };
  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!isTouch) return;
    e.stopPropagation();
    state.current.active = true;
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      state.current.active = false;
    }, 1200);
  };

  return { state, handlers: { onPointerOver, onPointerOut, onPointerDown } };
}

function Wheel({ x, z, radius = 0.38, isTouch, reducedMotion }: { x: number; z: number; radius?: number } & InteractionProps) {
  const ref = useRef<THREE.Mesh>(null);
  const { state, handlers } = usePartState(isTouch);

  useFrame((_, delta) => {
    if (ref.current) stepSpin(ref.current, 'x', state.current, 10, delta, reducedMotion);
  });

  return (
    <mesh ref={ref} position={[x, -0.78, z]} rotation={[0, 0, Math.PI / 2]} {...handlers}>
      <cylinderGeometry args={[radius, radius, 0.32, 20]} />
      <meshStandardMaterial color={COLOR_WHEEL} />
    </mesh>
  );
}

function ExcavatorBody({ isTouch, reducedMotion }: InteractionProps) {
  const trackLeftRef = useRef<THREE.Mesh>(null);
  const trackRightRef = useRef<THREE.Mesh>(null);
  const boomRef = useRef<THREE.Group>(null);
  const trackLeft = usePartState(isTouch);
  const trackRight = usePartState(isTouch);
  const boom = usePartState(isTouch);

  useFrame((_, delta) => {
    if (trackLeftRef.current) stepSpin(trackLeftRef.current, 'z', trackLeft.state.current, 3, delta, reducedMotion);
    if (trackRightRef.current) stepSpin(trackRightRef.current, 'z', trackRight.state.current, 3, delta, reducedMotion);
    if (boomRef.current) stepHinge(boomRef.current, 'x', boom.state.current, -0.5, delta, reducedMotion);
  });

  return (
    <>
      <mesh position={[0, -0.85, 0]}>
        <boxGeometry args={[2.2, 0.5, 1.3]} />
        <meshStandardMaterial color={COLOR_BODY_DARK} />
      </mesh>
      <mesh ref={trackLeftRef} position={[-0.85, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]} {...trackLeft.handlers}>
        <cylinderGeometry args={[0.42, 0.42, 2.0, 16]} />
        <meshStandardMaterial color={COLOR_TRIM} />
      </mesh>
      <mesh ref={trackRightRef} position={[0.85, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]} {...trackRight.handlers}>
        <cylinderGeometry args={[0.42, 0.42, 2.0, 16]} />
        <meshStandardMaterial color={COLOR_TRIM} />
      </mesh>
      <mesh position={[-0.3, 0.05, 0]}>
        <boxGeometry args={[1.1, 0.85, 1.1]} />
        <meshStandardMaterial color={COLOR_BODY} />
      </mesh>
      <mesh position={[-0.05, 0.15, 0.56]}>
        <boxGeometry args={[0.5, 0.4, 0.04]} />
        <meshStandardMaterial color={COLOR_ACCENT} emissive={COLOR_ACCENT} emissiveIntensity={0.15} />
      </mesh>
      <group ref={boomRef} position={[0.3, 0.35, 0]} {...boom.handlers}>
        <mesh position={[0.75, 0.25, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[1.5, 0.22, 0.22]} />
          <meshStandardMaterial color={COLOR_TRIM} />
        </mesh>
        <mesh position={[1.5, 0.75, 0]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[1.1, 0.18, 0.18]} />
          <meshStandardMaterial color={COLOR_TRIM} />
        </mesh>
        <mesh position={[1.9, 1.05, 0]} rotation={[0, 0, 1.9]}>
          <boxGeometry args={[0.5, 0.35, 0.5]} />
          <meshStandardMaterial color={COLOR_BODY} />
        </mesh>
      </group>
    </>
  );
}

function SemiTruckBody({ isTouch, reducedMotion }: InteractionProps) {
  return (
    <>
      <mesh position={[-1.1, -0.15, 0]}>
        <boxGeometry args={[1.0, 1.0, 1.1]} />
        <meshStandardMaterial color={COLOR_BODY} />
      </mesh>
      <mesh position={[-1.1, 0.15, 0.57]}>
        <boxGeometry args={[0.55, 0.4, 0.04]} />
        <meshStandardMaterial color={COLOR_ACCENT} emissive={COLOR_ACCENT} emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0.6, -0.05, 0]}>
        <boxGeometry args={[2.4, 1.2, 1.15]} />
        <meshStandardMaterial color={COLOR_BODY_DARK} />
      </mesh>
      <mesh position={[0.6, -0.05, 0.581]}>
        <boxGeometry args={[2.2, 0.08, 0.02]} />
        <meshStandardMaterial color={COLOR_ACCENT} />
      </mesh>
      {[-1.5, -0.7, 0.4, 1.5].map((x) => (
        <group key={x}>
          <Wheel x={x} z={0.62} isTouch={isTouch} reducedMotion={reducedMotion} />
          <Wheel x={x} z={-0.62} isTouch={isTouch} reducedMotion={reducedMotion} />
        </group>
      ))}
    </>
  );
}

function WalkInFridgeBody({ isTouch, reducedMotion }: InteractionProps) {
  const doorRef = useRef<THREE.Group>(null);
  const doorState = usePartState(isTouch);

  useFrame((_, delta) => {
    if (doorRef.current) stepHinge(doorRef.current, 'y', doorState.state.current, 1.3, delta, reducedMotion);
  });

  return (
    <>
      {/* body */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.6, 1.8, 1.4]} />
        <meshStandardMaterial color={COLOR_BODY_DARK} />
      </mesh>
      {/* compressor unit on top */}
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[1.0, 0.35, 0.9]} />
        <meshStandardMaterial color={COLOR_TRIM} />
      </mesh>
      {/* hinged door, swings open from its left edge */}
      <group ref={doorRef} position={[-0.75, -0.1, 0.71]} {...doorState.handlers}>
        <mesh position={[0.68, 0, 0.03]}>
          <boxGeometry args={[1.36, 1.6, 0.06]} />
          <meshStandardMaterial color={COLOR_BODY} />
        </mesh>
        <mesh position={[1.15, 0.1, 0.08]}>
          <boxGeometry args={[0.06, 0.55, 0.06]} />
          <meshStandardMaterial color={COLOR_ACCENT} emissive={COLOR_ACCENT} emissiveIntensity={0.15} />
        </mesh>
      </group>
    </>
  );
}

export function PlaceholderMachine({
  industry,
  pointerRef,
  isTouch,
  reducedMotion,
  dragRotationRef,
}: {
  industry: IndustryKey;
  pointerRef: { current: { x: number; y: number } };
  isTouch: boolean;
  reducedMotion: boolean;
  dragRotationRef: { current: number };
}) {
  const groupRef = useMachineTilt(pointerRef, dragRotationRef, isTouch, reducedMotion);

  return (
    <group ref={groupRef}>
      {industry === 'construction' && <ExcavatorBody isTouch={isTouch} reducedMotion={reducedMotion} />}
      {industry === 'trucking' && <SemiTruckBody isTouch={isTouch} reducedMotion={reducedMotion} />}
      {industry === 'restaurant' && <WalkInFridgeBody isTouch={isTouch} reducedMotion={reducedMotion} />}
    </group>
  );
}
