import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
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
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {ThemeContext} from '../context/themeContext';

export default function PostDetails({navigation, route}) {
  const [email, setEmail] = useState('');
  const [description, setdescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setphone] = useState('');
  const [formattedphone, setFormattedphone] = useState('');
  const phoneInput = useRef(null);
  const isFocused = useIsFocused();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const {isposting, setisposting} = useContext(AuthContext);

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
    setisposting(false);
    setSelectedCategories(route?.params?.selectedcategory); // Set the selected category by ID
  }, [isFocused]);

  const [errors, setErrors] = useState({
    email: '',
    description: '',
    phone: '',
    selectedCategories: '',
    location: '',
  });

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    let valid = true;
    let newErrors = {
      email: '',
      description: '',
      phone: '',
      category: '',
      location: '',
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
      phone: '',
      selectedCategories: '',
      location: '',
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
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.screen, {backgroundColor: isDark ? '#000' : '#fff'}]}>
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
              marginLeft: '22%',
              color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
            },
          ]}>
          Post Details
        </Text>
      </View>

      <Dropdown
        item={
          fullCategorydata?.map(category => ({
            label: category.name || 'Unnamed',
            value: category.name || '',
          })) || []
        }
        placeholder={
          selectedCategories.length > 0
            ? selectedCategories
                .map(
                  name =>
                    fullCategorydata.find(cat => cat.name === name)?.name || '',
                )
                .join(', ')
            : 'Select Categories'
        }
        selectedValues={selectedCategories} // Pass the selected categories to the dropdown
        onChangeValue={handleCategoryChange} // Handle category selection changes
      />

      <HelperText type="error" visible={!!errors.category} style={{height: 10}}>
        {errors.category}
      </HelperText>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? '#121212' : '#fff',
            borderColor: isDark ? '121212' : '#fff',
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
          onChangeText={setEmail}
          placeholder="Email"
          mode="outlined"
          placeholderTextColor={isDark ? '#fff' : 'black'}
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

      <PhoneInput
        ref={phoneInput}
        defaultValue={phone}
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
        onChangeFormattedText={text => setFormattedphone(text)}
      />

      <HelperText type="error" visible={!!errors.phone} style={{height: 10}}>
        {errors.phone}
      </HelperText>

      {/* Location Validation */}
      <Dropdown
        style={styles.inputContainer}
        placeholder={location ? 'Selected current location' : 'Select Location'}
      />
      <HelperText type="error" visible={!!errors.location} style={{height: 10}}>
        {errors.location}
      </HelperText>

      <View
        style={[
          styles.inputContainer,
          {height: 100, alignItems: 'flex-start'},
        ]}>
        <TextInput
          value={description}
          style={[
            styles.textInput,
            {
              height: 93,
              color: isDark ? '#fff' : 'black',
              backgroundColor: isDark ? '#000' : '#fff',
            },
          ]}
          onChangeText={setdescription}
          numberOfLines={5}
          multiline={true}
          placeholder="Product description"
          mode="outlined"
          placeholderTextColor={isDark ? '#fff' : 'black'}
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
        style={styles.blueBotton}
        // onPress={() => navigation.navigate('uploadimage')}
        onPress={() => handlePress()}>
        <Text
          style={[
            styles.smallText,
            {color: '#fff', fontSize: 22, marginBottom: 0},
          ]}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: Width,
    height: Height,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    borderColor: 'rgba(231, 231, 231, 0.49)',
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
    margin: '40%',
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
