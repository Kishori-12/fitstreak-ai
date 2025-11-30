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
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setHabits(data.habits || {});
        setStreak(data.streak || 0);
        setBestStreak(data.bestStreak || 0);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    setLoading(false);
  };

  const completeHabit = async (habitId) => {
    if (habits[today]?.[habitId]) return;

    const newHabits = {
      ...habits,
      [today]: { ...habits[today], [habitId]: true }
    };

    const completedToday = Object.values(newHabits[today] || {}).filter(Boolean).length;
    let newStreak = streak;
    let newBestStreak = bestStreak;

    if (completedToday === HABITS.length) {
      newStreak = streak + 1;
      newBestStreak = Math.max(bestStreak, newStreak);
    }

    setHabits(newHabits);
    setStreak(newStreak);
    setBestStreak(newBestStreak);

    await updateDoc(doc(db, 'users', userId), {
      habits: newHabits,
      streak: newStreak,
      bestStreak: newBestStreak,
      lastUpdate: new Date()
    });
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
    streak,
    bestStreak,
    completedCount: getCompletedCount(),
    petState: getPetState(),
    completeHabit,
    loading
  };
};