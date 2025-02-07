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
import Entypo from 'react-native-vector-icons/Entypo';
import {Rating} from 'react-native-ratings';

import {useState} from 'react';
import {AuthContext} from '../context/authcontext';
import {launchImageLibrary} from 'react-native-image-picker';

import {Dimensions} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {ThemeContext} from '../context/themeContext';

export default function RatedScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState([]);
  const [description, setdescription] = useState('');
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

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
          color={isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(94, 95, 96, 1)'}
          style={{marginLeft: 20, padding: 5}}
        />
        <Text
          style={[
            {
              fontSize: 20,
              fontWeight: 'bold',
              alignSelf: 'center',
              marginLeft: '21%',
              color: isDark ? 'rgba(255, 255, 255, 1)' : '#000',
            },
          ]}>
          Rated review
        </Text>
      </View>

      <View
        style={[
          styles.rectangle2,
          {
            overflow: 'hidden',
            flexDirection: 'row',
            height: 100,
            backgroundColor: isDark ? '#121212' : 'rgb(255, 255, 255)',
          },
        ]}>
        <Image
          source={require('../assets/shop-pic.png')}
          style={{
            width: '30%',
            height: '80%',
            alignSelf: 'flex-start',
            overflow: 'hidden',
            borderRadius: 10,
            margin: 8,
          }}
        />

        <View style={{alignSelf: 'flex-start'}}>
          <Text
            numberOfLines={3}
            style={[
              styles.recListText,
              {
                fontWeight: '400',
                fontSize: 20,
                margin: 5,
                color: isDark ? 'rgba(255, 255, 255, 1)' : '#000',
                marginTop: 10,
                marginLeft: 0,
                width: Width * 0.57,
              },
            ]}>
            title
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.recListText,
          {
            fontWeight: 'bold',
            fontSize: 18,
            alignSelf: 'flex-start',
            color: isDark ? 'rgba(255, 255, 255, 1)' : '#000',
            marginLeft: 30,
            marginTop: 10,
            marginBottom: 10,
          },
        ]}>
        You have Rated
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          marginLeft: 25,
        }}>
        <Rating
          type="star"
          ratingColor="#FFD700"
          isDisabled={true}
          readonly
          ratingBackgroundColor="#ccc"
          startingValue={3}
          imageSize={30}
        />
      </View>
      <Text
        style={[
          styles.recListText,
          {
            fontWeight: 'bold',
            fontSize: 18,
            alignSelf: 'flex-start',
            marginLeft: 30,
            color: isDark ? 'rgba(255, 255, 255, 1)' : '#000',
            marginTop: 10,
            marginBottom: 10,
          },
        ]}>
        Post your review
      </Text>

      <View
        style={[
          styles.inputContainer,
          {
            height: 130,
            alignItems: 'flex-start',
            backgroundColor: isDark ? '#121212' : 'rgb(255, 255, 255)',
          },
        ]}>
        <TextInput
          value={description}
          style={[
            styles.textInput,
            {
              height: 93,
              backgroundColor: isDark ? '#121212' : '#fff',
              color: isDark ? '#fff' : '#000',
            },
          ]}
          onChangeText={setdescription}
          numberOfLines={5}
          multiline={true}
          placeholder="Have any feedback you’d like to give about this product"
          mode="outlined"
          placeholderTextColor={'rgba(158, 158, 158, 1)'}
          autoCapitalize="none"
        />
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.description}>
        {errors.description}
      </HelperText>
      <Text
        style={[
          styles.recListText,
          {
            fontWeight: 'bold',
            fontSize: 18,
            alignSelf: 'flex-start',
            marginLeft: 30,
            color: isDark ? 'rgba(255, 255, 255, 1)' : '#000',
            marginBottom: 10,
          },
        ]}>
        Add photo & Video
      </Text>
      <View>
        <View style={{}}>
          {media.length > 0 && media[0].uri ? (
            <>
              <Image
                source={{uri: media[0].uri}}
                style={[
                  styles.mediaSelector,
                  {borderWidth: 0, backgroundColor: 'rgba(248, 247, 247, 1)'},
                ]}
              />
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: isDark
                      ? 'rgb(0, 0, 0)'
                      : 'rgb(255, 255, 255)',
                  },
                ]}
                onPress={() => {
                  setMedia(media.slice(1));
                }}>
                <Entypo
                  name="cross"
                  size={25}
                  color={isDark ? 'white' : 'black'}
                />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={selectMedia}>
              <View
                style={[
                  styles.mediaSelector,
                  {
                    backgroundColor: isDark
                      ? '#121212'
                      : 'rgba(248, 247, 247, 1)',
                  },
                ]}>
                <Entypo name="upload-to-cloud" size={45} color="grey" />
                <Text
                  style={{color: 'rgba(158, 158, 158, 1)', fontWeight: 'bold'}}>
                  Upload Media
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <HelperText type="error" visible={!!errors.media}>
        {errors.media}
      </HelperText>
      {media.length > 0 && (
        <>
          <Text
            style={[
              {
                color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
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

          <View
            style={[
              styles.imageContainer,
              {
                flexWrap: 'wrap',
                backgroundColor: isDark ? '#000' : 'rgb(255, 255, 255)',
              },
            ]}>
            {media.slice(1, 8).map((item, index) => (
              <View key={index} style={styles.mediaItem}>
                {item.type.startsWith('image') ? (
                  <>
                    <Image
                      source={{uri: item.uri}}
                      style={styles.mediaPreview}
                    />
                    <TouchableOpacity
                      style={[
                        styles.closeButton,
                        {
                          backgroundColor: isDark
                            ? '#000'
                            : 'rgba(248, 247, 247, 1)',
                        },
                      ]}
                      onPress={() => {
                        // Remove the image from media array
                        setMedia(media.filter((mediaItem, i) => i !== index));
                      }}>
                      <Entypo
                        name="cross"
                        size={18}
                        color={isDark ? 'white' : 'black'}
                      />
                    </TouchableOpacity>
                  </>
                ) : item.type.startsWith('video') ? null : (
                  <Text>{item.fileName}</Text>
                )}
              </View>
            ))}

            {/* Add Selector Button */}
            {media.length < 8 && (
              <TouchableOpacity
                onPress={selectMedia}
                style={[
                  styles.mediaItem,
                  {
                    backgroundColor: 'rgb(255, 255, 255)',
                    borderWidth: 1,
                    borderRadius: 10,
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
      <TouchableOpacity
        style={[styles.blueBotton, {margin: '15%'}]}
        onPress={() => navigation.navigate('shopdetails')}>
        <Text
          style={[
            styles.smallText,
            {
              color: '#fff',
              fontSize: 22,
              marginBottom: 0,
            },
          ]}>
          Submit review
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
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
