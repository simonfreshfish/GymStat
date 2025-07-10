import { WorkoutSet, Exercise, WorkoutDay } from '../types/workout';

export const calculateOneRepMax = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
};

export const getExerciseStats = (exercise: Exercise) => {
  const completedSets = exercise.sets.filter(set => set.completed && set.weight > 0 && set.reps > 0);
  const allSets = exercise.sets.filter(set => set.weight > 0 && set.reps > 0);
  
  let completedStats = { oneRepMax: 0, totalWeight: 0, bestComparison: null };
  if (completedSets.length > 0) {
    const oneRepMaxes = completedSets.map(set => calculateOneRepMax(set.weight, set.reps));
    const oneRepMax = Math.max(...oneRepMaxes);
    const totalWeight = completedSets.reduce((total, set) => total + (set.weight * set.reps), 0);
    completedStats = { oneRepMax, totalWeight, bestComparison: true };
  }
  
  let previewStats = { oneRepMax: 0, totalWeight: 0, bestComparison: null };
  if (allSets.length > 0) {
    const oneRepMaxes = allSets.map(set => calculateOneRepMax(set.weight, set.reps));
    const oneRepMax = Math.max(...oneRepMaxes);
    const totalWeight = allSets.reduce((total, set) => total + (set.weight * set.reps), 0);
    previewStats = { oneRepMax, totalWeight, bestComparison: true };
  }
  
  return { completed: completedStats, preview: previewStats };
};

export const getDayStats = (dayExercises: Exercise[]) => {
  const completedSets = dayExercises.flatMap(ex => 
    ex.sets.filter(set => set.completed && set.weight > 0 && set.reps > 0)
  );
  const allSets = dayExercises.flatMap(ex => 
    ex.sets.filter(set => set.weight > 0 && set.reps > 0)
  );
  
  let completedStats = { totalWeight: 0, bestComparison: null, exerciseCount: 0, setCount: 0 };
  if (completedSets.length > 0) {
    const totalWeight = completedSets.reduce((total, set) => total + (set.weight * set.reps), 0);
    const exerciseCount = dayExercises.filter(ex => 
      ex.sets.some(set => set.completed && set.weight > 0 && set.reps > 0)
    ).length;
    const setCount = completedSets.length;
    completedStats = { totalWeight, bestComparison: true, exerciseCount, setCount };
  }
  
  let previewStats = { totalWeight: 0, bestComparison: null, exerciseCount: 0, setCount: 0 };
  if (allSets.length > 0) {
    const totalWeight = allSets.reduce((total, set) => total + (set.weight * set.reps), 0);
    const exerciseCount = dayExercises.filter(ex => 
      ex.sets.some(set => set.weight > 0 && set.reps > 0)
    ).length;
    const setCount = allSets.length;
    previewStats = { totalWeight, bestComparison: true, exerciseCount, setCount };
  }
  
  return { completed: completedStats, preview: previewStats };
};