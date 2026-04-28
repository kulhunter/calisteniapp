import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExerciseStore } from '../hooks/useExercise';
import { getMuscleFromMeshName } from '../utils/muscleMap';
import muscles from '../data/muscles.json';

export function HumanModel(props) {
  const group = useRef();
  
  // For MVP, we'll default to the primitive model if no path is provided or load fails
  const modelPath = null; 
  
  const { nodes, animations } = modelPath ? useGLTF(modelPath) : { nodes: {}, animations: [] };
  const { actions } = useAnimations(animations, group);
  
  const selectedMuscle = useExerciseStore((state) => state.selectedMuscle);
  const selectedExercise = useExerciseStore((state) => state.selectedExercise);
  const isPlaying = useExerciseStore((state) => state.isPlaying);
  const animationSpeed = useExerciseStore((state) => state.animationSpeed);
  const setSelectedMuscle = useExerciseStore((state) => state.setSelectedMuscle);

  useEffect(() => {
    if (selectedExercise && actions[selectedExercise.animation]) {
      const action = actions[selectedExercise.animation];
      action.reset().fadeIn(0.5).play();
      action.setEffectiveTimeScale(animationSpeed);
      return () => action.fadeOut(0.5);
    }
  }, [selectedExercise, actions, animationSpeed]);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach(action => {
        action.paused = !isPlaying;
      });
    }
  }, [isPlaying, actions]);

  useFrame((state) => {
    if (!group.current) return;
    
    group.current.traverse((child) => {
      if (child.isMesh) {
        const muscleId = getMuscleFromMeshName(child.name);
        let targetColor = new THREE.Color('#444444');
        let emissiveIntensity = 0.1;

        if (selectedMuscle && muscleId === selectedMuscle.id) {
          targetColor = new THREE.Color('#ff4d4d');
          emissiveIntensity = 1.0;
        }

        if (selectedExercise && selectedExercise.muscles.includes(muscleId)) {
          const pulse = isPlaying ? Math.sin(state.clock.elapsedTime * 5) * 0.5 + 0.5 : 1;
          targetColor = new THREE.Color('#ff9800');
          emissiveIntensity = 1.5 * pulse;
        }

        if (child.material) {
          if (!child.material.emissive) child.material.emissive = new THREE.Color(0,0,0);
          child.material.emissive.lerp(targetColor, 0.1);
          child.material.emissiveIntensity = THREE.MathUtils.lerp(child.material.emissiveIntensity, emissiveIntensity, 0.1);
        }
      }
    });
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    const muscleId = getMuscleFromMeshName(e.object.name);
    if (muscleId) {
      const muscle = muscles.find(m => m.id === muscleId);
      if (muscle) setSelectedMuscle(muscle);
    }
  };

  if (Object.keys(nodes).length === 0) {
    return (
      <group ref={group} {...props} onPointerDown={handlePointerDown}>
        {/* Torso Front (Chest/Abs) */}
        <mesh name="torso_front" position={[0, 1.2, 0.05]}>
          <boxGeometry args={[0.5, 0.7, 0.15]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        {/* Torso Back (Back) */}
        <mesh name="torso_back" position={[0, 1.2, -0.05]}>
          <boxGeometry args={[0.5, 0.7, 0.15]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh name="head" position={[0, 1.7, 0]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        <mesh name="thigh_front_L" position={[-0.15, 0.5, 0]}>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh name="thigh_front_R" position={[0.15, 0.5, 0]}>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh name="buttock_L" position={[-0.15, 0.85, -0.12]}>
          <boxGeometry args={[0.22, 0.3, 0.1]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        <mesh name="buttock_R" position={[0.15, 0.85, -0.12]}>
          <boxGeometry args={[0.22, 0.3, 0.1]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        <mesh name="upper_arm_front_L" position={[-0.35, 1.3, 0.05]}>
          <boxGeometry args={[0.12, 0.4, 0.1]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        <mesh name="upper_arm_front_R" position={[0.35, 1.3, 0.05]}>
          <boxGeometry args={[0.12, 0.4, 0.1]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        <mesh name="upper_arm_back_L" position={[-0.35, 1.3, -0.05]}>
          <boxGeometry args={[0.12, 0.4, 0.1]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh name="upper_arm_back_R" position={[0.35, 1.3, -0.05]}>
          <boxGeometry args={[0.12, 0.4, 0.1]} />
          <meshStandardMaterial color="#555" />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={group} {...props} dispose={null} onPointerDown={handlePointerDown}>
      {Object.keys(nodes).map((key) => {
        const node = nodes[key];
        if (node.isMesh) {
          return <primitive key={key} object={node} material={node.material.clone()} />;
        }
        return null;
      })}
    </group>
  );
}
