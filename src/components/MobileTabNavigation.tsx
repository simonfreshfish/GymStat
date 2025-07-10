import React from 'react';
import { useVisualSettings } from './VisualSettingsProvider';
import { useVibe } from './VibeProvider';
import { getVibeClasses } from '../utils/vibeSettings';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface MobileTabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isDarkMode: boolean;
}

const MobileTabNavigation: React.FC<MobileTabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  isDarkMode
}) => {
  const { settings } = useVisualSettings();
  const { vibeSettings } = useVibe();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  const isMobile = settings.screenOptimization === 'smartphone';

  // Get highlight bar color based on vibe
  const getHighlightBarColor = () => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return 'bg-white'; // White highlight bar for LOCKED IN
    }
    return isDarkMode ? 'bg-blue-300' : 'bg-blue-200'; // Default blue
  };

  return (
    <div className={`
      border-b transition-all duration-500 flex-shrink-0
      ${vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}
      ${vibeClasses.border || ''}
    `}>
      <div className={`
        flex overflow-x-auto scrollbar-hide
        ${isMobile ? 'px-4 py-2 safe-area-left safe-area-right' : 'px-4'}
      `}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-shrink-0 transition-all duration-300 touch-target relative rounded-lg mx-1
              ${isMobile 
                ? 'px-4 py-4 min-w-[100px] flex flex-col items-center space-y-2' 
                : 'px-6 py-3 flex items-center space-x-2'
              }
              ${activeTab === tab.id
                ? `${vibeClasses.button || (isDarkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg')} font-bold border-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-300'} ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-button' : ''}`
                : `${vibeClasses.text || (isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100')} border-2 border-transparent`
              }
            `}
            style={vibeSettings.currentVibe === 'locked-in' && activeTab === tab.id ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}
          >
            {/* Enhanced active indicator */}
            {activeTab === tab.id && (
              <div className={`
                absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1 rounded-full transition-all duration-300
                ${isMobile ? 'w-16' : 'w-12'}
                ${getHighlightBarColor()}
                ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-bar' : ''}
              `} 
              style={vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)'
              } : {}} />
            )}
            
            <div className="relative z-10 flex flex-col items-center space-y-1">
              {tab.icon && (
                <span className={`
                  transition-all duration-300
                  ${activeTab === tab.id ? 'scale-125 drop-shadow-sm' : 'scale-100'}
                `}>
                  {tab.icon}
                </span>
              )}
              <span className={`
                whitespace-nowrap transition-all duration-300
                ${isMobile ? 'text-xs' : 'text-sm'}
                ${activeTab === tab.id ? 'font-black tracking-wide' : 'font-medium'}
              `}>
                {isMobile && tab.label.includes(' ') ? tab.label.split(' ')[0] : tab.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileTabNavigation;