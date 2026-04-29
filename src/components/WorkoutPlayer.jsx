import React, { useState, useEffect } from 'react';
import { useExerciseStore } from '../hooks/useExercise';
import { X, Play, Pause, ChevronRight, CheckCircle2, Flame, FastForward } from 'lucide-react';

const CircularProgress = ({ progress, size = 280, strokeWidth = 16, isResting }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const colorClass = isResting ? 'text-accent' : 'text-primary';
  const shadowClass = isResting ? 'drop-shadow-[0_0_20px_rgba(255,77,0,0.6)]' : 'drop-shadow-[0_0_20px_rgba(0,163,255,0.6)]';
  
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        className="text-white/5"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className={`${colorClass} ${shadowClass} transition-all duration-1000 ease-linear`}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
};

export const WorkoutPlayer = () => {
  const { activeRoutine, currentStep, workoutState, nextStep, setWorkoutState, endRoutine } = useExerciseStore();
  
  const stepData = activeRoutine?.exercises[currentStep];
  const isResting = workoutState === 'resting';
  
  // Timer state
  const totalTime = isResting ? stepData?.rest_time : stepData?.work_time;
  const [timeLeft, setTimeLeft] = useState(totalTime || 0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setTimeLeft(totalTime);
  }, [currentStep, isResting, totalTime]);

  useEffect(() => {
    if (!stepData || workoutState === 'finished' || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isResting) {
            setWorkoutState('resting');
          } else {
            nextStep();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [workoutState, stepData, nextStep, setWorkoutState, isResting, isPaused]);

  if (!activeRoutine || !stepData) return null;

  if (workoutState === 'finished') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-primary/10 to-[#050505]">
        <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-8 shadow-[0_0_80px_rgba(0,163,255,0.4)] border border-primary/30">
          <CheckCircle2 size={64} className="text-primary" />
        </div>
        <h2 className="text-5xl md:text-7xl font-black mb-4 glow-text text-center">¡MISIÓN CUMPLIDA!</h2>
        <p className="text-2xl text-white/50 mb-12 text-center">Completaste con éxito: <span className="text-white font-bold">{activeRoutine.name}</span></p>
        <button 
          onClick={endRoutine}
          className="btn-primary px-16 py-5 rounded-2xl font-black text-2xl uppercase tracking-wider"
        >
          Volver a Inicio
        </button>
      </div>
    );
  }

  const progressPercent = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const routineProgress = ((currentStep) / activeRoutine.exercises.length) * 100;

  return (
    <div className="w-full h-full flex flex-col relative bg-[#050505]">
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-30 bg-gradient-to-b from-[#050505] to-transparent">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-1">Entrenamiento Activo</p>
          <h2 className="text-xl md:text-3xl font-black">{activeRoutine.name}</h2>
        </div>
        <button onClick={endRoutine} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors border border-white/10">
          <X size={24} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 p-8 pt-24 max-w-7xl mx-auto w-full">
        
        {/* Left: Premium GIF Viewer */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-white/40 font-bold uppercase text-xs tracking-widest">
              EJERCICIO {currentStep + 1} DE {activeRoutine.exercises.length}
            </span>
            <div className="flex items-center gap-2 bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">
              <Flame size={16} className="text-accent" />
              <span className="text-accent font-black text-xs uppercase tracking-wider">{stepData.target_es}</span>
            </div>
          </div>
          
          <div className={`relative w-full max-w-lg aspect-square rounded-[40px] overflow-hidden glass-panel border border-white/10 transition-all duration-700 ${isResting ? 'opacity-40 blur-sm scale-95 grayscale' : 'scale-100 shadow-[0_0_50px_rgba(0,163,255,0.15)]'}`}>
            <img 
              src={`/${stepData.gif_url}`} 
              alt={stepData.name_es}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay for Pro Look */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {!isResting && (
              <div className="absolute bottom-8 left-8 right-8">
                <h2 className="text-4xl md:text-5xl font-black capitalize leading-tight">{stepData.name_es}</h2>
              </div>
            )}
          </div>
        </div>

        {/* Right: Circular Timer & Controls */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center mb-12">
            <CircularProgress progress={progressPercent} isResting={isResting} />
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-7xl font-black tabular-nums tracking-tighter ${isResting ? 'text-accent glow-text' : 'text-white'}`}>
                {timeLeft}
              </span>
              <span className="text-white/40 font-bold uppercase tracking-widest mt-2">
                {isResting ? 'Descanso' : 'Trabajo'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6 mb-12">
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className="w-16 h-16 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
            >
              {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
            </button>
            <button 
              onClick={() => {
                if (!isResting) setWorkoutState('resting');
                else nextStep();
              }}
              className="px-8 py-5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 font-bold flex items-center gap-3 uppercase tracking-wider text-sm"
            >
              Omitir <FastForward size={18} />
            </button>
          </div>

          {/* Spanish Instructions */}
          {!isResting && (
            <div className="w-full max-w-md">
              <div className="flex flex-col gap-4">
                {stepData.instructions.map((inst, i) => (
                  <div key={i} className="glass-panel p-4 rounded-2xl border border-white/5 flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-black flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-white/80 text-sm md:text-base leading-snug">{inst}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Routine Progress Bar */}
      <div className="h-2 w-full bg-white/5 absolute bottom-0 left-0">
        <div 
          className="h-full bg-primary shadow-[0_0_15px_var(--primary-glow)] transition-all duration-1000 ease-out" 
          style={{ width: `${routineProgress}%` }}
        />
      </div>
    </div>
  );
};
