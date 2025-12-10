import { theme } from '../styles/theme';

const ModernButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  icon = '', 
  disabled = false,
  style = {}
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: theme.colors.neutral[100],
          color: theme.colors.neutral[700],
          border: `1px solid ${theme.colors.neutral[300]}`
        };
      case 'outline':
        return {
          background: 'transparent',
          color: theme.colors.primary.main,
          border: `2px solid ${theme.colors.primary.main}`
        };
      case 'danger':
        return {
          background: '#ef4444',
          color: 'white',
          border: 'none'
        };
      default:
        return {
          background: theme.colors.primary.gradient,
          color: 'white',
          border: 'none'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '8px 16px',
          fontSize: '14px'
        };
      case 'lg':
        return {
          padding: '16px 32px',
          fontSize: '18px'
        };
      default:
        return {
          padding: '12px 24px',
          fontSize: '16px'
        };
    }
  };

  const baseStyle = {
    borderRadius: '12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    opacity: disabled ? 0.6 : 1,
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={baseStyle}
      onMouseOver={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0px)';
          e.target.style.boxShadow = 'none';
        }
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default ModernButton;