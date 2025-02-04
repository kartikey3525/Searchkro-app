import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useContext} from 'react';
import {HelperText} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import {AuthContext} from '../context/authcontext';
import {Dimensions} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {ThemeContext} from '../context/themeContext';

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [isnew, setIsnew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    username: '',
  });
  const {handleRegister, handleLogin, handleResetPassword} =
    useContext(AuthContext);

  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

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
    if (isnew) {
      if (!username.trim()) {
        setErrors(prevState => ({
          ...prevState,
          username: 'username is required.',
        }));
        return false;
      }
    }

    setErrors({email: '', password: '', username: ''});
    return true;
  };

  const handlePress = async () => {
    setErrors({email: '', password: '', username: ''});
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      await handleLogin(email, password, username);
      console.log('Success', 'Login successful!');
      navigation.navigate('OTPScreen', {
        emailPhone: email,
        password: password,
        username: username,
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert(
        'Invalid Email',
        'Please enter your email to reset password.',
      );
      return;
    }

    setIsLoading(true);
    try {
      await handleResetPassword(email);
      Alert.alert(
        'Success',
        'A password reset link has been sent to your email.',
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to send reset email. Please check your email and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.screen,
        {backgroundColor: isDark ? 'black' : 'white'},
      ]}>
      <Image
        source={require('../assets/logo.png')}
        style={{width: 100, height: 100, alignSelf: 'center', top: 30}}
        resizeMode="contain"
      />

      {!isnew ? (
        <>
          <Text style={[styles.bigText, {color: isDark ? '#fff' : '#000'}]}>
            Welcome Back
          </Text>
          <Text style={[styles.smallText, {color: isDark ? '#ccc' : '#000'}]}>
            Log in to your account using email or social networks
          </Text>
        </>
      ) : (
        <>
          <Text style={[styles.bigText, {color: isDark ? '#fff' : '#000'}]}>
            Create an account
          </Text>
          <Text
            style={[
              styles.smallText,
              {marginBottom: 40, color: isDark ? '#fff' : '#000'},
            ]}>
            create your account using email or social networks
          </Text>
        </>
      )}

      {isnew ? (
        <>
          <View
            style={[
              styles.inputContainer,
              {backgroundColor: isDark ? '#000' : '#fff'},
            ]}>
            <TextInput
              value={username}
              style={[
                styles.textInput,
                {
                  backgroundColor: isDark ? '#000' : '#fff',
                  color: isDark ? '#fff' : '#000',
                },
              ]}
              onChangeText={setusername}
              placeholder="Username"
              mode="outlined"
              placeholderTextColor={isDark ? 'white' : 'black'}
              keyboardType="default"
              autoCapitalize="none"
            />
          </View>
          <HelperText
            type="error"
            style={{alignSelf: 'flex-start', marginLeft: 14}}
            visible={!!errors.username}>
            {errors.username}
          </HelperText>
        </>
      ) : null}

      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? '#000' : '#fff',
              color: isDark ? '#fff' : '#000',
            },
          ]}
          onChangeText={setEmail}
          placeholder="Email or phone number"
          mode="outlined"
          placeholderTextColor={isDark ? 'white' : 'black'}
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

      <View style={styles.inputContainer}>
        <TextInput
          value={password}
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? '#000' : '#fff',
              color: isDark ? '#fff' : '#000',
            },
          ]}
          onChangeText={setPassword}
          placeholder="Password"
          mode="outlined"
          secureTextEntry={!showPassword}
          placeholderTextColor={isDark ? 'white' : 'black'}
          keyboardType="password"
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color={isDark ? 'white' : 'black'}
            style={{marginRight: 10}}
          />
        </TouchableOpacity>
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.password}>
        {errors.password}
      </HelperText>

      <View
        style={{
          alignItems: 'flex-start',
          flexDirection: 'row',
          width: '90%',
          padding: 2,
        }}>
        <Ionicons
          name="checkmark-circle-outline"
          size={25}
          color={'#949090'}
          style={{marginRight: 8}}
        />
        <Text
          style={[
            styles.smallText,
            {textAlign: 'left', color: '#B2BACD', width: Width * 0.48},
          ]}>
          Remenber me{' '}
        </Text>
        <Text
          onPress={() => navigation.navigate('forgetpassword')}
          style={[styles.smallText, {textAlign: 'left', color: '#43E2F3'}]}>
          Forget Password?
        </Text>
      </View>

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
          Sent OTP{' '}
        </Text>
      </TouchableOpacity>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{width: '40%', height: 2, backgroundColor: '#A3A3A3'}} />
        <Text style={[{textAlign: 'left', color: '#9DA49E', margin: 10}]}>
          OR
        </Text>
        <View style={{width: '40%', height: 2, backgroundColor: '#A3A3A3'}} />
      </View>
      <TouchableOpacity
        style={[
          styles.whiteBotton,
          {backgroundColor: isDark ? '#000' : '#fff'},
        ]}
        onPress={() => navigation.navigate('BottomTabs')}>
        <Image
          source={require('../assets/Google.png')}
          style={{
            width: 40,
            height: 40,
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />
        <Text
          style={[
            {
              color: isDark ? '#fff' : '#1D1E20',
              fontSize: 18,
              textAlign: 'center',
              marginBottom: 0,
              fontWeight: '600',
              alignSelf: 'center',
              marginLeft: 10,
            },
          ]}>
          Login with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.whiteBotton,
          {backgroundColor: isDark ? '#000' : '#fff'},
        ]}
        onPress={() => navigation.navigate('BottomTabs')}>
        <Image
          source={require('../assets/Facebook.png')}
          style={{
            width: 40,
            height: 40,
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />
        <Text
          style={[
            {
              color: isDark ? '#fff' : '#1D1E20',
              fontSize: 18,
              textAlign: 'center',
              marginBottom: 0,
              fontWeight: '600',
              alignSelf: 'center',
              marginLeft: 10,
            },
          ]}>
          Login with Facebook
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.smallText,
          {
            width: 350,
            margin: 10,
            marginBottom: 0,
            color: isDark ? '#B2BACD' : '#1D1E20',
          },
        ]}>
        {isnew ? '' : ' Dont'} have an account ?
        <Text onPress={() => setIsnew(!isnew)} style={{color: '#43E2F3'}}>
          {isnew ? ' Login' : ' Sign up'}
        </Text>
      </Text>

      <Text
        style={[
          styles.smallText,
          {width: 350, margin: 20, color: isDark ? '#B2BACD' : '#1D1E20'},
        ]}>
        By signing up you agree to our
        <Text style={{color: '#43E2F3'}}> Terms & Conditions </Text>
        and
        <Text style={{color: '#43E2F3'}}> Privacy Policy</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: Width,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#A3A3A3',
    width: '90%',
    borderWidth: 1,
    borderRadius: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    color: '#000',
    width: '86%',
    height: Height * 0.06,
    padding: 10,
    margin: 4,
  },
  smallText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1D1E20',
    textAlign: 'center',
    width: 250,
    marginBottom: 20,
    fontFamily: 'NunitoSans-VariableFont_YTLC,opsz,wdth,wght',
  },

  bigText: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
    marginBottom: 6,
    fontFamily: 'Poppins-Bold',
  },
  blueBotton: {
    backgroundColor: '#00AEEF',
    width: '90%',
    height: Height * 0.07,
    borderRadius: 10,
    margin: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteBotton: {
    backgroundColor: '#fff',
    width: '90%',
    height: Height * 0.07,
    borderRadius: 10,
    margin: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#A3A3A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
