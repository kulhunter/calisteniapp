import { create } from 'zustand';

export const useExerciseStore = create((set) => ({
  selectedMuscle: null,
  selectedExercise: null,
  currentAnimation: null,
  animationSpeed: 1,
  isPlaying: true,

  setSelectedMuscle: (muscle) => set({ selectedMuscle: muscle }),
  setSelectedExercise: (exercise) => set({ selectedExercise: exercise }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  reset: () => set({ selectedMuscle: null, selectedExercise: null, currentAnimation: null }),
}));
