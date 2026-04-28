import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExerciseStore } from '../hooks/useExercise';
import { getMuscleFromMeshName } from '../utils/muscleMap';
import muscles from '../data/muscles.json';

export function HumanModel(props) {
  const group = useRef();
  const [hovered, setHovered] = useState(false);
  
  // PRIMARY MODEL: In production, this will load from public/models/human.glb
  const modelPath = '/models/human.glb'; 
  
  const { nodes, animations } = useGLTF(modelPath, false, (err) => {
    // Fallback handled by the logic below if nodes is empty
  });
  
  const { actions } = useAnimations(animations, group);
  
  const selectedMuscle = useExerciseStore((state) => state.selectedMuscle);
  const selectedExercise = useExerciseStore((state) => state.selectedExercise);
  const isPlaying = useExerciseStore((state) => state.isPlaying);
  const animationSpeed = useExerciseStore((state) => state.animationSpeed);
  const setSelectedMuscle = useExerciseStore((state) => state.setSelectedMuscle);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  useEffect(() => {
    if (selectedExercise && actions[selectedExercise.animation]) {
      const action = actions[selectedExercise.animation];
      action.reset().fadeIn(0.5).play();
      action.setEffectiveTimeScale(animationSpeed);
      return () => action.fadeOut(0.5);
    }
  }, [selectedExercise, actions, animationSpeed]);

  useFrame((state) => {
    if (!group.current) return;
    
    group.current.traverse((child) => {
      if (child.isMesh) {
        const muscleId = getMuscleFromMeshName(child.name);
        let targetColor = new THREE.Color('#222222');
        let emissiveIntensity = 0.1;

        if (selectedMuscle && muscleId === selectedMuscle.id) {
          targetColor = new THREE.Color('#00a3ff');
          emissiveIntensity = 2.0;
        }

        if (selectedExercise && selectedExercise.muscles.includes(muscleId)) {
          const pulse = isPlaying ? Math.sin(state.clock.elapsedTime * 8) * 0.5 + 0.5 : 1;
          targetColor = new THREE.Color('#ff4d00');
          emissiveIntensity = 3.0 * pulse;
        }

        if (child.material) {
          if (!child.material.emissive) child.material.emissive = new THREE.Color(0,0,0);
          child.material.emissive.lerp(targetColor, 0.1);
          child.material.emissiveIntensity = THREE.MathUtils.lerp(child.material.emissiveIntensity, emissiveIntensity, 0.1);
          
          // Add a sleek metallic look to everything
          child.material.metalness = 0.9;
          child.material.roughness = 0.1;
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

  // If no GLTF nodes found, render a high-quality "Digital Body" placeholder
  if (!nodes || Object.keys(nodes).length <= 1) {
    return (
      <group 
        ref={group} 
        {...props} 
        onPointerDown={handlePointerDown}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh name="torso_front" position={[0, 1.2, 0.05]}>
          <boxGeometry args={[0.6, 0.8, 0.2]} />
          <meshStandardMaterial color="#111" metalness={1} roughness={0} />
        </mesh>
        <mesh name="torso_back" position={[0, 1.2, -0.05]}>
          <boxGeometry args={[0.6, 0.8, 0.2]} />
          <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
        </mesh>
        <mesh name="head" position={[0, 1.75, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color="#111" metalness={1} roughness={0} />
        </mesh>
        <mesh name="thigh_front_L" position={[-0.18, 0.5, 0]}>
          <capsuleGeometry args={[0.1, 0.6, 4, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
        </mesh>
        <mesh name="thigh_front_R" position={[0.18, 0.5, 0]}>
          <capsuleGeometry args={[0.1, 0.6, 4, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
        </mesh>
        <mesh name="upper_arm_front_L" position={[-0.4, 1.3, 0]}>
          <capsuleGeometry args={[0.08, 0.5, 4, 16]} />
          <meshStandardMaterial color="#111" metalness={1} roughness={0} />
        </mesh>
        <mesh name="upper_arm_front_R" position={[0.35, 1.3, 0]}>
          <capsuleGeometry args={[0.08, 0.5, 4, 16]} />
          <meshStandardMaterial color="#111" metalness={1} roughness={0} />
        </mesh>
      </group>
    );
  }

  return (
    <group 
      ref={group} 
      {...props} 
      dispose={null} 
      onPointerDown={handlePointerDown}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
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

useGLTF.preload('/models/human.glb');
