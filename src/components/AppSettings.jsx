import { useState, useEffect } from 'react';
import { playSound } from '../utils/soundEffects';
import { theme } from '../styles/theme';
import ModernCard from './ModernCard';
import ModernButton from './ModernButton';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../config/firebase';

const AppSettings = () => {
  const [settings, setSettings] = useState({
    animations: true,
    sound: true,
    autoReset: true,
    notifications: true,
    reminderTime: '09:00',
    petName: 'FitPet',
    theme: 'light',
    username: ''
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('fitstreak_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // removed theme application - dark-mode feature disabled in settings
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('fitstreak_settings', JSON.stringify(newSettings));
    try { playSound('toast'); } catch {}
    if (key === 'theme') {
      if (value === 'dark') setDark(true);
      else if (value === 'light') setDark(false);
      else if (value === 'auto') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDark(prefersDark);
      }
    }
    toast.success('Settings updated!');
  };

  const resetSettings = () => {
    const defaultSettings = {
      animations: true,
      sound: true,
      autoReset: true,
      notifications: true,
      reminderTime: '09:00',
      petName: 'FitPet',
      theme: 'light'
    };
    setSettings(defaultSettings);
    localStorage.setItem('fitstreak_settings', JSON.stringify(defaultSettings));
    try { playSound('toast'); } catch {}
    toast.success('Settings reset to default!');
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fitstreak-settings.json';
    link.click();
    try { playSound('toast'); } catch {}
    toast.success('Settings exported!');
  };

  const { user } = useAuth();

  useEffect(() => {
    // When settings load, populate username from saved settings or user profile
    const saved = localStorage.getItem('fitstreak_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(prev => ({ ...prev, ...parsed }));
    } else if (user) {
      setSettings(prev => ({ ...prev, username: user.displayName || '' }));
    }
  }, [user]);

  // Update username (both Auth profile and Firestore users collection)
  const updateUsername = async () => {
    const newUsername = settings.username && settings.username.trim();
    if (!newUsername) {
      try { playSound('toast'); } catch {}
      toast.error('Username cannot be empty');
      return;
    }

    // Basic validation
    if (newUsername.length < 3) {
      try { playSound('toast'); } catch {}
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (!user) {
      try { playSound('toast'); } catch {}
      toast.error('You must be logged in to update username');
      return;
    }

    try {
      // Check uniqueness
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', newUsername));
      const snapshot = await getDocs(q);
      const conflict = snapshot.docs.some(d => d.id !== user.uid);
      if (conflict) {
        try { playSound('toast'); } catch {}
        toast.error('Username is already taken');
        return;
      }

      // Update Auth profile
      try {
        await updateProfile(auth.currentUser, { displayName: newUsername });
      } catch (err) {
        console.warn('Failed to update auth displayName', err);
      }

      // Update Firestore user doc
      await updateDoc(doc(db, 'users', user.uid), {
        username: newUsername,
        displayName: newUsername,
        lastUpdate: new Date().toISOString()
      });

      // Persist to local settings
      const newSettings = { ...settings, username: newUsername };
      setSettings(newSettings);
      localStorage.setItem('fitstreak_settings', JSON.stringify(newSettings));

      try { playSound('toast'); } catch {}
      toast.success('Username updated successfully');
    } catch (error) {
      console.error('Failed to update username:', error);
      try { playSound('toast'); } catch {}
      toast.error('Failed to update username');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ModernCard style={{ padding: '20px' }}>
        <h3 style={{ color: theme.colors.primary.main, marginBottom: '15px' }}>🎛️ App Preferences</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontWeight: '500' }}>✨ Enable animations</span>
            <input
              type="checkbox"
              checked={settings.animations}
              onChange={(e) => updateSetting('animations', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: theme.colors.primary.main }}
            />
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontWeight: '500' }}>🔊 Sound effects</span>
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={(e) => updateSetting('sound', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: theme.colors.primary.main }}
            />
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontWeight: '500' }}>🔄 Auto-reset habits daily</span>
            <input
              type="checkbox"
              checked={settings.autoReset}
              onChange={(e) => updateSetting('autoReset', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: theme.colors.primary.main }}
            />
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontWeight: '500' }}>🔔 Push notifications</span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSetting('notifications', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: theme.colors.primary.main }}
            />
          </label>
        </div>
      </ModernCard>

      <ModernCard style={{ padding: '20px' }}>
        <h3 style={{ color: theme.colors.primary.main, marginBottom: '15px' }}>⏰ Reminders</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Daily reminder time</span>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => updateSetting('reminderTime', e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.colors.neutral[300]}`,
                fontSize: '14px'
              }}
            />
          </label>
        </div>
      </ModernCard>

      <ModernCard style={{ padding: '20px' }}>
        <h3 style={{ color: theme.colors.primary.main, marginBottom: '15px' }}>🐱 Personalization</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Pet name</span>
            <input
              type="text"
              value={settings.petName}
              onChange={(e) => updateSetting('petName', e.target.value)}
              placeholder="Enter pet name"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.colors.neutral[300]}`,
                fontSize: '14px',
                width: '120px'
              }}
            />
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Username</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={settings.username}
                onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Choose a username"
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.neutral[300]}`,
                  fontSize: '14px',
                  width: '160px'
                }}
              />
              <button
                onClick={updateUsername}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: theme.colors.primary.main,
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >Save</button>
            </div>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>App theme</span>
            <select
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.colors.neutral[300]}`,
                fontSize: '14px',
                width: '120px'
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </label>
        </div>
      </ModernCard>

      <ModernCard style={{ padding: '20px' }}>
        <h3 style={{ color: theme.colors.primary.main, marginBottom: '15px' }}>🔧 Actions</h3>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <ModernButton onClick={exportSettings} icon="📥" variant="secondary" size="sm">
            Export Settings
          </ModernButton>
          
          <ModernButton onClick={resetSettings} icon="🔄" variant="outline" size="sm">
            Reset to Default
          </ModernButton>
        </div>
      </ModernCard>
    </div>
  );
};

export default AppSettings;