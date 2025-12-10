export const exportData = (userId, habits, streak, bestStreak) => {
  const data = {
    userId,
    habits,
    streak,
    bestStreak,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fitstreak-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid backup file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const getStorageKey = (userId, key) => `fitstreak_${key}_${userId}`;

export const saveToStorage = (userId, key, data) => {
  localStorage.setItem(getStorageKey(userId, key), JSON.stringify(data));
};

export const loadFromStorage = (userId, key, defaultValue = null) => {
  const stored = localStorage.getItem(getStorageKey(userId, key));
  return stored ? JSON.parse(stored) : defaultValue;
};