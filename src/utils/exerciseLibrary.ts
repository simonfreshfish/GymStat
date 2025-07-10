import { ExerciseLibrary, ExerciseLibraryEntry, WorkoutDay, WorkoutLog } from '../types/workout';
import { defaultExercises } from './defaultExercises';

const EXERCISE_LIBRARY_KEY = 'exerciseLibrary';

export const saveExerciseLibrary = (library: ExerciseLibrary): void => {
  try {
    localStorage.setItem(EXERCISE_LIBRARY_KEY, JSON.stringify(library));
  } catch (error) {
    console.error('Failed to save exercise library:', error);
  }
};

export const loadExerciseLibrary = (): ExerciseLibrary => {
  try {
    const saved = localStorage.getItem(EXERCISE_LIBRARY_KEY);
    if (saved) {
      const parsedLibrary = JSON.parse(saved);
      
      // Merge with default exercises if library exists but might be missing new defaults
      const existingNames = new Set(parsedLibrary.exercises.map((ex: ExerciseLibraryEntry) => ex.name.toLowerCase()));
      const missingDefaults = defaultExercises.filter(defaultEx => 
        !existingNames.has(defaultEx.name.toLowerCase())
      );
      
      if (missingDefaults.length > 0) {
        // Add missing default exercises
        const updatedLibrary = {
          exercises: [...parsedLibrary.exercises, ...missingDefaults].sort((a, b) => 
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          )
        };
        saveExerciseLibrary(updatedLibrary);
        return updatedLibrary;
      }
      
      return parsedLibrary;
    } else {
      // First time - initialize with default exercises
      const initialLibrary = { exercises: [...defaultExercises] };
      saveExerciseLibrary(initialLibrary);
      return initialLibrary;
    }
  } catch (error) {
    console.error('Failed to load exercise library:', error);
    // Fallback to default exercises
    const fallbackLibrary = { exercises: [...defaultExercises] };
    saveExerciseLibrary(fallbackLibrary);
    return fallbackLibrary;
  }
};

// Helper function to capitalize exercise names
const capitalizeExerciseName = (name: string): string => {
  return name.toUpperCase().trim();
};

export const addExerciseToLibrary = (exerciseName: string, library: ExerciseLibrary): ExerciseLibrary => {
  const normalizedName = capitalizeExerciseName(exerciseName);
  if (!normalizedName) return library;

  const existingIndex = library.exercises.findIndex(
    ex => ex.name.toLowerCase() === normalizedName.toLowerCase()
  );

  if (existingIndex >= 0) {
    // Update existing exercise
    const updatedExercises = [...library.exercises];
    updatedExercises[existingIndex] = {
      ...updatedExercises[existingIndex],
      name: normalizedName, // Update name to capitalized version
      lastUsed: Date.now(),
      timesUsed: updatedExercises[existingIndex].timesUsed + 1
    };
    return { exercises: updatedExercises };
  } else {
    // Add new custom exercise
    const newExercise: ExerciseLibraryEntry = {
      name: normalizedName,
      category: "Custom",
      primaryMuscles: ["Unknown"],
      secondaryMuscles: [],
      equipment: "Unknown",
      difficulty: "Beginner",
      lastUsed: Date.now(),
      timesUsed: 1,
      isCustom: true
    };
    return {
      exercises: [...library.exercises, newExercise].sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      )
    };
  }
};

// Enhanced search function that includes muscle group matching
export const getExerciseSuggestions = (
  query: string, 
  library: ExerciseLibrary, 
  limit: number = 10,
  filterByCategory?: string,
  filterByMuscle?: string
): ExerciseLibraryEntry[] => {
  let filtered = library.exercises;

  // Apply category filter
  if (filterByCategory && filterByCategory !== 'all') {
    filtered = filtered.filter(exercise => exercise.category === filterByCategory);
  }

  // Apply muscle filter
  if (filterByMuscle && filterByMuscle !== 'all') {
    filtered = filtered.filter(exercise => 
      exercise.primaryMuscles.includes(filterByMuscle) || 
      exercise.secondaryMuscles.includes(filterByMuscle)
    );
  }

  if (!query.trim()) {
    // Return most recently used exercises when no query
    return filtered
      .sort((a, b) => b.lastUsed - a.lastUsed)
      .slice(0, limit);
  }

  const normalizedQuery = query.toLowerCase();
  
  // Enhanced filtering that includes muscle group matching
  const matchingExercises = filtered.filter(exercise => {
    // Check exercise name
    const nameMatch = exercise.name.toLowerCase().includes(normalizedQuery);
    
    // Check muscle groups (both primary and secondary)
    const muscleMatch = exercise.primaryMuscles.some(muscle => 
      muscle.toLowerCase().includes(normalizedQuery)
    ) || exercise.secondaryMuscles.some(muscle => 
      muscle.toLowerCase().includes(normalizedQuery)
    );
    
    // Check category
    const categoryMatch = exercise.category.toLowerCase().includes(normalizedQuery);
    
    // Check equipment
    const equipmentMatch = exercise.equipment?.toLowerCase().includes(normalizedQuery);
    
    return nameMatch || muscleMatch || categoryMatch || equipmentMatch;
  });
  
  return matchingExercises.sort((a, b) => {
    // Prioritize exact name matches first
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    
    if (aName === normalizedQuery) return -1;
    if (bName === normalizedQuery) return 1;
    
    // Then prioritize name starts with
    if (aName.startsWith(normalizedQuery) && !bName.startsWith(normalizedQuery)) return -1;
    if (bName.startsWith(normalizedQuery) && !aName.startsWith(normalizedQuery)) return 1;
    
    // Then prioritize muscle group exact matches
    const aPrimaryMuscleMatch = a.primaryMuscles.some(muscle => 
      muscle.toLowerCase() === normalizedQuery
    );
    const bPrimaryMuscleMatch = b.primaryMuscles.some(muscle => 
      muscle.toLowerCase() === normalizedQuery
    );
    
    if (aPrimaryMuscleMatch && !bPrimaryMuscleMatch) return -1;
    if (bPrimaryMuscleMatch && !aPrimaryMuscleMatch) return 1;
    
    // Then by usage frequency
    return b.timesUsed - a.timesUsed;
  }).slice(0, limit);
};

export const initializeExerciseLibraryFromWorkouts = (
  workoutDays: WorkoutDay[], 
  workoutHistory: WorkoutLog[]
): ExerciseLibrary => {
  // Load existing library (which now includes defaults)
  const existingLibrary = loadExerciseLibrary();
  const exerciseNames = new Set<string>();
  
  // Collect from workout days
  workoutDays.forEach(day => {
    day.exercises.forEach(exercise => {
      exerciseNames.add(capitalizeExerciseName(exercise.name));
    });
  });
  
  // Collect from workout history
  workoutHistory.forEach(workout => {
    workout.exercises.forEach(exercise => {
      exerciseNames.add(capitalizeExerciseName(exercise.name));
    });
  });
  
  // Add any missing exercises from workouts as custom exercises
  const existingNames = new Set(existingLibrary.exercises.map(ex => ex.name.toLowerCase()));
  const newCustomExercises: ExerciseLibraryEntry[] = [];
  
  exerciseNames.forEach(name => {
    if (!existingNames.has(name.toLowerCase())) {
      newCustomExercises.push({
        name,
        category: "Custom",
        primaryMuscles: ["Unknown"],
        secondaryMuscles: [],
        equipment: "Unknown",
        difficulty: "Beginner",
        lastUsed: Date.now(),
        timesUsed: 1,
        isCustom: true
      });
    }
  });
  
  if (newCustomExercises.length > 0) {
    const updatedLibrary = {
      exercises: [...existingLibrary.exercises, ...newCustomExercises].sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      )
    };
    saveExerciseLibrary(updatedLibrary);
    return updatedLibrary;
  }
  
  return existingLibrary;
};

export const getCombinedExerciseHistory = (
  exerciseName: string,
  workoutDays: WorkoutDay[],
  workoutHistory: WorkoutLog[]
) => {
  // Get all instances of this exercise across all days and history
  const allExerciseData: any[] = [];
  
  // From workout history (completed workouts)
  workoutHistory.forEach(workout => {
    const exercise = workout.exercises.find(ex => 
      ex.name.toLowerCase() === exerciseName.toLowerCase()
    );
    if (exercise) {
      allExerciseData.push({
        date: workout.date,
        timestamp: workout.timestamp,
        dayName: workout.dayName,
        sets: exercise.sets,
        totalWeight: exercise.totalWeight,
        oneRepMax: exercise.oneRepMax
      });
    }
  });
  
  return allExerciseData.sort((a, b) => a.timestamp - b.timestamp);
};

// New helper functions for muscle group and category filtering
export const getExercisesByCategory = (library: ExerciseLibrary, category: string): ExerciseLibraryEntry[] => {
  return library.exercises.filter(exercise => exercise.category === category);
};

export const getExercisesByMuscle = (library: ExerciseLibrary, muscle: string): ExerciseLibraryEntry[] => {
  return library.exercises.filter(exercise => 
    exercise.primaryMuscles.includes(muscle) || exercise.secondaryMuscles.includes(muscle)
  );
};

export const getAllCategories = (library: ExerciseLibrary): string[] => {
  const categories = new Set<string>();
  library.exercises.forEach(exercise => categories.add(exercise.category));
  return Array.from(categories).sort();
};

export const getAllMuscleGroups = (library: ExerciseLibrary): string[] => {
  const muscles = new Set<string>();
  library.exercises.forEach(exercise => {
    exercise.primaryMuscles.forEach(muscle => muscles.add(muscle));
    exercise.secondaryMuscles.forEach(muscle => muscles.add(muscle));
  });
  return Array.from(muscles).sort();
};