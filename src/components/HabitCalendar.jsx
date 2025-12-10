import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { theme } from '../styles/theme';
import ModernCard from './ModernCard';

const HabitCalendar = ({ habits }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getHabitCompletion = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayHabits = habits[dateKey] || {};
    return Object.values(dayHabits).filter(Boolean).length;
  };

  const getCellColor = (completion) => {
    if (completion === 0) return theme.colors.neutral[100];
    if (completion <= 2) return theme.colors.warning.light;
    if (completion <= 4) return theme.colors.secondary.light;
    return theme.colors.success.light;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <ModernCard style={{ padding: '24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => navigateMonth(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          ←
        </button>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: theme.colors.primary.main,
          margin: 0
        }}>
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          →
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px'
      }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: '600',
            color: theme.colors.neutral[600],
            padding: '8px'
          }}>
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const completion = getHabitCompletion(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          
          return (
            <div
              key={day.toISOString()}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: isCurrentDay ? '700' : '500',
                color: isCurrentMonth ? theme.colors.neutral[800] : theme.colors.neutral[400],
                background: isCurrentMonth ? getCellColor(completion) : 'transparent',
                borderRadius: '6px',
                border: isCurrentDay ? `2px solid ${theme.colors.primary.main}` : 'none',
                position: 'relative'
              }}
            >
              {format(day, 'd')}
              {completion > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  fontSize: '8px'
                }}>
                  {completion === 5 ? '🔥' : '•'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '16px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: theme.colors.neutral[100], borderRadius: '2px' }}></div>
          <span>0</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: theme.colors.warning.light, borderRadius: '2px' }}></div>
          <span>1-2</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: theme.colors.secondary.light, borderRadius: '2px' }}></div>
          <span>3-4</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '12px', height: '12px', background: theme.colors.success.light, borderRadius: '2px' }}></div>
          <span>5</span>
        </div>
      </div>
    </ModernCard>
  );
};

export default HabitCalendar;