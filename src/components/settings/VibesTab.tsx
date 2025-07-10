import React from 'react';
import { Scale, Palette, Sparkles, Zap, Check, Sun, Moon, Route } from 'lucide-react';
import { WeightUnit, VibeMode, DistanceUnit } from '../../types/workout';
import { useVibe } from '../VibeProvider';
import { getVibeInfo, getVibeClasses } from '../../utils/vibeSettings';

interface VibesTabProps {
  isDarkMode: boolean;
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  onClose: () => void;
  onToggleDarkMode: () => void;
  onToggleWeightUnit: () => void;
  onToggleDistanceUnit: () => void;
}

const VibesTab: React.FC<VibesTabProps> = ({
  isDarkMode,
  weightUnit,
  distanceUnit,
  onToggleDarkMode,
  onToggleWeightUnit,
  onToggleDistanceUnit
}) => {
  const { vibeSettings, updateVibe } = useVibe();
  const currentVibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);

  const vibeOptions: VibeMode[] = ['default', 'y2k-cyber', 'locked-in'];

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">🎨</div>
        <h2 className={`text-3xl font-bold mb-2 transition-all duration-500 ${
          currentVibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')
        }`}>
          Customize Your Vibes
        </h2>
        <p className={`text-lg transition-all duration-500 ${
          currentVibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')
        }`}>
          Transform your GymStat experience with these aesthetic modes
        </p>
      </div>

      {/* Vibe Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vibeOptions.map((vibe) => {
          const vibeInfo = getVibeInfo(vibe);
          const vibeClasses = getVibeClasses(vibe, isDarkMode);
          const isActive = vibeSettings.currentVibe === vibe;
          
          return (
            <button
              key={vibe}
              onClick={() => updateVibe(vibe)}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-500 transform hover:scale-105 ${
                isActive
                  ? `${vibeClasses.card || (isDarkMode ? 'bg-gray-800' : 'bg-white')} ${vibeClasses.border || 'border-blue-500'} ${vibeClasses.glow || 'shadow-lg'}`
                  : `${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'}`
              } ${vibe === 'locked-in' && isActive ? 'clip-path-jagged' : ''}`}
              style={vibe === 'locked-in' && isActive ? {
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)'
              } : {}}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`text-3xl p-3 rounded-lg ${
                    isActive 
                      ? (vibeClasses.gradient || (isDarkMode ? 'bg-blue-900' : 'bg-blue-100'))
                      : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                  } ${vibe === 'locked-in' && isActive ? 'clip-path-jagged-small' : ''}`}
                  style={vibe === 'locked-in' && isActive ? {
                    clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)'
                  } : {}}>
                    {vibeInfo.emoji}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold transition-all duration-500 ${
                      isActive 
                        ? (vibeClasses.accent || 'text-blue-600')
                        : (isDarkMode ? 'text-white' : 'text-gray-900')
                    }`}>
                      {vibeInfo.name}
                    </h3>
                    <p className={`text-sm transition-all duration-500 ${
                      isActive 
                        ? (vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600'))
                        : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                    }`}>
                      {vibeInfo.description}
                    </p>
                  </div>
                </div>
                
                {isActive && (
                  <div className={`p-2 rounded-full ${vibeClasses.button || 'bg-blue-500'} ${
                    vibe === 'locked-in' ? 'clip-path-jagged-small' : ''
                  }`} style={vibe === 'locked-in' ? {
                    clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                  } : {}}>
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </div>
              
              {/* Preview Bar */}
              <div className={`h-3 rounded-full mb-3 ${
                vibeClasses.gradient || (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
              } ${vibe === 'locked-in' && isActive ? 'clip-path-jagged-bar' : ''}`} 
              style={vibe === 'locked-in' && isActive ? {
                clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
              } : {}} />
              
              <p className={`text-xs transition-all duration-500 ${
                isActive 
                  ? (vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600'))
                  : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
              }`}>
                {vibeInfo.preview}
              </p>

              {/* Special note for vibes that force dark mode */}
              {(vibe === 'y2k-cyber' || vibe === 'locked-in') && (
                <div className={`mt-3 p-2 rounded-lg text-xs ${
                  vibe === 'locked-in' 
                    ? (isDarkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700')
                    : (isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700')
                } ${vibe === 'locked-in' && isActive ? 'clip-path-jagged-small' : ''}`}
                style={vibe === 'locked-in' && isActive ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}>
                  {vibe === 'locked-in' ? '🔥 Automatically switches to dark mode for maximum intensity' : '⚡ Automatically switches to dark mode for optimal cyberpunk experience'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Current Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dark Mode Setting - Only show when default vibe is selected */}
        {vibeSettings.currentVibe === 'default' && (
          <div className={`p-6 border rounded-xl transition-all duration-500 ${
            currentVibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-3 rounded-lg ${
                currentVibeClasses.gradient || (isDarkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600')
              }`}>
                {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
              </div>
              <div>
                <h3 className={`text-lg font-semibold transition-all duration-500 ${
                  currentVibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')
                }`}>
                  Theme Mode
                </h3>
                <p className={`text-sm transition-all duration-500 ${
                  currentVibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  Currently: {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </p>
              </div>
            </div>
            
            <button
              onClick={onToggleDarkMode}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-500 ${
                currentVibeClasses.button || (isDarkMode 
                  ? 'bg-yellow-600 text-yellow-900 hover:bg-yellow-500' 
                  : 'bg-gray-700 text-yellow-400 hover:bg-gray-600')
              }`}
            >
              Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        )}

        {/* Weight Unit Setting */}
        <div className={`p-6 border rounded-xl transition-all duration-500 ${
          currentVibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
        } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}`}
        style={vibeSettings.currentVibe === 'locked-in' ? {
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
        } : {}}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-lg ${
              currentVibeClasses.gradient || (isDarkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600')
            } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
            } : {}}>
              <Scale size={24} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold transition-all duration-500 ${
                currentVibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')
              }`}>
                Weight Units
              </h3>
              <p className={`text-sm transition-all duration-500 ${
                currentVibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')
              }`}>
                Currently: {weightUnit === 'lbs' ? 'Pounds (lbs)' : 'Kilograms (kg)'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onToggleWeightUnit}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-500 ${
              currentVibeClasses.button || (isDarkMode 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-purple-500 text-white hover:bg-purple-600')
            } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-button' : ''}`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}
          >
            Switch to {weightUnit === 'lbs' ? 'Kilograms (kg)' : 'Pounds (lbs)'}
          </button>
        </div>
        
        {/* Distance Unit Setting */}
        <div className={`p-6 border rounded-xl transition-all duration-500 ${
          currentVibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
        } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}`}
        style={vibeSettings.currentVibe === 'locked-in' ? {
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
        } : {}}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-lg ${
              currentVibeClasses.gradient || (isDarkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600')
            } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
            } : {}}>
              <Route size={24} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold transition-all duration-500 ${
                currentVibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')
              }`}>
                Distance Units
              </h3>
              <p className={`text-sm transition-all duration-500 ${
                currentVibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')
              }`}>
                Currently: {distanceUnit === 'mi' ? 'Miles (mi)' : 'Kilometers (km)'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onToggleDistanceUnit}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-500 ${
              currentVibeClasses.button || (isDarkMode 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-green-500 text-white hover:bg-green-600')
            } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-button' : ''}`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}
          >
            Switch to {distanceUnit === 'mi' ? 'Kilometers (km)' : 'Miles (mi)'}
          </button>
        </div>
      </div>

      {/* Dark Mode Notice - Only show when NOT on default vibe */}
      {vibeSettings.currentVibe !== 'default' && (
        <div className={`p-6 border-2 border-dashed rounded-xl transition-all duration-500 ${
          currentVibeClasses.border || (isDarkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50')
        } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}`}
        style={vibeSettings.currentVibe === 'locked-in' ? {
          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)'
        } : {}}>
          <div className="text-center">
            <div className="text-4xl mb-3">🌙</div>
            
            <h3 className={`text-lg font-bold mb-3 transition-all duration-500 ${
              currentVibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')
            }`}>
              Dark Mode Control
            </h3>
            
            <p className={`text-sm transition-all duration-500 ${
              currentVibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-600')
            }`}>
              {vibeSettings.currentVibe === 'locked-in' 
                ? 'LOCKED IN vibe automatically uses dark mode for maximum intensity and focus. Switch to Default vibe to control light/dark mode manually.'
                : vibeSettings.currentVibe === 'y2k-cyber' 
                  ? 'Y2K Cyber vibe automatically uses dark mode for the best cyberpunk experience. Switch to Default vibe to control light/dark mode manually.'
                  : 'Dark mode toggle is only available when using the Default vibe. Switch to Default to control light/dark mode manually.'
              }
            </p>
          </div>
        </div>
      )}

      {/* Active Vibe Info */}
      <div className={`p-8 border-2 rounded-xl transition-all duration-500 ${
        currentVibeClasses.card || (isDarkMode ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-300')
      } ${currentVibeClasses.glow || ''} ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}`}
      style={vibeSettings.currentVibe === 'locked-in' ? {
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)'
      } : {}}>
        <div className="text-center">
          <div className="text-6xl mb-4">{getVibeInfo(vibeSettings.currentVibe).emoji}</div>
          
          <h3 className={`text-2xl font-bold mb-3 transition-all duration-500 ${
            currentVibeClasses.accent || (isDarkMode ? 'text-white' : 'text-gray-900')
          }`}>
            {getVibeInfo(vibeSettings.currentVibe).name} Active
          </h3>
          
          <p className={`text-base mb-6 transition-all duration-500 ${
            currentVibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')
          }`}>
            {getVibeInfo(vibeSettings.currentVibe).preview}
          </p>

          <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-500 ${
            currentVibeClasses.gradient || (isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700')
          } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-pill' : ''}`}
          style={vibeSettings.currentVibe === 'locked-in' ? {
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
          } : {}}>
            <Sparkles size={16} />
            <span className="font-medium">Vibe mode is transforming your experience!</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className={`p-6 border-2 border-dashed rounded-xl transition-all duration-500 ${
        currentVibeClasses.border || (isDarkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50')
      } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}`}
      style={vibeSettings.currentVibe === 'locked-in' ? {
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
      } : {}}>
        <div className="text-center">
          <Zap className={`mx-auto mb-4 ${currentVibeClasses.accent || (isDarkMode ? 'text-blue-400' : 'text-blue-600')}`} size={32} />
          
          <h3 className={`text-lg font-bold mb-3 transition-all duration-500 ${
            currentVibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')
          }`}>
            Pro Tips
          </h3>
          
          <div className={`text-sm space-y-2 transition-all duration-500 ${
            currentVibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-600')
          }`}>
            <p>• Vibes apply instantly across the entire app</p>
            <p>• Y2K Cyber and LOCKED IN automatically switch to dark mode</p>
            <p>• Dark mode is only controllable on Default vibe</p>
            <p>• Your vibe preference is saved automatically</p>
            <p>• LOCKED IN features aggressive, jagged styling for intense focus</p>
            <p>• Try different vibes to match your workout mood!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibesTab;