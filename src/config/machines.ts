// Single source of truth for the hero's 3D machines.
// Fill in `nodeName` for each part once the real .glb files are in /public/models —
// use `logGLTFNodeNames` (dev only) to print every node name in a loaded model to the console.

export type IndustryKey = 'construction' | 'trucking' | 'restaurant';

export type PartMotion =
  | { kind: 'spin'; axis: 'x' | 'y' | 'z'; speed: number } // radians/sec while active
  | { kind: 'hinge'; axis: 'x' | 'y' | 'z'; maxAngle: number }; // radians, eases toward this while active

export type InteractivePart = {
  /** Node name inside the GLB. Placeholder until the real model is inspected. */
  nodeName: string;
  motion: PartMotion;
};

export type MachineConfig = {
  key: IndustryKey;
  modelPath: string;
  posterPath: string;
  cameraPosition: [number, number, number];
  scale: number;
  parts: InteractivePart[];
};

export const MACHINES: Record<IndustryKey, MachineConfig> = {
  construction: {
    key: 'construction',
    modelPath: '/models/excavator.glb',
    posterPath: '/models/construction.webp',
    cameraPosition: [4, 2.2, 5],
    scale: 1,
    parts: [
      { nodeName: 'TODO_track_left', motion: { kind: 'spin', axis: 'x', speed: 2 } },
      { nodeName: 'TODO_track_right', motion: { kind: 'spin', axis: 'x', speed: 2 } },
      { nodeName: 'TODO_arm', motion: { kind: 'hinge', axis: 'x', maxAngle: 0.5 } },
      { nodeName: 'TODO_bucket', motion: { kind: 'hinge', axis: 'x', maxAngle: 0.7 } },
    ],
  },
  trucking: {
    key: 'trucking',
    modelPath: '/models/semi-truck.glb',
    posterPath: '/models/trucking.webp',
    cameraPosition: [5, 1.6, 5],
    scale: 1,
    parts: [
      { nodeName: 'TODO_wheel_front_left', motion: { kind: 'spin', axis: 'x', speed: 2 } },
      { nodeName: 'TODO_wheel_front_right', motion: { kind: 'spin', axis: 'x', speed: 2 } },
      { nodeName: 'TODO_wheel_rear_left', motion: { kind: 'spin', axis: 'x', speed: 2 } },
      { nodeName: 'TODO_wheel_rear_right', motion: { kind: 'spin', axis: 'x', speed: 2 } },
    ],
  },
  restaurant: {
    key: 'restaurant',
    modelPath: '/models/walk-in-fridge.glb',
    posterPath: '/models/restaurant.webp',
    cameraPosition: [4, 1.8, 5],
    scale: 1,
    parts: [{ nodeName: 'TODO_door', motion: { kind: 'hinge', axis: 'y', maxAngle: 1.3 } }],
  },
};

export const INDUSTRY_ORDER: IndustryKey[] = ['construction', 'trucking', 'restaurant'];
export const AUTO_CYCLE_MS = 7000;

/** Dev-only helper: logs every node name in a loaded GLTF scene so you can fill in `nodeName` above. */
export function logGLTFNodeNames(scene: { traverse: (cb: (obj: { name: string; type: string }) => void) => void }) {
  if (!import.meta.env.DEV) return;
  const names: string[] = [];
  scene.traverse((obj) => {
    if (obj.name) names.push(`${obj.name} (${obj.type})`);
  });
  // eslint-disable-next-line no-console
  console.log('[Vinancial Capital] GLTF node names:\n' + names.join('\n'));
}
