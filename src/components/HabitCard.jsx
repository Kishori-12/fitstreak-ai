import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const HabitCard = ({ habit, onComplete, isLastHabit, completedCount }) => {
  const handleComplete = () => {
    onComplete(habit.id);
    
    if (isLastHabit && completedCount === 4) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <motion.div
      className={`p-4 rounded-lg shadow-md ${
        habit.completed 
          ? 'bg-green-100 border-2 border-green-300' 
          : 'bg-white border-2 border-gray-200'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{habit.icon}</span>
          <span className="font-medium text-gray-800">{habit.name}</span>
        </div>
        
        <button
          onClick={handleComplete}
          disabled={habit.completed}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            habit.completed
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {habit.completed ? '✓ Done' : 'Mark Done'}
        </button>
      </div>
    </motion.div>
  );
};

export default HabitCard;