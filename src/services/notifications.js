import { messaging, VAPID_KEY, getToken, onMessage } from '../firebase.js';

export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) return null;
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return await getToken(messaging, { vapidKey: VAPID_KEY });
    }
  } catch (error) {
    console.log('Notification permission error:', error);
  }
  return null;
};

export const setupMessageListener = () => {
  try {
    onMessage(messaging, (payload) => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/favicon.ico'
        });
      }
    });
  } catch (error) {
    console.log('Message listener error:', error);
  }
};

export const sendHabitReminder = (habitName) => {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(`Time for ${habitName}!`, {
        body: 'Keep your streak alive! 🔥',
        icon: '/favicon.ico',
        tag: 'habit-reminder'
      });
    } else {
      console.log('Notification permission not granted');
    }
  } else {
    console.log('Notifications not supported');
  }
};