import { DistanceUnit } from '../types/workout';

export interface DistanceEquivalent {
  name: string;
  miles: number;
  kilometers: number;
  category: 'landmark' | 'city-to-city' | 'country' | 'fictional' | 'nature' | 'sports' | 'historical' | 'other';
  description?: string;
  source?: 'real' | 'fictional';
}

export const distanceEquivalents: DistanceEquivalent[] = [
  // Short distances (0.1 - 2 miles)
  { 
    name: "Lap around a standard track", 
    miles: 0.25, 
    kilometers: 0.4,
    category: "sports",
    source: "real"
  },
  { 
    name: "Walk through the Louvre Museum", 
    miles: 0.6, 
    kilometers: 0.96,
    category: "landmark",
    source: "real"
  },
  { 
    name: "Climb Mount Everest", 
    miles: 0.62, 
    kilometers: 1,
    category: "nature",
    source: "real",
    description: "Vertical distance only"
  },
  { 
    name: "Diagon Alley end-to-end", 
    miles: 0.5, 
    kilometers: 0.8,
    category: "fictional",
    source: "fictional",
    description: "From Harry Potter"
  },
  
  // Medium short (2-5 miles)
  { 
    name: "The Las Vegas Strip", 
    miles: 4.2, 
    kilometers: 6.8,
    category: "landmark",
    source: "real" 
  },
  { 
    name: "Great Pyramid of Giza perimeter", 
    miles: 3, 
    kilometers: 4.8,
    category: "landmark",
    source: "real"
  },
  { 
    name: "Central Park loop", 
    miles: 2.5, 
    kilometers: 4,
    category: "landmark",
    source: "real",
    description: "NYC's Central Park full loop path"
  },
  { 
    name: "Hogwarts Castle grounds", 
    miles: 3.1, 
    kilometers: 5,
    category: "fictional",
    source: "fictional",
    description: "From Harry Potter"
  },
  { 
    name: "The Mines of Moria", 
    miles: 4.3, 
    kilometers: 6.9,
    category: "fictional",
    source: "fictional",
    description: "From The Lord of the Rings"
  },
  
  // Medium distances (5-25 miles)
  { 
    name: "Width of Grand Canyon", 
    miles: 10, 
    kilometers: 16.1,
    category: "nature",
    source: "real",
    description: "Average width rim to rim"
  },
  { 
    name: "Manhattan Island perimeter", 
    miles: 32, 
    kilometers: 51.5,
    category: "landmark",
    source: "real",
    description: "The distance around the entire island"
  },
  { 
    name: "San Francisco to Oakland", 
    miles: 8, 
    kilometers: 12.9,
    category: "city-to-city",
    source: "real"
  },
  { 
    name: "Boston Marathon", 
    miles: 26.2, 
    kilometers: 42.2,
    category: "sports",
    source: "real"
  },
  { 
    name: "Mordor to Mount Doom", 
    miles: 20, 
    kilometers: 32.2,
    category: "fictional",
    source: "fictional",
    description: "From The Lord of the Rings"
  },
  { 
    name: "Hyrule Field crossing", 
    miles: 25, 
    kilometers: 40.2,
    category: "fictional",
    source: "fictional",
    description: "From The Legend of Zelda"
  },
  
  // Longer distances (25-100 miles)
  { 
    name: "The Chernobyl Exclusion Zone", 
    miles: 30, 
    kilometers: 48.3,
    category: "landmark",
    source: "real",
    description: "The radius of the exclusion zone"
  },
  { 
    name: "English Channel crossing", 
    miles: 21, 
    kilometers: 33.8,
    category: "nature",
    source: "real",
    description: "Shortest distance from Dover to Calais"
  },
  { 
    name: "Los Angeles to San Diego", 
    miles: 120, 
    kilometers: 193.1,
    category: "city-to-city",
    source: "real"
  },
  { 
    name: "London to Brighton", 
    miles: 47, 
    kilometers: 75.6,
    category: "city-to-city",
    source: "real",
    description: "A popular UK cycling route"
  },
  { 
    name: "Distance to the horizon", 
    miles: 3, 
    kilometers: 4.8,
    category: "nature",
    source: "real",
    description: "At sea level for a 6ft tall person"
  },
  
  // Very long distances (100-500 miles)
  { 
    name: "Bag End to Bree", 
    miles: 135, 
    kilometers: 217,
    category: "fictional",
    source: "fictional",
    description: "From The Lord of the Rings"
  },
  { 
    name: "Hobbiton to Rivendell", 
    miles: 397, 
    kilometers: 639,
    category: "fictional",
    source: "fictional",
    description: "From The Lord of the Rings"
  },
  { 
    name: "London to Paris", 
    miles: 214, 
    kilometers: 344,
    category: "city-to-city",
    source: "real",
    description: "As the crow flies"
  },
  { 
    name: "New York to Washington DC", 
    miles: 226, 
    kilometers: 364,
    category: "city-to-city",
    source: "real" 
  },
  { 
    name: "Across the state of Colorado", 
    miles: 380, 
    kilometers: 611,
    category: "landmark",
    source: "real",
    description: "East to west at its widest point"
  },
  { 
    name: "Great Wall of China", 
    miles: 1500, 
    kilometers: 2414,
    category: "landmark",
    source: "real",
    description: "Rough estimate of walkable sections"
  },
  
  // Extra long distances (500-2000 miles)
  { 
    name: "King's Landing to Winterfell", 
    miles: 1500, 
    kilometers: 2414,
    category: "fictional",
    source: "fictional",
    description: "From Game of Thrones"
  },
  { 
    name: "Across the Narrow Sea", 
    miles: 300, 
    kilometers: 483,
    category: "fictional",
    source: "fictional",
    description: "From Game of Thrones"
  },
  { 
    name: "New York to Chicago", 
    miles: 790, 
    kilometers: 1271,
    category: "city-to-city",
    source: "real" 
  },
  { 
    name: "London to Rome", 
    miles: 893, 
    kilometers: 1437,
    category: "city-to-city",
    source: "real" 
  },
  { 
    name: "Miami to New York", 
    miles: 1092, 
    kilometers: 1758,
    category: "city-to-city",
    source: "real" 
  },
  { 
    name: "The Oregon Trail", 
    miles: 2170, 
    kilometers: 3492,
    category: "historical",
    source: "real",
    description: "The historic migration route"
  },
  { 
    name: "Journey across Middle Earth", 
    miles: 1779, 
    kilometers: 2863,
    category: "fictional",
    source: "fictional",
    description: "Hobbiton to Mount Doom"
  },
  { 
    name: "Kanto region tour", 
    miles: 250, 
    kilometers: 402,
    category: "fictional",
    source: "fictional",
    description: "A journey through all cities in Pokémon"
  },
  { 
    name: "The Wall to King's Landing", 
    miles: 1900, 
    kilometers: 3058,
    category: "fictional",
    source: "fictional",
    description: "From Game of Thrones"
  }
];

// Get best matching distance equivalent
export const getBestDistanceEquivalent = (
  distance: number, 
  unit: DistanceUnit
): DistanceEquivalent | null => {
  if (distance <= 0) return null;
  
  // Find the closest equivalent that doesn't exceed the provided distance
  let closest: DistanceEquivalent | null = null;
  let closestDiff = Infinity;
  
  for (const equivalent of distanceEquivalents) {
    const equivalentDist = unit === 'mi' ? equivalent.miles : equivalent.kilometers;
    
    // Only consider equivalents with lower or equal distance
    if (equivalentDist <= distance) {
      const diff = distance - equivalentDist;
      if (diff < closestDiff) {
        closest = equivalent;
        closestDiff = diff;
      }
    }
  }
  
  return closest;
};

// Get multiple distance equivalents
export const getMultipleDistanceEquivalents = (
  distance: number,
  unit: DistanceUnit,
  count = 3
): DistanceEquivalent[] => {
  if (distance <= 0) return [];
  
  // Get equivalents that don't exceed the provided distance
  const validEquivalents = distanceEquivalents
    .filter(eq => (unit === 'mi' ? eq.miles : eq.kilometers) <= distance)
    .sort((a, b) => {
      const aDiff = distance - (unit === 'mi' ? a.miles : a.kilometers);
      const bDiff = distance - (unit === 'mi' ? b.miles : b.kilometers);
      return aDiff - bDiff; // Sort by closest match
    });
  
  // Ensure we get a diversity of categories if possible
  const results: DistanceEquivalent[] = [];
  const usedCategories = new Set<string>();
  
  // First try to get diverse categories
  for (const eq of validEquivalents) {
    if (results.length >= count) break;
    
    // Add if we haven't used this category yet
    if (!usedCategories.has(eq.category)) {
      results.push(eq);
      usedCategories.add(eq.category);
    }
  }
  
  // Fill remaining slots with closest matches
  if (results.length < count) {
    for (const eq of validEquivalents) {
      if (results.length >= count) break;
      if (!results.includes(eq)) {
        results.push(eq);
      }
    }
  }
  
  return results.slice(0, count);
};

// Format distance equivalent for display
export const formatDistanceEquivalent = (
  userDistance: number, 
  equivalent: DistanceEquivalent, 
  unit: DistanceUnit
): string => {
  const equivalentDist = unit === 'mi' ? equivalent.miles : equivalent.kilometers;
  
  if (userDistance >= equivalentDist * 2) {
    // If the user has done more than twice the distance
    const times = Math.floor(userDistance / equivalentDist);
    return `${times}x ${equivalent.name} (${times * equivalentDist} ${unit})`;
  } else {
    // Just show the comparison
    return `${equivalent.name} (${equivalentDist} ${unit})`;
  }
};