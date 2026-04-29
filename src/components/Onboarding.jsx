import React, { useState } from 'react';
import { ChevronRight, ShieldCheck, User, Activity } from 'lucide-react';
import { useGamificationStore } from '../hooks/useGamification';

export const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    pushups: ''
  });

  const next = () => setStep(s => s + 1);

  const calculateScores = () => {
    const heightM = data.height / 100;
    const imc = (data.weight / (heightM * heightM)).toFixed(1);
    
    let strengthLevel = 'Principiante';
    const pushups = parseInt(data.pushups);
    if (pushups > 30) strengthLevel = 'Master';
    else if (pushups > 15) strengthLevel = 'Avanzado';
    else if (pushups > 5) strengthLevel = 'Intermedio';

    return { imc, strengthLevel };
  };

  const save = () => {
    const scores = calculateScores();
    const userProfile = { ...data, ...scores };
    localStorage.setItem('calisteniapp_user', JSON.stringify(userProfile));
    
    // Set initial world based on strength
    const { setWorld } = useGamificationStore.getState();
    if (scores.strengthLevel === 'Master') {
      setWorld('world_3');
    } else if (scores.strengthLevel === 'Avanzado' || scores.strengthLevel === 'Intermedio') {
      setWorld('world_2');
    } else {
      setWorld('world_1');
    }
    
    onComplete();
  };

  const steps = [
    {
      title: "Bienvenido a Calisteniapp Pro",
      subtitle: "Tu entrenador personal inteligente basado en calistenia pura.",
      content: (
        <div className="flex flex-col items-center gap-10 py-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full group-hover:bg-primary/30 transition-all" />
            <img src="/logo.png" alt="Logo" className="w-48 h-48 relative drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]" />
          </div>
          <div className="glass-panel p-8 rounded-3xl border border-white/10 max-w-md text-left space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Activity size={20} />
              <span className="font-black text-xs uppercase tracking-widest">¿Cómo funciona?</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Analizaremos tu <strong>IMC</strong> y <strong>resistencia física</strong> para recomendarte las mejores rutinas. Tendrás acceso a cientos de ejercicios con técnica guiada y cronómetros profesionales.
            </p>
          </div>
          <button onClick={next} className="btn-primary px-16 py-5 rounded-2xl font-black text-xl uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(168,85,247,0.4)]">
            CONTINUAR
          </button>
        </div>
      )
    },
    {
      title: "¿Tu Nombre?",
      subtitle: "Para personalizar tu plan de entrenamiento.",
      content: (
        <div className="flex flex-col gap-8 w-full max-w-md mx-auto py-10">
          <div className="glass-panel p-8 rounded-[32px] border border-white/10 focus-within:border-primary/50 transition-all">
            <input 
              type="text" 
              placeholder="Escribe tu nombre..."
              className="w-full bg-transparent border-none text-4xl font-black focus:outline-none placeholder:text-white/10"
              value={data.name}
              onChange={e => setData({...data, name: e.target.value})}
              autoFocus
            />
          </div>
          <button disabled={!data.name} onClick={next} className="btn-primary w-full py-6 rounded-2xl font-black text-xl uppercase tracking-widest disabled:opacity-30">
            SIGUIENTE
          </button>
        </div>
      )
    },
    {
      title: "Medidas Pro",
      subtitle: "Calcularemos tu IMC para ajustar la intensidad.",
      content: (
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto py-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-3xl border border-white/10">
              <p className="text-[10px] font-black text-white/30 uppercase mb-4 tracking-widest">Edad</p>
              <input 
                type="number" 
                placeholder="00"
                className="w-full bg-transparent border-none text-4xl font-black focus:outline-none"
                value={data.age}
                onChange={e => setData({...data, age: e.target.value})}
              />
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-white/10">
              <p className="text-[10px] font-black text-white/30 uppercase mb-4 tracking-widest">Peso (kg)</p>
              <input 
                type="number" 
                placeholder="00"
                className="w-full bg-transparent border-none text-4xl font-black focus:outline-none"
                value={data.weight}
                onChange={e => setData({...data, weight: e.target.value})}
              />
            </div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <p className="text-[10px] font-black text-white/30 uppercase mb-4 tracking-widest">Altura (cm)</p>
            <input 
              type="number" 
              placeholder="000"
              className="w-full bg-transparent border-none text-4xl font-black focus:outline-none"
              value={data.height}
              onChange={e => setData({...data, height: e.target.value})}
            />
          </div>
          <button disabled={!data.age || !data.weight || !data.height} onClick={next} className="btn-primary w-full py-6 rounded-2xl font-black text-xl uppercase tracking-widest disabled:opacity-30">
            SIGUIENTE
          </button>
        </div>
      )
    },
    {
      title: "Test de Resistencia",
      subtitle: "¿Cuántas flexiones puedes hacer sin parar?",
      content: (
        <div className="flex flex-col gap-8 w-full max-w-md mx-auto py-10">
          <div className="glass-panel p-10 rounded-[40px] border border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Activity className="text-primary opacity-20" size={64} />
            </div>
            <input 
              type="number" 
              placeholder="0"
              className="w-full bg-transparent border-none text-8xl font-black text-center focus:outline-none mb-6 text-primary"
              value={data.pushups}
              onChange={e => setData({...data, pushups: e.target.value})}
              autoFocus
            />
            <p className="text-sm text-white/40 font-medium">Flexiones seguidas</p>
          </div>
          <button disabled={!data.pushups} onClick={save} className="btn-primary w-full py-6 rounded-2xl font-black text-xl uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(168,85,247,0.4)]">
            CREAR MI PERFIL PRO
          </button>
        </div>
      )
    }
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[100] bg-[#030014] flex items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-12 bg-primary shadow-[0_0_10px_var(--primary-glow)]' : 'w-3 bg-white/10'}`} />
          ))}
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">{current.title}</h2>
        <p className="text-white/40 text-lg md:text-xl font-medium max-w-md mx-auto">{current.subtitle}</p>
        
        {current.content}

        <div className="mt-12 flex items-center justify-center gap-2 text-white/20">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tus datos se guardan localmente</span>
        </div>
      </div>
    </div>
  );
};
