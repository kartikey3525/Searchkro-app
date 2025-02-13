import React, {useState, useEffect} from 'react';
import {Alert} from 'react-native';

export default function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [imageDownloadUrl, setImageDownloadUrl] = useState(null);
  const [error, setError] = useState(false);

  const metadata = {
    contentType: 'image/png',
  };

  //cameraImageName, fileUri, filePath
  const uploadImage = async (imageName, imageUri, image) => {
    setUploading(true);

    let uri = imageUri;
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const ref = storage().ref(`/Image/`);

    const task = ref.putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    ref.getDownloadURL().then(url => {
      setImageDownloadUrl(url);
      setUploading(false);
      Alert.alert('Image is uploaded');
    });
  };

  return {
    uploadImage,
    setImageDownloadUrl,
    imageDownloadUrl,
    setUploading,
    uploading,

    // error,
    // setError,
    // transferred,
    // setImageDownloadUrl,
  };
}
