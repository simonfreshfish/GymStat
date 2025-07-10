export interface VisualSettings {
  textSize: 'small' | 'medium' | 'large' | 'extra-large';
  gamma: number;
  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';
  highContrast: boolean;
  reducedMotion: boolean;
  screenOptimization: 'smartphone' | 'desktop';
}

export type VibeMode = 'default' | 'y2k-cyber' | 'locked-in';

export interface VibeSettings {
  currentVibe: VibeMode;
}

export interface WrappedPreferences {
  enabledCategories: string[];
  wrappedMode: 'weight' | 'cardio';
}

export const defaultVisualSettings: VisualSettings = {
  textSize: 'medium',
  gamma: 50,
  colorblindMode: 'none',
  highContrast: false,
  reducedMotion: false,
  screenOptimization: 'smartphone'
};

export const defaultVibeSettings: VibeSettings = {
  currentVibe: 'default'
};