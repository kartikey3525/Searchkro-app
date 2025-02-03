import React, {useState} from 'react';
import {useEffect} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';

export default function useImagePicker() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState('');

  function selectImage() {
    const options = {
      includeBase64: true,
      maxWidth: 400,
      maxHeight: 400,

      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    return new Promise((resolve, reject) => {
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          reject();
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          reject();
        } else {
          const source = {uri: response.assets[0].uri};
          setImage(source);
          setImageUri(response.assets[0].uri);
          setImageName(response.assets[0].fileName);
          resolve(response.assets[0].uri);
        }
      });
    });
  }

  return {
    imageName,
    imageUri,
    image,
    loading,
    selectImage,
    error,
    setImage,
  };
}
