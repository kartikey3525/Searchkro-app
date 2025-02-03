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

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function SellerProfile({navigation, route}) {
  const [email, setEmail] = useState('');
  const [description, setdescription] = useState('');
  const [Socialmedia, setSocialmedia] = useState('');
  const [bussinessAddress, setbussinessAddress] = useState('');
  const [ownerName, setownerName] = useState('');
  const [shopName, setshopName] = useState('');
  const [phone, setphone] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedScale, setSelectedScale] = useState([]);
  const [selectedAvailabity, setSelectedAvailabity] = useState([]);
  const [media, setMedia] = useState(null);
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
          setMedia([{uri: response.assets[0].uri}]); // Store the image
        }
      }
    });
  };

  const selectMedia = () => {
    launchImageLibrary({mediaType: 'mixed', selectionLimit: 0}, response => {
      if (response.assets) {
        setMedia([{uri: response.assets[0].uri}]);
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
        Alert.alert('Permission Denied', 'Location access is required.');
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
          Alert.alert('Error', 'Unable to fetch location.');
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
    phone: '',
    location: '',
    media: '',
    selectedCategories: '',
    bussinessAddress: '',
    Socialmedia: '',
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
      phone: '',
      location: '',
      media: '',
      selectedCategories: '',
      bussinessAddress: '',
      Socialmedia: '',
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

    if (!bussinessAddress.trim()) {
      newErrors.bussinessAddress = 'Description is required.';
      valid = false;
    } else if (bussinessAddress.length < 6) {
      newErrors.bussinessAddress =
        'Description must be at least 6 characters long.';
      valid = false;
    }

    if (!Socialmedia.trim()) {
      newErrors.Socialmedia = 'Description is required.';
      valid = false;
    } else if (Socialmedia.length < 6) {
      newErrors.Socialmedia = 'Description must be at least 6 characters long.';
      valid = false;
    }

    if (!shopName.trim()) {
      newErrors.Socialmedia = 'Description is required.';
      valid = false;
    }

    if (!ownerName.trim()) {
      newErrors.Socialmedia = 'Description is required.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handlePress = async () => {
    setErrors({
      email: '',
      description: '',
      phone: '',
      location: '',
      media: '',
      selectedCategories: '',
      bussinessAddress: '',
      Socialmedia: '',
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
        phone: phone,
        selectedCategories: selectedCategories,
        location: location,
        media: '',
        bussinessAddress: '',
        Socialmedia: '',
        ownerName: '',
        shopName: '',
        selectedScale: '',
        selectedAvailabity: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.screen}>
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
          color="rgba(94, 95, 96, 1)"
          style={{marginLeft: 20, padding: 5}}
        />
        <Text
          style={[
            {
              fontSize: 20,
              fontWeight: 'bold',
              alignSelf: 'center',
              textAlign: 'center',
              width: Width * 0.8,
            },
          ]}>
          Profile
        </Text>
      </View>

      <View style={{}}>
        {media ? (
          <>
            <Image
              source={{uri: media[0].uri}}
              style={[styles.mediaSelector, {borderWidth: 0}]}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                // Remove the first image from the media array
                setMedia(null); // This removes the first item from the array
              }}>
              <Entypo name="cross" size={25} color="black" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            disabled
            // onPress={selectMedia}
          >
            <View style={styles.mediaSelector}>
              <MaterialIcons
                name="image"
                size={35}
                color="rgba(158, 158, 158, 1)"
              />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={require('../assets/edit.png')}
            style={{
              position: 'absolute',
              width: 50,
              height: 35,
              right: -10,
              bottom: 30,
              alignSelf: 'flex-end',
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

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
              alignSelf: 'flex-start',
              width: Width * 0.48,
            },
          ]}>
          Email
        </Text>

        <Text
          style={[
            {
              color: '#000',
              fontWeight: '600',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
            },
          ]}>
          Delivery available
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
        <View style={[styles.inputContainer, {width: '42%', marginLeft: 20}]}>
          <TextInput
            value={email}
            style={styles.textInput}
            onChangeText={setEmail}
            placeholder="Email"
            mode="outlined"
            placeholderTextColor={'grey'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Dropdown
          item={[
            {label: 'Yes', value: 'Yes'},
            {label: 'No', value: 'No'},
          ]}
          placeholder={'Select Availability'}
          half={true}
          single={true}
          selectedValues={selectedAvailabity}
          onChangeValue={handleCategoryChange}
        />
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.email}>
        {errors.email}
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
          borderColor: errors.phone ? 'red' : 'rgba(231, 231, 231, 1)',
          marginBottom: 5,
          borderRadius: 10,
        }}
        textInputStyle={{height: 50}}
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
              marginBottom: 5,
              alignSelf: 'flex-start',
              width: '50%',
            },
          ]}>
          Bussiness scale
        </Text>
      </View>

      <Dropdown
        item={[
          {label: 'Small Business (Local)', value: 'Small Business (Local)'},
          {
            label: 'Medium Business (City-wide)',
            value: 'Medium Business (City-wide)',
          },
          {
            label: 'Large Business (Multiple Cities/State-wide)',
            value: 'Large Business (Multiple Cities/State-wide)',
          },
        ]}
        placeholder={'Select Scale'}
        half={false}
        single={true}
        selectedValues={selectedScale}
        onChangeValue={handleCategoryChange}
      />

      <HelperText type="error" visible={!!errors.category} style={{height: 10}}>
        {errors.category}
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
              alignSelf: 'flex-start',
              width: Width * 0.48,
            },
          ]}>
          Shop name
        </Text>

        <Text
          style={[
            {
              color: '#000',
              fontWeight: '600',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
            },
          ]}>
          Owner name
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
        <View style={[styles.inputContainer, {width: '42%'}]}>
          <TextInput
            value={ownerName}
            style={styles.textInput}
            onChangeText={setownerName}
            placeholder="Shop name"
            mode="outlined"
            placeholderTextColor={'grey'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputContainer, {width: '42%'}]}>
          <TextInput
            value={shopName}
            style={styles.textInput}
            onChangeText={setshopName}
            placeholder="Owner name"
            mode="outlined"
            placeholderTextColor={'grey'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.email}>
        {errors.email}
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
              alignSelf: 'flex-start',
              width: '50%',
            },
          ]}>
          Bussiness Address
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={bussinessAddress}
          style={styles.textInput}
          onChangeText={setbussinessAddress}
          placeholder="Bussiness Address"
          mode="outlined"
          placeholderTextColor={'black'}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.email}>
        {errors.email}
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
              alignSelf: 'flex-start',
              width: '50%',
            },
          ]}>
          Location
        </Text>
      </View>
      {/* Location Validation */}
      <Dropdown
        style={styles.inputContainer}
        placeholder={location ? 'Selected current location' : 'Select Location'}
      />
      <HelperText type="error" visible={!!errors.location} style={{height: 10}}>
        {errors.location}
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
              alignSelf: 'flex-start',
              width: '50%',
            },
          ]}>
          Social media
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={Socialmedia}
          style={styles.textInput}
          onChangeText={setSocialmedia}
          placeholder="Social media"
          mode="outlined"
          placeholderTextColor={'black'}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.email}>
        {errors.email}
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
              alignSelf: 'flex-start',
              width: '50%',
            },
          ]}>
          description
        </Text>
      </View>

      <View
        style={[
          styles.inputContainer,
          {height: 100, alignItems: 'flex-start'},
        ]}>
        <TextInput
          value={description}
          style={[styles.textInput, {height: 93}]}
          onChangeText={setdescription}
          numberOfLines={5}
          multiline={true}
          placeholder="Add a short description about your business, products, or services . . ."
          mode="outlined"
          placeholderTextColor={'black'}
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
          Submit
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
  mediaSelector: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.28)',
    backgroundColor: 'rgba(250, 250, 250, 1)',
    marginBottom: 30,
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
