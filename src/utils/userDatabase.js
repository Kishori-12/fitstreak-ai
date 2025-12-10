// Mock user database for leaderboard
export const getAllUsers = () => {
  const currentUser = JSON.parse(localStorage.getItem('fitstreak_demo_user') || '{}');
  const currentUserStreak = parseInt(localStorage.getItem('fitstreak_current_streak') || '0');
  
  // Get all registered users from localStorage
  const allUsers = JSON.parse(localStorage.getItem('fitstreak_all_users') || '[]');
  
  // Default users if none exist
  const defaultUsers = [
    { 
      uid: 'user_1', 
      displayName: 'Sarah Johnson', 
      email: 'sarah@example.com',
      streak: 15, 
      totalHabits: 75,
      joinDate: '2024-01-15',
      avatar: '👩'
    },
    { 
      uid: 'user_2', 
      displayName: 'Mike Chen', 
      email: 'mike@example.com',
      streak: 12, 
      totalHabits: 60,
      joinDate: '2024-01-20',
      avatar: '👨'
    },
    { 
      uid: 'user_3', 
      displayName: 'Emma Wilson', 
      email: 'emma@example.com',
      streak: 10, 
      totalHabits: 50,
      joinDate: '2024-02-01',
      avatar: '👩'
    },
    { 
      uid: 'user_4', 
      displayName: 'Alex Rodriguez', 
      email: 'alex@example.com',
      streak: 8, 
      totalHabits: 40,
      joinDate: '2024-02-10',
      avatar: '👨'
    },
    { 
      uid: 'user_5', 
      displayName: 'Lisa Park', 
      email: 'lisa@example.com',
      streak: 6, 
      totalHabits: 30,
      joinDate: '2024-02-15',
      avatar: '👩'
    }
  ];
  
  // Combine current user with all users
  const users = allUsers.length > 0 ? allUsers : defaultUsers;
  
  // Add current user if they exist
  if (currentUser.uid) {
    const currentUserData = {
      uid: currentUser.uid,
      displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'You',
      email: currentUser.email || 'demo@fitstreak.ai',
      streak: currentUserStreak,
      totalHabits: currentUserStreak * 3, // Estimate based on streak
      joinDate: new Date().toISOString().split('T')[0],
      avatar: '🐱',
      isCurrentUser: true
    };
    
    // Remove existing current user and add updated one
    const otherUsers = users.filter(u => u.uid !== currentUser.uid && !u.isCurrentUser);
    users.splice(0, users.length, ...otherUsers, currentUserData);
  }
  
  // Sort by streak (descending) and return with rankings
  return users
    .sort((a, b) => b.streak - a.streak)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
      score: user.streak * 100 + user.totalHabits * 2
    }));
};

export const updateUserStreak = (userId, newStreak) => {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.uid === userId);
  
  if (userIndex !== -1) {
    users[userIndex].streak = newStreak;
    users[userIndex].totalHabits = newStreak * 3;
    localStorage.setItem('fitstreak_all_users', JSON.stringify(users));
  }
  
  if (userId === JSON.parse(localStorage.getItem('fitstreak_demo_user') || '{}').uid) {
    localStorage.setItem('fitstreak_current_streak', newStreak.toString());
  }
};