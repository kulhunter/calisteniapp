import React, { useState } from 'react';
import exercises from '../data/hasan_exercises.json';
import { X, Plus, Trash2, Save, ChevronRight, Search } from 'lucide-react';

export const CustomRoutineBuilder = ({ onSave, onCancel }) => {
  const [name, setName] = useState('Mi Rutina Personalizada');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = exercises.filter(ex => 
    ex.name_es?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.name_en?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 20);

  const addExercise = (ex) => {
    setSelectedExercises([...selectedExercises, {
      ...ex,
      name_es: ex.name_es || ex.name_en || ex.name,
      work_time: 45,
      rest_time: 15,
      tempo: '2-0-2',
      instructions: ex.instruction_steps?.es || ex.instruction_steps?.en || ["Realiza el movimiento con control."]
    }]);
  };

  const removeExercise = (index) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newRoutine = {
      id: `custom_${Date.now()}`,
      name,
      category: 'Personalizada',
      description: 'Tu propio plan de entrenamiento diseñado a medida.',
      level: 'Mi Nivel',
      duration: `${selectedExercises.length * 2} min`,
      exercises: selectedExercises
    };
    onSave(newRoutine);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#030014] flex flex-col md:flex-row p-6 md:p-12 overflow-hidden">
      {/* Left side: Search and Selection */}
      <div className="w-full md:w-1/2 flex flex-col h-full pr-0 md:pr-12 mb-12 md:mb-0 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black">CREAR MI PLAN</h2>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X />
          </button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input 
            type="text" 
            placeholder="Buscar ejercicios (flexiones, sentadillas...)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 font-bold outline-none focus:border-primary transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-4">
          {filteredExercises.map(ex => (
            <div key={ex.id} className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden">
                  <img src={`/${ex.gif_url}`} alt={ex.name_es} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-sm">{ex.name_es || ex.name_en || ex.name}</p>
                  <p className="text-[10px] text-white/40 uppercase font-black">{ex.target}</p>
                </div>
              </div>
              <button 
                onClick={() => addExercise(ex)}
                className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-black transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Current Routine */}
      <div className="w-full md:w-1/2 flex flex-col h-full bg-white/5 rounded-[40px] p-8 md:p-12 border border-white/5 overflow-hidden">
        <input 
          type="text" 
          className="bg-transparent border-none text-3xl font-black text-primary mb-8 outline-none"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className="flex-1 overflow-y-auto mb-8 pr-4 space-y-4">
          {selectedExercises.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <Plus size={48} className="mb-4" />
              <p className="font-bold">Añade ejercicios de la lista izquierda</p>
            </div>
          )}
          {selectedExercises.map((ex, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-[#030014] rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <span className="text-white/20 font-black text-xs">{i+1}</span>
                <p className="font-bold text-sm">{ex.name_es || ex.name_en || ex.name}</p>
              </div>
              <button onClick={() => removeExercise(i)} className="text-red-500/50 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <button 
          disabled={selectedExercises.length === 0}
          onClick={handleSave}
          className="btn-primary w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 disabled:opacity-30 transition-all shadow-[0_0_30px_var(--primary-glow)]"
        >
          <Save size={24} /> GUARDAR MI PLAN
        </button>
      </div>
    </div>
  );
};
