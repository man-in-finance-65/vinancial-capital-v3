import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { IndustryKey } from '../../config/machines';
import { useMachineTilt } from './useMachineTilt';
import { stepHinge, stepSpin, stepHoverScale, stepHoverGlow, type HingeState, type SpinState } from './motionHelpers';

// Stylized, low-poly stand-ins for the real .glb models, built from primitives so the
// hero works with zero external assets. Same hover/touch interactivity (spin, hinge,
// tilt, idle turntable) as the real models — swap in real .glb files in public/models
// and this component is bypassed automatically (see HeroScene.tsx).

const COLOR_BODY = '#152337';
const COLOR_BODY_DARK = '#0B1628';
const COLOR_ACCENT = '#86D2F3';
const COLOR_TRIM = '#23344D';
const COLOR_WHEEL = '#0B1628';

const GLOW_BASE = 0.15;
const GLOW_HOVER = 0.75;

const BODY_MATERIAL = { color: COLOR_BODY, roughness: 0.4, metalness: 0.55 } as const;
const BODY_DARK_MATERIAL = { color: COLOR_BODY_DARK, roughness: 0.45, metalness: 0.5 } as const;
const TRIM_MATERIAL = { color: COLOR_TRIM, roughness: 0.55, metalness: 0.35 } as const;
const WHEEL_MATERIAL = { color: COLOR_WHEEL, roughness: 0.7, metalness: 0.2 } as const;

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
    if (!ref.current) return;
    stepSpin(ref.current, 'x', state.current, 10, delta, reducedMotion);
    stepHoverScale(ref.current, state.current.active, reducedMotion, 1.12);
  });

  return (
    <mesh ref={ref} position={[x, -0.78, z]} rotation={[0, 0, Math.PI / 2]} {...handlers}>
      <cylinderGeometry args={[radius, radius, 0.32, 20]} />
      <meshStandardMaterial {...WHEEL_MATERIAL} />
    </mesh>
  );
}

function ExcavatorBody({ isTouch, reducedMotion }: InteractionProps) {
  const trackLeftRef = useRef<THREE.Mesh>(null);
  const trackRightRef = useRef<THREE.Mesh>(null);
  const boomRef = useRef<THREE.Group>(null);
  const cabinRef = useRef<THREE.Group>(null);
  const windowRef = useRef<THREE.Mesh>(null);
  const trackLeft = usePartState(isTouch);
  const trackRight = usePartState(isTouch);
  const boom = usePartState(isTouch);
  const cabin = usePartState(isTouch);

  useFrame((_, delta) => {
    if (trackLeftRef.current) {
      stepSpin(trackLeftRef.current, 'z', trackLeft.state.current, 3, delta, reducedMotion);
      stepHoverScale(trackLeftRef.current, trackLeft.state.current.active, reducedMotion, 1.05);
    }
    if (trackRightRef.current) {
      stepSpin(trackRightRef.current, 'z', trackRight.state.current, 3, delta, reducedMotion);
      stepHoverScale(trackRightRef.current, trackRight.state.current.active, reducedMotion, 1.05);
    }
    if (boomRef.current) {
      stepHinge(boomRef.current, 'x', boom.state.current, -0.5, delta, reducedMotion);
      stepHoverScale(boomRef.current, boom.state.current.active, reducedMotion, 1.05);
    }
    if (cabinRef.current) stepHoverScale(cabinRef.current, cabin.state.current.active, reducedMotion, 1.06);
    if (windowRef.current) {
      const mat = windowRef.current.material as THREE.MeshStandardMaterial;
      stepHoverGlow(mat, cabin.state.current.active, reducedMotion, GLOW_BASE, GLOW_HOVER);
    }
  });

  return (
    <>
      <mesh position={[0, -0.85, 0]}>
        <boxGeometry args={[2.2, 0.5, 1.3]} />
        <meshStandardMaterial {...BODY_DARK_MATERIAL} />
      </mesh>
      <mesh ref={trackLeftRef} position={[-0.85, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]} {...trackLeft.handlers}>
        <cylinderGeometry args={[0.42, 0.42, 2.0, 16]} />
        <meshStandardMaterial {...TRIM_MATERIAL} />
      </mesh>
      <mesh ref={trackRightRef} position={[0.85, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]} {...trackRight.handlers}>
        <cylinderGeometry args={[0.42, 0.42, 2.0, 16]} />
        <meshStandardMaterial {...TRIM_MATERIAL} />
      </mesh>
      <group ref={cabinRef} position={[-0.3, 0.05, 0]} {...cabin.handlers}>
        <mesh>
          <boxGeometry args={[1.1, 0.85, 1.1]} />
          <meshStandardMaterial {...BODY_MATERIAL} />
        </mesh>
        <mesh ref={windowRef} position={[0.25, 0.1, 0.56]}>
          <boxGeometry args={[0.5, 0.4, 0.04]} />
          <meshStandardMaterial color={COLOR_ACCENT} emissive={COLOR_ACCENT} emissiveIntensity={GLOW_BASE} roughness={0.2} metalness={0.1} />
        </mesh>
      </group>
      <group ref={boomRef} position={[0.3, 0.35, 0]} {...boom.handlers}>
        <mesh position={[0.75, 0.25, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[1.5, 0.22, 0.22]} />
          <meshStandardMaterial {...TRIM_MATERIAL} />
        </mesh>
        <mesh position={[1.5, 0.75, 0]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[1.1, 0.18, 0.18]} />
          <meshStandardMaterial {...TRIM_MATERIAL} />
        </mesh>
        <mesh position={[1.9, 1.05, 0]} rotation={[0, 0, 1.9]}>
          <boxGeometry args={[0.5, 0.35, 0.5]} />
          <meshStandardMaterial {...BODY_MATERIAL} />
        </mesh>
      </group>
    </>
  );
}

function SemiTruckBody({ isTouch, reducedMotion }: InteractionProps) {
  const cabRef = useRef<THREE.Group>(null);
  const headlightRef = useRef<THREE.Mesh>(null);
  const cab = usePartState(isTouch);

  useFrame((_, delta) => {
    void delta;
    if (cabRef.current) stepHoverScale(cabRef.current, cab.state.current.active, reducedMotion, 1.06);
    if (headlightRef.current) {
      const mat = headlightRef.current.material as THREE.MeshStandardMaterial;
      stepHoverGlow(mat, cab.state.current.active, reducedMotion, GLOW_BASE, GLOW_HOVER);
    }
  });

  return (
    <>
      <group ref={cabRef} position={[-1.1, -0.15, 0]} {...cab.handlers}>
        <mesh>
          <boxGeometry args={[1.0, 1.0, 1.1]} />
          <meshStandardMaterial {...BODY_MATERIAL} />
        </mesh>
        <mesh ref={headlightRef} position={[0, 0.3, 0.57]}>
          <boxGeometry args={[0.55, 0.4, 0.04]} />
          <meshStandardMaterial color={COLOR_ACCENT} emissive={COLOR_ACCENT} emissiveIntensity={GLOW_BASE} roughness={0.2} metalness={0.1} />
        </mesh>
      </group>
      <mesh position={[0.6, -0.05, 0]}>
        <boxGeometry args={[2.4, 1.2, 1.15]} />
        <meshStandardMaterial {...BODY_DARK_MATERIAL} />
      </mesh>
      <mesh position={[0.6, -0.05, 0.581]}>
        <boxGeometry args={[2.2, 0.08, 0.02]} />
        <meshStandardMaterial color={COLOR_ACCENT} emissive={COLOR_ACCENT} emissiveIntensity={0.1} />
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

function OvenBody({ isTouch, reducedMotion }: InteractionProps) {
  const doorRef = useRef<THREE.Group>(null);
  const handleRef = useRef<THREE.Mesh>(null);
  const doorState = usePartState(isTouch);

  useFrame((_, delta) => {
    if (!doorRef.current) return;
    stepHinge(doorRef.current, 'x', doorState.state.current, 1.1, delta, reducedMotion);
    stepHoverScale(doorRef.current, doorState.state.current.active, reducedMotion, 1.04);
    if (handleRef.current) {
      const mat = handleRef.current.material as THREE.MeshStandardMaterial;
      stepHoverGlow(mat, doorState.state.current.active, reducedMotion, GLOW_BASE, GLOW_HOVER);
    }
  });

  const burnerPositions: [number, number][] = [
    [-0.55, 0.32],
    [0.05, 0.32],
    [-0.55, -0.32],
    [0.05, -0.32],
  ];

  return (
    <>
      {/* wide range body, lighter than background for visual prominence */}
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[2.3, 1.0, 1.0]} />
        <meshStandardMaterial {...BODY_MATERIAL} />
      </mesh>
      {/* control panel header, sits above the door and below the cooktop edge */}
      <mesh position={[0, 0.06, 0.51]}>
        <boxGeometry args={[2.2, 0.18, 0.02]} />
        <meshStandardMaterial {...TRIM_MATERIAL} />
      </mesh>
      {/* stovetop burners */}
      {burnerPositions.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.165, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.03, 20]} />
          <meshStandardMaterial color={COLOR_ACCENT} emissive={COLOR_ACCENT} emissiveIntensity={0.12} roughness={0.3} metalness={0.4} />
        </mesh>
      ))}
      {/* overhead exhaust hood, mirrors the excavator boom's reach for visual weight */}
      <mesh position={[-0.9, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.7, 10]} />
        <meshStandardMaterial {...TRIM_MATERIAL} />
      </mesh>
      <mesh position={[0.9, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.7, 10]} />
        <meshStandardMaterial {...TRIM_MATERIAL} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[2.6, 0.22, 1.05]} />
        <meshStandardMaterial {...BODY_DARK_MATERIAL} />
      </mesh>
      {/* hinged oven door, swings down and out from its bottom edge */}
      <group ref={doorRef} position={[0, -0.85, 0.51]} {...doorState.handlers}>
        <mesh position={[0, 0.41, 0.03]}>
          <boxGeometry args={[1.9, 0.82, 0.06]} />
          <meshStandardMaterial {...BODY_DARK_MATERIAL} />
        </mesh>
        <mesh ref={handleRef} position={[0, 0.7, 0.08]}>
          <boxGeometry args={[1.5, 0.06, 0.06]} />
          <meshStandardMaterial color={COLOR_ACCENT} emissive={COLOR_ACCENT} emissiveIntensity={GLOW_BASE} roughness={0.2} metalness={0.1} />
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
      {industry === 'restaurant' && <OvenBody isTouch={isTouch} reducedMotion={reducedMotion} />}
    </group>
  );
}
