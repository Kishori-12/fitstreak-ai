import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { theme } from '../styles/theme';

const HabitCard = ({ habit, onComplete, isLastHabit, completedCount }) => {
  const handleComplete = () => {
    console.log('🔥 HabitCard handleComplete called for:', habit.id);
    console.log('onComplete function:', onComplete);
    onComplete(habit.id);
    
    if (isLastHabit && completedCount === 4) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !habit.completed) {
      e.preventDefault();
      handleComplete();
    }
  };

  return (
    <motion.div
      style={{
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        background: habit.completed 
          ? `linear-gradient(135deg, ${theme.colors.success.light}20 0%, ${theme.colors.success.main}10 100%)`
          : 'white',
        border: `2px solid ${habit.completed ? theme.colors.success.light : theme.colors.neutral[200]}`,
        cursor: habit.completed ? 'default' : 'pointer'
      }}
      whileHover={habit.completed ? {} : { scale: 1.02 }}
      whileTap={habit.completed ? {} : { scale: 0.98 }}
      onClick={() => {
        console.log('🖱️ BASIC CLICK TEST - This should always show');
        console.log('Habit data:', habit);
        console.log('Completed status:', habit.completed);
        
        if (!habit.completed) {
          console.log('Calling handleComplete...');
          handleComplete();
        } else {
          console.log('Habit already completed, not calling handleComplete');
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={habit.completed ? -1 : 0}
      role="button"
      aria-label={`${habit.name} - ${habit.completed ? 'Completed' : 'Click to complete'}`}
      aria-pressed={habit.completed}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span 
            style={{ fontSize: '24px' }}
            role="img"
            aria-label={`${habit.name} icon`}
          >
            {habit.icon}
          </span>
          <span style={{
            fontWeight: '500',
            color: habit.completed ? theme.colors.success.dark : theme.colors.neutral[800],
            fontSize: '16px'
          }}>
            {habit.name}
          </span>
        </div>
        
        <div style={{
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          background: habit.completed 
            ? theme.colors.success.main 
            : theme.colors.primary.main,
          color: 'white',
          minWidth: '80px',
          textAlign: 'center',
          opacity: habit.completed ? 0.8 : 1
        }}>
          {habit.completed ? '✓ Done' : 'Complete'}
        </div>
      </div>
    </motion.div>
  );
};

export default HabitCard;