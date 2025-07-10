import React, { useState, useEffect } from 'react';
import { WeightUnit } from '../types/workout';
import { convertWeight, getUnitLabel, formatLargeWeight } from '../utils/unitConversion';
import { getMultipleWeightComparisons } from '../utils/weightComparisons';
import { useVibe } from './VibeProvider';
import { getVibeClasses } from '../utils/vibeSettings';

interface AnimatedWeightComparisonProps {
  totalWeight: number;
  isCompleted?: boolean;
  isDarkMode: boolean;
  weightUnit: WeightUnit;
}

const AnimatedWeightComparison: React.FC<AnimatedWeightComparisonProps> = ({ 
  totalWeight, 
  isCompleted = false,
  isDarkMode,
  weightUnit 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { vibeSettings } = useVibe();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  
  const comparisons = getMultipleWeightComparisons(totalWeight, 5);
  const displayWeight = formatLargeWeight(totalWeight, weightUnit);
  
  useEffect(() => {
    if (comparisons.length <= 1) return;
    
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % comparisons.length);
        setIsVisible(true);
      }, 400);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [comparisons.length]);
  
  if (comparisons.length === 0) return null;
  
  const currentComparison = comparisons[currentIndex];
  const statusText = isCompleted ? 'Total Weight Moved' : 'Planned Weight';
  const statusEmoji = isCompleted ? '🏋️' : '🔮';

  // Get styling based on vibe
  const getComparisonStyling = () => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return {
        container: `text-center p-3 border-l-4 transition-colors duration-300 ${
          isCompleted 
            ? 'border-white bg-black' 
            : 'border-red-500 bg-gradient-to-r from-red-950/80 to-black/80'
        } clip-path-jagged`,
        title: `text-lg font-medium mb-1 transition-colors duration-300 ${
          isCompleted 
            ? 'text-white'
            : 'text-red-300'
        }`,
        comparison: `text-base transition-opacity duration-600 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } text-red-100`,
        highlight: `font-bold transition-colors duration-300 ${
          isCompleted 
            ? 'text-white'
            : 'text-red-400'
        }`,
        encouragement: `text-xs mt-2 transition-colors duration-300 text-red-200`,
        dots: comparisons.length > 1 ? 'flex justify-center space-x-1 mt-2' : 'hidden',
        dotActive: isCompleted ? 'bg-white' : 'bg-red-500',
        dotInactive: 'bg-red-700',
        style: {
          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
        }
      };
    }
    
    return {
      container: `text-center p-3 border-l-4 transition-colors duration-300 ${
        isCompleted ? 'border-green-500' : 'border-blue-500'
      } ${vibeClasses.card || (isDarkMode ? 'bg-gray-800' : 'bg-white')}`,
      title: `text-lg font-medium mb-1 transition-colors duration-300 ${
        isCompleted 
          ? (isDarkMode ? 'text-green-400' : 'text-green-700')
          : (isDarkMode ? 'text-blue-400' : 'text-blue-700')
      }`,
      comparison: `text-base transition-opacity duration-600 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`,
      highlight: `font-bold transition-colors duration-300 ${
        isCompleted 
          ? (isDarkMode ? 'text-green-400' : 'text-green-600')
          : (isDarkMode ? 'text-blue-400' : 'text-blue-600')
      }`,
      encouragement: `text-xs mt-2 transition-colors duration-300 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`,
      dots: comparisons.length > 1 ? 'flex justify-center space-x-1 mt-2' : 'hidden',
      dotActive: isCompleted ? 'bg-green-500' : 'bg-blue-500',
      dotInactive: isDarkMode ? 'bg-gray-600' : 'bg-gray-300',
      style: {}
    };
  };

  const styling = getComparisonStyling();
  
  return (
    <div className={styling.container} style={styling.style}>
      <div className={styling.title}>
        {statusEmoji} {statusText}: {displayWeight}
      </div>
      <div 
        className={styling.comparison}
        style={{ minHeight: '1.5rem' }}
      >
        {isCompleted ? "That's like lifting" : "You'll be lifting"}{' '}
        <span className={styling.highlight}>
          {currentComparison.count === 1 
            ? `1 ${currentComparison.name}` 
            : `${currentComparison.count} ${currentComparison.plural}`
          }
        </span>
        ! {isCompleted ? '🎯' : '💪'}
      </div>
      {!isCompleted && (
        <div className={styling.encouragement}>
          ✅ Complete sets to see final stats!
        </div>
      )}
      {comparisons.length > 1 && (
        <div className={styling.dots}>
          {comparisons.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 transition-colors duration-300 ${
                index === currentIndex 
                  ? styling.dotActive
                  : styling.dotInactive
              } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}`}
              style={vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 1px) 0, 100% 1px, 100% calc(100% - 1px), calc(100% - 1px) 100%, 1px 100%, 0 calc(100% - 1px), 0 1px)'
              } : {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedWeightComparison;