import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useHabits } from '../hooks/useHabits';
import { generateMotivationalMessage } from '../services/ai';

import Pet from './Pet';
import HabitCard from './HabitCard';
import AppSettings from './AppSettings';
import AIAssistant from './AIAssistant';
import DemoTester from './DemoTester';
import Recommendations from './Recommendations';
import Analytics from './Analytics';
import NavButton from './NavButton';
import ModernCard from './ModernCard';
import ModernButton from './ModernButton';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { theme } from '../styles/theme';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { habits, streak, bestStreak, completedCount, petState, completeHabit, loading, rawHabits } = useHabits(user?.uid);
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard();
  const [aiMessage, setAiMessage] = useState('Welcome to FitStreak AI! 🌟');
  const [totalHabitsCompleted, setTotalHabitsCompleted] = useState(0);
  const [currentView, setCurrentView] = useState('dashboard');


  useEffect(() => {
    if (!loading && user) {
      loadAIMessage();
      loadTotalHabits();

    }
  }, [completedCount, streak, loading]);

  const loadTotalHabits = () => {
    const userDataKey = `fitstreak_habits_${user?.uid}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
    const habits = userData.habits || {};
    
    let total = 0;
    Object.values(habits).forEach(dayHabits => {
      total += Object.values(dayHabits).filter(Boolean).length;
    });
    
    setTotalHabitsCompleted(total);
  };

  const loadAIMessage = async () => {
    const message = await generateMotivationalMessage(completedCount, streak);
    setAiMessage(message);
  };

  const handleHabitComplete = (habitId) => {
    completeHabit(habitId);
    setTotalHabitsCompleted(prev => prev + 1);
    toast.success('Great job! 🎉');
    
    const newCompletedCount = completedCount + 1;
    if (newCompletedCount === 5) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: [theme.colors.neutral[50], theme.colors.neutral[100], theme.colors.neutral[200], theme.colors.primary.light]
      });
      toast.success('Amazing! All habits completed! 🎆🎉', {
        duration: 4000,
        style: {
          background: theme.colors.background.main,
          color: theme.colors.primary.main,
          fontWeight: '600'
        }
      });
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.colors.background.main
      }}>
        <div style={{
          color: theme.colors.primary.main,
          fontSize: '20px',
          fontWeight: '600'
        }}>Loading your pet... 🐱</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.colors.background.main,
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <ModernCard style={{
          padding: '24px 32px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: '700',
                background: theme.colors.primary.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 8px 0',
                letterSpacing: '-0.02em'
              }}>FitStreak AI</h1>
              <p style={{
                color: theme.colors.neutral[600],
                fontSize: '16px',
                margin: '0',
                fontWeight: '500'
              }}>Welcome back, {user?.displayName || 'Friend'}! 👋</p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              flex: 1
            }}>
              {/* Main Navigation */}
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '6px',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.neutral[200]}`
              }}>
                <NavButton isActive={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')}>
                  🏠 Dashboard
                </NavButton>
                
                <NavButton isActive={currentView === 'analytics'} onClick={() => setCurrentView('analytics')}>
                  📊 Analytics
                </NavButton>
                
                <NavButton isActive={currentView === 'leaderboard'} onClick={() => setCurrentView('leaderboard')}>
                  🏆 Leaderboard
                </NavButton>
                
                <NavButton isActive={currentView === 'assistant'} onClick={() => setCurrentView('assistant')}>
                  🤖 AI
                </NavButton>
                
                <NavButton isActive={currentView === 'settings'} onClick={() => setCurrentView('settings')}>
                  ⚙️ Settings
                </NavButton>
                
                <NavButton isActive={currentView === 'profile'} onClick={() => setCurrentView('profile')}>
                  👤 Profile
                </NavButton>
              </div>
              
              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <ModernButton
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                  icon="🚪"
                >
                  Logout
                </ModernButton>
              </div>
            </div>
          </div>
        </ModernCard>

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              <ModernCard hover style={{
                padding: '28px',
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.colors.primary.main}15 0%, ${theme.colors.primary.light}10 100%)`
              }}>
                <div style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: theme.colors.primary.main,
                  marginBottom: '12px',
                  letterSpacing: '-0.02em'
                }}>{streak}</div>
                <div style={{
                  color: theme.colors.neutral[600],
                  fontSize: '15px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Current Streak 🔥</div>
              </ModernCard>
              
              <ModernCard hover style={{
                padding: '28px',
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.colors.secondary.main}15 0%, ${theme.colors.secondary.light}10 100%)`
              }}>
                <div style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: theme.colors.secondary.main,
                  marginBottom: '12px',
                  letterSpacing: '-0.02em'
                }}>{bestStreak}</div>
                <div style={{
                  color: theme.colors.neutral[600],
                  fontSize: '15px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Best Streak 🏆</div>
              </ModernCard>
              
              <ModernCard hover style={{
                padding: '28px',
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.colors.success.main}15 0%, ${theme.colors.success.light}10 100%)`
              }}>
                <div style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: theme.colors.success.main,
                  marginBottom: '12px',
                  letterSpacing: '-0.02em'
                }}>{completedCount}/5</div>
                <div style={{
                  color: theme.colors.neutral[600],
                  fontSize: '15px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Today's Progress</div>
              </ModernCard>
            </div>

            {/* Pet Section */}
            <div style={{
              background: theme.colors.background.card,
              backdropFilter: 'blur(10px)',
              borderRadius: '25px',
              padding: '40px',
              marginBottom: '30px',
              boxShadow: theme.shadows.glass,
              textAlign: 'center',
              border: `1px solid ${theme.colors.neutral[200]}`
            }}>
              <Pet state={petState} message={aiMessage} />
            </div>

            {/* Habits Section */}
            <div style={{
              background: theme.colors.background.card,
              backdropFilter: 'blur(10px)',
              borderRadius: '25px',
              padding: '30px',
              boxShadow: theme.shadows.glass,
              border: `1px solid ${theme.colors.neutral[200]}`
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                background: theme.colors.primary.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '25px',
                textAlign: 'center'
              }}>Today's Habits</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {habits.map((habit, index) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onComplete={handleHabitComplete}
                    isLastHabit={index === habits.length - 1}
                    completedCount={completedCount}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Settings View */}
        {currentView === 'settings' && (
          <div style={{
            background: theme.colors.background.card,
            backdropFilter: 'blur(10px)',
            borderRadius: '25px',
            padding: '30px',
            boxShadow: theme.shadows.glass,
            marginBottom: '20px',
            border: `1px solid ${theme.colors.neutral[200]}`
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              background: theme.colors.primary.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '25px',
              textAlign: 'center'
            }}>⚙️ App Settings</h2>
            
            <AppSettings />
          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;