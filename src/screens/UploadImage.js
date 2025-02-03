import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useContext} from 'react';
import {HelperText} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useState} from 'react';
import {AuthContext} from '../context/authcontext';
import {Dimensions} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function UploadImage({navigation, route}) {
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState([]);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const {handleRegister, handleLogin, createPost} = useContext(AuthContext);

  const validateInputs = () => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    // if (media.size > MAX_SIZE) {
    //   setErrors(prevState => ({
    //     ...prevState,
    //     media: 'File size should not exceed 5MB.',
    //   }));
    //   return false;
    // }

    // if (!allowedTypes.includes(media.type)) {
    //   setErrors(prevState => ({
    //     ...prevState,
    //     media: 'Only jpg, jpeg, and png images are allowed.',
    //   }));
    //   return false;
    // }

    if (media.length === 0) {
      setErrors(prevState => ({
        ...prevState,
        media: 'Please select at least one image.',
      }));
      return;
    }
    return true;
  };

  const handlePress = async () => {
    setErrors({media: ''});
    if (!validateInputs()) return;

    try {
      await createPost(
        route.params.selectedCategories,
        route.params.description,
        route.params.phone,
        route.params.email,
        route.params.location,
        media,
      );
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
    <ScrollView contentContainerStyle={styles.screen}>
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
          color="rgba(94, 95, 96, 1)"
          style={{marginLeft: 20, padding: 5}}
        />
        <Text
          style={[
            {
              fontSize: 20,
              fontWeight: 'bold',
              alignSelf: 'center',
              marginLeft: '21%',
            },
          ]}>
          Upload photos
        </Text>
      </View>

      <Text
        style={[
          {
            color: 'rgba(33, 33, 33, 1)',
            fontSize: 22,
            fontWeight: '500',
            alignSelf: 'center',
            marginBottom: 20,
          },
        ]}>
        Choose and Upload Your Picture
      </Text>
      {/* Selector with First Image */}
      <View>
        <View style={{}}>
          {media.length > 0 && media[0].uri ? (
            <>
              <Image
                source={{uri: media[0].uri}}
                style={[styles.mediaSelector, {borderWidth: 0}]}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  // Remove the first image from the media array
                  setMedia(media.slice(1)); // This removes the first item from the array
                }}>
                <Entypo name="cross" size={25} color="black" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={selectMedia}>
              <View style={styles.mediaSelector}>
                <MaterialIcons name="image" size={45} color="grey" />
                <Text
                  style={{color: 'rgba(158, 158, 158, 1)', fontWeight: 'bold'}}>
                  Select Media
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <HelperText type="error" visible={!!errors.media}>
        {errors.media}
      </HelperText>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            width: '40%',
            height: 2,
            backgroundColor: 'rgba(238, 238, 238, 1)',
          }}
        />
        <Text
          style={[
            {
              textAlign: 'left',
              fontSize: 20,
              color: 'rgba(97, 97, 97, 1)',
              margin: 10,
            },
          ]}>
          or
        </Text>
        <View
          style={{
            width: '40%',
            height: 2,
            backgroundColor: 'rgba(238, 238, 238, 1)',
          }}
        />
      </View>
      <TouchableOpacity
        style={styles.whiteBotton}
        onPress={() => navigation.navigate('BottomTabs')}>
        <Entypo name="camera" size={25} color="rgba(6, 196, 217, 1)" />
        <Text
          style={[
            {
              color: 'rgba(6, 196, 217, 1)',
              fontSize: 18,
              textAlign: 'center',
              marginBottom: 0,
              fontWeight: '600',
              alignSelf: 'center',
              marginLeft: 10,
            },
          ]}>
          Open Camera & Take Photo
        </Text>
      </TouchableOpacity>

      {media.length > 0 && (
        <>
          <Text
            style={[
              {
                color: 'rgb(0, 0, 0)',
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

          <View style={[styles.imageContainer, {flexWrap: 'wrap'}]}>
            {media.slice(1, 8).map((item, index) => (
              <View key={index} style={styles.mediaItem}>
                {item.type.startsWith('image') ? (
                  <>
                    <Image
                      source={{uri: item.uri}}
                      style={styles.mediaPreview}
                    />
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => {
                        // Remove the image from media array
                        setMedia(media.filter((mediaItem, i) => i !== index));
                      }}>
                      <Entypo name="cross" size={18} color="black" />
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
        style={[styles.blueBotton, {margin: media.length > 0 ? '25%' : '60%'}]}
        // onPress={() => navigation.navigate('BottomTabs')}
        onPress={() => handlePress()}>
        <Text
          style={[
            styles.smallText,
            {
              color: '#fff',
              fontSize: 22,

              marginBottom: 0,
            },
          ]}>
          Post
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
    width: Width * 0.85,
    height: 200,
    borderWidth: 3,
    backgroundColor: 'rgba(250, 250, 250, 1)',
    borderRadius: 30,
    borderColor: 'rgba(6, 196, 217, 1)',
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
