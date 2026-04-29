import React, { useState } from 'react';
import routines from '../data/routines.json';
import { useExerciseStore } from '../hooks/useExercise';
import { Play, Clock, BarChart, Home, ShieldCheck, Dumbbell, Search, Plus, Activity } from 'lucide-react';

import { CustomRoutineBuilder } from './CustomRoutineBuilder';
import { DailyPath } from './DailyPath';
import { LayoutGrid, Map as MapIcon, Trophy } from 'lucide-react';

export const RoutineSelector = ({ userData }) => {
  const { startRoutine } = useExerciseStore();
  const [viewMode, setViewMode] = useState('path'); // 'path' or 'library'
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  
  const [customRoutines, setCustomRoutines] = useState(() => {
    const saved = localStorage.getItem('calisteniapp_custom_routines');
    return saved ? JSON.parse(saved) : [];
  });

  const allRoutines = [...routines, ...customRoutines];
  const categories = ['Todas', 'Casa', 'Gimnasio', 'Personalizada'];
  
  const filteredRoutines = allRoutines
    .filter(r => (activeCategory === 'Todas' || r.category === activeCategory))
    .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Recommendation logic
  const recommendedRoutines = allRoutines.filter(r => r.level === userData?.strengthLevel).slice(0, 3);

  const saveCustomRoutine = (newRoutine) => {
    const updated = [...customRoutines, newRoutine];
    setCustomRoutines(updated);
    localStorage.setItem('calisteniapp_custom_routines', JSON.stringify(updated));
    setShowBuilder(false);
    setActiveCategory('Personalizada');
  };

  return (
    <div className="w-full h-full p-4 md:p-12 overflow-y-auto bg-[#030014] scroll-smooth">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 pt-8">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
            <Activity size={14} className="animate-pulse" />
            <span>Plan de Entrenamiento Inteligente</span>
          </div>
          
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-black mb-2 leading-none uppercase">
              HOLA, <span className="text-primary glow-text">{userData?.name || 'GUERRERO'}</span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                <span className="text-[10px] font-black text-white/40 uppercase">Nivel:</span>
                <span className="text-[10px] font-black text-primary uppercase">{userData?.strengthLevel || 'Calculando...'}</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                <span className="text-[10px] font-black text-white/40 uppercase">IMC:</span>
                <span className="text-[10px] font-black text-white/80 uppercase">{userData?.imc || '--'}</span>
              </div>
            </div>
          </div>

          <p className="text-white/60 mb-10 max-w-2xl text-base md:text-lg leading-relaxed font-medium">
            Basado en tu nivel de <strong>{userData?.strengthLevel}</strong>, hemos seleccionado estas rutinas para maximizar tus resultados hoy.
          </p>

          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-12">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              <button 
                onClick={() => setViewMode('path')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${viewMode === 'path' ? 'bg-primary text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                <MapIcon size={16} /> Mi Ruta
              </button>
              <button 
                onClick={() => setViewMode('library')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${viewMode === 'library' ? 'bg-primary text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                <LayoutGrid size={16} /> Biblioteca
              </button>
            </div>

            {viewMode === 'library' && (
              <div className="relative w-full lg:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por músculo o nombre..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 font-bold outline-none focus:border-primary/50 transition-all text-sm"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
              {viewMode === 'library' && (
                <div className="flex gap-1 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-wider transition-all ${
                        activeCategory === cat 
                          ? 'bg-primary text-black shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                          : 'text-white/40 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
              
              <button 
                onClick={() => setShowBuilder(true)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 font-black text-[9px] uppercase tracking-wider hover:bg-primary hover:text-black transition-all group"
              >
                <Plus size={14} className="text-primary group-hover:text-black" />
                <span>NUEVA RUTINA</span>
              </button>
            </div>
          </div>
        </header>

        {showBuilder && <CustomRoutineBuilder onSave={saveCustomRoutine} onCancel={() => setShowBuilder(false)} />}

        {viewMode === 'path' ? (
          <DailyPath />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
            {filteredRoutines.map((routine) => (
              <div 
                key={routine.id}
                className="glass-panel p-6 md:p-8 rounded-[40px] border border-white/5 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full active:scale-[0.98]"
                onClick={() => startRoutine(routine)}
              >
                {/* Recommended Badge */}
                {routine.level === userData?.strengthLevel && (
                  <div className="absolute top-6 right-6 bg-primary text-black text-[8px] font-black px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] z-10 animate-bounce">
                    RECOMENDADA
                  </div>
                )}

                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shadow-2xl border border-white/5">
                    {routine.category === 'Casa' ? <Home size={32} /> : <Dumbbell size={32} />}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-[9px] font-black text-white/60 uppercase bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                      <Clock size={12} className="text-primary" /> {routine.duration}
                    </div>
                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 ${
                      routine.level === 'Avanzado' || routine.level === 'Master' ? 'text-secondary' : 'text-primary'
                    }`}>
                      <BarChart size={12} /> {routine.level}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-black mb-3 group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">{routine.name}</h3>
                  <p className="text-white/60 text-sm mb-10 leading-relaxed font-medium">{routine.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-6 mt-auto border-t border-white/5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Ejercicios</span>
                    <div className="flex -space-x-2">
                      {routine.exercises.slice(0, 4).map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-surface bg-white/5 flex items-center justify-center text-[10px] font-black text-white/60">
                          {i + 1}
                        </div>
                      ))}
                      {routine.exercises.length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                          +{routine.exercises.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="flex items-center gap-3 bg-white/5 hover:bg-primary hover:text-black px-6 py-3 rounded-2xl transition-all border border-white/5 group/btn">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Entrenar</span>
                    <Play size={14} fill="currentColor" className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
