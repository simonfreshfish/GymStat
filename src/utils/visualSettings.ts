import { VisualSettings, defaultVisualSettings } from '../types/settings';

const VISUAL_SETTINGS_KEY = 'visualSettings';

export const saveVisualSettings = (settings: VisualSettings): void => {
  try {
    localStorage.setItem(VISUAL_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save visual settings:', error);
  }
};

export const loadVisualSettings = (): VisualSettings => {
  try {
    const saved = localStorage.getItem(VISUAL_SETTINGS_KEY);
    return saved ? { ...defaultVisualSettings, ...JSON.parse(saved) } : defaultVisualSettings;
  } catch (error) {
    console.error('Failed to load visual settings:', error);
    return defaultVisualSettings;
  }
};

export const getTextSizeClass = (size: VisualSettings['textSize']): string => {
  switch (size) {
    case 'small': return 'text-sm';
    case 'medium': return 'text-base';
    case 'large': return 'text-lg';
    case 'extra-large': return 'text-xl';
    default: return 'text-base';
  }
};

export const getHeadingSizeClass = (size: VisualSettings['textSize'], level: 1 | 2 | 3 | 4 = 1): string => {
  const baseClasses = {
    1: { small: 'text-xl', medium: 'text-2xl', large: 'text-3xl', 'extra-large': 'text-4xl' },
    2: { small: 'text-lg', medium: 'text-xl', large: 'text-2xl', 'extra-large': 'text-3xl' },
    3: { small: 'text-base', medium: 'text-lg', large: 'text-xl', 'extra-large': 'text-2xl' },
    4: { small: 'text-sm', medium: 'text-base', large: 'text-lg', 'extra-large': 'text-xl' }
  };
  
  return baseClasses[level][size] || baseClasses[level]['medium'];
};

export const getColorblindClasses = (mode: VisualSettings['colorblindMode'], isDarkMode: boolean) => {
  if (mode === 'none') return {};
  
  const baseColors = {
    protanopia: {
      // Red-blind friendly: Use blue/yellow instead of red/green
      red: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      green: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
      redBg: isDarkMode ? 'bg-blue-900' : 'bg-blue-100',
      greenBg: isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'
    },
    deuteranopia: {
      // Green-blind friendly: Use blue/orange instead of red/green
      red: isDarkMode ? 'text-orange-400' : 'text-orange-600',
      green: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      redBg: isDarkMode ? 'bg-orange-900' : 'bg-orange-100',
      greenBg: isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
    },
    tritanopia: {
      // Blue-blind friendly: Use red/green with higher contrast
      red: isDarkMode ? 'text-red-300' : 'text-red-700',
      green: isDarkMode ? 'text-green-300' : 'text-green-700',
      redBg: isDarkMode ? 'bg-red-800' : 'bg-red-200',
      greenBg: isDarkMode ? 'bg-green-800' : 'bg-green-200'
    },
    monochrome: {
      // High contrast black and white
      red: isDarkMode ? 'text-white' : 'text-black',
      green: isDarkMode ? 'text-gray-300' : 'text-gray-700',
      redBg: isDarkMode ? 'bg-white' : 'bg-black',
      greenBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
    }
  };
  
  return baseColors[mode] || {};
};

export const applyGammaFilter = (gamma: number): string => {
  // Convert gamma percentage to CSS filter values
  const brightness = 0.5 + (gamma / 100);
  const contrast = 0.8 + (gamma / 250);
  
  return `brightness(${brightness}) contrast(${contrast})`;
};

export const getHighContrastClasses = (highContrast: boolean, isDarkMode: boolean) => {
  if (!highContrast) return {};
  
  return {
    text: isDarkMode ? 'text-white' : 'text-black',
    background: isDarkMode ? 'bg-black' : 'bg-white',
    border: isDarkMode ? 'border-white' : 'border-black',
    accent: isDarkMode ? 'text-yellow-300' : 'text-blue-800'
  };
};

export const getReducedMotionClasses = (reducedMotion: boolean): string => {
  return reducedMotion ? 'transition-none' : 'transition-all duration-300';
};

export const applyScreenOptimization = (optimization: VisualSettings['screenOptimization']) => {
  const body = document.body;
  
  // Remove existing screen optimization classes
  body.classList.remove('screen-smartphone', 'screen-desktop');
  
  // Add new screen optimization class
  body.classList.add(`screen-${optimization}`);
};