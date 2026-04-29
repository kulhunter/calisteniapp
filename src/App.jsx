import React from 'react';
import { RoutineSelector } from './components/RoutineSelector';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { useExerciseStore } from './hooks/useExercise';
import { SEO } from './components/SEO';
import { User, Settings } from 'lucide-react';
import { Onboarding } from './components/Onboarding';

function App() {
  const { activeRoutine } = useExerciseStore();
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
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
        <header className="h-16 glass-panel border-b border-white/5 flex items-center justify-between px-8 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Calisteniapp Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_var(--primary-glow)]" />
            <h1 className="text-xl font-black tracking-tighter uppercase glow-text">Calisteniapp</h1>
          </div>
          
          <div className="flex items-center gap-6 text-white/50">
            <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 group">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                <User size={14} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">{userData?.name || 'Invitado'}</span>
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
