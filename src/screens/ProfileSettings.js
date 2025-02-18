import {
  View,
  Text,
  Image,
  StyleSheet, 
  TouchableOpacity,
  ScrollView, 
  Pressable,
} from 'react-native';
import React, {useContext} from 'react';
import {HelperText} from 'react-native-paper';
import {useState} from 'react';
import {AuthContext} from '../context/authcontext';
import {Dimensions} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'; 
import {useRef} from 'react'; 
import {useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native'; 
import {ThemeContext} from '../context/themeContext';
import DatePicker from 'react-native-date-picker'; 
import Header from '../components/Header';
import LocationPermission from '../hooks/uselocation';
import useImagePicker from '../hooks/useImagePicker';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function ProfileSettings({navigation, route}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [date, setDate] = useState(new Date());

  const [categories, setcategories] = useState('');
  const [name, setname] = useState('');
  const [phone, setphone] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [location, setLocation] = useState(null);
  const [open, setOpen] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const phoneInput = useRef(null);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);

  const {media, selectMedia, requestCameraPermission, setMedia} =
    useImagePicker();

  const formatDate = date => {
    return `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handlegenderChange = value => {
    setgender(value); // Update selected categories
  };

  const handleCategoryChange = value => {
    setSelectedCategories(value); // Update selected categories
  };

  const {getCategories, fullCategorydata, createPost} = useContext(AuthContext);

  useEffect(() => {
    getCategories();
  }, [isFocused]);

  const [errors, setErrors] = useState({
    phone: '',
    location: '',
    media: '',
    categories: '',
    name: '',
  });

  const validateInputs = () => {
    let valid = true;
    let newErrors = {
      phone: '',
      location: '',
      media: '',
      categories: '',
      name: '',
    };

    if (!name.trim()) {
      newErrors.name = 'name is required.';
      valid = false;
    } else if (name.length < 4) {
      newErrors.name = 'name must be at least 4 characters long.';
      valid = false;
    }

    if (media.length === 0) {
      newErrors.media = 'Please select at least one image.';
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
      newErrors.categories = 'Please select at least one category.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handlePress = async () => {
    setErrors({
      phone: '',
      location: '',
      media: '',
      categories: '',
      name: '',
    });
    // if (!validateInputs()) return;

    setIsLoading(true);
    try {
      console.log('Success', 'updated successfully!');
      navigation.navigate('BottomTabs');
    } catch (error) {
      //   Alert.alert('Error', 'Something went wrong. Please try again.');
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
      <LocationPermission setLocation={setLocation} />

      <Header header={'Profile'} />

      <View
        style={[
          styles.rectangle2,
          {
            overflow: 'hidden',
            marginBottom: 10,
          },
        ]}>
        {media && media.length > 0 ? (
          <>
            <Image
              source={{uri: media[0].uri}}
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
              onPress={() => setMedia([])} // Properly reset media array
            >
              <Entypo name="cross" size={25} color="black" />
            </TouchableOpacity>
          </>
        ) : (
          <Image
            source={require('../assets/User-image.png')}
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
              right: 35,
              bottom: 20,
              alignSelf: 'flex-end',
            }}
            resizeMode="contain"
          />
        </Pressable>
        <View style={{alignSelf: 'center'}}>
          <Text
            style={[
              styles.recListText,
              {
                fontSize: 15,
                width: 200,
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
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
                color: isDark ? 'white' : 'rgba(23, 23, 23, 0.59)',
                alignSelf: 'center',
                textAlign: 'center',
              },
            ]}>
            @Itunuoluwa
          </Text>
        </View>
      </View>

      <HelperText type="error" visible={!!errors.media} style={{color: 'red'}}>
        {errors.media}
      </HelperText>
      <View
        style={{
          borderWidth: 1,
          marginBottom: 60,
          borderColor: 'rgb(108, 108, 108)',
          borderRadius: 10,
          width: Width * 0.9,
          // padding: 20,
          paddingTop: 20,
        }}>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={[
              {
                color: isDark ? '#fff' : '#000',
                fontWeight: '400',
                fontSize: 16,
                marginBottom: 5,
                alignSelf: 'flex-start',
                width: '78%',
              },
            ]}>
            Profile
          </Text>

          <Pressable onPress={selectMedia}>
            <Image
              source={
                isDark
                  ? require('../assets/edit1-dark.png')
                  : require('../assets/edit1.png')
              }
              style={{
                width: 40,
                height: isDark ? 25 : 18,

                alignSelf: 'flex-end',
              }}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        <View
          style={{
            borderWidth: 0.3,
            borderColor: 'grey',
            width: Width * 0.9,
            marginTop: 10,
            marginBottom: 10,
          }}
        />

        <Text
          style={[
            {
              color: 'grey',
              fontWeight: '400',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
              marginLeft: 20,
              width: '50%',
            },
          ]}>
          Name
        </Text>

        <Text
          style={[
            {
              color: isDark ? '#fff' : '#000',
              fontWeight: '400',
              fontSize: 15,
              marginLeft: 20,
              marginBottom: 5,
              alignSelf: 'flex-start',
              width: '50%',
              marginBottom: 20,
            },
          ]}>
          Albert Flores
        </Text>

        <Text
          style={[
            {
              color: 'grey',
              fontWeight: '400',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
              marginLeft: 20,
              width: '50%',
            },
          ]}>
          Contact
        </Text>

        <Text
          style={[
            {
              color: isDark ? '#fff' : '#000',
              fontWeight: '400',
              fontSize: 15,
              marginLeft: 20,
              marginBottom: 5,
              alignSelf: 'flex-start',
              width: '50%',
              marginBottom: 20,
            },
          ]}>
          Albert Flores
        </Text>

        <Text
          style={[
            {
              color: 'grey',
              fontWeight: '400',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
              marginLeft: 20,
              width: '50%',
            },
          ]}>
          DOB
        </Text>

        <Text
          style={[
            {
              color: isDark ? '#fff' : '#000',
              fontWeight: '400',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
              marginLeft: 20,
              width: '50%',
              marginBottom: 20,
            },
          ]}>
          Albert Flores
        </Text>

        <Text
          style={[
            {
              color: 'grey',
              fontWeight: '400',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
              marginLeft: 20,
              width: '50%',
            },
          ]}>
          Email Id
        </Text>

        <Text
          style={[
            {
              color: isDark ? '#fff' : '#000',
              fontWeight: '400',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
              marginLeft: 20,
              width: '50%',
              marginBottom: 20,
            },
          ]}>
          Albert Flores
        </Text>

        <Text
          style={[
            {
              color: 'grey',
              fontWeight: '400',
              fontSize: 15,
              marginLeft: 20,
              marginBottom: 5,
              alignSelf: 'flex-start',
              width: '50%',
            },
          ]}>
          Categories
        </Text>

        <Text
          style={[
            {
              color: isDark ? '#fff' : '#000',
              fontWeight: '400',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
              marginLeft: 20,
              width: '50%',
              marginBottom: 20,
            },
          ]}>
          Albert Flores
        </Text>
      </View>

      <TouchableOpacity
        style={styles.blueBotton}
        onPress={() => navigation.navigate('BottomTabs')}
        // onPress={() => handlePress()}
      >
        <Text
          style={[
            styles.smallText,
            {color: '#fff', fontSize: 22, marginBottom: 0},
          ]}>
          Update
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
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 50,
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
    borderRadius: 20,
    borderColor: 'rgba(6, 196, 217, 1)',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
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
    borderRadius: 8,
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
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
    height: 50,
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 60,
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
