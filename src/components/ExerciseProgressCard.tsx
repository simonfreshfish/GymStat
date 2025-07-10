import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { Exercise, WorkoutLog, TrainingFrequency, WeightUnit, WorkoutDay } from '../types/workout';
import { getExerciseProgressData, generateProjections, combineHistoricalAndProjected, trainingFrequencies } from '../utils/progressCalculations';
import { convertWeight, formatWeight, getUnitLabel } from '../utils/unitConversion';
import ProgressChart from './ProgressChart';

interface ExerciseProgressCardProps {
  exercise: Exercise;
  workoutHistory: WorkoutLog[];
  workoutDays: WorkoutDay[];
  isDarkMode: boolean;
  weightUnit: WeightUnit;
}

const ExerciseProgressCard: React.FC<ExerciseProgressCardProps> = ({
  exercise,
  workoutHistory,
  workoutDays,
  isDarkMode,
  weightUnit
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<TrainingFrequency>(trainingFrequencies[1]); // Default to twice per week

  // Use combined exercise data from all days
  const historicalData = getExerciseProgressData(exercise.name, workoutHistory, workoutDays);
  const projectedData = generateProjections(historicalData, selectedFrequency);
  const combinedData = combineHistoricalAndProjected(historicalData, projectedData);

  const hasData = historicalData.length > 0;
  const latestData = hasData ? historicalData[historicalData.length - 1] : null;

  const displayWeight = (weight: number) => {
    const converted = convertWeight(weight, 'lbs', weightUnit);
    return formatWeight(converted, weightUnit);
  };

  const unitLabel = getUnitLabel(weightUnit);

  return (
    <div className={`border rounded-lg transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-4 py-3 flex items-center justify-between transition-colors duration-300 ${
          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center space-x-3">
          <TrendingUp size={20} className={`transition-colors duration-300 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <span className={`font-black tracking-wider transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            {exercise.name.toUpperCase()}
          </span>
          {hasData && (
            <span className={`text-sm px-2 py-1 rounded font-black tracking-wider transition-colors duration-300 ${
              isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
            }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
              {historicalData.length} SESSIONS
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {latestData && (
            <div className="text-right">
              <div className={`text-sm font-black tracking-wider transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                {displayWeight(latestData.oneRepMax)} {unitLabel}
              </div>
              <div className={`text-xs font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                LATEST 1RM
              </div>
            </div>
          )}
          {isExpanded ? (
            <ChevronUp size={20} className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          ) : (
            <ChevronDown size={20} className={`transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className={`border-t p-4 transition-colors duration-300 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {hasData ? (
            <>
              {/* Training Frequency Selector */}
              <div className="mb-4">
                <label className={`block text-sm font-black tracking-wider mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  TRAINING FREQUENCY (FOR PROJECTIONS):
                </label>
                <select
                  value={selectedFrequency.value}
                  onChange={(e) => {
                    const freq = trainingFrequencies.find(f => f.value === parseInt(e.target.value));
                    if (freq) setSelectedFrequency(freq);
                  }}
                  className={`w-full px-3 py-2 border text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {trainingFrequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label} (+{freq.weeklyIncrease}% weekly)
                    </option>
                  ))}
                </select>
              </div>

              {/* Progress Chart */}
              <div className={`border p-4 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className={`text-lg font-black tracking-wider mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  PROGRESS & 3-MONTH PROJECTION
                </h4>
                <ProgressChart 
                  data={combinedData} 
                  exerciseName={exercise.name}
                  isDarkMode={isDarkMode}
                  weightUnit={weightUnit}
                />
                
                {/* Legend for projections */}
                <div className={`mt-4 p-3 border rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-0.5 bg-red-500"></div>
                        <span className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>ONE REP MAX</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-0.5 bg-blue-500"></div>
                        <span className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>TOTAL WEIGHT</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-0.5 bg-green-500"></div>
                        <span className={`font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>AVERAGE WEIGHT</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-0.5 border-t-2 border-dashed border-gray-400"></div>
                      <span className={`font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>PROJECTED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Stats */}
              <div className={`mt-4 grid grid-cols-3 gap-3 transition-colors duration-300`}>
                <div className={`text-center p-3 border rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="text-lg font-black tracking-wider text-red-500" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {displayWeight(latestData.oneRepMax)}
                  </div>
                  <div className={`text-xs font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>CURRENT 1RM ({unitLabel})</div>
                </div>
                <div className={`text-center p-3 border rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="text-lg font-black tracking-wider text-blue-500" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {displayWeight(latestData.totalWeight)}
                  </div>
                  <div className={`text-xs font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>LAST TOTAL ({unitLabel})</div>
                </div>
                <div className={`text-center p-3 border rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="text-lg font-black tracking-wider text-green-500" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {displayWeight(latestData.averageWeight)}
                  </div>
                  <div className={`text-xs font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>LAST AVG ({unitLabel})</div>
                </div>
              </div>
            </>
          ) : (
            <div className={`text-center py-8 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="text-4xl mb-2">📈</div>
              <p className="font-medium">No workout data yet for {exercise.name.toUpperCase()}</p>
              <p className="text-sm mt-1 font-medium">Complete some workouts to see your progress!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseProgressCard;