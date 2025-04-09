import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {HelperText} from 'react-native-paper';
import {AuthContext} from '../context/authcontext';
import {Dimensions} from 'react-native';
import Dropdown from '../components/Dropdown';
import {useRef} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {useIsFocused} from '@react-navigation/native';
import {ThemeContext} from '../context/themeContext';
import Header from '../components/Header';
import LocationPermission from '../hooks/uselocation';
import {PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import KeyboardAvoidingContainer from '../components/KeyboardAvoided';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function PostDetails({ navigation, route }) {
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const phoneInput = useRef(null);
  const isFocused = useIsFocused();
  const [selectedCategories, setSelectedCategories] = useState([]);
  // const [location, setLocation] = useState(null);
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const {getCategories, fullCategorydata,location,setLocation,Userfulldata} = useContext(AuthContext);

  useEffect(() => {
    getCategories();
    if (route?.params?.selectedcategory) {
      setSelectedCategories(route.params.selectedcategory);
    }
    setPhone(Userfulldata.phone || '');
    setEmail(Userfulldata.email || '');
  }, [isFocused]);

  const [errors, setErrors] = useState({
    name:'',

    email: '',
    description: '',
    phone: '',
    category: '',
    location: '',
  });

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    let valid = true;
    let newErrors = {
      name: '',
      email: '',
      description: '',
      phone: '',
      category: '',
      location: '',
    };

    // // Email validation
    // if (!email.trim()) {
    //   newErrors.email = 'Email is required.';
    //   valid = false;
    // } else if (!emailRegex.test(email)) {
    //   newErrors.email = 'Enter a valid email address.';
    //   valid = false;
    // }

    if (!name.trim()) {
      newErrors.name = 'name is required.';
      valid = false;
    } else if (name.length < 2) {
      newErrors.name = 'name must be at least 2 characters long.';
      valid = false;
    }  

    // Description validation
    if (!description.trim()) {
      newErrors.description = 'Description is required.';
      valid = false;
    } else if (description.length < 6) {
      newErrors.description = 'Description must be at least 6 characters long.';
      valid = false;
    } else if (description.length > 200) {
      newErrors.description = 'Description must not exceed 200 characters.';
      valid = false;
    }

    // Phone validation
    // if (!phone.trim()) {
    //   newErrors.phone = 'Phone number is required.';
    //   valid = false;
    // } else if (!phoneInput.current?.isValidNumber(phone)) {
    //   newErrors.phone = 'Enter a valid phone number.';
    //   valid = false;
    // }

    // Category validation
    if (selectedCategories.length === 0) {
      newErrors.category = 'Please select at least one category.';
      valid = false;
    }

    // Location validation
    if (!location) {
      newErrors.location = 'Please allow location access.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  // const requestLocationPermission = async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: 'Location Access Required',
  //           message: 'This app needs to access your location.',
  //         },
  //       );

  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         getLocation();
  //         return true;
  //       } else {
  //         setErrors(prev => ({
  //           ...prev,
  //           location: 'Location permission denied.',
  //         }));
  //         return false;
  //       }
  //     } else {
  //       // iOS
  //       getLocation();
  //       return true;
  //     }
  //   } catch (err) {
  //     console.warn('Permission error:', err);
  //     return false;
  //   }
  // };

  // const getLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       const {latitude, longitude} = position.coords;
  //       setLocation({latitude, longitude});
  //       setErrors(prev => ({...prev, location: ''}));
  //     },
  //     error => {
  //       console.error('Location error:', error);
  //       setErrors(prev => ({...prev, location: 'Unable to fetch location.'}));
  //     },
  //     {enableHighAccuracy: true, timeout: 10000, maximumAge: 0},
  //   );
  // };

  const handleCategoryChange = value => {
    setSelectedCategories(value);
    if (value.length > 0) {
      setErrors(prev => ({...prev, category: ''}));
    }
  };

  const handlePress = async () => {
    // Clear previous errors
    setErrors({
      name:'',
      email: '',
      description: '',
      phone: '',
      category: '',
      location: '',
    });

    if (!validateInputs()) {
      if (errors.location) {
        Alert.alert(
          'Location Required',
          'This app needs location access to proceed. Please grant permission.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Grant Permission',
              onPress: async () => {
                const permissionGranted = await requestLocationPermission();
                if (permissionGranted && location) {
                  if (validateInputs()) {
                    proceedToNextPage();
                  }
                }
              },
            },
          ],
          {cancelable: false},
        );
      }
      return;
    }

    proceedToNextPage();
  };

  const proceedToNextPage = () => {
    setIsLoading(true);
    try {
      navigation.navigate('uploadimage', {
        name,
        email,
        description,
        phone,
        selectedCategories,
        location,
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <KeyboardAvoidingContainer>
      <ScrollView
        contentContainerStyle={[styles.screen, {backgroundColor: isDark ? '#000' : '#fff'}]}>
        <LocationPermission setLocation={setLocation} />
        <Header header={'Post Details'} />

        {/* Categories Dropdown */}
        <Dropdown
          item={
            fullCategorydata?.map(category => ({
              label: category.name || 'Unnamed',
              value: category.name || '',
            })) || []
          }
          placeholder={
            selectedCategories.length > 0
              ? selectedCategories.join(', ')
              : 'Select Categories'
          }
          selectedValues={selectedCategories}
          onChangeValue={handleCategoryChange}
        />
        <HelperText
          type="error"
          visible={!!errors.category}
          style={styles.errorText}>
          {errors.category}
        </HelperText>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDark ? '#000' : '#fff',
              borderColor: errors.name
                ? 'red'
                : isDark
                ? 'rgba(173, 173, 173, 0.31)'
                : 'rgba(173, 173, 173, 0.31)',
            },
          ]}>
          <TextInput
            value={name}
            style={[
              styles.textInput,
              {
                color: isDark ? '#fff' : '#000',
                backgroundColor: isDark ? '#000' : '#fff',
              },
            ]}
            onChangeText={text => {
              setname(text);
              if (text.trim()) setErrors(prev => ({...prev, name: ''}));
            }}
            placeholder="Product name"
            placeholderTextColor={isDark ? '#fff' : 'black'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <HelperText
          type="error"
          visible={!!errors.name}
          style={styles.errorText}>
          {errors.name}
        </HelperText>

        {/* Email Input */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDark ? '#000' : '#fff',
              borderColor: errors.email
                ? 'red'
                : isDark
                ? 'rgba(173, 173, 173, 0.31)'
                : 'rgba(173, 173, 173, 0.31)',
            },
          ]}>
          <TextInput
            value={email}
            style={[
              styles.textInput,
              {
                color: isDark ? '#fff' : '#000',
                backgroundColor: isDark ? '#000' : '#fff',
              },
            ]}
            onChangeText={text => {
              setEmail(text);
              if (text.trim()) setErrors(prev => ({...prev, email: ''}));
            }}
            placeholder="Email"
            placeholderTextColor={isDark ? '#fff' : 'black'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <HelperText
          type="error"
          visible={!!errors.email}
          style={styles.errorText}>
          {errors.email}
        </HelperText>

        {/* Phone Input */}
        <PhoneInput
          ref={phoneInput}
          value={phone}
          containerStyle={{
            width: Width * 0.9,
            height: 60,
            borderWidth: 1,
            backgroundColor: isDark ? '#000' : '#fff',
            borderColor: errors.phone
              ? 'red'
              : isDark
              ? '#333'
              : 'rgba(231, 231, 231, 1)',
            marginBottom: 5,
            borderRadius: 10,
          }}
          placeholder={
            Userfulldata?.phone?.length > 0 ? Userfulldata?.phone : 'Enter phone number'
          }
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
          defaultCode="IN"
          layout="second"
          onChangeText={text => setPhone(text)}
          onChangeFormattedText={text => setFormattedPhone(text)}
          textInputProps={{
            selectionColor: isDark ? '#fff' : '#000',
          }}
        />
        <HelperText
          type="error"
          visible={!!errors.phone}
          style={styles.errorText}>
          {errors.phone}
        </HelperText>

        {/* Location */}
        <View
          style={[
            styles.locationContainer,
            {
              borderColor: errors.location
                ? 'red'
                : isDark
                ? 'rgba(173, 173, 173, 0.31)'
                : 'rgba(173, 173, 173, 0.31)',
            },
          ]}>
          <Text
            style={[styles.locationText, {color: isDark ? '#fff' : '#000'}]}>
            {location ? 'Current location selected' : 'Select Location'}
          </Text>
        </View>
        <HelperText
          type="error"
          visible={!!errors.location}
          style={styles.errorText}>
          {errors.location}
        </HelperText>

        {/* Description */}
        <View
          style={[
            styles.descriptionContainer,
            {
              borderColor: errors.description
                ? 'red'
                : isDark
                ? 'rgba(173, 173, 173, 0.31)'
                : 'rgba(173, 173, 173, 0.31)',
            },
          ]}>
          <TextInput
            value={description}
            style={[
              styles.descriptionInput,
              {
                color: isDark ? '#fff' : '#000',
                backgroundColor: isDark ? '#000' : '#fff',
              },
            ]}
            onChangeText={text => {
              setDescription(text);
              if (text.trim()) setErrors(prev => ({...prev, description: ''}));
            }}
            placeholder="Product description"
            placeholderTextColor={isDark ? '#fff' : 'black'}
            multiline
            numberOfLines={8}
          />
        </View>
        <HelperText
          type="error"
          visible={!!errors.description}
          style={styles.errorText}>
          {errors.description}
        </HelperText>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handlePress}
          disabled={isLoading}>
          <Text style={styles.nextButtonText}>
            {isLoading ? 'Processing...' : 'Next'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    // </KeyboardAvoidingContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    // height: Height,
    width: Width,
    alignItems: 'center',
    // paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    width:Width*0.9,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  textInput: {
    width: '100%',
    height: Height * 0.06,
  },
  phoneContainer: {
    width: Width*0.9,
    height: Height * 0.06,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 5,
  },
  locationContainer: {
    width:Width*0.9,
    height: Height * 0.06,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  locationText: {
    fontSize: 16,
  },
  descriptionContainer: {
    width: Width*0.9,
    height: Height * 0.2,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 5,
    // padding: 10,
  },
  descriptionInput: {
    width: '100%',
    height: '100%',
    textAlignVertical: 'top',
  },
  nextButton: {
    width: Width*0.9,
    height: Height * 0.06,
    backgroundColor: '#00AEEF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: '20%',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '500',
  },
  errorText: {
    width: Width*0.95,
    textAlign: 'left',
    marginBottom: 1,
  },
});