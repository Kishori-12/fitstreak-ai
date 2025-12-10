import { useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { playSound } from '../utils/soundEffects';

const DatabaseTest = () => {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState('');

  const testConnection = async () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    setTesting(true);
    setResult('Testing database connection...');

    try {
      console.log('Testing with user:', user.uid);
      console.log('Database instance:', db);
      
      // Force write test data
      const testData = {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName || user.email,
        testTimestamp: new Date().toISOString(),
        testMessage: 'Database connection test successful!',
        habits: {
          '2025-12-02': {
            water: true,
            steps: true,
            sleep: false,
            meditation: false,
            medicine: false
          }
        },
        streak: 1,
        bestStreak: 1,
        totalHabitsCompleted: 2
      };
      
      console.log('Writing test data:', testData);
      await setDoc(doc(db, 'users', user.uid), testData);
      setResult('✅ Write test passed');
      console.log('Write successful');

      // Test read
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        console.log('Read successful:', docSnap.data());
          setResult('✅ Database connection working perfectly!');
          try { playSound('toast'); } catch {}
          toast.success('Database connected successfully!');
      } else {
        setResult('❌ Read test failed');
        try { playSound('toast'); } catch {}
        toast.error('Database read failed');
      }
    } catch (error) {
      console.error('Database test error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setResult(`❌ Database error: ${error.message}`);
      try { playSound('toast'); } catch {}
      toast.error('Database connection failed');
    }

    setTesting(false);
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      margin: '20px 0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3>Database Connection Test</h3>
      <button 
        onClick={testConnection}
        disabled={testing || !user}
        style={{
          background: testing ? '#ccc' : '#0EA5E9',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: testing ? 'not-allowed' : 'pointer',
          marginBottom: '10px'
        }}
      >
        {testing ? 'Testing...' : 'Test Database'}
      </button>
      {result && (
        <div style={{
          padding: '10px',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontFamily: 'monospace'
        }}>
          {result}
        </div>
      )}
    </div>
  );
};

export default DatabaseTest;