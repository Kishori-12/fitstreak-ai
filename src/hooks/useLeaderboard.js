import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      // First get all users ordered by score
      const q = query(
        collection(db, 'users'),
        orderBy('leaderboardScore', 'desc'),
        orderBy('streak', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const leaderboardData = [];
      
      querySnapshot.forEach((doc, index) => {
        const data = doc.data();
        leaderboardData.push({
          userId: doc.id,
          displayName: data.displayName || data.email || 'Anonymous',
          streak: data.streak || 0,
          leaderboardScore: data.leaderboardScore || 0,
          totalHabitsCompleted: data.totalHabitsCompleted || 0,
          rank: index + 1,
          createdAt: data.createdAt
        });
      });
      
      // Update ranks in database for all users
      const updatePromises = leaderboardData.map((user, index) => 
        updateDoc(doc(db, 'users', user.userId), { 
          leaderboardRank: index + 1,
          lastRankUpdate: new Date().toISOString()
        })
      );
      
      await Promise.all(updatePromises);
      setLeaderboard(leaderboardData); // Show all users returned by query
      console.log('Leaderboard updated with', leaderboardData.length, 'users');
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Fallback: get users without ordering if compound index doesn't exist
      try {
        const fallbackQ = query(collection(db, 'users'), limit(10));
        const fallbackSnapshot = await getDocs(fallbackQ);
        const fallbackData = [];
        
        fallbackSnapshot.forEach((doc, index) => {
          const data = doc.data();
          fallbackData.push({
            userId: doc.id,
            displayName: data.displayName || data.email || 'Anonymous',
            streak: data.streak || 0,
            leaderboardScore: data.leaderboardScore || 0,
            totalHabitsCompleted: data.totalHabitsCompleted || 0,
            rank: index + 1
          });
        });
        
        setLeaderboard(fallbackData);
      } catch (fallbackError) {
        console.error('Fallback leaderboard error:', fallbackError);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
    // Refresh leaderboard every 5 minutes
    const interval = setInterval(fetchLeaderboard, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { leaderboard, loading, refreshLeaderboard: fetchLeaderboard };
};