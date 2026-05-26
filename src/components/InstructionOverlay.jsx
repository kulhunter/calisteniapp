import React from 'react';
import { Html } from '@react-three/drei';
import { useExerciseStore } from '../hooks/useExercise';
import { useThree } from '@react-three/fiber';

const targetMapping = {
  spine: 'abs_mesh',
  chest: 'chest_mesh',
  head: 'head',
  back: 'back_mesh',
  abs: 'abs_mesh',
  knees: 'joint_knee_R',
  elbow: 'joint_elbow_R'
};

// Offsets to avoid overlapping label right on top of the limb
const offsetMapping = {
  spine: [0.35, 0, 0.1],
  chest: [0.38, 0.05, 0.15],
  head: [0.32, 0.1, 0.1],
  back: [-0.38, 0, -0.15],
  abs: [0.35, -0.05, 0.15],
  knees: [0.3, 0, 0.1],
  elbow: [0.3, 0, 0.1]
};

export function InstructionOverlay() {
  const selectedExercise = useExerciseStore((state) => state.selectedExercise);
  const { scene } = useThree();

  if (!selectedExercise) return null;

  return (
    <>
      {selectedExercise.instructions.map((inst, i) => {
        // Map logical target in JSON to actual Three.js object name
        const mappedName = targetMapping[inst.target] || inst.target;
        const target = scene.getObjectByName(mappedName);
        
        if (!target) return null;

        // Get custom offset or default to small right/front offset
        const offset = offsetMapping[inst.target] || [0.3, 0, 0.1];

        return (
          <Html 
            key={i} 
            object={target} 
            position={offset} 
            center 
            distanceFactor={3.5}
          >
            <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-md border border-primary/40 px-3 py-1.5 rounded-xl shadow-[0_0_15px_rgba(255,77,77,0.15)] whitespace-nowrap pointer-events-none transition-all duration-300 transform animate-[pulse_2s_infinite]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                {inst.text}
              </span>
            </div>
          </Html>
        );
      })}
    </>
  );
}
