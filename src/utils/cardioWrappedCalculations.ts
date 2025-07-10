import { CardioSession, DistanceUnit } from '../types/workout';
import { convertDistance, formatDistance } from './unitConversion';

export interface CardioWrappedStats {
  totalDuration: number; // minutes
  totalDistance: number | null; // in selected unit (mi/km)
  totalCalories: number | null;
  activityBreakdown: {
    name: string;
    customName?: string;
    count: number;
    totalDuration: number;
    totalDistance: number | null;
    totalCalories: number | null;
    icon: string;
  }[];
  favoriteActivity: {
    name: string;
    customName?: string;
    count: number;
    totalDuration: number;
    icon: string;
  } | null;
  longestSession: {
    name: string;
    customName?: string;
    duration: number;
    date: string;
    icon: string;
  } | null;
  furthestDistance: {
    name: string;
    customName?: string;
    distance: number;
    date: string;
    icon: string;
  } | null;
  mostCaloriesBurned: {
    name: string;
    customName?: string;
    calories: number;
    date: string;
    icon: string;
  } | null;
  heartRateStats: {
    sessionsWithHeartRate: number;
    averageHeartRate: number | null;
    maxHeartRate: number | null;
  };
  streakData: {
    longestStreak: number;
    currentStreak: number;
  };
  monthlyBreakdown: {
    month: string;
    duration: number;
    distance: number | null;
    calories: number | null;
    sessions: number;
  }[];
}

export const calculateCardioWrappedStats = (
  cardioHistory: CardioSession[],
  timePeriod: 'month' | 'year' = 'year',
  distanceUnit: DistanceUnit
): CardioWrappedStats => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // Filter sessions based on time period
  const filteredSessions = cardioHistory.filter(session => {
    const sessionDate = new Date(session.timestamp);
    const sessionYear = sessionDate.getFullYear();
    const sessionMonth = sessionDate.getMonth();
    
    if (timePeriod === 'year') {
      return sessionYear === currentYear;
    } else {
      return sessionYear === currentYear && sessionMonth === currentMonth;
    }
  });

  // Calculate total duration
  const totalDuration = filteredSessions.reduce((total, session) => total + session.duration, 0);
  
  // Calculate total distance if available
  let totalDistance: number | null = null;
  const sessionsWithDistance = filteredSessions.filter(session => session.distance !== undefined);
  if (sessionsWithDistance.length > 0) {
    totalDistance = sessionsWithDistance.reduce((total, session) => total + (session.distance || 0), 0);
  }
  
  // Calculate total calories if available
  let totalCalories: number | null = null;
  const sessionsWithCalories = filteredSessions.filter(session => session.calories !== undefined);
  if (sessionsWithCalories.length > 0) {
    totalCalories = sessionsWithCalories.reduce((total, session) => total + (session.calories || 0), 0);
  }

  // Activity breakdown
  const activityTypes: Record<string, {
    name: string;
    customName?: string;
    count: number;
    totalDuration: number;
    totalDistance: number;
    totalCalories: number;
    icon: string;
  }> = {};
  
  filteredSessions.forEach(session => {
    const activityKey = session.activityType;
    const customName = session.activityType === 'other' ? session.customActivityName : undefined;
    
    if (!activityTypes[activityKey]) {
      activityTypes[activityKey] = {
        name: activityKey,
        customName,
        count: 0,
        totalDuration: 0,
        totalDistance: 0,
        totalCalories: 0,
        icon: getActivityIcon(activityKey)
      };
    }
    
    activityTypes[activityKey].count += 1;
    activityTypes[activityKey].totalDuration += session.duration;
    if (session.distance !== undefined) {
      activityTypes[activityKey].totalDistance += session.distance;
    }
    if (session.calories !== undefined) {
      activityTypes[activityKey].totalCalories += session.calories;
    }
  });
  
  const activityBreakdown = Object.values(activityTypes).sort((a, b) => b.count - a.count);
  
  // Favorite activity (most frequently done)
  const favoriteActivity = activityBreakdown.length > 0 ? {
    name: activityBreakdown[0].name,
    customName: activityBreakdown[0].customName,
    count: activityBreakdown[0].count,
    totalDuration: activityBreakdown[0].totalDuration,
    icon: activityBreakdown[0].icon
  } : null;
  
  // Longest session
  let longestSession: CardioWrappedStats['longestSession'] = null;
  if (filteredSessions.length > 0) {
    const longest = [...filteredSessions].sort((a, b) => b.duration - a.duration)[0];
    longestSession = {
      name: longest.activityType,
      customName: longest.activityType === 'other' ? longest.customActivityName : undefined,
      duration: longest.duration,
      date: longest.date,
      icon: getActivityIcon(longest.activityType)
    };
  }
  
  // Furthest distance
  let furthestDistance: CardioWrappedStats['furthestDistance'] = null;
  const sessionsWithDistance2 = filteredSessions.filter(session => session.distance !== undefined);
  if (sessionsWithDistance2.length > 0) {
    const furthest = [...sessionsWithDistance2].sort((a, b) => (b.distance || 0) - (a.distance || 0))[0];
    furthestDistance = {
      name: furthest.activityType,
      customName: furthest.activityType === 'other' ? furthest.customActivityName : undefined,
      distance: furthest.distance || 0,
      date: furthest.date,
      icon: getActivityIcon(furthest.activityType)
    };
  }
  
  // Most calories burned
  let mostCaloriesBurned: CardioWrappedStats['mostCaloriesBurned'] = null;
  const sessionsWithCalories2 = filteredSessions.filter(session => session.calories !== undefined);
  if (sessionsWithCalories2.length > 0) {
    const mostCalories = [...sessionsWithCalories2].sort((a, b) => (b.calories || 0) - (a.calories || 0))[0];
    mostCaloriesBurned = {
      name: mostCalories.activityType,
      customName: mostCalories.activityType === 'other' ? mostCalories.customActivityName : undefined,
      calories: mostCalories.calories || 0,
      date: mostCalories.date,
      icon: getActivityIcon(mostCalories.activityType)
    };
  }
  
  // Heart rate stats
  const sessionsWithHeartRate = filteredSessions.filter(session => 
    session.heartRate && (session.heartRate.average || session.heartRate.max)
  );
  
  let avgHeartRate: number | null = null;
  let maxHeartRate: number | null = null;
  
  if (sessionsWithHeartRate.length > 0) {
    const averages = sessionsWithHeartRate
      .filter(s => s.heartRate?.average)
      .map(s => s.heartRate?.average || 0);
    
    if (averages.length > 0) {
      avgHeartRate = Math.round(averages.reduce((sum, val) => sum + val, 0) / averages.length);
    }
    
    const maxes = sessionsWithHeartRate
      .filter(s => s.heartRate?.max)
      .map(s => s.heartRate?.max || 0);
    
    if (maxes.length > 0) {
      maxHeartRate = Math.max(...maxes);
    }
  }
  
  const heartRateStats = {
    sessionsWithHeartRate: sessionsWithHeartRate.length,
    averageHeartRate: avgHeartRate,
    maxHeartRate: maxHeartRate
  };

  // Streak calculation
  const sortedSessions = [...filteredSessions].sort((a, b) => a.timestamp - b.timestamp);
  let longestStreak = 0;
  let currentStreak = 0;
  let lastSessionDate: Date | null = null;

  sortedSessions.forEach(session => {
    const sessionDate = new Date(session.timestamp);
    
    if (lastSessionDate) {
      const daysDiff = Math.floor((sessionDate.getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) { // Within a week
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    
    lastSessionDate = sessionDate;
  });
  
  longestStreak = Math.max(longestStreak, currentStreak);

  // Calculate current streak from today
  const today = new Date();
  const lastSession = sortedSessions[sortedSessions.length - 1];
  const daysSinceLastSession = lastSession 
    ? Math.floor((today.getTime() - lastSession.timestamp) / (1000 * 60 * 60 * 24))
    : Infinity;
  
  const actualCurrentStreak = daysSinceLastSession <= 7 ? currentStreak : 0;
  
  // Monthly breakdown
  const monthlyData: { [key: string]: { duration: number; distance: number; calories: number; sessions: number } } = {};
  filteredSessions.forEach(session => {
    const date = new Date(session.timestamp);
    let key: string;
    
    if (timePeriod === 'year') {
      key = date.toLocaleDateString('en-US', { month: 'short' });
    } else {
      key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    if (!monthlyData[key]) {
      monthlyData[key] = { duration: 0, distance: 0, calories: 0, sessions: 0 };
    }
    
    monthlyData[key].duration += session.duration;
    monthlyData[key].distance += session.distance || 0;
    monthlyData[key].calories += session.calories || 0;
    monthlyData[key].sessions += 1;
  });

  const monthlyBreakdown = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    duration: data.duration,
    distance: data.distance > 0 ? data.distance : null,
    calories: data.calories > 0 ? data.calories : null,
    sessions: data.sessions
  }));

  return {
    totalDuration,
    totalDistance,
    totalCalories,
    activityBreakdown,
    favoriteActivity,
    longestSession,
    furthestDistance,
    mostCaloriesBurned,
    heartRateStats,
    streakData: {
      longestStreak,
      currentStreak: actualCurrentStreak
    },
    monthlyBreakdown
  };
};

export const getActivityIcon = (activityType: CardioSession['activityType']): string => {
  switch (activityType) {
    case 'running':
      return '🏃';
    case 'cycling':
      return '🚴';
    case 'swimming':
      return '🏊';
    case 'rowing':
      return '🚣';
    case 'elliptical':
      return '🌀';
    case 'stairmaster':
      return '🪜';
    case 'hiking':
      return '🥾';
    default:
      return '⭐';
  }
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  
  return `${mins}m`;
};