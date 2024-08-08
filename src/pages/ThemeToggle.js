// src/components/ThemeToggle.js
import React from 'react';
import { useTheme } from './context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} variant="primary" className="d-flex align-items-center">
      <span className=""> {/* Optional: Add text if needed */} </span>
      <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
    </Button>
  );
};

export default ThemeToggle;
