import React, { useState, useEffect } from 'react';
import { WorkoutDay, Exercise, WorkoutLog, WeightUnit, ExerciseLibrary, CardioSession, DistanceUnit } from './types/workout';
import { saveWorkoutDays, loadWorkoutDays, saveWorkoutHistory, loadWorkoutHistory, saveDarkMode, loadDarkMode, saveWeightUnit, loadWeightUnit, clearAllData, saveCardioHistory, loadCardioHistory, saveDistanceUnit, loadDistanceUnit } from './utils/storage';
import { saveExerciseLibrary, loadExerciseLibrary, addExerciseToLibrary, initializeExerciseLibraryFromWorkouts } from './utils/exerciseLibrary';
import { convertWeight, getOlympicBarWeight } from './utils/unitConversion';
import Header from './components/Header';
import DaySelector from './components/DaySelector';
import DayInfo from './components/DayInfo';
import ExerciseList from './components/ExerciseList';
import WorkoutHistory from './components/WorkoutHistory';
import Progress from './components/Progress';
import GymStatWrapped from './components/GymStatWrapped';
import LogWorkoutButton from './components/LogWorkoutButton';
import ConfirmationModal from './components/ConfirmationModal';
import Settings from './components/Settings';
import WeightComparisonViewer from './components/WeightComparisonViewer';
import AnimatedWeightComparison from './components/AnimatedWeightComparison';
import MobileTabNavigation from './components/MobileTabNavigation';
import CardioSessionForm from './components/CardioSession';
import CardioHistory from './components/CardioHistory';
import MobileOptimizedLayout from './components/MobileOptimizedLayout';
import { VibeProvider } from './components/VibeProvider';
import { useVibe } from './components/VibeProvider';
import { useVisualSettings } from './components/VisualSettingsProvider';
import { getVibeClasses } from './utils/vibeSettings';
import { Dumbbell, History, TrendingUp, Calendar, Activity } from 'lucide-react';
import CardioWrapped from './components/CardioWrapped';
import WrappedTabSelector from './components/WrappedTabSelector';

const WorkoutPlannerApp = () => {
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => loadDarkMode());

  // Weight unit state
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(() => loadWeightUnit());

  // Distance unit state
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(() => loadDistanceUnit());

  // Exercise library state
  const [exerciseLibrary, setExerciseLibrary] = useState<ExerciseLibrary>(() => loadExerciseLibrary());

  // Confirmation modal state
  const [showResetModal, setShowResetModal] = useState(false);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);

  // Weight comparison viewer state
  const [showWeightViewer, setShowWeightViewer] = useState(false);

  // Save preferences
  useEffect(() => {
    saveDarkMode(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    saveWeightUnit(weightUnit);
  }, [weightUnit]);
  
  useEffect(() => {
    saveDistanceUnit(distanceUnit);
  }, [distanceUnit]);

  useEffect(() => {
    saveExerciseLibrary(exerciseLibrary);
  }, [exerciseLibrary]);

  // Drag and drop state
  const [draggedDay, setDraggedDay] = useState<number | null>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Start with completely empty data - no default workouts
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(() => {
    const saved = loadWorkoutDays();
    // Return empty array instead of default data
    return saved || [];
  });

  const [workoutHistory, setWorkoutHistory] = useState<WorkoutLog[]>(() => loadWorkoutHistory());
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  
  // Cardio history state
  const [cardioHistory, setCardioHistory] = useState<CardioSession[]>(() => loadCardioHistory());
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDayName, setEditingDayName] = useState<number | null>(null);
  const [newDayName, setNewDayName] = useState('');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState('workout');
  const [expandedDayStats, setExpandedDayStats] = useState(false);

  // Initialize exercise library from existing data
  useEffect(() => {
    if (exerciseLibrary.exercises.length === 0 && (workoutDays.length > 0 || workoutHistory.length > 0)) {
      const initializedLibrary = initializeExerciseLibraryFromWorkouts(workoutDays, workoutHistory);
      setExerciseLibrary(initializedLibrary);
    }
  }, [workoutDays, workoutHistory, exerciseLibrary.exercises.length]);

  // Save workout days to localStorage whenever they change
  useEffect(() => {
    saveWorkoutDays(workoutDays);
  }, [workoutDays]);

  // Save workout history to localStorage whenever it changes
  useEffect(() => {
    saveWorkoutHistory(workoutHistory);
  }, [workoutHistory]);

  // Save cardio history to localStorage whenever it changes
  useEffect(() => {
    saveCardioHistory(cardioHistory);
  }, [cardioHistory]);

  // Update exercises when day changes
  useEffect(() => {
    if (workoutDays[currentDayIndex]) {
      setExercises(workoutDays[currentDayIndex].exercises);
    } else {
      setExercises([]);
    }
  }, [currentDayIndex, workoutDays]);

  // Drag and drop functions
  const handleDragStart = (e: React.DragEvent, dayIndex: number) => {
    if (!isEditing) return;
    setDraggedDay(dayIndex);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, dayIndex: number) => {
    if (!isEditing || draggedDay === null) return;
    e.preventDefault();
    setDragOverDay(dayIndex);
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!isEditing || draggedDay === null) return;
    e.preventDefault();
    
    if (draggedDay !== dropIndex) {
      const newWorkoutDays = [...workoutDays];
      const draggedItem = newWorkoutDays[draggedDay];
      
      newWorkoutDays.splice(draggedDay, 1);
      newWorkoutDays.splice(dropIndex, 0, draggedItem);
      
      setWorkoutDays(newWorkoutDays);
      
      if (currentDayIndex === draggedDay) {
        setCurrentDayIndex(dropIndex);
      } else if (currentDayIndex > draggedDay && currentDayIndex <= dropIndex) {
        setCurrentDayIndex(currentDayIndex - 1);
      } else if (currentDayIndex < draggedDay && currentDayIndex >= dropIndex) {
        setCurrentDayIndex(currentDayIndex + 1);
      }
    }
    
    setDraggedDay(null);
    setDragOverDay(null);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setDraggedDay(null);
    setDragOverDay(null);
    setIsDragging(false);
  };

  // Day management functions
  const addNewDay = () => {
    const dayName = newDayName.trim() ? newDayName.trim().toUpperCase() : `DAY ${workoutDays.length + 1}`;
    const newDay: WorkoutDay = {
      id: Date.now(),
      name: dayName,
      exercises: []
    };
    setWorkoutDays([...workoutDays, newDay]);
    setCurrentDayIndex(workoutDays.length);
    setNewDayName('');
  };

  const deleteDay = (dayIndex: number) => {
    // Remove the restriction - allow deletion even if it's the last day
    const newWorkoutDays = workoutDays.filter((_, index) => index !== dayIndex);
    setWorkoutDays(newWorkoutDays);
    
    // If we deleted all days, the app will show the welcome screen
    if (newWorkoutDays.length === 0) {
      setCurrentDayIndex(0);
      setExercises([]);
    } else {
      // Adjust current day index if necessary
      if (currentDayIndex >= dayIndex && currentDayIndex > 0) {
        setCurrentDayIndex(currentDayIndex - 1);
      } else if (currentDayIndex === dayIndex && dayIndex === workoutDays.length - 1) {
        setCurrentDayIndex(dayIndex - 1);
      }
    }
  };

  const addNewExercise = () => {
    if (!newExerciseName.trim()) return;
    
    const exerciseName = newExerciseName.trim().toUpperCase();
    
    // Add to exercise library
    const updatedLibrary = addExerciseToLibrary(exerciseName, exerciseLibrary);
    setExerciseLibrary(updatedLibrary);
    
    const newExercise: Exercise = {
      id: Date.now(),
      name: exerciseName,
      sets: [{ weight: 0, reps: 0, completed: false, hasOlympicBar: false }],
      history: []
    };
    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);
    setWorkoutDays(prevDays =>
      prevDays.map((day, index) =>
        index === currentDayIndex ? { ...day, exercises: updatedExercises } : day
      )
    );
    setNewExerciseName('');
  };

  const addExerciseFromLibrary = (exerciseName: string) => {
    const capitalizedName = exerciseName.toUpperCase();
    
    // Add to exercise library (updates usage count)
    const updatedLibrary = addExerciseToLibrary(capitalizedName, exerciseLibrary);
    setExerciseLibrary(updatedLibrary);
    
    const newExercise: Exercise = {
      id: Date.now(),
      name: capitalizedName,
      sets: [{ weight: 0, reps: 0, completed: false, hasOlympicBar: false }],
      history: []
    };
    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);
    setWorkoutDays(prevDays =>
      prevDays.map((day, index) =>
        index === currentDayIndex ? { ...day, exercises: updatedExercises } : day
      )
    );
  };

  const deleteExercise = (exerciseId: number) => {
    const updatedExercises = exercises.filter(exercise => exercise.id !== exerciseId);
    setExercises(updatedExercises);
    setWorkoutDays(prevDays =>
      prevDays.map((day, index) =>
        index === currentDayIndex ? { ...day, exercises: updatedExercises } : day
      )
    );
  };

  const toggleSetCompletion = (exerciseId: number, setIndex: number) => {
    const updatedExercises = exercises.map(exercise =>
      exercise.id === exerciseId
        ? {
            ...exercise,
            sets: exercise.sets.map((set, index) =>
              index === setIndex ? { ...set, completed: !set.completed } : set
            )
          }
        : exercise
    );
    setExercises(updatedExercises);
    setWorkoutDays(prevDays =>
      prevDays.map((day, index) =>
        index === currentDayIndex ? { ...day, exercises: updatedExercises } : day
      )
    );
  };

  const addSet = (exerciseId: number) => {
    const updatedExercises = exercises.map(exercise =>
      exercise.id === exerciseId
        ? { ...exercise, sets: [...exercise.sets, { weight: 0, reps: 0, completed: false, hasOlympicBar: false }] }
        : exercise
    );
    setExercises(updatedExercises);
    setWorkoutDays(prevDays =>
      prevDays.map((day, index) =>
        index === currentDayIndex ? { ...day, exercises: updatedExercises } : day
      )
    );
  };

  const updateSet = (exerciseId: number, setIndex: number, field: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    const updatedExercises = exercises.map(exercise =>
      exercise.id === exerciseId
        ? {
            ...exercise,
            sets: exercise.sets.map((set, index) =>
              index === setIndex ? { ...set, [field]: numValue } : set
            )
          }
        : exercise
    );
    setExercises(updatedExercises);
    setWorkoutDays(prevDays =>
      prevDays.map((day, index) =>
        index === currentDayIndex ? { ...day, exercises: updatedExercises } : day
      )
    );
  };

  const toggleOlympicBar = (exerciseId: number, setIndex: number) => {
    const olympicBarWeight = getOlympicBarWeight('lbs'); // Always use lbs for internal storage
    const updatedExercises = exercises.map(exercise =>
      exercise.id === exerciseId
        ? {
            ...exercise,
            sets: exercise.sets.map((set, index) =>
              index === setIndex ? { 
                ...set, 
                hasOlympicBar: !set.hasOlympicBar,
                weight: set.hasOlympicBar ? Math.max(0, (set.weight || 0) - olympicBarWeight) : (set.weight || 0) + olympicBarWeight
              } : set
            )
          }
        : exercise
    );
    setExercises(updatedExercises);
    setWorkoutDays(prevDays =>
      prevDays.map((day, index) =>
        index === currentDayIndex ? { ...day, exercises: updatedExercises } : day
      )
    );
  };

  const removeSet = (exerciseId: number, setIndex: number) => {
    const updatedExercises = exercises.map(exercise =>
      exercise.id === exerciseId
        ? { ...exercise, sets: exercise.sets.filter((_, index) => index !== setIndex) }
        : exercise
    );
    setExercises(updatedExercises);
    setWorkoutDays(prevDays =>
      prevDays.map((day, index) =>
        index === currentDayIndex ? { ...day, exercises: updatedExercises } : day
      )
    );
  };

  const handleLogWorkout = (workoutLog: WorkoutLog) => {
    setWorkoutHistory(prev => [workoutLog, ...prev]);
  };

  const resetCompletedSets = () => {
    const updatedExercises = exercises.map(exercise => ({
      ...exercise,
      sets: exercise.sets.map(set => ({ ...set, completed: false }))
    }));
    setExercises(updatedExercises);
    setWorkoutDays(prevDays =>
      prevDays.map((day, index) =>
        index === currentDayIndex ? { ...day, exercises: updatedExercises } : day
      )
    );
  };

  const handleLogCardio = (cardioSession: CardioSession) => {
    setCardioHistory(prev => [cardioSession, ...prev]);
  };

  const toggleDistanceUnit = () => {
    setDistanceUnit(prev => prev === 'mi' ? 'km' : 'mi');
  };

  const handleRefreshDay = () => {
    setShowResetModal(true);
  };

  const confirmResetDay = () => {
    resetCompletedSets();
  };

  const toggleWeightUnit = () => {
    setWeightUnit(prev => prev === 'lbs' ? 'kg' : 'lbs');
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleOpenWeightViewer = () => {
    setShowWeightViewer(true);
  };

  // Function to reset all app data
  const handleResetAllData = () => {
    clearAllData();
    // Reset all state to initial values
    setWorkoutDays([]);
    setWorkoutHistory([]);
    setExerciseLibrary({ exercises: [] });
    setCardioHistory([]);
    setExercises([]);
    setCurrentDayIndex(0);
    setIsDarkMode(false);
    setWeightUnit('lbs');
    setIsEditing(false);
    setEditingDayName(null);
    setNewDayName('');
    setNewExerciseName('');
    setExpandedExercise(null);
    setCurrentTab('workout');
    setExpandedDayStats(false);
    
    // Force page reload to ensure all components reset properly
    window.location.reload();
  };

  // Expose reset function globally for console access
  useEffect(() => {
    (window as any).resetGymStatData = handleResetAllData;
    console.log('🏋️ GymStat Debug: Type "resetGymStatData()" in console to clear all data');
    
    return () => {
      delete (window as any).resetGymStatData;
    };
  }, []);

  const currentDayName = workoutDays[currentDayIndex]?.name || '';

  // If weight viewer is open, show weight viewer
  if (showWeightViewer) {
    return (
      <VibeProvider isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
        <MobileOptimizedLayout isDarkMode={isDarkMode}>
          <WeightComparisonViewer
            isDarkMode={isDarkMode}
            weightUnit={weightUnit}
            workoutHistory={workoutHistory}
            workoutDays={workoutDays}
            onClose={() => setShowWeightViewer(false)}
          />
        </MobileOptimizedLayout>
      </VibeProvider>
    );
  }

  // If settings is open, show settings page
  if (showSettings) {
    return (
      <VibeProvider isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
        <MobileOptimizedLayout isDarkMode={isDarkMode}>
          <Settings
            isDarkMode={isDarkMode}
            distanceUnit={distanceUnit}
            weightUnit={weightUnit}
            onClose={() => setShowSettings(false)}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onToggleWeightUnit={toggleWeightUnit}
            onToggleDistanceUnit={toggleDistanceUnit}
          />
        </MobileOptimizedLayout>
      </VibeProvider>
    );
  }

  // Show empty state if no workout days exist
  if (workoutDays.length === 0) {
    return (
      <VibeProvider isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
        <MobileOptimizedLayout isDarkMode={isDarkMode}>
          <div className={`min-h-screen flex flex-col transition-all duration-500 ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <Header 
              isDarkMode={isDarkMode} 
              toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              weightUnit={weightUnit}
              toggleWeightUnit={toggleWeightUnit}
              onOpenSettings={handleOpenSettings}
              onOpenWeightViewer={handleOpenWeightViewer}
            />
            
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="text-8xl mb-6">🏋️</div>
                <h2 className={`text-3xl font-black tracking-wider mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  WELCOME TO GYMSTAT
                </h2>
                <p className={`text-lg mb-8 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Ready to start your fitness journey? Create your first workout day to begin tracking your progress!
                </p>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newDayName}
                    onChange={(e) => setNewDayName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newDayName.trim()) {
                          addNewDay();
                        }
                      }
                    }}
                    placeholder="Enter workout day name (e.g., CHEST DAY, LEG DAY)"
                    className={`w-full px-4 py-3 border rounded-lg text-center font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  
                  <button
                    onClick={addNewDay}
                    className="w-full py-4 bg-blue-600 text-white font-black tracking-wider rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}
                  >
                    CREATE YOUR FIRST WORKOUT DAY
                  </button>
                  
                  <button
                    onClick={handleResetAllData}
                    className={`w-full py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Reset All Data (Clear Everything)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </MobileOptimizedLayout>
      </VibeProvider>
    );
  }

  return (
    <VibeProvider isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <MobileOptimizedLayout isDarkMode={isDarkMode}>
        <AppContent
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          weightUnit={weightUnit}
          distanceUnit={distanceUnit}
          toggleWeightUnit={toggleWeightUnit}
          toggleDistanceUnit={toggleDistanceUnit}
          exerciseLibrary={exerciseLibrary}
          showResetModal={showResetModal}
          setShowResetModal={setShowResetModal}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          workoutDays={workoutDays}
          currentDayIndex={currentDayIndex}
          isEditing={isEditing}
          editingDayName={editingDayName}
          newDayName={newDayName}
          draggedDay={draggedDay}
          dragOverDay={dragOverDay}
          setCurrentDayIndex={setCurrentDayIndex}
          setIsEditing={setIsEditing}
          setEditingDayName={setEditingDayName}
          setNewDayName={setNewDayName}
          setWorkoutDays={setWorkoutDays}
          addNewDay={addNewDay}
          deleteDay={deleteDay}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleDragEnd={handleDragEnd}
          currentDayName={currentDayName}
          exercises={exercises}
          expandedDayStats={expandedDayStats}
          setExpandedDayStats={setExpandedDayStats}
          expandedExercise={expandedExercise}
          newExerciseName={newExerciseName}
          setExpandedExercise={setExpandedExercise}
          setNewExerciseName={setNewExerciseName}
          addNewExercise={addNewExercise}
          addExerciseFromLibrary={addExerciseFromLibrary}
          deleteExercise={deleteExercise}
          toggleSetCompletion={toggleSetCompletion}
          addSet={addSet}
          updateSet={updateSet}
          toggleOlympicBar={toggleOlympicBar}
          removeSet={removeSet}
          handleLogWorkout={handleLogWorkout}
          resetCompletedSets={resetCompletedSets}
          handleRefreshDay={handleRefreshDay}
          confirmResetDay={confirmResetDay}
          handleOpenSettings={handleOpenSettings}
          handleOpenWeightViewer={handleOpenWeightViewer}
          workoutHistory={workoutHistory}
          onResetAllData={handleResetAllData}
          cardioHistory={cardioHistory}
          onLogCardio={handleLogCardio}
        />
      </MobileOptimizedLayout>
    </VibeProvider>
  );
};

interface AppContentProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  toggleWeightUnit: () => void;
  toggleDistanceUnit: () => void;
  exerciseLibrary: ExerciseLibrary;
  showResetModal: boolean;
  setShowResetModal: (value: boolean) => void;
  currentTab: string;
  setCurrentTab: (value: string) => void;
  workoutDays: WorkoutDay[];
  currentDayIndex: number;
  isEditing: boolean;
  editingDayName: number | null;
  newDayName: string;
  draggedDay: number | null;
  dragOverDay: number | null;
  setCurrentDayIndex: (value: number) => void;
  setIsEditing: (value: boolean) => void;
  setEditingDayName: (value: number | null) => void;
  setNewDayName: (value: string) => void;
  setWorkoutDays: React.Dispatch<React.SetStateAction<WorkoutDay[]>>;
  addNewDay: () => void;
  deleteDay: (index: number) => void;
  handleDragStart: (e: React.DragEvent, dayIndex: number) => void;
  handleDragOver: (e: React.DragEvent, dayIndex: number) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, dropIndex: number) => void;
  handleDragEnd: () => void;
  currentDayName: string;
  exercises: Exercise[];
  expandedDayStats: boolean;
  setExpandedDayStats: (value: boolean) => void;
  expandedExercise: number | null;
  newExerciseName: string;
  setExpandedExercise: (value: number | null) => void;
  setNewExerciseName: (value: string) => void;
  addNewExercise: () => void;
  addExerciseFromLibrary: (exerciseName: string) => void;
  deleteExercise: (id: number) => void;
  toggleSetCompletion: (exerciseId: number, setIndex: number) => void;
  addSet: (exerciseId: number) => void;
  updateSet: (exerciseId: number, setIndex: number, field: string, value: string) => void;
  toggleOlympicBar: (exerciseId: number, setIndex: number) => void;
  removeSet: (exerciseId: number, setIndex: number) => void;
  handleLogWorkout: (log: WorkoutLog) => void;
  resetCompletedSets: () => void;
  handleRefreshDay: () => void;
  confirmResetDay: () => void;
  handleOpenSettings: () => void;
  handleOpenWeightViewer: () => void;
  workoutHistory: WorkoutLog[];
  onResetAllData: () => void;
  cardioHistory: CardioSession[];
  onLogCardio: (session: CardioSession) => void;
}

const AppContent: React.FC<AppContentProps> = ({
  isDarkMode,
  setIsDarkMode,
  weightUnit,
  distanceUnit,
  toggleWeightUnit,
  toggleDistanceUnit,
  exerciseLibrary,
  showResetModal,
  setShowResetModal,
  currentTab,
  setCurrentTab,
  workoutDays,
  currentDayIndex,
  isEditing,
  editingDayName,
  newDayName,
  draggedDay,
  dragOverDay,
  setCurrentDayIndex,
  setIsEditing,
  setEditingDayName,
  setNewDayName,
  setWorkoutDays,
  addNewDay,
  deleteDay,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDragEnd,
  currentDayName,
  exercises,
  expandedDayStats,
  setExpandedDayStats,
  expandedExercise,
  newExerciseName,
  setExpandedExercise,
  setNewExerciseName,
  addNewExercise,
  addExerciseFromLibrary,
  deleteExercise,
  toggleSetCompletion,
  addSet,
  updateSet,
  toggleOlympicBar,
  removeSet,
  handleLogWorkout,
  resetCompletedSets,
  handleRefreshDay,
  confirmResetDay,
  handleOpenSettings,
  handleOpenWeightViewer,
  workoutHistory,
  onResetAllData,
  cardioHistory,
  onLogCardio
}) => {
  const { vibeSettings } = useVibe();
  const { settings } = useVisualSettings();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  const isMobile = settings.screenOptimization === 'smartphone';

  const [wrappedMode, setWrappedMode] = useState<'weight' | 'cardio'>('weight');

  const tabs = [
    { id: 'workout', label: 'Weight', icon: <Dumbbell size={16} /> },
    { id: 'cardio', label: 'Cardio', icon: <Activity size={16} /> },
    { id: 'history', label: 'History', icon: <History size={16} /> }, 
    { id: 'progress', label: 'Progress', icon: <TrendingUp size={16} /> },
    { id: 'wrapped', label: 'Wrapped', icon: <Calendar size={16} /> }
  ];

  return (
    <div className={`
      min-h-screen flex flex-col transition-all duration-500 content-container
      ${vibeClasses.background || (isDarkMode ? 'bg-gray-900' : 'bg-gray-50')}
    `}>
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        weightUnit={weightUnit}
        toggleWeightUnit={toggleWeightUnit}
        onRefreshDay={currentTab === 'workout' ? handleRefreshDay : undefined}
        onOpenSettings={handleOpenSettings}
        onOpenWeightViewer={handleOpenWeightViewer}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={confirmResetDay}
        title="Reset Workout Progress"
        message={`Are you sure you want to reset all completed sets for "${currentDayName}"? This will uncheck all completed exercises but keep your weight and rep values. This action cannot be undone.`}
        confirmText="Reset Progress"
        cancelText="Cancel"
        isDarkMode={isDarkMode}
        isDestructive={true}
      />

      {/* Tab Navigation */}
      <MobileTabNavigation
        tabs={tabs}
        activeTab={currentTab}
        onTabChange={setCurrentTab}
        isDarkMode={isDarkMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentTab === 'workout' ? (
          <>
            <DaySelector
              workoutDays={workoutDays}
              currentDayIndex={currentDayIndex}
              isEditing={isEditing}
              editingDayName={editingDayName}
              newDayName={newDayName}
              isDarkMode={isDarkMode}
              draggedDay={draggedDay}
              dragOverDay={dragOverDay}
              setCurrentDayIndex={setCurrentDayIndex}
              setIsEditing={setIsEditing}
              setEditingDayName={setEditingDayName}
              setNewDayName={setNewDayName}
              setWorkoutDays={setWorkoutDays}
              addNewDay={addNewDay}
              deleteDay={deleteDay}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleDragEnd={handleDragEnd}
            />

            <DayInfo
              currentDayName={currentDayName}
              exercises={exercises}
              expandedDayStats={expandedDayStats}
              isDarkMode={isDarkMode}
              weightUnit={weightUnit}
              setExpandedDayStats={setExpandedDayStats}
            />

            <div className="flex-1 overflow-y-auto">
              <ExerciseList
                exercises={exercises}
                isEditing={isEditing}
                expandedExercise={expandedExercise}
                newExerciseName={newExerciseName}
                isDarkMode={isDarkMode}
                weightUnit={weightUnit}
                exerciseLibrary={exerciseLibrary}
                setExpandedExercise={setExpandedExercise}
                setNewExerciseName={setNewExerciseName}
                addNewExercise={addNewExercise}
                addExerciseFromLibrary={addExerciseFromLibrary}
                deleteExercise={deleteExercise}
                toggleSetCompletion={toggleSetCompletion}
                addSet={addSet}
                updateSet={updateSet}
                toggleOlympicBar={toggleOlympicBar}
                removeSet={removeSet}
              />
            </div>

            <LogWorkoutButton
              exercises={exercises}
              currentDayName={currentDayName}
              isDarkMode={isDarkMode}
              weightUnit={weightUnit}
              onLogWorkout={handleLogWorkout}
              onResetCompletedSets={resetCompletedSets}
            />
          </>
        ) : currentTab === 'cardio' ? (
          <CardioSessionForm 
            isDarkMode={isDarkMode} 
            distanceUnit={distanceUnit} 
            onLogCardio={onLogCardio} 
          />
        ) : (
          <div className="flex-1 overflow-y-auto">
            {currentTab === 'history' ? (
              <WorkoutHistory
                workoutHistory={workoutHistory}
                cardioHistory={cardioHistory}
                isDarkMode={isDarkMode}
                weightUnit={weightUnit}
                distanceUnit={distanceUnit}
                AnimatedWeightComparison={AnimatedWeightComparison}
              />
            ) : currentTab === 'progress' ? (
              <Progress
                workoutHistory={workoutHistory}
                isDarkMode={isDarkMode}
                weightUnit={weightUnit}
                AnimatedWeightComparison={AnimatedWeightComparison}
              />
            ) : currentTab === 'wrapped' ? (
              <>
                <WrappedTabSelector 
                  isDarkMode={isDarkMode} 
                  activeMode={wrappedMode} 
                  onSelectMode={setWrappedMode}
                />
                
                {wrappedMode === 'weight' ? (
                  <GymStatWrapped
                    workoutHistory={workoutHistory}
                    workoutDays={workoutDays}
                    isDarkMode={isDarkMode}
                    cardioHistory={cardioHistory}
                    distanceUnit={distanceUnit}
                    weightUnit={weightUnit}
                  />
                ) : (
                  <CardioWrapped
                    cardioHistory={cardioHistory}
                    isDarkMode={isDarkMode}
                    distanceUnit={distanceUnit}
                  />
                )}
              </>
            ) : (
              null
            )}
          </div>
        )}
      </div>
      
      {/* Reset All Data Button - Hidden but accessible via dev tools */}
      <button
        onClick={onResetAllData}
        className="hidden"
        id="reset-all-data-button"
        title="Reset all app data"
      >
        Reset All Data
      </button>
    </div>
  );
};

export default WorkoutPlannerApp;