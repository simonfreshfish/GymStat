import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WrappedPreferences } from '../types/settings';

interface WrappedPreferencesContextType {
  preferences: WrappedPreferences;
  updatePreferences: (newPreferences: WrappedPreferences) => void;
}

const WrappedPreferencesContext = createContext<WrappedPreferencesContextType | undefined>(undefined);

export const useWrappedPreferences = () => {
  const context = useContext(WrappedPreferencesContext);
  if (!context) {
    throw new Error('useWrappedPreferences must be used within a WrappedPreferencesProvider');
  }
  return context;
};

interface WrappedPreferencesProviderProps {
  children: ReactNode;
}

// Default preferences with all categories enabled
const defaultPreferences: WrappedPreferences = {
  wrappedMode: 'weight', // Default to weight training mode
  enabledCategories: [
    'animals', 'vehicles', 'people', 'buildings', 'space', 'objects', 'fictional',
    'star-wars', 'star-trek', 'halo', 'marvel', 'mass-effect', 'warhammer-40k',
    'alien', 'terminator', 'predator', 'minecraft', 'pokemon', 'harry-potter',
    'lord-of-the-rings', 'game-of-thrones', 'zelda', 'dnd'
  ]
};

export const WrappedPreferencesProvider: React.FC<WrappedPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<WrappedPreferences>(() => {
    try {
      let preferences = defaultPreferences;
      const savedPrefs = localStorage.getItem('wrappedPreferences');
      
      if (savedPrefs) {
        // Merge saved preferences with defaults to ensure all fields exist
        const parsed = JSON.parse(savedPrefs);
        preferences = { 
          ...defaultPreferences, 
          ...parsed,
          // Handle case where saved preferences don't have wrappedMode
          wrappedMode: parsed.wrappedMode || defaultPreferences.wrappedMode
        };
      }
      return preferences;
    } catch (error) {
      console.error('Failed to load wrapped preferences:', error);
      return defaultPreferences;
    }
  });

  const updatePreferences = (newPreferences: WrappedPreferences) => {
    setPreferences(newPreferences);
    try {
      localStorage.setItem('wrappedPreferences', JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Failed to save wrapped preferences:', error);
    }
  };

  return (
    <WrappedPreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </WrappedPreferencesContext.Provider>
  );
};