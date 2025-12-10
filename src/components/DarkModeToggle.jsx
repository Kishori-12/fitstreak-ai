import { motion } from 'framer-motion';

const DarkModeToggle = ({ isDark, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      style={{
        background: isDark ? '#374151' : '#f3f4f6',
        border: 'none',
        borderRadius: '20px',
        padding: '8px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: isDark ? '#f9fafb' : '#374151'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span>{isDark ? '🌙' : '☀️'}</span>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </motion.button>
  );
};

export default DarkModeToggle;