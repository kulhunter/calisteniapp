import React, { useState, useEffect } from 'react';
import { useExerciseStore } from '../hooks/useExercise';
import exercises from '../data/exercises.json';
import muscles from '../data/muscles.json';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  Search, 
  Dumbbell, 
  Award, 
  Flame, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  Heart,
  HelpCircle
} from 'lucide-react';

export function ExercisePanel() {
  const { 
    selectedMuscle, 
    selectedExercise, 
    setSelectedExercise, 
    setSelectedMuscle,
    isPlaying, 
    togglePlay, 
    animationSpeed, 
    setAnimationSpeed,
    activeWorkoutMode,
    setActiveWorkoutMode,
    workoutReps,
    setWorkoutReps,
    workoutSets,
    setWorkoutSets,
    workoutTimer,
    setWorkoutTimer,
    reset 
  } = useExerciseStore();

  const [activeTab, setActiveTab] = useState('explorador'); // 'explorador' | 'anatomia' | 'entrenar'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todos');
  const [selectedEquipment, setSelectedEquipment] = useState('Todos');
  const [repProgress, setRepProgress] = useState(0);

  // Sync tab with muscle selection: if user clicks a muscle in 3D, open Anatomy tab!
  useEffect(() => {
    if (selectedMuscle) {
      setActiveTab('anatomia');
    }
  }, [selectedMuscle]);

  // Synchronized rep counter and stopwatch using requestAnimationFrame
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const updateWorkout = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (activeWorkoutMode && isPlaying && selectedExercise) {
        // Increment timer
        setWorkoutTimer(workoutTimer + delta);

        if (selectedExercise.animation === 'plank') {
          // Plank is isometric: count seconds as the "rep" indicator
          setWorkoutReps(Math.floor(workoutTimer + delta));
        } else {
          // Dynamic frequency calculation matched to HumanModel equations
          let freq = 1.5; // squat
          if (selectedExercise.animation === 'pushup') freq = 1.8;
          else if (selectedExercise.animation === 'pullup') freq = 1.4;
          else if (selectedExercise.animation === 'dip') freq = 1.8;

          const cycleDuration = (2 * Math.PI) / freq;
          const deltaRep = (delta * animationSpeed) / cycleDuration;
          
          setRepProgress((prev) => {
            const next = prev + deltaRep;
            if (next >= 1.0) {
              setWorkoutReps(workoutReps + 1);
              return next - 1.0;
            }
            return next;
          });
        }
      }
      animationFrameId = requestAnimationFrame(updateWorkout);
    };

    if (activeWorkoutMode && isPlaying) {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(updateWorkout);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeWorkoutMode, isPlaying, selectedExercise, workoutReps, workoutTimer, animationSpeed]);

  // Handle starting a workout
  const handleStartWorkout = (ex) => {
    setSelectedExercise(ex);
    setActiveWorkoutMode(true);
    setWorkoutReps(0);
    setWorkoutTimer(0);
    setWorkoutSets(1);
    setRepProgress(0);
    setActiveTab('entrenar');
  };

  // Filter exercises
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ex.muscles.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'Todos' || ex.difficulty === selectedDifficulty;
    const matchesEquipment = selectedEquipment === 'Todos' || ex.equipment === selectedEquipment;
    return matchesSearch && matchesDifficulty && matchesEquipment;
  });

  // Active training tips dynamic state
  const getWorkoutTip = () => {
    if (!selectedExercise) return '';
    if (selectedExercise.animation === 'plank') {
      return '¡Contrae fuertemente el abdomen y los glúteos! Mantén la respiración fluida.';
    }
    // Alternate tips based on current rep phase
    if (repProgress > 0.5) {
      return '¡Fase concéntrica! Empuja/tira con máxima fuerza explosiva.';
    } else {
      return '¡Fase excéntrica! Desciende de forma controlada sintiendo la tensión.';
    }
  };

  // Formatting stopwatch time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-[360px] h-screen glass-panel border-l border-white/5 flex flex-col text-white z-20 transition-all duration-300">
      
      {/* 1. Header */}
      <div className="p-6 border-b border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              Calisteni<span className="text-primary">app</span>
            </h2>
          </div>
          <button 
            onClick={() => {
              reset();
              setActiveTab('explorador');
            }} 
            className="p-2 hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all text-white/60 hover:text-white"
            title="Resetear todo"
          >
            <RotateCcw size={16} />
          </button>
        </div>
        <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.25em]">
          SISTEMA HOLOGRÁFICO v1.2.0 // ACTIVO
        </p>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="px-6 pt-3 flex gap-2 border-b border-white/5">
        {[
          { id: 'explorador', label: 'Explorador', icon: Search },
          { id: 'anatomia', label: 'Anatomía', icon: BookOpen },
          { id: 'entrenar', label: 'Entrenar', icon: Flame }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 pb-2.5 text-xs font-semibold tracking-wide border-b-2 transition-all ${
                isActive 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-white/40 hover:text-white/80'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. Dynamic Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* --- TAB 1: EXPLORADOR --- */}
        {activeTab === 'explorador' && (
          <div className="space-y-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input 
                type="text" 
                placeholder="Buscar ejercicio o músculo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm glass-input text-white"
              />
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase font-mono tracking-widest text-[9px]">Dificultad</label>
                <select 
                  value={selectedDifficulty} 
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-2 rounded-lg bg-surface/50 border border-white/5 text-white outline-none cursor-pointer"
                >
                  <option value="Todos">Todos</option>
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase font-mono tracking-widest text-[9px]">Equipamiento</label>
                <select 
                  value={selectedEquipment} 
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  className="w-full p-2 rounded-lg bg-surface/50 border border-white/5 text-white outline-none cursor-pointer"
                >
                  <option value="Todos">Todos</option>
                  <option value="Peso corporal">Peso Corporal</option>
                  <option value="Barra de dominadas">Barra</option>
                  <option value="Barras paralelas">Paralelas</option>
                </select>
              </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-2">
              <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Lista de Ejercicios ({filteredExercises.length})</p>
              
              {filteredExercises.length > 0 ? (
                filteredExercises.map(ex => {
                  const isActive = selectedExercise?.id === ex.id;
                  return (
                    <div
                      key={ex.id}
                      onClick={() => {
                        setSelectedExercise(ex);
                        // Clear selected muscle to highlight active exercise muscles
                        setSelectedMuscle(null);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border flex flex-col gap-2.5 transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(255,77,77,0.15)]' 
                          : 'bg-white/3 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <h3 className="font-semibold text-sm tracking-wide">{ex.name}</h3>
                          <p className="text-[10px] text-white/50">{ex.equipment}</p>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono border ${
                          ex.difficulty === 'Principiante' 
                            ? 'bg-accent/15 text-accent border-accent/20' 
                            : 'bg-primary/15 text-primary border-primary/20'
                        }`}>
                          {ex.difficulty}
                        </span>
                      </div>
                      
                      {isActive && (
                        <div className="pt-2 border-t border-white/5 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartWorkout(ex);
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 glow-primary"
                          >
                            <Play size={10} fill="white" /> Entrenar
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center glass-card rounded-xl p-4 opacity-50">
                  <HelpCircle size={32} className="mx-auto mb-2 text-white/40" />
                  <p className="text-xs">No se encontraron ejercicios con esos filtros.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 2: ANATOMÍA --- */}
        {activeTab === 'anatomia' && (
          <div className="space-y-5">
            {selectedMuscle ? (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl space-y-1">
                  <p className="text-[9px] text-primary font-mono uppercase tracking-[0.2em]">Músculo Seleccionado</p>
                  <h3 className="text-lg font-bold tracking-wide">{selectedMuscle.name}</h3>
                  <p className="text-xs text-white/50 italic font-mono">{selectedMuscle.scientific}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="space-y-1.5 p-3 rounded-lg bg-white/3 border border-white/5">
                    <h4 className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Función en Calistenia</h4>
                    <p className="text-white/80 text-xs leading-relaxed">{selectedMuscle.function}</p>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-lg bg-white/3 border border-white/5">
                    <h4 className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Consejo de Estiramiento</h4>
                    <p className="text-white/80 text-xs leading-relaxed">{selectedMuscle.tip}</p>
                  </div>
                </div>

                {/* Exercises related to this muscle */}
                <div className="space-y-2">
                  <h4 className="text-xs text-white/40 font-mono uppercase tracking-widest">Ejercicios Relacionados</h4>
                  {exercises.filter(ex => ex.muscles.includes(selectedMuscle.id)).map(ex => (
                    <button
                      key={ex.id}
                      onClick={() => setSelectedExercise(ex)}
                      className="w-full p-2.5 rounded-lg bg-white/3 hover:bg-white/5 border border-white/5 text-left flex items-center justify-between text-xs transition-all"
                    >
                      <span className="font-semibold">{ex.name}</span>
                      <ChevronRight size={14} className="text-white/30" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedMuscle(null)}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 font-semibold text-xs transition-all text-white/60 hover:text-white"
                >
                  Cerrar Ficha de Anatomía
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-6 glass-card rounded-2xl p-6">
                  <Activity size={36} className="mx-auto mb-3 text-primary animate-pulse" />
                  <h4 className="font-bold text-sm tracking-wide">Laboratorio de Anatomía</h4>
                  <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                    Haz clic en un músculo del holograma 3D o selecciona uno de la lista a continuación para ver su biomecánica.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Glosario de Músculos</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {muscles.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMuscle(m)}
                        className="p-3 text-left rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 flex items-center justify-between text-xs transition-all group"
                      >
                        <div className="space-y-0.5">
                          <span className="font-semibold group-hover:text-primary transition-colors">{m.name}</span>
                          <p className="text-[10px] text-white/40 italic font-mono">{m.scientific}</p>
                        </div>
                        <ChevronRight size={14} className="text-white/30 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: ENTRENAR (WORKOUT MODE) --- */}
        {activeTab === 'entrenar' && (
          <div className="space-y-5">
            {selectedExercise ? (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
                {/* Active Exercise Summary */}
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm tracking-wide">{selectedExercise.name}</h3>
                    <p className="text-[10px] text-white/50 mt-0.5">Objetivo: <span className="text-primary font-bold">{selectedExercise.repTarget}</span></p>
                  </div>
                  <button 
                    onClick={() => setActiveWorkoutMode(!activeWorkoutMode)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all border ${
                      activeWorkoutMode 
                        ? 'bg-primary border-primary text-white glow-primary' 
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
                    }`}
                  >
                    {activeWorkoutMode ? 'Detener' : 'Entrenar'}
                  </button>
                </div>

                {/* Simulated Stopwatch & Reps Counter */}
                <div className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl relative space-y-4">
                  {/* Radial Ring */}
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      {/* background circle */}
                      <circle 
                        cx="72" cy="72" r="64" 
                        className="stroke-white/5" 
                        strokeWidth="8" fill="transparent" 
                      />
                      {/* progress circle */}
                      <circle 
                        cx="72" cy="72" r="64" 
                        className="stroke-primary transition-all duration-75" 
                        strokeWidth="8" fill="transparent"
                        strokeDasharray={2 * Math.PI * 64}
                        strokeDashoffset={2 * Math.PI * 64 * (1 - (selectedExercise.animation === 'plank' ? (workoutTimer % 45) / 45 : repProgress))}
                      />
                    </svg>
                    
                    {/* Inner numbers */}
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-4xl font-black font-mono tracking-tight text-white leading-none">
                        {workoutReps}
                      </span>
                      <span className="text-[9px] uppercase font-mono tracking-widest text-white/40 mt-1.5">
                        {selectedExercise.animation === 'plank' ? 'Segundos' : 'Reps'}
                      </span>
                    </div>
                  </div>

                  {/* Stopwatch Stopwatch */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 font-mono text-sm">
                    <Clock size={14} className="text-primary" />
                    {formatTime(workoutTimer)}
                  </div>
                </div>

                {/* Workout coaching tip */}
                {activeWorkoutMode && (
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Flame size={12} className="text-accent animate-pulse" />
                      <span className="text-[10px] text-accent font-bold uppercase tracking-wider font-mono">Consejo Técnico HUD</span>
                    </div>
                    <p className="text-white/95 text-[11px] leading-relaxed italic">
                      "{getWorkoutTip()}"
                    </p>
                  </div>
                )}

                {/* Sets controller */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/3 border border-white/5 rounded-xl space-y-1 text-center">
                    <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest">Serie Actual</span>
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => setWorkoutSets(Math.max(1, workoutSets - 1))}
                        className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-base font-mono">{workoutSets}</span>
                      <button 
                        onClick={() => setWorkoutSets(workoutSets + 1)}
                        className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/3 border border-white/5 rounded-xl space-y-1 text-center">
                    <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest">Objetivo Serie</span>
                    <div className="text-base font-black text-white/80 font-mono py-0.5">
                      {selectedExercise.repTarget}
                    </div>
                  </div>
                </div>

                {/* Playback Controls & Speed */}
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={togglePlay}
                      className="w-12 h-12 flex items-center justify-center bg-white hover:bg-white/95 text-black rounded-full hover:scale-105 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.25)]"
                    >
                      {isPlaying ? <Pause size={18} fill="black" strokeWidth={0} /> : <Play size={18} fill="black" strokeWidth={0} />}
                    </button>
                    <div className="flex-1 ml-4 space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
                        <span>Velocidad Holograma</span>
                        <span>{animationSpeed.toFixed(1)}x</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="2.0" 
                        step="0.1" 
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                        className="w-full accent-primary bg-white/15 rounded-lg appearance-none cursor-pointer h-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 glass-card rounded-2xl p-6 opacity-60">
                <Flame size={44} className="mx-auto mb-3 text-white/20" />
                <h4 className="font-bold text-sm tracking-wide">Modo Entrenamiento</h4>
                <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                  Primero selecciona un ejercicio en la pestaña de <strong>Explorador</strong> y haz clic en el botón <strong>Entrenar</strong> para activar este panel.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
