import React from 'react';
import { useExerciseStore } from '../hooks/useExercise';
import { useGamificationStore } from '../hooks/useGamification';
import { Star, CheckCircle2, Lock, Play, Trophy } from 'lucide-react';
import routines from '../data/routines.json';

export const DailyPath = () => {
  const { startRoutine } = useExerciseStore();
  const { level, xp } = useGamificationStore();
  
  // Create a path of 10 stages based on routines
  const pathRoutines = routines.slice(0, 10);

  return (
    <div className="w-full py-20 px-4 flex flex-col items-center gap-12 max-w-2xl mx-auto relative">
      {/* Connector Line */}
      <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-full left-1/2 -translate-x-1/2 z-0" />
      
      {pathRoutines.map((routine, i) => {
        const isLocked = i > level; // Simple locking logic based on level
        const isCompleted = i < level - 1; // Dummy completed state
        const isActive = i === level - 1;

        // Zig-zag pattern
        const offset = i % 2 === 0 ? 'translate-x-12' : '-translate-x-12';

        return (
          <div key={routine.id} className={`relative z-10 transition-all duration-500 ${offset}`}>
            {/* Tooltip */}
            <div className={`absolute ${i % 2 === 0 ? '-right-48 text-left' : '-left-48 text-right'} top-1/2 -translate-y-1/2 w-40 hidden md:block`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isLocked ? 'text-white/20' : 'text-primary'}`}>
                {isLocked ? 'Bloqueado' : `Misión ${i + 1}`}
              </p>
              <h4 className={`text-sm font-black uppercase leading-tight ${isLocked ? 'text-white/10' : 'text-white'}`}>
                {routine.name}
              </h4>
            </div>

            <button
              onClick={() => !isLocked && startRoutine(routine)}
              disabled={isLocked}
              className={`w-20 h-20 rounded-[32px] flex items-center justify-center border-4 transition-all relative group
                ${isLocked 
                  ? 'bg-white/5 border-white/5 text-white/10 grayscale' 
                  : isActive 
                    ? 'bg-primary text-black border-primary/20 shadow-[0_0_40px_rgba(168,85,247,0.5)] scale-125 hover:scale-110 active:scale-95' 
                    : 'bg-white/10 border-white/10 text-primary hover:bg-primary/20'
                }`}
            >
              {isLocked ? (
                <Lock size={24} />
              ) : isCompleted ? (
                <CheckCircle2 size={32} />
              ) : isActive ? (
                <Play size={32} fill="currentColor" className="animate-pulse" />
              ) : (
                <Star size={32} />
              )}

              {/* Progress Aura */}
              {isActive && (
                <div className="absolute inset-0 rounded-[32px] border-2 border-primary animate-ping opacity-20" />
              )}
              
              {/* Level Badge */}
              {!isLocked && (
                <div className="absolute -bottom-2 -right-2 bg-secondary text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#030014]">
                  {i + 1}
                </div>
              )}
            </button>
          </div>
        );
      })}

      <div className="mt-20 flex flex-col items-center gap-4 opacity-30">
        <Trophy size={48} />
        <p className="font-black text-xs uppercase tracking-widest">Próximos desafíos próximamente</p>
      </div>
    </div>
  );
};
