import React from 'react';
import { Eye, Type, Contrast, Palette, Monitor, Accessibility, Smartphone } from 'lucide-react';
import { useVisualSettings } from '../VisualSettingsProvider';
import { getTextSizeClass, getHeadingSizeClass } from '../../utils/visualSettings';

interface VisualsTabProps {
  isDarkMode: boolean;
}

const VisualsTab: React.FC<VisualsTabProps> = ({ isDarkMode }) => {
  const { settings, updateSettings } = useVisualSettings();

  const textSizeOptions = [
    { value: 'small' as const, label: 'Small', description: 'Compact text for more content' },
    { value: 'medium' as const, label: 'Medium', description: 'Default comfortable reading' },
    { value: 'large' as const, label: 'Large', description: 'Easier to read text' },
    { value: 'extra-large' as const, label: 'Extra Large', description: 'Maximum readability' }
  ];

  const colorblindOptions = [
    { value: 'none' as const, label: 'None', description: 'Standard colors' },
    { value: 'protanopia' as const, label: 'Protanopia', description: 'Red-blind friendly' },
    { value: 'deuteranopia' as const, label: 'Deuteranopia', description: 'Green-blind friendly' },
    { value: 'tritanopia' as const, label: 'Tritanopia', description: 'Blue-blind friendly' },
    { value: 'monochrome' as const, label: 'Monochrome', description: 'High contrast black & white' }
  ];

  const screenOptimizationOptions = [
    { 
      value: 'smartphone' as const, 
      label: 'Smartphone', 
      description: 'Optimized for mobile devices',
      icon: Smartphone
    },
    { 
      value: 'desktop' as const, 
      label: 'Desktop', 
      description: 'Optimized for computer screens',
      icon: Monitor
    }
  ];

  const transitionClass = settings.reducedMotion ? 'transition-none' : 'transition-all duration-300';

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">👁️</div>
        <h2 className={`${getHeadingSizeClass(settings.textSize, 1)} font-bold mb-2 ${transitionClass} ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Visual Accessibility
        </h2>
        <p className={`${getTextSizeClass(settings.textSize)} ${transitionClass} ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Customize the display to match your visual preferences and device type
        </p>
      </div>

      {/* Screen Optimization Setting */}
      <div className={`p-6 border rounded-xl ${transitionClass} ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'
          }`}>
            {settings.screenOptimization === 'smartphone' ? <Smartphone size={24} /> : <Monitor size={24} />}
          </div>
          <div>
            <h3 className={`${getHeadingSizeClass(settings.textSize, 3)} font-semibold ${transitionClass} ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Screen Optimization
            </h3>
            <p className={`text-sm ${transitionClass} ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Optimize layout and interactions for your device type
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {screenOptimizationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => updateSettings({ screenOptimization: option.value })}
                className={`p-4 border rounded-lg text-left ${transitionClass} ${
                  settings.screenOptimization === option.value
                    ? (isDarkMode 
                        ? 'border-blue-500 bg-blue-900 text-blue-300' 
                        : 'border-blue-500 bg-blue-50 text-blue-700')
                    : (isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500' 
                        : 'border-gray-200 hover:border-gray-300')
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon size={20} className={`${
                    settings.screenOptimization === option.value
                      ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                      : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                  }`} />
                  <div className={`font-medium ${getTextSizeClass(option.value)} ${transitionClass} ${
                    settings.screenOptimization === option.value
                      ? (isDarkMode ? 'text-blue-300' : 'text-blue-700')
                      : (isDarkMode ? 'text-white' : 'text-gray-900')
                  }`}>
                    {option.label}
                  </div>
                </div>
                <div className={`text-xs ${transitionClass} ${
                  settings.screenOptimization === option.value
                    ? (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                    : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  {option.description}
                </div>
              </button>
            );
          })}
        </div>

        <div className={`mt-4 p-3 rounded-lg ${transitionClass} ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className={`text-sm ${transitionClass} ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <strong>Current:</strong> {settings.screenOptimization === 'smartphone' ? 'Smartphone' : 'Desktop'} optimization
          </div>
          <div className={`text-xs mt-1 ${transitionClass} ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {settings.screenOptimization === 'smartphone' 
              ? '📱 Touch-friendly controls, compact layout, mobile-first design'
              : '🖥️ Mouse-optimized controls, expanded layout, desktop-first design'
            }
          </div>
        </div>
      </div>

      {/* Text Size Setting */}
      <div className={`p-6 border rounded-xl ${transitionClass} ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'
          }`}>
            <Type size={24} />
          </div>
          <div>
            <h3 className={`${getHeadingSizeClass(settings.textSize, 3)} font-semibold ${transitionClass} ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Text Size
            </h3>
            <p className={`text-sm ${transitionClass} ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Adjust text size for better readability
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {textSizeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSettings({ textSize: option.value })}
              className={`p-4 border rounded-lg text-left ${transitionClass} ${
                settings.textSize === option.value
                  ? (isDarkMode 
                      ? 'border-green-500 bg-green-900 text-green-300' 
                      : 'border-green-500 bg-green-50 text-green-700')
                  : (isDarkMode 
                      ? 'border-gray-600 hover:border-gray-500' 
                      : 'border-gray-200 hover:border-gray-300')
              }`}
            >
              <div className={`font-medium mb-1 ${getTextSizeClass(option.value)} ${transitionClass} ${
                settings.textSize === option.value
                  ? (isDarkMode ? 'text-green-300' : 'text-green-700')
                  : (isDarkMode ? 'text-white' : 'text-gray-900')
              }`}>
                {option.label}
              </div>
              <div className={`text-xs ${transitionClass} ${
                settings.textSize === option.value
                  ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                  : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
              }`}>
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Gamma/Brightness Setting */}
      <div className={`p-6 border rounded-xl ${transitionClass} ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
          }`}>
            <Monitor size={24} />
          </div>
          <div>
            <h3 className={`${getHeadingSizeClass(settings.textSize, 3)} font-semibold ${transitionClass} ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Display Gamma
            </h3>
            <p className={`text-sm ${transitionClass} ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Adjust overall brightness and contrast
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className={`text-sm font-medium min-w-16 ${transitionClass} ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Dark
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.gamma}
              onChange={(e) => updateSettings({ gamma: parseInt(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className={`text-sm font-medium min-w-16 ${transitionClass} ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Bright
            </span>
          </div>
          <div className="text-center">
            <span className={`text-sm ${transitionClass} ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Current: {settings.gamma}%
            </span>
          </div>
        </div>
      </div>

      {/* Colorblind Support */}
      <div className={`p-6 border rounded-xl ${transitionClass} ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600'
          }`}>
            <Palette size={24} />
          </div>
          <div>
            <h3 className={`${getHeadingSizeClass(settings.textSize, 3)} font-semibold ${transitionClass} ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Colorblind Support
            </h3>
            <p className={`text-sm ${transitionClass} ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Optimize colors for different types of color vision
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {colorblindOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSettings({ colorblindMode: option.value })}
              className={`p-4 border rounded-lg text-left ${transitionClass} ${
                settings.colorblindMode === option.value
                  ? (isDarkMode 
                      ? 'border-purple-500 bg-purple-900 text-purple-300' 
                      : 'border-purple-500 bg-purple-50 text-purple-700')
                  : (isDarkMode 
                      ? 'border-gray-600 hover:border-gray-500' 
                      : 'border-gray-200 hover:border-gray-300')
              }`}
            >
              <div className={`font-medium mb-1 ${transitionClass} ${
                settings.colorblindMode === option.value
                  ? (isDarkMode ? 'text-purple-300' : 'text-purple-700')
                  : (isDarkMode ? 'text-white' : 'text-gray-900')
              }`}>
                {option.label}
              </div>
              <div className={`text-xs ${transitionClass} ${
                settings.colorblindMode === option.value
                  ? (isDarkMode ? 'text-purple-400' : 'text-purple-600')
                  : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
              }`}>
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility Toggles */}
      <div className={`p-6 border rounded-xl ${transitionClass} ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-orange-900 text-orange-400' : 'bg-orange-100 text-orange-600'
          }`}>
            <Accessibility size={24} />
          </div>
          <div>
            <h3 className={`${getHeadingSizeClass(settings.textSize, 3)} font-semibold ${transitionClass} ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Accessibility Options
            </h3>
            <p className={`text-sm ${transitionClass} ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Additional options for enhanced accessibility
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${transitionClass} ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                High Contrast Mode
              </div>
              <div className={`text-sm ${transitionClass} ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Increase contrast for better visibility
              </div>
            </div>
            <button
              onClick={() => updateSettings({ highContrast: !settings.highContrast })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${transitionClass} ${
                settings.highContrast 
                  ? 'bg-green-600' 
                  : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white ${transitionClass} ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${transitionClass} ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Reduce Motion
              </div>
              <div className={`text-sm ${transitionClass} ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Minimize animations and transitions
              </div>
            </div>
            <button
              onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${transitionClass} ${
                settings.reducedMotion 
                  ? 'bg-green-600' 
                  : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white ${transitionClass} ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className={`p-8 border-2 border-dashed rounded-xl ${transitionClass} ${
        isDarkMode 
          ? 'border-gray-600 bg-gray-800/50' 
          : 'border-gray-300 bg-gray-50'
      }`}>
        <div className="text-center">
          <Contrast className={`mx-auto mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={48} />
          
          <h3 className={`${getHeadingSizeClass(settings.textSize, 2)} font-bold mb-3 ${transitionClass} ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Settings Preview
          </h3>
          
          <div className={`p-4 rounded-lg ${transitionClass} ${
            isDarkMode ? 'bg-gray-700' : 'bg-white'
          }`}>
            <div className={`mb-2 ${getTextSizeClass(settings.textSize)} ${transitionClass} ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Sample workout text with your current settings
            </div>
            <div className={`text-sm ${transitionClass} ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Screen: {settings.screenOptimization} • Text: {settings.textSize} • Gamma: {settings.gamma}%
            </div>
            <div className={`text-xs mt-2 ${transitionClass} ${
              isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Colorblind: {settings.colorblindMode} • High Contrast: {settings.highContrast ? 'On' : 'Off'} • Motion: {settings.reducedMotion ? 'Reduced' : 'Normal'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualsTab;