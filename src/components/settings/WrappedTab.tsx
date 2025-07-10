import React from 'react';
import { Gift, Info, Dumbbell, Activity, ChevronRight } from 'lucide-react';
import { useWrappedPreferences } from '../WrappedPreferencesProvider';
import { useVibe } from '../VibeProvider';
import { getVibeClasses } from '../../utils/vibeSettings';

interface WrappedTabProps {
  isDarkMode: boolean;
}

const WrappedTab: React.FC<WrappedTabProps> = ({ isDarkMode }) => {
  const { preferences, updatePreferences } = useWrappedPreferences();
  const { vibeSettings } = useVibe();
  
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode); 

  // All available categories
  const generalCategories = [
    { id: 'animals', name: 'Animals', icon: '🐾', description: 'Cats, dogs, elephants, dinosaurs, and more' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗', description: 'Cars, trucks, motorcycles, and other vehicles' },
    { id: 'people', name: 'People', icon: '👤', description: 'Athletes, celebrities, and average humans' },
    { id: 'buildings', name: 'Buildings', icon: '🏛️', description: 'Monuments, skyscrapers, and famous structures' },
    { id: 'space', name: 'Space', icon: '🚀', description: 'Rockets, satellites, and space equipment' },
    { id: 'objects', name: 'Objects', icon: '📦', description: 'Everyday items and household objects' },
    { id: 'fictional', name: 'Other Fictional', icon: '🎮', description: 'Fictional items not in specific franchises' }
  ];

  // Franchises
  const franchises = [
    { id: 'star-wars', name: 'Star Wars', icon: '⭐', description: 'Ships and characters from the Star Wars universe' },
    { id: 'star-trek', name: 'Star Trek', icon: '🖖', description: 'Starships and technology from Star Trek' },
    { id: 'halo', name: 'Halo', icon: '👽', description: 'Vehicles and structures from the Halo games' },
    { id: 'marvel', name: 'Marvel', icon: '🦸', description: 'Superheroes and items from Marvel' },
    { id: 'mass-effect', name: 'Mass Effect', icon: '🌌', description: 'Ships and technology from Mass Effect' },
    { id: 'warhammer-40k', name: 'Warhammer 40K', icon: '⚔️', description: 'Units and vehicles from the 41st millennium' },
    { id: 'alien', name: 'Alien', icon: '👾', description: 'Creatures and ships from the Alien franchise' },
    { id: 'terminator', name: 'Terminator', icon: '🤖', description: 'Robots and technology from Terminator' },
    { id: 'predator', name: 'Predator', icon: '👹', description: 'Creatures from the Predator franchise' },
    { id: 'minecraft', name: 'Minecraft', icon: '🧱', description: 'Blocks and items from Minecraft' },
    { id: 'pokemon', name: 'Pokemon', icon: '⚡', description: 'Pokemon creatures and items' },
    { id: 'harry-potter', name: 'Harry Potter', icon: '⚡', description: 'Wizarding world creatures and items' },
    { id: 'lord-of-the-rings', name: 'Lord of the Rings', icon: '💍', description: 'Middle-earth creatures and items' },
    { id: 'game-of-thrones', name: 'Game of Thrones', icon: '🐉', description: 'Westeros creatures and items' },
    { id: 'zelda', name: 'Legend of Zelda', icon: '🗡️', description: 'Hyrule characters and items' },
    { id: 'dnd', name: 'D&D', icon: '🎲', description: 'Dungeons & Dragons creatures and items' }
  ];

  // Toggle a category preference
  const toggleCategory = (category: string) => {
    const newPreferences = { ...preferences };
    
    if (newPreferences.enabledCategories.includes(category)) {
      newPreferences.enabledCategories = newPreferences.enabledCategories.filter(c => c !== category);
    } else {
      newPreferences.enabledCategories.push(category);
    }
    
    updatePreferences(newPreferences);
  };

  // Toggle all categories in a section
  const toggleAllInSection = (categories: string[], enabled: boolean) => {
    const newPreferences = { ...preferences };
    
    if (enabled) {
      // Add all categories that aren't already included
      categories.forEach(category => {
        if (!newPreferences.enabledCategories.includes(category)) {
          newPreferences.enabledCategories.push(category);
        }
      });
    } else {
      // Remove all categories
      newPreferences.enabledCategories = newPreferences.enabledCategories.filter(
        category => !categories.includes(category)
      );
    }
    
    updatePreferences(newPreferences);
  };

  // Check if all categories in a section are enabled
  const areAllEnabled = (categories: string[]) => {
    return categories.every(category => preferences.enabledCategories.includes(category));
  };

  // Get text color based on vibe
  const getTextColor = (primary = true) => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return primary ? 'text-red-100' : 'text-red-300';
    }
    return primary 
      ? (vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900'))
      : (vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600'));
  };

  // Get card style based on vibe
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
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">🎁</div>
        <h2 className={`text-3xl font-bold mb-2 transition-all duration-500 ${getTextColor()}`}>
          Wrapped Preferences
        </h2>
        <p className={`text-lg transition-all duration-500 ${getTextColor(false)}`}>
          Choose which weight comparisons appear in your GymStat Wrapped
        </p>
      </div>

      {/* Main Content */}
      <div className={`p-6 border rounded-xl transition-all duration-500 ${cardStyle.className}`} style={cardStyle.style}>
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Gift size={24} className={vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-purple-500'} />
            <h3 className={`text-xl font-bold ${getTextColor()}`}>
              Wrapped Preferences
            </h3>
          </div>
          
          {/* Mode Selector */}
          <div className={`mb-8 border p-3 rounded-lg ${
            vibeSettings.currentVibe === 'locked-in'
              ? 'bg-black border-red-500/40 clip-path-jagged-small' 
              : (isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200')
          }`}
          style={vibeSettings.currentVibe === 'locked-in' ? {
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
          } : {}}>
            <div className="font-bold mb-2 ${getTextColor()}">Select Wrapped Mode:</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updatePreferences({...preferences, wrappedMode: 'weight'})}
                className={`p-4 border rounded-lg flex items-center justify-between transition-colors duration-300 ${
                  preferences.wrappedMode === 'weight'
                    ? (vibeSettings.currentVibe === 'locked-in'
                        ? 'bg-red-900 text-red-300 border-white'
                        : (isDarkMode ? 'bg-blue-900 text-blue-300 border-blue-500' : 'bg-blue-50 text-blue-700 border-blue-300'))
                    : (vibeSettings.currentVibe === 'locked-in'
                        ? 'bg-gray-900 text-red-400 border-red-500/40'
                        : (isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-white text-gray-700 border-gray-300'))
                }`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                } : {}}
              >
                <div className="flex items-center space-x-2">
                  <Dumbbell size={20} className={
                    preferences.wrappedMode === 'weight'
                      ? (vibeSettings.currentVibe === 'locked-in' ? 'text-white' : 'text-blue-500')
                      : (vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-gray-400')
                  } />
                  <span>Weight Training</span>
                </div>
                {preferences.wrappedMode === 'weight' && (
                  <ChevronRight size={20} />
                )}
              </button>
              
              <button
                onClick={() => updatePreferences({...preferences, wrappedMode: 'cardio'})}
                className={`p-4 border rounded-lg flex items-center justify-between transition-colors duration-300 ${
                  preferences.wrappedMode === 'cardio'
                    ? (vibeSettings.currentVibe === 'locked-in'
                        ? 'bg-red-900 text-red-300 border-white'
                        : (isDarkMode ? 'bg-green-900 text-green-300 border-green-500' : 'bg-green-50 text-green-700 border-green-300'))
                    : (vibeSettings.currentVibe === 'locked-in'
                        ? 'bg-gray-900 text-red-400 border-red-500/40'
                        : (isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-white text-gray-700 border-gray-300'))
                }`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                } : {}}
              >
                <div className="flex items-center space-x-2">
                  <Activity size={20} className={
                    preferences.wrappedMode === 'cardio'
                      ? (vibeSettings.currentVibe === 'locked-in' ? 'text-white' : 'text-green-500')
                      : (vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-gray-400')
                  } />
                  <span>Cardio Training</span>
                </div>
                {preferences.wrappedMode === 'cardio' && (
                  <ChevronRight size={20} />
                )}
              </button>
            </div>
          </div>

          <h3 className={`text-lg font-bold mb-4 ${getTextColor()}`}>
            Weight Training Comparison Categories
          </h3>
          
          <p className={`text-sm mb-4 ${getTextColor(false)}`}>
            GymStat Weight Training Wrapped shows you how much weight you've lifted by comparing it to real-world objects.
            Only enabled categories will be used when generating weight comparisons.
          </p>
          
          <div className="flex items-center justify-between mb-6">
            <div className={`text-sm ${getTextColor(false)}`}>
              {preferences.enabledCategories.length} of {generalCategories.length + franchises.length} categories enabled
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => toggleAllInSection([...generalCategories.map(c => c.id), ...franchises.map(f => f.id)], true)}
                className={`px-3 py-1 text-sm rounded transition-colors duration-300 ${
                  vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white clip-path-jagged-button'
                    : (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                }`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}
              >
                Enable All
              </button>
              <button
                onClick={() => toggleAllInSection([...generalCategories.map(c => c.id), ...franchises.map(f => f.id)], false)}
                className={`px-3 py-1 text-sm rounded transition-colors duration-300 ${
                  vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gray-800 text-red-300 border border-red-500/40 clip-path-jagged-button'
                    : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')
                }`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                } : {}}
              >
                Disable All
              </button>
            </div>
          </div>
        </div>

        {/* Divider above General Categories */}
        <div className={`border-t mb-8 ${
          vibeSettings.currentVibe === 'locked-in' 
            ? 'border-red-500/40' 
            : (isDarkMode ? 'border-gray-700' : 'border-gray-200')
        }`}></div>

        {/* General Categories Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className={`font-semibold ${getTextColor()}`}>
              General Categories
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleAllInSection(generalCategories.map(c => c.id), true)}
                className={`px-2 py-1 text-xs rounded transition-colors duration-300 ${
                  vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white clip-path-jagged-button'
                    : (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                }`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)'
                } : {}}
              >
                Enable All
              </button>
              <button
                onClick={() => toggleAllInSection(generalCategories.map(c => c.id), false)}
                className={`px-2 py-1 text-xs rounded transition-colors duration-300 ${
                  vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gray-800 text-red-300 border border-red-500/40 clip-path-jagged-button'
                    : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')
                }`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)'
                } : {}}
              >
                Disable All
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {generalCategories.map(category => {
              const isEnabled = preferences.enabledCategories.includes(category.id);
              return (
                <div 
                  key={category.id}
                  className={`p-4 border rounded-lg transition-all duration-300 ${
                    vibeSettings.currentVibe === 'locked-in'
                      ? (isEnabled 
                          ? 'bg-black border-white clip-path-jagged-small' 
                          : 'bg-gray-900 border-red-500/40 clip-path-jagged-small')
                      : (isDarkMode
                          ? (isEnabled ? 'bg-gray-700 border-blue-500' : 'bg-gray-800 border-gray-700')
                          : (isEnabled ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'))
                  }`}
                  style={vibeSettings.currentVibe === 'locked-in' ? {
                    clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                  } : {}}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{category.icon}</span>
                        <h5 className={`font-medium ${getTextColor()}`}>{category.name}</h5>
                      </div>
                      <p className={`text-xs ${getTextColor(false)}`}>
                        {category.description}
                      </p>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isEnabled}
                        onChange={() => toggleCategory(category.id)}
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${
                        isEnabled
                          ? (vibeSettings.currentVibe === 'locked-in' ? 'bg-white' : 'bg-blue-600')
                          : (vibeSettings.currentVibe === 'locked-in' ? 'bg-red-900' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300'))
                      }`}>
                        <div className={`dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Divider between sections */}
        <div className={`border-t my-8 ${
          vibeSettings.currentVibe === 'locked-in' 
            ? 'border-red-500/40' 
            : (isDarkMode ? 'border-gray-700' : 'border-gray-200')
        }`}></div>
        
        {/* Franchise Categories Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className={`font-semibold ${getTextColor()}`}>
              Franchise Categories
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleAllInSection(franchises.map(f => f.id), true)}
                className={`px-2 py-1 text-xs rounded transition-colors duration-300 ${
                  vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white clip-path-jagged-button'
                    : (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                }`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)'
                } : {}}
              >
                Enable All
              </button>
              <button
                onClick={() => toggleAllInSection(franchises.map(f => f.id), false)}
                className={`px-2 py-1 text-xs rounded transition-colors duration-300 ${
                  vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gray-800 text-red-300 border border-red-500/40 clip-path-jagged-button'
                    : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')
                }`}
                style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)'
                } : {}}
              >
                Disable All
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {franchises.map(franchise => {
              const isEnabled = preferences.enabledCategories.includes(franchise.id);
              return (
                <div 
                  key={franchise.id}
                  className={`p-4 border rounded-lg transition-all duration-300 ${
                    vibeSettings.currentVibe === 'locked-in'
                      ? (isEnabled 
                          ? 'bg-black border-white clip-path-jagged-small' 
                          : 'bg-gray-900 border-red-500/40 clip-path-jagged-small')
                      : (isDarkMode
                          ? (isEnabled ? 'bg-gray-700 border-blue-500' : 'bg-gray-800 border-gray-700')
                          : (isEnabled ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'))
                  }`}
                  style={vibeSettings.currentVibe === 'locked-in' ? {
                    clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                  } : {}}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{franchise.icon}</span>
                        <h5 className={`font-medium ${getTextColor()}`}>{franchise.name}</h5>
                      </div>
                      <p className={`text-xs ${getTextColor(false)}`}>
                        {franchise.description}
                      </p>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isEnabled}
                        onChange={() => toggleCategory(franchise.id)}
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${
                        isEnabled
                          ? (vibeSettings.currentVibe === 'locked-in' ? 'bg-white' : 'bg-blue-600')
                          : (vibeSettings.currentVibe === 'locked-in' ? 'bg-red-900' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300'))
                      }`}>
                        <div className={`dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className={`p-6 border rounded-xl transition-all duration-500 ${
        vibeSettings.currentVibe === 'locked-in'
          ? 'bg-black border-red-500/40 clip-path-jagged'
          : (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')
      }`}
      style={vibeSettings.currentVibe === 'locked-in' ? {
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
      } : {}}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg flex-shrink-0 ${
            vibeSettings.currentVibe === 'locked-in'
              ? 'bg-red-900 text-red-400'
              : (isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600')
          }`}>
            <Info size={24} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${getTextColor()}`}>
              About Weight Comparisons
            </h3>
            <p className={`text-sm mb-3 ${getTextColor(false)}`}>
              GymStat Wrapped shows you how much weight you've lifted by comparing it to real-world objects.
              For example, your total weight lifted might be equivalent to 5 elephants or 10 cars.
            </p>
            <p className={`text-sm ${getTextColor(false)}`}>
              By enabling or disabling categories, you can customize which types of comparisons appear in your Wrapped.
              This is especially useful if you prefer certain types of comparisons over others.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WrappedTab;