import { CardioSession } from '../types/workout';

export interface TimeEquivalent {
  name: string;
  minutes: number;
  category: 'movie' | 'tv' | 'event' | 'journey' | 'historical' | 'game' | 'sport' | 'other';
  description?: string;
}

export const timeEquivalents: TimeEquivalent[] = [
  // 5-30 minutes
  { name: "Average TED Talk", minutes: 18, category: "other", description: "Most TED talks are between 15-18 minutes" },
  { name: "Episode of The Office", minutes: 22, category: "tv" },
  { name: "Spaghetti cooking time", minutes: 10, category: "other" },
  { name: "International Space Station orbit", minutes: 90, category: "journey", description: "One complete orbit around Earth" },
  { name: "Power nap", minutes: 20, category: "other" },
  
  // 30-60 minutes
  { name: "Game of Thrones episode", minutes: 60, category: "tv" },
  { name: "The Battle of Little Bighorn", minutes: 60, category: "historical", description: "Custer's Last Stand" },
  { name: "First Wright brothers flight", minutes: 59, category: "historical", description: "Including all flight attempts on Dec 17, 1903" },
  { name: "NCAA basketball half", minutes: 20, category: "sport" },
  
  // 1-2 hours
  { name: "Titanic (movie)", minutes: 195, category: "movie" },
  { name: "The Matrix", minutes: 136, category: "movie" },
  { name: "NFL football game", minutes: 180, category: "sport", description: "Including timeouts and halftime" },
  { name: "Moon landing broadcast", minutes: 120, category: "historical", description: "TV broadcast time" },
  { name: "The Battle of Bunker Hill", minutes: 120, category: "historical" },
  
  // 2-5 hours
  { name: "The Lord of the Rings: Return of the King", minutes: 201, category: "movie", description: "Extended edition" },
  { name: "Complete marathon (for amateurs)", minutes: 270, category: "sport", description: "~4.5 hours average finish time" },
  { name: "Super Bowl Sunday", minutes: 240, category: "sport", description: "Including all pre-game coverage" },
  { name: "Flight from LA to NYC", minutes: 330, category: "journey" },
  { name: "The Battle of Gettysburg", minutes: 4320, category: "historical", description: "All three days" },
  
  // 5-12 hours
  { name: "MCU movie marathon", minutes: 3000, category: "movie", description: "All Marvel movies back to back" },
  { name: "Full season of Game of Thrones", minutes: 600, category: "tv", description: "One complete season" },
  { name: "Transatlantic flight", minutes: 450, category: "journey" },
  { name: "Ironman Triathlon", minutes: 720, category: "sport", description: "Average completion time" },
  { name: "Driving across Florida", minutes: 480, category: "journey", description: "Pensacola to Miami" },
  
  // 12-24 hours
  { name: "Full day", minutes: 1440, category: "other", description: "24 hours" },
  { name: "Lord of the Rings extended trilogy", minutes: 682, category: "movie", description: "Back-to-back marathon" },
  { name: "The Storming of the Bastille", minutes: 720, category: "historical", description: "French Revolution event" },
  { name: "Crossing the English Channel", minutes: 840, category: "journey", description: "By ferry and surrounding activities" },
  
  // 1-3 days
  { name: "Journey to the Moon", minutes: 4320, category: "journey", description: "Apollo missions took about 3 days" },
  { name: "Weekend trip", minutes: 2880, category: "journey", description: "2 full days" },
  { name: "First Thanksgiving feast", minutes: 2880, category: "historical", description: "The celebration lasted multiple days" },
  { name: "The Battle of Normandy", minutes: 4320, category: "historical", description: "Initial phase" },
  
  // 3-7 days
  { name: "Apollo 13 mission (1970)", minutes: 9960, category: "historical", description: "6 days, 23 hours" },
  { name: "The Battle of Britain", minutes: 10080, category: "historical", description: "Initial phase" },
  { name: "Tour de France stage race", minutes: 8640, category: "sport", description: "A typical 6-day segment" },
  { name: "The First Voyage of Columbus", minutes: 10080, category: "journey", description: "First week crossing the Atlantic" },
  
  // 1-4 weeks
  { name: "The Cuban Missile Crisis", minutes: 20160, category: "historical", description: "13 days in October 1962" },
  { name: "The Austro-Prussian War", minutes: 60480, category: "historical", description: "1 month, 1 week and 1 day" },
  { name: "Olympics Games", minutes: 20160, category: "sport", description: "The full 2-week event" },
  { name: "Mars journey", minutes: 30240, category: "journey", description: "Minimum one-way travel time" },
  
  // Longer (for truly exceptional cardio achievements)
  { name: "The Siege of Leningrad", minutes: 86400, category: "historical", description: "Initial 2 months" },
  { name: "Average NFL career", minutes: 40320, category: "sport", description: "About 3.3 years or 28 days of actual playing time" },
  { name: "Tour de France history", minutes: 41760, category: "sport", description: "All editions combined active riding time" }
];

// Get best matching time equivalent
export const getBestTimeEquivalent = (minutes: number): TimeEquivalent | null => {
  if (minutes <= 0) return null;
  
  // Find the closest equivalent that doesn't exceed the provided time
  let closest: TimeEquivalent | null = null;
  let closestDiff = Infinity;
  
  for (const equivalent of timeEquivalents) {
    // Only consider equivalents with lower or equal minutes
    if (equivalent.minutes <= minutes) {
      const diff = minutes - equivalent.minutes;
      if (diff < closestDiff) {
        closest = equivalent;
        closestDiff = diff;
      }
    }
  }
  
  return closest;
};

// Get multiple time equivalents for a given duration
export const getMultipleTimeEquivalents = (
  minutes: number,
  count = 3
): TimeEquivalent[] => {
  if (minutes <= 0) return [];
  
  // Get equivalents that don't exceed the provided time
  const validEquivalents = timeEquivalents
    .filter(eq => eq.minutes <= minutes)
    .sort((a, b) => {
      const aDiff = minutes - a.minutes;
      const bDiff = minutes - b.minutes;
      return aDiff - bDiff; // Sort by closest match
    });
  
  // Ensure we get a diversity of categories if possible
  const results: TimeEquivalent[] = [];
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