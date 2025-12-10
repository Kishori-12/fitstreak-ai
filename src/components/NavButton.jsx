import { theme } from '../styles/theme';

const NavButton = ({ children, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        background: isActive 
          ? theme.colors.primary.main 
          : 'transparent',
        color: isActive 
          ? 'white' 
          : theme.colors.neutral[600],
        boxShadow: isActive 
          ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
          : 'none'
      }}
      onMouseOver={(e) => {
        if (!isActive) {
          e.target.style.background = theme.colors.neutral[100];
        }
      }}
      onMouseOut={(e) => {
        if (!isActive) {
          e.target.style.background = 'transparent';
        }
      }}
    >
      {children}
    </button>
  );
};

export default NavButton;