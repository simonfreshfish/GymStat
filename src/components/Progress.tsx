import React, { useState, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { WorkoutLog, WeightUnit } from '../types/workout';
import { convertWeight, formatWeight, getUnitLabel } from '../utils/unitConversion';
import { useVibe } from './VibeProvider';
import { getVibeClasses } from '../utils/vibeSettings';

interface ProgressProps {
  workoutHistory: WorkoutLog[];
  isDarkMode: boolean;
  weightUnit: WeightUnit;
  AnimatedWeightComparison: React.ComponentType<{ totalWeight: number; isCompleted?: boolean; isDarkMode: boolean; weightUnit: WeightUnit }>;
}

const Progress: React.FC<ProgressProps> = ({
  workoutHistory,
  isDarkMode,
  weightUnit,
  AnimatedWeightComparison
}) => {
  const { vibeSettings } = useVibe();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  const [selectedExerciseName, setSelectedExerciseName] = useState<string | null>(null);
  
  // Extract unique exercise names from workout history
  const exerciseNames = useMemo(() => {
    const names = new Set<string>();
    workoutHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        names.add(exercise.name);
      });
    });
    return Array.from(names).sort();
  }, [workoutHistory]);

  const totalWeightMoved = workoutHistory.reduce((total, workout) => total + workout.totalWeight, 0);
  const displayTotalWeight = convertWeight(totalWeightMoved, 'lbs', weightUnit);
  const unitLabel = getUnitLabel(weightUnit);
  
  // Get data for selected exercise
  const selectedExerciseData = useMemo(() => {
    if (!selectedExerciseName) return null;
    
    const data: {date: string; oneRepMax: number; totalWeight: number}[] = [];
    workoutHistory.forEach(workout => {
      const exercise = workout.exercises.find(ex => ex.name === selectedExerciseName);
      if (exercise) {
        data.push({
          date: workout.date,
          oneRepMax: exercise.oneRepMax,
          totalWeight: exercise.totalWeight
        });
      }
    });
    
    return data.reverse(); // Most recent last
  }, [selectedExerciseName, workoutHistory]);

  // Calculate stats for overview section
  const stats = useMemo(() => {
    return {
      totalWorkouts: workoutHistory.length,
      totalExercises: exerciseNames.length,
      totalWeight: displayTotalWeight,
      mostRecentDate: workoutHistory.length > 0 ? workoutHistory[0].date : 'No workouts yet'
    };
  }, [workoutHistory, exerciseNames, displayTotalWeight]);

  return (
    <div className="px-4 py-4">
      {/* Progress Overview */}
      <div className={`mb-6 p-4 border rounded-lg transition-colors duration-300 ${
        vibeSettings.currentVibe === 'locked-in'
          ? 'bg-gradient-to-r from-red-900 to-black border-red-500/40 clip-path-jagged' 
          : (isDarkMode 
            ? 'bg-gradient-to-r from-blue-900 to-purple-900 border-gray-600' 
            : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200')
      }`}
      style={vibeSettings.currentVibe === 'locked-in' ? {
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
      } : {}}>
        <div className="flex items-center space-x-3 mb-3">
          <TrendingUp size={24} className={vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-blue-600'} />
          <h2 className={`text-xl font-black tracking-wider transition-colors duration-300 ${
            vibeSettings.currentVibe === 'locked-in' ? 'text-red-100' : (isDarkMode ? 'text-white' : 'text-gray-900')
          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            PROGRESS ANALYTICS
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`text-center p-3 border rounded-lg transition-colors duration-300 ${
            vibeSettings.currentVibe === 'locked-in'
              ? 'bg-black border-red-500/40 clip-path-jagged-small' 
              : (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200')
          }`}
          style={vibeSettings.currentVibe === 'locked-in' ? {
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
          } : {}}>
            <div className={`text-2xl font-black tracking-wider ${
              vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : 'text-blue-600'
            }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
              {stats.totalWorkouts}
            </div>
            <div className={`text-sm font-medium transition-colors duration-300 ${
              vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
            }`}>TOTAL WORKOUTS</div>
          </div>
          
          <div className={`text-center p-3 border rounded-lg transition-colors duration-300 ${
            vibeSettings.currentVibe === 'locked-in'
              ? 'bg-black border-red-500/40 clip-path-jagged-small' 
              : (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200')
          }`}
          style={vibeSettings.currentVibe === 'locked-in' ? {
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
          } : {}}>
            <div className={`text-2xl font-black tracking-wider ${
              vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : 'text-green-600'
            }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
              {stats.totalExercises}
            </div>
            <div className={`text-sm font-medium transition-colors duration-300 ${
              vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
            }`}>EXERCISES TRACKED</div>
          </div>
          
          <div className={`text-center p-3 border rounded-lg transition-colors duration-300 ${
            vibeSettings.currentVibe === 'locked-in'
              ? 'bg-black border-red-500/40 clip-path-jagged-small' 
              : (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200')
          }`}
          style={vibeSettings.currentVibe === 'locked-in' ? {
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
          } : {}}>
            <div className={`text-2xl font-black tracking-wider ${
              vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : 'text-purple-600'
            }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
              {Math.round(displayTotalWeight).toLocaleString()}
            </div>
            <div className={`text-sm font-medium transition-colors duration-300 ${
              vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
            }`}>TOTAL WEIGHT MOVED ({unitLabel})</div>
          </div>
        </div>

        {/* Weight Comparison */}
        {totalWeightMoved > 0 && (
          <div className="mt-4">
            <AnimatedWeightComparison
              totalWeight={totalWeightMoved}
              isCompleted={true}
              isDarkMode={isDarkMode}
              weightUnit={weightUnit}
            />
          </div>
        )}
      </div>

      {/* Exercise Selector */}
      {exerciseNames.length > 0 ? (
        <div className={`mb-6 p-4 border rounded-lg transition-colors duration-300 ${
          vibeSettings.currentVibe === 'locked-in'
            ? 'bg-gradient-to-r from-red-900 to-black border-red-500/40 clip-path-jagged' 
            : (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
        }`}
        style={vibeSettings.currentVibe === 'locked-in' ? {
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
        } : {}}>
          <label className={`block text-sm font-black tracking-wider mb-2 ${
            vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            SELECT EXERCISE TO VIEW PROGRESS
          </label>
          <select
            value={selectedExerciseName || ''}
            onChange={(e) => setSelectedExerciseName(e.target.value || null)}
            className={`w-full px-3 py-2 border text-sm rounded-lg transition-colors duration-300 ${
              vibeSettings.currentVibe === 'locked-in'
                ? 'bg-black border-red-500/40 text-red-100 clip-path-jagged-small' 
                : (isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900')
            }`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
            } : {}}
          >
            <option value="">Select an exercise...</option>
            {exerciseNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      ) : null}

      {/* Selected Exercise Progress */}
      {selectedExerciseName && selectedExerciseData && selectedExerciseData.length > 0 ? (
        <div className={`p-4 border rounded-lg transition-colors duration-300 ${
          vibeSettings.currentVibe === 'locked-in'
            ? 'bg-gradient-to-r from-red-900 to-black border-red-500/40 clip-path-jagged' 
            : (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
        }`}
        style={vibeSettings.currentVibe === 'locked-in' ? {
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
        } : {}}>
          <h3 className={`text-xl font-black tracking-wider mb-4 ${
            vibeSettings.currentVibe === 'locked-in' ? 'text-red-100' : (isDarkMode ? 'text-white' : 'text-gray-900')
          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            {selectedExerciseName.toUpperCase()} PROGRESS
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* One Rep Max Progress */}
            <div className={`p-3 border rounded-lg transition-colors duration-300 ${
              vibeSettings.currentVibe === 'locked-in'
                ? 'bg-black border-red-500/40 clip-path-jagged-small' 
                : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200')
            }`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
            } : {}}>
              <h4 className={`text-sm font-black tracking-wider mb-3 ${
                vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                ONE REP MAX PROGRESS
              </h4>
              
              {selectedExerciseData.length > 1 ? (
                <div className="space-y-2">
                  {selectedExerciseData.map((data, index) => (
                    <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                      vibeSettings.currentVibe === 'locked-in'
                        ? 'bg-gray-900'
                        : (isDarkMode ? 'bg-gray-800' : 'bg-white')
                    }`}>
                      <div className={`text-sm ${
                        vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                      }`}>
                        {data.date}
                      </div>
                      <div className={`font-black tracking-wider ${
                        vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-red-600'
                      }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                        {formatWeight(convertWeight(data.oneRepMax, 'lbs', weightUnit), weightUnit)} {unitLabel}
                      </div>
                    </div>
                  ))}
                  
                  {/* Progress Stats */}
                  <div className={`p-3 mt-3 border rounded-lg ${
                    vibeSettings.currentVibe === 'locked-in'
                      ? 'bg-gradient-to-r from-red-900 to-black border-red-500/30'
                      : (isDarkMode ? 'bg-blue-900/30 border-blue-800/30' : 'bg-blue-50 border-blue-100')
                  }`}>
                    <div className={`text-center mb-2 ${
                      vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                    }`}>
                      Progress Summary
                    </div>
                    
                    {selectedExerciseData.length >= 2 && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center">
                          <div className={`text-xs ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                          }`}>
                            First 1RM
                          </div>
                          <div className={`font-bold ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-white' : 'text-gray-900')
                          }`}>
                            {formatWeight(convertWeight(selectedExerciseData[selectedExerciseData.length - 1].oneRepMax, 'lbs', weightUnit), weightUnit)} {unitLabel}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`text-xs ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                          }`}>
                            Latest 1RM
                          </div>
                          <div className={`font-bold ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-white' : 'text-gray-900')
                          }`}>
                            {formatWeight(convertWeight(selectedExerciseData[0].oneRepMax, 'lbs', weightUnit), weightUnit)} {unitLabel}
                          </div>
                        </div>
                        
                        <div className="text-center col-span-2">
                          <div className={`text-xs ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                          }`}>
                            Improvement
                          </div>
                          <div className={`font-bold ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-white' : 'text-green-600'
                          }`}>
                            {formatWeight(convertWeight(selectedExerciseData[0].oneRepMax - selectedExerciseData[selectedExerciseData.length - 1].oneRepMax, 'lbs', weightUnit), weightUnit)} {unitLabel}
                            {' '}({Math.round((selectedExerciseData[0].oneRepMax / selectedExerciseData[selectedExerciseData.length - 1].oneRepMax - 1) * 100)}%)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`text-center py-4 ${
                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  Keep logging workouts to track your progress over time!
                </div>
              )}
            </div>
            
            {/* Total Weight Progress */}
            <div className={`p-3 border rounded-lg transition-colors duration-300 ${
              vibeSettings.currentVibe === 'locked-in'
                ? 'bg-black border-red-500/40 clip-path-jagged-small' 
                : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200')
            }`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
            } : {}}>
              <h4 className={`text-sm font-black tracking-wider mb-3 ${
                vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                TOTAL WEIGHT PROGRESS
              </h4>
              
              {selectedExerciseData.length > 1 ? (
                <div className="space-y-2">
                  {selectedExerciseData.map((data, index) => (
                    <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                      vibeSettings.currentVibe === 'locked-in'
                        ? 'bg-gray-900'
                        : (isDarkMode ? 'bg-gray-800' : 'bg-white')
                    }`}>
                      <div className={`text-sm ${
                        vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                      }`}>
                        {data.date}
                      </div>
                      <div className={`font-black tracking-wider ${
                        vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-blue-600'
                      }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                        {formatWeight(convertWeight(data.totalWeight, 'lbs', weightUnit), weightUnit)} {unitLabel}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-4 ${
                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  Log more workouts to see your volume progression!
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={`text-center py-12 transition-colors duration-300 ${
          vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
        }`}>
          <div className="text-6xl mb-4">📊</div>
          {exerciseNames.length > 0 ? (
            <>
              <h3 className="text-lg font-medium mb-2">Select an exercise from the dropdown above</h3>
              <p className="text-sm">View detailed progress analytics for any exercise you've logged</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">No workout data yet</h3>
              <p className="text-sm">Complete and log workouts to see your progress over time</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Progress;