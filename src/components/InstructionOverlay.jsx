import React from 'react';
import { Html } from '@react-three/drei';
import { useExerciseStore } from '../hooks/useExercise';
import { useThree } from '@react-three/fiber';

export function InstructionOverlay() {
  const selectedExercise = useExerciseStore((state) => state.selectedExercise);
  const { scene } = useThree();

  if (!selectedExercise) return null;

  return (
    <>
      {selectedExercise.instructions.map((inst, i) => {
        // Find target mesh/bone in scene to attach label to
        const target = scene.getObjectByName(inst.target);
        if (!target) return null;

        return (
          <Html key={i} object={target} position={[0, 0, 0]} center distanceFactor={10}>
            <div className="bg-black/80 backdrop-blur-sm border border-white/20 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap pointer-events-none animate-bounce">
              {inst.text}
            </div>
          </Html>
        );
      })}
    </>
  );
}
