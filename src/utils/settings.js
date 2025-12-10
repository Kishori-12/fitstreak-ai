// Settings management system
export const getSettings = (userId) => {
  const defaultSettings = {
    notifications: {
      dailyReminders: true,
      weeklyReports: true,
      achievementAlerts: true,
      reminderTime: '09:00'
    },
    goals: {
      dailyHabitTarget: 5,
      weeklyStreakGoal: 7,
      customChallenges: true
    },
    appearance: {
      theme: 'light',
      petType: 'cat',
      dashboardLayout: 'default'
    },
    privacy: {
      shareProgress: true,
      showInLeaderboard: true,
      dataCollection: true
    }
  };
  
  const stored = localStorage.getItem(`fitstreak_settings_${userId}`);
  return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
};

export const updateSettings = (userId, newSettings) => {
  const currentSettings = getSettings(userId);
  const updatedSettings = { ...currentSettings, ...newSettings };
  localStorage.setItem(`fitstreak_settings_${userId}`, JSON.stringify(updatedSettings));
  return updatedSettings;
};

export const exportUserData = (userId) => {
  const habits = JSON.parse(localStorage.getItem(`fitstreak_habits_${userId}`) || '{}');
  const settings = getSettings(userId);
  const userData = JSON.parse(localStorage.getItem('fitstreak_demo_user') || '{}');
  
  const exportData = {
    user: userData,
    habits,
    settings,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fitstreak-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};