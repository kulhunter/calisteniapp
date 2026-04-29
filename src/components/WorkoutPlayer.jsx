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
  const [isPaused, setIsPaused] = useState(true); // Start paused for better UX

  // Audio Context for Metronome
  useEffect(() => {
    let audioCtx = null;
    let timer = null;

    if (!isPaused && workoutState !== 'finished') {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          // Metronome sound on each second
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.value = prev <= 3 ? 880 : 440; // High pitch for last 3 seconds
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.1);

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
    }

    return () => {
      if (timer) clearInterval(timer);
      if (audioCtx) audioCtx.close();
    };
  }, [workoutState, stepData, nextStep, setWorkoutState, isResting, isPaused]);

  if (!activeRoutine || !stepData) return null;

  if (workoutState === 'finished') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-primary/10 to-[#030014] overflow-y-auto">
        <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-8 shadow-[0_0_80px_rgba(168,85,247,0.4)] border border-primary/30">
          <CheckCircle2 size={64} className="text-primary" />
        </div>
        <h2 className="text-5xl md:text-7xl font-black mb-4 glow-text text-center">¡MISIÓN CUMPLIDA!</h2>
        <p className="text-2xl text-white/50 mb-12 text-center max-w-md">Has completado la rutina <span className="text-white font-bold">{activeRoutine.name}</span>. ¡Buen trabajo!</p>
        <button 
          onClick={endRoutine}
          className="btn-primary px-16 py-5 rounded-2xl font-black text-2xl uppercase tracking-wider"
        >
          Finalizar
        </button>
      </div>
    );
  }

  const progressPercent = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const routineProgress = ((currentStep) / activeRoutine.exercises.length) * 100;

  return (
    <div className="w-full h-full flex flex-col relative bg-[#030014] overflow-y-auto">
      {/* Top Header */}
      <div className="sticky top-0 w-full p-6 flex justify-between items-center z-30 bg-[#030014]/80 backdrop-blur-md border-b border-white/5">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-[10px] mb-1">Entrenamiento Activo</p>
          <h2 className="text-xl font-black">{activeRoutine.name}</h2>
        </div>
        <button onClick={endRoutine} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors border border-white/10">
          <X size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-start lg:justify-center gap-8 lg:gap-16 p-6 md:p-12 w-full max-w-7xl mx-auto">
        
        {/* Left: Premium GIF Viewer */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-white/40 font-black uppercase text-[10px] tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              BLOQUE {currentStep + 1} / {activeRoutine.exercises.length}
            </span>
            <div className="flex items-center gap-2 bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20 shadow-[0_0_15px_var(--accent-glow)]">
              <Flame size={14} className="text-accent" />
              <span className="text-accent font-black text-[10px] uppercase tracking-wider">{stepData.target_es}</span>
            </div>
          </div>
          
          <div className={`relative w-full aspect-square rounded-[40px] overflow-hidden glass-panel border border-white/10 transition-all duration-700 ${isResting ? 'opacity-40 blur-sm scale-95 grayscale' : 'scale-100 shadow-[0_0_60px_rgba(168,85,247,0.15)]'}`}>
            <img 
              src={`/${stepData.gif_url}`} 
              alt={stepData.name_es}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-60" />
            
            {!isResting && (
              <div className="absolute bottom-8 left-8 right-8">
                <h2 className="text-4xl font-black capitalize leading-tight glow-text">{stepData.name_es}</h2>
                <div className="flex items-center gap-4 mt-4">
                  <div className="bg-primary/20 text-primary px-4 py-1.5 rounded-xl border border-primary/30 text-xs font-black tracking-widest uppercase">
                    TEMPO: {stepData.tempo}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Circular Timer & Controls */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-8">
          <div className="relative flex items-center justify-center mb-10 group">
            <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-all" />
            <CircularProgress progress={progressPercent} isResting={isResting} />
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-8xl font-black tabular-nums tracking-tighter transition-all ${isResting ? 'text-accent glow-text scale-110' : 'text-white'}`}>
                {timeLeft}
              </span>
              <span className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px] mt-4">
                {isResting ? 'DESCANSO' : 'ESFUERZO'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-8 mb-10">
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all border-4 ${
                isPaused 
                ? 'bg-primary text-black border-primary/20 shadow-[0_0_30px_var(--primary-glow)] scale-110' 
                : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
              }`}
            >
              {isPaused ? <Play size={32} fill="currentColor" /> : <Pause size={32} fill="currentColor" />}
            </button>
            <button 
              onClick={() => {
                if (!isResting) setWorkoutState('resting');
                else nextStep();
              }}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                <FastForward size={24} />
              </div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Omitir</span>
            </button>
          </div>

          {/* Spanish Instructions */}
          {!isResting && (
            <div className="w-full max-w-md space-y-3">
              {stepData.instructions.map((inst, i) => (
                <div key={i} className="glass-panel p-5 rounded-[24px] border border-white/5 flex gap-5 items-center hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary font-black flex items-center justify-center shrink-0 border border-primary/20 shadow-lg">
                    {i + 1}
                  </div>
                  <p className="text-white/70 text-sm md:text-base font-medium leading-relaxed">{inst}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global Routine Progress Bar */}
      <div className="sticky bottom-0 h-1.5 w-full bg-white/5 shrink-0 z-40">
        <div 
          className="h-full bg-primary shadow-[0_0_20px_var(--primary-glow)] transition-all duration-1000 ease-out" 
          style={{ width: `${routineProgress}%` }}
        />
      </div>
    </div>
  );
};
