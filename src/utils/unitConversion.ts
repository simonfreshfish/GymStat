import { WeightUnit } from '../types/workout';

// Conversion constants
const LBS_TO_KG = 0.453592;
const KG_TO_LBS = 2.20462;
const MI_TO_KM = 1.60934;
const KM_TO_MI = 0.621371;

export const convertWeight = (weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
  if (fromUnit === toUnit) return weight;
  
  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return Math.round(weight * LBS_TO_KG * 2) / 2; // Round to nearest 0.5
  }
  
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return Math.round(weight * KG_TO_LBS * 2) / 2; // Round to nearest 0.5
  }
  
  return weight;
};

export const formatWeight = (weight: number, unit: WeightUnit): string => {
  // Round to nearest 0.5 and format with max 1 decimal place
  const rounded = Math.round(weight * 2) / 2;
  
  if (rounded % 1 === 0) {
    return rounded.toString(); // No decimal if whole number
  } else {
    return rounded.toFixed(1); // One decimal place for .5 values
  }
};

// New function for formatting large weights with millions/billions
export const formatLargeWeight = (weight: number, unit: WeightUnit): string => {
  const converted = convertWeight(weight, 'lbs', unit);
  
  // For weights over 1 billion, show in billions
  if (converted >= 1000000000) {
    const billions = converted / 1000000000;
    const rounded = Math.round(billions * 100) / 100; // Round to 2 decimal places
    
    if (rounded >= 1000) {
      // For very large numbers (1000+ billion), show in trillions
      const trillions = rounded / 1000;
      const roundedTrillions = Math.round(trillions * 10) / 10; // Round to 1 decimal place
      return `${roundedTrillions}T ${unit}`;
    }
    
    // Format billions with appropriate decimal places
    if (rounded >= 100) {
      return `${Math.round(rounded)} billion ${unit}`;
    } else if (rounded >= 10) {
      return `${Math.round(rounded * 10) / 10} billion ${unit}`;
    } else {
      return `${Math.round(rounded * 100) / 100} billion ${unit}`;
    }
  }
  
  // For weights over 1 million, show in millions
  if (converted >= 1000000) {
    const millions = converted / 1000000;
    const rounded = Math.round(millions * 100) / 100; // Round to 2 decimal places
    
    // Format millions with appropriate decimal places
    if (rounded >= 100) {
      return `${Math.round(rounded)} million ${unit}`;
    } else if (rounded >= 10) {
      return `${Math.round(rounded * 10) / 10} million ${unit}`;
    } else {
      return `${Math.round(rounded * 100) / 100} million ${unit}`;
    }
  }
  
  // For weights under 1 million, use regular formatting
  return `${formatWeight(converted, unit)} ${unit}`;
};

export const getOlympicBarWeight = (unit: WeightUnit): number => {
  return unit === 'lbs' ? 45 : 20; // 45 lbs = ~20 kg
};

export const getUnitLabel = (unit: WeightUnit): string => {
  return unit === 'lbs' ? 'lbs' : 'kg';
};

// Distance conversion functions
export const convertDistance = (distance: number, fromUnit: 'mi' | 'km', toUnit: 'mi' | 'km'): number => {
  if (fromUnit === toUnit) return distance;
  
  if (fromUnit === 'mi' && toUnit === 'km') {
    return Math.round(distance * MI_TO_KM * 100) / 100; // Round to 2 decimal places
  }
  
  if (fromUnit === 'km' && toUnit === 'mi') {
    return Math.round(distance * KM_TO_MI * 100) / 100; // Round to 2 decimal places
  }
  
  return distance;
};

export const formatDistance = (distance: number, unit: 'mi' | 'km'): string => {
  // Round to nearest 0.01 and format with max 2 decimal places
  const rounded = Math.round(distance * 100) / 100;
  
  if (rounded % 1 === 0) {
    return rounded.toString(); // No decimal if whole number
  } else {
    return rounded.toFixed(2); // Two decimal places
  }
};

export const getDistanceUnitLabel = (unit: 'mi' | 'km'): string => {
  return unit === 'mi' ? 'mi' : 'km';
};