import { useState } from 'react';
import { theme } from '../styles/theme';
import ModernCard from './ModernCard';
import ModernButton from './ModernButton';

const HABIT_ICONS = ['💧', '👟', '😴', '🧘', '💊', '📚', '🥗', '🏃', '🎯', '🎨', '🎵', '🌱'];

const HabitCustomizer = ({ habits, onSave, onCancel }) => {
  const [customHabits, setCustomHabits] = useState(habits);

  const updateHabit = (index, field, value) => {
    const updated = [...customHabits];
    updated[index] = { ...updated[index], [field]: value };
    setCustomHabits(updated);
  };

  const addHabit = () => {
    if (customHabits.length < 8) {
      setCustomHabits([...customHabits, {
        id: `custom_${Date.now()}`,
        name: 'New Habit',
        icon: '🎯'
      }]);
    }
  };

  const removeHabit = (index) => {
    if (customHabits.length > 3) {
      setCustomHabits(customHabits.filter((_, i) => i !== index));
    }
  };

  return (
    <ModernCard style={{ padding: '24px' }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: theme.colors.primary.main,
        marginBottom: '20px'
      }}>
        Customize Your Habits
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {customHabits.map((habit, index) => (
          <div key={habit.id} style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            padding: '16px',
            background: theme.colors.neutral[50],
            borderRadius: '12px',
            border: `1px solid ${theme.colors.neutral[200]}`
          }}>
            <select
              value={habit.icon}
              onChange={(e) => updateHabit(index, 'icon', e.target.value)}
              style={{
                fontSize: '24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {HABIT_ICONS.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>

            <input
              type="text"
              value={habit.name}
              onChange={(e) => updateHabit(index, 'name', e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: `1px solid ${theme.colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Habit name"
            />

            {customHabits.length > 3 && (
              <button
                onClick={() => removeHabit(index)}
                style={{
                  background: theme.colors.error.main,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {customHabits.length < 8 && (
        <ModernButton
          variant="secondary"
          onClick={addHabit}
          style={{ marginBottom: '20px' }}
        >
          + Add Habit
        </ModernButton>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <ModernButton variant="secondary" onClick={onCancel}>
          Cancel
        </ModernButton>
        <ModernButton onClick={() => onSave(customHabits)}>
          Save Changes
        </ModernButton>
      </div>
    </ModernCard>
  );
};

export default HabitCustomizer;