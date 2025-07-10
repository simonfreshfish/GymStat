import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Share2, Activity, Clock, Route, BarChart, Heart, Calendar, Trophy, Target, Zap } from 'lucide-react';
import { CardioSession, DistanceUnit } from '../types/workout';
import { useVibe } from './VibeProvider';
import { useVisualSettings } from './VisualSettingsProvider';
import { getVibeClasses } from '../utils/vibeSettings';
import { calculateCardioWrappedStats, formatDuration, getActivityIcon } from '../utils/cardioWrappedCalculations';
import { getMultipleTimeEquivalents } from '../utils/timeEquivalents';
import { getMultipleDistanceEquivalents, formatDistanceEquivalent } from '../utils/distanceEquivalents';
import { formatDistance } from '../utils/unitConversion';

interface CardioWrappedProps {
  cardioHistory: CardioSession[];
  isDarkMode: boolean;
  distanceUnit: DistanceUnit;
}

type TimePeriod = 'month' | 'year';

const CardioWrapped: React.FC<CardioWrappedProps> = ({
  cardioHistory,
  isDarkMode,
  distanceUnit
}) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('year');
  const { settings } = useVisualSettings();
  const { vibeSettings } = useVibe();
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);
  const isMobile = settings.screenOptimization === 'smartphone';
  
  // Calculate cardio stats
  const stats = calculateCardioWrappedStats(cardioHistory, timePeriod, distanceUnit);
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
  
  const periodLabel = timePeriod === 'year' ? `${currentYear}` : `${currentMonth} ${currentYear}`;
  const periodTitle = timePeriod === 'year' ? 'This Year' : 'This Month';

  const cards = [
    // Welcome Card
    {
      id: 'welcome',
      title: `Your ${periodLabel} GymStat Cardio Wrapped`,
      content: (
        <div className="text-center space-y-4">
          <div className={`${isMobile ? 'text-6xl' : 'text-8xl'}`}>🏃‍♀️</div>
          <div className="space-y-2">
            <h2 className={`
              font-black tracking-wider transition-colors duration-300
              ${isMobile ? 'text-xl' : 'text-3xl'}
              ${vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')}
            `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
              YOUR {periodTitle.toUpperCase()} IN CARDIO FITNESS
            </h2>
            <p className={`
              transition-colors duration-300 font-medium
              ${isMobile ? 'text-base' : 'text-lg'}
              ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
            `}>
              Let's explore your cardio journey so far!
            </p>
          </div>
          <div className={`
            inline-flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-300 font-black tracking-wider
            ${vibeClasses.gradient || (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700')}
            ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-pill' : ''}
          `} style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif', 
            letterSpacing: '0.1em',
            ...(vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {})
          }}>
            <Calendar size={16} />
            <span>{periodLabel.toUpperCase()} CARDIO REVIEW</span>
          </div>
        </div>
      )
    },

    // Total Time Card
    {
      id: 'total-time',
      title: 'Your Cardio Time',
      content: (
        <div className="text-center space-y-4">
          <div className={`${isMobile ? 'text-5xl' : 'text-6xl'}`}>⏱️</div>
          <div className="space-y-3">
            <div>
              <div className={`
                font-black tracking-wider bg-gradient-to-r from-blue-500 to-green-600 bg-clip-text text-transparent
                ${isMobile ? 'text-3xl' : 'text-5xl'}
              `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                {formatDuration(stats.totalDuration)}
              </div>
              <div className={`
                font-black tracking-wider transition-colors duration-300
                ${isMobile ? 'text-base' : 'text-xl'}
                ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
              `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                TOTAL CARDIO TIME {periodTitle.toUpperCase()}
              </div>
            </div>
            
            <div className={`
              p-3 rounded-lg transition-colors duration-300
              ${vibeClasses.card || (isDarkMode ? 'bg-gray-800' : 'bg-gray-100')}
              ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}
            `} style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}>
              <p className={`
                transition-colors duration-300 font-medium mb-2
                ${isMobile ? 'text-sm' : 'text-base'}
                ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-700')}
              `}>
                That's equivalent to:
              </p>
              <ul className="space-y-2">
                {stats.totalDuration >= 60 && (
                  <li className={`
                    transition-colors duration-300 font-medium text-sm
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-700')}
                  `}>
                    • <span className={`font-black ${vibeClasses.accent || 'text-green-600'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                      {Math.floor(stats.totalDuration / 60)} hour{Math.floor(stats.totalDuration / 60) !== 1 ? 's' : ''} {stats.totalDuration % 60 > 0 ? `and ${stats.totalDuration % 60} minutes` : ''}
                    </span> of continuous exercise
                  </li>
                )}
                
                {/* Historical and entertainment time equivalents */}
                {getMultipleTimeEquivalents(stats.totalDuration, 3).map((equivalent, index) => (
                  <li key={index} className={`
                    transition-colors duration-300 font-medium text-sm
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-700')}
                  `}>
                    • <span className={`font-black ${vibeClasses.accent || 'text-blue-600'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                      {equivalent.name}
                    </span>
                    {equivalent.description && ` (${equivalent.description})`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // Session Count Card
    {
      id: 'session-count',
      title: 'Cardio Consistency',
      content: (
        <div className="text-center space-y-4">
          <div className={`${isMobile ? 'text-5xl' : 'text-6xl'}`}>🔥</div>
          <div className="space-y-3">
            <div>
              <div className={`
                font-black tracking-wider bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent
                ${isMobile ? 'text-3xl' : 'text-5xl'}
              `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                {cardioHistory.length}
              </div>
              <div className={`
                font-black tracking-wider transition-colors duration-300
                ${isMobile ? 'text-base' : 'text-xl'}
                ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
              `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                CARDIO SESSIONS COMPLETED
              </div>
            </div>
            
            <div className={`
              p-3 rounded-lg transition-colors duration-300
              ${vibeClasses.card || (isDarkMode ? 'bg-gray-800' : 'bg-gray-100')}
              ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}
            `} style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className={`
                    font-black tracking-wider text-orange-600
                    ${isMobile ? 'text-lg' : 'text-2xl'}
                  `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {stats.streakData.longestStreak}
                  </div>
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-xs' : 'text-sm'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                  `}>LONGEST STREAK</div>
                </div>
                <div>
                  <div className={`
                    font-black tracking-wider text-green-600
                    ${isMobile ? 'text-lg' : 'text-2xl'}
                  `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {timePeriod === 'year' ? Math.round(cardioHistory.length / 12) || 1 : cardioHistory.length}
                  </div>
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-xs' : 'text-sm'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                  `}>{timePeriod === 'year' ? 'AVG PER MONTH' : 'THIS MONTH'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Favorite Activity Card
    {
      id: 'favorite-activity',
      title: 'Your Favorite Cardio',
      content: (
        <div className="text-center space-y-4">
          <div className={`${isMobile ? 'text-5xl' : 'text-6xl'}`}>❤️</div>
          <div className="space-y-3">
            {stats.favoriteActivity ? (
              <>
                <div>
                  <div className={`
                    font-black tracking-wider transition-colors duration-300 flex items-center justify-center space-x-2
                    ${isMobile ? 'text-xl' : 'text-3xl'}
                    ${vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')}
                  `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    <span className={isMobile ? "text-2xl" : "text-3xl"}>{stats.favoriteActivity.icon}</span>
                    <span>
                      {stats.favoriteActivity.customName || 
                       stats.favoriteActivity.name.charAt(0).toUpperCase() + stats.favoriteActivity.name.slice(1)}
                    </span>
                  </div>
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-sm' : 'text-lg'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
                  `}>
                    was your go-to cardio workout
                  </div>
                </div>
                
                <div className={`
                  p-3 rounded-lg transition-colors duration-300
                  ${vibeClasses.card || (isDarkMode ? 'bg-gray-800' : 'bg-gray-100')}
                  ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}
                `} style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
                } : {}}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className={`
                        font-black tracking-wider bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent
                        ${isMobile ? 'text-2xl' : 'text-4xl'}
                      `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                        {stats.favoriteActivity.count}
                      </div>
                      <div className={`
                        transition-colors duration-300 font-medium
                        ${isMobile ? 'text-sm' : 'text-lg'}
                        ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
                      `}>
                        times completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`
                        font-black tracking-wider bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent
                        ${isMobile ? 'text-2xl' : 'text-4xl'}
                      `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                        {formatDuration(stats.favoriteActivity.totalDuration)}
                      </div>
                      <div className={`
                        transition-colors duration-300 font-medium
                        ${isMobile ? 'text-sm' : 'text-lg'}
                        ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
                      `}>
                        total time
                      </div>
                    </div>
                  </div>
                </div>

                {stats.activityBreakdown.length > 1 && (
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-xs' : 'text-sm'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                  `}>
                    Your second favorite: {stats.activityBreakdown[1].customName || 
                    stats.activityBreakdown[1].name.charAt(0).toUpperCase() + stats.activityBreakdown[1].name.slice(1)} ({stats.activityBreakdown[1].count} times)
                  </div>
                )}
              </>
            ) : (
              <div className={`
                transition-colors duration-300 font-medium
                ${isMobile ? 'text-sm' : 'text-lg'}
                ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
              `}>
                Log more cardio sessions to find your favorite activity!
              </div>
            )}
          </div>
        </div>
      )
    },

    // Distance Card
    {
      id: 'distance',
      title: 'Distance Champion',
      content: (
        <div className="text-center space-y-4">
          <div className={`${isMobile ? 'text-5xl' : 'text-6xl'}`}>🏅</div>
          <div className="space-y-3">
            {stats.totalDistance !== null ? (
              <>
                <div>
                  <div className={`
                    font-black tracking-wider transition-colors duration-300
                    ${isMobile ? 'text-xl' : 'text-3xl'}
                    ${vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')}
                  `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    TOTAL DISTANCE
                  </div>
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-sm' : 'text-lg'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
                  `}>
                    You've covered an impressive distance!
                  </div>
                </div>
                
                <div className={`
                  p-3 rounded-lg transition-colors duration-300
                  ${vibeClasses.card || (isDarkMode ? 'bg-gray-800' : 'bg-gray-100')}
                  ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}
                `} style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
                } : {}}>
                  <div className={`
                    font-black tracking-wider bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent
                    ${isMobile ? 'text-2xl' : 'text-4xl'}
                  `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {formatDistance(stats.totalDistance, distanceUnit)} {distanceUnit}
                  </div>
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-sm' : 'text-lg'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
                  `}>
                    total distance traveled 🏁
                  </div>
                  <div className={`
                    mt-3 transition-colors duration-300 font-medium
                    ${isMobile ? 'text-xs' : 'text-sm'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                  `}>
                    {stats.furthestDistance && (
                      <>
                        Longest single session: {formatDistance(stats.furthestDistance.distance, distanceUnit)} {distanceUnit} 
                        ({stats.furthestDistance.customName || 
                          stats.furthestDistance.name.charAt(0).toUpperCase() + stats.furthestDistance.name.slice(1)})
                      </>
                    )}
                  </div>

                  {/* Distance Equivalents Section */}
                  <div className={`
                    mt-4 pt-3 border-t transition-colors duration-300
                    ${vibeSettings.currentVibe === 'locked-in' ? 'border-red-500/40' : (isDarkMode ? 'border-gray-700' : 'border-gray-300')}
                  `}>
                    <p className={`
                      transition-colors duration-300 font-medium mb-2
                      ${isMobile ? 'text-sm' : 'text-base'}
                      ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-700')}
                    `}>
                      Your {formatDistance(stats.totalDistance, distanceUnit)} {distanceUnit} is equivalent to:
                    </p>
                    <ul className="space-y-2">
                      {getMultipleDistanceEquivalents(stats.totalDistance, distanceUnit, 3).map((equivalent, index) => (
                        <li key={index} className={`
                          transition-colors duration-300 font-medium text-sm
                          ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-700')}
                        `}>
                          • <span className={`font-black ${vibeClasses.accent || 'text-orange-600'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                            {formatDistanceEquivalent(stats.totalDistance, equivalent, distanceUnit)}
                          </span>
                          {equivalent.description && ` (${equivalent.description})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className={`
                transition-colors duration-300 font-medium
                ${isMobile ? 'text-sm' : 'text-lg'}
                ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
              `}>
                No distance data recorded yet. Track distance in your cardio sessions!
              </div>
            )}
          </div>
        </div>
      )
    },

    // Calories Card
    {
      id: 'calories',
      title: 'Calorie Crusher',
      content: (
        <div className="text-center space-y-4">
          <div className={`${isMobile ? 'text-5xl' : 'text-6xl'}`}>🔥</div>
          <div className="space-y-3">
            {stats.totalCalories !== null ? (
              <>
                <div>
                  <div className={`
                    font-black tracking-wider transition-colors duration-300
                    ${isMobile ? 'text-xl' : 'text-3xl'}
                    ${vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')}
                  `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    CALORIE BURNER
                  </div>
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-sm' : 'text-lg'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
                  `}>
                    You've burned some serious calories!
                  </div>
                </div>
                
                <div className={`
                  p-3 rounded-lg transition-colors duration-300
                  ${vibeClasses.card || (isDarkMode ? 'bg-gray-800' : 'bg-gray-100')}
                  ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}
                `} style={vibeSettings.currentVibe === 'locked-in' ? {
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
                } : {}}>
                  <div className={`
                    font-black tracking-wider bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent
                    ${isMobile ? 'text-2xl' : 'text-4xl'}
                  `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {stats.totalCalories.toLocaleString()} calories
                  </div>
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-sm' : 'text-lg'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
                  `}>
                    burned through cardio 💪
                  </div>
                  <div className={`
                    mt-3 transition-colors duration-300 font-medium
                    ${isMobile ? 'text-xs' : 'text-sm'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                  `}>
                    {stats.mostCaloriesBurned && (
                      <>
                        Highest calorie session: {stats.mostCaloriesBurned.calories} calories
                        ({stats.mostCaloriesBurned.customName || 
                          stats.mostCaloriesBurned.name.charAt(0).toUpperCase() + stats.mostCaloriesBurned.name.slice(1)})
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className={`
                transition-colors duration-300 font-medium
                ${isMobile ? 'text-sm' : 'text-lg'}
                ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
              `}>
                No calorie data recorded yet. Track calories in your cardio sessions!
              </div>
            )}
          </div>
        </div>
      )
    },

    // Summary Card
    {
      id: 'summary',
      title: `${periodLabel} - What a ${timePeriod === 'year' ? 'Year' : 'Month'} of Cardio!`,
      content: (
        <div className="text-center space-y-4">
          <div className={`${isMobile ? 'text-5xl' : 'text-6xl'}`}>🌟</div>
          <div className="space-y-3">
            <div>
              <h2 className={`
                font-black tracking-wider transition-colors duration-300
                ${isMobile ? 'text-lg' : 'text-2xl'}
                ${vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')}
              `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                YOU'VE HAD AN AMAZING CARDIO JOURNEY!
              </h2>
              <p className={`
                transition-colors duration-300 font-medium
                ${isMobile ? 'text-sm' : 'text-lg'}
                ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
              `}>
                {timePeriod === 'year' 
                  ? `Keep up the momentum for ${currentYear + 1}!`
                  : `Keep up the good work for the rest of ${currentYear}!`
                }
              </p>
            </div>
            
            <div className={`
              grid grid-cols-2 gap-2 p-3 rounded-lg transition-colors duration-300
              ${vibeClasses.card || (isDarkMode ? 'bg-gray-800' : 'bg-gray-100')}
              ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}
            `} style={vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {}}>
              <div className="text-center">
                <div className={`
                  font-black tracking-wider text-blue-600
                  ${isMobile ? 'text-sm' : 'text-xl'}
                `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  {formatDuration(stats.totalDuration)}
                </div>
                <div className={`
                  transition-colors duration-300 font-medium
                  ${isMobile ? 'text-xs' : 'text-xs'}
                  ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                `}>TOTAL TIME</div>
              </div>
              <div className="text-center">
                <div className={`
                  font-black tracking-wider text-green-600
                  ${isMobile ? 'text-sm' : 'text-xl'}
                `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  {stats.totalDistance !== null 
                    ? `${formatDistance(stats.totalDistance, distanceUnit)} ${distanceUnit}`
                    : "N/A"}
                </div>
                <div className={`
                  transition-colors duration-300 font-medium
                  ${isMobile ? 'text-xs' : 'text-xs'}
                  ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                `}>DISTANCE</div>
              </div>
              <div className="text-center">
                <div className={`
                  font-black tracking-wider text-purple-600
                  ${isMobile ? 'text-sm' : 'text-xl'}
                `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  {stats.totalCalories !== null 
                    ? stats.totalCalories.toLocaleString()
                    : "N/A"}
                </div>
                <div className={`
                  transition-colors duration-300 font-medium
                  ${isMobile ? 'text-xs' : 'text-xs'}
                  ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                `}>CALORIES</div>
              </div>
              <div className="text-center">
                <div className={`
                  font-black tracking-wider text-orange-600
                  ${isMobile ? 'text-sm' : 'text-xl'}
                `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  {cardioHistory.length}
                </div>
                <div className={`
                  transition-colors duration-300 font-medium
                  ${isMobile ? 'text-xs' : 'text-xs'}
                  ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                `}>SESSIONS</div>
              </div>
            </div>

            {/* Activity Breakdown */}
            {stats.activityBreakdown.length > 0 && (
              <div className={`
                p-3 rounded-lg transition-colors duration-300 text-left
                ${vibeClasses.card || (isDarkMode ? 'bg-gray-800' : 'bg-gray-100')}
                ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}
              `} style={vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
              } : {}}>
                <p className={`
                  transition-colors duration-300 font-medium mb-2 text-center
                  ${isMobile ? 'text-sm' : 'text-base'}
                  ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-700')}
                `}>
                  Your activity breakdown:
                </p>
                <ul className="space-y-1">
                  {stats.activityBreakdown.slice(0, 3).map((activity, index) => (
                    <li key={index} className={`
                      transition-colors duration-300 font-medium text-sm
                      ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-700')}
                    `}>
                      • {activity.icon} <span className={`font-black ${vibeClasses.accent || 'text-blue-600'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                        {activity.customName || (activity.name.charAt(0).toUpperCase() + activity.name.slice(1))}
                      </span>: {activity.count} session{activity.count !== 1 ? 's' : ''} ({formatDuration(activity.totalDuration)})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={`
              inline-flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-300 font-black tracking-wider
              ${vibeClasses.gradient || (isDarkMode ? 'bg-gradient-to-r from-purple-900 to-pink-900 text-white' : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700')}
              ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-pill' : ''}
            `} style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif', 
              letterSpacing: '0.1em',
              ...(vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
              } : {})
            }}>
              <Trophy size={16} />
              <span className={`${isMobile ? 'text-sm' : ''}`}>
                CARDIO CHAMPION {timePeriod === 'year' ? currentYear : currentMonth.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShare = async () => {
    const text = `My ${periodLabel} GymStat Cardio Wrapped: ${formatDuration(stats.totalDuration)} of cardio, ${cardioHistory.length} sessions completed! 🏃‍♀️`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${periodLabel} GymStat Cardio Wrapped`,
          text: `Check out my cardio journey! I spent ${formatDuration(stats.totalDuration)} doing cardio and completed ${cardioHistory.length} sessions ${timePeriod === 'year' ? 'this year' : 'this month'}! 🏃‍♀️`,
          url: window.location.href
        });
      } catch (error) {
        try {
          await navigator.clipboard.writeText(text);
          alert('Stats copied to clipboard!');
        } catch (clipboardError) {
          alert(`Share your stats: ${text}`);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('Stats copied to clipboard!');
      } catch (clipboardError) {
        alert(`Share your stats: ${text}`);
      }
    }
  };

  if (cardioHistory.length === 0) {
    return (
      <div className={`px-4 py-8 ${isMobile ? 'safe-area-left safe-area-right' : ''}`}>
        {/* Time Period Toggle */}
        <div className={`
          flex items-center justify-center mb-6 p-1 rounded-lg border-2 max-w-xs mx-auto
          ${vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200')}
          ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}
        `} style={vibeSettings.currentVibe === 'locked-in' ? {
          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
        } : {}}>
          <button
            onClick={() => setTimePeriod('month')}
            className={`
              flex-1 py-3 px-4 rounded-lg font-black tracking-wider transition-all duration-300 flex items-center justify-center space-x-2
              ${timePeriod === 'month'
                ? (vibeClasses.button || 'bg-green-600 text-white shadow-lg')
                : (vibeClasses.text || (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'))
              }
              ${vibeSettings.currentVibe === 'locked-in' && timePeriod === 'month' ? 'clip-path-jagged-button' : ''}
            `}
            style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif', 
              letterSpacing: '0.1em',
              ...(vibeSettings.currentVibe === 'locked-in' && timePeriod === 'month' ? {
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
              } : {})
            }}
          >
            <Clock size={16} />
            <span className={isMobile ? 'text-xs' : 'text-sm'}>THIS MONTH</span>
          </button>
          <button
            onClick={() => setTimePeriod('year')}
            className={`
              flex-1 py-3 px-4 rounded-lg font-black tracking-wider transition-all duration-300 flex items-center justify-center space-x-2
              ${timePeriod === 'year'
                ? (vibeClasses.button || 'bg-green-600 text-white shadow-lg')
                : (vibeClasses.text || (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'))
              }
              ${vibeSettings.currentVibe === 'locked-in' && timePeriod === 'year' ? 'clip-path-jagged-button' : ''}
            `}
            style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif', 
              letterSpacing: '0.1em',
              ...(vibeSettings.currentVibe === 'locked-in' && timePeriod === 'year' ? {
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
              } : {})
            }}
          >
            <Calendar size={16} />
            <span className={isMobile ? 'text-xs' : 'text-sm'}>THIS YEAR</span>
          </button>
        </div>

        <div className={`
          text-center py-12 transition-colors duration-300
          ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
        `}>
          <div className={`mb-6 ${isMobile ? 'text-6xl' : 'text-8xl'}`}>🏃‍♀️</div>
          <h2 className={`
            font-black tracking-wider mb-4 transition-colors duration-300
            ${isMobile ? 'text-xl' : 'text-2xl'}
            ${vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')}
          `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            YOUR {periodLabel.toUpperCase()} GYMSTAT CARDIO WRAPPED
          </h2>
          <p className={`mb-2 font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>
            Start logging cardio sessions to see your amazing {timePeriod === 'year' ? 'year' : 'month'} in cardio fitness!
          </p>
          <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'}`}>
            Complete and log your first cardio workout to unlock your personalized cardio wrapped experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      py-0 flex-1 overflow-hidden
      ${isMobile ? 'px-2 safe-area-left safe-area-right' : 'px-4 max-w-md mx-auto'}
    `}>
      {/* Time Period Toggle */}
      <div className={`
        flex items-center justify-center mb-6 p-1 rounded-lg border-2 max-w-xs mx-auto
        ${vibeClasses.card || (isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200')}
        ${vibeClasses.glow || ''}
        ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}
      `}
      style={vibeSettings.currentVibe === 'locked-in' ? {
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
      } : {}}>
        <button
          onClick={() => setTimePeriod('month')}
          className={`
            flex-1 py-3 px-4 rounded-lg font-black tracking-wider transition-all duration-300 flex items-center justify-center space-x-2
            ${timePeriod === 'month'
              ? (vibeClasses.button || 'bg-green-600 text-white shadow-lg')
              : (vibeClasses.text || (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'))
            }
            ${vibeSettings.currentVibe === 'locked-in' && timePeriod === 'month' ? 'clip-path-jagged-button' : ''}
          `}
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif', 
            letterSpacing: '0.1em',
            ...(vibeSettings.currentVibe === 'locked-in' && timePeriod === 'month' ? {
              clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
            } : {})
          }}
        >
          <Clock size={16} />
          <span className={isMobile ? 'text-xs' : 'text-sm'}>THIS MONTH</span>
        </button>
        <button
          onClick={() => setTimePeriod('year')}
          className={`
            flex-1 py-3 px-4 rounded-lg font-black tracking-wider transition-all duration-300 flex items-center justify-center space-x-2
            ${timePeriod === 'year'
              ? (vibeClasses.button || 'bg-green-600 text-white shadow-lg')
              : (vibeClasses.text || (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'))
            }
            ${vibeSettings.currentVibe === 'locked-in' && timePeriod === 'year' ? 'clip-path-jagged-button' : ''}
          `}
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif', 
            letterSpacing: '0.1em',
            ...(vibeSettings.currentVibe === 'locked-in' && timePeriod === 'year' ? {
              clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
            } : {})
          }}
        >
          <Calendar size={16} />
          <span className={isMobile ? 'text-xs' : 'text-sm'}>THIS YEAR</span>
        </button>
      </div>

      {/* Card Container */}
      <div className={`
        relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 mx-auto
        ${isMobile ? 'max-w-sm' : 'max-w-md'}
        ${vibeClasses.card || (isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' 
          : 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
        )}
        ${vibeClasses.glow || ''}
        ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged' : ''}
      `} style={{ 
        minHeight: isMobile ? '500px' : '600px',
        ...(vibeSettings.currentVibe === 'locked-in' ? {
          clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)'
        } : {})
      }}>
        
        {/* Card Content */}
        <div className={`p-6 h-full flex flex-col justify-between ${isMobile ? 'min-h-[500px]' : 'min-h-[600px]'}`}>
          <div className="flex-1 flex flex-col justify-center">
            {cards[currentCard].content}
          </div>
          
          {/* Card Title */}
          <div className="text-center mt-4">
            <h3 className={`
              font-black tracking-wider transition-colors duration-300
              ${isMobile ? 'text-base' : 'text-lg'}
              ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
            `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
              {cards[currentCard].title}
            </h3>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className={`
          absolute inset-0 pointer-events-none
          ${vibeClasses.gradient || (isDarkMode 
            ? 'bg-gradient-to-t from-green-900/20 via-transparent to-blue-900/20' 
            : 'bg-gradient-to-t from-green-100/30 via-transparent to-blue-100/30'
          )}
        `} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prevCard}
          disabled={currentCard === 0}
          className={`
            p-3 rounded-full transition-all duration-300 shadow-lg touch-target
            ${currentCard === 0
              ? (isDarkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-200 text-gray-400')
              : (vibeClasses.card || (isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'))
            }
            ${vibeSettings.currentVibe === 'locked-in' && currentCard !== 0 ? 'clip-path-jagged-small' : ''}
          `}
          style={vibeSettings.currentVibe === 'locked-in' && currentCard !== 0 ? {
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
          } : {}}
        >
          <ChevronLeft size={isMobile ? 20 : 24} />
        </button>

        {/* Progress Dots */}
        <div className="flex space-x-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCard(index)}
              className={`
                rounded-full transition-all duration-300 touch-target
                ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}
                ${index === currentCard
                  ? (vibeClasses.accent || 'bg-green-500 scale-125')
                  : (isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400')
                }
                ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}
              `}
              style={vibeSettings.currentVibe === 'locked-in' ? {
                clipPath: 'polygon(0 0, calc(100% - 1px) 0, 100% 1px, 100% calc(100% - 1px), calc(100% - 1px) 100%, 1px 100%, 0 calc(100% - 1px), 0 1px)'
              } : {}}
            />
          ))}
        </div>

        <button
          onClick={currentCard === cards.length - 1 ? handleShare : nextCard}
          className={`
            p-3 rounded-full transition-all duration-300 shadow-lg touch-target
            ${currentCard === cards.length - 1
              ? (vibeClasses.button || 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600')
              : (vibeClasses.card || (isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'))
            }
            ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-small' : ''}
          `}
          style={vibeSettings.currentVibe === 'locked-in' ? {
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)'
          } : {}}
        >
          {currentCard === cards.length - 1 ? <Share2 size={isMobile ? 20 : 24} /> : <ChevronRight size={isMobile ? 20 : 24} />}
        </button>
      </div>

      {/* Card Counter */}
      <div className={`
        text-center mt-4 transition-colors duration-300 font-medium
        ${isMobile ? 'text-xs' : 'text-sm'}
        ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
      `}>
        {currentCard + 1} of {cards.length}
      </div>
    </div>
  );
};

export default CardioWrapped;