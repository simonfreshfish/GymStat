import React, { useState, useMemo } from 'react';
import { History, ChevronDown, ChevronUp, Dumbbell, Filter, X, Calendar, Activity } from 'lucide-react';
import { WorkoutLog, WeightUnit, CardioSession, DistanceUnit } from '../types/workout';
import { convertWeight, formatWeight, getUnitLabel } from '../utils/unitConversion';
import AnimatedWeightComparison from './AnimatedWeightComparison';
import CardioHistory from './CardioHistory';
import { useVibe } from './VibeProvider';
import { getVibeClasses } from '../utils/vibeSettings';

interface WorkoutHistoryProps {
  workoutHistory: WorkoutLog[];
  cardioHistory: CardioSession[];
  isDarkMode: boolean;
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  AnimatedWeightComparison: React.ComponentType<{ totalWeight: number; isCompleted?: boolean; isDarkMode: boolean; weightUnit: WeightUnit }>;
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ 
  workoutHistory, 
  cardioHistory,
  isDarkMode, 
  weightUnit,
  distanceUnit,
  AnimatedWeightComparison 
}) => {
  const { vibeSettings } = useVibe();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  const [expandedExercises, setExpandedExercises] = useState<{ [key: string]: boolean }>({});
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [historyType, setHistoryType] = useState<'workout' | 'cardio'>('workout');

  // Get unique workout days for filter dropdown
  const uniqueDays = useMemo(() => {
    const days = new Set(workoutHistory.map(workout => workout.dayName));
    return Array.from(days).sort();
  }, [workoutHistory]);

  // Filter workouts based on selected filters
  const filteredWorkouts = useMemo(() => {
    let filtered = workoutHistory;

    // Filter by day
    if (selectedDay !== 'all') {
      filtered = filtered.filter(workout => workout.dayName === selectedDay);
    }

    // Filter by date range
    if (startDate || endDate) {
      filtered = filtered.filter(workout => {
        const workoutDate = new Date(workout.timestamp);
        const workoutDateStr = workoutDate.toISOString().split('T')[0];
        
        const afterStart = !startDate || workoutDateStr >= startDate;
        const beforeEnd = !endDate || workoutDateStr <= endDate;
        
        return afterStart && beforeEnd;
      });
    }

    return filtered;
  }, [workoutHistory, selectedDay, startDate, endDate]);

  const clearFilters = () => {
    setSelectedDay('all');
    setStartDate('');
    setEndDate('');
  };

  const toggleHistoryType = (type: 'workout' | 'cardio') => {
    setHistoryType(type);
    // Reset filters when switching types
    setSelectedDay('all');
    setStartDate('');
    setEndDate('');
    setShowFilters(false);
  };

  const hasActiveFilters = selectedDay !== 'all' || startDate || endDate;

  const displayWeight = (weight: number) => {
    const converted = convertWeight(weight, 'lbs', weightUnit);
    return formatWeight(converted, weightUnit);
  };

  const unitLabel = getUnitLabel(weightUnit);

  const toggleExerciseExpansion = (workoutId: string, exerciseIndex: number) => {
    const key = `${workoutId}-${exerciseIndex}`;
    setExpandedExercises(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isExerciseExpanded = (workoutId: string, exerciseIndex: number) => {
    const key = `${workoutId}-${exerciseIndex}`;
    return expandedExercises[key] || false;
  };

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Toggle Between Workout and Cardio History */}
      <div className={`p-2 rounded-lg border-2 transition-colors duration-300 ${
        vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
      } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}`}
      style={vibeSettings.currentVibe === 'locked-in' ? {
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
      } : {}}>
        <div className="flex items-center justify-center">
          <button
            onClick={() => toggleHistoryType('workout')}
            className={`flex-1 py-3 px-4 rounded-lg font-black tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 ${
              historyType === 'workout'
                ? (vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white clip-path-jagged-button'
                    : 'bg-blue-600 text-white')
                : (vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gray-800 text-red-300 hover:bg-gray-700 border border-red-500/40 clip-path-jagged-button'
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'))
            }`}
            style={vibeSettings.currentVibe === 'locked-in' && historyType === 'workout' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}
          >
            <Dumbbell size={16} />
            <span>WEIGHT TRAINING</span>
            {historyType === 'workout' && <span className="text-xs px-2 py-1 ml-2 rounded-full bg-white text-blue-700">{workoutHistory.length}</span>}
          </button>
          <button
            onClick={() => toggleHistoryType('cardio')}
            className={`flex-1 py-3 px-4 rounded-lg font-black tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 ${
              historyType === 'cardio'
                ? (vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white clip-path-jagged-button'
                    : 'bg-green-600 text-white')
                : (vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gray-800 text-red-300 hover:bg-gray-700 border border-red-500/40 clip-path-jagged-button'
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'))
            }`}
            style={vibeSettings.currentVibe === 'locked-in' && historyType === 'cardio' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}
          >
            <Activity size={16} />
            <span>CARDIO</span>
            {historyType === 'cardio' && <span className="text-xs px-2 py-1 ml-2 rounded-full bg-white text-green-700">{cardioHistory.length}</span>}
          </button>
        </div>
      </div>
      
      {/* Render different history components based on selected type */}
      {historyType === 'cardio' ? (
        <CardioHistory 
          cardioHistory={cardioHistory}
          isDarkMode={isDarkMode}
          distanceUnit={distanceUnit}
        />
      ) : (
       <>
      {/* Filter Controls */}
      <div className={`border rounded-lg transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Filter size={20} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`font-black tracking-wider transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                FILTER WORKOUTS
              </h3>
              {hasActiveFilters && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                }`}>
                  {filteredWorkouts.length} of {workoutHistory.length} workouts
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-red-900 text-red-300 hover:bg-red-800' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors duration-300 ${
                  showFilters 
                    ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                    : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                }`}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Day Filter */}
              <div>
                <label className={`block text-sm font-black tracking-wider mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  WORKOUT DAY
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className={`w-full px-3 py-2 border text-sm rounded-lg transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">All Days ({workoutHistory.length})</option>
                  {uniqueDays.map(day => {
                    const dayCount = workoutHistory.filter(w => w.dayName === day).length;
                    return (
                      <option key={day} value={day}>
                        {day} ({dayCount})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Start Date Filter */}
              <div>
                <label className={`block text-sm font-black tracking-wider mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  START DATE
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full px-3 py-2 border text-sm rounded-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  {startDate && (
                    <button
                      onClick={() => setStartDate('')}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* End Date Filter */}
              <div>
                <label className={`block text-sm font-black tracking-wider mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  END DATE
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full px-3 py-2 border text-sm rounded-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  {endDate && (
                    <button
                      onClick={() => setEndDate('')}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`text-center py-8 transition-colors duration-300 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        <History size={48} className="mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-black tracking-wider mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
          WORKOUT HISTORY
        </h2>
        <p className="text-sm font-medium">
          {filteredWorkouts.length === 0 && workoutHistory.length === 0
            ? "No workouts logged yet. Complete and log your first workout!"
            : filteredWorkouts.length === 0
            ? "No workouts match your current filters. Try adjusting your filter settings."
            : `${filteredWorkouts.length} workout${filteredWorkouts.length === 1 ? '' : 's'} ${hasActiveFilters ? 'found' : 'logged'}`
          }
        </p>
      </div>

      {filteredWorkouts.map((log) => (
        <div key={log.id} className={`shadow-sm border p-4 rounded-lg transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className={`font-black tracking-wider text-lg transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                {log.dayName}
              </h3>
              <p className={`text-sm font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {log.date} • {log.completedSets}/{log.totalSets} sets completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black tracking-wider text-green-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                {displayWeight(log.totalWeight)}
              </div>
              <div className={`text-xs font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {unitLabel} TOTAL
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {log.exercises.map((exercise, exerciseIndex) => {
              const isExpanded = isExerciseExpanded(log.id, exerciseIndex);
              
              return (
                <div key={exerciseIndex} className={`border rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  {/* Exercise Header - Clickable */}
                  <button
                    onClick={() => toggleExerciseExpansion(log.id, exerciseIndex)}
                    className={`w-full p-3 flex items-center justify-between transition-colors duration-300 rounded-lg ${
                      isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Dumbbell size={16} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div className="text-left">
                        <span className={`font-black tracking-wider transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                          {exercise.name.toUpperCase()}
                        </span>
                        <div className={`text-sm mt-1 font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {exercise.sets.length} sets • {displayWeight(exercise.totalWeight)} {unitLabel} total
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-black tracking-wider text-blue-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                          {displayWeight(exercise.oneRepMax)} {unitLabel}
                        </div>
                        <div className={`text-xs font-medium transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          1RM
                        </div>
                      </div>
                      
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

                  {/* Exercise Details - Expandable */}
                  {isExpanded && (
                    <div className={`border-t p-3 transition-colors duration-300 ${
                      isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                    }`}>
                      <div className={`text-sm font-black tracking-wider mb-3 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                        SET DETAILS:
                      </div>
                      
                      <div className="space-y-2">
                        {exercise.sets.map((set, setIndex) => (
                          <div key={setIndex} className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-300 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black tracking-wider ${
                                isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                                {setIndex + 1}
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <div className="text-center">
                                  <div className={`text-lg font-black tracking-wider transition-colors duration-300 ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                                    {displayWeight(set.weight)}
                                  </div>
                                  <div className={`text-xs font-medium transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {unitLabel}
                                  </div>
                                </div>
                                
                                <div className={`text-2xl font-black tracking-wider transition-colors duration-300 ${
                                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                  ×
                                </div>
                                
                                <div className="text-center">
                                  <div className={`text-lg font-black tracking-wider transition-colors duration-300 ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                                    {set.reps}
                                  </div>
                                  <div className={`text-xs font-medium transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    REPS
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              {/* Set Volume */}
                              <div className="text-right">
                                <div className={`text-sm font-black tracking-wider text-purple-600`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                                  {displayWeight(set.weight * set.reps)}
                                </div>
                                <div className={`text-xs font-medium transition-colors duration-300 ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  VOLUME
                                </div>
                              </div>
                              
                              {/* Olympic Bar Indicator */}
                              {set.hasOlympicBar && (
                                <div className={`px-2 py-1 rounded text-xs font-black tracking-wider ${
                                  isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700'
                                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                                  +BAR
                                </div>
                              )}
                              
                              {/* Completed Indicator */}
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                set.completed 
                                  ? 'bg-green-500 text-white' 
                                  : (isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500')
                              }`}>
                                {set.completed ? '✓' : '○'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Exercise Summary */}
                      <div className={`mt-3 p-2 rounded-lg transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className={`text-sm font-black tracking-wider text-blue-600`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                              {exercise.sets.length}
                            </div>
                            <div className={`text-xs font-medium transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              TOTAL SETS
                            </div>
                          </div>
                          
                          <div>
                            <div className={`text-sm font-black tracking-wider text-green-600`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                              {exercise.sets.reduce((sum, set) => sum + set.reps, 0)}
                            </div>
                            <div className={`text-xs font-medium transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              TOTAL REPS
                            </div>
                          </div>
                          
                          <div>
                            <div className={`text-sm font-black tracking-wider text-purple-600`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                              {displayWeight(exercise.totalWeight)}
                            </div>
                            <div className={`text-xs font-medium transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              VOLUME ({unitLabel})
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {log.totalWeight > 0 && (
            <div className="mt-3">
              <AnimatedWeightComparison 
                totalWeight={log.totalWeight} 
                isCompleted={true}
                isDarkMode={isDarkMode}
                weightUnit={weightUnit}
              />
            </div>
          )}
        </div>
      ))}
       </>
      )}
    </div>
  );
};

export default WorkoutHistory;