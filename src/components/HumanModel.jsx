import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExerciseStore } from '../hooks/useExercise';
import { getMuscleFromMeshName } from '../utils/muscleMap';

export function HumanModel(props) {
  const wholeModel = useRef();
  const spine = useRef();
  const chest = useRef();
  const headRef = useRef();
  
  const shoulderL = useRef();
  const shoulderR = useRef();
  const elbowL = useRef();
  const elbowR = useRef();
  
  const hipL = useRef();
  const hipR = useRef();
  const kneeL = useRef();
  const kneeR = useRef();

  const selectedMuscle = useExerciseStore((state) => state.selectedMuscle);
  const selectedExercise = useExerciseStore((state) => state.selectedExercise);
  const isPlaying = useExerciseStore((state) => state.isPlaying);
  const animationSpeed = useExerciseStore((state) => state.animationSpeed);
  const setSelectedMuscle = useExerciseStore((state) => state.setSelectedMuscle);

  const timeRef = useRef(0);

  // Default clean Pose values (called to reset)
  const resetJoints = () => {
    if (!wholeModel.current) return;
    
    wholeModel.current.position.set(0, -1.2, 0);
    wholeModel.current.rotation.set(0, 0, 0);
    
    if (spine.current) spine.current.rotation.set(0, 0, 0);
    if (chest.current) chest.current.rotation.set(0, 0, 0);
    if (headRef.current) headRef.current.rotation.set(0, 0, 0);
    
    if (shoulderL.current) shoulderL.current.rotation.set(0, 0, -0.2);
    if (shoulderR.current) shoulderR.current.rotation.set(0, 0, 0.2);
    
    if (elbowL.current) elbowL.current.rotation.set(0, 0, 0);
    if (elbowR.current) elbowR.current.rotation.set(0, 0, 0);
    
    if (hipL.current) hipL.current.rotation.set(0, 0, 0);
    if (hipR.current) hipR.current.rotation.set(0, 0, 0);
    
    if (kneeL.current) kneeL.current.rotation.set(0, 0, 0);
    if (kneeR.current) kneeR.current.rotation.set(0, 0, 0);
  };

  // Math equations for exercise loops
  const animateSquat = (t) => {
    const cycle = (Math.sin(t * 1.5) + 1) / 2; // 0 to 1 and back to 0
    
    // Lower hips
    wholeModel.current.position.y = -1.2 - 0.45 * cycle;
    wholeModel.current.position.z = -0.15 * cycle; // slide back slightly
    
    // Tilt spine/chest forward
    if (spine.current) spine.current.rotation.x = 0.38 * cycle;
    if (chest.current) chest.current.rotation.x = 0.12 * cycle;
    
    // Bend Hips
    if (hipL.current) hipL.current.rotation.x = -1.0 * cycle;
    if (hipR.current) hipR.current.rotation.x = -1.0 * cycle;
    
    // Bend Knees
    if (kneeL.current) kneeL.current.rotation.x = 1.95 * cycle;
    if (kneeR.current) kneeR.current.rotation.x = 1.95 * cycle;
    
    // Balance arms forward
    if (shoulderL.current) {
      shoulderL.current.rotation.x = -1.1 * cycle;
      shoulderL.current.rotation.z = -0.1 * (1 - cycle) - 0.2 * cycle;
    }
    if (shoulderR.current) {
      shoulderR.current.rotation.x = -1.1 * cycle;
      shoulderR.current.rotation.z = 0.1 * (1 - cycle) + 0.2 * cycle;
    }
    if (elbowL.current) elbowL.current.rotation.x = 0.2 * cycle;
    if (elbowR.current) elbowR.current.rotation.x = 0.2 * cycle;
  };

  const animatePushup = (t) => {
    const cycle = (Math.sin(t * 1.8) + 1) / 2; // 0 is top, 1 is chest on ground
    
    // Place model horizontal, looking forward
    wholeModel.current.rotation.x = -Math.PI / 2.3;
    wholeModel.current.position.y = -0.7 - 0.35 * cycle;
    wholeModel.current.position.z = -0.4;
    
    // Retract spine slightly
    if (spine.current) spine.current.rotation.x = -0.05 * cycle;
    
    // Rotate Shoulders outward
    if (shoulderL.current) {
      shoulderL.current.rotation.x = -0.2 * cycle;
      shoulderL.current.rotation.y = -0.4 * cycle;
      shoulderL.current.rotation.z = -0.15 * cycle;
    }
    if (shoulderR.current) {
      shoulderR.current.rotation.x = -0.2 * cycle;
      shoulderR.current.rotation.y = 0.4 * cycle;
      shoulderR.current.rotation.z = 0.15 * cycle;
    }
    
    // Bend Elbows out/back
    if (elbowL.current) elbowL.current.rotation.y = -1.25 * cycle;
    if (elbowR.current) elbowR.current.rotation.y = 1.25 * cycle;
    
    // Look up/forward
    if (headRef.current) headRef.current.rotation.x = 0.25 + 0.15 * cycle;
  };

  const animatePullup = (t) => {
    const cycle = (Math.sin(t * 1.4) + 1) / 2; // 0 is hang, 1 is chin-up
    
    // Move up
    wholeModel.current.position.y = -1.4 + 0.7 * cycle;
    
    // Arms up and pulling
    if (shoulderL.current) {
      shoulderL.current.rotation.z = Math.PI - 0.45 * (1 - cycle) - 0.75 * cycle;
      shoulderL.current.rotation.y = 0.2 * cycle;
    }
    if (shoulderR.current) {
      shoulderR.current.rotation.z = -Math.PI + 0.45 * (1 - cycle) + 0.75 * cycle;
      shoulderR.current.rotation.y = -0.2 * cycle;
    }
    
    // Bend elbows
    if (elbowL.current) elbowL.current.rotation.x = 1.7 * cycle;
    if (elbowR.current) elbowR.current.rotation.x = 1.7 * cycle;
    
    // Arch spine at top
    if (spine.current) spine.current.rotation.x = -0.22 * cycle;
    
    // Bend knees slightly back
    if (kneeL.current) kneeL.current.rotation.x = 0.4 * cycle;
    if (kneeR.current) kneeR.current.rotation.x = 0.4 * cycle;
  };

  const animateDip = (t) => {
    const cycle = (Math.sin(t * 1.8) + 1) / 2; // 0 is top support, 1 is 90° dip
    
    // Lower body
    wholeModel.current.position.y = -0.9 - 0.35 * cycle;
    
    // Bend elbows back
    if (elbowL.current) elbowL.current.rotation.x = -1.35 * cycle;
    if (elbowR.current) elbowR.current.rotation.x = -1.35 * cycle;
    
    if (shoulderL.current) {
      shoulderL.current.rotation.x = 0.35 * cycle;
      shoulderL.current.rotation.z = -0.2 * cycle;
    }
    if (shoulderR.current) {
      shoulderR.current.rotation.x = 0.35 * cycle;
      shoulderR.current.rotation.z = 0.2 * cycle;
    }
    
    // Keep knees bent behind
    if (hipL.current) hipL.current.rotation.x = 0.2;
    if (hipR.current) hipR.current.rotation.x = 0.2;
    if (kneeL.current) kneeL.current.rotation.x = 0.9 * (1 - cycle) + 1.2 * cycle;
    if (kneeR.current) kneeR.current.rotation.x = 0.9 * (1 - cycle) + 1.2 * cycle;
  };

  const animatePlank = (t) => {
    // Plank is static but has core shaking
    const shake = Math.sin(t * 38) * 0.006;
    
    // Body is perfectly horizontal
    wholeModel.current.rotation.x = -Math.PI / 2.2;
    wholeModel.current.position.y = -0.9 + shake * 0.5;
    wholeModel.current.position.z = -0.4;
    
    // Forearm support: elbows bent 90 degrees
    if (shoulderL.current) {
      shoulderL.current.rotation.x = -Math.PI / 2.5;
      shoulderL.current.rotation.y = 0.1;
    }
    if (shoulderR.current) {
      shoulderR.current.rotation.x = -Math.PI / 2.5;
      shoulderR.current.rotation.y = -0.1;
    }
    
    if (elbowL.current) elbowL.current.rotation.x = 1.4;
    if (elbowR.current) elbowR.current.rotation.x = 1.4;
    
    // Tremble spine
    if (spine.current) spine.current.rotation.z = shake;
  };

  // Run updates on frame
  useFrame((state, delta) => {
    if (isPlaying) {
      timeRef.current += delta * animationSpeed;
    }
    
    // Always start by resetting
    resetJoints();

    if (selectedExercise) {
      const anim = selectedExercise.animation;
      if (anim === 'pushup') {
        animatePushup(timeRef.current);
      } else if (anim === 'squat') {
        animateSquat(timeRef.current);
      } else if (anim === 'pullup') {
        animatePullup(timeRef.current);
      } else if (anim === 'dip') {
        animateDip(timeRef.current);
      } else if (anim === 'plank') {
        animatePlank(timeRef.current);
      }
    }

    // Apply color/emissive shaders
    updateMuscleColors(state);
  });

  // Handle pointer down click to select muscles
  const handlePointerDown = (e) => {
    e.stopPropagation();
    const muscleId = getMuscleFromMeshName(e.object.name);
    if (muscleId) {
      import('../data/muscles.json').then((muscles) => {
        const muscle = muscles.default.find((m) => m.id === muscleId);
        if (muscle) setSelectedMuscle(muscle);
      });
    }
  };

  // Traverse model to color specific meshes
  const updateMuscleColors = (state) => {
    if (!wholeModel.current) return;
    
    const time = state.clock.elapsedTime;
    
    wholeModel.current.traverse((child) => {
      if (child.isMesh) {
        // Core joint connectors are stylized glass/dark
        if (
          child.name.startsWith('joint_') || 
          child.name === 'pelvis' || 
          child.name.includes('calf_') || 
          child.name.includes('forearm_')
        ) {
          if (child.material) {
            child.material.color.set('#0e0e14');
            child.material.emissive.set('#000000');
            child.material.emissiveIntensity = 0;
            child.material.roughness = 0.05;
            child.material.metalness = 0.95;
            child.material.transparent = true;
            child.material.opacity = 0.65;
          }
          return;
        }

        const muscleId = getMuscleFromMeshName(child.name);
        let colorStr = '#181822';
        let emissiveStr = '#000000';
        let emissiveIntensity = 0;
        let opacity = 0.8;

        if (muscleId) {
          if (selectedMuscle && muscleId === selectedMuscle.id) {
            // Selected muscle glows Emerald Green
            colorStr = '#00e676';
            emissiveStr = '#00e676';
            emissiveIntensity = 1.8;
            opacity = 1.0;
          } else if (selectedExercise) {
            if (selectedExercise.primary.includes(muscleId)) {
              // Primary glowing pulsating Red
              const pulse = isPlaying ? Math.sin(time * 7) * 0.4 + 1.2 : 1.3;
              colorStr = '#ff3b30';
              emissiveStr = '#ff3b30';
              emissiveIntensity = pulse;
              opacity = 1.0;
            } else if (selectedExercise.secondary.includes(muscleId)) {
              // Secondary glowing Orange
              colorStr = '#ff9f0a';
              emissiveStr = '#ff9f0a';
              emissiveIntensity = 0.85;
              opacity = 0.9;
            }
          }
        }

        if (child.material) {
          const targetColor = new THREE.Color(colorStr);
          const targetEmissive = new THREE.Color(emissiveStr);
          
          child.material.color.lerp(targetColor, 0.15);
          child.material.emissive.lerp(targetEmissive, 0.15);
          child.material.emissiveIntensity = THREE.MathUtils.lerp(child.material.emissiveIntensity, emissiveIntensity, 0.15);
          child.material.transparent = true;
          child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, opacity, 0.15);
          child.material.roughness = 0.15;
          child.material.metalness = 0.85;
        }
      }
    });
  };

  return (
    <group ref={wholeModel} {...props} dispose={null}>
      {/* PELVIS (Root structural node) */}
      <group name="hips" position={[0, 0.8, 0]}>
        <mesh name="pelvis" onPointerDown={handlePointerDown}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#0e0e14" />
        </mesh>
        
        {/* SPINE (Back / Core / Abs) */}
        <group ref={spine} name="spine" position={[0, 0.08, 0]}>
          <mesh name="abs_mesh" position={[0, 0.18, 0.045]} onPointerDown={handlePointerDown}>
            <boxGeometry args={[0.22, 0.28, 0.08]} />
            <meshStandardMaterial color="#181822" />
          </mesh>
          <mesh name="back_mesh" position={[0, 0.18, -0.045]} onPointerDown={handlePointerDown}>
            <boxGeometry args={[0.24, 0.28, 0.08]} />
            <meshStandardMaterial color="#181822" />
          </mesh>
          
          {/* CHEST */}
          <group ref={chest} name="chest" position={[0, 0.32, 0]}>
            <mesh name="chest_mesh" position={[0, 0.09, 0.05]} onPointerDown={handlePointerDown}>
              <boxGeometry args={[0.27, 0.16, 0.08]} />
              <meshStandardMaterial color="#181822" />
            </mesh>
            
            {/* HEAD */}
            <group ref={headRef} name="head" position={[0, 0.24, 0]}>
              <mesh name="head" onPointerDown={handlePointerDown}>
                <sphereGeometry args={[0.10, 16, 16]} />
                <meshStandardMaterial color="#181822" />
              </mesh>
            </group>
            
            {/* LEFT ARM */}
            <group ref={shoulderL} name="shoulder_L" position={[-0.17, 0.08, 0]}>
              <mesh name="joint_shoulder_L">
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#0e0e14" />
              </mesh>
              <group name="upper_arm_L" position={[0, -0.12, 0]}>
                <mesh name="upper_arm_front_L" onPointerDown={handlePointerDown}>
                  <capsuleGeometry args={[0.042, 0.15, 8, 16]} />
                  <meshStandardMaterial color="#181822" />
                </mesh>
                <mesh name="upper_arm_back_L" position={[0, 0, -0.01]} onPointerDown={handlePointerDown}>
                  <capsuleGeometry args={[0.04, 0.15, 8, 16]} />
                  <meshStandardMaterial color="#181822" />
                </mesh>
                
                {/* LEFT ELBOW */}
                <group ref={elbowL} name="elbow_L" position={[0, -0.12, 0]}>
                  <mesh name="joint_elbow_L">
                    <sphereGeometry args={[0.045, 16, 16]} />
                    <meshStandardMaterial color="#0e0e14" />
                  </mesh>
                  <mesh name="forearm_L" position={[0, -0.12, 0]}>
                    <capsuleGeometry args={[0.035, 0.16, 8, 16]} />
                    <meshStandardMaterial color="#0e0e14" />
                  </mesh>
                </group>
              </group>
            </group>

            {/* RIGHT ARM */}
            <group ref={shoulderR} name="shoulder_R" position={[0.17, 0.08, 0]}>
              <mesh name="joint_shoulder_R">
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#0e0e14" />
              </mesh>
              <group name="upper_arm_R" position={[0, -0.12, 0]}>
                <mesh name="upper_arm_front_R" onPointerDown={handlePointerDown}>
                  <capsuleGeometry args={[0.042, 0.15, 8, 16]} />
                  <meshStandardMaterial color="#181822" />
                </mesh>
                <mesh name="upper_arm_back_R" position={[0, 0, -0.01]} onPointerDown={handlePointerDown}>
                  <capsuleGeometry args={[0.04, 0.15, 8, 16]} />
                  <meshStandardMaterial color="#181822" />
                </mesh>
                
                {/* RIGHT ELBOW */}
                <group ref={elbowR} name="elbow_R" position={[0, -0.12, 0]}>
                  <mesh name="joint_elbow_R">
                    <sphereGeometry args={[0.045, 16, 16]} />
                    <meshStandardMaterial color="#0e0e14" />
                  </mesh>
                  <mesh name="forearm_R" position={[0, -0.12, 0]}>
                    <capsuleGeometry args={[0.035, 0.16, 8, 16]} />
                    <meshStandardMaterial color="#0e0e14" />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>

        {/* LEFT LEG */}
        <group ref={hipL} name="hip_L" position={[-0.10, -0.08, 0]}>
          <mesh name="joint_hip_L">
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#0e0e14" />
          </mesh>
          <group name="thigh_L" position={[0, -0.16, 0]}>
            <mesh name="thigh_front_L" onPointerDown={handlePointerDown}>
              <capsuleGeometry args={[0.06, 0.22, 8, 16]} />
              <meshStandardMaterial color="#181822" />
            </mesh>
            <mesh name="buttock_L" position={[0, 0.08, -0.05]} onPointerDown={handlePointerDown}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color="#181822" />
            </mesh>
            
            {/* LEFT KNEE */}
            <group ref={kneeL} name="knee_L" position={[0, -0.16, 0]}>
              <mesh name="joint_knee_L">
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="#0e0e14" />
              </mesh>
              <mesh name="calf_L" position={[0, -0.16, 0]}>
                <capsuleGeometry args={[0.045, 0.22, 8, 16]} />
                <meshStandardMaterial color="#0e0e14" />
              </mesh>
            </group>
          </group>
        </group>

        {/* RIGHT LEG */}
        <group ref={hipR} name="hip_R" position={[0.10, -0.08, 0]}>
          <mesh name="joint_hip_R">
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#0e0e14" />
          </mesh>
          <group name="thigh_R" position={[0, -0.16, 0]}>
            <mesh name="thigh_front_R" onPointerDown={handlePointerDown}>
              <capsuleGeometry args={[0.06, 0.22, 8, 16]} />
              <meshStandardMaterial color="#181822" />
            </mesh>
            <mesh name="buttock_R" position={[0, 0.08, -0.05]} onPointerDown={handlePointerDown}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color="#181822" />
            </mesh>
            
            {/* RIGHT KNEE */}
            <group ref={kneeR} name="knee_R" position={[0, -0.16, 0]}>
              <mesh name="joint_knee_R">
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="#0e0e14" />
              </mesh>
              <mesh name="calf_R" position={[0, -0.16, 0]}>
                <capsuleGeometry args={[0.045, 0.22, 8, 16]} />
                <meshStandardMaterial color="#0e0e14" />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
