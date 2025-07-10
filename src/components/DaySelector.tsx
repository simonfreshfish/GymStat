import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { WorkoutDay } from '../types/workout';
import { useVibe } from './VibeProvider';
import { useVisualSettings } from './VisualSettingsProvider';
import { getVibeClasses } from '../utils/vibeSettings';
import ConfirmationModal from './ConfirmationModal';

interface DaySelectorProps {
  workoutDays: WorkoutDay[];
  currentDayIndex: number;
  isEditing: boolean;
  editingDayName: number | null;
  newDayName: string;
  isDarkMode: boolean;
  draggedDay: number | null;
  dragOverDay: number | null;
  setCurrentDayIndex: (index: number) => void;
  setIsEditing: (editing: boolean) => void;
  setEditingDayName: (index: number | null) => void;
  setNewDayName: (name: string) => void;
  setWorkoutDays: React.Dispatch<React.SetStateAction<WorkoutDay[]>>;
  addNewDay: () => void;
  deleteDay: (index: number) => void;
  handleDragStart: (e: React.DragEvent, dayIndex: number) => void;
  handleDragOver: (e: React.DragEvent, dayIndex: number) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, dropIndex: number) => void;
  handleDragEnd: () => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  workoutDays,
  currentDayIndex,
  isEditing,
  editingDayName,
  newDayName,
  isDarkMode,
  setCurrentDayIndex,
  setIsEditing,
  setEditingDayName,
  setNewDayName,
  setWorkoutDays,
  addNewDay,
  deleteDay
}) => {
  const { vibeSettings } = useVibe();
  const { settings } = useVisualSettings();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  const isMobile = settings.screenOptimization === 'smartphone';
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteCurrentDay = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteDay(currentDayIndex);
    setShowDeleteModal(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newDayName.trim()) {
        addNewDay();
      }
    }
  };

  return (
    <>
      <div className={`
        border-b transition-all duration-500 flex-shrink-0
        ${vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}
        ${vibeClasses.border || ''}
      `}>
        {/* Edit Mode Controls - Moved to top band */}
        {isEditing && (
          <div className={`
            border-b transition-all duration-500 flex items-center justify-between
            ${isMobile ? 'px-3 py-3 safe-area-left safe-area-right' : 'px-4 py-3'}
            ${vibeClasses.gradient || (isDarkMode ? 'bg-blue-900 border-gray-700' : 'bg-blue-50 border-blue-100')}
          `}>
            <div className="flex items-center space-x-3 flex-1">
              {/* Add New Day Input */}
              <input
                type="text"
                value={newDayName}
                onChange={(e) => setNewDayName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isMobile ? "Day name" : "Day name"}
                className={`
                  border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-500 rounded-lg font-medium
                  ${isMobile ? 'px-3 py-2 text-sm flex-1 min-w-0' : 'px-4 py-2 text-sm min-w-[120px]'}
                  ${vibeClasses.card || (isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500')}
                `}
              />
              
              <button
                onClick={addNewDay}
                className={`
                  transition-all duration-500 rounded-lg touch-target flex items-center justify-center flex-shrink-0
                  ${isMobile ? 'p-3 w-12 h-12' : 'p-3 w-14 h-14'}
                  ${vibeClasses.button || 'bg-green-500 text-white hover:bg-green-600'}
                `}
              >
                <Plus size={isMobile ? 20 : 24} />
              </button>
            </div>

            {/* Trash Button - Now always visible when editing */}
            <button
              onClick={handleDeleteCurrentDay}
              className={`
                transition-all duration-500 rounded-lg flex items-center justify-center touch-target ml-3 flex-shrink-0
                ${isMobile ? 'p-2 w-10 h-10' : 'p-3 w-12 h-12'}
                bg-red-500 text-white hover:bg-red-600 shadow-lg
              `}
              title="Delete current day"
            >
              <Trash2 size={isMobile ? 16 : 20} />
            </button>
          </div>
        )}

        <div className={`
          flex items-center justify-between
          ${isMobile ? 'px-2 py-2 safe-area-left safe-area-right' : 'px-4 py-3'}
        `}>
          {/* Day Tabs - Scrollable on mobile */}
          <div className={`
            flex overflow-x-auto scrollbar-hide flex-1 mr-2
            ${isMobile ? 'space-x-1' : 'space-x-2'}
          `}>
            {workoutDays.map((day, index) => (
              <div 
                key={day.id} 
                className="flex-shrink-0 relative"
              >
                {editingDayName === index ? (
                  <input
                    type="text"
                    value={day.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setWorkoutDays(prevDays =>
                        prevDays.map((d, i) => i === index ? { ...d, name: newName } : d)
                      );
                    }}
                    onBlur={() => setEditingDayName(null)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingDayName(null)}
                    className={`
                      font-black tracking-wider border-2 border-blue-500 focus:outline-none transition-all duration-500 rounded-lg
                      ${isMobile ? 'px-3 py-2 text-xs min-w-[120px]' : 'px-4 py-2 text-sm min-w-[140px]'}
                      ${vibeClasses.card || (isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900')}
                    `}
                    style={{ 
                      fontFamily: 'system-ui, -apple-system, sans-serif', 
                      letterSpacing: '0.1em'
                    }}
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setCurrentDayIndex(index)}
                    onDoubleClick={() => isEditing && setEditingDayName(index)}
                    className={`
                      font-black tracking-wider transition-all duration-300 relative rounded-lg touch-target
                      ${isMobile ? 'px-3 py-2 text-xs min-w-[120px]' : 'px-4 py-2 text-sm min-w-[140px]'}
                      ${currentDayIndex === index
                        ? (vibeClasses.button || 'bg-blue-600 text-white shadow-lg border-2 border-blue-400')
                        : (vibeClasses.card || (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'))
                      }
                      ${vibeClasses.glow || ''}
                    `}
                    style={{ 
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      letterSpacing: '0.1em'
                    }}
                    title={day.name}
                  >
                    <div className="w-full text-center">
                      {day.name}
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`
              transition-all duration-500 rounded-lg flex-shrink-0 touch-target font-black tracking-wider
              ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'}
              ${isEditing 
                ? (isDarkMode 
                    ? 'bg-red-600 text-white border-2 border-red-400 hover:bg-red-700' 
                    : 'bg-red-500 text-white border-2 border-red-300 hover:bg-red-600')
                : (vibeClasses.button || (isDarkMode ? 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 border-2 border-gray-300 hover:bg-gray-300'))
              }
            `}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}
            title="Toggle Edit Mode"
          >
            EDIT
          </button>
        </div>
        
        {/* Edit Mode Instructions */}
        {isEditing && (
          <div className={`
            border-t transition-all duration-500
            ${isMobile ? 'px-2 py-2' : 'px-4 py-2'}
            ${vibeClasses.gradient || (isDarkMode ? 'bg-blue-900 border-gray-700' : 'bg-blue-50 border-blue-100')}
          `}>
            <p className={`
              transition-all duration-500 font-medium
              ${isMobile ? 'text-xs' : 'text-xs'}
              ${vibeClasses.text || (isDarkMode ? 'text-blue-300' : 'text-blue-600')}
            `}>
              💡 {isMobile ? 'Tap to select • Double-tap to rename • Trash deletes current day' : 'Tap to select • Double-tap to rename • Trash button deletes current day'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Workout Day"
        message={
          workoutDays.length === 1 
            ? `Are you sure you want to delete "${workoutDays[currentDayIndex]?.name}"? This is your last workout day. Deleting it will remove all exercises and return you to the welcome screen. This action cannot be undone.`
            : `Are you sure you want to delete "${workoutDays[currentDayIndex]?.name}"? This will permanently remove this day and all its exercises. This action cannot be undone.`
        }
        confirmText="Delete Day"
        cancelText="Cancel"
        isDarkMode={isDarkMode}
        isDestructive={true}
      />
    </>
  );
};

export default DaySelector;