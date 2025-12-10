import { motion } from 'framer-motion';
import { theme } from '../styles/theme';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizes = {
    sm: '20px',
    md: '40px',
    lg: '60px'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }}>
      <motion.div
        style={{
          width: sizes[size],
          height: sizes[size],
          border: `3px solid ${theme.colors.neutral[200]}`,
          borderTop: `3px solid ${theme.colors.primary.main}`,
          borderRadius: '50%'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p style={{
        color: theme.colors.neutral[600],
        fontSize: '14px',
        margin: 0
      }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;