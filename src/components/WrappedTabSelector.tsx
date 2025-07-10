import React from 'react';
import { Dumbbell, Activity, Check } from 'lucide-react';
import { useVibe } from './VibeProvider';
import { useVisualSettings } from './VisualSettingsProvider';
import { getVibeClasses } from '../utils/vibeSettings';

interface WrappedTabSelectorProps {
  isDarkMode: boolean;
  activeMode: 'weight' | 'cardio';
  onSelectMode: (mode: 'weight' | 'cardio') => void;
}

const WrappedTabSelector: React.FC<WrappedTabSelectorProps> = ({ 
  isDarkMode, 
  activeMode, 
  onSelectMode 
}) => {
  const { vibeSettings } = useVibe();
  const { settings } = useVisualSettings();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  const isMobile = settings.screenOptimization === 'smartphone';

  return (
    <div className={`
      mx-4 mt-6 mb-2 p-2 rounded-lg border-2 transition-colors duration-300
      ${vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200')}
      ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}
    `} style={vibeSettings.currentVibe === 'locked-in' ? {
      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
    } : {}}>
      <div className="flex items-center justify-center">
        <button
          onClick={() => onSelectMode('weight')}
          className={`
            flex-1 py-3 px-4 rounded-lg font-black tracking-wider transition-all duration-300 flex items-center justify-center space-x-2
            ${activeMode === 'weight'
              ? (vibeSettings.currentVibe === 'locked-in'
                  ? 'bg-gradient-to-r from-red-600 to-red-800 text-white clip-path-jagged-button'
                  : 'bg-blue-600 text-white')
              : (vibeSettings.currentVibe === 'locked-in'
                  ? 'bg-gray-800 text-red-300 hover:bg-gray-700 border border-red-500/40 clip-path-jagged-button'
                  : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'))
            }
          `}
          style={vibeSettings.currentVibe === 'locked-in' && activeMode === 'weight' ? {
            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
          } : {}}
        >
          <Dumbbell size={16} />
          <span className={isMobile ? 'text-sm' : 'text-base'}>WEIGHT WRAPPED</span>
          {activeMode === 'weight' && <Check size={16} className="ml-1" />}
        </button>
        <button
          onClick={() => onSelectMode('cardio')}
          className={`
            flex-1 py-3 px-4 rounded-lg font-black tracking-wider transition-all duration-300 flex items-center justify-center space-x-2
            ${activeMode === 'cardio'
              ? (vibeSettings.currentVibe === 'locked-in'
                  ? 'bg-gradient-to-r from-red-600 to-red-800 text-white clip-path-jagged-button'
                  : 'bg-green-600 text-white')
              : (vibeSettings.currentVibe === 'locked-in'
                  ? 'bg-gray-800 text-red-300 hover:bg-gray-700 border border-red-500/40 clip-path-jagged-button'
                  : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'))
            }
          `}
          style={vibeSettings.currentVibe === 'locked-in' && activeMode === 'cardio' ? {
            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
          } : {}}
        >
          <Activity size={16} />
          <span className={isMobile ? 'text-sm' : 'text-base'}>CARDIO WRAPPED</span>
          {activeMode === 'cardio' && <Check size={16} className="ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default WrappedTabSelector;