import React from 'react';
import { RoutineSelector } from './components/RoutineSelector';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { useExerciseStore } from './hooks/useExercise';
import { SEO } from './components/SEO';
import { Onboarding } from './components/Onboarding';
import { useGamificationStore } from './hooks/useGamification';
import { User, Flame, Award, Zap, Trophy } from 'lucide-react';

function App() {
  const { activeRoutine } = useExerciseStore();
  const { streak, level, xp, updateStreak } = useGamificationStore();
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    updateStreak();
    const saved = localStorage.getItem('calisteniapp_user');
    if (!saved) {
      setShowOnboarding(true);
    } else {
      setUserData(JSON.parse(saved));
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setUserData(JSON.parse(localStorage.getItem('calisteniapp_user')));
  };

  return (
    <div className="flex flex-col h-screen bg-[#030014] text-white overflow-hidden font-['Outfit']">
      <SEO />
      
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      {/* Header */}
      {!activeRoutine && (
        <header className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-6 md:px-12 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            <div className="hidden md:block">
              <h1 className="text-xl font-black tracking-tighter uppercase glow-text leading-none">Calisteniapp</h1>
              <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Pro Edition</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-8">
            {/* Gamification Stats */}
            <div className="flex items-center gap-4 md:gap-6 border-r border-white/10 pr-6 mr-2">
              <div className="flex flex-col items-center gap-0.5 group cursor-help">
                <div className="flex items-center gap-1.5 text-secondary">
                  <Flame size={18} className="fill-current animate-pulse" />
                  <span className="text-lg font-black">{streak}</span>
                </div>
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest group-hover:text-secondary transition-colors">Racha</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 group cursor-help">
                <div className="flex items-center gap-1.5 text-primary">
                  <Award size={18} />
                  <span className="text-lg font-black">{level}</span>
                </div>
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest group-hover:text-primary transition-colors">Nivel</span>
              </div>
            </div>

            <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-all p-2 rounded-2xl group border border-transparent hover:border-white/10">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                <User size={20} />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Guerrero</span>
                <span className="text-xs font-black uppercase tracking-tight">{userData?.name || 'Invitado'}</span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeRoutine ? (
          <WorkoutPlayer />
        ) : (
          <RoutineSelector userData={userData} />
        )}
      </main>
    </div>
  );
}

export default App;
