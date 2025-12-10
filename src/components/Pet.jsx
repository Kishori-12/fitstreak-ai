import { motion } from 'framer-motion';

const Pet = ({ state, message, streak = 0, totalHabits = 0 }) => {
  const getPetEvolution = () => {
    if (totalHabits >= 500) return 'legendary';
    if (totalHabits >= 200) return 'master';
    if (totalHabits >= 100) return 'evolved';
    if (totalHabits >= 50) return 'grown';
    return 'baby';
  };

  const getPetEmoji = () => {
    const evolution = getPetEvolution();
    
    switch (state) {
      case 'super-happy': 
        if (evolution === 'legendary') return '🦁✨🎆';
        if (evolution === 'master') return '🐱✨👑';
        if (evolution === 'evolved') return '🐱✨🌟';
        if (evolution === 'grown') return '🐱✨';
        return '🐱✨';
      case 'happy': 
        if (evolution === 'legendary') return '🦁😊';
        if (evolution === 'master') return '🐱👑';
        if (evolution === 'evolved') return '😸🌟';
        if (evolution === 'grown') return '😸';
        return '😸';
      case 'sad': 
        if (evolution === 'legendary') return '🦁😔';
        if (evolution === 'master') return '🐱😔';
        return '😿';
      case 'sick': 
        return '👻';
      default: 
        return '😸';
    }
  };

  const getPetName = () => {
    const evolution = getPetEvolution();
    switch (evolution) {
      case 'legendary': return 'Legendary Guardian';
      case 'master': return 'Habit Master';
      case 'evolved': return 'Super Pet';
      case 'grown': return 'Grown Pet';
      default: return 'Baby Pet';
    }
  };

  const getPetAnimation = () => {
    switch (state) {
      case 'super-happy': return { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] };
      case 'happy': return { scale: [1, 1.1, 1] };
      case 'sad': return { y: [0, 5, 0] };
      case 'sick': return { opacity: [1, 0.5, 1] };
      default: return {};
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <motion.div
          style={{ fontSize: '80px' }}
          animate={getPetAnimation()}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {getPetEmoji()}
        </motion.div>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#8B5CF6',
          marginTop: '8px'
        }}>
          {getPetName()}
        </div>
        {streak > 0 && (
          <div style={{
            fontSize: '10px',
            color: '#6B7280',
            marginTop: '4px'
          }}>
            🔥 {streak} day streak
          </div>
        )}
      </div>
      
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        maxWidth: '300px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '32px',
          width: '16px',
          height: '16px',
          background: 'white',
          transform: 'rotate(45deg)'
        }}></div>
        <p style={{
          color: '#374151',
          fontSize: '14px',
          fontWeight: '500',
          margin: 0,
          lineHeight: '1.4'
        }}>{message}</p>
      </div>
    </div>
  );
};

export default Pet;  