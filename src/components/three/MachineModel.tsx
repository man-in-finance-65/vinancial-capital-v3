import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { logGLTFNodeNames, type MachineConfig } from '../../config/machines';

type PartRuntime = {
  active: boolean;
  angle: number;
  spinAngle: number;
};

export function MachineModel({
  config,
  pointerRef,
  isTouch,
  reducedMotion,
  dragRotationRef,
}: {
  config: MachineConfig;
  pointerRef: { current: { x: number; y: number } };
  isTouch: boolean;
  reducedMotion: boolean;
  dragRotationRef: { current: number };
}) {
  const { scene } = useGLTF(config.modelPath);
  const groupRef = useRef<THREE.Group>(null);
  const hoveredNode = useRef<string | null>(null);
  const touchTimers = useRef<Record<string, number>>({});
  const runtime = useRef<Record<string, PartRuntime>>({});
  const nodeRefs = useRef<Record<string, THREE.Object3D>>({});
  const baseRotations = useRef<Record<string, THREE.Euler>>({});

  const partsByName = useMemo(() => {
    const map: Record<string, MachineConfig['parts'][number]> = {};
    for (const part of config.parts) map[part.nodeName] = part;
    return map;
  }, [config]);

  useEffect(() => {
    logGLTFNodeNames(scene);
    scene.traverse((obj) => {
      if (partsByName[obj.name]) {
        nodeRefs.current[obj.name] = obj;
        baseRotations.current[obj.name] = obj.rotation.clone();
        runtime.current[obj.name] = { active: false, angle: 0, spinAngle: 0 };
      }
    });
  }, [scene, partsByName]);

  function setActive(nodeName: string, active: boolean) {
    if (!runtime.current[nodeName]) return;
    runtime.current[nodeName].active = active;
  }

  function handlePointerMove(e: { object: THREE.Object3D; stopPropagation: () => void }) {
    if (isTouch || reducedMotion) return;
    const name = e.object.name;
    if (partsByName[name]) {
      if (hoveredNode.current !== name) {
        if (hoveredNode.current) setActive(hoveredNode.current, false);
        hoveredNode.current = name;
        setActive(name, true);
        document.body.style.cursor = 'pointer';
      }
    }
  }

  function handlePointerOut() {
    if (hoveredNode.current) {
      setActive(hoveredNode.current, false);
      hoveredNode.current = null;
    }
    document.body.style.cursor = 'auto';
  }

  function handlePointerDown(e: { object: THREE.Object3D; stopPropagation: () => void }) {
    if (!isTouch || reducedMotion) return;
    const name = e.object.name;
    if (!partsByName[name]) return;
    setActive(name, true);
    window.clearTimeout(touchTimers.current[name]);
    touchTimers.current[name] = window.setTimeout(() => setActive(name, false), 1200);
  }

  useFrame((_, delta) => {
    for (const [name, part] of Object.entries(partsByName)) {
      const node = nodeRefs.current[name];
      const state = runtime.current[name];
      const base = baseRotations.current[name];
      if (!node || !state || !base) continue;

      if (part.motion.kind === 'spin') {
        const targetSpeed = state.active ? part.motion.speed : 0;
        const currentSpeed = (state as PartRuntime & { currentSpeed?: number }).currentSpeed ?? 0;
        const nextSpeed = THREE.MathUtils.lerp(currentSpeed, targetSpeed, reducedMotion ? 1 : 0.08);
        (state as PartRuntime & { currentSpeed?: number }).currentSpeed = nextSpeed;
        state.spinAngle += nextSpeed * delta;
        node.rotation[part.motion.axis] = base[part.motion.axis] + state.spinAngle;
      } else {
        const target = state.active ? part.motion.maxAngle : 0;
        state.angle = THREE.MathUtils.lerp(state.angle, target, reducedMotion ? 1 : 0.08);
        node.rotation[part.motion.axis] = base[part.motion.axis] + state.angle;
      }
    }

    if (groupRef.current && !reducedMotion) {
      if (!isTouch) {
        const targetY = pointerRef.current.x * THREE.MathUtils.degToRad(6);
        const targetX = -pointerRef.current.y * THREE.MathUtils.degToRad(3);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.06);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.06);
      } else {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, dragRotationRef.current, 0.15);
      }
      groupRef.current.rotation.y += THREE.MathUtils.degToRad(4) * delta;
    }
  });

  return (
    <group ref={groupRef} scale={config.scale}>
      <primitive
        object={scene}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
      />
    </group>
  );
}

export function preloadMachine(modelPath: string) {
  useGLTF.preload(modelPath);
}
