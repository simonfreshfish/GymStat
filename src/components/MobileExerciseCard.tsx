import React from 'react';
import { Check, Plus, X } from 'lucide-react';
import { Exercise, WeightUnit } from '../types/workout';
import { convertWeight, formatWeight, getOlympicBarWeight, getUnitLabel } from '../utils/unitConversion';
import { useVisualSettings } from './VisualSettingsProvider';
import { useVibe } from './VibeProvider';
import { getVibeClasses } from '../utils/vibeSettings';
import TouchOptimizedButton from './TouchOptimizedButton';
import TouchOptimizedInput from './TouchOptimizedInput';
import SwipeableCard from './SwipeableCard';

interface MobileExerciseCardProps {
  exercise: Exercise;
  isEditing: boolean;
  isDarkMode: boolean;
  weightUnit: WeightUnit;
  onDeleteExercise: (id: number) => void;
  onToggleSetCompletion: (exerciseId: number, setIndex: number) => void;
  onAddSet: (exerciseId: number) => void;
  onUpdateSet: (exerciseId: number, setIndex: number, field: string, value: string) => void;
  onToggleOlympicBar: (exerciseId: number, setIndex: number) => void;
  onRemoveSet: (exerciseId: number, setIndex: number) => void;
}

const MobileExerciseCard: React.FC<MobileExerciseCardProps> = ({
  exercise,
  isEditing,
  isDarkMode,
  weightUnit,
  onDeleteExercise,
  onToggleSetCompletion,
  onAddSet,
  onUpdateSet,
  onToggleOlympicBar,
  onRemoveSet
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

  const completedSets = exercise.sets.filter(set => set.completed).length;
  const totalSets = exercise.sets.length;
  const progressPercentage = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  // Get colors based on vibe
  const getCardColors = () => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return {
        card: 'bg-gradient-to-br from-red-950/90 via-black/90 to-red-900/80 border-red-500/40',
        text: 'text-red-100',
        accent: 'text-red-400',
        progressBar: 'bg-gray-900 border-2 border-red-500/40',
        progressFill: progressPercentage === 100 ? 'bg-black border-2 border-white' : 'bg-black border-2 border-red-500',
        setContainer: 'bg-black border-red-500/40',
        setNumber: completedSets > 0 ? 'bg-black text-white border-2 border-white' : 'bg-gray-800 text-red-300 border-2 border-red-500/40'
      };
    }
    
    return {
      card: vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'),
      text: vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900'),
      accent: vibeClasses.accent || 'text-blue-600',
      progressBar: isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
      progressFill: progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500',
      setContainer: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
      setNumber: completedSets > 0 ? 'bg-green-500 text-white' : (isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600')
    };
  };

  const colors = getCardColors();

  return (
    <SwipeableCard
      onSwipeLeft={isEditing ? () => onDeleteExercise(exercise.id) : undefined}
      className={`
        shadow-sm border transition-colors duration-300 relative
        ${isMobile ? 'rounded-lg p-4 mb-4' : 'rounded p-3 mb-3'}
        ${colors.card}
        ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}
      `}
      style={vibeSettings.currentVibe === 'locked-in' ? {
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
      } : {}}
      isDarkMode={isDarkMode}
    >
      {/* Exercise Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className={`
            font-black tracking-wider transition-colors duration-300
            ${isMobile ? 'text-lg' : 'text-base'}
            ${colors.text}
          `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            {exercise.name.toUpperCase()}
          </h3>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-2 mt-1">
            <div className={`
              flex-1 h-2 rounded-full overflow-hidden
              ${colors.progressBar}
              ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-bar' : ''}
            `}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)'
            } : {}}>
              <div 
                className={`
                  h-full transition-all duration-300
                  ${colors.progressFill}
                  ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-bar' : ''}
                `}
                style={{ 
                  width: `${progressPercentage}%`,
                  ...(vibeSettings.currentVibe === 'locked-in' ? {
                    clipPath: 'polygon(0 0, calc(100% - 1px) 0, 100% 1px, 100% calc(100% - 1px), calc(100% - 1px) 100%, 1px 100%, 0 calc(100% - 1px), 0 1px)'
                  } : {})
                }}
              />
            </div>
            <span className={`
              text-xs font-black tracking-wider
              ${vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
            `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
              {completedSets}/{totalSets}
            </span>
          </div>
        </div>
        
        {isEditing && (
          <TouchOptimizedButton
            onClick={() => onDeleteExercise(exercise.id)}
            variant="danger"
            size="small"
            isDarkMode={isDarkMode}
            className={`ml-2 ${vibeSettings.currentVibe === 'locked-in' ? 'bg-red-900 text-red-400 hover:bg-red-800 border border-red-500/40 clip-path-jagged-small' : ''}`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
            } : {}}
          >
            <X size={16} />
          </TouchOptimizedButton>
        )}
      </div>

      {/* Sets */}
      <div className="space-y-3">
        {exercise.sets.map((set, setIndex) => (
          <div key={setIndex} className={`
            flex items-center space-x-3 p-3 rounded-lg
            ${colors.setContainer}
            ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}
          `}
          style={vibeSettings.currentVibe === 'locked-in' ? {
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
          } : {}}>
            {/* Set number */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-black tracking-wider
              ${colors.setNumber}
              ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}
            `} style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif', 
              letterSpacing: '0.1em',
              ...(vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)'
              } : {})
            }}>
              {setIndex + 1}
            </div>
            
            {/* Weight input */}
            <div className="flex-1">
              <TouchOptimizedInput
                type="number"
                value={set.weight === 0 ? '' : displayWeight(set.weight)}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue === '') {
                    onUpdateSet(exercise.id, setIndex, 'weight', '0');
                  } else {
                    const displayValue = parseFloat(inputValue) || 0;
                    const lbsValue = convertWeight(displayValue, weightUnit, 'lbs');
                    onUpdateSet(exercise.id, setIndex, 'weight', lbsValue.toString());
                  }
                }}
                placeholder="Weight"
                disabled={!isEditing}
                isDarkMode={isDarkMode}
                step={weightUnit === 'kg' ? '0.5' : '1'}
                className={vibeSettings.currentVibe === 'locked-in' ? 'bg-black border-red-500/40 text-red-100 placeholder-red-400 clip-path-jagged-small' : ''}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}
              />
              <label className={`
                text-xs mt-1 block font-black tracking-wider transition-colors duration-300
                ${vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}
              `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                {unitLabel}
              </label>
            </div>
            
            {/* Reps input */}
            <div className="flex-1">
              <TouchOptimizedInput
                type="number"
                value={set.reps === 0 ? '' : set.reps}
                onChange={(e) => onUpdateSet(exercise.id, setIndex, 'reps', e.target.value)}
                placeholder="Reps"
                disabled={!isEditing}
                isDarkMode={isDarkMode}
                className={vibeSettings.currentVibe === 'locked-in' ? 'bg-black border-red-500/40 text-red-100 placeholder-red-400 clip-path-jagged-small' : ''}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}
              />
              <label className={`
                text-xs mt-1 block font-black tracking-wider transition-colors duration-300
                ${vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}
              `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                REPS
              </label>
            </div>
            
            {/* Olympic bar toggle (mobile) */}
            {isEditing && isMobile && (
              <TouchOptimizedButton
                onClick={() => onToggleOlympicBar(exercise.id, setIndex)}
                variant={set.hasOlympicBar ? 'success' : 'secondary'}
                size="small"
                isDarkMode={isDarkMode}
                className={`!px-3 !min-w-[60px] font-black tracking-wider border-2 ${
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
              >
                {set.hasOlympicBar ? '✓ BAR' : '+ BAR'}
              </TouchOptimizedButton>
            )}
            
            {/* Complete button - Only show when NOT in edit mode */}
            {!isEditing && (
              <TouchOptimizedButton
                onClick={() => onToggleSetCompletion(exercise.id, setIndex)}
                variant={set.completed ? 'success' : 'secondary'}
                size="small"
                isDarkMode={isDarkMode}
                className={vibeSettings.currentVibe === 'locked-in' ? (
                  set.completed
                    ? 'bg-black text-white border-2 border-white clip-path-jagged-small'
                    : 'bg-gray-800 text-red-300 hover:bg-gray-700 border border-red-500/40 clip-path-jagged-small'
                ) : ''}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}
              >
                <Check size={16} />
              </TouchOptimizedButton>
            )}
            
            {/* Remove set button */}
            {isEditing && exercise.sets.length > 1 && (
              <TouchOptimizedButton
                onClick={() => onRemoveSet(exercise.id, setIndex)}
                variant="danger"
                size="small"
                isDarkMode={isDarkMode}
                className={vibeSettings.currentVibe === 'locked-in' ? 'bg-red-900 text-red-400 hover:bg-red-800 border border-red-500/40 clip-path-jagged-small' : ''}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}
              >
                <X size={16} />
              </TouchOptimizedButton>
            )}
          </div>
        ))}
      </div>
      
      {/* Olympic bar toggle (desktop) */}
      {isEditing && !isMobile && (
        <div className="mt-3 flex flex-wrap gap-2">
          {exercise.sets.map((set, setIndex) => (
            <TouchOptimizedButton
              key={setIndex}
              onClick={() => onToggleOlympicBar(exercise.id, setIndex)}
              variant={set.hasOlympicBar ? 'success' : 'secondary'}
              size="small"
              isDarkMode={isDarkMode}
              className={`font-black tracking-wider border-2 ${
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
            >
              SET {setIndex + 1}: {set.hasOlympicBar ? `✓ BAR (${olympicBarWeight} ${unitLabel})` : `+ BAR`}
            </TouchOptimizedButton>
          ))}
        </div>
      )}
      
      {/* Add set button */}
      {isEditing && (
        <TouchOptimizedButton
          onClick={() => onAddSet(exercise.id)}
          variant="secondary"
          size="medium"
          isDarkMode={isDarkMode}
          className={`w-full mt-4 border-2 border-dashed font-black tracking-wider ${
            vibeSettings.currentVibe === 'locked-in' 
              ? 'border-red-500/40 text-red-300 hover:border-red-400 hover:text-red-200 clip-path-jagged'
              : ''
          }`}
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif', 
            letterSpacing: '0.1em',
            ...(vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {})
          }}
        >
          <Plus size={16} className="mr-2" />
          ADD SET
        </TouchOptimizedButton>
      )}
    </SwipeableCard>
  );
};

export default MobileExerciseCard;