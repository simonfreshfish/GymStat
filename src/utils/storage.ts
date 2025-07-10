import { WorkoutDay, WorkoutLog, WeightUnit } from '../types/workout';

const STORAGE_KEYS = {
  WORKOUT_DAYS: 'workoutDays',
  WORKOUT_HISTORY: 'workoutHistory',
  CARDIO_HISTORY: 'cardioHistory',
  DARK_MODE: 'darkMode',
  WEIGHT_UNIT: 'weightUnit',
  DISTANCE_UNIT: 'distanceUnit'
};

// Function to clear all app data - MUST BE CALLED FIRST
export const clearAllData = (): void => {
  try {
    // Clear all app-specific localStorage keys
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Also clear other app data
    localStorage.removeItem('exerciseLibrary');
    localStorage.removeItem('cardioHistory');
    localStorage.removeItem('vibeSettings');
    localStorage.removeItem('visualSettings');
    
    console.log('✅ All app data cleared successfully');
  } catch (error) {
    console.error('❌ Failed to clear app data:', error);
  }
};

export const saveWorkoutDays = (workoutDays: WorkoutDay[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_DAYS, JSON.stringify(workoutDays));
  } catch (error) {
    console.error('Failed to save workout days:', error);
  }
};

export const loadWorkoutDays = (): WorkoutDay[] | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKOUT_DAYS);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load workout days:', error);
    return null;
  }
};

export const saveWorkoutHistory = (history: WorkoutLog[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save workout history:', error);
  }
};

export const loadWorkoutHistory = (): WorkoutLog[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load workout history:', error);
    return [];
  }
};

export const saveDarkMode = (isDarkMode: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDarkMode));
  } catch (error) {
    console.error('Failed to save dark mode preference:', error);
  }
};

export const loadDarkMode = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    // Default to true (dark mode) if no preference is saved
    return saved ? JSON.parse(saved) : true;
  } catch (error) {
    console.error('Failed to load dark mode preference:', error);
    // Default to true (dark mode) on error
    return true;
  }
};

export const saveCardioHistory = (history: any[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CARDIO_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save cardio history:', error);
  }
};

export const loadCardioHistory = (): any[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CARDIO_HISTORY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load cardio history:', error);
    return [];
  }
};

export const saveDistanceUnit = (unit: 'mi' | 'km'): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DISTANCE_UNIT, JSON.stringify(unit));
  } catch (error) {
    console.error('Failed to save distance unit preference:', error);
  }
};

export const loadDistanceUnit = (): 'mi' | 'km' => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DISTANCE_UNIT);
    return saved ? JSON.parse(saved) : 'mi';
  } catch (error) {
    console.error('Failed to load distance unit preference:', error);
    return 'mi';
  }
};

export const saveWeightUnit = (unit: WeightUnit): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WEIGHT_UNIT, JSON.stringify(unit));
  } catch (error) {
    console.error('Failed to save weight unit preference:', error);
  }
};

export const loadWeightUnit = (): WeightUnit => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.WEIGHT_UNIT);
    return saved ? JSON.parse(saved) : 'lbs';
  } catch (error) {
    console.error('Failed to load weight unit preference:', error);
    return 'lbs';
  }
};