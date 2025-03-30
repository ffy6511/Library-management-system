import React, { useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import { useTheme } from '../context/ThemeContext';
import { BsSunFill, BsMoonStarsFill } from 'react-icons/bs';
import styles from './ThemeToggle.module.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleThemeToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Tooltip title={theme === 'light' ? 'Switch to dark theme' : 'Switch to the light theme'} placement="right">
      <button 
        className={styles.themeToggle} 
        onClick={handleThemeToggle}
        aria-label="Toggle theme"
      >
        <div className={`${styles.icon} ${isAnimating ? (theme === 'dark' ? styles.entering : styles.leaving) : ''}`}>
          {theme === 'dark' ? <BsMoonStarsFill /> : <BsSunFill />}
        </div>
      </button>
    </Tooltip>
  );
};

export default ThemeToggle;