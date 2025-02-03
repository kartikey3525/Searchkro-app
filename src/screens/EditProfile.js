import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {HelperText} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useState} from 'react';
import {AuthContext} from '../context/authcontext';
import Dropdown from '../components/Dropdown';
import {useRef} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {launchImageLibrary} from 'react-native-image-picker';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dimensions} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {useContext} from 'react';
import DatePicker from 'react-native-date-picker';
// import PhoneInput from 'react-phone-number-input/input';
// import PhoneTextInput from '../components/PhoneTextInput';
export default function EditProfile({navigation}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());

  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState([]);
  const [open, setOpen] = useState('');
  const phoneInput = useRef(null);
  const [value, setValue] = useState('');

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

  const formatDate = date => {
    return `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View
        style={{
          alignItems: 'center',
          width: Width,
          flexDirection: 'row',
          height: Height * 0.1,
          marginTop: 20,
          justifyContent: 'flex-start',
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
              fontFamily: 'Poppins-Bold',
              fontSize: 20,
              fontWeight: 'bold',
              alignSelf: 'center',
              marginLeft: '25%',
            },
          ]}>
          Edit profile
        </Text>
      </View>

      <View
        style={[
          styles.rectangle2,
          {
            overflow: 'hidden',
            marginBottom: 30,
          },
        ]}>
        <Image
          source={require('../assets/User-image.png')}
          style={{
            width: 120,
            height: 120,
            alignSelf: 'center',
            overflow: 'hidden',
            borderRadius: 100,
            top: 15,
            borderWidth: 5,
            borderColor: 'rgba(0, 0, 0, 0.14)',
          }}
        />
        <Image
          source={require('../assets/edit.png')}
          style={{
            width: 50,
            height: 35,
            right: 35,
            bottom: 20,
            alignSelf: 'flex-end',
          }}
          resizeMode="contain"
        />
        <View style={{alignSelf: 'center'}}>
          <Text
            style={[
              styles.recListText,
              {
                fontSize: 15,
                width: 200,
                fontWeight: 'bold',
                color: 'black',
                alignSelf: 'center',
                textAlign: 'center',
              },
            ]}>
            Itunuoluwa Abidoye
          </Text>

          <Text
            style={[
              styles.recListText,
              {
                color: 'rgba(23, 23, 23, 0.59)',
                alignSelf: 'center',
                textAlign: 'center',
              },
            ]}>
            @Itunuoluwa
          </Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/profile-edit.png')}
          style={{
            width: 25,
            height: 18,
            marginLeft: 15,
          }}
          resizeMode="contain"
        />
        <TextInput
          value={email}
          style={styles.textInput}
          onChangeText={setEmail}
          placeholder="Name"
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

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <Image
            source={require('../assets/calendar.png')}
            style={{
              width: 25,
              height: 20,
              marginLeft: 15,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TextInput
          value={formatDate(date)}
          style={styles.textInput}
          onChangeText={setEmail}
          placeholder="Date"
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

      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/mail.png')}
          style={{
            width: 25,
            height: 16,
            marginLeft: 15,
          }}
          resizeMode="contain"
        />
        <TextInput
          value={email}
          style={styles.textInput}
          onChangeText={setEmail}
          placeholder="Email"
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

      <PhoneInput
        ref={phoneInput}
        defaultValue={value}
        containerStyle={{
          width: Width * 0.9,
          height: 60,
          borderWidth: 1,
          borderColor: 'rgba(231, 231, 231, 1)',
          marginBottom: 20,
          borderRadius: 10,
        }}
        countryPickerProps={{
          withAlphaFilter: true,
          withFlag: true,
          withCallingCode: true,
        }}
        textInputStyle={{height: 50}}
        defaultCode="IN"
        style={{}}
        layout="second"
        onChangeText={text => {
          setValue(text);
        }}
        onChangeFormattedText={text => {
          setFormattedValue(text);
        }}
      />

      <Dropdown style={styles.inputContainer} placeholder="Gender" />

      <TouchableOpacity
        style={[styles.blueBotton, {margin: '10%'}]}
        onPress={() => navigation.navigate('Profile')}>
        <Text
          style={[
            styles.smallText,
            {
              color: '#fff',
              fontSize: 22,
              marginBottom: 0,
            },
          ]}>
          Submit profile
        </Text>
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        minimumDate={new Date('1900-01-01')}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
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
  addSelector: {
    width: '20%',
  },
  imageWrapper: {
    position: 'relative',
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
    width: Width * 0.9,
    height: 150,
    borderWidth: 1,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 10,
    borderStyle: 'dashed',
    borderColor: 'rgba(130, 130, 130, 0.44)',
    marginBottom: 10,
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
