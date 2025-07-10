export interface WorkoutSet {
  weight: number;
  reps: number;
  completed: boolean;
  hasOlympicBar: boolean;
}

export interface Exercise {
  id: number;
  name: string;
  sets: WorkoutSet[];
  history: WorkoutHistoryEntry[];
}

export interface WorkoutDay {
  id: number;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutLog {
  id: string;
  dayName: string;
  date: string;
  timestamp: number;
  exercises: {
    name: string;
    sets: WorkoutSet[];
    totalWeight: number;
    oneRepMax: number;
  }[];
  totalWeight: number;
  totalSets: number;
  completedSets: number;
}

export interface WorkoutHistoryEntry {
  date: string;
  totalWeight: number;
  oneRepMax: number;
  sets: { weight: number; reps: number }[];
  volume: number;
}

export interface WeightComparison {
  name: string;
  weight: number;
  plural: string;
  count: number;
  actualWeight: number;
  accuracy: number;
  difference: number;
}

export interface ProgressDataPoint {
  date: string;
  timestamp: number;
  oneRepMax: number;
  totalWeight: number;
  averageWeight: number;
  isProjection?: boolean;
}

export interface TrainingFrequency {
  label: string;
  value: number;
  weeklyIncrease: number;
}

// Enhanced Exercise Library Types with Muscle Groups
export interface ExerciseLibraryEntry {
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  lastUsed: number;
  timesUsed: number;
  isCustom?: boolean; // Track if user added this exercise
}

export interface ExerciseLibrary {
  exercises: ExerciseLibraryEntry[];
}

export interface CardioSession {
  id: string;
  activityType: 'running' | 'cycling' | 'swimming' | 'rowing' | 'elliptical' | 'stairmaster' | 'hiking' | 'other';
  date: string;
  timestamp: number;
  duration: number; // in minutes
  distance?: number; // in miles/km based on user preference
  calories?: number;
  notes?: string;
  customActivityName?: string; // Custom name for 'other' activity type
  heartRate?: {
    average?: number;
    max?: number;
  };
}

export type WeightUnit = 'lbs' | 'kg';
export type DistanceUnit = 'mi' | 'km';

// Re-export from settings for convenience
export type { VibeMode } from './settings';