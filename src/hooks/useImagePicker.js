import {useContext, useState} from 'react';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {AuthContext} from '../context/authcontext';

const useImagePicker = () => {
  const {userdata, apiURL} = useContext(AuthContext);
  const [media, setMedia] = useState([]);

  const uploadImage = async (uri, mimeType = 'image/jpeg') => {
    try {
      console.log('Starting image upload for URI:', uri, 'Type:', mimeType);
      if (!userdata.token) {
        console.error('No token found');
        Alert.alert('Authentication Error', 'No valid token found.');
        return null;
      }

      const formData = new FormData();
      formData.append('image', {
        uri: uri,
        name: `photo_${Date.now()}.${mimeType.split('/')[1] || 'jpg'}`,
        type: mimeType,
      });

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

      console.log('Upload response:', response.status, response.data);

      if (response.status === 200 && response.data?.data) {
        return response.data.data[0];
      } else {
        console.error('Unexpected response:', response.status, response.data);
        Alert.alert('Upload Failed', 'Please try again later.');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error.response) {
        console.error(
          'Server response:',
          error.response.status,
          error.response.data,
        );
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }
      Alert.alert(
        'Upload Failed',
        'Image size is too big , please choose smaller image.',
      );
      return null;
    }
  };

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

  const launchCamera = async () => {
    const options = {mediaType: 'photo', maxWidth: 400, maxHeight: 400};
    ImagePicker.launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const uploadedUrl = await uploadImage(
          asset.uri,
          asset.type || 'image/jpeg',
        );
        if (uploadedUrl) {
          setMedia(prevMedia => [...prevMedia, uploadedUrl]);
        }
      }
    });
  };

  const selectMedia = async () => {
    ImagePicker.launchImageLibrary(
      {mediaType: 'photo', selectionLimit: 10},
      async response => {
        if (response.assets && response.assets.length > 0) {
          const uploadedUrls = await Promise.all(
            response.assets.map(async asset =>
              uploadImage(asset.uri, asset.type || 'image/jpeg'),
            ),
          );
          const validUrls = uploadedUrls.filter(url => url !== null);
          if (validUrls.length > 0) {
            setMedia(prevMedia => [...prevMedia, ...validUrls]);
          }
        }
      },
    );
  };

  return {media, selectMedia, launchCamera, requestCameraPermission, setMedia};
};

export default useImagePicker;
