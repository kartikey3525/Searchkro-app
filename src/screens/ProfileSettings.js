import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity, 
  ScrollView,
  Modal, 
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import {ThemeContext} from '../context/themeContext'; 

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import Header from '../components/Header';
import LocationPermission from '../hooks/uselocation';
import useImagePicker from '../hooks/useImagePicker';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function ProfileSettings({navigation, route}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark'; 
  const [description, setdescription] = useState('');
  const [opensAt, setopensAt] = useState('');
  const [closeAt, setcloseAt] = useState('');
  const [categories, setcategories] = useState('');
  const [shopName, setshopName] = useState('');
  const [phone, setphone] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [location, setLocation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const phoneInput = useRef(null);
  const isFocused = useIsFocused(); 
  const [modalVisible, setModalVisible] = useState(false);

  const {media,selectMedia, requestCameraPermission,setMedia} = useImagePicker();

 
  const handleCategoryChange = value => {
    setSelectedCategories(value); // Update selected categories
  };

  const {getCategories, fullCategorydata, createPost} = useContext(AuthContext);

  useEffect(() => {
    getCategories();   
  }, [isFocused]);

  const [errors, setErrors] = useState({
    description: '',
    opensAt: '',
    closeAt: '',
    phone: '',
    location: '',
    media: '',
    categories: '',
    ownerName: '',
    shopName: '',
  });

  const validateInputs = () => { 

    let valid = true;
    let newErrors = {
      description: '',
      opensAt: '',
      closeAt: '',
      phone: '',
      location: '',
      media: '',
      categories: '',
      ownerName: '',
      shopName: '',
    };
 
    if (!shopName.trim()) {
      newErrors.shopName = 'shopName is required.';
      valid = false;
    } else if (shopName.length < 4) {
      newErrors.shopName = 'shopName must be at least 4 characters long.';
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

    if (!opensAt.trim()) {
      newErrors.opensAt = 'opensAt is required.';
      valid = false;
    }
    if (!closeAt.trim()) {
      newErrors.closeAt = 'closeAt is required.';
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
      description: '',
      opensAt: '',
      closeAt: '',
      phone: '',
      location: '',
      media: '',
      categories: '',
      ownerName: '',
      shopName: '',
    });
    if (!validateInputs()) return;

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

      <Text
        style={[
          styles.title,
          {color: isDark ? '#E0E0E0' : 'rgba(33, 33, 33, 1)'},
        ]}>
        Upload Your Picture
      </Text>
      <View>
        <View>
          {media?.length > 0 && media[0].uri ? (
            <>
              <Image
                source={{uri: media[0].uri}}
                style={[styles.mediaSelector, {borderWidth: 0}]}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setMedia(media.slice(1))}>
                <Entypo name="cross" size={25} color={'black'} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={selectMedia}>
              <View
                style={[
                  styles.mediaSelector,
                  {
                    backgroundColor: isDark
                      ? '#1E1E1E'
                      : 'rgba(250, 250, 250, 1)',
                  },
                ]}>
                <MaterialIcons name="image" size={45} color="grey" />
                <Text
                  style={{
                    color: isDark ? '#BBB' : 'rgba(158, 158, 158, 1)',
                    fontWeight: 'bold',
                  }}>
                  Upload
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <HelperText type="error" visible={!!errors.media} style={{color: 'red'}}>
        {errors.media}
      </HelperText>
      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: 25,
          flexDirection: 'row',
        }}>
        <Text
          style={[
            {
              color: isDark ? '#fff' : '#000',
              fontWeight: '600',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
              width: '50%',
            },
          ]}>
          Shop Name
        </Text>
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isDark
              ? 'rgba(109, 109, 109, 0.43)'
              : 'rgba(0, 0, 0, 1)',
          },
        ]}>
        <TextInput
          value={shopName}
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? '#000' : 'rgb(255, 255, 255)',
              color: isDark ? '#fff' : '#000',
            },
          ]}
          onChangeText={setshopName => setshopName(shopName)}
          placeholder="Shop Name"
          mode="outlined"
          placeholderTextColor={isDark ? '#ccc' : 'black'}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.shopName}>
        {errors.shopName}
      </HelperText>

      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: 25,
          flexDirection: 'row',
        }}>
        <Text
          style={[
            {
              color: isDark ? '#fff' : '#000',
              fontWeight: '600',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
              width: '50%',
            },
          ]}>
          About shop
        </Text>
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            height: 100,
            alignItems: 'flex-start',
            borderColor: isDark
              ? 'rgba(109, 109, 109, 0.43)'
              : 'rgba(0, 0, 0, 1)',
          },
        ]}>
        <TextInput
          value={description}
          style={[
            styles.textInput,
            {
              height: 93,
              color: isDark ? '#fff' : '#000',
              backgroundColor: isDark ? '#000' : 'rgb(255, 255, 255)',
            },
          ]}
          onChangeText={setdescription}
          numberOfLines={5}
          multiline={true}
          placeholder="Add a short description about your business, products, or services . . ."
          mode="outlined"
          placeholderTextColor={'grey'}
          autoCapitalize="none"
        />
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.description}>
        {errors.description}
      </HelperText>

      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: 25,
          flexDirection: 'row',
        }}>
        <Text
          style={[
            {
              color: '#000',
              fontWeight: '600',
              fontSize: 15,
              marginBottom: 5,
              color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
              alignSelf: 'flex-start',
              width: Width * 0.5,
            },
          ]}>
          Contact number
        </Text>
      </View>

      <PhoneInput
        ref={phoneInput}
        value={phone}
        containerStyle={{
          width: Width * 0.9,
          height: 60,
          borderWidth: 1,
          borderColor: errors.phone ? 'red' : 'rgba(0, 0, 0, 0.43)',
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
        layout="second"
        onChangeText={text => setphone(text)}
      />
      <HelperText type="error" visible={!!errors.phone} style={{height: 10}}>
        {errors.phone}
      </HelperText>

      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: 25,
          flexDirection: 'row',
        }}>
        <Text
          style={[
            {
              color: '#000',
              fontWeight: '600',
              fontSize: 15,
              color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
              marginBottom: 5,
              alignSelf: 'flex-start',
              width: Width * 0.48,
            },
          ]}>
          Open hours
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          width: Width,
          justifyContent: 'space-evenly',
        }}>
        <View
          style={[
            styles.inputContainer,
            {
              width: '42%',
              borderColor: isDark
                ? 'rgba(109, 109, 109, 0.43)'
                : 'rgba(0, 0, 0, 1)',
            },
          ]}>
          <TextInput
            value={opensAt}
            style={[
              styles.textInput,
              {
                backgroundColor: isDark ? '#000' : 'rgb(255, 255, 255)',
                color: isDark ? '#fff' : '#000',
              },
            ]}
            onChangeText={setopensAt}
            placeholder="opens at"
            mode="outlined"
            placeholderTextColor={'grey'}
            keyboardType="number-pad"
            autoCapitalize="none"
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            {
              width: '42%',
              borderColor: isDark
                ? 'rgba(109, 109, 109, 0.43)'
                : 'rgba(0, 0, 0, 1)',
            },
          ]}>
          <TextInput
            value={closeAt}
            style={[
              styles.textInput,
              {
                backgroundColor: isDark ? '#000' : 'rgb(255, 255, 255)',
                color: isDark ? '#fff' : '#000',
              },
            ]}
            onChangeText={setcloseAt}
            placeholder="close at"
            mode="outlined"
            placeholderTextColor={'grey'}
            keyboardType="number-pad"
            autoCapitalize="none"
          />
        </View>
      </View>
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.opensAt}>
        {errors.opensAt}
      </HelperText>

      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: 25,
          flexDirection: 'row',
        }}>
        <Text
          style={[
            {
              color: isDark ? '#fff' : '#000',
              fontWeight: '600',
              fontSize: 15,
              marginBottom: 5,
              alignSelf: 'flex-start',
              width: '50%',
            },
          ]}>
          Category
        </Text>
      </View>

      <Dropdown
        item={
          fullCategorydata?.map(category => ({
            label: category.name || 'Unnamed',
            value: category.name || '',
          })) || []
        }
        placeholder={'Select Categories'}
        selectedValues={selectedCategories} // Pass the selected categories to the dropdown
        onChangeValue={handleCategoryChange} // Handle category selection changes
      />
 
      <HelperText
        type="error"
        style={{alignSelf: 'flex-start', marginLeft: 14}}
        visible={!!errors.categories}>
        {errors.categories}
      </HelperText>
      {/* Uploaded Images */}
      {media.length > 0 && (
        <>
          <Text
            style={[
              {
                color: isDark ? '#fff' : 'rgb(0, 0, 0)',
                fontSize: 18,
                textAlign: 'left',
                marginBottom: 10,
                fontWeight: '600',
                alignSelf: 'flex-start',
                marginLeft: '7%',
                marginTop: '5%',
              },
            ]}>
            Gallery
          </Text>

          <View style={[styles.imageContainer, {flexWrap: 'wrap'}]}>
            {media.slice(1, 8).map((item, index) => (
              <View key={index} style={styles.mediaItem}>
                {/* {item.type.startsWith('image') ? ( */}
                <>
                  <Image source={{uri: item.uri}} style={styles.mediaPreview} />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                      setMedia(media.filter((_, i) => i !== index));
                    }}>
                    <Entypo name="cross" size={18} color={'black'} />
                  </TouchableOpacity>
                </>
                {/* ) : null} */}
              </View>
            ))}

            {media?.length < 8 && (
              <TouchableOpacity
                onPress={selectMedia}
                style={[
                  styles.mediaItem,
                  {
                    backgroundColor: isDark ? '#1E1E1E' : 'rgb(255, 255, 255)',
                    borderColor: isDark ? '#555' : 'rgba(176, 176, 176, 1)',
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

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{
                height: 5,
                backgroundColor: 'lightgrey',
                width: 60,
                position: 'absolute',
                alignSelf: 'center',
                borderRadius: 10,
                top: 16,
              }}
            />
            <TouchableOpacity
              style={styles.closeButton2}
              onPress={() => {
                setModalVisible(false);
              }}>
              <Entypo name="cross" size={22} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                height: 60,
                marginTop: 30,
                width: Width,
                alignItems: 'center',
                borderBottomWidth: 1,
                padding: 10,
                borderBottomColor: 'rgba(0, 0, 0, 0.2)',
              }}
              onPress={() => requestCameraPermission()}>
              <Entypo
                name={'camera'}
                size={25}
                color="rgb(0, 0, 0)"
                style={{marginRight: 15, marginLeft: 20}}
              />

              <Text
                style={[
                  {
                    fontSize: 18,
                    fontWeight: '600',
                    marginLeft: 6,
                  },
                ]}>
                Take Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => selectMedia()}
              style={{
                flexDirection: 'row',
                width: Width,
                alignItems: 'center',
                borderBottomWidth: 1,
                height: 60,
                padding: 10,
                borderBottomColor: 'rgba(0, 0, 0, 0.2)',
              }}>
              <MaterialCommunityIcons
                name={'image'}
                size={30}
                color="rgb(0, 0, 0)"
                style={{marginRight: 10, marginLeft: 18}}
              />

              <Text
                style={[
                  {
                    fontSize: 18,
                    fontWeight: '600',
                    marginLeft: 6,
                  },
                ]}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (media?.length > 0) {
                  // Remove the first image from the media array
                  setMedia(media.slice(1));
                }
                setModalVisible(false); // Close the modal
              }}
              style={{
                flexDirection: 'row',
                width: Width,
                alignItems: 'center',
                padding: 10,
                height: 60,
              }}>
              <FontAwesome
                name={'trash'}
                size={25}
                color="rgb(255, 0, 0)"
                style={{marginRight: 15, marginLeft: 22}}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  marginLeft: 6,
                  color: 'rgb(255, 0, 0)',
                }}>
                Remove Current Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    top: -4,
    right: -4,
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
  closeButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 15,
    padding: 1,
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
