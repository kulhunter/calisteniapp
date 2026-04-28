import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float } from '@react-three/drei';
import { HumanModel } from './HumanModel';
import { InstructionOverlay } from './InstructionOverlay';

export function Scene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
      <color attach="background" args={['#0a0a0a']} />
      
      <ambientLight intensity={1.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={1} />

      <Suspense fallback={null}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <HumanModel position={[0, -1, 0]} />
        </Float>
        <InstructionOverlay />
        <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2.5} far={2} />
        <Environment preset="city" />
      </Suspense>

      <OrbitControls 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.5} 
        enablePan={false}
      />
    </Canvas>
  );
}
