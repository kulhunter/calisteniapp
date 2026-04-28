import React from 'react';
import { ExercisePanel } from './components/ExercisePanel';
import { Scene } from './components/Scene';
import { SEO } from './components/SEO';
import { Search, Settings, User, Layers, Maximize2, ZoomIn, Activity, Info } from 'lucide-react';

function App() {
  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden font-['Outfit']">
      <SEO />

      {/* Header - FitCoach Style */}
      <header className="h-16 glass-panel border-b border-white/5 flex items-center justify-between px-8 z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_var(--primary-glow)]">
              <span className="font-bold text-black text-xl">C</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase glow-text">Calisteniapp</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
            <a href="#" className="text-primary border-b-2 border-primary py-5">ANATOMÍA</a>
            <a href="#" className="hover:text-white transition-colors">EJERCICIOS</a>
            <a href="#" className="hover:text-white transition-colors">RUTINAS</a>
            <a href="#" className="hover:text-white transition-colors">PROGRESO</a>
          </nav>
        </div>
        
        <div className="flex items-center gap-6 text-white/50">
          <Search size={20} className="cursor-pointer hover:text-white transition-colors" />
          <Settings size={20} className="cursor-pointer hover:text-white transition-colors" />
          <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5">
            <User size={18} />
            <span className="text-xs font-medium">Mi Perfil</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left Toolbar - View Selection */}
        <aside className="w-20 glass-panel border-r border-white/5 flex flex-col items-center py-8 gap-8 z-20">
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all border border-transparent group-hover:border-primary/30">
              <Layers size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold text-white/30 group-hover:text-primary transition-colors">Frontal</span>
          </div>
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all border border-transparent group-hover:border-primary/30">
              <Layers size={20} className="rotate-90" />
            </div>
            <span className="text-[10px] uppercase font-bold text-white/30 group-hover:text-primary transition-colors">Lateral</span>
          </div>
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all border border-transparent group-hover:border-primary/30">
              <Layers size={20} className="rotate-180" />
            </div>
            <span className="text-[10px] uppercase font-bold text-white/30 group-hover:text-primary transition-colors">Posterior</span>
          </div>
          
          <div className="mt-auto flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(0,163,255,0.2)]">
              <Layers size={20} />
            </div>
            <span className="text-[10px] uppercase font-bold text-primary">Capas</span>
          </div>
        </aside>

        {/* 3D Scene Area */}
        <section className="flex-1 relative bg-[#050505]">
          <div className="w-full h-full">
            <Scene />
          </div>
          
          {/* Quick Info Overlay */}
          <div className="absolute top-8 left-8 z-20 pointer-events-none">
            <div className="glass-panel p-4 rounded-2xl border border-white/10 max-w-[200px] shadow-2xl">
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1 glow-text">Vista 360°</p>
              <p className="text-xs text-white/60 leading-relaxed italic">"Arrastra para rotar el modelo y pulsa en un músculo para ver los ejercicios"</p>
            </div>
          </div>

          {/* Callout Controls */}
          <div className="absolute bottom-8 right-8 flex gap-4 z-20">
            <button className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center hover:bg-white/10 transition-all border border-white/5 hover:border-primary/30 text-white/50 hover:text-primary">
              <ZoomIn size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center hover:bg-white/10 transition-all border border-white/5 hover:border-primary/30 text-white/50 hover:text-primary">
              <Maximize2 size={18} />
            </button>
          </div>
        </section>

        {/* Right Panel - Exercise Selection */}
        <aside className="w-96 flex flex-col z-20 border-l border-white/5">
          <ExercisePanel />
        </aside>

      </main>

      {/* Footer - Routine Progress Bar */}
      <footer className="h-20 glass-panel border-t border-white/5 flex items-center px-8 gap-8 z-30">
        <div className="w-1/4">
          <div className="flex justify-between items-end mb-1">
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Rutina Actual</p>
            <p className="text-[10px] text-primary font-bold">45%</p>
          </div>
          <h4 className="text-sm font-bold truncate">Full Body Calistenia - Nivel 2</h4>
          <div className="w-full h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
            <div className="w-[45%] h-full bg-primary shadow-[0_0_10px_rgba(0,163,255,0.5)] transition-all duration-1000" />
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center gap-12 border-x border-white/5">
          <div className="text-center">
            <p className="text-[10px] text-white/40 font-bold uppercase mb-1">Series</p>
            <p className="text-xl font-black">4 / 4</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-white/40 font-bold uppercase mb-1">Reps</p>
            <p className="text-xl font-black">12</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-white/40 font-bold uppercase mb-1">Descanso</p>
            <p className="text-xl font-black text-primary glow-text">60s</p>
          </div>
        </div>

        <div className="w-1/4 flex items-center justify-end gap-4">
          <div className="text-right">
            <p className="text-[10px] text-white/40 font-bold uppercase mb-1">Músculo en Foco</p>
            <p className="text-sm font-bold text-accent glow-text uppercase tracking-tight">Seleccionar...</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-[0_0_20px_rgba(255,77,0,0.1)]">
            <Activity className="text-accent" size={24} />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
