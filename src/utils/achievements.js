export const ACHIEVEMENTS = [
  { id: 'first_habit', name: 'First Step', description: 'Complete your first habit', icon: '🌱', requirement: 1 },
  { id: 'perfect_day', name: 'Perfect Day', description: 'Complete all 5 habits in one day', icon: '⭐', requirement: 5 },
  { id: 'week_warrior', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', requirement: 7 },
  { id: 'habit_master', name: 'Habit Master', description: 'Complete 100 total habits', icon: '🏆', requirement: 100 },
  { id: 'streak_legend', name: 'Streak Legend', description: 'Achieve a 30-day streak', icon: '👑', requirement: 30 },
  { id: 'consistency_king', name: 'Consistency King', description: 'Complete habits for 50 days', icon: '💎', requirement: 50 }
];

export const checkAchievements = (totalHabits, streak, completedToday) => {
  const earned = [];
  
  if (totalHabits >= 1) earned.push('first_habit');
  if (completedToday === 5) earned.push('perfect_day');
  if (streak >= 7) earned.push('week_warrior');
  if (totalHabits >= 100) earned.push('habit_master');
  if (streak >= 30) earned.push('streak_legend');
  if (totalHabits >= 250) earned.push('consistency_king');
  
  return earned;
};

export const getNewAchievements = (oldAchievements, newAchievements) => {
  return newAchievements.filter(id => !oldAchievements.includes(id));
};