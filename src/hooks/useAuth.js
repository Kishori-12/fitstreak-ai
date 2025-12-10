import { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUserProfile = async (user) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        const userData = {
          userId: user.uid,
          email: user.email,
          displayName: user.displayName || user.email,
          username: user.displayName ? user.displayName : (user.email ? user.email.split('@')[0] : ''),
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          habits: {},
          streak: 0,
          bestStreak: 0,
          totalHabitsCompleted: 0,
          leaderboardScore: 0,
          leaderboardRank: 0,
          lastUpdate: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', user.uid), userData);
        console.log('User profile created in database');
      } else {
        // Update last login time
        await setDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date().toISOString()
        }, { merge: true });
        console.log('User login time updated');
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserProfile(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: error.message };
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Email sign-in error:', error);
      return { success: false, error: error.message };
    }
  };

  // username is optional; do NOT store plaintext passwords in Firestore
  const registerWithEmail = async (email, password, username = '') => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // set displayName on the Firebase Auth user profile if provided
      if (username) {
        try {
          await updateProfile(result.user, { displayName: username });
        } catch (err) {
          console.warn('Failed to set displayName on auth profile', err);
        }
      }
      await createUserProfile(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  return { user, loading, signInWithGoogle, signInWithEmail, registerWithEmail, resetPassword, logout };
};