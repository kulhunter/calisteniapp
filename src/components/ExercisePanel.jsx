import React from 'react';
import { useExerciseStore } from '../hooks/useExercise';
import exercises from '../data/exercises.json';
import musclesList from '../data/muscles.json';
import { Play, Pause, RotateCcw, Activity, ChevronRight, Zap, Target } from 'lucide-react';

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
    <div className="flex-1 flex flex-col gap-6 p-8 overflow-y-auto">
      
      {/* Selection Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="text-primary" size={18} />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">Enfoque</h2>
        </div>
        <button onClick={reset} className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-white/5" title="Resetear">
          <RotateCcw size={14} className="text-white/40" />
        </button>
      </div>

      {selectedMuscle ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="p-6 glass-panel border-l-4 border-l-primary rounded-2xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
            <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1 relative z-10">Músculo Seleccionado</p>
            <h3 className="text-2xl font-black glow-text relative z-10">{selectedMuscle.name}</h3>
            <p className="text-xs text-white/40 mt-2 leading-relaxed relative z-10">
              Explora ejercicios específicos para optimizar tu técnica en este grupo muscular.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Ejercicios Recomendados</p>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">{filteredExercises.length}</span>
            </div>
            
            <div className="space-y-3">
              {filteredExercises.length > 0 ? (
                filteredExercises.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group ${
                      selectedExercise?.id === ex.id 
                        ? 'bg-primary border-primary shadow-[0_0_20px_rgba(0,163,255,0.2)]' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          selectedExercise?.id === ex.id ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                        }`}>
                          <Zap size={18} className={selectedExercise?.id === ex.id ? 'text-white' : 'text-primary'} />
                        </div>
                        <div>
                          <span className={`block font-bold text-sm ${selectedExercise?.id === ex.id ? 'text-white' : 'text-white/90'}`}>{ex.name}</span>
                          <span className={`text-[10px] ${selectedExercise?.id === ex.id ? 'text-white/60' : 'text-white/30'}`}>Intermedio • 8-12 Reps</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className={selectedExercise?.id === ex.id ? 'text-white/60' : 'text-white/20'} />
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center glass-panel rounded-2xl border-dashed border-white/10">
                  <p className="text-sm text-white/30 italic">No se encontraron ejercicios.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-2 animate-in fade-in duration-500">
          <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 border border-primary/10">
            <Activity size={28} className="text-primary/40" />
          </div>
          <h3 className="text-lg font-bold mb-2">Selecciona un Músculo</h3>
          <p className="text-xs text-white/30 leading-relaxed max-w-[200px] mb-8">
            Haz clic en el modelo 3D o elige uno de la lista para ver los ejercicios.
          </p>
          
          <div className="w-full grid grid-cols-2 gap-2">
            {musclesList.map((muscle) => (
              <button
                key={muscle.id}
                onClick={() => useExerciseStore.getState().setSelectedMuscle(muscle)}
                className="p-3 glass-panel rounded-xl border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all text-sm font-medium text-white/70 hover:text-white"
              >
                {muscle.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedExercise && (
        <div className="mt-auto pt-8 border-t border-white/5 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between glass-panel p-4 rounded-2xl">
            <button 
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-xl hover:scale-105 transition-transform shadow-xl"
            >
              {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
            </button>
            <div className="flex-1 ml-6 space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/40">
                <span>Cámara Lenta</span>
                <span className="text-primary">{animationSpeed}x</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="2" 
                step="0.1" 
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-full accent-primary bg-white/5 rounded-lg appearance-none cursor-pointer h-1.5"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest px-1">Técnica Correcta</p>
            <div className="space-y-3">
              {selectedExercise.instructions.map((inst, i) => (
                <div key={i} className="flex gap-4 p-4 glass-panel rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">{inst.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
