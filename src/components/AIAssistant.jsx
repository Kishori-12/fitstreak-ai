import { useState } from 'react';
import { theme } from '../styles/theme';
import ModernCard from './ModernCard';
import ModernButton from './ModernButton';

const AIAssistant = ({ isFullView = false }) => {
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Hello! I\'m your AI fitness assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { type: 'user', text: input }]);
    
    // Simple AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: 'ai', 
        text: 'Thanks for your message! Keep up the great work with your habits! 💪' 
      }]);
    }, 1000);
    
    setInput('');
  };

  return (
    <ModernCard style={{ padding: '20px' }}>
      <div style={{ height: isFullView ? '400px' : '200px', overflowY: 'auto', marginBottom: '15px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            marginBottom: '10px',
            padding: '10px',
            borderRadius: '10px',
            background: msg.type === 'ai' ? theme.colors.primary.main : theme.colors.neutral[200],
            color: msg.type === 'ai' ? 'white' : theme.colors.neutral[700],
            alignSelf: msg.type === 'ai' ? 'flex-start' : 'flex-end'
          }}>
            {msg.text}
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything about fitness..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: `1px solid ${theme.colors.neutral[300]}`,
            fontSize: '14px'
          }}
        />
        <ModernButton onClick={handleSend}>Send</ModernButton>
      </div>
    </ModernCard>
  );
};

export default AIAssistant;