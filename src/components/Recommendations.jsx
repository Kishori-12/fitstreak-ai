import { theme } from '../styles/theme';
import ModernCard from './ModernCard';

const Recommendations = ({ streak, completedCount, bestStreak, totalHabits }) => {
  const getRecommendation = () => {
    if (completedCount === 5) {
      return "🎉 Perfect day! You've completed all habits!";
    } else if (completedCount >= 3) {
      return "💪 Great progress! Just a few more habits to go!";
    } else if (streak > 7) {
      return "🔥 Amazing streak! Keep the momentum going!";
    } else {
      return "🌟 Start strong today! Every habit counts!";
    }
  };

  return (
    <ModernCard style={{ padding: '20px', marginBottom: '20px' }}>
      <h3 style={{ 
        color: theme.colors.primary.main, 
        marginBottom: '10px',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        💡 Today's Recommendation
      </h3>
      <p style={{ 
        color: theme.colors.neutral[600], 
        fontSize: '16px',
        margin: 0
      }}>
        {getRecommendation()}
      </p>
    </ModernCard>
  );
};

export default Recommendations;