import { WorkoutLog, WorkoutDay, WeightUnit } from '../types/workout';
import { getMultipleWeightComparisons } from './weightComparisons';

export interface WrappedStats {
  totalWeightLifted: number;
  totalWorkouts: number;
  exerciseWithMostReps: {
    name: string;
    totalReps: number;
  } | null;
  mostCommonDay: {
    name: string;
    count: number;
  } | null;
  leastCommonDay: {
    name: string;
    count: number;
  } | null;
  highestPR: {
    exerciseName: string;
    weight: number;
    dayName: string;
  } | null;
  weightComparisons: any[];
  monthlyBreakdown: {
    month: string;
    weight: number;
    workouts: number;
  }[];
  streakData: {
    longestStreak: number;
    currentStreak: number;
  };
}

export const calculateWrappedStats = (
  workoutHistory: WorkoutLog[],
  workoutDays: WorkoutDay[],
  timePeriod: 'month' | 'year' = 'year',
  enabledCategories?: string[]
): WrappedStats => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // Filter workouts based on time period
  const filteredWorkouts = workoutHistory.filter(workout => {
    const workoutDate = new Date(workout.timestamp);
    const workoutYear = workoutDate.getFullYear();
    const workoutMonth = workoutDate.getMonth();
    
    if (timePeriod === 'year') {
      return workoutYear === currentYear;
    } else {
      return workoutYear === currentYear && workoutMonth === currentMonth;
    }
  });

  // Total weight lifted
  const totalWeightLifted = filteredWorkouts.reduce((total, workout) => total + workout.totalWeight, 0);

  // Total workouts
  const totalWorkouts = filteredWorkouts.length;

  // Exercise with most reps
  const exerciseReps: { [key: string]: number } = {};
  filteredWorkouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const totalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0);
      exerciseReps[exercise.name] = (exerciseReps[exercise.name] || 0) + totalReps;
    });
  });

  const exerciseWithMostReps = Object.keys(exerciseReps).length > 0 
    ? Object.entries(exerciseReps).reduce((max, [name, reps]) => 
        reps > max.totalReps ? { name, totalReps: reps } : max, 
        { name: '', totalReps: 0 }
      )
    : null;

  // Most and least common days
  const dayCount: { [key: string]: number } = {};
  filteredWorkouts.forEach(workout => {
    dayCount[workout.dayName] = (dayCount[workout.dayName] || 0) + 1;
  });

  const dayEntries = Object.entries(dayCount);
  const mostCommonDay = dayEntries.length > 0 
    ? dayEntries.reduce((max, [name, count]) => 
        count > max.count ? { name, count } : max, 
        { name: '', count: 0 }
      )
    : null;

  const leastCommonDay = dayEntries.length > 1 
    ? dayEntries.reduce((min, [name, count]) => 
        count < min.count ? { name, count } : min, 
        { name: dayEntries[0][0], count: dayEntries[0][1] }
      )
    : null;

  // Highest PR
  let highestPR: { exerciseName: string; weight: number; dayName: string } | null = null;
  filteredWorkouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (!highestPR || exercise.oneRepMax > highestPR.weight) {
        highestPR = {
          exerciseName: exercise.name,
          weight: exercise.oneRepMax,
          dayName: workout.dayName
        };
      }
    });
  });

  // Weight comparisons - now filtered by enabled categories if provided
  const weightComparisons = getMultipleWeightComparisons(totalWeightLifted, 5, enabledCategories);

  // Monthly breakdown (for year view) or daily breakdown (for month view)
  const monthlyData: { [key: string]: { weight: number; workouts: number } } = {};
  filteredWorkouts.forEach(workout => {
    const date = new Date(workout.timestamp);
    let key: string;
    
    if (timePeriod === 'year') {
      key = date.toLocaleDateString('en-US', { month: 'short' });
    } else {
      key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    if (!monthlyData[key]) {
      monthlyData[key] = { weight: 0, workouts: 0 };
    }
    
    monthlyData[key].weight += workout.totalWeight;
    monthlyData[key].workouts += 1;
  });

  const monthlyBreakdown = Object.entries(monthlyData).map(([period, data]) => ({
    month: period,
    weight: data.weight,
    workouts: data.workouts
  }));

  // Streak calculation
  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => a.timestamp - b.timestamp);
  let longestStreak = 0;
  let currentStreak = 0;
  let lastWorkoutDate: Date | null = null;

  sortedWorkouts.forEach(workout => {
    const workoutDate = new Date(workout.timestamp);
    
    if (lastWorkoutDate) {
      const daysDiff = Math.floor((workoutDate.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) { // Within a week
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    
    lastWorkoutDate = workoutDate;
  });
  
  longestStreak = Math.max(longestStreak, currentStreak);

  // Calculate current streak from today
  const today = new Date();
  const lastWorkout = sortedWorkouts[sortedWorkouts.length - 1];
  const daysSinceLastWorkout = lastWorkout 
    ? Math.floor((today.getTime() - lastWorkout.timestamp) / (1000 * 60 * 60 * 24))
    : Infinity;
  
  const actualCurrentStreak = daysSinceLastWorkout <= 7 ? currentStreak : 0;

  return {
    totalWeightLifted,
    totalWorkouts,
    exerciseWithMostReps,
    mostCommonDay,
    leastCommonDay,
    highestPR,
    weightComparisons,
    monthlyBreakdown,
    streakData: {
      longestStreak,
      currentStreak: actualCurrentStreak
    }
  };
};