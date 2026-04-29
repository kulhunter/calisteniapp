import React from 'react';
import { useExerciseStore } from '../hooks/useExercise';
import { useGamificationStore } from '../hooks/useGamification';
import { Star, CheckCircle2, Lock, Play, ChevronLeft, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import routines from '../data/routines.json';
import worlds from '../data/worlds.json';

export const WorldsMap = () => {
  const { startRoutine } = useExerciseStore();
  const { level, completedNodes, currentWorldId, setWorld, completeNode } = useGamificationStore();
  
  const currentWorldIndex = worlds.findIndex(w => w.id === currentWorldId);
  const currentWorld = worlds[currentWorldIndex] || worlds[0];

  const handleNextWorld = () => {
    if (currentWorldIndex < worlds.length - 1) {
      const nextWorld = worlds[currentWorldIndex + 1];
      if (level >= nextWorld.minLevel) {
        setWorld(nextWorld.id);
      }
    }
  };

  const handlePrevWorld = () => {
    if (currentWorldIndex > 0) {
      setWorld(worlds[currentWorldIndex - 1].id);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#030014] pb-32 pt-8">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* World Selector Header */}
        <header className="flex items-center justify-between mb-16 bg-white/5 p-6 rounded-[32px] border border-white/10 backdrop-blur-xl sticky top-4 z-50">
          <button 
            onClick={handlePrevWorld}
            disabled={currentWorldIndex === 0}
            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all disabled:opacity-0"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-1">
              <Sparkles size={12} />
              <span>{currentWorld.name}</span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight">{currentWorld.description}</h2>
          </div>

          <button 
            onClick={handleNextWorld}
            disabled={currentWorldIndex === worlds.length - 1 || level < (worlds[currentWorldIndex + 1]?.minLevel || 0)}
            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all disabled:opacity-20"
          >
            {level < (worlds[currentWorldIndex + 1]?.minLevel || 0) ? <Lock size={18} /> : <ChevronRight size={24} />}
          </button>
        </header>

        {/* Chapters & Nodes */}
        <div className="flex flex-col gap-24 relative">
          {/* Main Connector Path */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-primary/30 via-primary/5 to-transparent rounded-full" />

          {currentWorld.chapters.map((chapter, cIndex) => (
            <section key={chapter.id} className="relative">
              {/* Chapter Header */}
              <div className="flex flex-col items-center mb-12 relative z-10">
                <div className="bg-[#030014] px-8 py-3 rounded-full border border-white/10 shadow-2xl">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">{chapter.name}</h3>
                </div>
              </div>

              {/* Nodes List */}
              <div className="flex flex-col items-center gap-12">
                {chapter.routines.map((routineId, rIndex) => {
                  const routine = routines.find(r => r.id === routineId);
                  if (!routine) return null;

                  const isCompleted = completedNodes.includes(routine.id);
                  const isLocked = !isCompleted && rIndex > 0 && !completedNodes.includes(chapter.routines[rIndex-1]);
                  const isActive = !isCompleted && !isLocked;

                  // Zig-zag offset
                  const offset = rIndex % 2 === 0 ? 'md:translate-x-16' : 'md:-translate-x-16';

                  return (
                    <div key={routine.id} className={`relative group ${offset}`}>
                      {/* Label Floating */}
                      <div className={`absolute top-1/2 -translate-y-1/2 hidden md:block w-56 ${rIndex % 2 === 0 ? 'left-24 text-left' : 'right-24 text-right'}`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isLocked ? 'text-white/10' : 'text-primary'}`}>
                          {isLocked ? 'Bloqueado' : `Sesión ${rIndex + 1}`}
                        </p>
                        <h4 className={`text-sm font-black uppercase ${isLocked ? 'text-white/20' : 'text-white'}`}>{routine.name}</h4>
                        {!isLocked && <p className="text-[10px] text-white/40 font-bold mt-1">{routine.duration} • {routine.xp} XP</p>}
                      </div>

                      <button
                        onClick={() => !isLocked && startRoutine(routine)}
                        className={`w-20 h-20 md:w-24 md:h-24 rounded-[32px] border-4 transition-all relative z-10 flex items-center justify-center
                          ${isLocked 
                            ? 'bg-white/5 border-white/5 text-white/5 cursor-not-allowed' 
                            : isCompleted 
                              ? 'bg-primary/20 border-primary/20 text-primary hover:bg-primary/30' 
                              : 'bg-primary text-black border-primary/20 shadow-[0_0_40px_rgba(168,85,247,0.4)] scale-110 hover:scale-125'
                          }`}
                      >
                        {isLocked ? (
                          <Lock size={24} />
                        ) : isCompleted ? (
                          <CheckCircle2 size={32} />
                        ) : (
                          <Play size={32} fill="currentColor" className="animate-pulse" />
                        )}

                        {/* Progress Badge */}
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#030014] border-2 border-white/10 flex items-center justify-center text-[10px] font-black">
                          {rIndex + 1}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <div className="flex flex-col items-center gap-6 pt-20 opacity-20">
            <Trophy size={64} />
            <p className="font-black text-xs uppercase tracking-[0.5em]">Próximos Mundos en Construcción</p>
          </div>
        </div>
      </div>
    </div>
  );
};
