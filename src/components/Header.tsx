import React from 'react';
import { Sun, Moon, Scale, RotateCcw, Settings, Smartphone, Monitor, Trophy, Route } from 'lucide-react';
import { WeightUnit, DistanceUnit } from '../types/workout';
import { useVisualSettings } from './VisualSettingsProvider';
import { useVibe } from './VibeProvider';
import { getVibeClasses } from '../utils/vibeSettings';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  weightUnit: WeightUnit;
  distanceUnit?: DistanceUnit;
  toggleWeightUnit: () => void;
  toggleDistanceUnit?: () => void;
  onRefreshDay?: () => void;
  onOpenSettings?: () => void;
  onOpenWeightViewer?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isDarkMode, 
  toggleDarkMode, 
  weightUnit, 
  distanceUnit = 'mi',
  toggleWeightUnit,
  toggleDistanceUnit,
  onRefreshDay,
  onOpenSettings,
  onOpenWeightViewer
}) => {
  const { settings, updateSettings } = useVisualSettings();
  const { vibeSettings } = useVibe();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  const isMobile = settings.screenOptimization === 'smartphone';
  const showDistanceToggle = toggleDistanceUnit !== undefined;
  
  // Only show dark mode toggle when on default vibe
  const showDarkModeToggle = vibeSettings.currentVibe === 'default';

  const toggleScreenOptimization = () => {
    updateSettings({ 
      screenOptimization: settings.screenOptimization === 'smartphone' ? 'desktop' : 'smartphone' 
    });
  };

  // Get button styles based on vibe
  const getButtonStyles = (baseColor: string) => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return `
        transition-all duration-300 flex flex-col items-center justify-center rounded-lg
        ${isMobile ? 'p-3 text-xs' : 'p-2 text-xs'}
        bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-lg shadow-red-600/30
        clip-path-jagged-button transform hover:scale-105 active:scale-95
      `;
    }
    
    return `
      transition-colors duration-300 flex flex-col items-center justify-center rounded-lg
      ${isMobile ? 'p-3 text-xs' : 'p-2 text-xs'}
      ${baseColor}
    `;
  };

  return (
    <div className={`
      shadow-sm border-b transition-colors duration-300 flex-shrink-0
      ${vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}
      ${vibeClasses.border || ''}
    `}>
      <div className={`px-4 py-4 ${isMobile ? 'safe-area-left safe-area-right' : ''}`}>
        {/* App Title - Centered with custom font */}
        <div className="text-center mb-4">
          <h1 className={`
            font-black tracking-wider transition-colors duration-300
            ${isMobile ? 'text-2xl' : 'text-3xl'}
            ${vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')}
          `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            GYMSTAT
          </h1>
        </div>
        
        {/* Action Buttons Grid */}
        <div className={`grid gap-2 ${isMobile ? 'grid-cols-3' : 'grid-cols-6'}`}>
          {onRefreshDay && (
            <button
              onClick={onRefreshDay}
              className={getButtonStyles(
                isDarkMode 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-red-500 text-white hover:bg-red-600'
              )}
              title="Reset all completed sets for current day"
              style={vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
              } : {}}
            >
              <RotateCcw size={isMobile ? 18 : 16} />
              <span className="mt-1">RESET</span>
            </button>
          )}
          
          {/* Screen Optimization Toggle */}
          <button
            onClick={toggleScreenOptimization}
            className={getButtonStyles(
              isDarkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            )}
            title={`Optimized for ${settings.screenOptimization === 'smartphone' ? 'Smartphone' : 'Desktop'}`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}
          >
            {settings.screenOptimization === 'smartphone' ? (
              <Smartphone size={isMobile ? 18 : 16} />
            ) : (
              <Monitor size={isMobile ? 18 : 16} />
            )}
            <span className="mt-1">{settings.screenOptimization === 'smartphone' ? 'MOBILE' : 'DESKTOP'}</span>
          </button>
          
          <button
            onClick={toggleWeightUnit}
            className={getButtonStyles(
              isDarkMode 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-purple-500 text-white hover:bg-purple-600'
            )}
            title={`Switch to ${weightUnit === 'lbs' ? 'Kilograms' : 'Pounds'}`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}
          >
            <Scale size={isMobile ? 18 : 16} />
            <span className="mt-1">{weightUnit.toUpperCase()}</span>
          </button>

          {/* Distance Unit Toggle */}
          {showDistanceToggle && toggleDistanceUnit && (
            <button
              onClick={toggleDistanceUnit}
              className={getButtonStyles(
                isDarkMode 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              )}
              title={`Switch to ${distanceUnit === 'mi' ? 'Kilometers' : 'Miles'}`}
              style={vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
              } : {}}
            >
              <Route size={isMobile ? 18 : 16} />
              <span className="mt-1">{distanceUnit.toUpperCase()}</span>
            </button>
          )}
          
          {/* Trophies Button - Now with text */}
          {onOpenWeightViewer && (
            <button
              onClick={onOpenWeightViewer}
              className={getButtonStyles(
                isDarkMode 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              )}
              title="View my achievements and weight comparisons"
              style={vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
              } : {}}
            >
              <Trophy size={isMobile ? 18 : 16} />
              <span className="mt-1">TROPHIES</span>
            </button>
          )}
          
          {showDarkModeToggle && (
            <button
              onClick={toggleDarkMode}
              className={getButtonStyles(
                isDarkMode 
                  ? 'bg-yellow-500 text-yellow-900 hover:bg-yellow-400' 
                  : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
              )}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={isMobile ? 18 : 16} /> : <Moon size={isMobile ? 18 : 16} />}
              <span className="mt-1">{isDarkMode ? 'LIGHT' : 'DARK'}</span>
            </button>
          )}
          
          <button
            onClick={onOpenSettings}
            className={getButtonStyles(
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            )}
            title="Open Settings"
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}
          >
            <Settings size={isMobile ? 18 : 16} />
            <span className="mt-1">SETTINGS</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;