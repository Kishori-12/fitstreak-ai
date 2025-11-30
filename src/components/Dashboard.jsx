import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useHabits } from '../hooks/useHabits';
import { generateMotivationalMessage } from '../services/ai';
import Pet from './Pet';
import HabitCard from './HabitCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { habits, streak, bestStreak, completedCount, petState, completeHabit, loading } = useHabits(user?.uid);
  const [aiMessage, setAiMessage] = useState('Welcome to FitStreak AI! 🌟');

  useEffect(() => {
    if (!loading && user) {
      loadAIMessage();
    }
  }, [completedCount, streak, loading]);

  const loadAIMessage = async () => {
    const message = await generateMotivationalMessage(completedCount, streak);
    setAiMessage(message);
  };

  const handleHabitComplete = (habitId) => {
    completeHabit(habitId);
    toast.success('Great job! 🎉');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading your pet...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-white">
            <h1 className="text-3xl font-bold">FitStreak AI</h1>
            <p className="text-blue-100">Welcome back, {user?.displayName}!</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{streak}</div>
            <div className="text-gray-600">Current Streak 🔥</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{bestStreak}</div>
            <div className="text-gray-600">Best Streak 🏆</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{completedCount}/5</div>
            <div className="text-gray-600">Today's Progress</div>
          </div>
        </div>

        {/* Pet */}
        <div className="mb-8">
          <Pet state={petState} message={aiMessage} />
        </div>

        {/* Habits */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Today's Habits</h2>
          {habits.map((habit, index) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onComplete={handleHabitComplete}
              isLastHabit={index === habits.length - 1}
              completedCount={completedCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;