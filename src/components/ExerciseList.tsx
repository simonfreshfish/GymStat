import React from 'react';
import { Plus, X, Check } from 'lucide-react';
import { Exercise, WeightUnit, ExerciseLibrary } from '../types/workout';
import { getExerciseStats } from '../utils/workoutCalculations';
import { convertWeight, formatWeight, getOlympicBarWeight, getUnitLabel } from '../utils/unitConversion';
import { useVisualSettings } from './VisualSettingsProvider';
import { useVibe } from './VibeProvider';
import { getVibeClasses } from '../utils/vibeSettings';
import AnimatedWeightComparison from './AnimatedWeightComparison';
import WorkoutProgressBar from './WorkoutProgressBar';
import ExerciseSelector from './ExerciseSelector';
import MobileExerciseCard from './MobileExerciseCard';

interface ExerciseListProps {
  exercises: Exercise[];
  isEditing: boolean;
  expandedExercise: number | null;
  newExerciseName: string;
  isDarkMode: boolean;
  weightUnit: WeightUnit;
  exerciseLibrary: ExerciseLibrary;
  setExpandedExercise: (id: number | null) => void;
  setNewExerciseName: (name: string) => void;
  addNewExercise: () => void;
  addExerciseFromLibrary: (exerciseName: string) => void;
  deleteExercise: (id: number) => void;
  toggleSetCompletion: (exerciseId: number, setIndex: number) => void;
  addSet: (exerciseId: number) => void;
  updateSet: (exerciseId: number, setIndex: number, field: string, value: string) => void;
  toggleOlympicBar: (exerciseId: number, setIndex: number) => void;
  removeSet: (exerciseId: number, setIndex: number) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  isEditing,
  expandedExercise,
  newExerciseName,
  isDarkMode,
  weightUnit,
  exerciseLibrary,
  setExpandedExercise,
  setNewExerciseName,
  addNewExercise,
  addExerciseFromLibrary,
  deleteExercise,
  toggleSetCompletion,
  addSet,
  updateSet,
  toggleOlympicBar,
  removeSet
}) => {
  const { settings } = useVisualSettings();
  const { vibeSettings } = useVibe();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  const isMobile = settings.screenOptimization === 'smartphone';

  const displayWeight = (weight: number) => {
    const converted = convertWeight(weight, 'lbs', weightUnit);
    return formatWeight(converted, weightUnit);
  };

  const olympicBarWeight = getOlympicBarWeight(weightUnit);
  const unitLabel = getUnitLabel(weightUnit);

  const handleSelectExercise = (exerciseName: string) => {
    addExerciseFromLibrary(exerciseName);
  };

  // Fixed: Direct exercise addition without using the newExerciseName state
  const handleNewExercise = (exerciseName: string) => {
    // Create the exercise directly without relying on state
    const capitalizedName = exerciseName.toUpperCase().trim();
    if (capitalizedName) {
      addExerciseFromLibrary(capitalizedName);
    }
  };

  // Get colors based on vibe
  const getExerciseColors = () => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return {
        card: 'bg-gradient-to-br from-red-950/90 via-black/90 to-red-900/80 border-red-500/40',
        text: 'text-red-100',
        accent: 'text-red-400',
        button: 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white',
        statsCard: 'bg-gradient-to-r from-red-900/30 via-black/30 to-red-800/30 border-red-500/40'
      };
    }
    
    return {
      card: vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'),
      text: vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900'),
      accent: vibeClasses.accent || 'text-blue-600',
      button: vibeClasses.button || (isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'),
      statsCard: vibeClasses.gradient || (isDarkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200')
    };
  };

  const colors = getExerciseColors();

  return (
    <div className={`py-4 space-y-4 ${isMobile ? 'safe-area-left safe-area-right pb-32' : 'pb-8'}`}>
      {/* Workout Progress Bar */}
      <WorkoutProgressBar 
        exercises={exercises}
        isDarkMode={isDarkMode}
        weightUnit={weightUnit}
      />

      {/* Exercise List */}
      <div className={`px-4 ${isMobile ? 'space-y-4' : 'space-y-4 responsive-grid'}`}>
        {exercises.map((exercise) => {
          const stats = getExerciseStats(exercise);
          const isExpanded = expandedExercise === exercise.id;
          
          if (isMobile) {
            return (
              <div key={exercise.id}>
                <MobileExerciseCard
                  exercise={exercise}
                  isEditing={isEditing}
                  isDarkMode={isDarkMode}
                  weightUnit={weightUnit}
                  onDeleteExercise={deleteExercise}
                  onToggleSetCompletion={toggleSetCompletion}
                  onAddSet={addSet}
                  onUpdateSet={updateSet}
                  onToggleOlympicBar={toggleOlympicBar}
                  onRemoveSet={removeSet}
                />
                
                {/* Stats expansion for mobile */}
                <div className="px-4 mb-4">
                  <button
                    onClick={() => setExpandedExercise(isExpanded ? null : exercise.id)}
                    className={`w-full py-3 px-4 text-sm font-black tracking-wider rounded-lg transition-colors duration-300 ${
                      isExpanded 
                        ? colors.button
                        : (vibeSettings.currentVibe === 'locked-in'
                            ? 'bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white border-red-500/40 clip-path-jagged-button'
                            : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                          )
                    }`}
                    style={{ 
                      fontFamily: 'system-ui, -apple-system, sans-serif', 
                      letterSpacing: '0.1em',
                      ...(vibeSettings.currentVibe === 'locked-in' && !isExpanded ? {
                        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
                      } : {})
                    }}
                  >
                    {isExpanded ? '✓ HIDE STATS' : '📊 SHOW STATS'}
                  </button>
                  
                  {isExpanded && (
                    <div className={`mt-3 p-4 border rounded-lg transition-colors duration-300 ${
                      colors.statsCard
                    } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}`}
                    style={vibeSettings.currentVibe === 'locked-in' ? {
                      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
                    } : {}}>
                      {stats.completed.totalWeight > 0 ? (
                        <div className="space-y-3">
                          <div className="text-center">
                            <div className={`text-2xl font-black tracking-wider ${
                              vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : 'text-green-600'
                            }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                              {displayWeight(stats.completed.oneRepMax)} {unitLabel}
                            </div>
                            <div className={`text-sm font-medium transition-colors duration-300 ${
                              colors.text
                            }`}>✅ ESTIMATED 1RM (COMPLETED)</div>
                          </div>
                          
                          {stats.completed.bestComparison && (
                            <AnimatedWeightComparison 
                              totalWeight={stats.completed.totalWeight} 
                              isCompleted={true}
                              isDarkMode={isDarkMode}
                              weightUnit={weightUnit}
                            />
                          )}
                        </div>
                      ) : stats.preview.totalWeight > 0 ? (
                        <div className="space-y-3">
                          <div className="text-center">
                            <div className={`text-2xl font-black tracking-wider ${colors.accent}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                              {displayWeight(stats.preview.oneRepMax)} {unitLabel}
                            </div>
                            <div className={`text-sm font-medium transition-colors duration-300 ${
                              colors.text
                            }`}>ESTIMATED ONE REP MAX</div>
                          </div>
                          
                          {stats.preview.bestComparison && (
                            <AnimatedWeightComparison 
                              totalWeight={stats.preview.totalWeight} 
                              isCompleted={false}
                              isDarkMode={isDarkMode}
                              weightUnit={weightUnit}
                            />
                          )}
                        </div>
                      ) : (
                        <div className={`text-center italic font-medium transition-colors duration-300 ${
                          vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                        }`}>
                          📝 Add some weight and reps to see your stats!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          }
          
          // Desktop version with LOCKED IN styling
          return (
            <div key={exercise.id} className={`shadow-sm border p-4 rounded-lg transition-colors duration-300 ${
              colors.card
            } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
            } : {}}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <h3 className={`font-black tracking-wider transition-colors duration-300 ${
                    colors.text
                  }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {exercise.name.toUpperCase()}
                  </h3>
                  
                  <button
                    onClick={() => setExpandedExercise(isExpanded ? null : exercise.id)}
                    className={`px-3 py-1 text-xs font-black tracking-wider rounded-lg transition-colors duration-300 touch-target ${
                      isExpanded 
                        ? colors.button
                        : (vibeSettings.currentVibe === 'locked-in'
                            ? 'bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white border-red-500/40 clip-path-jagged-button'
                            : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                          )
                    }`}
                    style={{ 
                      fontFamily: 'system-ui, -apple-system, sans-serif', 
                      letterSpacing: '0.1em',
                      ...(vibeSettings.currentVibe === 'locked-in' && !isExpanded ? {
                        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                      } : {})
                    }}
                  >
                    {isExpanded ? '✓ MY STATS' : 'MY STATS'}
                  </button>
                </div>
                
                {isEditing && (
                  <button
                    onClick={() => deleteExercise(exercise.id)}
                    className={`p-1 rounded-lg transition-colors duration-300 touch-target ${
                      vibeSettings.currentVibe === 'locked-in'
                        ? 'bg-red-900 text-red-400 hover:bg-red-800 border border-red-500/40 clip-path-jagged-small'
                        : (isDarkMode ? 'bg-red-900 text-red-400 hover:bg-red-800' : 'bg-red-100 text-red-600 hover:bg-red-200')
                    }`}
                    style={vibeSettings.currentVibe === 'locked-in' ? {
                      clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                    } : {}}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              {isExpanded && (
                <div className={`mb-4 p-3 border rounded-lg transition-colors duration-300 ${
                  colors.statsCard
                } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
                } : {}}>
                  {stats.completed.totalWeight > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      <div className="text-center">
                        <div className={`text-2xl font-black tracking-wider ${
                          vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : 'text-green-600'
                        }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                          {displayWeight(stats.completed.oneRepMax)} {unitLabel}
                        </div>
                        <div className={`text-sm font-medium transition-colors duration-300 ${
                          colors.text
                        }`}>✅ ESTIMATED 1RM (COMPLETED)</div>
                      </div>
                      
                      {stats.completed.bestComparison && (
                        <AnimatedWeightComparison 
                          totalWeight={stats.completed.totalWeight} 
                          isCompleted={true}
                          isDarkMode={isDarkMode}
                          weightUnit={weightUnit}
                        />
                      )}
                    </div>
                  ) : stats.preview.totalWeight > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      <div className="text-center">
                        <div className={`text-2xl font-black tracking-wider ${colors.accent}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                          {displayWeight(stats.preview.oneRepMax)} {unitLabel}
                        </div>
                        <div className={`text-sm font-medium transition-colors duration-300 ${
                          colors.text
                        }`}>ESTIMATED ONE REP MAX</div>
                      </div>
                      
                      {stats.preview.bestComparison && (
                        <AnimatedWeightComparison 
                          totalWeight={stats.preview.totalWeight} 
                          isCompleted={false}
                          isDarkMode={isDarkMode}
                          weightUnit={weightUnit}
                        />
                      )}
                    </div>
                  ) : (
                    <div className={`text-center italic font-medium transition-colors duration-300 ${
                      vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                    }`}>
                      📝 Add some weight and reps to see your stats!
                    </div>
                  )}

                  {exercise.history && exercise.history.length > 0 && (
                    <div className={`mt-3 p-3 border rounded-lg transition-colors duration-300 ${
                      vibeSettings.currentVibe === 'locked-in' 
                        ? 'bg-black border-red-500/40 clip-path-jagged-small'
                        : (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200')
                    }`}
                    style={vibeSettings.currentVibe === 'locked-in' ? {
                      clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                    } : {}}>
                      <h4 className={`text-sm font-black tracking-wider mb-2 transition-colors duration-300 ${
                        colors.text
                      }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                        📈 PROGRESS HISTORY
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className={`font-black tracking-wider ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-purple-600'
                          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                            {exercise.history.length}
                          </div>
                          <div className={`font-medium transition-colors duration-300 ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                          }`}>SESSIONS</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-black tracking-wider ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : 'text-orange-600'
                          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                            {displayWeight(exercise.history[exercise.history.length - 1].oneRepMax)}
                          </div>
                          <div className={`font-medium transition-colors duration-300 ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                          }`}>BEST 1RM</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-black tracking-wider ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-teal-600'
                          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                            +{displayWeight(exercise.history[exercise.history.length - 1].oneRepMax - exercise.history[0].oneRepMax)}
                          </div>
                          <div className={`font-medium transition-colors duration-300 ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                          }`}>TOTAL GAIN</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            
              <div className="space-y-2">
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center space-x-3">
                    <span className={`text-sm w-8 text-center font-black tracking-wider transition-colors duration-300 ${
                      vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                    }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                      {setIndex + 1}
                    </span>
                    
                    <div className="flex-1">
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={set.weight === 0 ? '' : displayWeight(set.weight)}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            if (inputValue === '') {
                              updateSet(exercise.id, setIndex, 'weight', '0');
                            } else {
                              const displayValue = parseFloat(inputValue) || 0;
                              const lbsValue = convertWeight(displayValue, weightUnit, 'lbs');
                              updateSet(exercise.id, setIndex, 'weight', lbsValue.toString());
                            }
                          }}
                          className={`flex-1 px-3 py-2 border text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 touch-target ${
                            vibeSettings.currentVibe === 'locked-in'
                              ? 'bg-black border-red-500/40 text-red-100 placeholder-red-400 clip-path-jagged-small'
                              : (isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500')
                          }`}
                          style={vibeSettings.currentVibe === 'locked-in' ? {
                            clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                          } : {}}
                          placeholder="Weight"
                          disabled={!isEditing}
                          step={weightUnit === 'kg' ? '0.5' : '1'}
                        />
                        {isEditing && (
                          <button
                            onClick={() => toggleOlympicBar(exercise.id, setIndex)}
                            className={`px-4 py-2 text-sm font-black tracking-wider rounded-lg transition-colors duration-300 whitespace-nowrap touch-target min-w-[100px] border-2 ${
                              set.hasOlympicBar 
                                ? (vibeSettings.currentVibe === 'locked-in'
                                    ? 'bg-red-600 text-white hover:bg-red-700 border-red-400 shadow-lg clip-path-jagged-button'
                                    : 'bg-orange-600 text-white hover:bg-orange-700 border-orange-400 shadow-lg')
                                : (vibeSettings.currentVibe === 'locked-in'
                                    ? 'bg-gray-800 text-red-200 hover:bg-gray-700 border-red-500/40 clip-path-jagged-button'
                                    : (isDarkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-500 border-gray-500' : 'bg-gray-300 text-gray-800 hover:bg-gray-400 border-gray-400')
                                  )
                            }`}
                            style={{ 
                              fontFamily: 'system-ui, -apple-system, sans-serif', 
                              letterSpacing: '0.1em',
                              ...(vibeSettings.currentVibe === 'locked-in' ? {
                                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                              } : {})
                            }}
                            title={set.hasOlympicBar ? `Remove Olympic Bar (${olympicBarWeight} ${unitLabel})` : `Add Olympic Bar (${olympicBarWeight} ${unitLabel})`}
                          >
                            {set.hasOlympicBar ? '✓ BAR' : '+ BAR'}
                          </button>
                        )}
                      </div>
                      <label className={`text-xs mt-1 block font-medium transition-colors duration-300 ${
                        vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                      }`}>{unitLabel}</label>
                    </div>
                    
                    <div className="flex-1">
                      <input
                        type="number"
                        value={set.reps === 0 ? '' : set.reps}
                        onChange={(e) => updateSet(exercise.id, setIndex, 'reps', e.target.value)}
                        className={`w-full px-3 py-2 border text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 touch-target ${
                          vibeSettings.currentVibe === 'locked-in'
                            ? 'bg-black border-red-500/40 text-red-100 placeholder-red-400 clip-path-jagged-small'
                            : (isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500')
                        }`}
                        style={vibeSettings.currentVibe === 'locked-in' ? {
                          clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                        } : {}}
                        placeholder="Reps"
                        disabled={!isEditing}
                      />
                      <label className={`text-xs mt-1 block font-medium transition-colors duration-300 ${
                        vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                      }`}>REPS</label>
                    </div>
                    
                    {/* Only show tick button when NOT in edit mode */}
                    {!isEditing && (
                      <button
                        onClick={() => toggleSetCompletion(exercise.id, setIndex)}
                        className={`p-2 rounded-lg transition-colors duration-300 touch-target ${
                          set.completed
                            ? (vibeSettings.currentVibe === 'locked-in'
                                ? 'bg-red-600 text-white border border-red-400 clip-path-jagged-small'
                                : 'bg-green-100 text-green-600')
                            : (vibeSettings.currentVibe === 'locked-in'
                                ? 'bg-gray-800 text-red-300 hover:bg-gray-700 border border-red-500/40 clip-path-jagged-small'
                                : (isDarkMode ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200')
                              )
                        }`}
                        style={vibeSettings.currentVibe === 'locked-in' ? {
                          clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                        } : {}}
                        title={set.completed ? 'Set completed!' : 'Mark as completed'}
                      >
                        <Check size={16} />
                      </button>
                    )}
                    
                    {isEditing && exercise.sets.length > 1 && (
                      <button
                        onClick={() => removeSet(exercise.id, setIndex)}
                        className={`p-2 rounded-lg transition-colors duration-300 touch-target ${
                          vibeSettings.currentVibe === 'locked-in'
                            ? 'bg-red-900 text-red-400 hover:bg-red-800 border border-red-500/40 clip-path-jagged-small'
                            : (isDarkMode ? 'bg-red-900 text-red-400 hover:bg-red-800' : 'bg-red-100 text-red-600 hover:bg-red-200')
                        }`}
                        style={vibeSettings.currentVibe === 'locked-in' ? {
                          clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                        } : {}}
                        title="Remove set"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {isEditing && (
                <button
                  onClick={() => addSet(exercise.id)}
                  className={`w-full mt-3 py-2 border-2 border-dashed rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 touch-target font-black tracking-wider ${
                    vibeSettings.currentVibe === 'locked-in'
                      ? 'border-red-500/40 text-red-300 hover:border-red-400 hover:text-red-200 clip-path-jagged'
                      : (isDarkMode ? 'border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400' : 'border-gray-300 text-gray-500 hover:border-blue-300 hover:text-blue-500')
                  }`}
                  style={{ 
                    fontFamily: 'system-ui, -apple-system, sans-serif', 
                    letterSpacing: '0.1em',
                    ...(vibeSettings.currentVibe === 'locked-in' ? {
                      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
                    } : {})
                  }}
                >
                  <Plus size={16} />
                  <span>ADD SET</span>
                </button>
              )}
            </div>
          );
        })}
        
        {isEditing && (
          <div className={`shadow-sm border-2 border-dashed p-4 rounded-lg transition-colors duration-300 ${
            vibeSettings.currentVibe === 'locked-in'
              ? 'bg-gradient-to-br from-red-950/50 via-black/50 to-red-900/50 border-red-500/40 clip-path-jagged'
              : (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300')
          }`}
          style={vibeSettings.currentVibe === 'locked-in' ? {
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
          } : {}}>
            <div className="space-y-3">
              <div className={`text-sm font-black tracking-wider transition-colors duration-300 ${
                colors.text
              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                ADD EXERCISE
              </div>
              
              <ExerciseSelector
                onSelectExercise={handleSelectExercise}
                onNewExercise={handleNewExercise}
                isDarkMode={isDarkMode}
                exerciseLibrary={exerciseLibrary}
              />
              
              <div className={`text-xs font-medium transition-colors duration-300 ${
                vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
              }`}>
                💡 Browse {exerciseLibrary.exercises.length} exercises in the library or create custom ones
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseList;