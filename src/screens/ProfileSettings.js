import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import React, {useContext} from 'react';
import {HelperText} from 'react-native-paper';
import {useState} from 'react';
import {AuthContext} from '../context/authcontext';
import {Dimensions} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Dropdown from '../components/Dropdown';
import {useRef} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
import {ThemeContext} from '../context/themeContext';
import Feather from 'react-native-vector-icons/Feather';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function ProfileSettings({navigation, route}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [description, setdescription] = useState('');
  const [opensAt, setopensAt] = useState('');
  const [closeAt, setcloseAt] = useState('');
  const [ownerName, setownerName] = useState('');
  const [shopName, setshopName] = useState('');
  const [phone, setphone] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedScale, setSelectedScale] = useState([]);
  const [selectedAvailabity, setSelectedAvailabity] = useState([]);
  const [media, setMedia] = useState([]);
  const [location, setLocation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const phoneInput = useRef(null);
  const isFocused = useIsFocused();
  const [errorMessage, setErrorMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
          setMedia(prevMedia => [...prevMedia, {uri: response.assets[0].uri}]); // Store the image
        }
      }
    });
  };

  const selectMedia = () => {
    launchImageLibrary({mediaType: 'mixed', selectionLimit: 0}, response => {
      if (response.assets) {
        setMedia([...media, ...response.assets]);
        setErrors(prevErrors => ({...prevErrors, media: ''}));
      }
    });
  };

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
        // Alert.alert('Permission Denied', 'Location access is required.');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const getLocation = async () => {
    // Check permissions for Android
    if (Platform.OS === 'android') {
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
        setErrorMessage('Location permission denied');
        return;
      }
    }

    // Get the location
    try {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation({latitude, longitude});
        },
        error => {
          console.error('Location error:', error);
          //   Alert.alert('Error', 'Unable to fetch location.');
        },
        {enableHighAccuracy: true, timeout: 35000, maximumAge: 10000},
      );
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const handleCategoryChange = value => {
    setSelectedCategories(value); // Update selected categories
  };

  const {getCategories, fullCategorydata, createPost} = useContext(AuthContext);

  useEffect(() => {
    getCategories();
    requestLocationPermission();
    // console.log('data', fullCategorydata);
    setSelectedCategories(['selected']);
  }, [isFocused]);

  const [errors, setErrors] = useState({
    email: '',
    description: '',
    opensAt: '',
    closeAt: '',
    phone: '',
    location: '',
    media: '',
    selectedCategories: '',
    bussinessAddress: '',
    ownerName: '',
    shopName: '',
    selectedScale: '',
    selectedAvailabity: '',
  });

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    let valid = true;
    let newErrors = {
      email: '',
      description: '',
      opensAt: '',
      closeAt: '',
      phone: '',
      location: '',
      media: '',
      selectedCategories: '',
      bussinessAddress: '',
      ownerName: '',
      shopName: '',
      selectedScale: '',
      selectedAvailabity: '',
    };

    // Validate Email or Phone Number
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
      valid = false;
    } else if (!emailRegex.test(email) && !phoneRegex.test(email)) {
      newErrors.email = 'Enter a valid email address .';
      valid = false;
    }

    // Validate Description
    if (!description.trim()) {
      newErrors.description = 'Description is required.';
      valid = false;
    } else if (description.length < 6) {
      newErrors.description = 'Description must be at least 6 characters long.';
      valid = false;
    }

    if (!opensAt.trim()) {
      newErrors.opensAt = 'opensAt is required.';
      valid = false;
    }
    if (!closeAt.trim()) {
      newErrors.closeAt = 'closeAt is required.';
      valid = false;
    }

    // Validate Phone Number
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
      valid = false;
    } else if (!phoneInput.current?.isValidNumber(phone)) {
      newErrors.phone = 'Enter a valid phone number.';
      valid = false;
    }

    // Validate Category Selection
    if (selectedCategories.length === 0) {
      newErrors.category = 'Please select at least one category.';
      valid = false;
    }
    if (selectedAvailabity.length === 0) {
      newErrors.category = 'Please select at least one category.';
      valid = false;
    }
    if (selectedScale.length === 0) {
      newErrors.category = 'Please select at least one category.';
      valid = false;
    }
    // Validate Location
    if (!location) {
      newErrors.location = 'Please allow location access.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handlePress = async () => {
    setErrors({
      email: '',
      description: '',
      opensAt: '',
      closeAt: '',
      phone: '',
      location: '',
      media: '',
      selectedCategories: '',
      bussinessAddress: '',
      ownerName: '',
      shopName: '',
      selectedScale: '',
      selectedAvailabity: '',
    });
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      console.log('Success', 'Login successful!');
      navigation.navigate('uploadimage', {
        email: email,
        description: description,
        opensAt: opensAt,
        closeAt: closeAt,
        phone: phone,
        selectedCategories: selectedCategories,
        location: location,
        media: '',
        bussinessAddress: '',
        ownerName: '',
        shopName: '',
        selectedScale: '',
        selectedAvailabity: '',
      });
    } catch (error) {
      //   Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          color={isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(94, 95, 96, 1)'}
          style={{marginLeft: 20, padding: 5}}
        />
        <Text
          style={[
            {
              fontSize: 20,
              fontWeight: 'bold',
              alignSelf: 'center',
              textAlign: 'center',
              color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
              width: Width * 0.75,
            },
          ]}>
          Profile
        </Text>
      </View>

      <Text
        style={[
          styles.title,
          {color: isDark ? '#E0E0E0' : 'rgba(33, 33, 33, 1)'},
        ]}>
        Upload Your Picture
      </Text>
      <View>
        <View>
          {media?.length > 0 && media[0].uri ? (
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
                  Upload
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <HelperText type="error" visible={!!errors.media} style={{color: 'red'}}>
        {errors.media}
      </HelperText>
      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: 25,
          flexDirection: 'row',
        }}>
        <Text
          style={[
            {
              color: isDark ? '#fff' : '#000',
              fontWeight: '600',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
              width: '50%',
            },
          ]}>
          Shop Name
        </Text>
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isDark
              ? 'rgba(109, 109, 109, 0.43)'
              : 'rgba(0, 0, 0, 1)',
          },
        ]}>
        <TextInput
          value={shopName}
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? '#121212' : 'rgb(255, 255, 255)',
              color: isDark ? '#fff' : '#000',
            },
          ]}
          onChangeText={setshopName}
          placeholder="Shop Name"
          mode="outlined"
          placeholderTextColor={isDark ? '#ccc' : 'black'}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.shopName}>
        {errors.shopName}
      </HelperText>

      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: 25,
          flexDirection: 'row',
        }}>
        <Text
          style={[
            {
              color: isDark ? '#fff' : '#000',
              fontWeight: '600',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
              width: '50%',
            },
          ]}>
          About shop
        </Text>
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            height: 100,
            alignItems: 'flex-start',
            borderColor: isDark
              ? 'rgba(109, 109, 109, 0.43)'
              : 'rgba(0, 0, 0, 1)',
          },
        ]}>
        <TextInput
          value={description}
          style={[
            styles.textInput,
            {
              height: 93,
              color: isDark ? '#fff' : '#000',
              backgroundColor: isDark ? '#121212' : 'rgb(255, 255, 255)',
            },
          ]}
          onChangeText={setdescription}
          numberOfLines={5}
          multiline={true}
          placeholder="Add a short description about your business, products, or services . . ."
          mode="outlined"
          placeholderTextColor={'grey'}
          autoCapitalize="none"
        />
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.description}>
        {errors.description}
      </HelperText>

      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: 25,
          flexDirection: 'row',
        }}>
        <Text
          style={[
            {
              color: '#000',
              fontWeight: '600',
              fontSize: 15,
              marginBottom: 5,
              color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
              alignSelf: 'flex-start',
              width: Width * 0.5,
            },
          ]}>
          Contact number
        </Text>
      </View>

      <PhoneInput
        ref={phoneInput}
        defaultValue={phone}
        containerStyle={{
          width: Width * 0.9,
          height: 60,
          borderWidth: 1,
          borderColor: errors.phone ? 'red' : 'rgba(0, 0, 0, 0.43)',
          marginBottom: 5,
          borderRadius: 10,
        }}
        textContainerStyle={{
          backgroundColor: isDark ? '#121212' : '#fff',
        }}
        textInputStyle={{
          height: 50,
          backgroundColor: isDark ? '#121212' : '#fff',
          color: isDark ? '#fff' : '#000',
          fontSize: 16,
        }}
        codeTextStyle={{
          color: isDark ? '#fff' : '#000',
        }}
        flagButtonStyle={{
          backgroundColor: isDark ? '#1E1E1E' : '#fff',
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
        }}
        defaultCode="IN"
        layout="second"
        onChangeText={text => setphone(text)}
      />
      <HelperText type="error" visible={!!errors.phone} style={{height: 10}}>
        {errors.phone}
      </HelperText>

      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: 25,
          flexDirection: 'row',
        }}>
        <Text
          style={[
            {
              color: '#000',
              fontWeight: '600',
              fontSize: 15,
              color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
              marginBottom: 5,
              alignSelf: 'flex-start',
              width: Width * 0.48,
            },
          ]}>
          Open hours
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          width: Width,
          justifyContent: 'space-evenly',
        }}>
        <View
          style={[
            styles.inputContainer,
            {
              width: '42%',
              borderColor: isDark
                ? 'rgba(109, 109, 109, 0.43)'
                : 'rgba(0, 0, 0, 1)',
            },
          ]}>
          <TextInput
            value={opensAt}
            style={[
              styles.textInput,
              {
                backgroundColor: isDark ? '#121212' : 'rgb(255, 255, 255)',
                color: isDark ? '#fff' : '#000',
              },
            ]}
            onChangeText={setopensAt}
            placeholder="opens at"
            mode="outlined"
            placeholderTextColor={'grey'}
            keyboardType="number-pad"
            autoCapitalize="none"
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            {
              width: '42%',
              borderColor: isDark
                ? 'rgba(109, 109, 109, 0.43)'
                : 'rgba(0, 0, 0, 1)',
            },
          ]}>
          <TextInput
            value={closeAt}
            style={[
              styles.textInput,
              {
                backgroundColor: isDark ? '#121212' : 'rgb(255, 255, 255)',
                color: isDark ? '#fff' : '#000',
              },
            ]}
            onChangeText={setcloseAt}
            placeholder="close at"
            mode="outlined"
            placeholderTextColor={'grey'}
            keyboardType="number-pad"
            autoCapitalize="none"
          />
        </View>
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.opensAt}>
        {errors.opensAt}
      </HelperText>

      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: 25,
          flexDirection: 'row',
        }}>
        <Text
          style={[
            {
              color: isDark ? '#fff' : '#000',
              fontWeight: '600',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
              width: '50%',
            },
          ]}>
          Category
        </Text>
      </View>

      <Dropdown
        item={
          fullCategorydata?.map(category => ({
            label: category.name || 'Unnamed',
            value: category.name || '',
          })) || []
        }
        placeholder={'Select Categories'}
        selectedValues={selectedCategories} // Pass the selected categories to the dropdown
        onChangeValue={handleCategoryChange} // Handle category selection changes
      />

      <HelperText type="error" visible={!!errors.category} style={{height: 10}}>
        {errors.category}
      </HelperText>

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
            Gallery
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

            {media?.length < 8 && (
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

      <TouchableOpacity
        style={styles.blueBotton}
        onPress={() => navigation.navigate('Home')}
        // onPress={() => handlePress()}
      >
        <Text
          style={[
            styles.smallText,
            {color: '#fff', fontSize: 22, marginBottom: 0},
          ]}>
          Update
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
              style={styles.closeButton2}
              onPress={() => {
                setModalVisible(false);
              }}>
              <Entypo name="cross" size={22} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                height: 60,
                marginTop: 30,
                width: Width,
                alignItems: 'center',
                borderBottomWidth: 1,
                padding: 10,
                borderBottomColor: 'rgba(0, 0, 0, 0.2)',
              }}
              onPress={() => requestCameraPermission()}>
              <Entypo
                name={'camera'}
                size={25}
                color="rgb(0, 0, 0)"
                style={{marginRight: 15, marginLeft: 20}}
              />

              <Text
                style={[
                  {
                    fontSize: 18,
                    fontWeight: '600',
                    marginLeft: 6,
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
                height: 60,
                padding: 10,
                borderBottomColor: 'rgba(0, 0, 0, 0.2)',
              }}>
              <MaterialCommunityIcons
                name={'image'}
                size={30}
                color="rgb(0, 0, 0)"
                style={{marginRight: 10, marginLeft: 18}}
              />

              <Text
                style={[
                  {
                    fontSize: 18,
                    fontWeight: '600',
                    marginLeft: 6,
                  },
                ]}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (media?.length > 0) {
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
              }}>
              <FontAwesome
                name={'trash'}
                size={25}
                color="rgb(255, 0, 0)"
                style={{marginRight: 15, marginLeft: 22}}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
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
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
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
  mediaSelector: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Width * 0.85,
    height: 150,
    borderWidth: 3,
    backgroundColor: 'rgba(250, 250, 250, 1)',
    borderRadius: 20,
    borderColor: 'rgba(6, 196, 217, 1)',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
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
  closeButton2: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 15,
    padding: 1,
    left: '40%',
    top: '10%',
  },
  closeButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 15,
    padding: 1,
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
    height: 50,
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteBotton: {
    backgroundColor: '#fff',
    width: '90%',
    height: 56,
    borderRadius: 10,
    margin: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#A3A3A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
