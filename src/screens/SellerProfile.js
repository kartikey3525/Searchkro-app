import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Keyboard,
  KeyboardAvoidingView,
  Animated,
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ThemeContext} from '../context/themeContext';
import Feather from 'react-native-vector-icons/Feather';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LocationPermission from '../hooks/uselocation';
import useImagePicker from '../hooks/useImagePicker';
import KeyboardAvoidingContainer from '../components/KeyboardAvoided';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function SellerProfile({navigation, route}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [description, setdescription] = useState('');
  const [Socialmedia, setSocialmedia] = useState('');
  const [businessAddress, setbusinessAddress] = useState('');
  const [ownerName, setownerName] = useState('');
  const [shopName, setshopName] = useState('');
  const [openAt, setopenAt] = useState('');
  const [closeAt, setcloseAt] = useState('');

  const [phone, setphone] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedScale, setSelectedScale] = useState([]);
  const [selectedAvailabity, setSelectedAvailabity] = useState([]);
  // const [location, setLocation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const phoneInput = useRef(null);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const {media, selectMedia, requestCameraPermission, setMedia} =
    useImagePicker();

  const handleCategoryChange = value => {
    setSelectedCategories(value); // Update selected categories
  };

  const handleAvailabityChange = value => {
    setSelectedAvailabity(value); // Update selected categories
  };

  const handleScaleChange = value => {
    setSelectedScale(value); // Update selected categories
  };
  const {
    getCategories,
    fullCategorydata,
    userdata,
    getSingleShop,
    singleShop,
    location,
  } = useContext(AuthContext);

  useEffect(() => {
    getCategories();
    getSingleShop(userdata._id);
    console.log('singleShop', singleShop?.profile);
    // setEmail(singleShop ? singleShop.email : '');
    setdescription(singleShop ? singleShop?.description : '');
    setSocialmedia(singleShop ? singleShop?.socialMedia : '');
    setopenAt(singleShop ? singleShop?.openTime : '');
    setcloseAt(singleShop ? singleShop?.closeTime : '');
    setbusinessAddress(singleShop ? singleShop?.businessAddress : '');
    setownerName(singleShop ? singleShop?.ownerName : '');
    setshopName(singleShop ? singleShop?.shopName : '');
    setphone(singleShop ? singleShop?.phone : '');
    // setLocation(singleShop ? singleShop?.location : '');
    setphone(singleShop ? singleShop?.phone : '');
    setMedia(Array.isArray(singleShop?.profile) ? singleShop.profile : []);

    setSelectedScale(singleShop ? [singleShop?.businessScale] : []);
    setSelectedCategories(singleShop ? [singleShop?.categories] : []);
    setSelectedAvailabity(singleShop ? [singleShop?.availability] : []);
  }, [isFocused]);

  const [errors, setErrors] = useState({
    description: '',
    phone: '',
    location: '',
    media: '',
    selectedCategories: '',
    businessAddress: '',
    Socialmedia: '',
    ownerName: '',
    shopName: '',
    openAt: '',
    closeAt: '',
    selectedScale: '',
    selectedAvailabity: '',
  });

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    let valid = true;
    let newErrors = {
      description: '',
      phone: '',
      location: '',
      media: '',
      selectedCategories: '',
      businessAddress: '',
      Socialmedia: '',
      ownerName: '',
      shopName: '',
      openAt: '',
      closeAt: '',
      selectedScale: '',
      selectedAvailabity: '',
    };

    // Validate Email or Phone Number
    if (!selectedAvailabity.length === 0) {
      newErrors.email = 'availability is required.';
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
      newErrors.selectedCategories = 'Please select at least one category.';
      valid = false;
    }
    if (selectedScale.length === 0) {
      newErrors.selectedScale = 'Please select at least one scale.';
      valid = false;
    }
    // Validate Location
    if (!location) {
      newErrors.location = 'Please allow location access.';
      valid = false;
    }

    if (!businessAddress.trim()) {
      newErrors.businessAddress = 'business Address is required.';
      valid = false;
    } else if (businessAddress.length < 6) {
      newErrors.businessAddress =
        'business Address must be at least 6 characters long.';
      valid = false;
    }

    if (!Socialmedia.trim()) {
      newErrors.Socialmedia = 'Social media is required.';
      valid = false;
    } else if (Socialmedia.length < 6) {
      newErrors.Socialmedia =
        'Social media must be at least 6 characters long.';
      valid = false;
    }

    if (!shopName.trim()) {
      newErrors.shopName = 'Shop name is required.';
    }
    if (!ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required.';
    }

    if (!openAt.trim()) {
      newErrors.openAt = 'opening time  is required.';
    }
    if (!closeAt.trim()) {
      newErrors.closeAt = 'closeing time is required.';
    }
    setErrors(newErrors);
    return valid;
  };

  const handlePress = async () => {
    setErrors({
      description: '',
      phone: '',
      location: '',
      media: '',
      selectedCategories: '',
      businessAddress: '',
      Socialmedia: '',
      ownerName: '',
      shopName: '',
      openAt: '',
      closeAt: '',
      selectedScale: '',
      selectedAvailabity: '',
    });
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      navigation.navigate('AddProducts', {
        item: singleShop,
        email: email,
        description: description,
        phone: phone,
        location: location,
        media: media,
        selectedCategories: selectedCategories,
        businessAddress: businessAddress,
        Socialmedia: Socialmedia,
        ownerName: ownerName,
        shopName: shopName,
        openAt: openAt,
        closeAt: closeAt,
        selectedScale: selectedScale,
        selectedAvailabity: selectedAvailabity,
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', event => {
      Animated.timing(keyboardHeight, {
        toValue: event.endCoordinates.height,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.screen,
          {
            backgroundColor: isDark ? '#000' : '#fff',
            // paddingBottom: keyboardVisible ? 0 : 0,
          }, // Add paddingBottom dynamically
        ]}>
        {/* <LocationPermission setLocation={setLocation} /> */}

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
          <TouchableOpacity
            onPress={() => navigation.navigate('Profilescreen')}>
            <Feather
              name="settings"
              size={20}
              color={isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(94, 95, 96, 1)'}
              style={{padding: 5}}
            />
          </TouchableOpacity>
        </View>

        <View>
          <View>
            {media.length > 0 && media[0] ? (
              <>
                <Image
                  source={{uri: media[0]}}
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
                    <Image
                      source={{uri: item.uri}}
                      style={styles.mediaPreview}
                    />
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
                      backgroundColor: isDark
                        ? '#1E1E1E'
                        : 'rgb(255, 255, 255)',
                      borderWidth: 1,
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
          <Dropdown
            item={[
              {label: 'Yes', value: 'Yes'},
              {label: 'No', value: 'No'},
            ]}
            placeholder={'Select Availability'}
            single={true}
            selectedValues={selectedAvailabity}
            onChangeValue={handleAvailabityChange}
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
          value={phone}
          containerStyle={{
            width: Width * 0.9,
            height: 60,
            borderWidth: 1,
            borderColor: errors.phone ? 'red' : 'rgba(0, 0, 0, 0.43)',
            marginBottom: 5,
            borderRadius: 10,
          }}
          textContainerStyle={{
            backgroundColor: isDark ? '#000' : '#fff',
          }}
          textInputStyle={{
            height: 50,
            backgroundColor: isDark ? '#000' : '#fff',
            color: isDark ? '#fff' : '#000',
            fontSize: 16,
          }}
          codeTextStyle={{
            color: isDark ? '#fff' : '#000',
          }}
          flagButtonStyle={{
            backgroundColor: isDark ? '#000' : '#fff',
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
          textInputProps={{
            selectionColor: isDark ? '#fff' : '#000', // Set cursor color
          }}
          defaultCode="IN"
          layout="second"
          onChangeText={text => setphone(text)}
        />
        <HelperText
          type="error"
          visible={!!errors.phone}
          style={{alignSelf: 'flex-start', marginLeft: 10}}>
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
            OpenAt
          </Text>

          <Text
            style={[
              {
                fontWeight: '600',
                fontSize: 15,
                color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
                marginBottom: 5,
                alignSelf: 'flex-start',
              },
            ]}>
            CloseAt
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
              value={openAt}
              style={[
                styles.textInput,
                {
                  backgroundColor: isDark ? '#000' : 'rgb(255, 255, 255)',
                  color: isDark ? '#fff' : '#000',
                },
              ]}
              onChangeText={setopenAt}
              placeholder="Opens At"
              mode="outlined"
              placeholderTextColor={'grey'}
              keyboardType="email-address"
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
                  backgroundColor: isDark ? '#000' : 'rgb(255, 255, 255)',
                  color: isDark ? '#fff' : '#000',
                },
              ]}
              onChangeText={item => setcloseAt(item)}
              placeholder="closing time"
              mode="outlined"
              placeholderTextColor={'grey'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        {errors.openAt ? (
          <HelperText
            type="error"
            style={{alignSelf: 'flex-start', marginLeft: 14}}
            visible={!!errors.openAt}>
            {errors.openAt}
          </HelperText>
        ) : null}

        {errors.closeAt ? (
          <HelperText
            type="error"
            style={{alignSelf: 'flex-start', marginLeft: 14}}
            visible={!!errors.closeAt}>
            {errors.closeAt}
          </HelperText>
        ) : null}

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
                width: '50%',
              },
            ]}>
            business scale
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
          selectedValues={selectedScale} // Ensure this state is properly set
          onChangeValue={handleScaleChange} // Pass state setter function
        />

        <HelperText
          type="error"
          visible={!!errors.selectedScale}
          style={{alignSelf: 'flex-start', marginLeft: 10}}>
          {errors.selectedScale}
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
            Shop name
          </Text>

          <Text
            style={[
              {
                fontWeight: '600',
                fontSize: 15,
                color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
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
              value={shopName}
              style={[
                styles.textInput,
                {
                  backgroundColor: isDark ? '#000' : 'rgb(255, 255, 255)',
                  color: isDark ? '#fff' : '#000',
                },
              ]}
              onChangeText={setshopName}
              placeholder="Shop name"
              mode="outlined"
              placeholderTextColor={'grey'}
              keyboardType="email-address"
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
              value={ownerName}
              style={[
                styles.textInput,
                {
                  backgroundColor: isDark ? '#000' : 'rgb(255, 255, 255)',
                  color: isDark ? '#fff' : '#000',
                },
              ]}
              onChangeText={item => setownerName(item)}
              placeholder="Owner name"
              mode="outlined"
              placeholderTextColor={'grey'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        {errors.shopName ? (
          <HelperText
            type="error"
            style={{alignSelf: 'flex-start', marginLeft: 14}}
            visible={!!errors.shopName}>
            {errors.shopName}
          </HelperText>
        ) : null}

        {errors.ownerName ? (
          <HelperText
            type="error"
            style={{alignSelf: 'flex-start', marginLeft: 14}}
            visible={!!errors.ownerName}>
            {errors.ownerName}
          </HelperText>
        ) : null}
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
            business Address
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
            value={businessAddress}
            style={[
              styles.textInput,
              {
                backgroundColor: isDark ? '#000' : 'rgb(255, 255, 255)',
                color: isDark ? '#fff' : '#000',
              },
            ]}
            onChangeText={setbusinessAddress}
            placeholder="business Address"
            mode="outlined"
            placeholderTextColor={isDark ? '#ccc' : 'black'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <HelperText
          type="error"
          style={{alignSelf: 'flex-start', marginLeft: 14}}
          visible={!!errors.businessAddress}>
          {errors.businessAddress}
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
            Location
          </Text>
        </View>
        {/* Location Validation */}
        <Dropdown
          style={styles.inputContainer}
          placeholder={
            location ? 'Selected current location' : 'Select Location'
          }
        />
        <HelperText
          type="error"
          visible={!!errors.location}
          style={{height: 10}}>
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
                color: isDark ? '#fff' : '#000',
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
            value={Socialmedia}
            style={[
              styles.textInput,
              {
                backgroundColor: isDark ? '#000' : 'rgb(255, 255, 255)',
                color: isDark ? '#fff' : '#000',
              },
            ]}
            onChangeText={setSocialmedia}
            placeholder="Social media"
            mode="outlined"
            placeholderTextColor={'grey'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <HelperText
          type="error"
          style={{alignSelf: 'flex-start', marginLeft: 14}}
          visible={!!errors.Socialmedia}>
          {errors.Socialmedia}
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
            description
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
                backgroundColor: isDark ? '#000' : 'rgb(255, 255, 255)',
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
          selectedValues={selectedCategories}
          onChangeValue={handleCategoryChange}
        />

        <HelperText
          type="error"
          visible={!!errors.selectedCategories}
          style={{alignSelf: 'flex-start', marginLeft: 10}}>
          {errors.selectedCategories}
        </HelperText>

        <TouchableOpacity
          style={styles.blueBotton}
          // onPress={() => navigation.navigate('AddProducts')}
          onPress={() => handlePress()}>
          <Text
            style={[
              styles.smallText,
              {color: '#fff', fontSize: 22, marginBottom: 0},
            ]}>
            Next
          </Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent={true}>
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'rgba(0, 0, 0, 0.3)',
              },
            ]}>
            <View
              style={[
                styles.modalContent,
                {backgroundColor: isDark ? '#000' : '#fff'},
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
                style={[
                  styles.closeButton2,
                  {backgroundColor: isDark ? '#fff' : 'lightgrey'},
                ]}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Entypo name="cross" size={22} color={'black'} />
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
                  borderBottomColor: isDark ? '#ccc' : 'rgba(0, 0, 0, 0.2)',
                }}
                onPress={() => requestCameraPermission()}>
                <Entypo
                  name={'camera'}
                  size={25}
                  color={isDark ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'}
                  style={{marginRight: 15, marginLeft: 20}}
                />

                <Text
                  style={[
                    {
                      fontSize: 18,
                      fontWeight: '600',
                      marginLeft: 6,
                      color: isDark ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
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
                  borderBottomColor: isDark ? '#ccc' : 'rgba(0, 0, 0, 0.2)',
                }}>
                <MaterialCommunityIcons
                  name={'image'}
                  size={30}
                  color={isDark ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'}
                  style={{marginRight: 10, marginLeft: 18}}
                />

                <Text
                  style={[
                    {
                      fontSize: 18,
                      fontWeight: '600',
                      marginLeft: 6,
                      color: isDark ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
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
    </KeyboardAvoidingContainer>
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
    width: Width * 0.85,
    height: 150,
    borderWidth: 3,
    backgroundColor: 'rgba(250, 250, 250, 1)',
    borderRadius: 30,
    borderColor: 'rgba(6, 196, 217, 1)',
    marginBottom: 10,
  }, mediaItem: {
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
  },imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',marginBottom: 10,
    paddingHorizontal: 10,
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
