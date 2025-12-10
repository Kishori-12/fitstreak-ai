import { motion } from 'framer-motion';

const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  size = 'md',
  ariaLabel,
  icon,
  ...props 
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) onClick();
    }
  };

  const baseStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    outline: 'none',
    position: 'relative'
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    },
    secondary: {
      background: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db'
    }
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 20px', fontSize: '16px' },
    lg: { padding: '16px 24px', fontSize: '18px' }
  };

  return (
    <motion.button
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size]
      }}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      whileFocus={{
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.3)'
      }}
      {...props}
    >
      {icon && <span role="img" aria-hidden="true">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default AccessibleButton;