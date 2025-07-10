import React, { useState } from 'react';
import { ArrowLeft, Palette, Info, MessageCircle, Eye, Gift } from 'lucide-react';
import { WeightUnit, DistanceUnit } from '../types/workout';
import { useVisualSettings } from './VisualSettingsProvider';
import { useVibe } from './VibeProvider';
import { getTextSizeClass, getHeadingSizeClass } from '../utils/visualSettings';
import VibesTab from './settings/VibesTab';
import AboutTab from './settings/AboutTab';
import ContactTab from './settings/ContactTab';
import VisualsTab from './settings/VisualsTab';
import WrappedTab from './settings/WrappedTab';

interface SettingsProps {
  isDarkMode: boolean;
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  onClose: () => void;
  onToggleDarkMode: () => void;
  onToggleWeightUnit: () => void;
  onToggleDistanceUnit: () => void;
}

type SettingsTab = 'vibes' | 'about' | 'contact' | 'visuals' | 'wrapped';

const Settings: React.FC<SettingsProps> = ({
  isDarkMode,
  weightUnit,
  distanceUnit,
  onClose,
  onToggleDarkMode,
  onToggleWeightUnit,
  onToggleDistanceUnit
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('vibes');
  const { settings } = useVisualSettings();
  const { vibeSettings } = useVibe();
  const transitionClass = settings.reducedMotion ? 'transition-none' : 'transition-all duration-300';

  const tabs = [
    {
      id: 'vibes' as SettingsTab,
      name: 'Vibes',
      icon: Palette,
      description: 'Customize app aesthetics'
    },
    {
      id: 'wrapped' as SettingsTab,
      name: 'Wrapped',
      icon: Gift,
      description: 'Customize weight comparisons'
    },
    {
      id: 'visuals' as SettingsTab,
      name: 'Visuals',
      icon: Eye,
      description: 'Accessibility & display'
    },
    {
      id: 'about' as SettingsTab,
      name: 'About',
      icon: Info,
      description: 'Learn about the app'
    },
    {
      id: 'contact' as SettingsTab,
      name: 'Contact',
      icon: MessageCircle,
      description: 'Get support & feedback'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'vibes':
        return (
          <VibesTab
            isDarkMode={isDarkMode}
            weightUnit={weightUnit}
            distanceUnit={distanceUnit}
            onClose={onClose}
            onToggleDarkMode={onToggleDarkMode}
            onToggleWeightUnit={onToggleWeightUnit}
            onToggleDistanceUnit={onToggleDistanceUnit}
          />
        );
      case 'wrapped':
        return <WrappedTab isDarkMode={isDarkMode} />;
      case 'visuals':
        return <VisualsTab isDarkMode={isDarkMode} />;
      case 'about':
        return <AboutTab isDarkMode={isDarkMode} />;
      case 'contact':
        return <ContactTab isDarkMode={isDarkMode} />;
      default:
        return null;
    }
  };

  // Get button styles based on vibe
  const getButtonStyle = (isActive: boolean) => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return isActive
        ? 'bg-red-900 text-red-300 border border-red-500 clip-path-jagged-button'
        : 'text-red-100 hover:bg-red-950 hover:text-red-300';
    }
    
    return isActive
      ? (isDarkMode ? 'bg-blue-900 text-blue-300 border border-blue-700' : 'bg-blue-50 text-blue-700 border border-blue-200')
      : (isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900');
  };

  return (
    <div className={`min-h-screen ${transitionClass} ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b ${transitionClass} ${
        vibeSettings.currentVibe === 'locked-in'
          ? 'bg-gradient-to-br from-red-950/90 via-black/90 to-red-900/80 border-red-500/40'
          : (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
      }`}>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${transitionClass} ${
                  vibeSettings.currentVibe === 'locked-in'
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-950 clip-path-jagged-small'
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100')
                }`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}
                title="Back to app"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className={`${getHeadingSizeClass(settings.textSize, 1)} font-bold ${transitionClass} ${
                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-100' : (isDarkMode ? 'text-white' : 'text-gray-900')
                }`}>
                  Settings
                </h1>
                <p className={`${getTextSizeClass(settings.textSize)} ${transitionClass} ${
                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  Customize your GymStat experience
                </p>
              </div>
            </div>

            {/* Dark Mode Toggle - Only show when default vibe is selected */}
            {vibeSettings.currentVibe === 'default' && (
              <button
                onClick={onToggleDarkMode}
                className={`p-2 rounded-lg ${transitionClass} ${
                  isDarkMode 
                    ? 'bg-yellow-500 text-yellow-900 hover:bg-yellow-400' 
                    : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar Navigation */}
        <div className={`lg:w-80 border-r ${transitionClass} ${
          vibeSettings.currentVibe === 'locked-in'
            ? 'bg-gradient-to-br from-red-950/90 via-black/90 to-red-900/80 border-red-500/40'
            : (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
        }`}>
          <div className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${transitionClass} ${
                      getButtonStyle(isActive)
                    } ${vibeSettings.currentVibe === 'locked-in' && isActive ? 'clip-path-jagged-button' : ''}`}
                    style={vibeSettings.currentVibe === 'locked-in' && isActive ? {
                      clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                    } : {}}
                  >
                    <Icon size={20} className={`${
                      isActive 
                        ? (vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-blue-400' : 'text-blue-600'))
                        : (vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500'))
                    }`} />
                    <div className="flex-1">
                      <div className={`font-medium ${
                        isActive 
                          ? (vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-blue-300' : 'text-blue-700'))
                          : (vibeSettings.currentVibe === 'locked-in' ? 'text-red-100' : (isDarkMode ? 'text-gray-300' : 'text-gray-700'))
                      }`}>
                        {tab.name}
                      </div>
                      <div className={`text-xs ${
                        isActive 
                          ? (vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-blue-400' : 'text-blue-600'))
                          : (vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-500' : 'text-gray-500'))
                      }`}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;