import { motion } from 'framer-motion';
import { theme } from '../styles/theme';
import { ACHIEVEMENTS } from '../utils/achievements';

const AchievementModal = ({ achievementId, onClose }) => {
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  
  if (!achievement) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>
          {achievement.icon}
        </div>
        
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          background: theme.colors.primary.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px'
        }}>
          Achievement Unlocked!
        </h2>
        
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: theme.colors.neutral[800],
          marginBottom: '8px'
        }}>
          {achievement.name}
        </h3>
        
        <p style={{
          color: theme.colors.neutral[600],
          fontSize: '16px',
          lineHeight: '1.5',
          marginBottom: '30px'
        }}>
          {achievement.description}
        </p>
        
        <button
          onClick={onClose}
          style={{
            background: theme.colors.primary.gradient,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Awesome!
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AchievementModal;