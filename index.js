import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initializeApp, getApps} from '@react-native-firebase/app';

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
