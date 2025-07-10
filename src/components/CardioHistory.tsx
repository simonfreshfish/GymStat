import React, { useState } from 'react';
import { CardioSession, DistanceUnit } from '../types/workout';
import { Activity, Calendar, Clock, Route, BarChart, Heart, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { formatDistance } from '../utils/unitConversion';
import { useVibe } from './VibeProvider';
import { useVisualSettings } from './VisualSettingsProvider';
import { getVibeClasses } from '../utils/vibeSettings';

interface CardioHistoryProps {
  cardioHistory: CardioSession[];
  isDarkMode: boolean;
  distanceUnit: DistanceUnit;
}

const CardioHistory: React.FC<CardioHistoryProps> = ({
  cardioHistory,
  isDarkMode,
  distanceUnit
}) => {
  const { vibeSettings } = useVibe();
  const { settings } = useVisualSettings();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  const isMobile = settings.screenOptimization === 'smartphone';
  const [expandedSessions, setExpandedSessions] = useState<{ [key: string]: boolean }>({});
  const [filterActivity, setFilterActivity] = useState<CardioSession['activityType'] | 'all'>('all');

  // Format distance display
  const displayDistance = (distance?: number) => {
    if (distance === undefined) return 'N/A';
    return `${formatDistance(distance, distanceUnit)} ${distanceUnit}`;
  };

  // Format duration display
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    
    return `${mins}m`;
  };

  // Get activity icon based on type
  const getActivityIcon = (type: CardioSession['activityType']) => {
    switch (type) {
      case 'running':
        return <span className={isMobile ? "text-lg" : "text-xl"}>🏃</span>;
      case 'cycling':
        return <span className={isMobile ? "text-lg" : "text-xl"}>🚴</span>;
      case 'swimming':
        return <span className={isMobile ? "text-lg" : "text-xl"}>🏊</span>;
      case 'rowing':
        return <span className={isMobile ? "text-lg" : "text-xl"}>🚣</span>;
      case 'elliptical':
        return <span className={isMobile ? "text-lg" : "text-xl"}>🏋️</span>;
      case 'stairmaster':
        return <span className={isMobile ? "text-lg" : "text-xl"}>🪜</span>;
      case 'hiking':
        return <span className={isMobile ? "text-lg" : "text-xl"}>🥾</span>;
      default:
        return <span className={isMobile ? "text-lg" : "text-xl"}>⭐</span>;
    }
  };

  // Get activity text color based on type and vibe
  const getActivityColor = (type: CardioSession['activityType']) => {
    if (vibeSettings.currentVibe === 'locked-in') {
      return 'text-red-400';
    }
    
    switch (type) {
      case 'running':
        return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'cycling':
        return isDarkMode ? 'text-blue-400' : 'text-blue-600';
      case 'swimming':
        return isDarkMode ? 'text-cyan-400' : 'text-cyan-600';
      case 'rowing':
        return isDarkMode ? 'text-indigo-400' : 'text-indigo-600';
      case 'elliptical':
        return isDarkMode ? 'text-purple-400' : 'text-purple-600';
      case 'stairmaster':
        return isDarkMode ? 'text-pink-400' : 'text-pink-600';
      case 'hiking':
        return isDarkMode ? 'text-amber-400' : 'text-amber-600';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  // Toggle session expansion
  const toggleSessionExpansion = (sessionId: string) => {
    setExpandedSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  // Filter sessions based on activity type
  const filteredSessions = filterActivity === 'all'
    ? cardioHistory
    : cardioHistory.filter(session => session.activityType === filterActivity);

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
    <div>
      {/* Filter Controls */}
      <div className={`mb-6 p-4 border rounded-lg transition-colors duration-300 ${cardStyle.className}`} style={cardStyle.style}>
        <div className="flex items-center space-x-3 mb-4">
          <Activity className={vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-blue-500'} size={24} />
          <h2 className={`text-xl font-black tracking-wider transition-colors duration-300 ${
            vibeSettings.currentVibe === 'locked-in' ? 'text-red-100' : (isDarkMode ? 'text-white' : 'text-gray-900')
          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            CARDIO HISTORY
          </h2>
          <span className={`text-xs px-2 py-1 rounded-full ${
            vibeSettings.currentVibe === 'locked-in'
              ? 'bg-red-900 text-red-200'
              : (isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800')
          } ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}`}
          style={vibeSettings.currentVibe === 'locked-in' ? {
            clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
          } : {}}>
            {filteredSessions.length} Sessions
          </span>
        </div>
        
        <label className={`block text-sm font-black tracking-wider mb-2 ${
          vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
        }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
          FILTER BY ACTIVITY
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setFilterActivity('all')}
            className={`p-3 border rounded-lg transition-colors duration-300 flex flex-col items-center space-y-1 ${
              filterActivity === 'all'
                ? (vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white border-white clip-path-jagged-button'
                    : (isDarkMode ? 'bg-blue-600 text-white border-blue-400' : 'bg-blue-100 text-blue-700 border-blue-300'))
                : (vibeSettings.currentVibe === 'locked-in'
                    ? 'bg-gray-800 text-red-300 hover:bg-gray-700 border-red-500/40 clip-path-jagged-button'
                    : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'))
            }`}
            style={filterActivity === 'all' ? cardStyle.buttonStyle : {}}
          >
            <Activity size={20} />
            <span className="text-sm font-medium whitespace-nowrap">All Types</span>
            {filterActivity === 'all' && <Check size={16} className="mt-1" />}
          </button>
          
          {['running', 'cycling', 'swimming', 'rowing', 'elliptical', 'stairmaster', 'hiking', 'other'].map((type) => {
            const activityType = type as CardioSession['activityType'];
            const count = cardioHistory.filter(s => s.activityType === activityType).length;
            
            if (count === 0) return null; // Don't show activity types with no sessions
            
            return (
              <button
                key={type}
                onClick={() => setFilterActivity(activityType)}
                className={`p-3 border rounded-lg transition-colors duration-300 flex flex-col items-center space-y-1 ${
                  filterActivity === activityType
                    ? (vibeSettings.currentVibe === 'locked-in'
                        ? 'bg-gradient-to-r from-red-600 to-red-800 text-white border-white clip-path-jagged-button'
                        : (isDarkMode ? 'bg-blue-600 text-white border-blue-400' : 'bg-blue-100 text-blue-700 border-blue-300'))
                    : (vibeSettings.currentVibe === 'locked-in'
                        ? 'bg-gray-800 text-red-300 hover:bg-gray-700 border-red-500/40 clip-path-jagged-button'
                        : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'))
                }`}
                style={filterActivity === activityType ? cardStyle.buttonStyle : {}}
              >
                {getActivityIcon(activityType)}
                <span className="text-sm font-medium whitespace-nowrap">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <span className="text-xs opacity-75">{count}</span>
                {filterActivity === activityType && <Check size={16} className="mt-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Session List */}
      {filteredSessions.length > 0 ? (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const isExpanded = expandedSessions[session.id] || false;
            
            return (
              <div key={session.id} className={`border p-4 rounded-lg transition-colors duration-300 ${cardStyle.className}`} style={cardStyle.style}>
                <button
                  onClick={() => toggleSessionExpansion(session.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-3 rounded-lg ${getActivityColor(session.activityType)} ${
                        vibeSettings.currentVibe === 'locked-in' 
                          ? 'bg-gray-900 clip-path-jagged-small' 
                          : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                      }`}
                      style={vibeSettings.currentVibe === 'locked-in' ? {
                        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                      } : {}}>
                        {getActivityIcon(session.activityType)}
                      </div>
                      
                      <div>
                        <div className={`font-black tracking-wider ${
                          vibeSettings.currentVibe === 'locked-in' ? 'text-red-100' : (isDarkMode ? 'text-white' : 'text-gray-900')
                        }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                          {session.activityType === 'other' && session.customActivityName 
                            ? session.customActivityName 
                            : session.activityType.charAt(0).toUpperCase() + session.activityType.slice(1)
                          }
                        </div>
                        <div className={`text-sm ${
                          vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                        }`}>
                          {session.date}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="text-right mr-3">
                        <div className={`font-black tracking-wider ${
                          vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                        }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                          {formatDuration(session.duration)}
                        </div>
                        <div className={`text-xs ${
                          vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                        }`}>
                          Duration
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={20} className={vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')} />
                      ) : (
                        <ChevronDown size={20} className={vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')} />
                      )}
                    </div>
                  </div>
                  
                  {/* Preview Stats - Always visible */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {session.distance !== undefined && (
                      <div className={`text-center p-2 rounded-lg ${
                        vibeSettings.currentVibe === 'locked-in' 
                          ? 'bg-black border border-red-500/40 clip-path-jagged-small' 
                          : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                      }`}
                      style={vibeSettings.currentVibe === 'locked-in' ? {
                        clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                      } : {}}>
                        <div className="flex items-center justify-center space-x-1">
                          <Route size={14} className={getActivityColor(session.activityType)} />
                          <span className={`font-black tracking-wider text-sm ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : getActivityColor(session.activityType)
                          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                            {displayDistance(session.distance)}
                          </span>
                        </div>
                        <div className={`text-xs ${
                          vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                        }`}>
                          Distance
                        </div>
                      </div>
                    )}
                    
                    <div className={`text-center p-2 rounded-lg ${
                      vibeSettings.currentVibe === 'locked-in' 
                        ? 'bg-black border border-red-500/40 clip-path-jagged-small' 
                        : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                    }`}
                    style={vibeSettings.currentVibe === 'locked-in' ? {
                      clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                    } : {}}>
                      <div className="flex items-center justify-center space-x-1">
                        <Clock size={14} className={getActivityColor(session.activityType)} />
                        <span className={`font-black tracking-wider text-sm ${
                          vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : getActivityColor(session.activityType)
                        }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                          {formatDuration(session.duration)}
                        </span>
                      </div>
                      <div className={`text-xs ${
                        vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                      }`}>
                        Duration
                      </div>
                    </div>
                    
                    {session.calories !== undefined && (
                      <div className={`text-center p-2 rounded-lg ${
                        vibeSettings.currentVibe === 'locked-in' 
                          ? 'bg-black border border-red-500/40 clip-path-jagged-small' 
                          : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                      }`}
                      style={vibeSettings.currentVibe === 'locked-in' ? {
                        clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                      } : {}}>
                        <div className="flex items-center justify-center space-x-1">
                          <BarChart size={14} className={getActivityColor(session.activityType)} />
                          <span className={`font-black tracking-wider text-sm ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : getActivityColor(session.activityType)
                          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                            {session.calories}
                          </span>
                        </div>
                        <div className={`text-xs ${
                          vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                        }`}>
                          Calories
                        </div>
                      </div>
                    )}
                    
                    {/* If we don't have distance or calories, show heart rate if available */}
                    {!session.distance && !session.calories && session.heartRate?.average && (
                      <div className={`text-center p-2 rounded-lg ${
                        vibeSettings.currentVibe === 'locked-in' 
                          ? 'bg-black border border-red-500/40 clip-path-jagged-small' 
                          : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                      }`}
                      style={vibeSettings.currentVibe === 'locked-in' ? {
                        clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)'
                      } : {}}>
                        <div className="flex items-center justify-center space-x-1">
                          <Heart size={14} className={getActivityColor(session.activityType)} />
                          <span className={`font-black tracking-wider text-sm ${
                            vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : getActivityColor(session.activityType)
                          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                            {session.heartRate.average} BPM
                          </span>
                        </div>
                        <div className={`text-xs ${
                          vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                        }`}>
                          Avg Heart Rate
                        </div>
                      </div>
                    )}
                  </div>
                </button>
                
                {/* Expanded Details */}
                {isExpanded && (
                  <div className={`mt-4 border-t pt-4 ${
                    vibeSettings.currentVibe === 'locked-in' ? 'border-red-500/40' : (isDarkMode ? 'border-gray-700' : 'border-gray-200')
                  }`}>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Heart Rate Section */}
                      {session.heartRate && (session.heartRate.average || session.heartRate.max) && (
                        <div className={`p-3 rounded-lg ${
                          vibeSettings.currentVibe === 'locked-in' 
                            ? 'bg-black border border-red-500/40 clip-path-jagged-small' 
                            : (isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-200')
                        }`}
                        style={vibeSettings.currentVibe === 'locked-in' ? {
                          clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                        } : {}}>
                          <div className="flex items-center space-x-2 mb-2">
                            <Heart className={vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-red-500'} size={18} />
                            <h4 className={`font-black tracking-wider ${
                              vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-white' : 'text-gray-900')
                            }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                              HEART RATE
                            </h4>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {session.heartRate.average && (
                              <div className="text-center">
                                <div className={`text-lg font-black tracking-wider ${
                                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-red-500'
                                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                                  {session.heartRate.average}
                                </div>
                                <div className={`text-xs ${
                                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                                }`}>
                                  AVG BPM
                                </div>
                              </div>
                            )}
                            
                            {session.heartRate.max && (
                              <div className="text-center">
                                <div className={`text-lg font-black tracking-wider ${
                                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : 'text-red-500'
                                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                                  {session.heartRate.max}
                                </div>
                                <div className={`text-xs ${
                                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                                }`}>
                                  MAX BPM
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Notes Section */}
                      {session.notes && (
                        <div className={`p-3 rounded-lg ${
                          vibeSettings.currentVibe === 'locked-in' 
                            ? 'bg-black border border-red-500/40 clip-path-jagged-small' 
                            : (isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-200')
                        }`}
                        style={vibeSettings.currentVibe === 'locked-in' ? {
                          clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                        } : {}}>
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className={vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-blue-400' : 'text-blue-600')} size={18} />
                            <h4 className={`font-black tracking-wider ${
                              vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-white' : 'text-gray-900')
                            }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                              NOTES
                            </h4>
                          </div>
                          
                          <div className={`p-3 rounded-lg ${
                            vibeSettings.currentVibe === 'locked-in' 
                              ? 'bg-gray-900/50' 
                              : (isDarkMode ? 'bg-gray-800' : 'bg-white')
                          }`}>
                            <p className={`text-sm whitespace-pre-wrap ${
                              vibeSettings.currentVibe === 'locked-in' ? 'text-red-200' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                            }`}>
                              {session.notes}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Performance Metrics */}
                      {(session.distance !== undefined || session.calories !== undefined) && (
                        <div className={`p-3 rounded-lg ${
                          vibeSettings.currentVibe === 'locked-in' 
                            ? 'bg-black border border-red-500/40 clip-path-jagged-small' 
                            : (isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-200')
                        }`}
                        style={vibeSettings.currentVibe === 'locked-in' ? {
                          clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
                        } : {}}>
                          <div className="flex items-center space-x-2 mb-2">
                            <BarChart className={vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-green-400' : 'text-green-600')} size={18} />
                            <h4 className={`font-black tracking-wider ${
                              vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-white' : 'text-gray-900')
                            }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                              PERFORMANCE
                            </h4>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {session.distance !== undefined && (
                              <div className="text-center">
                                <div className={`text-lg font-black tracking-wider ${
                                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-blue-400' : 'text-blue-600')
                                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                                  {displayDistance(session.distance)}
                                </div>
                                <div className={`text-xs ${
                                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                                }`}>
                                  DISTANCE
                                </div>
                              </div>
                            )}
                            
                            {session.calories !== undefined && (
                              <div className="text-center">
                                <div className={`text-lg font-black tracking-wider ${
                                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-orange-400' : 'text-orange-600')
                                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                                  {session.calories}
                                </div>
                                <div className={`text-xs ${
                                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                                }`}>
                                  CALORIES BURNED
                                </div>
                              </div>
                            )}
                            
                            {session.distance !== undefined && session.duration > 0 && (
                              <div className="text-center">
                                <div className={`text-lg font-black tracking-wider ${
                                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-purple-400' : 'text-purple-600')
                                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                                  {(session.distance / (session.duration / 60)).toFixed(2)} {distanceUnit}/h
                                </div>
                                <div className={`text-xs ${
                                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                                }`}>
                                  AVG SPEED
                                </div>
                              </div>
                            )}
                            
                            {session.distance !== undefined && session.duration > 0 && (
                              <div className="text-center">
                                <div className={`text-lg font-black tracking-wider ${
                                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-teal-400' : 'text-teal-600')
                                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                                  {((session.duration / 60) / session.distance).toFixed(2)} min/{distanceUnit}
                                </div>
                                <div className={`text-xs ${
                                  vibeSettings.currentVibe === 'locked-in' ? 'text-red-400' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                                }`}>
                                  AVG PACE
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`text-center py-12 transition-colors duration-300 ${
          vibeSettings.currentVibe === 'locked-in' ? 'text-red-300' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
        }`}>
          <div className="text-6xl mb-4">🏃‍♀️</div>
          <h3 className="text-lg font-medium mb-2">No cardio sessions found</h3>
          <p className="text-sm">
            {filterActivity === 'all' 
              ? "Start logging your cardio workouts to see them here!"
              : `No ${filterActivity} sessions found. Try a different activity type or log your first ${filterActivity} session!`}
          </p>
        </div>
      )}
    </div>
  );
};

export default CardioHistory;