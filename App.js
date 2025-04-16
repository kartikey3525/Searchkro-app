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
            <StatusBar
              barStyle="default" // Adjust based on theme later
              backgroundColor="transparent" // Prevent solid color overlap
              translucent={true} // Allow UI to render under status bar
            />
            <MainScreens />
          </AuthProvider>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;