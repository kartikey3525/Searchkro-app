import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import {HelperText} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import {useEffect, useState} from 'react';
import {AuthContext} from '../context/authcontext';
import Dropdown from '../components/Dropdown';
import {useRef} from 'react';
import PhoneInput from 'react-native-phone-number-input';
import {Dimensions} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {useContext} from 'react';
import DatePicker from 'react-native-date-picker';
import {ThemeContext} from '../context/themeContext';
import Header from '../components/Header';
import useImagePicker from '../hooks/useImagePicker';
import {useIsFocused} from '@react-navigation/native';
import KeyboardAvoidingContainer from '../components/KeyboardAvoided';

export default function EditProfile({navigation}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [gender, setgender] = useState([]);

  const [date, setDate] = useState(new Date());
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState('');
  const phoneInput = useRef(null);
  const [value, setValue] = useState('');

  const [errors, setErrors] = useState({
    value: '',
    name: '',
    phone: '',
    gender: '',
  });

  const {media, selectMedia, requestCameraPermission, setMedia} =
    useImagePicker();

  const {
    getCategories,
    uploadImage,
    getUserData,
    Userfulldata,
    updatebuyerProfile,
    imageUrl,
  } = useContext(AuthContext);

  useEffect(() => {
    getCategories();
    getUserData();
    // console.log('userdata50', Userfulldata);
  }, [useIsFocused()]);

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    let newErrors = {phone: '', name: '', gender: ''};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
      isValid = false;
    } else if (name.length < 6) {
      newErrors.name = 'Name must be at least 6 characters long.';
      isValid = false;
    }

    // if (!email.trim()) {
    //   newErrors.email = 'Email or phone number is required.';
    //   isValid = false;
    // } else if (!emailRegex.test(email) && !phoneRegex.test(email)) {
    //   newErrors.email = 'Please enter a valid email address or phone number.';
    //   isValid = false;
    // }

    if (!value.trim()) {
      newErrors.phone = 'Phone number is required.';
      isValid = false;
    } else if (phoneInput.current && !phoneInput.current.isValidNumber(value)) {
      newErrors.phone = 'Enter a valid phone number.';
      isValid = false;
    }

    if (gender.length === 0) {
      newErrors.gender = 'Please select at least one category.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePress = async () => {
    setErrors({phone: '', name: '', gender: ''});
    if (!validateInputs()) return;
    try {
      console.log('imageUrl121', value);

      // await uploadImage(media); // Wait for the URL

      // setTimeout(async () => {
      //   if (!imageUrl == []) {
      //     // console.log('imageUrl121', name, date, value, gender, media[0].uri);
      await updatebuyerProfile(name, date, value, gender, media[0]);
      //     // Pass valid image URL
      //   }
      // }, 2000); // 2-second delay
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (imageUrl, updatebuyerProfile) => {
    try {
      console.log('Uploading image...');

      await uploadImage(media); // Wait for the URL

      setTimeout(async () => {
        // if (!imageUrl) {
        //   console.log('❌ Image upload failed. Profile update aborted.');
        //   return;
        // }

        console.log('Image uploaded. Updating profile...');
        if (!imageUrl) {
          await updatebuyerProfile(name, gender, imageUrl);
          // console.log('✅ Profile updated successfully!');
          // Pass valid image URL
        }
      }, 2000); // 2-second delay
    } catch (error) {
      console.log('❌ Error updating profile:', error);
    }
  };

  const formatDate = date => {
    return `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleCategoryChange = value => {
    setgender(value); // Update selected categories
  };

  return (
    // <KeyboardAvoidingContainer>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.screen,
        {backgroundColor: isDark ? 'black' : 'white'},
      ]}>
      <Header header={'Edit profile '} />

      <View
        style={[
          styles.rectangle2,
          {
            overflow: 'hidden',
            marginBottom: 30,
          },
        ]}>
        {media && media.length > 0 ? (
          <>
            <Image
              source={{uri: media[0]}}
              style={{
                width: 120,
                height: 120,
                alignSelf: 'center',
                overflow: 'hidden',
                borderRadius: 100,
                top: 10,
                borderWidth: 5,
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 1)'
                  : 'rgba(231, 231, 231, 1)',
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMedia([])} // Reset media array properly
            >
              <Entypo name="cross" size={25} color="black" />
            </TouchableOpacity>
          </>
        ) : (
          <Image
            source={
              Userfulldata && Userfulldata.profile?.length > 0
                ? {uri: Userfulldata.profile[0]}
                : require('../assets/User-image.png')
            }
            style={{
              width: 120,
              height: 120,
              alignSelf: 'center',
              overflow: 'hidden',
              borderRadius: 100,
              top: 10,
              borderWidth: 5,
              borderColor: 'rgba(0, 0, 0, 0.14)',
            }}
          />
        )}

        <Pressable onPress={selectMedia}>
          <Image
            source={require('../assets/edit.png')}
            style={{
              width: 50,
              height: 35,
              right: 5,
              bottom: 20,
              alignSelf: 'flex-end',
            }}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isDark
              ? 'rgba(37, 37, 37, 1)'
              : 'rgba(231, 231, 231, 1)',
          },
        ]}>
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
          value={name}
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? 'black' : 'white',
              color: isDark ? 'white' : 'black',
            },
          ]}
          onChangeText={setName}
          placeholder="Name"
          mode="outlined"
          placeholderTextColor={isDark ? 'white' : 'black'}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.name}>
        {errors.name}
      </HelperText>

      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.inputContainer,
          {
            borderColor: isDark
              ? 'rgba(37, 37, 37, 1)'
              : 'rgba(231, 231, 231, 1)',
          },
        ]}>
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
          editable={false}
          placeholder="Date"
          mode="outlined"
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? 'black' : 'white',
              color: isDark ? 'white' : 'black',
            },
          ]}
          placeholderTextColor={isDark ? 'white' : 'black'}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </Pressable>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.date}>
        {errors.date}
      </HelperText>

      {/* <View
        style={[
          styles.inputContainer,
          {
            borderColor: isDark
              ? 'rgba(37, 37, 37, 1)'
              : 'rgba(231, 231, 231, 1)',
          },
        ]}>
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
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? 'black' : 'white',
              color: isDark ? 'white' : 'black',
            },
          ]}
          placeholderTextColor={isDark ? 'white' : 'black'}
          onChangeText={setEmail}
          placeholder="Email"
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.email}>
        {errors.email}
      </HelperText> */}

      <PhoneInput
        ref={phoneInput}
        value={value}
        containerStyle={{
          width: Width * 0.9,
          height: 60,
          borderWidth: 1,
          borderColor: isDark
            ? 'rgba(37, 37, 37, 1)'
            : 'rgba(231, 231, 231, 1)',
          marginBottom: 20,
          borderRadius: 10,
        }}
        countryPickerProps={{
          withAlphaFilter: true,
          withFlag: true,
          withCallingCode: true,
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
        placeholderTextColor={isDark ? '#fff' : '#000'}
        defaultCode="IN"
        style={{}}
        layout="second"
        onChangeText={text => {
          setValue(text);
        }}
      />
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.phone}>
        {errors.phone}
      </HelperText>
      <Dropdown
        placeholder="Select Gender"
        item={[
          {label: 'Male', value: 'male'},
          {label: 'Female', value: 'female'},
          {label: 'Others', value: 'others'},
        ]}
        selectedValues={gender}
        onChangeValue={handleCategoryChange}
        single={true} // Enable single selection
      />
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.gender}>
        {errors.gender}
      </HelperText>

      <TouchableOpacity
        style={[styles.blueBotton, {margin: '10%'}]}
        // onPress={() => navigation.navigate('Profilescreen')}

        onPress={handlePress}>
        <Text
          style={[
            styles.smallText,
            {
              color: '#fff',
              fontSize: 22,
              marginBottom: 0,
            },
          ]}>
          Update profile
        </Text>
      </TouchableOpacity>

      <DatePicker
        modal
        theme={isDark ? 'dark' : 'light'} // Set theme dynamically
        open={open}
        date={date}
        mode="date"
        textColor={isDark ? '#fff' : '#000'} // Adjust text color
        androidVariant="iosClone" // Ensures better dark mode support on Android
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
    // </KeyboardAvoidingContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
    top: 14,
    right: 10,
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
