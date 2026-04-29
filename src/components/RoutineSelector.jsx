import React, { useState } from 'react';
import routines from '../data/routines.json';
import { useExerciseStore } from '../hooks/useExercise';
import { Play, Clock, BarChart, Home, ShieldCheck, Dumbbell } from 'lucide-react';

export const RoutineSelector = () => {
  const { startRoutine } = useExerciseStore();
  const [activeCategory, setActiveCategory] = useState('Todas');

  const categories = ['Todas', 'Casa', 'Gimnasio'];
  const filteredRoutines = activeCategory === 'Todas' 
    ? routines 
    : routines.filter(r => r.category === activeCategory);

  return (
    <div className="w-full h-full p-6 md:p-12 overflow-y-auto bg-[#030014]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4">
            <ShieldCheck size={16} />
            <span>Plataforma Premium</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            ENTRENA <br/> <span className="text-primary glow-text">COMO UN PRO</span>
          </h2>
          <p className="text-white/40 mb-10 max-w-2xl text-lg leading-relaxed">
            Selecciona tu entorno y nivel. Nuestra tecnología guiará cada segundo de tu entrenamiento con tiempos y técnicas precisas.
          </p>

          {/* Category Tabs */}
          <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-black shadow-[0_0_20px_var(--primary-glow)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRoutines.map((routine) => (
            <div 
              key={routine.id}
              className="glass-panel p-8 rounded-[32px] border border-white/5 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full"
              onClick={() => startRoutine(routine)}
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] group-hover:bg-primary/20 transition-all" />

              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shadow-xl">
                  {routine.category === 'Casa' ? <Home size={28} /> : <Dumbbell size={28} />}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 text-white/60">
                    <Clock size={12} /> {routine.duration}
                  </span>
                  <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                    routine.level === 'Avanzado' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                  }`}>
                    <BarChart size={12} /> {routine.level}
                  </span>
                </div>
              </div>

              <h3 className="text-3xl font-black mb-3 group-hover:text-primary transition-colors leading-tight">{routine.name}</h3>
              <p className="text-white/40 text-base mb-8 flex-1 leading-relaxed">{routine.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex -space-x-2">
                  {[...Array(routine.exercises.length)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#030014] bg-white/10 flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="text-primary font-black flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  INICIAR <Play size={16} fill="currentColor" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
