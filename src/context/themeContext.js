import React, {createContext, useState, useEffect} from 'react';
import {Appearance} from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme() || 'light');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      if (theme === 'SystemDefault') {
        setTheme(colorScheme);
      }
    });
    return () => subscription.remove();
  }, [theme]);

  const changeTheme = selectedTheme => {
    console.log('theme', theme);

    if (selectedTheme === 'SystemDefault') {
      setTheme(Appearance.getColorScheme());
    } else {
      setTheme(selectedTheme.toLowerCase());
    }
  };

  return (
    <ThemeContext.Provider value={{theme, changeTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
