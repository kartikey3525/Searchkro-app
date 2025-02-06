import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useContext} from 'react';
import {HelperText} from 'react-native-paper';
import {useState} from 'react';
import {AuthContext} from '../context/authcontext';
import {Dimensions} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useRef} from 'react';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {ThemeContext} from '../context/themeContext';

export default function ForgetPassword({navigation}) {
  const [email, setEmail] = useState('');
  const [description, setdescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef(null);
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [errors, setErrors] = useState({
    email: '',
    description: '',
  });
  const {handleRegister, handleLogin, handleResetPassword} =
    useContext(AuthContext);

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!email && !description) {
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

    if (!description.trim()) {
      setErrors(prevState => ({
        ...prevState,
        description: 'description is required.',
      }));
      return false;
    }

    if (description.length < 6) {
      setErrors(prevState => ({
        ...prevState,
        description: 'description must be at least 6 characters long.',
      }));
      return false;
    }

    setErrors({email: '', description: ''});
    return true;
  };

  const handlePress = async () => {
    setErrors({email: '', description: ''});
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      await handleLogin(email, description);
      console.log('Success', 'Login successful!');
      navigation.navigate('OTPScreen', {
        emailPhone: email,
        description: description,
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
      </View>

      <Text
        style={[
          styles.modalText,
          {
            fontWeight: 'bold',
            marginBottom: 10,
            fontSize: 30,
            color: isDark ? '#fff' : 'rgb(0, 0, 0)',
          },
        ]}>
        Forget password
      </Text>
      <Text
        style={[
          styles.modalText,
          {
            width: Width * 0.65,
            textAlign: 'center',
            fontWeight: 'normal',
            fontSize: 16,
            color: isDark ? '#fff' : 'rgb(0, 0, 0)',
            marginBottom: 40,
          },
        ]}>
        Please enter your email to reset the password?
      </Text>

      <View
        style={[
          styles.inputContainer,
          {backgroundColor: isDark ? '#121212' : '#fff'},
        ]}>
        <TextInput
          value={email}
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? '#121212' : '#fff',
              color: isDark ? '#fff' : 'rgb(0, 0, 0)',
            },
          ]}
          onChangeText={setEmail}
          placeholder="enter your email address"
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

      <TouchableOpacity
        style={styles.blueBotton}
        onPress={() => navigation.navigate('OTPScreen')}
        // onPress={() => handlePress()}
      >
        <Text
          style={[
            styles.smallText,
            {color: '#fff', fontSize: 22, marginBottom: 0},
          ]}>
          Continue
        </Text>
      </TouchableOpacity>
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
    margin: '90%',
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
