import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VibeSettings, VibeMode } from '../types/settings';
import { loadVibeSettings, saveVibeSettings, applyVibeToDocument } from '../utils/vibeSettings';

interface VibeContextType {
  vibeSettings: VibeSettings;
  updateVibe: (vibe: VibeMode) => void;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export const useVibe = () => {
  const context = useContext(VibeContext);
  if (!context) {
    throw new Error('useVibe must be used within a VibeProvider');
  }
  return context;
};

interface VibeProviderProps {
  children: ReactNode;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export const VibeProvider: React.FC<VibeProviderProps> = ({ children, isDarkMode, setIsDarkMode }) => {
  const [vibeSettings, setVibeSettings] = useState<VibeSettings>(() => loadVibeSettings());

  const updateVibe = (vibe: VibeMode) => {
    const newSettings = { ...vibeSettings, currentVibe: vibe };
    setVibeSettings(newSettings);
    saveVibeSettings(newSettings);
    
    // Force dark mode for Y2K Cyber and LOCKED IN vibes
    if ((vibe === 'y2k-cyber' || vibe === 'locked-in') && !isDarkMode) {
      setIsDarkMode(true);
    }
  };

  // Apply vibe to document when vibe or dark mode changes
  useEffect(() => {
    applyVibeToDocument(vibeSettings.currentVibe, isDarkMode);
  }, [vibeSettings.currentVibe, isDarkMode]);

  return (
    <VibeContext.Provider value={{ vibeSettings, updateVibe }}>
      {children}
    </VibeContext.Provider>
  );
};