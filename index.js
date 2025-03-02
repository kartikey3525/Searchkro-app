import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initializeApp, getApps} from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import {OneSignal} from 'react-native-onesignal';
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
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

// handleNotification = notification => async () => {
//   console.log('Device State:');

//   OneSignal.initialize('016f7214-9a7e-407a-922c-82a83b6f1fa6');

//   OneSignal.promptForPushNotificationsWithUserResponse(response => {
//     console.log('Notification permission:', response);
//   });

//   const deviceState = await OneSignal.User.getDeviceState();
//   console.log('Push Token:', deviceState.userId);

//   OneSignal.User.getDeviceState()
//     .then(deviceState => {
//       console.log('Device State:', deviceState);
//       if (!deviceState.isSubscribed) {
//         console.log(
//           'User is not subscribed. Ensure push permissions are granted.',
//         );
//       }
//     })
//     .catch(error => {
//       console.error('Error fetching device state:', error);
//     });

//   OneSignal.setNotificationWillShowInForegroundHandler(
//     notificationReceivedEvent => {
//       let notification = notificationReceivedEvent.getNotification();
//       console.log('Notification received:', notification);
//       notificationReceivedEvent.complete(notification);
//     },
//   );
// };



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
