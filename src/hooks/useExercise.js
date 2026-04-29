import { create } from 'zustand';

export const useExerciseStore = create((set) => ({
  selectedMuscle: null,
  selectedExercise: null,
  activeRoutine: null,
  currentStep: 0,
  workoutState: 'idle', // 'idle', 'running', 'resting', 'finished'

  setSelectedMuscle: (muscle) => set({ selectedMuscle: muscle }),
  setSelectedExercise: (exercise) => set({ selectedExercise: exercise }),
  
  startRoutine: (routine) => set({ 
    activeRoutine: routine, 
    currentStep: 0, 
    workoutState: 'running' 
  }),
  nextStep: () => set((state) => {
    if (!state.activeRoutine) return state;
    const nextIdx = state.currentStep + 1;
    if (nextIdx >= state.activeRoutine.exercises.length) {
      return { workoutState: 'finished' };
    }
    return { currentStep: nextIdx, workoutState: 'running' };
  }),
  setWorkoutState: (newState) => set({ workoutState: newState }),
  endRoutine: () => set({ activeRoutine: null, currentStep: 0, workoutState: 'idle' }),
  
  reset: () => set({ selectedMuscle: null, selectedExercise: null, activeRoutine: null, workoutState: 'idle' }),
}));
