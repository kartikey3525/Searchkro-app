import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native'; // Added for status bar
import MainScreens from './src/navigation/MainScreens';
import { AuthProvider } from './src/context/authcontext';
import { ThemeProvider } from './src/context/themeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AuthProvider> 
            <MainScreens />
          </AuthProvider>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;