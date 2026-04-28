import React from 'react';
import { useExerciseStore } from '../hooks/useExercise';
import exercises from '../data/exercises.json';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';

export function ExercisePanel() {
  const { 
    selectedMuscle, 
    selectedExercise, 
    setSelectedExercise, 
    isPlaying, 
    togglePlay, 
    animationSpeed, 
    setAnimationSpeed,
    reset 
  } = useExerciseStore();

  const filteredExercises = selectedMuscle 
    ? exercises.filter(ex => ex.muscles.includes(selectedMuscle.id))
    : [];

  return (
    <div className="w-80 bg-surface/80 backdrop-blur-md border-l border-white/10 p-6 flex flex-col gap-6 text-white overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Calisteniapp</h2>
        <button onClick={reset} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Resetear">
          <RotateCcw size={18} />
        </button>
      </div>

      {selectedMuscle ? (
        <div className="space-y-4">
          <div className="p-4 bg-primary/20 border border-primary/30 rounded-xl">
            <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">Músculo Seleccionado</p>
            <h3 className="text-lg font-semibold">{selectedMuscle.name}</h3>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-white/50 font-medium">Ejercicios Disponibles</p>
            {filteredExercises.length > 0 ? (
              filteredExercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExercise(ex)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedExercise?.id === ex.id 
                      ? 'bg-primary border-primary' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Activity size={16} />
                    <span className="font-medium">{ex.name}</span>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-white/30 italic">No se encontraron ejercicios para este músculo.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
          <Activity size={48} className="mb-4 text-primary" />
          <p className="text-sm">Haz clic en un músculo para ver los ejercicios relacionados</p>
        </div>
      )}

      {selectedExercise && (
        <div className="mt-auto pt-6 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause fill="black" /> : <Play fill="black" />}
            </button>
            <div className="flex-1 ml-4 space-y-1">
              <div className="flex justify-between text-xs text-white/50">
                <span>Velocidad</span>
                <span>{animationSpeed}x</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="2" 
                step="0.1" 
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-full accent-primary bg-white/10 rounded-lg appearance-none cursor-pointer h-1"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Instrucciones</p>
            <ul className="space-y-2">
              {selectedExercise.instructions.map((inst, i) => (
                <li key={i} className="text-sm flex gap-3 text-white/80">
                  <span className="text-primary">•</span>
                  {inst.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
