import React from 'react';
import { Exercise, WeightUnit } from '../types/workout';
import { convertWeight, formatWeight, getUnitLabel } from '../utils/unitConversion';
import { useVibe } from './VibeProvider';
import { getVibeClasses } from '../utils/vibeSettings';

interface WorkoutProgressBarProps {
  exercises: Exercise[];
  isDarkMode: boolean;
  weightUnit: WeightUnit;
}

const WorkoutProgressBar: React.FC<WorkoutProgressBarProps> = ({
  exercises,
  isDarkMode,
  weightUnit
}) => {
  const { vibeSettings } = useVibe();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  
  // Calculate total sets and completed sets
  const totalSets = exercises.reduce((total, exercise) => 
    total + exercise.sets.filter(set => set.weight > 0 && set.reps > 0).length, 0
  );
  
  const completedSets = exercises.reduce((total, exercise) => 
    total + exercise.sets.filter(set => set.completed && set.weight > 0 && set.reps > 0).length, 0
  );

  // Calculate total weight moved from completed sets
  const totalWeightMoved = exercises.reduce((total, exercise) => 
    total + exercise.sets
      .filter(set => set.completed && set.weight > 0 && set.reps > 0)
      .reduce((exerciseTotal, set) => exerciseTotal + (set.weight * set.reps), 0), 0
  );

  const progressPercentage = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  const displayWeight = convertWeight(totalWeightMoved, 'lbs', weightUnit);
  
  // Get full unit names in uppercase
  const fullUnitName = weightUnit === 'lbs' ? 'POUNDS' : 'KILOS';

  // Get colors based on vibe
  const getProgressBarColors = () => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return {
        background: 'bg-gray-900 border-2 border-red-500/40',
        fill: 'bg-black border-2 border-white',
        text: 'text-red-100',
        accent: 'text-white',
        card: 'bg-gradient-to-br from-red-950/90 via-black/90 to-red-900/80 border-red-500/40'
      };
    }
    
    return {
      background: isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
      fill: progressPercentage === 100 
        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
        : progressPercentage > 0
          ? 'bg-gradient-to-r from-blue-500 to-purple-600'
          : 'bg-gray-400',
      text: vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900'),
      accent: progressPercentage === 100 ? 'text-green-600' : 'text-blue-600',
      card: vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
    };
  };

  const colors = getProgressBarColors();

  if (totalSets === 0) {
    return (
      <div className={`mx-4 mb-4 p-4 border rounded-lg transition-colors duration-300 ${
        colors.card
      } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}`}
      style={vibeSettings.currentVibe === 'locked-in' ? {
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
      } : {}}>
        <div className={`text-center transition-colors duration-300 ${
          vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
        }`}>
          <div className="text-2xl mb-2">📝</div>
          <p className="text-sm font-medium">Click EDIT and Add exercises, weights, and reps to track progress!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`mx-4 mb-4 p-4 border rounded-lg transition-colors duration-300 ${
      colors.card
    } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}`}
    style={vibeSettings.currentVibe === 'locked-in' ? {
      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
    } : {}}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-xl">
            {progressPercentage === 100 ? '🎉' : progressPercentage > 0 ? '💪' : '🎯'}
          </div>
          <h3 className={`font-black tracking-wider transition-colors duration-300 ${
            colors.text
          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            WORKOUT PROGRESS
          </h3>
        </div>
        <div className="text-right">
          <div className={`text-lg font-black tracking-wider transition-colors duration-300 ${
            colors.accent
          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            {completedSets}/{totalSets}
          </div>
          <div className={`text-xs font-medium transition-colors duration-300 ${
            vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
          }`}>
            SETS COMPLETED
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`w-full h-3 rounded-full mb-3 transition-colors duration-300 ${
        colors.background
      } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-bar' : ''}`}
      style={vibeSettings.currentVibe === 'locked-in' ? {
        clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
      } : {}}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            colors.fill
          } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-bar' : ''}`}
          style={{ 
            width: `${progressPercentage}%`,
            ...(vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)'
            } : {})
          }}
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className={`text-lg font-black tracking-wider transition-colors duration-300 ${
            colors.accent
          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            {Math.round(progressPercentage)}%
          </div>
          <div className={`text-xs font-medium transition-colors duration-300 ${
            vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
          }`}>COMPLETE</div>
        </div>
        
        <div className="text-center">
          <div className={`text-lg font-black tracking-wider transition-colors duration-300 ${
            totalWeightMoved > 0 
              ? (vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : 'text-purple-600')
              : (vibeSettings.currentVibe === 'locked-in' ? 'text-red-500' : (isDarkMode ? 'text-gray-500' : 'text-gray-400'))
          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            {totalWeightMoved > 0 ? formatWeight(displayWeight, weightUnit) : '0'}
          </div>
          <div className={`text-xs font-medium transition-colors duration-300 ${
            vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
          }`}>{fullUnitName} MOVED</div>
        </div>
        
        <div className="text-center">
          <div className={`text-lg font-black tracking-wider transition-colors duration-300 ${
            exercises.filter(ex => ex.sets.some(set => set.completed)).length > 0 
              ? (vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-orange-600')
              : (vibeSettings.currentVibe === 'locked-in' ? 'text-red-500' : (isDarkMode ? 'text-gray-500' : 'text-gray-400'))
          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            {exercises.filter(ex => ex.sets.some(set => set.completed)).length}
          </div>
          <div className={`text-xs font-medium transition-colors duration-300 ${
            vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
          }`}>EXERCISES</div>
        </div>
      </div>

      {/* Completion Message */}
      {progressPercentage === 100 && (
        <div className={`mt-3 p-2 rounded-lg text-center transition-colors duration-300 ${
          vibeSettings.currentVibe === 'locked-in' 
            ? 'bg-black border-2 border-white text-white clip-path-jagged-small'
            : (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700')
        }`}
        style={vibeSettings.currentVibe === 'locked-in' ? {
          clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
        } : {}}>
          <div className="text-sm font-black tracking-wider" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            🎉 WORKOUT COMPLETE! READY TO LOG YOUR SESSION!
          </div>
        </div>
      )}
      
      {/* Encouragement Message */}
      {progressPercentage > 0 && progressPercentage < 100 && (
        <div className={`mt-3 p-2 rounded-lg text-center transition-colors duration-300 ${
          vibeSettings.currentVibe === 'locked-in' 
            ? 'bg-gradient-to-r from-red-900 to-black border-2 border-red-500 text-red-100 clip-path-jagged-small'
            : (isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700')
        }`}
        style={vibeSettings.currentVibe === 'locked-in' ? {
          clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
        } : {}}>
          <div className="text-sm font-black tracking-wider" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            💪 KEEP GOING! YOU'RE {Math.round(progressPercentage)}% DONE!
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutProgressBar;