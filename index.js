import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {firebase} from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBpzgc1rCN8ASXDMSzCxoB0f-IhOyI0ZFg',
  authDomain: 'searchkro-d6ff3.firebaseapp.com',
  projectId: 'searchkro-d6ff3',
  storageBucket: 'searchkro-d6ff3.firebasestorage.app',
  messagingSenderId: '872169733649',
  appId: '1:872169733649:android:e8c6ff5c1811008b663bb0',
};

const initializeFirebaseApp = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('firebase Configured');
  }
};

initializeFirebaseApp();

AppRegistry.registerComponent(appName, () => App);
