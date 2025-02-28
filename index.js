import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initializeApp, getApps} from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

// Function to request notification permission
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  if (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    console.log('🚀 Notification permission granted.');
  } else {
    console.log('⚠️ Notification permission denied.');
  }
};

// Call this function at the start of your app
requestUserPermission();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBpzgc1rCN8ASXDMSzCxoB0f-IhOyI0ZFg',
  authDomain: 'searchkro-d6ff3.firebaseapp.com',
  projectId: 'searchkro-d6ff3',
  storageBucket: 'searchkro-d6ff3.appspot.com', // Fixed storage bucket URL
  messagingSenderId: '872169733649',
  appId: '1:872169733649:android:e8c6ff5c1811008b663bb0',
};

// Initialize Firebase only if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
  console.log('Firebase initialized');
}

AppRegistry.registerComponent(appName, () => App);
