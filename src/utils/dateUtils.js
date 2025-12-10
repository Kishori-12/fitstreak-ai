import { format, isToday, isYesterday, differenceInDays, startOfDay, subDays } from 'date-fns';

export const formatDate = (date) => format(date, 'yyyy-MM-dd');

export const getTodayKey = () => formatDate(new Date());

export const getYesterdayKey = () => formatDate(subDays(new Date(), 1));

export const isNewDay = (lastUpdate) => {
  if (!lastUpdate) return true;
  const lastUpdateDate = new Date(lastUpdate);
  return !isToday(lastUpdateDate);
};

export const shouldResetHabits = (lastUpdate) => {
  if (!lastUpdate) return false;
  const lastUpdateDate = new Date(lastUpdate);
  return !isToday(lastUpdateDate) && !isYesterday(lastUpdateDate);
};

export const calculateStreak = (habits) => {
  const dates = Object.keys(habits).sort().reverse();
  let streak = 0;
  
  for (const date of dates) {
    const dayHabits = habits[date];
    const completed = Object.values(dayHabits || {}).filter(Boolean).length;
    
    if (completed === 5) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getDateRange = (days = 30) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(formatDate(subDays(new Date(), i)));
  }
  return dates;
};