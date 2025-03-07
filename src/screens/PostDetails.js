import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity, 
} from 'react-native';
import React, {useContext} from 'react';
import {HelperText} from 'react-native-paper';
import {useState} from 'react';
import {AuthContext} from '../context/authcontext';
import {Dimensions} from 'react-native'; 
import Dropdown from '../components/Dropdown';
import {useRef} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native'; 
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {ThemeContext} from '../context/themeContext';
import Header from '../components/Header';
import LocationPermission from '../hooks/uselocation';
import KeyboardAvoidingContainer from '../components/KeyboardAvoided';

export default function PostDetails({navigation, route}) {
  const [email, setEmail] = useState('');
  const [description, setdescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setphone] = useState('');
  const [formattedphone, setFormattedphone] = useState('');
  const phoneInput = useRef(null);
  const isFocused = useIsFocused();
  const [selectedCategories, setSelectedCategories] = useState([]);
  // const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const handleCategoryChange = value => {
    setSelectedCategories(value); // Update selected categories
  };

  const {getCategories, fullCategorydata, location, setisposting} =
    useContext(AuthContext);

  useEffect(() => {
    getCategories();
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
      navigation.navigate('uploadimage', {
        email: email,
        description: description,
        phone: phone,
        selectedCategories: selectedCategories,
        location: location,
      });
    } catch (error) {
      // Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <KeyboardAvoidingContainer>
    <View style={[styles.screen, {backgroundColor: isDark ? '#000' : '#fff'}]}>
      {/* <LocationPermission setLocation={setLocation} /> */}

      <Header header={'Post Details'} />

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
            backgroundColor: isDark ? '#000' : '#fff',
            borderColor: isDark
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
        onChangeText={text => setphone(text)}
        onChangeFormattedText={text => setFormattedphone(text)}
        textInputProps={{
          selectionColor: isDark ? '#fff' : '#000', // Set cursor color
        }}
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
          {
            height: 100,
            alignItems: 'flex-start',
            borderColor: isDark
              ? 'rgba(173, 173, 173, 0.31)'
              : 'rgba(173, 173, 173, 0.31)',
          },
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
    // </KeyboardAvoidingContainer>
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
    width: Width * 0.8,
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
    marginTop: '20%',
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
