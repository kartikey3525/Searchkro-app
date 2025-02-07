import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useContext} from 'react';
import {HelperText} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useState} from 'react';
import {AuthContext} from '../context/authcontext';
import {launchImageLibrary} from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
import {ThemeContext} from '../context/themeContext';

import {Dimensions} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function ReportIssue({navigation}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState([]);
  const [description, setdescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const {handleRegister, handleLogin, handleResetPassword} =
    useContext(AuthContext);

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!email && !password) {
      setErrors(prevState => ({
        ...prevState,
        email: 'Email or phone number is required.',
      }));
      return false;
    }

    if (email && phoneRegex.test(email)) {
      // phone number is valid
    } else if (email && emailRegex.test(email)) {
      // email is valid
    } else {
      setErrors(prevState => ({
        ...prevState,
        email: 'Please enter a valid email address or phone number.',
      }));
      return false;
    }

    if (!password.trim()) {
      setErrors(prevState => ({
        ...prevState,
        password: 'Password is required.',
      }));
      return false;
    }

    if (password.length < 6) {
      setErrors(prevState => ({
        ...prevState,
        password: 'Password must be at least 6 characters long.',
      }));
      return false;
    }

    setErrors({email: '', password: ''});
    return true;
  };

  const handlePress = async () => {
    setErrors({email: '', password: ''});
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      await handleLogin(email, password);
      console.log('Success', 'Login successful!');
      navigation.navigate('OTPScreen', {emailPhone: email, password: password});
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
          setMedia([{uri: response.assets[0].uri}]); // Store the image
        }
      }
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.screen,
        {backgroundColor: isDark ? '#000' : '#fff'},
      ]}>
      <View
        style={{
          alignItems: 'center',
          width: Width,
          flexDirection: 'row',
          height: Height * 0.1,
          justifyContent: 'flex-start',
          marginBottom: 20,
        }}>
        <Entypo
          onPress={() => navigation.goBack()}
          name="chevron-thin-left"
          size={20}
          color={isDark ? '#fff' : 'rgba(94, 95, 96, 1)'}
          style={{marginLeft: 20, padding: 5}}
        />
        <Text
          style={[
            {
              fontSize: 20,
              fontWeight: 'bold',
              alignSelf: 'center',
              textAlign: 'center',
              width: Width * 0.76,
              color: isDark ? '#fff' : '#000',
            },
          ]}>
          Report an issue
        </Text>

        <FontAwesome
          onPress={() => navigation.goBack()}
          name="send"
          size={20}
          color="rgba(6, 196, 217, 1)"
          style={{marginLeft: 0}}
        />
      </View>

      <Text
        style={[
          styles.recListText,
          {
            fontWeight: 'bold',
            fontSize: 18,
            alignSelf: 'center',
            marginBottom: 10,
            color: isDark ? '#fff' : '#000',
          },
        ]}>
        Upload Your Picture
      </Text>
      <View>
        <View style={{}}>
          {media.length > 0 && media[0].uri ? (
            <TouchableOpacity
              onPress={
                // selectMedia
                () => setModalVisible(!modalVisible)
              }>
              <Image
                source={{uri: media[0].uri}}
                style={[styles.mediaSelector, {borderWidth: 0}]}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={
                // selectMedia
                () => setModalVisible(!modalVisible)
              }>
              <View
                style={[
                  styles.mediaSelector,
                  {backgroundColor: isDark ? '#121212' : '#fff'},
                ]}>
                <Text
                  style={{color: 'rgba(158, 158, 158, 1)', fontWeight: 'bold'}}>
                  Select file
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <HelperText type="error" visible={!!errors.media}>
        {errors.media}
      </HelperText>
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
            Add more images
          </Text>

          <View style={[styles.imageContainer, {flexWrap: 'wrap'}]}>
            {media.slice(1, 8).map((item, index) => (
              <View key={index} style={styles.mediaItem}>
                {item.type.startsWith('image') ? (
                  <>
                    <Image
                      source={{uri: item.uri}}
                      style={styles.mediaPreview}
                    />
                    <TouchableOpacity
                      style={[styles.closeButton2]}
                      onPress={() => {
                        // Remove the image from media array
                        setMedia(media.filter((mediaItem, i) => i !== index));
                      }}>
                      <Entypo name="cross" size={18} color="black" />
                    </TouchableOpacity>
                  </>
                ) : item.type.startsWith('video') ? null : (
                  <Text>{item.fileName}</Text>
                )}
              </View>
            ))}

            {/* Add Selector Button */}
            {media.length < 8 && (
              <TouchableOpacity
                onPress={selectMedia}
                style={[
                  styles.mediaItem,
                  {
                    backgroundColor: isDark ? '#121212' : 'rgb(255, 255, 255)',
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: 'rgba(176, 176, 176, 1)',
                    borderStyle: 'dashed',
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
      <Text
        style={[
          styles.recListText,
          {
            fontWeight: 'bold',
            fontSize: 18,
            alignSelf: 'flex-start',
            marginLeft: 30,
            marginTop: 10,
            marginBottom: 10,
            color: isDark ? '#fff' : '#000',
          },
        ]}>
        Product description
      </Text>

      <View
        style={[
          styles.inputContainer,
          {
            height: 130,
            alignItems: 'flex-start',
            backgroundColor: isDark ? '#121212' : '#fff',
          },
        ]}>
        <TextInput
          value={description}
          style={[
            styles.textInput,
            {
              borderColor: isDark
                ? 'rgba(37, 37, 37, 1)'
                : 'rgba(231, 231, 231, 1)',
              height: 93,
              backgroundColor: isDark ? '#121212' : '#fff',
              color: isDark ? '#fff' : '#000',
            },
          ]}
          onChangeText={setdescription}
          numberOfLines={5}
          multiline={true}
          placeholder=" Product description. . ."
          mode="outlined"
          placeholderTextColor={'rgba(158, 158, 158, 1)'}
          autoCapitalize="none"
        />
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.description}>
        {errors.description}
      </HelperText>

      <TouchableOpacity
        style={[styles.blueBotton, {margin: '15%'}]}
        onPress={() => navigation.navigate('BottomTabs')}>
        <Text
          style={[
            styles.smallText,
            {
              color: '#fff',
              fontSize: 22,
              marginBottom: 0,
            },
          ]}>
          Submit report
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.19)'
                : 'rgba(0, 0, 0, 0.3)',
            },
          ]}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: isDark ? '#121212' : '#fff'},
            ]}>
            <View
              style={{
                height: 5,
                backgroundColor: 'lightgrey',
                width: 60,
                position: 'absolute',
                alignSelf: 'center',
                borderRadius: 10,
                top: 16,
              }}
            />
            <TouchableOpacity
              style={[styles.closeButton, {}]}
              onPress={() => {
                setModalVisible(false);
              }}>
              <Entypo
                name="cross"
                size={22}
                color={isDark ? '#fff' : 'black'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                height: 50,
                marginTop: 30,
                width: Width,
                alignItems: 'center',
                borderBottomWidth: 1,
                padding: 10,
                borderBottomColor: isDark
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.2)',
              }}
              onPress={requestCameraPermission}>
              <Entypo
                name={'camera'}
                size={22}
                color={isDark ? '#fff' : 'rgb(0, 0, 0)'}
                style={{marginRight: 15, marginLeft: 20}}
              />

              <Text
                style={[
                  {
                    fontSize: 16,
                    fontWeight: '400',
                    marginLeft: 6,
                    color: isDark ? '#fff' : 'rgb(0, 0, 0)',
                  },
                ]}>
                Take Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => selectMedia()}
              style={{
                flexDirection: 'row',
                width: Width,
                alignItems: 'center',
                borderBottomWidth: 1,
                height: 50,
                padding: 10,
                borderBottomColor: isDark
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(0, 0, 0, 0.2)',
              }}>
              <MaterialCommunityIcons
                name={'image'}
                size={28}
                color={isDark ? '#fff' : 'rgb(0, 0, 0)'}
                style={{marginRight: 10, marginLeft: 18}}
              />

              <Text
                style={[
                  {
                    fontSize: 16,
                    fontWeight: '400',
                    marginLeft: 6,
                    color: isDark ? '#fff' : 'rgb(0, 0, 0)',
                  },
                ]}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (media.length > 0) {
                  // Remove the first image from the media array
                  setMedia(media.slice(1));
                }
                setModalVisible(false); // Close the modal
              }}
              style={{
                flexDirection: 'row',
                width: Width,
                alignItems: 'center',
                padding: 10,
                height: 60,
                marginBottom: 20,
              }}>
              <FontAwesome
                name={'trash'}
                size={22}
                color="rgb(255, 0, 0)"
                style={{marginRight: 15, marginLeft: 22}}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  marginLeft: 6,
                  color: 'rgb(255, 0, 0)',
                }}>
                Remove Current Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: Width,
    height: Height,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  modalContent: {
    width: Width,
    height: Height * 0.28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  addSelector: {
    width: '20%',
  },
  imageWrapper: {
    position: 'relative',
  },
  closeButton2: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 15,
    padding: 1,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 15,
    padding: 1,
    left: '40%',
    top: '15%',
  },
  mediaSelector: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Width * 0.85,
    height: 170,
    borderWidth: 3,
    backgroundColor: 'rgba(250, 250, 250, 1)',
    borderRadius: 30,
    borderColor: 'rgba(6, 196, 217, 1)',
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
});
