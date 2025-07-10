import { VibeSettings, VibeMode, defaultVibeSettings } from '../types/settings';

const VIBE_SETTINGS_KEY = 'vibeSettings';

export const saveVibeSettings = (settings: VibeSettings): void => {
  try {
    localStorage.setItem(VIBE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save vibe settings:', error);
  }
};

export const loadVibeSettings = (): VibeSettings => {
  try {
    const saved = localStorage.getItem(VIBE_SETTINGS_KEY);
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      const mergedSettings = { ...defaultVibeSettings, ...parsedSettings };
      
      // Validate that currentVibe is a valid VibeMode
      const validVibeModes: VibeMode[] = ['default', 'y2k-cyber', 'locked-in'];
      if (!validVibeModes.includes(mergedSettings.currentVibe)) {
        mergedSettings.currentVibe = 'default';
      }
      
      return mergedSettings;
    }
    return defaultVibeSettings;
  } catch (error) {
    console.error('Failed to load vibe settings:', error);
    return defaultVibeSettings;
  }
};

export const getVibeClasses = (vibe: VibeMode, isDarkMode: boolean) => {
  const baseClasses = {
    container: '',
    background: '',
    card: '',
    text: '',
    accent: '',
    button: '',
    border: '',
    gradient: '',
    glow: '',
    filter: ''
  };

  switch (vibe) {
    case 'locked-in':
      return {
        ...baseClasses,
        background: 'bg-gradient-to-br from-black via-red-950 to-gray-900',
        card: 'bg-gradient-to-br from-red-950/90 via-black/90 to-red-900/80 border-red-500/40 shadow-red-500/30',
        text: 'text-red-100',
        accent: 'text-red-400',
        button: 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-lg shadow-red-600/30 transform hover:scale-105 active:scale-95',
        border: 'border-red-500/40',
        gradient: 'bg-gradient-to-r from-red-800/30 via-black/30 to-red-700/30',
        glow: 'shadow-lg shadow-red-600/25',
        filter: 'drop-shadow-sm drop-shadow-red-500/30'
      };

    case 'y2k-cyber':
      return {
        ...baseClasses,
        background: isDarkMode 
          ? 'bg-gradient-to-br from-black via-purple-900 to-blue-900' 
          : 'bg-gradient-to-br from-gray-900 via-purple-800 to-blue-800',
        card: isDarkMode 
          ? 'bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-black/80 border-cyan-400/30 shadow-cyan-400/20' 
          : 'bg-gradient-to-br from-purple-800/90 via-blue-800/90 to-gray-900/90 border-cyan-300/40 shadow-cyan-300/30',
        text: 'text-cyan-300',
        accent: 'text-cyan-400',
        button: isDarkMode 
          ? 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/25' 
          : 'bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-400 hover:to-cyan-300 text-white shadow-lg shadow-cyan-400/30',
        border: 'border-cyan-400/30',
        gradient: 'bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-500/20',
        glow: 'shadow-lg shadow-cyan-500/20',
        filter: 'drop-shadow-sm drop-shadow-cyan-500/20'
      };

    default:
      return baseClasses;
  }
};

export const getVibeInfo = (vibe: VibeMode) => {
  const vibeData = {
    'default': {
      name: 'Default',
      description: 'Clean and professional',
      emoji: '🏋️',
      preview: 'Standard GymStat experience'
    },
    'y2k-cyber': {
      name: 'Y2K Cyber Gym',
      description: 'Neon blues and purples with 2000s vibes',
      emoji: '🤖',
      preview: 'Matrix-inspired cyberpunk aesthetics'
    },
    'locked-in': {
      name: 'LOCKED IN',
      description: 'Aggressive red and black with jagged edges',
      emoji: '🔥',
      preview: 'Intense, focused, no-nonsense training mode'
    }
  };

  return vibeData[vibe] || vibeData['default'];
};

export const applyVibeToDocument = (vibe: VibeMode, isDarkMode: boolean) => {
  const root = document.documentElement;
  const body = document.body;
  
  // Remove existing vibe classes
  body.classList.remove('vibe-default', 'vibe-y2k-cyber', 'vibe-locked-in');
  
  // Add new vibe class
  body.classList.add(`vibe-${vibe}`);
  
  // Apply CSS custom properties for the vibe
  const vibeClasses = getVibeClasses(vibe, isDarkMode);
  
  // Set CSS custom properties for dynamic styling
  root.style.setProperty('--vibe-filter', vibeClasses.filter);
  
  // Clear any global filters
  root.style.filter = '';
};