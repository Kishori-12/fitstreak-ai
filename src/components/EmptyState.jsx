import { theme } from '../styles/theme';
import ModernButton from './ModernButton';

const EmptyState = ({ 
  icon = '🌟', 
  title = 'Nothing here yet', 
  description = 'Start your journey today!',
  actionText,
  onAction
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      color: theme.colors.neutral[600]
    }}>
      <div style={{ fontSize: '80px', marginBottom: '20px' }}>{icon}</div>
      <h3 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: theme.colors.neutral[800],
        marginBottom: '12px'
      }}>{title}</h3>
      <p style={{
        fontSize: '16px',
        lineHeight: '1.5',
        marginBottom: '30px',
        maxWidth: '400px',
        margin: '0 auto 30px'
      }}>{description}</p>
      {actionText && onAction && (
        <ModernButton onClick={onAction}>
          {actionText}
        </ModernButton>
      )}
    </div>
  );
};

export default EmptyState;