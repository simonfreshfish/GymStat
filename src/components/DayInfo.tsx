import React from 'react';
import { Exercise, WeightUnit } from '../types/workout';
import { getDayStats } from '../utils/workoutCalculations';
import { convertWeight, formatWeight, getUnitLabel } from '../utils/unitConversion';
import { useVibe } from './VibeProvider';
import { getVibeClasses } from '../utils/vibeSettings';
import AnimatedWeightComparison from './AnimatedWeightComparison';

interface DayInfoProps {
  currentDayName: string;
  exercises: Exercise[];
  expandedDayStats: boolean;
  isDarkMode: boolean;
  weightUnit: WeightUnit;
  setExpandedDayStats: (expanded: boolean) => void;
}

const DayInfo: React.FC<DayInfoProps> = ({
  currentDayName,
  exercises,
  expandedDayStats,
  isDarkMode,
  weightUnit,
  setExpandedDayStats
}) => {
  const { vibeSettings } = useVibe();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  const dayStats = getDayStats(exercises);
  
  const displayWeight = (weight: number) => {
    const converted = convertWeight(weight, 'lbs', weightUnit);
    return formatWeight(converted, weightUnit);
  };

  const unitLabel = getUnitLabel(weightUnit);

  // Get proper text colors for LOCKED IN vibe
  const getTextColor = (type: 'primary' | 'secondary' | 'accent') => {
    if (vibeSettings.currentVibe === 'locked-in') {
      switch (type) {
        case 'primary': return 'text-red-100'; // White-ish text for primary content
        case 'secondary': return 'text-red-200'; // Slightly dimmer for secondary
        case 'accent': return 'text-red-400'; // Red accent color
        default: return 'text-red-100';
      }
    }
    
    // Use vibe classes or fallback to default
    switch (type) {
      case 'primary': return vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900');
      case 'secondary': return vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500');
      case 'accent': return vibeClasses.accent || 'text-purple-600';
      default: return vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900');
    }
  };

  const getStatColor = (statType: 'completed' | 'preview') => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return statType === 'completed' ? 'text-red-300' : 'text-red-400';
    }
    return vibeClasses.accent || (statType === 'completed' ? 'text-green-600' : 'text-purple-600');
  };

  // Get button text color - ALWAYS white in LOCKED IN mode
  const getButtonTextColor = () => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return 'text-white'; // Always white text in LOCKED IN mode
    }
    
    // For other vibes, use conditional logic
    if (expandedDayStats) {
      return 'text-white'; // Active state
    }
    
    return vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-700');
  };

  return (
    <div className={`px-4 py-4 border-b transition-all duration-500 ${
      vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
    } ${vibeClasses.border || ''} ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}`}
    style={vibeSettings.currentVibe === 'locked-in' ? {
      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
    } : {}}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-black tracking-wider transition-all duration-500 ${
            getTextColor('primary')
          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            {currentDayName || 'No Day Selected'}
          </h2>
          <p className={`text-sm mt-1 transition-all duration-500 font-medium ${
            getTextColor('secondary')
          }`}>
            {exercises.length} exercises • {exercises.reduce((total, ex) => total + ex.sets.length, 0)} sets
          </p>
        </div>
        
        <button
          onClick={() => setExpandedDayStats(!expandedDayStats)}
          className={`px-3 py-1 text-xs font-black tracking-wider rounded-lg transition-all duration-500 ${
            expandedDayStats 
              ? (vibeClasses.button || 'bg-purple-500 text-white')
              : (vibeSettings.currentVibe === 'locked-in' 
                  ? 'bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white border-red-500/40'
                  : (vibeClasses.card || (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'))
                )
          } ${vibeClasses.glow || ''} ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-button' : ''} ${getButtonTextColor()}`}
          style={vibeSettings.currentVibe === 'locked-in' ? {
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
            fontFamily: 'system-ui, -apple-system, sans-serif', 
            letterSpacing: '0.1em'
          } : { fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}
        >
          {expandedDayStats ? '✓ DAY STATS' : 'DAY STATS'}
        </button>
      </div>
      
      {expandedDayStats && (
        <div className={`mt-4 p-4 border rounded-lg transition-all duration-500 ${
          vibeClasses.gradient || (isDarkMode ? 'bg-gradient-to-r from-purple-900 to-pink-900 border-gray-600' : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200')
        } ${vibeClasses.glow || ''} ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}`}
        style={vibeSettings.currentVibe === 'locked-in' ? {
          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
        } : {}}>
          {dayStats.completed.totalWeight > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              <div className="text-center">
                <div className={`text-2xl font-black tracking-wider transition-all duration-500 ${
                  getStatColor('completed')
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  🏆 WORKOUT COMPLETE!
                </div>
                <div className={`text-sm mt-1 font-medium transition-all duration-500 ${
                  getTextColor('secondary')
                }`}>
                  {dayStats.completed.exerciseCount} exercises completed
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className={`text-center p-2 border rounded-lg transition-all duration-500 ${
                  vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200')
                } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}>
                  <div className={`text-lg font-black tracking-wider transition-all duration-500 ${
                    getStatColor('completed')
                  }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {dayStats.completed.setCount}
                  </div>
                  <div className={`text-xs font-medium transition-all duration-500 ${
                    getTextColor('secondary')
                  }`}>SETS COMPLETED</div>
                </div>
                <div className={`text-center p-2 border rounded-lg transition-all duration-500 ${
                  vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200')
                } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}>
                  <div className={`text-lg font-black tracking-wider transition-all duration-500 ${
                    vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (vibeClasses.accent || 'text-blue-600')
                  }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {displayWeight(dayStats.completed.totalWeight)} {unitLabel}
                  </div>
                  <div className={`text-xs font-medium transition-all duration-500 ${
                    getTextColor('secondary')
                  }`}>TOTAL VOLUME</div>
                </div>
              </div>
              
              {dayStats.completed.bestComparison && (
                <AnimatedWeightComparison 
                  totalWeight={dayStats.completed.totalWeight} 
                  isCompleted={true}
                  isDarkMode={isDarkMode}
                  weightUnit={weightUnit}
                />
              )}
            </div>
          ) : dayStats.preview.totalWeight > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              <div className="text-center">
                <div className={`text-2xl font-black tracking-wider transition-all duration-500 ${
                  getStatColor('preview')
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  🎯 {currentDayName} PREVIEW
                </div>
                <div className={`text-sm mt-1 font-medium transition-all duration-500 ${
                  getTextColor('secondary')
                }`}>
                  {dayStats.preview.exerciseCount} exercises planned
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className={`text-center p-2 border rounded-lg transition-all duration-500 ${
                  vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200')
                } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}>
                  <div className={`text-lg font-black tracking-wider transition-all duration-500 ${
                    vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (vibeClasses.accent || 'text-blue-600')
                  }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {dayStats.preview.setCount}
                  </div>
                  <div className={`text-xs font-medium transition-all duration-500 ${
                    getTextColor('secondary')
                  }`}>SETS PLANNED</div>
                </div>
                <div className={`text-center p-2 border rounded-lg transition-all duration-500 ${
                  vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200')
                } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}>
                  <div className={`text-lg font-black tracking-wider transition-all duration-500 ${
                    getStatColor('preview')
                  }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {displayWeight(dayStats.preview.totalWeight)} {unitLabel}
                  </div>
                  <div className={`text-xs font-medium transition-all duration-500 ${
                    getTextColor('secondary')
                  }`}>PLANNED VOLUME</div>
                </div>
              </div>
              
              {dayStats.preview.bestComparison && (
                <AnimatedWeightComparison 
                  totalWeight={dayStats.preview.totalWeight} 
                  isCompleted={false}
                  isDarkMode={isDarkMode}
                  weightUnit={weightUnit}
                />
              )}
            </div>
          ) : (
            <div className={`text-center italic font-medium transition-all duration-500 ${
              getTextColor('secondary')
            }`}>
              📝 Add weight and reps to exercises to see day stats!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayInfo;