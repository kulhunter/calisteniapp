import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { HumanModel } from './HumanModel';
import { InstructionOverlay } from './InstructionOverlay';
import { useExerciseStore } from '../hooks/useExercise';

export function Scene() {
  const selectedExercise = useExerciseStore((state) => state.selectedExercise);

  return (
    <Canvas shadows camera={{ position: [0, 0.5, 3.8], fov: 45 }}>
      <color attach="background" args={['#060608']} />
      
      {/* Cinematic & Holographic Lights */}
      <ambientLight intensity={0.2} />
      
      {/* Front Key Light (Warm/Neutral) */}
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      
      {/* Cool Rim Light (Futuristic Cyan/Blue edge glow) */}
      <spotLight 
        position={[-5, 5, -5]} 
        angle={0.6} 
        penumbra={1} 
        intensity={2.5} 
        color="#00e676" 
      />
      
      {/* Warm Fill Light */}
      <pointLight position={[5, -2, 2]} intensity={0.4} color="#ff4d4d" />
      
      {/* Back Silhouette Light */}
      <pointLight position={[0, 4, -4]} intensity={1.5} color="#4d94ff" />

      <Suspense fallback={null}>
        {/* Holographic grid and helpers */}
        <gridHelper 
          args={[30, 30, '#ff4d4d', '#1a1a24']} 
          position={[0, -1.2, 0]} 
          rotation={[0, 0, 0]} 
        />
        
        {/* Secondary subtle radial rings */}
        <polarGridHelper 
          args={[6, 8, 2, 64, '#4d94ff', '#14141e']} 
          position={[0, -1.19, 0]} 
        />

        {/* The Mannequin Coach */}
        <HumanModel position={[0, -1.2, 0]} />
        
        <InstructionOverlay />
        
        <ContactShadows 
          position={[0, -1.19, 0]} 
          opacity={0.6} 
          scale={8} 
          blur={1.8} 
          far={2.5} 
        />
        
        <Environment preset="night" />
      </Suspense>

      <OrbitControls 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.7} 
        enablePan={false}
        enableZoom={true}
        minDistance={1.5}
        maxDistance={6}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}

