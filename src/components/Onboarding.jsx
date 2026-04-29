import React, { useState } from 'react';
import { ChevronRight, ShieldCheck, User, Zap, Activity } from 'lucide-react';

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

  const save = () => {
    localStorage.setItem('calisteniapp_user', JSON.stringify(data));
    onComplete();
  };

  const steps = [
    {
      title: "Bienvenido a Calisteniapp Pro",
      subtitle: "Tu viaje hacia la fuerza sobrehumana comienza aquí.",
      content: (
        <div className="flex flex-col items-center gap-8 py-10">
          <img src="/logo.png" alt="Logo" className="w-32 h-32 drop-shadow-[0_0_30px_var(--primary-glow)]" />
          <button onClick={next} className="btn-primary px-12 py-5 rounded-2xl font-black text-2xl uppercase tracking-wider flex items-center gap-3">
            EMPEZAR <ChevronRight size={24} />
          </button>
        </div>
      )
    },
    {
      title: "¿Cómo te llamas?",
      subtitle: "Personalizaremos tu experiencia.",
      content: (
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto py-10">
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <div className="flex items-center gap-4 mb-4 text-primary">
              <User size={24} />
              <span className="font-bold uppercase tracking-widest text-xs">Información Básica</span>
            </div>
            <input 
              type="text" 
              placeholder="Tu nombre..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold focus:border-primary transition-all outline-none"
              value={data.name}
              onChange={e => setData({...data, name: e.target.value})}
            />
          </div>
          <button disabled={!data.name} onClick={next} className="btn-primary w-full py-5 rounded-2xl font-black text-xl uppercase disabled:opacity-50">
            SIGUIENTE
          </button>
        </div>
      )
    },
    {
      title: "Tus Medidas",
      subtitle: "Calcularemos el impacto de cada ejercicio.",
      content: (
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto py-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-3xl border border-white/10">
              <p className="text-[10px] font-black text-white/40 uppercase mb-4 tracking-widest">Edad</p>
              <input 
                type="number" 
                placeholder="Años"
                className="w-full bg-transparent border-none text-3xl font-black focus:outline-none"
                value={data.age}
                onChange={e => setData({...data, age: e.target.value})}
              />
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-white/10">
              <p className="text-[10px] font-black text-white/40 uppercase mb-4 tracking-widest">Peso (kg)</p>
              <input 
                type="number" 
                placeholder="Kg"
                className="w-full bg-transparent border-none text-3xl font-black focus:outline-none"
                value={data.weight}
                onChange={e => setData({...data, weight: e.target.value})}
              />
            </div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <p className="text-[10px] font-black text-white/40 uppercase mb-4 tracking-widest">Altura (cm)</p>
            <input 
              type="number" 
              placeholder="Cm"
              className="w-full bg-transparent border-none text-3xl font-black focus:outline-none"
              value={data.height}
              onChange={e => setData({...data, height: e.target.value})}
            />
          </div>
          <button disabled={!data.age || !data.weight || !data.height} onClick={next} className="btn-primary w-full py-5 rounded-2xl font-black text-xl uppercase disabled:opacity-50">
            SIGUIENTE
          </button>
        </div>
      )
    },
    {
      title: "Test de Fuerza",
      subtitle: "Dinos cuántas flexiones logras hacer en buena forma.",
      content: (
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto py-10">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center">
            <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_var(--primary-glow)]">
              <Zap size={40} fill="currentColor" />
            </div>
            <p className="text-sm text-white/60 mb-8 leading-relaxed">
              Las flexiones (push-ups) son el mejor indicador de tu nivel inicial de calistenia.
            </p>
            <input 
              type="number" 
              placeholder="Nº de Flexiones"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-6 text-5xl font-black text-center focus:border-primary transition-all outline-none mb-4"
              value={data.pushups}
              onChange={e => setData({...data, pushups: e.target.value})}
            />
            <div className="flex justify-between text-[10px] font-black text-white/30 uppercase tracking-widest">
              <span>0-5 Principiante</span>
              <span>20+ Pro</span>
            </div>
          </div>
          <button disabled={!data.pushups} onClick={save} className="btn-primary w-full py-5 rounded-2xl font-black text-xl uppercase disabled:opacity-50">
            FINALIZAR PERFIL
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
