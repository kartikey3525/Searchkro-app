import { useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

const useImagePicker = () => {
  const [media, setMedia] = useState([]);

  // Request permission for camera (Android only)
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'App Camera Permission',
            message: 'App needs access to your camera to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          launchCamera();
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      launchCamera();
    }
  };

  // Launch the camera to take a photo
  const launchCamera = () => {
    let options = {
      includeBase64: false,
      mediaType: 'photo',
      maxWidth: 400,
      maxHeight: 400,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        if (response.assets && response.assets.length > 0) {
          setMedia(prevMedia => [...prevMedia, { uri: response.assets[0].uri }]);
        }
      }
    });
  };

  // Launch image picker to select media
  const selectMedia = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 }, response => {
      if (response.assets) {
        setMedia(prevMedia => [...prevMedia, ...response.assets]);
      }
    });
  };

  return {
    media,
    selectMedia,
    launchCamera,
    requestCameraPermission,
    setMedia,
  };
};

export default useImagePicker;
