import React from 'react';
import { RoutineSelector } from './components/RoutineSelector';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { useExerciseStore } from './hooks/useExercise';
import { SEO } from './components/SEO';
import { Onboarding } from './components/Onboarding';
import { useGamificationStore } from './hooks/useGamification';
import { WorldsMap } from './components/WorldsMap';
import { User, Flame, Award, Zap, Trophy, LayoutGrid, Map as MapIcon, Settings } from 'lucide-react';

function App() {
  const { activeRoutine } = useExerciseStore();
  const { streak, level, xp, updateStreak } = useGamificationStore();
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [userData, setUserData] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('map'); // 'map', 'library', 'profile'

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

  // Calculate XP progress to next level (500 XP per level)
  const xpInLevel = xp % 500;
  const progressPercent = (xpInLevel / 500) * 100;

  return (
    <div className="flex flex-col h-screen bg-[#030014] text-white overflow-hidden font-['Outfit'] selection:bg-primary/30">
      <SEO />
      
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      {/* Premium Header */}
      {!activeRoutine && (
        <header className="h-20 bg-[#030014]/80 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-6 md:px-12 z-50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all" />
              <img src="/logo.png" alt="Logo" className="w-12 h-12 relative object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tighter uppercase glow-text leading-none">Calisteniapp</h1>
              <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em] opacity-70">Pro Edition 4.0</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            {/* Gamification Stats */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 text-secondary">
                  <Flame size={18} className="fill-current animate-pulse" />
                  <span className="text-lg font-black">{streak}</span>
                </div>
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Racha</span>
              </div>
              
              {/* Circular Progress Level */}
              <div className="relative w-14 h-14 flex items-center justify-center group cursor-help">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                  <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary" 
                    strokeDasharray={150} strokeDashoffset={150 - (150 * progressPercent) / 100} strokeLinecap="round" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-primary group-hover:scale-125 transition-transform">{level}</span>
                  <span className="text-[6px] font-black text-white/40 uppercase">LVL</span>
                </div>
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
          <div className="h-full">
            {activeTab === 'map' && <WorldsMap />}
            {activeTab === 'library' && <RoutineSelector userData={userData} />}
            {activeTab === 'profile' && (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                <div className="w-32 h-32 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-8 shadow-2xl">
                  <User size={64} />
                </div>
                <h2 className="text-4xl font-black mb-2 uppercase">{userData?.name || 'Guerrero'}</h2>
                <p className="text-white/40 font-bold uppercase tracking-widest text-sm mb-12">Nivel {level} • {xp} XP Totales</p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <p className="text-[10px] font-black text-white/30 uppercase mb-2">Fuerza</p>
                      <p className="text-2xl font-black text-primary">{userData?.strengthLevel || 'N/A'}</p>
                   </div>
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <p className="text-[10px] font-black text-white/30 uppercase mb-2">IMC</p>
                      <p className="text-2xl font-black text-white">{userData?.imc || 'N/A'}</p>
                   </div>
                </div>
                <button onClick={() => {localStorage.clear(); window.location.reload();}} className="mt-12 text-[10px] font-black text-white/20 uppercase hover:text-red-500 transition-colors">Cerrar Sesión / Reiniciar Perfil</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Premium Bottom Navigation */}
      {!activeRoutine && (
        <nav className="h-20 bg-[#030014]/90 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around px-4 z-50 shrink-0 pb-2">
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'map' ? 'text-primary' : 'text-white/30 hover:text-white/60'}`}
          >
            <MapIcon size={activeTab === 'map' ? 24 : 20} strokeWidth={activeTab === 'map' ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest">Aventura</span>
          </button>
          <button 
            onClick={() => setActiveTab('library')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'library' ? 'text-primary' : 'text-white/30 hover:text-white/60'}`}
          >
            <LayoutGrid size={activeTab === 'library' ? 24 : 20} strokeWidth={activeTab === 'library' ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest">Biblioteca</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-primary' : 'text-white/30 hover:text-white/60'}`}
          >
            <User size={activeTab === 'profile' ? 24 : 20} strokeWidth={activeTab === 'profile' ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-widest">Perfil</span>
          </button>
        </nav>
      )}
    </div>
  );
}

export default App;
