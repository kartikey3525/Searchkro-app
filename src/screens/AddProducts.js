import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import React, {useContext} from 'react';
import {HelperText} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useState} from 'react';
import {AuthContext} from '../context/authcontext';
import {Dimensions} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {ThemeContext} from '../context/themeContext';
import Header from '../components/Header';
import useImagePicker from '../hooks/useImagePicker';
import {TextInput} from 'react-native';
import Dropdown from '../components/Dropdown';
import {useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';

export default function AddProducts({navigation, route}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [name, setname] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    media: '',
  });
  const {getCategories, fullCategorydata, handleLogin, createSellerProfile} =
    useContext(AuthContext);
  const {media, selectMedia, requestCameraPermission, setMedia} =
    useImagePicker();

  useEffect(() => {
    getCategories();
  }, [useIsFocused]);

  const handleCategoryChange = value => {
    // console.log('handleCategoryChange', value);
    setSelectedCategories(value); // Update selected categories
  };
  const validateInputs = () => {
    if (media.length === 0) {
      setErrors(prevState => ({
        ...prevState,
        media: 'Please select at least one image.',
      }));
      return false;
    }
    return true;
  };

  const handlePress = async () => {
    // if (!name || media.length === 0 || selectedCategories.length === 0) {
    //   Alert.alert('Error', 'Please add a name, image, and category.');
    //   return;
    // }
    try {
      await createSellerProfile(
        route.params.email,
        route.params.description,
        route.params.phone,
        route.params.location,
        route.params.media, // Use the current media state
        route.params.selectedCategories, // Use the current selected categories
        route.params.bussinessAddress,
        route.params.Socialmedia,
        route.params.ownerName,
        route.params.shopName,
        route.params.selectedScale,
        route.params.openAt,
        route.params.closeAt,
        route.params.selectedAvailabity,
        products, // Pass the products array
      );
      // Navigate back after successful submission
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    if (!name || media.length === 0 || selectedCategories.length === 0) {
      Alert.alert('Error', 'Please add a name, image, and category.');
      return;
    }

    const newProduct = {
      name,
      images: media.map(item => item),
      categories: selectedCategories,
    };

    setProducts(prevProducts => [...prevProducts, newProduct]);

    // Reset fields
    setname('');
    setMedia([]); // Make sure selectedCategories updates
    setSelectedCategories([]);
    // Log to confirm reset
    // console.log('Resetting categories:', selectedCategories);
  };

  // Function to remove a product
  const handleRemoveProduct = (category, index) => {
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      updatedProducts.splice(index, 1); // Remove the product at the specified index
      return updatedProducts;
    });
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    product.categories.forEach(category => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
    });
    return acc;
  }, {});

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.screen,
        {backgroundColor: isDark ? '#000' : '#FFFFFF'},
      ]}>
      <Header header={'Add product'} />

      <Text
        style={[
          styles.title,
          {color: isDark ? '#E0E0E0' : 'rgba(33, 33, 33, 1)'},
        ]}>
        Upload Your Picture
      </Text>

      {/* Image Selector */}
      <View>
        <View>
          {media.length > 0 && media[0] ? (
            <>
              <Image
                source={{uri: media[0]}}
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
                  Select Media
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <HelperText type="error" visible={!!errors.media} style={{color: 'red'}}>
        {errors.media}
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
            Post images
          </Text>

          <View style={[styles.imageContainer, {flexWrap: 'wrap'}]}>
            {media.slice(1, 8).map((item, index) => (
              <View key={index} style={styles.mediaItem}>
                <Image source={{uri: item}} style={styles.mediaPreview} />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setMedia(media.filter((_, i) => i !== index + 1)); // Fix index offset
                  }}>
                  <Entypo name="cross" size={18} color={'black'} />
                </TouchableOpacity>
              </View>
            ))}

            {media.length < 8 && (
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
          Name
        </Text>
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isDark
              ? 'rgba(109, 109, 109, 0.43)'
              : 'rgba(109, 109, 109, 0.43)',
          },
        ]}>
        <TextInput
          value={name}
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? '#000' : 'rgb(255, 255, 255)',
              color: isDark ? '#fff' : '#000',
            },
          ]}
          onChangeText={setname}
          placeholder="product name"
          mode="outlined"
          placeholderTextColor={isDark ? '#ccc' : 'black'}
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
        selectedValues={selectedCategories}
        onChangeValue={handleCategoryChange}
        isMultiSelect // Ensure multi-select is enabled
      />

      <HelperText
        type="error"
        visible={!!errors.selectedCategories}
        style={{alignSelf: 'flex-start', marginLeft: 10}}>
        {errors.selectedCategories}
      </HelperText>

      <TouchableOpacity
        style={[
          styles.blueButton,
          {margin: '5%', width: Width * 0.4, alignSelf: 'flex-end'},
        ]}
        onPress={() => handleAddProduct()}>
        <Text style={[styles.buttonText, {color: '#fff'}]}>Add</Text>
      </TouchableOpacity>

      {/* Display Products Grouped by Categories */}
      <View style={{maxHeight: 260}}>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          {Object.keys(groupedProducts).map(category => (
            <View
              key={category}
              style={{
                marginBottom: 10,
                alignSelf: 'flex-start', // Align to left
                width: '100%', // Ensure it takes full width
                paddingLeft: 10, // Add some padding for better alignment
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: isDark ? '#fff' : 'rgb(0, 0, 0)',
                  marginBottom: 5,
                }}>
                {category}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {groupedProducts[category].map((product, index) => (
                    <View
                      key={index}
                      style={{
                        padding: 6,
                        borderRadius: 5,
                        marginRight: 5, // Space between items
                      }}>
                      {/* Images */}
                      <View
                        style={{flexDirection: 'row', position: 'relative'}}>
                        {product.images.map((uri, imgIndex) => (
                          <View
                            key={imgIndex}
                            style={{
                              position: 'absolute',
                              left: imgIndex * 7,
                              zIndex: imgIndex,
                            }}>
                            <Image
                              source={{uri}}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: 5,
                                borderWidth: 2,
                                borderColor: isDark ? 'white' : 'black',
                              }}
                            />
                            {/* Remove Button */}
                            <TouchableOpacity
                              style={{
                                position: 'absolute',
                                top: -5,
                                right: -5,
                                backgroundColor: isDark ? 'black' : 'white',
                                borderRadius: 10,
                                padding: 2,
                              }}
                              onPress={() =>
                                handleRemoveProduct(category, index)
                              }>
                              <Entypo
                                name="cross"
                                size={18}
                                color={isDark ? 'white' : 'black'}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>

                      {/* Product Name */}
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          width: 80,
                          color: isDark ? '#fff' : 'rgb(0, 0, 0)',
                          marginTop: 60,
                        }}>
                        {product.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Post Button */}
      <TouchableOpacity
        style={[styles.blueButton, {margin: '20%'}]}
        onPress={handlePress}
        disabled={isLoading}>
        <Text style={[styles.buttonText, {color: '#fff'}]}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  screen: {
    alignItems: 'center',
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
  header: {
    alignItems: 'center',
    width: Width,
    flexDirection: 'row',
    height: Height * 0.1,
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: '21%',
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    alignSelf: 'center',
    marginBottom: 20,
  },

  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  blueButton: {
    backgroundColor: '#00AEEF',
    width: '90%',
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 22,
  },
});
