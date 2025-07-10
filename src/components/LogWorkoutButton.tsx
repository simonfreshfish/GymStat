import React from 'react';
import { Save } from 'lucide-react';
import { Exercise, WorkoutLog, WeightUnit } from '../types/workout';
import { calculateOneRepMax } from '../utils/workoutCalculations';
import { convertWeight, formatWeight, getUnitLabel } from '../utils/unitConversion';
import { useVisualSettings } from './VisualSettingsProvider';
import { useVibe } from './VibeProvider';
import { getVibeClasses } from '../utils/vibeSettings';

interface LogWorkoutButtonProps {
  exercises: Exercise[];
  currentDayName: string;
  isDarkMode: boolean;
  weightUnit: WeightUnit;
  onLogWorkout: (log: WorkoutLog) => void;
  onResetCompletedSets: () => void;
}

const LogWorkoutButton: React.FC<LogWorkoutButtonProps> = ({
  exercises,
  currentDayName,
  isDarkMode,
  weightUnit,
  onLogWorkout,
  onResetCompletedSets
}) => {
  const { settings } = useVisualSettings();
  const { vibeSettings } = useVibe();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  const isMobile = settings.screenOptimization === 'smartphone';
  
  const hasCompletedSets = exercises.some(ex => 
    ex.sets.some(set => set.completed && set.weight > 0 && set.reps > 0)
  );

  const handleLogWorkout = () => {
    if (!hasCompletedSets) return;

    const now = new Date();
    const workoutLog: WorkoutLog = {
      id: `workout_${now.getTime()}`,
      dayName: currentDayName,
      date: now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      timestamp: now.getTime(),
      exercises: exercises
        .filter(ex => ex.sets.some(set => set.completed && set.weight > 0 && set.reps > 0))
        .map(ex => {
          const completedSets = ex.sets.filter(set => set.completed && set.weight > 0 && set.reps > 0);
          const totalWeight = completedSets.reduce((total, set) => total + (set.weight * set.reps), 0);
          const oneRepMaxes = completedSets.map(set => calculateOneRepMax(set.weight, set.reps));
          const oneRepMax = Math.max(...oneRepMaxes);
          
          return {
            name: ex.name,
            sets: completedSets,
            totalWeight,
            oneRepMax
          };
        }),
      totalWeight: 0,
      totalSets: 0,
      completedSets: 0
    };

    // Calculate totals
    workoutLog.totalWeight = workoutLog.exercises.reduce((total, ex) => total + ex.totalWeight, 0);
    workoutLog.completedSets = workoutLog.exercises.reduce((total, ex) => total + ex.sets.length, 0);
    workoutLog.totalSets = exercises.reduce((total, ex) => total + ex.sets.length, 0);

    onLogWorkout(workoutLog);
    onResetCompletedSets();
  };

  if (!hasCompletedSets) return null;

  const completedExerciseCount = exercises.filter(ex => ex.sets.some(set => set.completed)).length;

  // Get button styling based on vibe
  const getButtonStyling = () => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return {
        className: `w-full font-black tracking-wider text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg rounded-lg bg-black border-2 border-white text-white hover:bg-gray-900 hover:border-red-400 transform hover:scale-105 active:scale-95 clip-path-jagged-button ${
          isMobile ? 'py-4 mx-2' : 'py-4'
        }`,
        style: {
          fontFamily: 'system-ui, -apple-system, sans-serif', 
          letterSpacing: '0.1em',
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
        }
      };
    }
    
    return {
      className: `w-full font-black tracking-wider text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg rounded-lg ${
        isMobile ? 'py-4 mx-2' : 'py-4'
      } ${
        isDarkMode
          ? 'bg-green-600 text-white hover:bg-green-700 border-2 border-green-400'
          : 'bg-green-500 text-white hover:bg-green-600 border-2 border-green-300'
      }`,
      style: { fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }
    };
  };

  const buttonStyling = getButtonStyling();

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${isMobile ? 'p-2 safe-area-bottom' : 'p-4'}`}>
      <button
        onClick={handleLogWorkout}
        className={buttonStyling.className}
        style={buttonStyling.style}
      >
        <Save size={24} />
        <span>LOG WORKOUT</span>
        <span className="text-sm opacity-75 font-medium">
          ({completedExerciseCount} exercise{completedExerciseCount === 1 ? '' : 's'})
        </span>
      </button>
    </div>
  );
};

export default LogWorkoutButton;