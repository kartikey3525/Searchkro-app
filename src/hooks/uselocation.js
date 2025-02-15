import React, { useEffect } from 'react';
import { PermissionsAndroid, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const LocationPermission = ({ setLocation }) => {
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This app needs to access your location.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        getLocation();
      } else {
        Alert.alert('Permission Denied', 'Location access is required.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app requires location access to function properly.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Location access is required.');
        return;
      }

      // Get location with a longer timeout and fallback options
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          console.log('User location:', latitude, longitude);
        },
        error => {
          console.error('Location error:', error);

          // Specific error handling
          switch (error.code) {
            case 1:
              Alert.alert('Permission Denied', 'Enable location permission.');
              break;
            case 2:
              Alert.alert('Location Unavailable', 'Turn on GPS or try again.');
              break;
            case 3:
              Alert.alert('Timeout', 'Try increasing timeout or check GPS.');
              break;
            default:
              Alert.alert('Error', error.message);
          }
        },
        {
          enableHighAccuracy: false, // Try setting false if high accuracy fails
          timeout: 60000, // Increase timeout from 35s to 60s
          maximumAge: 10000,
          distanceFilter: 10, // Get location updates every 10 meters
        },
      );
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  return null; // No UI needs to be rendered by this component
};

export default LocationPermission;
