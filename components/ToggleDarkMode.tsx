'use client';

import { useEffect, useState } from 'react';
import {  MoonIcon,  SunIcon } from 'lucide-react';

const ToggleDarkMode: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On mount, load theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
        <button
          onClick={toggleDarkMode}
          className="relative  flex items-center justify-between w-16 h-8 p-1 bg-gray-300 dark:bg-gray-600 rounded-full transition-all duration-300"
        >

          <span
            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${isDarkMode ? 'translate-x-8' : 'translate-x-0'}`}
          >
            {!isDarkMode ? (<MoonIcon className="h-6 w-6  text-blue-500" />) : <SunIcon className="h-6 w-6  dark:text-yellow-500" />}
          </span>
        </button>
  );
};

export default ToggleDarkMode;