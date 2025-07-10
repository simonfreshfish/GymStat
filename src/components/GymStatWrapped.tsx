import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Share2, Trophy, TrendingUp, Calendar, Target, Zap, Clock } from 'lucide-react';
import { WorkoutLog, WorkoutDay, WeightUnit, CardioSession, DistanceUnit } from '../types/workout';
import { calculateWrappedStats } from '../utils/wrappedCalculations';
import { convertWeight, formatWeight, getUnitLabel } from '../utils/unitConversion';
import { useVibe } from './VibeProvider';
import { useVisualSettings } from './VisualSettingsProvider';
import { useWrappedPreferences } from './WrappedPreferencesProvider';
import { getVibeClasses } from '../utils/vibeSettings';

interface GymStatWrappedProps {
  workoutHistory: WorkoutLog[];
  workoutDays: WorkoutDay[];
  isDarkMode: boolean;
  weightUnit: WeightUnit;
  cardioHistory: CardioSession[];
  distanceUnit: DistanceUnit;
}

type TimePeriod = 'month' | 'year';

const GymStatWrapped: React.FC<GymStatWrappedProps> = ({
  workoutHistory,
  workoutDays,
  isDarkMode,
  weightUnit,
  cardioHistory,
  distanceUnit
}) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('year');
  const { settings } = useVisualSettings();
  const { vibeSettings } = useVibe();
  const { preferences, updatePreferences } = useWrappedPreferences();
  const isMobile = settings.screenOptimization === 'smartphone';
  const vibeClasses = getVibeClasses(vibeSettings.currentVibe, isDarkMode);

  
  // This function is now properly using updatePreferences from the hook
  // Calculate stats based on selected time period and enabled categories
  const stats = calculateWrappedStats(
    workoutHistory, 
    workoutDays, 
    timePeriod, 
    preferences.enabledCategories
  );
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });
  
  // Get full unit names in uppercase
  const fullUnitName = weightUnit === 'lbs' ? 'POUNDS' : 'KILOS';

  const displayWeight = (weight: number) => {
    const converted = convertWeight(weight, 'lbs', weightUnit);
    return formatWeight(converted, weightUnit);
  };

  const periodLabel = timePeriod === 'year' ? `${currentYear}` : `${currentMonth} ${currentYear}`;
  const periodTitle = timePeriod === 'year' ? 'This Year' : 'This Month';

  const cards = [
    // Welcome Card
    {
      id: 'welcome',
      title: `Your ${periodLabel} GymStat Wrapped`,
      content: (
        <div className="text-center space-y-4">
          <div className={`${isMobile ? 'text-6xl' : 'text-8xl'}`}>🏆</div>
          <div className="space-y-2">
            <h2 className={`
              font-black tracking-wider transition-colors duration-300
              ${isMobile ? 'text-xl' : 'text-3xl'}
              ${vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')}
            `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
              READY TO SEE YOUR {periodTitle.toUpperCase()} IN FITNESS?
            </h2>
            <p className={`
              transition-colors duration-300 font-medium
              ${isMobile ? 'text-base' : 'text-lg'}
              ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
            `}>
              Let's dive into your amazing journey!
            </p>
          </div>
          <div className={`
            inline-flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-300 font-black tracking-wider
            ${vibeClasses.gradient || (isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700')}
            ${vibeSettings.currentVibe === 'locked-in' ? 'clip-path-jagged-pill' : ''}
          `} style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif', 
            letterSpacing: '0.1em',
            ...(vibeSettings.currentVibe === 'locked-in' ? {
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
            } : {})
          }}>
            <Calendar size={16} />
            <span>{periodLabel.toUpperCase()} IN REVIEW</span>
          </div>
        </div>
      )
    },

    // Total Weight Card
    {
      id: 'total-weight',
      title: 'Total Weight Moved',
      content: (
        <div className="text-center space-y-4">
          <div className={`${isMobile ? 'text-5xl' : 'text-6xl'}`}>💪</div>
          <div className="space-y-3">
            <div>
              <div className={`
                font-black tracking-wider bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent
                ${isMobile ? 'text-3xl' : 'text-5xl'}
              `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                {Math.round(convertWeight(stats.totalWeightLifted, 'lbs', weightUnit)).toLocaleString()} {fullUnitName}
              </div>
              <div className={`
                font-black tracking-wider transition-colors duration-300
                ${isMobile ? 'text-base' : 'text-xl'}
                ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
              `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                MOVED {periodTitle.toUpperCase()}
              </div>
            </div>
            
            {stats.weightComparisons.length > 0 && (
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
                  That's like lifting:
                </p>
                <ul className="space-y-2">
                  {stats.weightComparisons.slice(0, 5).map((comparison, index) => (
                    <li key={index} className={`
                      transition-colors duration-300 font-medium text-sm
                      ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-700')}
                    `}>
                      • <span className={`font-black ${vibeClasses.accent || 'text-blue-600'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                        {comparison.count === 1 
                          ? `1 ${comparison.name}` 
                          : `${comparison.count} ${comparison.plural}`
                        }
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )
    },

    // Workout Count Card
    {
      id: 'workout-count',
      title: 'Consistency Champion',
      content: (
        <div className="text-center space-y-4">
          <div className={`${isMobile ? 'text-5xl' : 'text-6xl'}`}>🔥</div>
          <div className="space-y-3">
            <div>
              <div className={`
                font-black tracking-wider bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent
                ${isMobile ? 'text-3xl' : 'text-5xl'}
              `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                {stats.totalWorkouts}
              </div>
              <div className={`
                font-black tracking-wider transition-colors duration-300
                ${isMobile ? 'text-base' : 'text-xl'}
                ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
              `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                WORKOUTS COMPLETED
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
                    {timePeriod === 'year' ? Math.round(stats.totalWorkouts / 12) || 1 : stats.totalWorkouts}
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

    // Most Reps Exercise Card
    {
      id: 'most-reps',
      title: 'Rep Master',
      content: (
        <div className="text-center space-y-4">
          <div className={`${isMobile ? 'text-5xl' : 'text-6xl'}`}>🎯</div>
          <div className="space-y-3">
            {stats.exerciseWithMostReps ? (
              <>
                <div>
                  <div className={`
                    font-black tracking-wider transition-colors duration-300
                    ${isMobile ? 'text-xl' : 'text-3xl'}
                    ${vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')}
                  `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {stats.exerciseWithMostReps.name}
                  </div>
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-sm' : 'text-lg'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
                  `}>
                    was your most repped exercise
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
                    font-black tracking-wider bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent
                    ${isMobile ? 'text-2xl' : 'text-4xl'}
                  `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {stats.exerciseWithMostReps.totalReps.toLocaleString()}
                  </div>
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-sm' : 'text-lg'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
                  `}>
                    total reps {timePeriod === 'year' ? 'this year' : 'this month'}! 💥
                  </div>
                </div>
              </>
            ) : (
              <div className={`
                transition-colors duration-300 font-medium
                ${isMobile ? 'text-sm' : 'text-lg'}
                ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
              `}>
                Start logging workouts to see your rep champion!
              </div>
            )}
          </div>
        </div>
      )
    },

    // Favorite Day Card
    {
      id: 'favorite-day',
      title: 'Your Favorite Training Day',
      content: (
        <div className="text-center space-y-4">
          <div className={`${isMobile ? 'text-5xl' : 'text-6xl'}`}>❤️</div>
          <div className="space-y-3">
            {stats.mostCommonDay ? (
              <>
                <div>
                  <div className={`
                    font-black tracking-wider transition-colors duration-300
                    ${isMobile ? 'text-xl' : 'text-3xl'}
                    ${vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')}
                  `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {stats.mostCommonDay.name}
                  </div>
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-sm' : 'text-lg'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
                  `}>
                    was your go-to workout
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
                    font-black tracking-wider bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent
                    ${isMobile ? 'text-2xl' : 'text-4xl'}
                  `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {stats.mostCommonDay.count}
                  </div>
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-sm' : 'text-lg'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
                  `}>
                    times completed
                  </div>
                </div>

                {stats.leastCommonDay && stats.leastCommonDay.name !== stats.mostCommonDay.name && (
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-xs' : 'text-sm'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                  `}>
                    Your least trained: {stats.leastCommonDay.name} ({stats.leastCommonDay.count} times)
                  </div>
                )}
              </>
            ) : (
              <div className={`
                transition-colors duration-300 font-medium
                ${isMobile ? 'text-sm' : 'text-lg'}
                ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
              `}>
                Start logging workouts to find your favorite day!
              </div>
            )}
          </div>
        </div>
      )
    },

    // Highest PR Card
    {
      id: 'highest-pr',
      title: 'Personal Record Champion',
      content: (
        <div className="text-center space-y-4">
          <div className={`${isMobile ? 'text-5xl' : 'text-6xl'}`}>🏅</div>
          <div className="space-y-3">
            {stats.highestPR ? (
              <>
                <div>
                  <div className={`
                    font-black tracking-wider transition-colors duration-300
                    ${isMobile ? 'text-xl' : 'text-3xl'}
                    ${vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')}
                  `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                    {stats.highestPR.exerciseName}
                  </div>
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-sm' : 'text-lg'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
                  `}>
                    delivered your strongest performance
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
                    {displayWeight(stats.highestPR.weight)} {fullUnitName}
                  </div>
                  <div className={`
                    transition-colors duration-300 font-medium
                    ${isMobile ? 'text-sm' : 'text-lg'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
                  `}>
                    estimated 1RM 💪
                  </div>
                  <div className={`
                    mt-1 transition-colors duration-300 font-medium
                    ${isMobile ? 'text-xs' : 'text-sm'}
                    ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                  `}>
                    from your {stats.highestPR.dayName} session
                  </div>
                </div>
              </>
            ) : (
              <div className={`
                transition-colors duration-300 font-medium
                ${isMobile ? 'text-sm' : 'text-lg'}
                ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
              `}>
                Start logging workouts to track your PRs!
              </div>
            )}
          </div>
        </div>
      )
    },

    // Summary Card
    {
      id: 'summary',
      title: `${periodLabel} - What a ${timePeriod === 'year' ? 'Year' : 'Month'}!`,
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
                YOU ABSOLUTELY CRUSHED IT!
              </h2>
              <p className={`
                transition-colors duration-300 font-medium
                ${isMobile ? 'text-sm' : 'text-lg'}
                ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-600')}
              `}>
                {timePeriod === 'year' 
                  ? `Here's to an even stronger ${currentYear + 1}!`
                  : `Keep up the momentum for the rest of ${currentYear}!`
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
                  {Math.round(convertWeight(stats.totalWeightLifted, 'lbs', weightUnit)).toLocaleString()}
                </div>
                <div className={`
                  transition-colors duration-300 font-medium
                  ${isMobile ? 'text-xs' : 'text-xs'}
                  ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                `}>{fullUnitName} MOVED</div>
              </div>
              <div className="text-center">
                <div className={`
                  font-black tracking-wider text-green-600
                  ${isMobile ? 'text-sm' : 'text-xl'}
                `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  {stats.totalWorkouts}
                </div>
                <div className={`
                  transition-colors duration-300 font-medium
                  ${isMobile ? 'text-xs' : 'text-xs'}
                  ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                `}>WORKOUTS</div>
              </div>
              <div className="text-center">
                <div className={`
                  font-black tracking-wider text-purple-600
                  ${isMobile ? 'text-sm' : 'text-xl'}
                `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  {stats.exerciseWithMostReps?.totalReps.toLocaleString() || '0'}
                </div>
                <div className={`
                  transition-colors duration-300 font-medium
                  ${isMobile ? 'text-xs' : 'text-xs'}
                  ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                `}>TOTAL REPS</div>
              </div>
              <div className="text-center">
                <div className={`
                  font-black tracking-wider text-orange-600
                  ${isMobile ? 'text-sm' : 'text-xl'}
                `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                  {stats.highestPR ? `${displayWeight(stats.highestPR.weight)}` : '0'}
                </div>
                <div className={`
                  transition-colors duration-300 font-medium
                  ${isMobile ? 'text-xs' : 'text-xs'}
                  ${vibeClasses.text || (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                `}>BEST PR ({fullUnitName})</div>
              </div>
            </div>

            {/* Weight Comparisons Section */}
            {stats.weightComparisons.length > 0 && (
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
                  Your {Math.round(convertWeight(stats.totalWeightLifted, 'lbs', weightUnit)).toLocaleString()} {fullUnitName} is equivalent to:
                </p>
                <ul className="space-y-1">
                  {stats.weightComparisons.slice(0, 5).map((comparison, index) => (
                    <li key={index} className={`
                      transition-colors duration-300 font-medium text-sm
                      ${vibeClasses.text || (isDarkMode ? 'text-gray-300' : 'text-gray-700')}
                    `}>
                      • <span className={`font-black ${vibeClasses.accent || 'text-blue-600'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
                        {comparison.count === 1 
                          ? `1 ${comparison.name}` 
                          : `${comparison.count} ${comparison.plural}`
                        }
                      </span>
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
                FITNESS CHAMPION {timePeriod === 'year' ? currentYear : currentMonth.toUpperCase()}
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
    const text = `My ${periodLabel} GymStat Wrapped: ${Math.round(convertWeight(stats.totalWeightLifted, 'lbs', weightUnit)).toLocaleString()} ${fullUnitName} moved, ${stats.totalWorkouts} workouts completed! 💪`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${periodLabel} GymStat Wrapped`,
          text: `Check out my fitness journey! I moved ${Math.round(convertWeight(stats.totalWeightLifted, 'lbs', weightUnit)).toLocaleString()} ${fullUnitName} and completed ${stats.totalWorkouts} workouts ${timePeriod === 'year' ? 'this year' : 'this month'}! 💪`,
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

  if (stats.totalWorkouts === 0) {
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
                ? (vibeClasses.button || 'bg-blue-600 text-white shadow-lg')
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
                ? (vibeClasses.button || 'bg-blue-600 text-white shadow-lg')
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
          <div className={`mb-6 ${isMobile ? 'text-6xl' : 'text-8xl'}`}>🏋️‍♀️</div>
          <h2 className={`
            font-black tracking-wider mb-4 transition-colors duration-300
            ${isMobile ? 'text-xl' : 'text-2xl'}
            ${vibeClasses.text || (isDarkMode ? 'text-white' : 'text-gray-900')}
          `} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}>
            YOUR {periodLabel.toUpperCase()} GYMSTAT WRAPPED
          </h2>
          <p className={`mb-2 font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>
            Start logging workouts to see your amazing {timePeriod === 'year' ? 'year' : 'month'} in fitness!
          </p>
          <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'}`}>
            Complete and log your first workout to unlock your personalized wrapped experience.
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
              ? (vibeClasses.button || 'bg-blue-600 text-white shadow-lg')
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
              ? (vibeClasses.button || 'bg-blue-600 text-white shadow-lg')
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
            ? 'bg-gradient-to-t from-purple-900/20 via-transparent to-blue-900/20' 
            : 'bg-gradient-to-t from-purple-100/30 via-transparent to-blue-100/30'
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
                  ? (vibeClasses.accent || 'bg-purple-500 scale-125')
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
              ? (vibeClasses.button || 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600')
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

export default GymStatWrapped;