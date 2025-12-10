import { theme } from '../styles/theme';
import ModernCard from './ModernCard';
import ModernButton from './ModernButton';

const DemoTester = () => {
  const handleTest = (feature) => {
    alert(`Testing ${feature} - Feature coming soon!`);
  };

  return (
    <ModernCard style={{ padding: '20px' }}>
      <h3 style={{ color: theme.colors.primary.main, marginBottom: '15px' }}>🧪 Demo Tester</h3>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <ModernButton 
          variant="secondary" 
          size="sm"
          onClick={() => handleTest('Email Notifications')}
        >
          📧 Test Email
        </ModernButton>
        
        <ModernButton 
          variant="secondary" 
          size="sm"
          onClick={() => handleTest('SMS Notifications')}
        >
          📱 Test SMS
        </ModernButton>
        
        <ModernButton 
          variant="secondary" 
          size="sm"
          onClick={() => handleTest('AI Response')}
        >
          🤖 Test AI
        </ModernButton>
      </div>
    </ModernCard>
  );
};

export default DemoTester;