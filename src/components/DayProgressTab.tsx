import React from 'react';
import { WorkoutDay, WorkoutLog, WeightUnit } from '../types/workout';
import ExerciseProgressCard from './ExerciseProgressCard';

interface DayProgressTabProps {
  day: WorkoutDay;
  workoutHistory: WorkoutLog[];
  workoutDays: WorkoutDay[];
  isDarkMode: boolean;
  weightUnit: WeightUnit;
}

const DayProgressTab: React.FC<DayProgressTabProps> = ({
  day,
  workoutHistory,
  workoutDays,
  isDarkMode,
  weightUnit
}) => {
  return (
    <div className="space-y-4">
      <div className={`text-center py-4 transition-colors duration-300 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        <h3 className={`text-xl font-semibold transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {day.name} Progress
        </h3>
        <p className="text-sm mt-1">
          {day.exercises.length} exercise{day.exercises.length === 1 ? '' : 's'} tracked
        </p>
      </div>

      {day.exercises.length > 0 ? (
        <div className="space-y-3">
          {day.exercises.map(exercise => (
            <ExerciseProgressCard
              key={exercise.id}
              exercise={exercise}
              workoutHistory={workoutHistory}
              workoutDays={workoutDays}
              isDarkMode={isDarkMode}
              weightUnit={weightUnit}
            />
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="text-6xl mb-4">🏋️</div>
          <h4 className="text-lg font-medium mb-2">No exercises in {day.name}</h4>
          <p className="text-sm">Add some exercises to this day to track progress!</p>
        </div>
      )}
    </div>
  );
};

export default DayProgressTab;