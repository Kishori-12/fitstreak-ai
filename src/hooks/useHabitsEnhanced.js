import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getTodayKey, isNewDay, shouldResetHabits, calculateStreak } from '../utils/dateUtils';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { checkAchievements, getNewAchievements } from '../utils/achievements';

const DEFAULT_HABITS = [
  { id: 'water', name: 'Drink 8 glasses of water', icon: '💧' },
  { id: 'steps', name: 'Walk 8000+ steps', icon: '👟' },
  { id: 'sleep', name: 'Sleep 7+ hours', icon: '😴' },
  { id: 'meditation', name: '10 min meditation/yoga', icon: '🧘' },
  { id: 'medicine', name: 'Take medicine/vitamins', icon: '💊' }
];

export const useHabitsEnhanced = (userId) => {
  const [habits, setHabits] = useState({});
  const [customHabits, setCustomHabits] = useState(DEFAULT_HABITS);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [totalHabitsCompleted, setTotalHabitsCompleted] = useState(0);

  const today = getTodayKey();

  useEffect(() => {
    if (!userId) return;
    loadUserData();
  }, [userId]);

  useEffect(() => {
    if (userId && lastUpdate && isNewDay(lastUpdate)) {
      checkDailyReset();
    }
  }, [lastUpdate]);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      let data = {};
      
      if (userDoc.exists()) {
        data = userDoc.data();
      }
      
      const localData = loadFromStorage(userId, 'habits', {});
      const localCustomHabits = loadFromStorage(userId, 'customHabits', DEFAULT_HABITS);
      const localAchievements = loadFromStorage(userId, 'achievements', []);
      
      const habitsData = data.habits || localData;
      const customHabitsData = data.customHabits || localCustomHabits;
      
      setHabits(habitsData);
      setCustomHabits(customHabitsData);
      setStreak(data.streak || calculateStreak(habitsData));
      setBestStreak(data.bestStreak || 0);
      setLastUpdate(data.lastUpdate || new Date());
      setAchievements(data.achievements || localAchievements);
      
      const total = Object.values(habitsData).reduce((sum, dayHabits) => {
        return sum + Object.values(dayHabits || {}).filter(Boolean).length;
      }, 0);
      setTotalHabitsCompleted(total);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      const localData = loadFromStorage(userId, 'habits', {});
      const localCustomHabits = loadFromStorage(userId, 'customHabits', DEFAULT_HABITS);
      setHabits(localData);
      setCustomHabits(localCustomHabits);
    }
    setLoading(false);
  };

  const checkDailyReset = async () => {
    if (shouldResetHabits(lastUpdate)) {
      const newStreak = 0;
      setStreak(newStreak);
      await saveUserData({ streak: newStreak });
    }
  };

  const saveUserData = async (updates = {}) => {
    const userData = {
      habits,
      customHabits,
      streak,
      bestStreak,
      achievements,
      lastUpdate: new Date(),
      ...updates
    };

    try {
      await updateDoc(doc(db, 'users', userId), userData);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }

    saveToStorage(userId, 'habits', userData.habits);
    saveToStorage(userId, 'customHabits', userData.customHabits);
    saveToStorage(userId, 'achievements', userData.achievements);
  };

  const completeHabit = async (habitId) => {
    if (habits[today]?.[habitId]) return;

    const newHabits = {
      ...habits,
      [today]: { ...habits[today], [habitId]: true }
    };

    const completedToday = Object.values(newHabits[today] || {}).filter(Boolean).length;
    const newTotalCompleted = totalHabitsCompleted + 1;
    
    let newStreak = streak;
    let newBestStreak = bestStreak;

    if (completedToday === customHabits.length) {
      newStreak = calculateStreak(newHabits);
      newBestStreak = Math.max(bestStreak, newStreak);
    }

    const currentAchievements = checkAchievements(newTotalCompleted, newStreak, completedToday);
    const newAchievementIds = getNewAchievements(achievements, currentAchievements);

    setHabits(newHabits);
    setStreak(newStreak);
    setBestStreak(newBestStreak);
    setTotalHabitsCompleted(newTotalCompleted);
    setAchievements(currentAchievements);
    setLastUpdate(new Date());

    await saveUserData({
      habits: newHabits,
      streak: newStreak,
      bestStreak: newBestStreak,
      achievements: currentAchievements
    });

    return { newAchievements: newAchievementIds, completedToday };
  };

  const updateCustomHabits = async (newCustomHabits) => {
    setCustomHabits(newCustomHabits);
    await saveUserData({ customHabits: newCustomHabits });
  };

  const getCompletedCount = () => {
    return Object.values(habits[today] || {}).filter(Boolean).length;
  };

  const getPetState = () => {
    const completed = getCompletedCount();
    const total = customHabits.length;
    
    if (completed === total) return 'super-happy';
    if (completed >= Math.ceil(total * 0.6)) return 'happy';
    if (completed >= 1) return 'sad';
    return 'sick';
  };

  const getWeeklyData = () => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = getTodayKey();
      const dayHabits = habits[dateKey] || {};
      const completed = Object.values(dayHabits).filter(Boolean).length;
      
      weekData.push({
        date: dateKey,
        completed,
        total: customHabits.length,
        percentage: Math.round((completed / customHabits.length) * 100)
      });
    }
    return weekData;
  };

  return {
    habits: customHabits.map(habit => ({
      ...habit,
      completed: habits[today]?.[habit.id] || false
    })),
    rawHabits: habits,
    customHabits,
    streak,
    bestStreak,
    completedCount: getCompletedCount(),
    petState: getPetState(),
    achievements,
    totalHabitsCompleted,
    weeklyData: getWeeklyData(),
    completeHabit,
    updateCustomHabits,
    loading
  };
};