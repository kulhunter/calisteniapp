import React from 'react';
import routines from '../data/routines.json';
import { useExerciseStore } from '../hooks/useExercise';
import { Play, Clock, BarChart } from 'lucide-react';

export const RoutineSelector = () => {
  const { startRoutine } = useExerciseStore();

  return (
    <div className="w-full h-full p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-black mb-2 glow-text">Entrenamiento Guiado</h2>
        <p className="text-white/40 mb-12 max-w-2xl text-lg">
          No pienses, solo entrena. Elige una rutina orientada a tu objetivo de hoy y deja que la aplicación te guíe paso a paso.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map((routine) => (
            <div 
              key={routine.id}
              className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer group flex flex-col h-full"
              onClick={() => startRoutine(routine)}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,163,255,0.2)]">
                  <Play fill="currentColor" size={24} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-white/60">
                    <Clock size={12} /> {routine.duration}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
                    <BarChart size={12} /> {routine.level}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{routine.name}</h3>
              <p className="text-white/40 text-sm mb-6 flex-1">{routine.description}</p>
              
              <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-white/30 font-bold uppercase mb-2">Ejercicios ({routine.exercises.length})</p>
                <div className="flex gap-2">
                  {routine.exercises.map((ex, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-white/20"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
