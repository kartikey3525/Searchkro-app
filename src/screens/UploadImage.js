import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import React, {useContext} from 'react';
import {HelperText} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useState} from 'react';
import {AuthContext} from '../context/authcontext';
import {Dimensions} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {ThemeContext} from '../context/themeContext';
import * as ImagePicker from 'react-native-image-picker';

export default function UploadImage({navigation, route}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState([]);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const {handleRegister, handleLogin, createPost} = useContext(AuthContext);

  const validateInputs = () => {
    if (media.length === 0) {
      setErrors(prevState => ({
        ...prevState,
        media: 'Please select at least one image.',
      }));
      return false;
    }
    return true;
  };

  const handlePress = async () => {
    setErrors({media: ''});
    if (!validateInputs()) return;

    try {
      await createPost(
        route.params.selectedCategories,
        route.params.description,
        route.params.phone,
        route.params.email,
        route.params.location,
        media,
      );
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectMedia = () => {
    launchImageLibrary({mediaType: 'mixed', selectionLimit: 0}, response => {
      if (response.assets) {
        setMedia([...media, ...response.assets]);
        setErrors(prevErrors => ({...prevErrors, media: ''}));
      }
    });
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
      console.log('Camera permission not required on iOS');
      launchCamera();
    }
  };

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
        console.log('Image URI:', response.assets?.[0]?.uri);
        if (response.assets && response.assets.length > 0) {
          setMedia(prevMedia => [...prevMedia, {uri: response.assets[0].uri}]);
        }
      }
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.screen,
        {backgroundColor: isDark ? '#121212' : '#FFFFFF'},
      ]}>
      <View style={styles.header}>
        <Entypo
          onPress={() => navigation.goBack()}
          name="chevron-thin-left"
          size={20}
          color={isDark ? '#fff' : 'rgba(94, 95, 96, 1)'}
          style={{marginLeft: 20, padding: 5}}
        />
        <Text style={[styles.headerText, {color: isDark ? '#fff' : '#000'}]}>
          Upload photos
        </Text>
      </View>

      <Text
        style={[
          styles.title,
          {color: isDark ? '#E0E0E0' : 'rgba(33, 33, 33, 1)'},
        ]}>
        Choose and Upload Your Picture
      </Text>

      {/* Image Selector */}
      <View>
        <View>
          {media.length > 0 && media[0].uri ? (
            <>
              <Image
                source={{uri: media[0].uri}}
                style={[styles.mediaSelector, {borderWidth: 0}]}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setMedia(media.slice(1))}>
                <Entypo name="cross" size={25} color={'black'} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={selectMedia}>
              <View
                style={[
                  styles.mediaSelector,
                  {
                    backgroundColor: isDark
                      ? '#1E1E1E'
                      : 'rgba(250, 250, 250, 1)',
                  },
                ]}>
                <MaterialIcons name="image" size={45} color="grey" />
                <Text
                  style={{
                    color: isDark ? '#BBB' : 'rgba(158, 158, 158, 1)',
                    fontWeight: 'bold',
                  }}>
                  Select Media
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <HelperText type="error" visible={!!errors.media} style={{color: 'red'}}>
        {errors.media}
      </HelperText>

      {/* Camera Option */}
      <TouchableOpacity
        style={[
          styles.whiteBotton,
          {
            backgroundColor: isDark ? '#1E1E1E' : 'rgba(250, 250, 250, 1)',
            borderColor: isDark ? '#333' : '#A3A3A3',
          },
        ]}
        // onPress={() => navigation.navigate('BottomTabs')}
        onPress={() => requestCameraPermission()}>
        <Entypo name="camera" size={25} color="rgba(6, 196, 217, 1)" />
        <Text
          style={{
            color: 'rgba(6, 196, 217, 1)',
            fontSize: 18,
            fontWeight: '600',
            marginLeft: 10,
          }}>
          Open Camera & Take Photo
        </Text>
      </TouchableOpacity>

      {/* Uploaded Images */}
      {media.length > 0 && (
        <>
          <Text
            style={[
              {
                color: isDark ? '#fff' : 'rgb(0, 0, 0)',
                fontSize: 18,
                textAlign: 'left',
                marginBottom: 10,
                fontWeight: '600',
                alignSelf: 'flex-start',
                marginLeft: '7%',
                marginTop: '5%',
              },
            ]}>
            Post images
          </Text>

          <View style={[styles.imageContainer, {flexWrap: 'wrap'}]}>
            {media.slice(1, 8).map((item, index) => (
              <View key={index} style={styles.mediaItem}>
                {/* {item.type.startsWith('image') ? ( */}
                <>
                  <Image source={{uri: item.uri}} style={styles.mediaPreview} />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                      setMedia(media.filter((_, i) => i !== index));
                    }}>
                    <Entypo name="cross" size={18} color={'black'} />
                  </TouchableOpacity>
                </>
                {/* ) : null} */}
              </View>
            ))}

            {media.length < 8 && (
              <TouchableOpacity
                onPress={selectMedia}
                style={[
                  styles.mediaItem,
                  {
                    backgroundColor: isDark ? '#1E1E1E' : 'rgb(255, 255, 255)',
                    borderColor: isDark ? '#555' : 'rgba(176, 176, 176, 1)',
                  },
                ]}>
                <Entypo
                  name="squared-plus"
                  size={25}
                  color="rgba(176, 176, 176, 1)"
                />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      {/* Post Button */}
      <TouchableOpacity
        style={[styles.blueButton, {margin: media.length > 0 ? '25%' : '60%'}]}
        onPress={() => handlePress()}>
        <Text style={[styles.buttonText, {color: '#fff'}]}>Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 15,
    padding: 1,
  },
  mediaSelector: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Width * 0.85,
    height: 200,
    borderWidth: 3,
    backgroundColor: 'rgba(250, 250, 250, 1)',
    borderRadius: 30,
    borderColor: 'rgba(6, 196, 217, 1)',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    marginLeft: '6%',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  mediaItem: {
    width: '20%', // Slight margin for spacing
    margin: '2%',
    aspectRatio: 1, // Keeps items square
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  phoneInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#A3A3A3',
    width: '90%',
    borderWidth: 1,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'rgba(231, 231, 231, 1)',
    width: '90%',
    borderWidth: 1,
    borderRadius: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    color: '#000',
    width: '86%',
    height: 50,
    padding: 10,
    margin: 4,
  },
  smallText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1D1E20',
    textAlign: 'center',
    width: 250,
    marginBottom: 30,
    fontFamily: 'NunitoSans-VariableFont_YTLC,opsz,wdth,wght',
  },

  bigText: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
    marginTop: 40,
    fontWeight: 'bold',
    marginBottom: 6,
    fontFamily: 'Poppins-Bold',
  },
  blueBotton: {
    backgroundColor: '#00AEEF',
    width: '90%',
    height: 56,
    borderRadius: 10,
    margin: '30%',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    width: Width,
    height: Height,
    alignItems: 'center',
  },
  whiteBotton: {
    backgroundColor: 'rgba(250, 250, 250, 1)',
    width: '90%',
    height: 56,
    borderRadius: 50,
    margin: 10,
    flexDirection: 'row',
    borderColor: '#A3A3A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    width: Width,
    flexDirection: 'row',
    height: Height * 0.1,
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: '21%',
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    alignSelf: 'center',
    marginBottom: 20,
  },

  closeButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 15,
    padding: 1,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  blueButton: {
    backgroundColor: '#00AEEF',
    width: '90%',
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 22,
  },
});
