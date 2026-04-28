import React from 'react';
import { Scene } from './components/Scene';
import { ExercisePanel } from './components/ExercisePanel';
import { SEO } from './components/SEO';
import { useExerciseStore } from './hooks/useExercise';

function App() {
  const selectedExercise = useExerciseStore((state) => state.selectedExercise);

  return (
    <div className="h-screen w-full bg-background flex overflow-hidden">
      <SEO />
      {/* 3D Scene Container */}
      <div className="flex-1 relative">
        <Scene />
        
        {/* Top Header */}
        <div className="absolute top-8 left-8 z-10 pointer-events-none">
          <h1 className="text-4xl font-black text-white/90 tracking-tighter uppercase italic leading-none">
            Calisteni<br/>
            <span className="text-primary">app</span>
          </h1>
        </div>

        {/* Bottom Status Bar */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none z-10">
          <div className="bg-surface/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5 pointer-events-auto">
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1 font-bold">Enfoque Actual</p>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              {selectedExercise ? selectedExercise.name : 'Modo de Espera'}
            </h2>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-mono">
              SISTEMA v1.0.0 // ACTIVO
            </p>
          </div>
        </div>
      </div>

      {/* Side Control Panel */}
      <ExercisePanel />
    </div>
  );
}

export default App;
