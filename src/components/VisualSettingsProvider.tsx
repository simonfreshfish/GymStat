import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VisualSettings } from '../types/settings';
import { loadVisualSettings, saveVisualSettings, applyGammaFilter, applyScreenOptimization } from '../utils/visualSettings';

interface VisualSettingsContextType {
  settings: VisualSettings;
  updateSettings: (newSettings: Partial<VisualSettings>) => void;
}

const VisualSettingsContext = createContext<VisualSettingsContextType | undefined>(undefined);

export const useVisualSettings = () => {
  const context = useContext(VisualSettingsContext);
  if (!context) {
    throw new Error('useVisualSettings must be used within a VisualSettingsProvider');
  }
  return context;
};

interface VisualSettingsProviderProps {
  children: ReactNode;
}

export const VisualSettingsProvider: React.FC<VisualSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<VisualSettings>(() => loadVisualSettings());

  const updateSettings = (newSettings: Partial<VisualSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveVisualSettings(updatedSettings);
  };

  // Apply global visual effects
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply gamma filter
    if (settings.gamma !== 50) {
      root.style.filter = applyGammaFilter(settings.gamma);
    } else {
      root.style.filter = '';
    }
    
    // Apply reduced motion preference
    if (settings.reducedMotion) {
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.setProperty('--transition-duration', '0.3s');
    }
    
    // Apply text size CSS custom property
    const textSizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px'
    };
    root.style.setProperty('--base-text-size', textSizeMap[settings.textSize]);
    
    // Apply colorblind mode classes to body
    const body = document.body;
    body.classList.remove('protanopia', 'deuteranopia', 'tritanopia', 'monochrome');
    if (settings.colorblindMode !== 'none') {
      body.classList.add(settings.colorblindMode);
    }
    
    // Apply high contrast mode
    body.classList.toggle('high-contrast', settings.highContrast);
    
    // Apply screen optimization
    applyScreenOptimization(settings.screenOptimization);
    
  }, [settings]);

  return (
    <VisualSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </VisualSettingsContext.Provider>
  );
};