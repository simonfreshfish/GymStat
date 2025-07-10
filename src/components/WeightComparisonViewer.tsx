import React, { useState, useMemo } from 'react';
import { Search, Scale, Filter, ArrowLeft, TrendingUp, Star, Trophy, Target, Zap, Calendar, Info, X } from 'lucide-react';
import { weightComparisons, categorizeItem } from '../utils/weightComparisons';
import { convertWeight, formatWeight, formatLargeWeight } from '../utils/unitConversion';
import { WeightUnit, WorkoutLog, WorkoutDay } from '../types/workout';
import { calculateOneRepMax } from '../utils/workoutCalculations';
import { useVibe } from './VibeProvider';
import { getVibeClasses } from '../utils/vibeSettings';

interface WeightComparisonViewerProps {
  isDarkMode: boolean;
  weightUnit: WeightUnit;
  workoutHistory: WorkoutLog[];
  workoutDays: WorkoutDay[];
  onClose: () => void;
}

type AchievementMode = 'PR' | 'Single Exercise' | 'Whole Workout' | 'Lifetime';

const WeightComparisonViewer: React.FC<WeightComparisonViewerProps> = ({
  isDarkMode,
  weightUnit,
  workoutHistory,
  workoutDays,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'weight' | 'name'>('weight');
  const [filterCategory, setFilterCategory] = useState<'all' | 'animals' | 'vehicles' | 'people' | 'objects' | 'fictional' | 'buildings' | 'space' | 'star-wars' | 'star-trek' | 'halo' | 'marvel' | 'mass-effect' | 'battlestar-galactica' | 'babylon-5' | 'warhammer-40k' | 'alien' | 'independence-day' | 'terminator' | 'predator' | 'back-to-the-future' | 'elder-scrolls' | 'minecraft' | 'firefly' | 'event-horizon' | '2001-space-odyssey' | 'harry-potter' | 'lord-of-the-rings' | 'game-of-thrones' | 'pokemon' | 'zelda' | 'dnd' | 'kaiju'>('all');
  const [achievementMode, setAchievementMode] = useState<AchievementMode>('PR');
  const [showInfoBox, setShowInfoBox] = useState(true);
  const { vibeSettings } = useVibe();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);

  // Calculate achievement weights based on mode
  const achievementWeight = useMemo(() => {
    if (workoutHistory.length === 0) return 0;

    switch (achievementMode) {
      case 'PR': {
        // Find the actual heaviest single rep logged (not theoretical 1RM)
        let maxActualWeight = 0;
        workoutHistory.forEach(workout => {
          workout.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
              if (set.weight > maxActualWeight) {
                maxActualWeight = set.weight;
              }
            });
          });
        });
        return maxActualWeight;
      }

      case 'Single Exercise': {
        // Find the exercise with highest total weight moved in a single session
        let maxExerciseWeight = 0;
        workoutHistory.forEach(workout => {
          workout.exercises.forEach(exercise => {
            if (exercise.totalWeight > maxExerciseWeight) {
              maxExerciseWeight = exercise.totalWeight;
            }
          });
        });
        return maxExerciseWeight;
      }

      case 'Whole Workout': {
        // Find the workout day with highest total weight moved
        let maxWorkoutWeight = 0;
        workoutHistory.forEach(workout => {
          if (workout.totalWeight > maxWorkoutWeight) {
            maxWorkoutWeight = workout.totalWeight;
          }
        });
        return maxWorkoutWeight;
      }

      case 'Lifetime': {
        // Sum all weight moved across all workouts
        return workoutHistory.reduce((total, workout) => total + workout.totalWeight, 0);
      }

      default:
        return 0;
    }
  }, [workoutHistory, achievementMode]);

  // Get achievement details for display
  const achievementDetails = useMemo(() => {
    if (workoutHistory.length === 0) return null;

    switch (achievementMode) {
      case 'PR': {
        // Find the actual heaviest single rep logged
        let maxActualWeight = 0;
        let bestExercise = '';
        let bestWorkout = '';
        let bestReps = 0;
        
        workoutHistory.forEach(workout => {
          workout.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
              if (set.weight > maxActualWeight) {
                maxActualWeight = set.weight;
                bestExercise = exercise.name;
                bestWorkout = workout.dayName;
                bestReps = set.reps;
              }
            });
          });
        });
        
        return {
          weight: maxActualWeight,
          description: `${bestExercise} - ${bestReps} rep${bestReps === 1 ? '' : 's'} (${bestWorkout})`,
          icon: '🏆',
          label: 'Heaviest Single Rep'
        };
      }

      case 'Single Exercise': {
        let maxWeight = 0;
        let bestExercise = '';
        let bestWorkout = '';
        let bestDate = '';
        
        workoutHistory.forEach(workout => {
          workout.exercises.forEach(exercise => {
            if (exercise.totalWeight > maxWeight) {
              maxWeight = exercise.totalWeight;
              bestExercise = exercise.name;
              bestWorkout = workout.dayName;
              bestDate = workout.date;
            }
          });
        });
        
        return {
          weight: maxWeight,
          description: `${bestExercise} on ${bestDate}`,
          icon: '💪',
          label: 'Best Single Exercise'
        };
      }

      case 'Whole Workout': {
        let maxWeight = 0;
        let bestWorkout = '';
        let bestDate = '';
        
        workoutHistory.forEach(workout => {
          if (workout.totalWeight > maxWeight) {
            maxWeight = workout.totalWeight;
            bestWorkout = workout.dayName;
            bestDate = workout.date;
          }
        });
        
        return {
          weight: maxWeight,
          description: `${bestWorkout} on ${bestDate}`,
          icon: '🔥',
          label: 'Best Workout Day'
        };
      }

      case 'Lifetime': {
        const totalWeight = workoutHistory.reduce((total, workout) => total + workout.totalWeight, 0);
        const totalWorkouts = workoutHistory.length;
        const avgPerWorkout = totalWorkouts > 0 ? totalWeight / totalWorkouts : 0;
        
        return {
          weight: totalWeight,
          description: `${totalWorkouts} workouts • ${formatWeight(convertWeight(avgPerWorkout, 'lbs', weightUnit), weightUnit)} ${weightUnit} avg`,
          icon: '🌟',
          label: 'Lifetime Total'
        };
      }

      default:
        return null;
    }
  }, [workoutHistory, achievementMode, weightUnit]);

  const filteredAndSortedComparisons = useMemo(() => {
    let filtered = weightComparisons.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.plural.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (filterCategory === 'all') return true;
      
      return categorizeItem(item.name) === filterCategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'weight') {
        return a.weight - b.weight;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  }, [searchQuery, sortBy, filterCategory]);

  const displayWeight = (weight: number) => {
    const converted = convertWeight(weight, 'lbs', weightUnit);
    return formatWeight(converted, weightUnit);
  };

  // Use the new large weight formatter for display
  const displayLargeWeight = (weight: number) => {
    return formatLargeWeight(weight, weightUnit);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'animals': return '🐾';
      case 'vehicles': return '🚗';
      case 'people': return '👤';
      case 'fictional': return '🎮';
      case 'buildings': return '🏛️';
      case 'space': return '🚀';
      case 'objects': return '📦';
      // Franchise icons
      case 'star-wars': return '⭐';
      case 'star-trek': return '🖖';
      case 'halo': return '👽';
      case 'marvel': return '🦸';
      case 'mass-effect': return '🌌';
      case 'battlestar-galactica': return '🛸';
      case 'babylon-5': return '🏗️';
      case 'warhammer-40k': return '⚔️';
      case 'alien': return '👾';
      case 'independence-day': return '🛸';
      case 'terminator': return '🤖';
      case 'predator': return '👹';
      case 'back-to-the-future': return '⏰';
      case 'elder-scrolls': return '🐉';
      case 'minecraft': return '🧱';
      case 'firefly': return '🔥';
      case 'event-horizon': return '🕳️';
      case '2001-space-odyssey': return '🎬';
      case 'harry-potter': return '⚡';
      case 'lord-of-the-rings': return '💍';
      case 'game-of-thrones': return '👑';
      case 'pokemon': return '⚡';
      case 'zelda': return '🗡️';
      case 'dnd': return '🎲';
      case 'kaiju': return '🦖';
      default: return '⚖️';
    }
  };

  const getCategoryColor = (category: string) => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return 'text-red-400';
    }
    
    switch (category) {
      case 'animals': return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'vehicles': return isDarkMode ? 'text-blue-400' : 'text-blue-600';
      case 'people': return isDarkMode ? 'text-purple-400' : 'text-purple-600';
      case 'fictional': return isDarkMode ? 'text-pink-400' : 'text-pink-600';
      case 'buildings': return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'space': return isDarkMode ? 'text-cyan-400' : 'text-cyan-600';
      case 'objects': return isDarkMode ? 'text-orange-400' : 'text-orange-600';
      // Franchise colors
      case 'star-wars': return isDarkMode ? 'text-yellow-300' : 'text-yellow-600';
      case 'star-trek': return isDarkMode ? 'text-blue-300' : 'text-blue-700';
      case 'halo': return isDarkMode ? 'text-green-300' : 'text-green-700';
      case 'marvel': return isDarkMode ? 'text-red-300' : 'text-red-600';
      case 'mass-effect': return isDarkMode ? 'text-indigo-300' : 'text-indigo-600';
      case 'battlestar-galactica': return isDarkMode ? 'text-gray-300' : 'text-gray-600';
      case 'babylon-5': return isDarkMode ? 'text-teal-300' : 'text-teal-600';
      case 'warhammer-40k': return isDarkMode ? 'text-red-400' : 'text-red-700';
      case 'alien': return isDarkMode ? 'text-green-400' : 'text-green-700';
      case 'independence-day': return isDarkMode ? 'text-blue-400' : 'text-blue-700';
      case 'terminator': return isDarkMode ? 'text-gray-400' : 'text-gray-700';
      case 'predator': return isDarkMode ? 'text-orange-400' : 'text-orange-700';
      case 'back-to-the-future': return isDarkMode ? 'text-purple-400' : 'text-purple-700';
      case 'elder-scrolls': return isDarkMode ? 'text-amber-400' : 'text-amber-700';
      case 'minecraft': return isDarkMode ? 'text-emerald-400' : 'text-emerald-700';
      case 'firefly': return isDarkMode ? 'text-orange-300' : 'text-orange-600';
      case 'event-horizon': return isDarkMode ? 'text-slate-400' : 'text-slate-700';
      case '2001-space-odyssey': return isDarkMode ? 'text-zinc-400' : 'text-zinc-700';
      case 'harry-potter': return isDarkMode ? 'text-amber-300' : 'text-amber-600';
      case 'lord-of-the-rings': return isDarkMode ? 'text-yellow-300' : 'text-yellow-600';
      case 'game-of-thrones': return isDarkMode ? 'text-red-300' : 'text-red-600';
      case 'pokemon': return isDarkMode ? 'text-yellow-300' : 'text-yellow-600';
      case 'zelda': return isDarkMode ? 'text-green-300' : 'text-green-600';
      case 'dnd': return isDarkMode ? 'text-purple-300' : 'text-purple-600';
      case 'kaiju': return isDarkMode ? 'text-green-400' : 'text-green-700';
      default: return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getWeightRange = (weight: number) => {
    if (weight < 50) return 'Light';
    if (weight < 200) return 'Medium';
    if (weight < 1000) return 'Heavy';
    if (weight < 5000) return 'Very Heavy';
    if (weight < 100000) return 'Massive';
    if (weight < 10000000) return 'Enormous';
    if (weight < 1000000000) return 'Colossal';
    if (weight < 1000000000000) return 'Galactic';
    return 'Legendary';
  };

  const getWeightRangeColor = (weight: number) => {
    if (vibeSettings.currentVibe === 'locked-in') {
      if (weight < 50) return 'text-red-300';
      if (weight < 200) return 'text-red-400';
      if (weight < 1000) return 'text-red-500';
      if (weight < 5000) return 'text-red-600';
      if (weight < 100000) return 'text-red-500';
      if (weight < 10000000) return 'text-red-400';
      if (weight < 1000000000) return 'text-red-300';
      if (weight < 1000000000000) return 'text-red-200';
      return 'text-white';
    }
    
    if (weight < 50) return 'text-green-500';
    if (weight < 200) return 'text-yellow-500';
    if (weight < 1000) return 'text-orange-500';
    if (weight < 5000) return 'text-red-500';
    if (weight < 100000) return 'text-purple-500';
    if (weight < 10000000) return 'text-pink-500';
    if (weight < 1000000000) return 'text-indigo-500';
    if (weight < 1000000000000) return 'text-cyan-500';
    return 'text-gold-500';
  };

  // Check if an item is completed (achieved)
  const isItemCompleted = (itemWeight: number) => {
    return achievementWeight >= itemWeight;
  };

  // Get achievement mode icon
  const getAchievementModeIcon = (mode: AchievementMode) => {
    switch (mode) {
      case 'PR': return <Trophy size={16} />;
      case 'Single Exercise': return <Target size={16} />;
      case 'Whole Workout': return <Zap size={16} />;
      case 'Lifetime': return <Calendar size={16} />;
    }
  };

  // Get achievement mode color
  const getAchievementModeColor = (mode: AchievementMode) => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return mode === achievementMode 
        ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white clip-path-jagged-button'
        : 'bg-gray-800 text-red-300 hover:bg-gray-700 border border-red-500/40 clip-path-jagged-button';
    }
    
    switch (mode) {
      case 'PR': 
        return mode === achievementMode 
          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
          : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300');
      case 'Single Exercise': 
        return mode === achievementMode 
          ? 'bg-blue-500 hover:bg-blue-600 text-white'
          : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300');
      case 'Whole Workout': 
        return mode === achievementMode 
          ? 'bg-purple-500 hover:bg-purple-600 text-white'
          : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300');
      case 'Lifetime': 
        return mode === achievementMode 
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300');
    }
  };

  // Get some interesting stats
  const stats = useMemo(() => {
    const lightest = weightComparisons.reduce((min, item) => item.weight < min.weight ? item : min);
    const heaviest = weightComparisons.reduce((max, item) => item.weight > max.weight ? item : max);
    const totalItems = weightComparisons.length;
    const completedItems = weightComparisons.filter(item => isItemCompleted(item.weight)).length;
    
    // Get all categories
    const categories: { [key: string]: number } = {};
    
    // Populate counts for all categories
    weightComparisons.forEach(item => {
      const category = categorizeItem(item.name);
      categories[category] = (categories[category] || 0) + 1;
    });

    return { lightest, heaviest, totalItems, completedItems, categories };
  }, [achievementWeight]);

  // Get card styling based on vibe
  const getCardStyle = () => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return {
        className: 'bg-gradient-to-br from-red-950/90 via-black/90 to-red-900/80 border-red-500/40 clip-path-jagged',
        style: {
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
        }
      };
    }
    
    return {
      className: vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'),
      style: {}
    };
  };

  const cardStyle = getCardStyle();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-300 ${
        vibeSettings.currentVibe === 'locked-in'
          ? 'bg-gradient-to-br from-red-950/90 via-black/90 to-red-900/80 border-red-500/40'
          : (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
      }`}>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  vibeSettings.currentVibe === 'locked-in'
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-950 clip-path-jagged-small'
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100')
                }`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}
                title="Back to app"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className={`text-2xl font-black tracking-wider transition-colors duration-300 ${
                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-100' : (isDarkMode ? 'text-white' : 'text-gray-900')
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  MY ACHIEVEMENTS
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  {stats.completedItems} of {stats.totalItems} trophies earned • {Math.round((stats.completedItems / stats.totalItems) * 100)}% complete
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowInfoBox(!showInfoBox)}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-red-900 text-red-400 hover:bg-red-800 border border-red-500/40 clip-path-jagged-small'
                    : (isDarkMode ? 'bg-blue-900 text-blue-400 hover:bg-blue-800' : 'bg-blue-100 text-blue-600 hover:bg-blue-200')
                }`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}
                title={showInfoBox ? "Hide info" : "Show info"}
              >
                <Info size={20} />
              </button>
              <Scale className={`${vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-blue-400' : 'text-blue-600')}`} size={32} />
            </div>
          </div>

          {/* Info Box */}
          {showInfoBox && (
            <div className={`mb-4 p-4 border rounded-lg transition-colors duration-300 ${
              vibeSettings.currentVibe === 'locked-in'
                ? 'bg-black border-red-500/40 clip-path-jagged'
                : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200')
            }`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-red-900 text-red-300'
                    : (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}>
                  <Trophy size={20} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold mb-2 ${
                    vibeSettings.currentVibe === 'locked-in' ? 'text-red-100' : (isDarkMode ? 'text-white' : 'text-gray-900')
                  }`}>
                    How Weight Trophies Work
                  </h3>
                  <p className={`text-sm mb-2 ${
                    vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                  }`}>
                    Each trophy represents a weight milestone. You earn trophies by lifting weights that match or exceed the trophy's weight requirement.
                  </p>
                  <div className={`text-sm ${
                    vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
                  }`}>
                    <p className="mb-1">• <strong>PR Mode:</strong> Shows trophies earned based on your heaviest single rep</p>
                    <p className="mb-1">• <strong>Single Exercise:</strong> Shows trophies earned based on total weight in one exercise</p>
                    <p className="mb-1">• <strong>Whole Workout:</strong> Shows trophies earned based on total weight in one workout</p>
                    <p>• <strong>Lifetime:</strong> Shows trophies earned based on all weight you've ever lifted</p>
                  </div>
                  <div className={`mt-3 text-sm font-medium ${
                    vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                  }`}>
                    Log more workouts to earn more trophies and track your progress!
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoBox(false)}
                  className={`p-1 rounded-lg ${
                    vibeSettings.currentVibe === 'locked-in'
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-900'
                      : (isDarkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100')
                  }`}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Achievement Mode Toggle */}
          <div className="mb-4">
            <div className={`text-sm font-black tracking-wider mb-2 transition-colors duration-300 ${
              vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
            }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
              ACHIEVEMENT MODE:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(['PR', 'Single Exercise', 'Whole Workout', 'Lifetime'] as AchievementMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAchievementMode(mode)}
                  className={`px-4 py-3 rounded-lg font-black tracking-wider text-sm transition-all duration-300 flex items-center justify-center space-x-2 ${
                    getAchievementModeColor(mode)
                  }`}
                  style={{ 
                    fontFamily: 'system-ui, -apple-system, sans-serif', 
                    letterSpacing: '0.1em',
                    ...(vibeSettings.currentVibe === 'locked-in' ? {
                      clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                    } : {})
                  }}
                >
                  {getAchievementModeIcon(mode)}
                  <span>{mode.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Achievement Display */}
          {achievementDetails && (
            <div className={`p-4 rounded-lg mb-4 transition-colors duration-300 ${
              vibeSettings.currentVibe === 'locked-in'
                ? 'bg-gradient-to-r from-red-900 to-black border border-red-500/30 clip-path-jagged'
                : (isDarkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200')
            }`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{achievementDetails.icon}</span>
                  <div>
                    <div className={`font-black tracking-wider transition-colors duration-300 ${
                      vibeSettings.currentVibe === 'locked-in' ? 'text-red-100' : (isDarkMode ? 'text-white' : 'text-gray-900')
                    }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                      {achievementDetails.label.toUpperCase()}
                    </div>
                    <div className={`text-sm transition-colors duration-300 ${
                      vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')
                    }`}>
                      {achievementDetails.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-black tracking-wider ${
                    vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                  }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {displayLargeWeight(achievementDetails.weight)}
                  </div>
                  <div className={`text-xs font-medium transition-colors duration-300 ${
                    vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                  }`}>
                    ACHIEVEMENT WEIGHT
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
              }`} size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trophies..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors duration-300 ${
                  vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-black border-red-500/40 text-red-100 placeholder-red-400 clip-path-jagged-small'
                    : (isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500')
                }`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                } : {}}
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'weight' | 'name')}
              className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
                vibeSettings.currentVibe === 'locked-in'
                  ? 'bg-black border-red-500/40 text-red-100 clip-path-jagged-small'
                  : (isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900')
              }`}
              style={vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
              } : {}}
            >
              <option value="weight">Sort by Weight</option>
              <option value="name">Sort by Name</option>
            </select>

            {/* Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
                vibeSettings.currentVibe === 'locked-in'
                  ? 'bg-black border-red-500/40 text-red-100 clip-path-jagged-small'
                  : (isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900')
              }`}
              style={vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
              } : {}}
            >
              <option value="all">All Categories ({stats.totalItems})</option>
              
              {/* General Categories */}
              <optgroup label="General Categories">
                <option value="animals">🐾 Animals ({stats.categories.animals})</option>
                <option value="vehicles">🚗 Vehicles ({stats.categories.vehicles})</option>
                <option value="people">👤 People ({stats.categories.people})</option>
                <option value="buildings">🏛️ Buildings ({stats.categories.buildings})</option>
                <option value="space">🚀 Space & Sci-Fi ({stats.categories.space})</option>
                <option value="objects">📦 Objects ({stats.categories.objects})</option>
                <option value="fictional">🎮 Other Fictional ({stats.categories.fictional})</option>
              </optgroup>
              
              {/* Franchise Categories */}
              <optgroup label="Franchise Categories">
                <option value="star-wars">⭐ Star Wars ({stats.categories['star-wars']})</option>
                <option value="star-trek">🖖 Star Trek ({stats.categories['star-trek']})</option>
                <option value="halo">👽 Halo ({stats.categories['halo']})</option>
                <option value="marvel">🦸 Marvel ({stats.categories['marvel']})</option>
                <option value="mass-effect">🌌 Mass Effect ({stats.categories['mass-effect']})</option>
                <option value="battlestar-galactica">🛸 Battlestar Galactica ({stats.categories['battlestar-galactica']})</option>
                <option value="babylon-5">🏗️ Babylon 5 ({stats.categories['babylon-5']})</option>
                <option value="warhammer-40k">⚔️ Warhammer 40K ({stats.categories['warhammer-40k']})</option>
                <option value="alien">👾 Alien/Aliens ({stats.categories['alien']})</option>
                <option value="independence-day">🛸 Independence Day ({stats.categories['independence-day']})</option>
                <option value="terminator">🤖 Terminator ({stats.categories['terminator']})</option>
                <option value="predator">👹 Predator ({stats.categories['predator']})</option>
                <option value="back-to-the-future">⏰ Back to the Future ({stats.categories['back-to-the-future']})</option>
                <option value="elder-scrolls">🐉 The Elder Scrolls ({stats.categories['elder-scrolls']})</option>
                <option value="minecraft">🧱 Minecraft ({stats.categories['minecraft']})</option>
                <option value="firefly">🔥 Firefly ({stats.categories['firefly']})</option>
                <option value="event-horizon">🕳️ Event Horizon ({stats.categories['event-horizon']})</option>
                <option value="2001-space-odyssey">🎬 2001: A Space Odyssey ({stats.categories['2001-space-odyssey']})</option>
                <option value="harry-potter">⚡ Harry Potter ({stats.categories['harry-potter']})</option>
                <option value="lord-of-the-rings">💍 Lord of the Rings ({stats.categories['lord-of-the-rings']})</option>
                <option value="game-of-thrones">👑 Game of Thrones ({stats.categories['game-of-thrones']})</option>
                <option value="pokemon">⚡ Pokemon ({stats.categories['pokemon']})</option>
                <option value="zelda">🗡️ Legend of Zelda ({stats.categories['zelda']})</option>
                <option value="dnd">🎲 Dungeons & Dragons ({stats.categories['dnd']})</option>
                <option value="kaiju">🦖 Kaiju ({stats.categories['kaiju']})</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className={`border-b transition-colors duration-300 ${
        vibeSettings.currentVibe === 'locked-in'
          ? 'bg-gradient-to-br from-red-950/90 via-black/90 to-red-900/80 border-red-500/40'
          : (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
      }`}>
        <div className="px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Progress Bar */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-black tracking-wider ${
                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  TROPHY PROGRESS
                </span>
                <span className={`text-sm font-black tracking-wider ${
                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  {stats.completedItems}/{stats.totalItems}
                </span>
              </div>
              <div className={`w-full h-4 rounded-full ${
                vibeSettings.currentVibe === 'locked-in' 
                  ? 'bg-gray-900 border-2 border-red-500/40 clip-path-jagged-bar'
                  : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
              }`}
              style={vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
              } : {}}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    vibeSettings.currentVibe === 'locked-in'
                      ? 'bg-black border-2 border-white clip-path-jagged-bar'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600'
                  }`}
                  style={{ 
                    width: `${(stats.completedItems / stats.totalItems) * 100}%`,
                    ...(vibeSettings.currentVibe === 'locked-in' ? {
                      clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)'
                    } : {})
                  }}
                />
              </div>
              <div className={`text-xs mt-1 font-medium ${
                vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
              }`}>
                {Math.round((stats.completedItems / stats.totalItems) * 100)}% of all weight trophies earned
              </div>
            </div>

            {/* Achievement Count */}
            <div className={`p-4 rounded-lg transition-colors duration-300 ${
              vibeSettings.currentVibe === 'locked-in'
                ? 'bg-black/20 border border-red-500/30 clip-path-jagged'
                : (isDarkMode ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200')
            }`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">🏆</span>
                <span className={`text-sm font-black tracking-wider ${
                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-green-400' : 'text-green-600')
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  EARNED
                </span>
              </div>
              <div className={`text-2xl font-black tracking-wider ${
                vibeSettings.currentVibe === 'locked-in' ? 'text-white' : 'text-green-600'
              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                {stats.completedItems}
              </div>
              <div className={`text-xs font-medium ${
                vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
              }`}>
                TROPHIES
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trophy List */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedComparisons.map((item, index) => {
            const category = categorizeItem(item.name);
            const categoryColor = getCategoryColor(category);
            const weightRange = getWeightRange(item.weight);
            const weightRangeColor = getWeightRangeColor(item.weight);
            const isCompleted = isItemCompleted(item.weight);
            
            return (
              <div key={index} className={`p-4 border rounded-lg transition-all duration-300 hover:shadow-lg relative ${
                isCompleted
                  ? (vibeSettings.currentVibe === 'locked-in'
                      ? 'bg-black border-white shadow-red-500/20 clip-path-jagged'
                      : (isDarkMode ? 'bg-green-900/20 border-green-500/50 shadow-green-500/20' : 'bg-green-50 border-green-300 shadow-green-200/50')
                    )
                  : (vibeSettings.currentVibe === 'locked-in'
                      ? 'bg-gradient-to-br from-red-950/90 via-black/90 to-red-900/80 border-red-500/40 hover:border-red-400 clip-path-jagged'
                      : (isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300')
                    )
              }`}
              style={vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
              } : {}}>
                {/* Achievement Badge */}
                {isCompleted && (
                  <div className={`absolute -top-2 -right-2 text-white rounded-full p-1 shadow-lg ${
                    vibeSettings.currentVibe === 'locked-in' ? 'bg-white clip-path-jagged-small' : 'bg-green-500'
                  }`}
                  style={vibeSettings.currentVibe === 'locked-in' ? {
                    clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                  } : {}}>
                    <Trophy size={16} className={vibeSettings.currentVibe === 'locked-in' ? 'text-black' : ''} />
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getCategoryIcon(category)}</span>
                    <div className="flex flex-col space-y-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor} ${
                        vibeSettings.currentVibe === 'locked-in' ? 'bg-gray-900' : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                      } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}`}
                      style={vibeSettings.currentVibe === 'locked-in' ? {
                        clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)'
                      } : {}}>
                        {category.toUpperCase().replace('-', ' ')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${weightRangeColor} ${
                        vibeSettings.currentVibe === 'locked-in' ? 'bg-gray-900' : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                      } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}`}
                      style={vibeSettings.currentVibe === 'locked-in' ? {
                        clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)'
                      } : {}}>
                        {weightRange.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-black tracking-wider ${
                      isCompleted 
                        ? (vibeSettings.currentVibe === 'locked-in' ? 'text-white' : 'text-green-600')
                        : categoryColor
                    }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                      {displayLargeWeight(item.weight)}
                    </div>
                  </div>
                </div>
                
                <h3 className={`font-black tracking-wider text-center transition-colors duration-300 ${
                  isCompleted 
                    ? (vibeSettings.currentVibe === 'locked-in' ? 'text-white' : (isDarkMode ? 'text-green-400' : 'text-green-700'))
                    : (vibeSettings.currentVibe === 'locked-in' ? 'text-red-100' : (isDarkMode ? 'text-white' : 'text-gray-900'))
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  {item.name.toUpperCase()}
                </h3>

                {isCompleted && (
                  <div className={`text-center mt-2 text-xs font-black tracking-wider ${
                    vibeSettings.currentVibe === 'locked-in' ? 'text-white' : (isDarkMode ? 'text-green-400' : 'text-green-600')
                  }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    ✅ TROPHY EARNED!
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredAndSortedComparisons.length === 0 && (
          <div className={`text-center py-12 transition-colors duration-300 ${
            vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
          }`}>
            <Scale size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No trophies found</h3>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Footer with total count */}
      <div className={`border-t mt-8 transition-colors duration-300 ${
        vibeSettings.currentVibe === 'locked-in'
          ? 'bg-gradient-to-br from-red-950/90 via-black/90 to-red-900/80 border-red-500/40'
          : (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
      }`}>
        <div className="px-4 py-4 text-center">
          <p className={`text-sm transition-colors duration-300 ${
            vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
          }`}>
            Showing {filteredAndSortedComparisons.length} of {stats.totalItems} weight trophies
            {searchQuery && ` matching "${searchQuery}"`}
            {filterCategory !== 'all' && ` in ${filterCategory.replace('-', ' ')} category`}
            • {stats.completedItems} earned with {achievementMode} mode
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeightComparisonViewer;