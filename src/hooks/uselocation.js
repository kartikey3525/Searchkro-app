import React, { useEffect } from 'react';
import {PermissionsAndroid, Alert, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const LocationPermission = ({ setLocation }) => {
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
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
      } else {
        getLocation(); // iOS handles permissions automatically
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = async () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation({latitude, longitude});
          console.log('User location:', latitude, longitude);
        },
        error => {
          console.error('Location error:', error);

          // Handle specific error codes
          switch (error.code) {
            case 1:
              Alert.alert('Permission Denied', 'Enable location permission.');
              break;
            case 2:
              Alert.alert('Location Unavailable', 'Turn on GPS or try again.');
              break;
            case 3:
              Alert.alert(
                'Timeout',
                'Location request timed out. Ensure GPS is enabled and try again.',
              );
              break;
            default:
              Alert.alert('Error', error.message);
          }
        },
        {
          enableHighAccuracy: true, // Enable high accuracy for better results
          timeout: 100000, // Increase timeout (100s)
          maximumAge: 0, // Get fresh location, no caching
          distanceFilter: 10, // Update every 10 meters
        },
      );
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  return null; // No UI needed for this component
};

export default LocationPermission;
