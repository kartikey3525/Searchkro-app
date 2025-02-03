import React, {createContext, useState, useEffect} from 'react';
import {Appearance} from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const colorScheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{isDarkMode, setIsDarkMode}}>
      {children}
    </ThemeContext.Provider>
  );
};
