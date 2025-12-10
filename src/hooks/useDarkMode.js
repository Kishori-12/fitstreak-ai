import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('fitstreak-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('fitstreak-dark-mode', JSON.stringify(isDark));
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggle = () => setIsDark(!isDark);

  const setDark = (value) => setIsDark(Boolean(value));

  return { isDark, toggle, setDark };
};