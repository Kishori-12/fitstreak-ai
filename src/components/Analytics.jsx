import { theme } from '../styles/theme';
import ModernCard from './ModernCard';
import HabitCalendar from './HabitCalendar';
import { getDateRange } from '../utils/dateUtils';

const Analytics = ({ habits, streak, bestStreak, weeklyData = [], totalHabits = 0 }) => {
  const calculateSuccessRate = () => {
    if (!habits || Object.keys(habits).length === 0) return 0;
    
    const dates = getDateRange(30);
    const completedDays = dates.filter(date => {
      const dayHabits = habits[date] || {};
      const completed = Object.values(dayHabits).filter(Boolean).length;
      return completed >= 3; // Consider 3+ habits as successful day
    }).length;
    
    return Math.round((completedDays / dates.length) * 100);
  };

  const getHabitStats = () => {
    const stats = {};
    const dates = getDateRange(30);
    
    dates.forEach(date => {
      const dayHabits = habits[date] || {};
      Object.entries(dayHabits).forEach(([habitId, completed]) => {
        if (!stats[habitId]) stats[habitId] = { completed: 0, total: 0 };
        stats[habitId].total++;
        if (completed) stats[habitId].completed++;
      });
    });
    
    return Object.entries(stats).map(([habitId, data]) => ({
      habitId,
      rate: Math.round((data.completed / data.total) * 100) || 0,
      completed: data.completed
    }));
  };

  const successRate = calculateSuccessRate();
  const habitStats = getHabitStats();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Main Stats */}
      <ModernCard style={{ padding: '30px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          background: theme.colors.primary.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '25px',
          textAlign: 'center'
        }}>📊 Analytics Dashboard</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: theme.colors.background.card,
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: theme.colors.primary.main }}>
              {streak}
            </div>
            <div style={{ color: theme.colors.neutral[600], fontSize: '14px' }}>
              Current Streak
            </div>
          </div>
          
          <div style={{
            background: theme.colors.background.card,
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: theme.colors.secondary.main }}>
              {bestStreak}
            </div>
            <div style={{ color: theme.colors.neutral[600], fontSize: '14px' }}>
              Best Streak
            </div>
          </div>
          
          <div style={{
            background: theme.colors.background.card,
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: theme.colors.success.main }}>
              {successRate}%
            </div>
            <div style={{ color: theme.colors.neutral[600], fontSize: '14px' }}>
              Success Rate (30d)
            </div>
          </div>
          
          <div style={{
            background: theme.colors.background.card,
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: theme.colors.warning.main }}>
              {totalHabits}
            </div>
            <div style={{ color: theme.colors.neutral[600], fontSize: '14px' }}>
              Total Completed
            </div>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        {weeklyData.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme.colors.primary.main,
              marginBottom: '15px'
            }}>Weekly Progress</h3>
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'end',
              height: '120px',
              padding: '20px',
              background: theme.colors.neutral[50],
              borderRadius: '12px'
            }}>
              {weeklyData.map((day, index) => (
                <div key={index} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    height: `${Math.max(day.percentage, 10)}px`,
                    width: '100%',
                    background: day.percentage === 100 
                      ? theme.colors.success.main 
                      : day.percentage >= 60 
                      ? theme.colors.secondary.main 
                      : theme.colors.warning.main,
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }}></div>
                  <div style={{
                    fontSize: '10px',
                    color: theme.colors.neutral[600],
                    textAlign: 'center'
                  }}>
                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Habit Performance */}
        {habitStats.length > 0 && (
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme.colors.primary.main,
              marginBottom: '15px'
            }}>Habit Performance (30 days)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {habitStats.map(stat => (
                <div key={stat.habitId} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: theme.colors.neutral[50],
                  borderRadius: '8px'
                }}>
                  <div style={{ minWidth: '120px', fontSize: '14px', fontWeight: '500' }}>
                    {stat.habitId.charAt(0).toUpperCase() + stat.habitId.slice(1)}
                  </div>
                  <div style={{
                    flex: 1,
                    height: '8px',
                    background: theme.colors.neutral[200],
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${stat.rate}%`,
                      height: '100%',
                      background: stat.rate >= 80 
                        ? theme.colors.success.main 
                        : stat.rate >= 60 
                        ? theme.colors.secondary.main 
                        : theme.colors.warning.main,
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <div style={{
                    minWidth: '60px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: theme.colors.primary.main,
                    textAlign: 'right'
                  }}>
                    {stat.rate}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ModernCard>

      {/* Calendar View */}
      <HabitCalendar habits={habits} />
    </div>
  );
};

export default Analytics;