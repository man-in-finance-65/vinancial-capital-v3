import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { MACHINES, type IndustryKey } from '../../config/machines';
import { MachineModel } from './MachineModel';
import { PlaceholderMachine } from './PlaceholderMachine';
import { ThreeErrorBoundary } from './ErrorBoundary';

function Poster({ industry }: { industry: IndustryKey }) {
  return (
    <img
      src={MACHINES[industry].posterPath}
      alt=""
      aria-hidden="true"
      className="h-full w-full object-contain"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}

export function HeroScene({ industry, reducedMotion }: { industry: IndustryKey; reducedMotion: boolean }) {
  const config = MACHINES[industry];
  const pointer = useRef({ x: 0, y: 0 });
  const dragRotationRef = useRef(0);
  const dragStartX = useRef<number | null>(null);
  const dragStartRotation = useRef(0);
  const [isTouch] = useState(() => typeof window !== 'undefined' && 'ontouchstart' in window);

  if (reducedMotion) {
    return <Poster industry={industry} />;
  }

  function onPointerMoveContainer(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    };
  }

  function onTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    dragStartX.current = e.touches[0].clientX;
    dragStartRotation.current = dragRotationRef.current;
  }

  function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    if (dragStartX.current === null) return;
    const delta = e.touches[0].clientX - dragStartX.current;
    const rotation = dragStartRotation.current + delta * 0.01;
    dragRotationRef.current = Math.max(-0.8, Math.min(0.8, rotation));
  }

  function onTouchEnd() {
    dragStartX.current = null;
  }

  return (
    <div
      className="h-full w-full touch-pan-y"
      onPointerMove={onPointerMoveContainer}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Canvas
        camera={{ position: config.cameraPosition, fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} />
        <directionalLight position={[-4, 2, -3]} intensity={0.35} color="#86D2F3" />
        {/* Studio reflections for the metal/glass materials, generated locally (no HDR download). */}
        <Environment resolution={256}>
          <Lightformer intensity={2} position={[0, 5, -2]} scale={[10, 2, 1]} />
          <Lightformer intensity={1.5} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
          <Lightformer intensity={1} color="#86D2F3" position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
          <Lightformer intensity={0.6} position={[0, -3, 3]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        </Environment>
        {/* Real .glb models load here. Until they exist in public/models, this falls back
            to a stylized procedural placeholder — same interactivity, no external files. */}
        <ThreeErrorBoundary
          fallback={
            <PlaceholderMachine industry={industry} pointerRef={pointer} isTouch={isTouch} reducedMotion={reducedMotion} dragRotationRef={dragRotationRef} />
          }
        >
          <Suspense
            fallback={
              <PlaceholderMachine industry={industry} pointerRef={pointer} isTouch={isTouch} reducedMotion={reducedMotion} dragRotationRef={dragRotationRef} />
            }
          >
            <MachineModel config={config} pointerRef={pointer} isTouch={isTouch} reducedMotion={reducedMotion} dragRotationRef={dragRotationRef} />
          </Suspense>
        </ThreeErrorBoundary>
        <ContactShadows position={[0, -1.1, 0]} opacity={0.45} scale={10} blur={2.4} far={2} />
      </Canvas>
    </div>
  );
}
