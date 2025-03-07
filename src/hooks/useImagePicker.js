import {useContext, useState} from 'react';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {AuthContext} from '../context/authcontext';

const useImagePicker = () => {
  const {userdata, apiURL} = useContext(AuthContext);
  const [media, setMedia] = useState([]);

  // Function to upload image and get URL
  const uploadImage = async uri => {
    try {
      console.log('Starting image upload for URI:', uri);

      const formData = new FormData();
      formData.append('image', {
        uri: uri,
        name: `photo_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });

      console.log('FormData prepared:', formData);

      const headers = {
        Authorization: `Bearer ${userdata.token}`,
        'Content-Type': 'multipart/form-data',
      };

      console.log('Sending request to:', `${apiURL}/api/user/uploadImage`);
      console.log('Headers:', headers);

      const response = await axios.post(
        `${apiURL}/api/user/uploadImage`,
        formData,
        {headers},
      );

      console.log('Upload response received:', response.status, response.data);

      if (response.status === 200 && response.data?.data) {
        return response.data.data[0]; // Assuming API returns an array of URLs
      } else {
        console.error('Failed to upload image:', response.data);
        Alert.alert('Upload Failed', 'Please try again later.');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);

      if (error.response) {
        console.error('Server responded with:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }

      Alert.alert(
        'Upload Failed',
        'An error occurred while uploading the image.',
      );
      return null;
    }
  };

  // Request camera permission (Android only)
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
  const launchCamera = async () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 400,
      maxHeight: 400,
    };

    ImagePicker.launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        if (response.assets && response.assets.length > 0) {
          const localUri = response.assets[0].uri;
          const uploadedUrl = await uploadImage(localUri);
          if (uploadedUrl) {
            setMedia(prevMedia => [...prevMedia, uploadedUrl]); // Add new URL to the array
          }
        }
      }
    });
  };

  // Launch image picker to select media
  const selectMedia = async () => {
    ImagePicker.launchImageLibrary(
      {mediaType: 'photo', selectionLimit: 10}, // Allow multiple selection
      async response => {
        if (response.assets && response.assets.length > 0) {
          const uploadedUrls = await Promise.all(
            response.assets.map(async asset => {
              const uploadedUrl = await uploadImage(asset.uri);
              return uploadedUrl;
            }),
          );

          const validUrls = uploadedUrls.filter(url => url !== null);
          if (validUrls.length > 0) {
            setMedia(prevMedia => [...prevMedia, ...validUrls]); // Append multiple URLs
          }
        }
      },
    );
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
