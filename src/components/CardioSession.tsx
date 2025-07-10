import React, { useState } from 'react';
import { Clock, Activity, Heart, BarChart, Route, Calendar, X, Check, Save, MoreHorizontal } from 'lucide-react';
import { CardioSession, DistanceUnit } from '../types/workout';
import { useRef, useEffect } from 'react';
import { useVibe } from './VibeProvider';
import { useVisualSettings } from './VisualSettingsProvider';
import { getVibeClasses } from '../utils/vibeSettings';

interface CardioSessionProps {
  isDarkMode: boolean;
  distanceUnit: DistanceUnit;
  onLogCardio: (session: CardioSession) => void;
}

const CardioSessionForm: React.FC<CardioSessionProps> = ({ 
  isDarkMode, 
  distanceUnit,
  onLogCardio 
}) => {
  const { vibeSettings } = useVibe();
  const { settings } = useVisualSettings();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  const isMobile = settings.screenOptimization === 'smartphone';

  const [activityType, setActivityType] = useState<CardioSession['activityType']>('running');
  const [duration, setDuration] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [avgHeartRate, setAvgHeartRate] = useState<string>('');
  const [maxHeartRate, setMaxHeartRate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [customActivityName, setCustomActivityName] = useState<string>('');
  const [showMoreFields, setShowMoreFields] = useState<boolean>(false);
  const [isEditingCustomName, setIsEditingCustomName] = useState<boolean>(false);
  const customInputRef = useRef<HTMLInputElement>(null);

  const activityOptions: Array<{value: CardioSession['activityType']; label: string; icon: React.ReactNode}> = [
    { value: 'running', label: 'Running', icon: <span className="text-xl">🏃</span> },
    { value: 'cycling', label: 'Cycling', icon: <span className="text-xl">🚴</span> },
    { value: 'swimming', label: 'Swimming', icon: <span className="text-xl">🏊</span> },
    { value: 'rowing', label: 'Rowing', icon: <span className="text-xl">🚣</span> },
    { value: 'elliptical', label: 'Elliptical', icon: <span className="text-xl">🌀</span> },
    { value: 'stairmaster', label: 'Stairmaster', icon: <span className="text-xl">🪜</span> },
    { value: 'hiking', label: 'Hiking', icon: <span className="text-xl">🥾</span> },
    { value: 'other', label: 'Other', icon: <span className="text-xl">⭐</span> }
  ];

  // Focus the custom activity input when editing mode is enabled
  useEffect(() => {
    if (isEditingCustomName && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [isEditingCustomName]);

  const canSubmit = duration.trim() !== '';

  const handleSubmit = () => {
    if (!canSubmit) return;
    
    const now = new Date();
    const cardioSession: CardioSession = {
      id: `cardio_${now.getTime()}`,
      activityType,
      date: now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      timestamp: now.getTime(),
      duration: parseInt(duration) || 0,
      customActivityName: activityType === 'other' ? customActivityName.trim() || undefined : undefined,
      notes: notes.trim() || undefined
    };
    
    // Add optional fields if provided
    if (distance) {
      cardioSession.distance = parseFloat(distance) || 0;
    }
    
    if (calories) {
      cardioSession.calories = parseInt(calories) || 0;
    }
    
    if (avgHeartRate || maxHeartRate) {
      cardioSession.heartRate = {};
      
      if (avgHeartRate) {
        cardioSession.heartRate.average = parseInt(avgHeartRate) || 0;
      }
      
      if (maxHeartRate) {
        cardioSession.heartRate.max = parseInt(maxHeartRate) || 0;
      }
    }
    
    onLogCardio(cardioSession);
    
    // Reset form
    setActivityType('running');
    setDuration('');
    setDistance('');
    setCalories('');
    setAvgHeartRate('');
    setMaxHeartRate('');
    setNotes('');
    setCustomActivityName('');
    setShowMoreFields(false);
    setIsEditingCustomName(false);
  };

  // Get card style based on vibe
  const getCardStyle = () => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return {
        className: 'bg-gradient-to-br from-red-950/90 via-black/90 to-red-900/80 border-red-500/40 clip-path-jagged',
        inputClassName: 'bg-black border-red-500/40 text-red-100 placeholder-red-400 clip-path-jagged-small',
        buttonClassName: 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white clip-path-jagged-button',
        style: {
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
        },
        inputStyle: {
          clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
        },
        buttonStyle: {
          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
        }
      };
    }
    
    return {
      className: vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'),
      inputClassName: isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
      buttonClassName: isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600',
      style: {},
      inputStyle: {},
      buttonStyle: {}
    };
  };

  const cardStyle = getCardStyle();
  
  return (
    <div className={`px-4 py-4 ${isMobile ? 'safe-area-left safe-area-right pb-32' : 'pb-8'}`}>
      <div className={`mb-6 p-4 border rounded-lg transition-colors duration-300 ${cardStyle.className}`} style={cardStyle.style}>
        <div className="flex items-center space-x-3 mb-4">
          <Activity className={vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-blue-500'} size={24} />
          <h2 className={`text-xl font-black tracking-wider transition-colors duration-300 ${
            vibeSettings.currentVibe === 'locked-in' ? 'text-red-100' : (isDarkMode ? 'text-white' : 'text-gray-900')
          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            LOG CARDIO SESSION
          </h2>
        </div>
        
        <div className="space-y-4">
          {/* Activity Type Selector */}
          <div>
            <label className={`block text-sm font-black tracking-wider mb-2 ${
              vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
            }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
              ACTIVITY TYPE
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {activityOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setActivityType(option.value);
                    if (option.value === 'other') {
                      setIsEditingCustomName(true);
                    } else {
                      setIsEditingCustomName(false);
                    }
                  }}
                  className={`p-3 border rounded-lg transition-colors duration-300 flex flex-col items-center space-y-1 ${
                    activityType === option.value
                      ? (vibeSettings.currentVibe === 'locked-in'
                          ? 'bg-gradient-to-r from-red-600 to-red-800 text-white border-white clip-path-jagged-button'
                          : (isDarkMode ? 'bg-blue-600 text-white border-blue-400' : 'bg-blue-100 text-blue-700 border-blue-300'))
                      : (vibeSettings.currentVibe === 'locked-in'
                          ? 'bg-gray-800 text-red-300 hover:bg-gray-700 border-red-500/40 clip-path-jagged-button'
                          : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'))
                  }`}
                  style={activityType === option.value ? cardStyle.buttonStyle : {}}
                >
                  {option.icon}
                  <span className="text-sm font-medium whitespace-nowrap">{option.label}</span>
                  {activityType === option.value && option.value !== 'other' && <Check size={16} className="mt-1" />}
                  {activityType === 'other' && option.value === 'other' && !isEditingCustomName && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Check size={14} />
                      <span className="text-xs font-medium truncate max-w-[80px]">
                        {customActivityName || "Other"}
                      </span>
                    </div>
                  )}
                  {activityType === 'other' && option.value === 'other' && isEditingCustomName && (
                    <div className="mt-1 w-full max-w-[100px]" onClick={e => e.stopPropagation()}>
                      <input
                        ref={customInputRef}
                        type="text"
                        value={customActivityName}
                        onChange={(e) => setCustomActivityName(e.target.value)}
                        onBlur={() => setIsEditingCustomName(false)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsEditingCustomName(false);
                          }
                        }}
                        placeholder="Type name..."
                        className={`w-full px-2 py-1 text-xs border rounded transition-colors ${
                          vibeSettings.currentVibe === 'locked-in'
                            ? 'bg-black border-red-500/40 text-red-100 placeholder-red-400'
                            : (isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500')
                        }`}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Required Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className={`block text-sm font-black tracking-wider mb-2 ${
                vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                DURATION (MINUTES) *
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-opacity duration-200 ${
                  duration ? 'opacity-0' : 'opacity-100'
                }`}>
                  <Clock size={16} className={`${vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                </div>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter duration"
                  min="0"
                  className={`w-full pl-20 pr-4 py-2 border rounded-lg transition-colors duration-300 text-center ${cardStyle.inputClassName}`}
                  style={cardStyle.inputStyle}
                  required
                />
              </div>
              <p className={`mt-1 text-xs font-medium ${
                vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
              }`}>
                Required field
              </p>
            </div>
            
            {/* Distance */}
            <div>
              <label className={`block text-sm font-black tracking-wider mb-2 ${
                vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                DISTANCE ({distanceUnit.toUpperCase()})
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-opacity duration-200 ${
                  distance ? 'opacity-0' : 'opacity-100'
                }`}>
                  <Route size={16} className={`${vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                </div>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="Enter distance"
                  min="0"
                  step="0.01"
                  className={`w-full pl-20 pr-4 py-2 border rounded-lg transition-colors duration-300 text-center ${cardStyle.inputClassName}`}
                  style={cardStyle.inputStyle}
                />
              </div>
              <p className={`mt-1 text-xs font-medium ${
                vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
              }`}>
                Optional field
              </p>
            </div>
          </div>
          
          {/* More Fields Toggle */}
          <button
            onClick={() => setShowMoreFields(!showMoreFields)}
            className={`w-full py-2 border-2 border-dashed rounded-lg transition-colors duration-300 font-medium flex items-center justify-center space-x-1 ${
              vibeSettings.currentVibe === 'locked-in'
                ? 'border-red-500/40 text-red-300 hover:border-red-400 hover:text-red-200 clip-path-jagged'
                : (isDarkMode ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700')
            }`}
            style={vibeSettings.currentVibe === 'locked-in' ? cardStyle.style : {}}
          >
            <MoreHorizontal size={16} />
            <span>{showMoreFields ? 'Less Details' : 'More Details'}</span>
          </button>
          
          {/* Additional Fields - Conditional */}
          {showMoreFields && (
            <div className="space-y-4">
              {/* Calories */}
              <div>
                <label className={`block text-sm font-black tracking-wider mb-2 ${
                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  CALORIES BURNED
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-opacity duration-200 ${
                    calories ? 'opacity-0' : 'opacity-100'
                  }`}>
                    <BarChart size={16} className={`${vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                  </div>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="Enter calories"
                    min="0"
                    className={`w-full pl-20 pr-4 py-2 border rounded-lg transition-colors duration-300 text-center ${cardStyle.inputClassName}`}
                    style={cardStyle.inputStyle}
                  />
                </div>
              </div>
              
              {/* Heart Rate Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Average Heart Rate */}
                <div>
                  <label className={`block text-sm font-black tracking-wider mb-2 ${
                    vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                  }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    AVG HEART RATE (BPM)
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-opacity duration-200 ${
                      avgHeartRate ? 'opacity-0' : 'opacity-100'
                    }`}>
                      <Heart size={16} className={`${vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                    </div>
                    <input
                      type="number"
                      value={avgHeartRate}
                      onChange={(e) => setAvgHeartRate(e.target.value)}
                      placeholder="Average BPM"
                      min="0"
                      max="250"
                      className={`w-full pl-20 pr-4 py-2 border rounded-lg transition-colors duration-300 text-center ${cardStyle.inputClassName}`}
                      style={cardStyle.inputStyle}
                    />
                  </div>
                </div>
                
                {/* Max Heart Rate */}
                <div>
                  <label className={`block text-sm font-black tracking-wider mb-2 ${
                    vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                  }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    MAX HEART RATE (BPM)
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-opacity duration-200 ${
                      maxHeartRate ? 'opacity-0' : 'opacity-100'
                    }`}>
                      <Heart size={16} className={`${vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                    </div>
                    <input
                      type="number"
                      value={maxHeartRate}
                      onChange={(e) => setMaxHeartRate(e.target.value)}
                      placeholder="Maximum BPM"
                      min="0"
                      max="250"
                      className={`w-full pl-20 pr-4 py-2 border rounded-lg transition-colors duration-300 text-center ${cardStyle.inputClassName}`}
                      style={cardStyle.inputStyle}
                    />
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label className={`block text-sm font-black tracking-wider mb-2 ${
                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  NOTES
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about your cardio session"
                  className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 text-center ${cardStyle.inputClassName}`}
                  style={{
                    minHeight: '80px',
                    ...cardStyle.inputStyle
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-4 mt-4 rounded-lg font-black tracking-wider text-lg transition-colors duration-300 flex items-center justify-center space-x-3 ${
              canSubmit
                ? cardStyle.buttonClassName
                : (vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gray-800 text-red-300/50 border-red-500/20 cursor-not-allowed clip-path-jagged-button'
                    : (isDarkMode ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'))
            }`}
            style={canSubmit ? cardStyle.buttonStyle : {}}
          >
            <Save size={24} />
            <span>LOG CARDIO</span>
          </button>
          
          <p className={`text-center text-sm ${
            vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
          }`}>
            * Required field
          </p>
        </div>
      </div>
      
      <div className={`text-center py-8 transition-colors duration-300 ${
        vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')
      }`}>
        <Calendar size={48} className="mx-auto mb-4 opacity-50" />
        <p className="font-medium mb-2">Track all your cardio sessions</p>
        <p className="text-sm">Record your runs, rides, swims and more to get a complete picture of your fitness journey</p>
      </div>
    </div>
  );
};

export default CardioSessionForm;