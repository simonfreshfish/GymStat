import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Search, Filter } from 'lucide-react';
import { ExerciseLibraryEntry, ExerciseLibrary } from '../types/workout';
import { getAllCategories, getAllMuscleGroups, getExerciseSuggestions } from '../utils/exerciseLibrary';
import { useVibe } from './VibeProvider';
import { getVibeClasses } from '../utils/vibeSettings';

interface ExerciseSelectorProps {
  onSelectExercise: (exerciseName: string) => void;
  onNewExercise: (exerciseName: string) => void;
  placeholder?: string;
  isDarkMode: boolean;
  exerciseLibrary: ExerciseLibrary;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  onSelectExercise,
  onNewExercise,
  placeholder = "Search exercises by name, muscle group, or category...",
  isDarkMode,
  exerciseLibrary
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<ExerciseLibraryEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { vibeSettings } = useVibe();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);

  const categories = ['all', ...getAllCategories(exerciseLibrary)];
  const muscles = ['all', ...getAllMuscleGroups(exerciseLibrary)];

  // Function to position the dropdown properly
  const updateDropdownPosition = () => {
    if (!containerRef.current || (!isOpen && !showFilters)) return;
    
    const dropdown = document.getElementById('exercise-dropdown');
    if (!dropdown) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Set the dropdown position to fixed with coordinates based on the container
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${containerRect.bottom + window.scrollY}px`;
    dropdown.style.left = `${containerRect.left + window.scrollX}px`;
    dropdown.style.width = `${containerRect.width}px`;
    dropdown.style.zIndex = '9999';
    
    // Make sure the dropdown doesn't go off the bottom of the screen
    const viewportHeight = window.innerHeight;
    const dropdownRect = dropdown.getBoundingClientRect();
    const maxHeight = viewportHeight - dropdownRect.top - 20; // 20px padding from bottom
    
    dropdown.style.maxHeight = `${maxHeight}px`;
  };

  // Update dropdown position when it opens or when filters change
  useEffect(() => {
    if (isOpen || showFilters) {
      // Small delay to ensure the DOM is ready
      setTimeout(updateDropdownPosition, 50);
    }
  }, [isOpen, showFilters, filteredSuggestions.length]);

  useEffect(() => {
    // Get suggestions from the entire library with filters applied
    const suggestions = getExerciseSuggestions(
      query, 
      exerciseLibrary, 
      20, // Show more exercises since we're browsing the full library
      selectedCategory !== 'all' ? selectedCategory : undefined,
      selectedMuscle !== 'all' ? selectedMuscle : undefined
    );
    
    setFilteredSuggestions(suggestions);
  }, [query, exerciseLibrary, selectedCategory, selectedMuscle]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle window resize and scroll to reposition dropdown
  useEffect(() => {
    const handleResize = () => {
      if (isOpen || showFilters) {
        updateDropdownPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen, showFilters]);

  const handleSelectExercise = (exerciseName: string) => {
    console.log('Selecting existing exercise:', exerciseName);
    onSelectExercise(exerciseName);
    setQuery('');
    setIsOpen(false);
    setShowFilters(false);
  };

  const handleAddNewExercise = (exerciseName: string) => {
    console.log('Adding new exercise:', exerciseName);
    onNewExercise(exerciseName);
    setQuery('');
    setIsOpen(false);
    setShowFilters(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        console.log('Empty query, ignoring');
        return;
      }
      
      console.log('Enter pressed with query:', trimmedQuery);
      console.log('Filtered suggestions:', filteredSuggestions);
      
      // Check if there's an exact match in suggestions (case insensitive)
      const exactMatch = filteredSuggestions.find(
        suggestion => suggestion.name.toLowerCase() === trimmedQuery.toLowerCase()
      );
      
      if (exactMatch) {
        // Use existing exercise
        console.log('Found exact match:', exactMatch.name);
        handleSelectExercise(exactMatch.name);
      } else {
        // Add as new exercise
        console.log('No exact match found, adding new exercise');
        handleAddNewExercise(trimmedQuery);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setShowFilters(false);
    }
  };

  const handleAddButtonClick = () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      console.log('Add button clicked for:', trimmedQuery);
      handleAddNewExercise(trimmedQuery);
    }
  };

  const getMuscleGroupColor = (muscle: string) => {
    if (vibeSettings.currentVibe === 'locked-in') {
      // Use red tones for LOCKED IN mode
      const muscles: Record<string, string> = {
        'Chest': 'text-red-400',
        'Back': 'text-red-300',
        'Legs': 'text-red-400',
        'Shoulders': 'text-red-300',
        'Arms': 'text-red-400',
        'Core': 'text-red-300',
        'Biceps': 'text-red-400',
        'Triceps': 'text-red-300',
        'Quadriceps': 'text-red-400',
        'Hamstrings': 'text-red-300',
        'Glutes': 'text-red-400',
        'Calves': 'text-red-300',
        'Lats': 'text-red-400',
        'Traps': 'text-red-300',
        'Rhomboids': 'text-red-400',
        'Front Delts': 'text-red-300',
        'Side Delts': 'text-red-400',
        'Rear Delts': 'text-red-300',
        'Abs': 'text-red-400',
        'Obliques': 'text-red-300',
        'Lower Abs': 'text-red-400',
        'Forearms': 'text-red-300',
        'Upper Chest': 'text-red-400',
        'Lower Chest': 'text-red-300',
        'Lower Back': 'text-red-400',
        'Middle Traps': 'text-red-300',
        'Hip Flexors': 'text-red-400'
      };
      return muscles[muscle] || 'text-red-300';
    }

    const colors = {
      'Chest': 'text-red-500',
      'Back': 'text-blue-500',
      'Legs': 'text-green-500',
      'Shoulders': 'text-yellow-500',
      'Arms': 'text-purple-500',
      'Core': 'text-orange-500',
      'Biceps': 'text-purple-400',
      'Triceps': 'text-purple-600',
      'Quadriceps': 'text-green-400',
      'Hamstrings': 'text-green-600',
      'Glutes': 'text-pink-500',
      'Calves': 'text-teal-500',
      'Lats': 'text-blue-400',
      'Traps': 'text-blue-600',
      'Rhomboids': 'text-blue-300',
      'Front Delts': 'text-yellow-400',
      'Side Delts': 'text-yellow-500',
      'Rear Delts': 'text-yellow-600',
      'Abs': 'text-orange-400',
      'Obliques': 'text-orange-500',
      'Lower Abs': 'text-orange-600',
      'Forearms': 'text-gray-500',
      'Upper Chest': 'text-red-400',
      'Lower Chest': 'text-red-600',
      'Lower Back': 'text-blue-700',
      'Middle Traps': 'text-blue-500',
      'Hip Flexors': 'text-pink-400'
    };
    return colors[muscle as keyof typeof colors] || 'text-gray-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    if (vibeSettings.currentVibe === 'locked-in') {
      switch (difficulty) {
        case 'Beginner': return 'text-red-300';
        case 'Intermediate': return 'text-red-400';
        case 'Advanced': return 'text-red-500';
        default: return 'text-red-300';
      }
    }

    switch (difficulty) {
      case 'Beginner': return 'text-green-500';
      case 'Intermediate': return 'text-yellow-500';
      case 'Advanced': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getFilterSummary = () => {
    const activeFilters = [];
    if (selectedCategory !== 'all') activeFilters.push(selectedCategory);
    if (selectedMuscle !== 'all') activeFilters.push(selectedMuscle);
    return activeFilters.length > 0 ? ` (${activeFilters.join(', ')})` : '';
  };

  const getSearchTypeIndicator = () => {
    if (!query.trim()) return '';
    
    // Check if query matches muscle groups
    const matchingMuscles = muscles.filter(muscle => 
      muscle.toLowerCase().includes(query.toLowerCase()) && muscle !== 'all'
    );
    
    // Check if query matches categories
    const matchingCategories = categories.filter(category => 
      category.toLowerCase().includes(query.toLowerCase()) && category !== 'all'
    );
    
    if (matchingMuscles.length > 0) {
      return ` • Found ${matchingMuscles.length} muscle group${matchingMuscles.length === 1 ? '' : 's'}`;
    }
    
    if (matchingCategories.length > 0) {
      return ` • Found ${matchingCategories.length} categor${matchingCategories.length === 1 ? 'y' : 'ies'}`;
    }
    
    return '';
  };

  // Get styling based on vibe
  const getDropdownStyling = () => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return {
        dropdown: 'bg-gradient-to-br from-red-950/95 via-black/95 to-red-900/95 border-red-500/60 shadow-red-500/30',
        input: 'bg-black border-red-500/40 text-red-100 placeholder-red-400 clip-path-jagged-small',
        button: 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white clip-path-jagged-button',
        filterButton: 'bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white border-red-500/40 clip-path-jagged-button',
        exerciseItem: 'hover:bg-red-950/50 text-red-100 border-red-700/30',
        text: 'text-red-100',
        accent: 'text-red-400',
        style: {
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
        }
      };
    }
    
    return {
      dropdown: vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'),
      input: vibeClasses.card || (isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'),
      button: 'bg-green-500 text-white hover:bg-green-600',
      filterButton: isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white',
      exerciseItem: vibeClasses.card || (isDarkMode ? 'hover:bg-gray-700 text-white border-gray-700' : 'hover:bg-gray-50 text-gray-900 border-gray-100'),
      text: vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900'),
      accent: vibeClasses.accent || 'text-blue-600',
      style: {}
    };
  };

  const styling = getDropdownStyling();

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              console.log('Input changed to:', e.target.value);
              setQuery(e.target.value);
              setIsOpen(true);
              // Update position after a small delay to ensure DOM is ready
              setTimeout(updateDropdownPosition, 50);
            }}
            onFocus={() => {
              setIsOpen(true);
              // Update position after a small delay to ensure DOM is ready
              setTimeout(updateDropdownPosition, 50);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full px-3 py-2 pr-10 border text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
              styling.input
            }`}
            style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
            } : {}}
          />
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              if (!isOpen) {
                // Update position after a small delay to ensure DOM is ready
                setTimeout(updateDropdownPosition, 50);
              }
            }}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 transition-colors duration-300 ${
              vibeSettings.currentVibe === 'locked-in' ? 'text-red-400 hover:text-red-300' : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
            }`}
          >
            <ChevronDown size={16} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <button
          onClick={() => {
            setShowFilters(!showFilters);
            // Update position after a small delay to ensure DOM is ready
            setTimeout(updateDropdownPosition, 50);
          }}
          className={`px-3 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-1 ${
            showFilters || selectedCategory !== 'all' || selectedMuscle !== 'all'
              ? styling.filterButton
              : (vibeSettings.currentVibe === 'locked-in'
                  ? 'bg-gray-800 text-red-300 hover:bg-gray-700 border border-red-500/40 clip-path-jagged-button'
                  : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                )
          }`}
          style={vibeSettings.currentVibe === 'locked-in' ? {
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
          } : {}}
          title="Filter exercises"
        >
          <Filter size={16} />
          {(selectedCategory !== 'all' || selectedMuscle !== 'all') && (
            <span className="text-xs">•</span>
          )}
        </button>

        {query.trim() && (
          <button
            onClick={handleAddButtonClick}
            className={`px-4 py-2 transition-colors duration-300 flex items-center space-x-2 text-sm rounded-lg font-black tracking-wider ${
              styling.button
            }`}
            style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif', 
              letterSpacing: '0.1em',
              ...(vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
              } : {})
            }}
            title="Add as new exercise"
          >
            <Plus size={16} />
            <span>ADD</span>
          </button>
        )}
      </div>

      {/* Filters - Using fixed positioning */}
      {showFilters && (
        <div
          id="exercise-dropdown"
          ref={dropdownRef}
          className={`border shadow-lg z-[9999] rounded-lg transition-colors duration-300 ${
            styling.dropdown
          }`}
          style={{ 
            position: 'fixed',
            overflowY: 'auto',
            ...styling.style 
          }}
        >
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-black tracking-wider mb-2 ${
                  styling.text
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  CATEGORY
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setTimeout(updateDropdownPosition, 50);
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${
                    vibeSettings.currentVibe === 'locked-in'
                      ? 'bg-black border-red-500/40 text-red-100 clip-path-jagged-small'
                      : (isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900')
                  }`}
                  style={vibeSettings.currentVibe === 'locked-in' ? {
                    clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                  } : {}}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-black tracking-wider mb-2 ${
                  styling.text
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  MUSCLE GROUP
                </label>
                <select
                  value={selectedMuscle}
                  onChange={(e) => {
                    setSelectedMuscle(e.target.value);
                    setTimeout(updateDropdownPosition, 50);
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-lg ${
                    vibeSettings.currentVibe === 'locked-in'
                      ? 'bg-black border-red-500/40 text-red-100 clip-path-jagged-small'
                      : (isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900')
                  }`}
                  style={vibeSettings.currentVibe === 'locked-in' ? {
                    clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                  } : {}}
                >
                  {muscles.map(muscle => (
                    <option key={muscle} value={muscle}>
                      {muscle === 'all' ? 'All Muscles' : muscle}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedMuscle('all');
                  setTimeout(updateDropdownPosition, 50);
                }}
                className={`px-3 py-2 text-sm rounded-lg transition-colors duration-300 font-medium ${
                  vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gray-800 text-red-300 hover:bg-gray-700 border border-red-500/40 clip-path-jagged-button'
                    : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                }`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                } : {}}
              >
                Clear Filters
              </button>
              
              <div className={`text-sm font-medium ${
                styling.text
              }`}>
                {filteredSuggestions.length} exercises found{getFilterSummary()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Suggestions - Using fixed positioning */}
      {isOpen && !showFilters && (
        <div
          id="exercise-dropdown"
          ref={dropdownRef}
          className={`border shadow-lg z-[9999] rounded-lg transition-colors duration-300 ${
            styling.dropdown
          }`}
          style={{ 
            position: 'fixed',
            overflowY: 'auto',
            ...styling.style 
          }}
        >
          {filteredSuggestions.length > 0 ? (
            <>
              <div className={`px-3 py-2 text-xs font-black tracking-wider border-b transition-colors duration-300 ${
                vibeSettings.currentVibe === 'locked-in' 
                  ? 'text-red-300 border-red-700 bg-red-950/50'
                  : (isDarkMode ? 'text-gray-400 border-gray-600 bg-gray-700' : 'text-gray-500 border-gray-200 bg-gray-50')
              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                <Search size={12} className="inline mr-1" />
                {query.trim() 
                  ? `SEARCH RESULTS${getFilterSummary()}${getSearchTypeIndicator()}` 
                  : (selectedCategory !== 'all' || selectedMuscle !== 'all') 
                    ? `FILTERED EXERCISES${getFilterSummary()}`
                    : 'ALL EXERCISES IN LIBRARY'
                }
                <span className="float-right">{filteredSuggestions.length} found</span>
              </div>
              
              <div className="max-h-[50vh] overflow-y-auto">
                {filteredSuggestions.map((exercise, index) => (
                  <button
                    key={exercise.name}
                    onClick={() => handleSelectExercise(exercise.name)}
                    className={`w-full px-3 py-3 text-left text-sm transition-colors duration-300 border-b last:border-b-0 ${
                      styling.exerciseItem
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`font-black tracking-wider ${styling.text}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                            {exercise.name}
                          </span>
                          {exercise.isCustom && (
                            <span className={`text-xs px-1 py-0.5 rounded ${
                              vibeSettings.currentVibe === 'locked-in'
                                ? 'bg-red-900 text-red-300'
                                : (isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700')
                            }`}>
                              CUSTOM
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3 text-xs mb-1">
                          <span className={`px-2 py-0.5 rounded font-medium ${
                            vibeSettings.currentVibe === 'locked-in'
                              ? 'bg-gray-800 text-red-300'
                              : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')
                          }`}>
                            {exercise.category}
                          </span>
                          
                          <span className={`font-medium ${getDifficultyColor(exercise.difficulty || 'Beginner')}`}>
                            {exercise.difficulty}
                          </span>
                          
                          {exercise.equipment && (
                            <span className={`font-medium ${
                              vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                            }`}>
                              {exercise.equipment}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {exercise.primaryMuscles.slice(0, 3).map(muscle => (
                            <span key={muscle} className={`text-xs px-1 py-0.5 rounded font-medium ${getMuscleGroupColor(muscle)} ${
                              vibeSettings.currentVibe === 'locked-in' ? 'bg-gray-800' : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                            }`}>
                              {muscle}
                            </span>
                          ))}
                          {exercise.primaryMuscles.length > 3 && (
                            <span className={`text-xs px-1 py-0.5 rounded font-medium ${
                              vibeSettings.currentVibe === 'locked-in' ? 'bg-gray-800 text-red-400' : (isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')
                            }`}>
                              +{exercise.primaryMuscles.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right ml-2">
                        <span className={`text-xs font-medium transition-colors duration-300 ${
                          vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                        }`}>
                          {exercise.timesUsed > 0 ? `${exercise.timesUsed}x used` : 'New'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : query.trim() ? (
            <div className={`px-3 py-4 text-sm transition-colors duration-300 ${
              styling.text
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-2">🔍</div>
                <div className="font-medium mb-1">No exercises found for "{query}"</div>
                <div className="text-xs">
                  Searched: exercise names, muscle groups, categories, and equipment
                </div>
                <div className="text-xs mt-1">
                  Press Enter or click "ADD" to create "{query.toUpperCase()}" as a new exercise
                </div>
              </div>
            </div>
          ) : (
            <div className={`px-3 py-4 text-sm transition-colors duration-300 ${
              styling.text
            }`}>
              <div className="text-center">
                <div className="text-2xl mb-2">💪</div>
                <div className="font-medium mb-1">
                  {selectedCategory !== 'all' || selectedMuscle !== 'all' 
                    ? 'No exercises match your filters'
                    : 'Browse the exercise library'
                  }
                </div>
                <div className="text-xs">
                  {selectedCategory !== 'all' || selectedMuscle !== 'all' 
                    ? 'Try adjusting the filters above or search for something specific'
                    : 'Search by exercise name, muscle group (e.g., "legs", "chest"), category, or equipment'
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseSelector;