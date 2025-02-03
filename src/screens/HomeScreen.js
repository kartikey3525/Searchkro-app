import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  Modal,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {Rating} from 'react-native-ratings';
import {useIsFocused} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

import {Dimensions} from 'react-native';
import {AuthContext} from '../context/authcontext';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function HomeScreen({navigation}) {
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [numColumns, setNumColumns] = useState(4);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const {
    getNearbyPosts,
    recentPosts,
    getCategories,
    getRecentPosts,
    categorydata,
    nearbyPosts,
    userRole,
    getSellerCategories,
    getPosts,
    posts,
  } = useContext(AuthContext);

  useEffect(() => {
    userRole === 'buyer' ? getCategories() : getSellerCategories();
    userRole === 'buyer' ? (getRecentPosts(), getNearbyPosts()) : getPosts();
    // console.log('userRole data ', userRole);
  }, [isFocused]);
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This app needs to access your location.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        getLocation();
      } else {
        Alert.alert('Permission Denied', 'Location access is required.');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const getLocation = async () => {
    // Check permissions for Android
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app requires location access to function properly.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setErrorMessage('Location permission denied');
        return;
      }
    }

    // Get the location
    try {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation({latitude, longitude});
        },
        error => {
          console.error('Location error:', error);
          Alert.alert('Error', 'Unable to fetch location.');
        },
        {enableHighAccuracy: true, timeout: 35000, maximumAge: 10000},
      );
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const flatListKey = `flat-list-${numColumns}`;

  const [recentPostList, setrecentPostList] = useState([
    {id: 1, title: 'Samsung phone', img: require('../assets/sam-phone.png')},
    {id: 2, title: 'smart watch', img: require('../assets/watch.png')},
    {id: 3, title: 'Medicine', img: require('../assets/packagedfood.png')},
    {id: 4, title: 'packaged food', img: require('../assets/clothes.png')},
    {id: 5, title: 'Groceries', img: require('../assets/groceries.png')},
    {id: 6, title: 'Furniture', img: require('../assets/furniture.png')},
    {id: 8, title: 'Food', img: require('../assets/food.png')},
    {id: 7, title: 'Shoes', img: require('../assets/shoes.png')},
    {id: 9, title: 'Home service', img: require('../assets/home-service.png')},
    {id: 10, title: 'Hospital', img: require('../assets/hospital.png')},
    {id: 11, title: 'Jwellery', img: require('../assets/jwelery.png')},
    {id: 12, title: 'See more', img: require('../assets/see-more.png')},
  ]);

  const rendersquareList = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          marginBottom: 15,
          alignItems: 'center',
        }}
        onPress={() =>
          item.id == 12
            ? navigation.navigate('Categories', {item: item})
            : navigation.navigate('Subcategory', {item: item.subCategories})
        }>
        <View style={[styles.square]}>
          <Image
            source={{uri: item.image}}
            // source={item.image}
            style={{
              width: item.id === 12 ? 30 : 50,
              height: 50,
            }}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.newsDescription}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderRectangleList = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          marginBottom: 15,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('shopdetails', {item: item})}>
        <View style={[styles.rectangle, {overflow: 'hidden'}]}>
          <Image
            source={{uri: item.images[0]}}
            // source={item.img}
            style={{width: '100%', height: '100%'}}
          />
        </View>

        <Text numberOfLines={1} style={styles.recListText}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const render2RectangleList = ({item, index}) => {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          marginBottom: 15,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('shopdetails', {item: item})}>
        <View style={[styles.rectangle2, {overflow: 'hidden'}]}>
          <View
            style={{
              width: '90%',
              height: '60%',
              overflow: 'hidden',
              borderRadius: 10,
              margin: 8,
              marginBottom: 0,
            }}>
            <Image
              source={{uri: item.images[0]}}
              style={{width: '100%', height: '100%'}}
            />
          </View>

          <Text
            numberOfLines={1}
            style={[
              styles.recListText,
              {fontWeight: 'bold', fontSize: 12, marginLeft: 12},
            ]}>
            {item.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              numberOfLines={1}
              style={[
                styles.recListText,
                {fontWeight: 'bold', marginTop: 0, fontSize: 13, width: 25},
              ]}>
              {item?.rating?.averageRating}
            </Text>
            <Rating
              startingValue={item?.rating?.averageRating}
              type="star"
              ratingColor="#FFD700"
              isDisabled={true}
              ratingBackgroundColor="#ccc"
              readonly
              imageSize={15}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginBottom: 5,
              alignItems: 'center',
              marginTop: -2,
            }}>
            <Image
              source={require('../assets/location.png')}
              style={{
                width: 12,
                height: 15,
                marginLeft: 5,
              }}
            />
            <Text
              numberOfLines={2}
              style={[
                styles.recListText,
                {
                  marginTop: 0,
                  color: 'rgba(29, 30, 32, 1)',
                  fontWeight: '500',
                  fontSize: 10,
                  width: 95,
                  left: 5,
                },
              ]}>
              dddddddddddddddddddddddddddddddddddddddddddddd
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderSellerRectangleList = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'flex-start',
          marginBottom: 15,
          alignItems: 'center',
          width: Width * 0.5,
        }}
        onPress={() =>
          navigation.navigate('Sellerproductdetails', {item: item})
        }>
        <View style={[styles.rectangle1, {overflow: 'hidden'}]}>
          <Image
            source={{uri: item.images[0]}}
            // source={item.img}
            style={{width: '100%', height: '100%'}}
          />
        </View>
        <Text numberOfLines={1} style={[styles.recListText, {fontSize: 15}]}>
          {item.title}
        </Text>
        <Text numberOfLines={2} style={styles.recListText}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* {location ? (
        <Text style={styles.text}>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      ) : (
        <Text style={styles.text}>{errorMessage || 'Getting location...'}</Text>
      )}  */}
      <View
        style={{
          marginTop: '2%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: 15,
            marginTop: 20,
          }}>
          <Image
            source={require('../assets/logo.png')}
            style={{
              width: 60,
              height: 60,
            }}
            resizeMode="contain"
          />
          <View style={[styles.inputContainer, {borderWidth: 0}]}>
            <View
              style={[
                styles.searchInput,
                {width: userRole === 'buyer' ? '52%' : '62%', left: 1},
              ]}>
              {location ? (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginTop: 6,
                  }}>
                  Latitude: {location.latitude}, Longitude: {location.longitude}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 2,
                  }}>
                  {errorMessage || 'Your Locaiton'}
                </Text>
              )}

              <Text
                numberOfLines={1}
                style={{
                  fontSize: 13,
                  fontWeight: '500',
                  marginTop: 0,
                  color: 'rgba(0, 0, 0, 0.4)',
                }}>
                {' '}
                6391 Elgin St. Celina, Delaware 10299...
              </Text>
            </View>
          </View>

          {userRole === 'buyer' ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}
              style={{
                backgroundColor: 'rgba(207, 207, 207, 0.12)',
                height: 40,
                width: '10%',
                alignSelf: 'center',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <Image
                source={require('../assets/notification.png')}
                style={{
                  width: 28,
                  height: 26,
                  alignSelf: 'center',
                }}
                resizeMode="contain"
              />
              <View
                style={{
                  position: 'absolute',
                  top: 9,
                  right: 11,
                  backgroundColor: 'red',
                  height: 6,
                  width: 6,
                  borderRadius: 10,
                }}></View>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => navigation.navigate('messages')}
            style={{
              backgroundColor: 'rgba(207, 207, 207, 0.12)',
              height: 40,
              width: '10%',
              alignSelf: 'center',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/chat-icon.png')}
              style={{
                width: 28,
                height: 26,
                alignSelf: 'center',
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15,
          }}>
          <View style={styles.inputContainer}>
            <Image
              source={require('../assets/search-icon.png')}
              style={{
                width: 20,
                height: 20,
                alignSelf: 'center',
                left: 10,
              }}
              resizeMode="contain"
            />
            <TextInput
              // value={'text'}
              style={styles.searchInput}
              // onChangeText={setText}
              placeholderTextColor={'rgba(94, 95, 96, 1)'}
              placeholder="Search here"
              autoCapitalize="none"
              onSubmitEditing={event => handleSearch(event.nativeEvent.text)}
            />
          </View>

          <View
            style={{
              backgroundColor: 'white',
              height: 45,
              width: '12%',
              alignSelf: 'center',
              borderRadius: 10,
              borderColor: 'rgb(0, 0, 0)',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              marginLeft: 10,
            }}>
            <Image
              source={require('../assets/category-icon.png')}
              style={{
                width: 22,
                height: 22,
                alignSelf: 'center',
              }}
              resizeMode="contain"
            />
          </View>
        </View>

        {userRole === 'buyer' ? (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{height: '75%', flexGrow: 1}}>
              <FlatList
                style={{
                  width: Width,
                  left: '4%',
                  alignSelf: 'center',
                }}
                key={flatListKey}
                horizontal={false}
                scrollEnabled={false}
                numColumns={4}
                showsHorizontalScrollIndicator={false} // Hides the horizontal scrollbar
                data={categorydata}
                keyExtractor={item => item.id.toString()}
                renderItem={rendersquareList}
              />
              <Text
                style={[
                  styles.bigText,
                  {
                    alignSelf: 'flex-start',
                    fontSize: 16,
                    left: 25,
                    marginTop: 5,
                    marginBottom: 0,
                  },
                ]}>
                Recent posts
              </Text>
              <View style={{width: Width * 0.97, marginLeft: 14}}>
                <FlatList
                  style={{
                    marginTop: '2%',
                  }}
                  horizontal={true} // Enables horizontal scrolling
                  showsHorizontalScrollIndicator={false} // Hides the horizontal scrollbar
                  data={recentPosts}
                  keyExtractor={item => item._id}
                  renderItem={renderRectangleList}
                />
              </View>

              <Text
                style={[
                  styles.bigText,
                  {
                    alignSelf: 'flex-start',
                    fontSize: 16,
                    left: 25,
                    marginTop: 5,
                    marginBottom: 0,
                  },
                ]}>
                Nearby products
              </Text>
              <View style={{width: Width * 0.97, marginLeft: 14}}>
                <FlatList
                  style={{
                    marginTop: '2%',
                  }}
                  horizontal={true} // Enables horizontal scrolling
                  showsHorizontalScrollIndicator={false} // Hides the horizontal scrollbar
                  data={nearbyPosts}
                  keyExtractor={item => item._id}
                  renderItem={render2RectangleList}
                />
              </View>
            </ScrollView>
          </>
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{height: '75%', flexGrow: 1}}>
              <FlatList
                style={{
                  width: Width,
                  left: '4%',
                  alignSelf: 'center',
                }}
                key={flatListKey}
                horizontal={false}
                scrollEnabled={false}
                numColumns={4}
                showsHorizontalScrollIndicator={false} // Hides the horizontal scrollbar
                data={categorydata}
                keyExtractor={item => item.id.toString()}
                renderItem={rendersquareList}
              />
              <Text
                style={[
                  styles.bigText,
                  {
                    alignSelf: 'flex-start',
                    fontSize: 16,
                    left: 25,
                    marginTop: 5,
                    marginBottom: 0,
                  },
                ]}>
                Recent posts
              </Text>
              <View style={{width: Width * 0.97, marginLeft: 0}}>
                <FlatList
                  style={{
                    marginTop: '2%',
                  }}
                  key={flatListKey}
                  horizontal={false}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  data={posts}
                  keyExtractor={item => item._id}
                  renderItem={renderSellerRectangleList}
                />
              </View>
            </ScrollView>
          </>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Image
              source={
                require('../assets/error-popup.png')
                // source={require('../assets/success-popup.png')
              }
              style={{width: 380, height: 400, borderRadius: 10}}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  square: {
    backgroundColor: 'rgba(248, 247, 247, 1)',
    width: Width * 0.21,
    marginRight: '2%',
    height: 86,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  rectangle1: {
    backgroundColor: 'rgba(248, 247, 247, 1)',
    width: 170,
    height: 170,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
  },
  rectangle: {
    backgroundColor: 'rgba(248, 247, 247, 1)',
    width: 120,
    marginRight: 10,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  rectangle2: {
    backgroundColor: 'rgb(255, 255, 255)',
    width: 125,
    marginRight: 10,
    height: 200,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  newsDescription: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    right: 6,
    marginTop: 4,
  },
  recListText: {
    fontSize: 12,
    fontWeight: '500',
    width: 120,
    color: '#000',
    marginTop: 4,
  },
  smallText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1D1E20',
    textAlign: 'center',
    width: 250,
    fontFamily: 'NunitoSans-VariableFont_YTLC,opsz,wdth,wght',
  },
  bigText: {
    fontSize: 30,
    color: 'black',
    textAlign: 'left',
    marginTop: 30,
    fontWeight: 'bold',
    marginBottom: 6,
    fontFamily: 'Poppins-Bold',
  },
  blueBotton: {
    backgroundColor: '#00AEEF',
    width: '88%',
    height: 56,
    borderRadius: 10,
    margin: 10,
    marginBottom: 20,
    marginTop: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgb(0, 0, 0)',
    borderWidth: 1,
    borderRadius: 14,
    height: 45,
    padding: 1,
  },
  searchInput: {
    width: '68%',
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: '500',
    color: 'black',
    height: 45,
    left: 16,
  },
});
