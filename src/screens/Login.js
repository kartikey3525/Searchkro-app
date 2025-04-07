import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import {HelperText} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/authcontext';
import {ThemeContext} from '../context/themeContext';

const {width: Width, height: Height} = Dimensions.get('window');

export default function Login({navigation}) {
  // State management
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    handleRemenberme: true,
  });
  const [isNew, setIsNew] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [loading, setLoading] = useState({
    login: false,
    register: false,
    google: false,
    forgotPassword: false,
  });

  // Context hooks
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const {
    signInWithGoogle,
    handleLogin,
    handleResetPassword,
    handleRegister,
  } = useContext(AuthContext);

  // Input validation helpers
  const containsEmojis = (text) => /[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu.test(text);
  const hasLeadingOrTrailingSpace = (text) => text !== text.trim();
  const hasConsecutiveSpaces = (text) => text.includes('  ');

  // Input handlers
  const handleInputChange = (field, value) => {
    // Validation based on field type
    if (containsEmojis(value)) {
      setErrors(prev => ({...prev, [field]: 'Emojis are not allowed'}));
      return;
    }

    if (field === 'password' && value.includes(' ')) {
      setErrors(prev => ({...prev, password: 'Spaces are not allowed'}));
      return;
    }

    if ((field === 'username' || field === 'email') && hasLeadingOrTrailingSpace(value)) {
      setErrors(prev => ({...prev, [field]: 'No leading/trailing spaces'}));
      return;
    }

    if (field === 'username' && hasConsecutiveSpaces(value)) {
      setErrors(prev => ({...prev, username: 'Only single spaces allowed'}));
      return;
    }

    setFormData(prev => ({...prev, [field]: value}));
    setErrors(prev => ({...prev, [field]: ''}));
  };

  // Form validation
  const validateInputs = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const newErrors = {email: '', password: '', username: ''};
    let isValid = true;

    // Email/phone validation
    if (!formData.email) {
      newErrors.email = 'Email or phone is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.email) && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 characters';
      isValid = false;
    }

    // Username validation (only for registration)
    if (isNew) {
      if (!formData.username) {
        newErrors.username = 'Username is required';
        isValid = false;
      } else if (formData.username.length < 3) {
        newErrors.username = 'Minimum 3 characters';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Auth handlers
  const handleAuthPress = async () => {
    if (!validateInputs()) return;

    const loadingType = isNew ? 'register' : 'login';
    setLoading(prev => ({...prev, [loadingType]: true}));

    try {
      if (isNew) {
        await handleRegister(
          formData.email,
          formData.password,
          formData.username,
          formData.handleRemenberme
        );
      } else {
        await handleLogin(
          formData.email,
          formData.password,
          formData.handleRemenberme
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(prev => ({...prev, [loadingType]: false}));
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(prev => ({...prev, google: true}));
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('Error', error.message || 'Google sign-in failed');
    } finally {
      setLoading(prev => ({...prev, google: false}));
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      Alert.alert('Invalid Email', 'Please enter your email to reset password.');
      return;
    }

    setLoading(prev => ({...prev, forgotPassword: true}));
    try {
      await handleResetPassword(formData.email);
      Alert.alert('Success', 'Password reset link sent to your email');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setLoading(prev => ({...prev, forgotPassword: false}));
    }
  };

  // Render methods
  const renderAuthButton = () => {
    const isLoading = isNew ? loading.register : loading.login;
    
    return (
      <TouchableOpacity
        style={[styles.blueBotton, isLoading && styles.disabledButton]}
        onPress={handleAuthPress}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isNew ? 'Send OTP' : 'Login'}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderGoogleButton = () => (
    <TouchableOpacity
      style={[
        styles.whiteBotton,
        {backgroundColor: isDark ? '#000' : '#fff'},
        loading.google && styles.disabledButton,
      ]}
      onPress={handleGoogleSignIn}
      disabled={loading.google}>
      {loading.google ? (
        <ActivityIndicator color={isDark ? '#fff' : '#000'} />
      ) : (
        <>
          <Image
            source={require('../assets/Google.png')}
            style={styles.socialIcon}
            resizeMode="contain"
          />
          <Text style={[
            styles.socialButtonText,
            {color: isDark ? '#fff' : '#1D1E20'}
          ]}>
            Login with Google
          </Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.screen,
        {backgroundColor: isDark ? 'black' : 'white'},
      ]}>
      {/* Logo */}
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={[styles.bigText, {color: isDark ? '#fff' : '#000'}]}>
        {isNew ? 'Create an account' : 'Welcome Back'}
      </Text>
      <Text style={[styles.smallText, {marginBottom: 30, color: isDark ? '#ccc' : '#000'}]}>
        {isNew ? 'Create your account using email or social networks' : 'Log in to your account using email or social networks'}
      </Text>

      {/* Username Field (only for registration) */}
      {isNew && (
        <>
          <View style={[
            styles.inputContainer,
            {backgroundColor: isDark ? '#000' : '#fff'},
          ]}>
            <TextInput
              value={formData.username}
              style={[
                styles.textInput,
                {
                  backgroundColor: isDark ? '#000' : '#fff',
                  color: isDark ? '#fff' : '#000',
                },
              ]}
              onChangeText={(text) => handleInputChange('username', text)}
              placeholder="Username"
              placeholderTextColor={isDark ? 'white' : 'black'}
              autoCapitalize="none"
            />
          </View>
          <HelperText type="error" visible={!!errors.username}>
            {errors.username}
          </HelperText>
        </>
      )}

      {/* Email Field */}
      <View style={styles.inputContainer}>
        <TextInput
          value={formData.email}
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? '#000' : '#fff',
              color: isDark ? '#fff' : '#000',
            },
          ]}
          onChangeText={(text) => handleInputChange('email', text)}
          placeholder="Email"
          placeholderTextColor={isDark ? 'white' : 'black'}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <HelperText type="error" visible={!!errors.email}>
        {errors.email}
      </HelperText>

      {/* Password Field */}
      <View style={styles.inputContainer}>
        <TextInput
          value={formData.password}
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? '#000' : '#fff',
              color: isDark ? '#fff' : '#000',
            },
          ]}
          onChangeText={(text) => handleInputChange('password', text)}
          placeholder="Password"
          secureTextEntry={!showPassword}
          placeholderTextColor={isDark ? 'white' : 'black'}
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
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>

      {/* Remember Me & Forgot Password */}
      <Pressable
  onPress={() => handleInputChange('handleRemenberme', !formData.handleRemenberme)}
  style={styles.rememberMeContainer}>
  
  <Ionicons
    name={formData.handleRemenberme ? 'checkmark-circle' : 'ellipse-outline'}
    size={24}
    color={formData.handleRemenberme ? '#43E2F3' : '#949090'}
    style={{marginRight: 6}}
  />

  <Text style={[styles.rememberMeText, {color: isDark ? '#fff' : '#B2BACD'}]}>
    Remember me
  </Text>

  {!isNew && (
    <Text
      onPress={handleForgotPassword}
      style={[styles.forgotPasswordText, {color: '#43E2F3'}]}>
      Forgot Password?
    </Text>
  )}
</Pressable>


      {/* Auth Button */}
      {renderAuthButton()}

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Google Sign-In */}
      {renderGoogleButton()}

      {/* Toggle between Login/Register */}
      <Text style={[styles.toggleAuthText, {color: isDark ? '#B2BACD' : '#1D1E20'}]}>
        {isNew ? "Already have an account?" : "Don't have an account?"}
        <Text 
          onPress={() => setIsNew(!isNew)} 
          style={{color: '#43E2F3'}}>
          {isNew ? ' Login' : ' Sign up'}
        </Text>
      </Text>

      {/* Terms & Conditions */}
      <Text style={[styles.termsText, {color: isDark ? '#B2BACD' : '#1D1E20'}]}>
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
    height: Height,
    width: Width,
    alignItems: 'center',
    paddingTop: '15%',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#A3A3A3',
    width: '90%',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 5,
  },
  textInput: {
    borderRadius: 10,
    width: '86%',
    height: Height * 0.06,
    padding: 10,
  },
  smallText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    width: 250,
    marginBottom: 10,
  },
  bigText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  blueBotton: {
    backgroundColor: '#00AEEF',
    width: '90%',
    height: Height * 0.06,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteBotton: {
    width: '90%',
    height: Height * 0.06,
    borderRadius: 10,
    margin: 5,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#A3A3A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '500',
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
  socialButtonText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '400',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 15,
  },
  rememberMeText: {
    fontSize: 15,
    width: Width * 0.48,
  },
  forgotPasswordText: {
    fontSize: 15,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#A3A3A3',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#9DA49E',
  },
  toggleAuthText: {
    fontSize: 15,
    marginVertical: 10,
  },
  termsText: {
    fontSize: 15,
    margin: 20,
    textAlign: 'center',
  },
});