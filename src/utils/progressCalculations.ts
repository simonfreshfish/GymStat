import { WorkoutLog, ProgressDataPoint, TrainingFrequency, WorkoutDay } from '../types/workout';
import { getCombinedExerciseHistory } from './exerciseLibrary';

export const trainingFrequencies: TrainingFrequency[] = [
  { label: "Once per week", value: 1, weeklyIncrease: 1.47 },
  { label: "Twice per week", value: 2, weeklyIncrease: 2.17 },
  { label: "Thrice per week", value: 3, weeklyIncrease: 2.61 }
];

export const getExerciseProgressData = (
  exerciseName: string, 
  workoutHistory: WorkoutLog[],
  workoutDays?: WorkoutDay[]
): ProgressDataPoint[] => {
  const exerciseData: ProgressDataPoint[] = [];
  
  // Use combined history if workoutDays is provided, otherwise use old method
  if (workoutDays) {
    const combinedHistory = getCombinedExerciseHistory(exerciseName, workoutDays, workoutHistory);
    
    combinedHistory.forEach(entry => {
      const averageWeight = entry.sets.length > 0 
        ? entry.sets.reduce((sum: number, set: any) => sum + set.weight, 0) / entry.sets.length
        : 0;
      
      exerciseData.push({
        date: entry.date,
        timestamp: entry.timestamp,
        oneRepMax: entry.oneRepMax,
        totalWeight: entry.totalWeight,
        averageWeight: Math.round(averageWeight * 100) / 100,
        isProjection: false
      });
    });
  } else {
    // Fallback to old method for backward compatibility
    const relevantWorkouts = workoutHistory
      .filter(workout => workout.exercises.some(ex => ex.name === exerciseName))
      .sort((a, b) => a.timestamp - b.timestamp);
    
    relevantWorkouts.forEach(workout => {
      const exercise = workout.exercises.find(ex => ex.name === exerciseName);
      if (exercise) {
        const averageWeight = exercise.sets.length > 0 
          ? exercise.sets.reduce((sum, set) => sum + set.weight, 0) / exercise.sets.length
          : 0;
        
        exerciseData.push({
          date: workout.date,
          timestamp: workout.timestamp,
          oneRepMax: exercise.oneRepMax,
          totalWeight: exercise.totalWeight,
          averageWeight: Math.round(averageWeight * 100) / 100,
          isProjection: false
        });
      }
    });
  }
  
  return exerciseData;
};

export const generateProjections = (
  historicalData: ProgressDataPoint[],
  frequency: TrainingFrequency,
  weeksAhead: number = 12
): ProgressDataPoint[] => {
  if (historicalData.length === 0) return [];
  
  const lastDataPoint = historicalData[historicalData.length - 1];
  const projections: ProgressDataPoint[] = [];
  
  // Calculate weekly increase as a decimal (e.g., 1.47% = 0.0147)
  const weeklyIncreaseDecimal = frequency.weeklyIncrease / 100;
  
  for (let week = 1; week <= weeksAhead; week++) {
    const projectionDate = new Date(lastDataPoint.timestamp + (week * 7 * 24 * 60 * 60 * 1000));
    const growthFactor = Math.pow(1 + weeklyIncreaseDecimal, week);
    
    projections.push({
      date: projectionDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      timestamp: projectionDate.getTime(),
      oneRepMax: Math.round(lastDataPoint.oneRepMax * growthFactor),
      totalWeight: Math.round(lastDataPoint.totalWeight * growthFactor),
      averageWeight: Math.round(lastDataPoint.averageWeight * growthFactor * 100) / 100,
      isProjection: true
    });
  }
  
  return projections;
};

export const combineHistoricalAndProjected = (
  historical: ProgressDataPoint[],
  projected: ProgressDataPoint[]
): ProgressDataPoint[] => {
  return [...historical, ...projected];
};