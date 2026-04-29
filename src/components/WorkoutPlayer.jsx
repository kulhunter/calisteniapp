import React, { useState, useEffect } from 'react';
import { useExerciseStore } from '../hooks/useExercise';
import exercisesData from '../data/hasan_exercises.json';
import { X, Play, Pause, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';

export const WorkoutPlayer = () => {
  const { activeRoutine, currentStep, workoutState, nextStep, setWorkoutState, endRoutine } = useExerciseStore();
  const [timeLeft, setTimeLeft] = useState(0);

  const stepData = activeRoutine?.exercises[currentStep];
  const exerciseDetails = stepData ? exercisesData.find(e => e.id === stepData.id) : null;

  useEffect(() => {
    if (workoutState === 'resting' && stepData) {
      setTimeLeft(stepData.rest);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            nextStep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [workoutState, stepData, nextStep]);

  if (!activeRoutine || !exerciseDetails) return null;

  if (workoutState === 'finished') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(0,163,255,0.3)]">
          <CheckCircle2 size={48} className="text-primary" />
        </div>
        <h2 className="text-5xl font-black mb-4 glow-text">¡Entrenamiento Completado!</h2>
        <p className="text-xl text-white/50 mb-12">Has completado con éxito la rutina {activeRoutine.name}.</p>
        <button 
          onClick={endRoutine}
          className="btn-primary px-12 py-4 rounded-xl font-bold text-lg"
        >
          Volver a Inicio
        </button>
      </div>
    );
  }

  const isResting = workoutState === 'resting';
  const progress = ((currentStep) / activeRoutine.exercises.length) * 100;

  return (
    <div className="w-full h-full flex flex-col relative bg-[#050505]">
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-30">
        <div>
          <p className="text-primary font-bold uppercase tracking-wider text-xs mb-1">Entrenamiento Activo</p>
          <h2 className="text-2xl font-black">{activeRoutine.name}</h2>
        </div>
        <button onClick={endRoutine} className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-8 pt-32 max-w-7xl mx-auto w-full">
        
        {/* Left: GIF Viewer */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className={`relative w-full max-w-md aspect-square rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl transition-all duration-500 ${isResting ? 'opacity-30 blur-sm scale-95' : 'scale-100'}`}>
            <img 
              src={`/${exerciseDetails.gif_url}`} 
              alt={exerciseDetails.name_es}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Controls & Info */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {isResting ? (
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="text-6xl font-black text-primary glow-text mb-4">{timeLeft}s</h3>
              <p className="text-2xl font-bold text-white mb-2">Descanso</p>
              <p className="text-white/50 text-lg mb-12">Prepárate para el siguiente ejercicio...</p>
              <button 
                onClick={nextStep}
                className="glass-panel px-8 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                Omitir Descanso <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold mb-6">
                Ejercicio {currentStep + 1} de {activeRoutine.exercises.length}
              </div>
              <h2 className="text-5xl font-black capitalize mb-6">{exerciseDetails.name_es}</h2>
              
              <div className="flex items-center gap-8 mb-12">
                <div className="text-center">
                  <p className="text-white/40 font-bold uppercase text-xs mb-2">Objetivo</p>
                  <p className="text-3xl font-black text-primary glow-text">{stepData.reps} <span className="text-lg">Reps</span></p>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/5 max-w-md mb-12 text-left">
                <h4 className="font-bold mb-4 text-white/80">Instrucciones (Inglés)</h4>
                <ul className="space-y-3">
                  {exerciseDetails.instruction_steps.en.map((inst, i) => (
                    <li key={i} className="text-sm text-white/50 flex gap-3">
                      <span className="text-primary font-bold">{i+1}.</span> 
                      {inst}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => setWorkoutState('resting')}
                className="btn-primary w-full max-w-md py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3"
              >
                HE TERMINADO <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="h-2 w-full bg-white/5 absolute bottom-0 left-0">
        <div 
          className="h-full bg-primary shadow-[0_0_15px_var(--primary-glow)] transition-all duration-500" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
