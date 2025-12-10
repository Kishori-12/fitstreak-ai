import { theme } from '../styles/theme';

const ModernCard = ({ children, style = {}, hover = false }) => {
  const baseStyle = {
    background: theme.colors.background.card,
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    boxShadow: theme.shadows.glass,
    border: `1px solid ${theme.colors.neutral[200]}`,
    transition: 'all 0.3s ease',
    ...style
  };

  const hoverStyle = hover ? {
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.hover
    }
  } : {};

  return (
    <div 
      style={{...baseStyle, ...hoverStyle}}
      onMouseOver={(e) => {
        if (hover) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = theme.shadows.hover;
        }
      }}
      onMouseOut={(e) => {
        if (hover) {
          e.target.style.transform = 'translateY(0px)';
          e.target.style.boxShadow = theme.shadows.glass;
        }
      }}
    >
      {children}
    </div>
  );
};

export default ModernCard;