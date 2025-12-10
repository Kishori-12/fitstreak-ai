import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { format, isToday, differenceInDays } from 'date-fns';

const HABITS = [
  { id: 'water', name: 'Drink 8 glasses of water', icon: '💧' },
  { id: 'steps', name: 'Walk 8000+ steps', icon: '👟' },
  { id: 'sleep', name: 'Sleep 7+ hours', icon: '😴' },
  { id: 'meditation', name: '10 min meditation/yoga', icon: '🧘' },
  { id: 'medicine', name: 'Take medicine/vitamins', icon: '💊' }
];

export const useHabits = (userId) => {
  const [habits, setHabits] = useState({});
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (!userId) return;
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      console.log('Loading user data for:', userId);
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        console.log('User document exists:', userDoc.data());
        const data = userDoc.data();
        setHabits(data.habits || {});
        setStreak(data.streak || 0);
        setBestStreak(data.bestStreak || 0);
      } else {
        console.log('Creating new user document for:', userId);
        // Initialize new user document with complete structure
        const initialData = {
          userId: userId,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          habits: {},
          streak: 0,
          bestStreak: 0,
          totalHabitsCompleted: 0,
          lastUpdate: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', userId), initialData);
        console.log('User document created successfully');
        setHabits({});
        setStreak(0);
        setBestStreak(0);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      console.error('Error details:', error.message);
    }
    setLoading(false);
  };

  const calculateStreak = (habitsData) => {
    const dates = Object.keys(habitsData).sort().reverse();
    let currentStreak = 0;
    
    for (const date of dates) {
      const completed = Object.values(habitsData[date] || {}).filter(Boolean).length;
      if (completed === HABITS.length) {
        currentStreak++;
      } else {
        break;
      }
    }
    return currentStreak;
  };

  const completeHabit = async (habitId) => {
    if (habits[today]?.[habitId]) return;

    const newHabits = {
      ...habits,
      [today]: { ...habits[today], [habitId]: true }
    };

    const newStreak = calculateStreak(newHabits);
    const newBestStreak = Math.max(bestStreak, newStreak);
    const totalCompleted = Object.values(newHabits).reduce((total, day) => 
      total + Object.values(day).filter(Boolean).length, 0
    );

    // Calculate daily progress
    const todayCompleted = Object.values(newHabits[today] || {}).filter(Boolean).length;
    const dailyProgressPercent = Math.round((todayCompleted / HABITS.length) * 100);

    // Calculate weekly progress
    const weekData = getWeeklyData(newHabits);
    const weeklyAverage = Math.round(weekData.reduce((sum, day) => sum + day.percentage, 0) / 7);

    // Calculate leaderboard score (streak * 10 + total habits)
    const leaderboardScore = newStreak * 10 + totalCompleted;

    setHabits(newHabits);
    setStreak(newStreak);
    setBestStreak(newBestStreak);

    try {
      console.log('=== HABIT COMPLETION DEBUG ===');
      console.log('User ID:', userId);
      console.log('Habit ID:', habitId);
      console.log('Today:', today);
      console.log('Current habits:', habits);
      console.log('New habits data:', newHabits);
      console.log('New streak:', newStreak);
      console.log('Total completed:', totalCompleted);
      
      const updateData = {
        habits: newHabits,
        streak: newStreak,
        bestStreak: newBestStreak,
        totalHabitsCompleted: totalCompleted,
        lastUpdate: new Date().toISOString(),
        lastHabitCompletedAt: new Date().toISOString()
      };
      
      console.log('Update data:', updateData);
      
      await updateDoc(doc(db, 'users', userId), updateData);
      
      console.log('✅ Habit updated successfully in database');
    } catch (error) {
      console.error('❌ Error updating habits:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    }
  };

  const getWeeklyData = (habitsData = habits) => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayHabits = habitsData[dateStr] || {};
      const completed = Object.values(dayHabits).filter(Boolean).length;
      weekData.push({
        date: dateStr,
        day: format(date, 'EEE'),
        completed,
        total: HABITS.length,
        percentage: Math.round((completed / HABITS.length) * 100)
      });
    }
    return weekData;
  };

  const getCompletedCount = () => {
    return Object.values(habits[today] || {}).filter(Boolean).length;
  };

  const getPetState = () => {
    const completed = getCompletedCount();
    if (completed === 5) return 'super-happy';
    if (completed >= 3) return 'happy';
    if (completed >= 1) return 'sad';
    return 'sick';
  };



  return {
    habits: HABITS.map(habit => ({
      ...habit,
      completed: habits[today]?.[habit.id] || false
    })),
    rawHabits: habits,
    streak,
    bestStreak,
    completedCount: getCompletedCount(),
    petState: getPetState(),
    completeHabit,
    loading,
    weeklyData: getWeeklyData(),
    totalHabitsCompleted: Object.values(habits).reduce((total, day) => 
      total + Object.values(day).filter(Boolean).length, 0
    )
  };
};