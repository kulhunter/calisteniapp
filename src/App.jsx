import React from 'react';
import { RoutineSelector } from './components/RoutineSelector';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { useExerciseStore } from './hooks/useExercise';
import { SEO } from './components/SEO';
import { User } from 'lucide-react';

function App() {
  const { activeRoutine } = useExerciseStore();

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden font-['Outfit']">
      <SEO />

      {/* Header */}
      {!activeRoutine && (
        <header className="h-16 glass-panel border-b border-white/5 flex items-center justify-between px-8 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_var(--primary-glow)]">
              <span className="font-bold text-black text-xl">C</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase glow-text">Calisteniapp</h1>
          </div>
          
          <div className="flex items-center gap-6 text-white/50">
            <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5">
              <User size={18} />
              <span className="text-xs font-medium">Mi Perfil</span>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeRoutine ? (
          <WorkoutPlayer />
        ) : (
          <RoutineSelector />
        )}
      </main>
    </div>
  );
}

export default App;
