import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabs from './src/navigation/BottomTabs';
import MainScreens from './src/navigation/MainScreens';
import {AuthProvider} from './src/context/authcontext';
import {ThemeProvider} from './src/context/themeContext';

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AuthProvider>
          <MainScreens />
        </AuthProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
