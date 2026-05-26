import { create } from 'zustand';

export const useExerciseStore = create((set) => ({
  selectedMuscle: null,
  selectedExercise: null,
  currentAnimation: null,
  animationSpeed: 1.0,
  isPlaying: true,
  
  // New Workout State
  activeWorkoutMode: false,
  workoutReps: 0,
  workoutSets: 1,
  workoutTimer: 0,

  setSelectedMuscle: (muscle) => set({ selectedMuscle: muscle }),
  setSelectedExercise: (exercise) => set({ selectedExercise: exercise, workoutReps: 0, workoutTimer: 0 }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  // New Workout Actions
  setActiveWorkoutMode: (active) => set({ activeWorkoutMode: active, workoutReps: 0, workoutTimer: 0, isPlaying: true }),
  setWorkoutReps: (reps) => set({ workoutReps: reps }),
  setWorkoutSets: (sets) => set({ workoutSets: sets }),
  setWorkoutTimer: (timer) => set({ workoutTimer: timer }),
  
  reset: () => set({ 
    selectedMuscle: null, 
    selectedExercise: null, 
    currentAnimation: null,
    activeWorkoutMode: false,
    workoutReps: 0,
    workoutSets: 1,
    workoutTimer: 0,
    isPlaying: true,
    animationSpeed: 1.0
  }),
}));
