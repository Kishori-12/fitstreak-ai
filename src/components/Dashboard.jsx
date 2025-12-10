import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useHabits } from '../hooks/useHabits';
import { generateMotivationalMessage } from '../services/ai';
import { exportData } from '../utils/storage';
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
import LoadingSpinner from './LoadingSpinner';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { theme } from '../styles/theme';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/soundEffects';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const { 
    habits, 
    rawHabits, 
    streak, 
    bestStreak, 
    completedCount, 
    petState, 
    completeHabit,
    loading 
  } = useHabits(user?.uid);
  
  // Mock data for enhanced features
  const customHabits = habits || [];
  const achievements = [];
  const totalHabitsCompleted = 0;
  const weeklyData = [];
  const updateCustomHabits = () => {};
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard();
  const [aiMessage, setAiMessage] = useState('Welcome to FitStreak AI! 🌟');
  const [currentView, setCurrentView] = useState('dashboard');
  const [analyticsView, setAnalyticsView] = useState('daily');


  useEffect(() => {
    if (!loading && user) {
      loadAIMessage();
    }
  }, [completedCount, streak, loading]);

  const loadAIMessage = async () => {
    const message = await generateMotivationalMessage(completedCount, streak);
    setAiMessage(message);
  };

  const handleHabitComplete = (habitId) => {
    console.log('🎯 handleHabitComplete called with habitId:', habitId);
    completeHabit(habitId);
    try { playSound('toast'); } catch {};
    toast.success('Great job! 🎉');
    
    const newCompletedCount = completedCount + 1;
    if (newCompletedCount === 5) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: [theme.colors.neutral[50], theme.colors.neutral[100], theme.colors.neutral[200], theme.colors.primary.light]
      });
      try {
        playSound('complete');
      } catch (e) {
        console.log('Sound play failed', e);
      }
      try { playSound('toast'); } catch {};
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

  const handleExportData = () => {
    const exportData = {
      user: {
        uid: user?.uid,
        email: user?.email,
        displayName: user?.displayName
      },
      habits: rawHabits,
      stats: {
        streak,
        bestStreak,
        totalHabitsCompleted: Object.values(rawHabits || {}).reduce((total, day) => 
          total + Object.values(day).filter(Boolean).length, 0
        )
      },
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitstreak-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    try { playSound('toast'); } catch {};
    toast.success('Data exported successfully! 📥');
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
        <LoadingSpinner size="lg" message="Loading your pet... 🐱" />
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
                color: theme.colors.text.primary,
                margin: '0 0 8px 0',
                letterSpacing: '-0.02em'
              }}>FitStreak AI</h1>
              <p style={{
                color: theme.colors.text.secondary,
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
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={async () => {
                    // Call Firebase logout function
                    const result = await logout();
                    if (result.success) {
                      // Clear local storage after successful logout
                      localStorage.clear();
                      sessionStorage.clear();
                      // Redirect to login
                      window.location.href = window.location.origin;
                    } else {
                      toast.error('Logout failed. Please try again.');
                    }
                  }}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  🚪 Logout
                </button>
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
                background: theme.colors.secondary.light
              }}>
                <div style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: theme.colors.accent.main,
                  marginBottom: '12px',
                  letterSpacing: '-0.02em'
                }}>{streak}</div>
                <div style={{
                  color: theme.colors.text.secondary,
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
                  color: theme.colors.accent.dark,
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

            {/* Recommendations Section */}
            <Recommendations 
              streak={streak}
              completedCount={completedCount}
              bestStreak={bestStreak}
              totalHabits={0}
              customHabits={habits}
            />



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
              <Pet 
              state={petState} 
              message={aiMessage} 
              streak={streak}
              totalHabits={0}
            />
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
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px'
              }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: theme.colors.text.primary,
                  margin: 0
                }}>Today's Habits</h2>
                

              </div>
              
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

        {/* Enhanced Profile View */}
        {currentView === 'profile' && (
          <div style={{
            background: theme.colors.background.card,
            backdropFilter: 'blur(10px)',
            borderRadius: '25px',
            padding: '40px',
            boxShadow: theme.shadows.glass,
            marginBottom: '20px',
            border: `1px solid ${theme.colors.primary.light}`
          }}>
            {/* Profile Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: theme.colors.primary.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                margin: '0 auto 20px',
                boxShadow: theme.shadows.lg
              }}>🐱</div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: theme.colors.accent.main,
                marginBottom: '8px'
              }}>{user?.displayName || 'Fitness Enthusiast'}</h2>
              <p style={{
                color: theme.colors.neutral[600],
                fontSize: '16px',
                marginBottom: '20px'
              }}>{user?.email}</p>
              <div style={{
                display: 'inline-flex',
                background: theme.colors.background.card,
                padding: '8px 16px',
                borderRadius: '20px',
                color: theme.colors.accent.main,
                fontWeight: '600',
                fontSize: '14px'
              }}>
                🏆 Habit Master Level {Math.floor(streak / 7) + 1}
              </div>
            </div>

            {/* Achievement Badges */}
              <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: theme.colors.accent.main,
                marginBottom: '20px',
                textAlign: 'center'
              }}>🏆 Achievement Badges</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '16px'
              }}>
                {[
                  { icon: '🌟', name: 'First Step', earned: true, desc: 'Completed first habit' },
                  { icon: '🔥', name: 'Week Warrior', earned: streak >= 7, desc: '7-day streak' },
                  { icon: '💎', name: 'Consistency King', earned: bestStreak >= 30, desc: '30-day streak' },
                  { icon: '🚀', name: 'Habit Master', earned: totalHabitsCompleted >= 100, desc: '100 total habits' }
                ].map((badge, index) => (
                  <div key={index} style={{
                    background: badge.earned ? theme.colors.warning.light : theme.colors.background.card,
                    border: `2px solid ${badge.earned ? theme.colors.warning.main : theme.colors.primary.main}`,
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'center',
                    opacity: badge.earned ? 1 : 0.6,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{badge.icon}</div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: badge.earned ? theme.colors.warning.dark : theme.colors.accent.main,
                      marginBottom: '4px'
                    }}>{badge.name}</div>
                    <div style={{
                      fontSize: '10px',
                      color: theme.colors.neutral[600]
                    }}>{badge.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
              <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {[
                { label: 'Current Streak', value: streak, icon: '🔥', color: theme.colors.accent.main, bg: theme.colors.background.card },
                { label: 'Best Streak', value: bestStreak, icon: '🏆', color: theme.colors.accent.main, bg: theme.colors.background.card },
                { label: 'Total Habits', value: totalHabitsCompleted, icon: '✅', color: theme.colors.accent.main, bg: theme.colors.background.card },
                { label: 'Success Rate', value: `${Math.round((completedCount / 5) * 100)}%`, icon: '📈', color: theme.colors.accent.main, bg: theme.colors.background.card }
              ].map((stat, index) => (
                <div key={index} style={{
                  background: stat.bg,
                  borderRadius: '20px',
                  padding: '24px',
                  textAlign: 'center',
                  border: `1px solid ${theme.colors.primary.main}`,
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{stat.icon}</div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: stat.color,
                    marginBottom: '8px'
                  }}>{stat.value}</div>
                  <div style={{
                    fontSize: '14px',
                    color: theme.colors.neutral[600],
                    fontWeight: '500'
                  }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Progress Calendar */}
            <div style={{
              background: theme.colors.background.card,
              borderRadius: '20px',
              padding: '24px',
              border: `1px solid ${theme.colors.primary.main}`
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: theme.colors.accent.main,
                marginBottom: '16px',
                textAlign: 'center'
              }}>📅 This Week's Progress</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '8px'
              }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <div key={index} style={{
                    textAlign: 'center',
                    padding: '12px 8px',
                    borderRadius: '12px',
                    background: index === new Date().getDay() ? theme.colors.accent.main : 'rgba(255,255,255,0.5)',
                    color: index === new Date().getDay() ? 'white' : theme.colors.accent.main
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>{day}</div>
                    <div style={{ fontSize: '16px' }}>{index <= new Date().getDay() ? '✅' : '⭕'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard View */}
        {currentView === 'leaderboard' && (
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
              color: theme.colors.text.primary,
              marginBottom: '25px',
              textAlign: 'center'
            }}>🏆 Leaderboard</h2>
            
            {!leaderboardLoading && leaderboard.map((player, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px 20px',
                borderRadius: '15px',
                background: player.userId === user?.uid 
                  ? `linear-gradient(135deg, ${theme.colors.neutral[100]} 0%, ${theme.colors.neutral[200]} 100%)`
                  : `linear-gradient(135deg, ${theme.colors.neutral[50]} 0%, ${theme.colors.neutral[100]} 100%)`,
                border: player.userId === user?.uid ? `2px solid ${theme.colors.primary.main}` : `1px solid ${theme.colors.neutral[200]}`,
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '24px', minWidth: '40px' }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                  <span style={{ fontSize: '32px' }}>{player.userId === user?.uid ? '🐱' : '👤'}</span>
                  <div>
                    <div style={{ fontWeight: '600', color: theme.colors.text.primary, fontSize: '16px' }}>
                      {player.userId === user?.uid ? `${user?.displayName || 'You'} (You)` : player.displayName}
                    </div>
                    <div style={{ color: theme.colors.text.secondary, fontSize: '14px' }}>Streak Champion</div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '8px 15px',
                  borderRadius: '12px'
                }}>
                  <span style={{ fontSize: '18px' }}>🔥</span>
                  <span style={{ fontWeight: 'bold', color: theme.colors.accent.main, fontSize: '18px' }}>{player.streak}</span>
                </div>
              </div>
            ))}
          </div>
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
              color: theme.colors.text.primary,
              marginBottom: '25px',
              textAlign: 'center'
            }}>⚙️ App Settings</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <ModernCard style={{ padding: '20px' }}>
                <h3 style={{ marginBottom: '15px', color: theme.colors.text.primary }}>Data Management</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <ModernButton onClick={handleExportData} icon="📥">
                    Export Data
                  </ModernButton>

                </div>
              </ModernCard>
              
              <ModernCard style={{ padding: '20px' }}>
                <h3 style={{ marginBottom: '15px', color: theme.colors.text.primary }}>Achievements</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: theme.colors.text.secondary
                  }}>
                    🏆 Achievements coming soon!
                  </div>
                </div>
              </ModernCard>
              
              <AppSettings />
            </div>
          </div>
        )}

        {/* AI Assistant View */}
        {currentView === 'assistant' && (
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
              color: theme.colors.text.primary,
              marginBottom: '25px',
              textAlign: 'center'
            }}>🤖 AI Fitness Assistant</h2>
            
            <AIAssistant isFullView={true} />
          </div>
        )}

        {/* Analytics View */}
        {currentView === 'analytics' && (
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
              color: theme.colors.text.primary,
              marginBottom: '25px',
              textAlign: 'center'
            }}>📊 Analytics Dashboard</h2>
            
            {/* Report Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '30px'
            }}>
              <div style={{
                display: 'flex',
                background: theme.colors.primary.light,
                borderRadius: '12px',
                padding: '4px'
              }}>
                <button 
                  onClick={() => setAnalyticsView('daily')}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: analyticsView === 'daily' ? theme.colors.secondary.dark : 'transparent',
                    color: analyticsView === 'daily' ? theme.colors.text.white : theme.colors.text.primary,
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >📅 Daily Report</button>
                <button 
                  onClick={() => setAnalyticsView('weekly')}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: analyticsView === 'weekly' ? theme.colors.secondary.dark : 'transparent',
                    color: analyticsView === 'weekly' ? theme.colors.text.white : theme.colors.text.primary,
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >📊 Weekly Report</button>
              </div>
            </div>
            
            {/* Daily Report */}
            {analyticsView === 'daily' && (
              <div style={{
                background: theme.colors.primary.light,
                borderRadius: '20px',
                padding: '24px',
                marginBottom: '24px',
                border: `1px solid ${theme.colors.primary.main}`
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: theme.colors.text.primary,
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>📅 Today's Progress</h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    background: theme.colors.background.card,
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: theme.colors.success.main, marginBottom: '4px' }}>
                      {completedCount}
                    </div>
                    <div style={{ fontSize: '14px', color: theme.colors.text.primary }}>Completed Today</div>
                  </div>
                  
                  <div style={{
                    background: theme.colors.background.card,
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔥</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: theme.colors.accent.main, marginBottom: '4px' }}>
                      {streak}
                    </div>
                    <div style={{ fontSize: '14px', color: theme.colors.text.primary }}>Current Streak</div>
                  </div>
                  
                  <div style={{
                    background: theme.colors.background.card,
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: theme.colors.warning.main, marginBottom: '4px' }}>
                      {Math.round((completedCount / 5) * 100)}%
                    </div>
                    <div style={{ fontSize: '14px', color: theme.colors.text.primary }}>Success Rate</div>
                  </div>
                </div>
                
                <div style={{
                  background: theme.colors.background.card,
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <h4 style={{ color: theme.colors.text.primary, marginBottom: '12px', textAlign: 'center' }}>Today's Habits</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {habits.map(habit => (
                      <div key={habit.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: habit.completed ? theme.colors.success.light : theme.colors.background.card,
                        borderRadius: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '20px' }}>{habit.icon}</span>
                          <span style={{ color: theme.colors.text.primary, fontSize: '14px' }}>{habit.name}</span>
                        </div>
                        <span style={{ fontSize: '16px' }}>{habit.completed ? '✅' : '⚪'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Weekly Report */}
            {analyticsView === 'weekly' && (
              <div style={{
                background: theme.colors.background.card,
                borderRadius: '20px',
                padding: '24px',
                marginBottom: '24px',
                border: `1px solid ${theme.colors.primary.main}`
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: theme.colors.text.primary,
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>📊 Weekly Overview</h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    background: theme.colors.background.card,
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: theme.colors.accent.main, marginBottom: '4px' }}>
                      {bestStreak}
                    </div>
                    <div style={{ fontSize: '14px', color: theme.colors.text.primary }}>Best Streak</div>
                  </div>
                  
                  <div style={{
                    background: theme.colors.background.card,
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: theme.colors.success.main, marginBottom: '4px' }}>
                      7
                    </div>
                    <div style={{ fontSize: '14px', color: theme.colors.text.primary }}>Days This Week</div>
                  </div>
                  
                  <div style={{
                    background: theme.colors.background.card,
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: theme.colors.warning.main, marginBottom: '4px' }}>
                      {Math.min(streak, 7)}
                    </div>
                    <div style={{ fontSize: '14px', color: theme.colors.text.primary }}>Active Days</div>
                  </div>
                </div>
                
                <div style={{
                  background: theme.colors.background.card,
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <h4 style={{ color: theme.colors.text.primary, marginBottom: '12px', textAlign: 'center' }}>Weekly Progress</h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '8px'
                  }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                      const isToday = index === new Date().getDay();
                      const isActive = index <= new Date().getDay() && streak > 0;
                      return (
                        <div key={day} style={{
                          textAlign: 'center',
                          padding: '12px 8px',
                          borderRadius: '8px',
                          background: isToday ? theme.colors.accent.main : isActive ? theme.colors.success.light : theme.colors.background.card,
                          color: isToday ? theme.colors.text.white : theme.colors.text.primary
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>{day}</div>
                          <div style={{ fontSize: '16px' }}>{isActive ? '✅' : '⚪'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            <Analytics 
              habits={rawHabits || {}}
              streak={streak}
              bestStreak={bestStreak}
              weeklyData={[]}
              totalHabits={0}
            />
          </div>
        )}

      </div>
      

    </div>
  );
};

export default Dashboard;