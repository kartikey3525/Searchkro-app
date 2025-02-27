import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {ThemeContext} from '../context/themeContext';

import {Dimensions} from 'react-native';
import {AuthContext} from '../context/authcontext';
import SearchBar from '../components/SearchBar';
import RatingTest from '../components/RatingTest';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import LocationPermission from '../hooks/uselocation'; // Import the component

export default function HomeScreen({navigation}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

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
    fullCategorydata,
    nearbyPosts,
    userRole,
    getSellerCategories,
    getPosts,
    posts,
  } = useContext(AuthContext);

  useEffect(() => {
    userRole === 'buyer' ? getCategories() : getSellerCategories();
    userRole === 'buyer' ? (getRecentPosts(), getNearbyPosts()) : getPosts();
    //  console.log('posts data ', posts);
  }, [isFocused]);

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
        <View
          style={[
            styles.square,
            {backgroundColor: isDark ? '#121212' : 'rgba(248, 247, 247, 1)'},
          ]}>
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

        <Text
          style={[styles.newsDescription, {color: isDark ? '#fff' : '#000'}]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRectangleList = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          paddingLeft: 4,
          marginBottom: 15,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('shopdetails', {item: item})}>
        <View
          style={[
            styles.rectangle,
            {
              overflow: 'hidden',
              backgroundColor: isDark ? '#121212' : 'rgba(248, 247, 247, 1)',
            },
          ]}>
          <Image
            source={{uri: item.images[0]}}
            // source={item.img}
            style={{width: '100%', height: '100%'}}
          />
        </View>

        <Text
          numberOfLines={1}
          style={[styles.recListText, {color: isDark ? '#fff' : '#000'}]}>
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
          marginLeft: 10,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('shopdetails', {item: item})}>
        <View
          style={[
            styles.rectangle2,
            {
              overflow: 'hidden',
              backgroundColor: isDark ? '#121212' : 'rgba(248, 247, 247, 1)',
            },
          ]}>
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
              {
                fontWeight: 'bold',
                fontSize: 12,
                marginLeft: 12,
                color: isDark ? '#fff' : '#000',
              },
            ]}>
            {item.title}
          </Text>

          {/* <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              numberOfLines={1}
              style={[
                {
                  fontWeight: 'bold',
                  marginTop: 0,
                  fontSize: 13,
                  paddingRight: 8,
                  marginLeft: 12,
                  color: isDark ? '#fff' : '#000',
                },
              ]}>
             {item?.rating?.averageRating}   
              4
            </Text>

            <RatingTest fixedRating="4" />
          </View> */}
          {/* {item?.rating?.averageRating} */}

          <View
            style={{
              flexDirection: 'row',
              marginBottom: 5,
              alignItems: 'center',
              marginTop: 2,
            }}>
            <Image
              source={
                isDark
                  ? require('../assets/locatin-dark.png')
                  : require('../assets/location.png')
              }
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
                  color: isDark ? '#fff' : 'rgba(29, 30, 32, 1)',
                  fontWeight: '500',
                  fontSize: 10,
                  width: 95,
                  left: 5,
                },
              ]}>
              {/* dddddddddddddddddddddddddddddddddddddddddddddd */}
              {item.userData.businessAddress}
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
        <Text
          numberOfLines={1}
          style={[
            styles.recListText,
            {
              fontSize: 15,
              width: 160,

              color: isDark ? '#fff' : '#000',
            },
          ]}>
          {item.title}
        </Text>
        <Text
          numberOfLines={2}
          style={[
            styles.recListText,
            {
              color: isDark ? '#fff' : '#000',

              width: 160,
            },
          ]}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  const [filteredLists, setFilteredLists] = useState(
    userRole === 'buyer'
      ? [recentPosts ?? [], nearbyPosts ?? []]
      : [posts ?? []],
  );

  useEffect(() => {
    if (userRole === 'buyer') {
      setFilteredLists([recentPosts, nearbyPosts]);
    } else {
      setFilteredLists([posts]);
    }
  }, [userRole, recentPosts, nearbyPosts, posts]);
 
  return (
    <View
      style={[styles.container, {backgroundColor: isDark ? '#000' : '#fff'}]}>
      {/* {location ? (
        <Text style={styles.text}>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      ) : (
        <Text style={styles.text}>{errorMessage || 'Getting location...'}</Text>
      )}  */}
      <LocationPermission setLocation={setLocation} />
      <View
        style={{
          marginTop: '2%',
          width: '100%',
          justifyContent: 'center',
          height: Height * 0.9,
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: 5,
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
          <View
            style={[
              styles.inputContainer,
              {
                borderWidth: 0,
                backgroundColor: isDark ? '#000' : '#fff',
                width: userRole === 'buyer' ? Width * 0.55 : Width * 0.6,
              },
            ]}>
            <View
              style={[
                styles.searchInput,
                {
                  left: 1,
                  color: isDark ? '#fff' : '#000',
                },
              ]}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: isDark ? '#fff' : '#000',
                  marginTop: 2,
                }}>
                {errorMessage || 'Your Locaiton'}
              </Text>

              {location ? (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    width: Width * 0.53,
                    marginTop: 6,
                    color: isDark ? 'rgba(94, 95, 96, 1)' : '#000',
                  }}>
                  Latitude: {location.latitude}, Longitude: {location.longitude}
                </Text>
              ) : (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 13,
                    fontWeight: '500',
                    marginTop: 0,
                    width: Width * 0.53,
                    color: isDark
                      ? 'rgba(252, 252, 252, 0.4)'
                      : 'rgba(0, 0, 0, 0.4)',
                  }}>
                  {errorMessage || '6391 Elgin St. Celina, Delaware 10299...'}
                </Text>
              )}
            </View>
          </View>

          {userRole === 'buyer' ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}
              style={{
                backgroundColor: isDark ? '#000' : 'rgba(177, 177, 177, 0.14)',
                height: 40,
                width: '11%',
                alignSelf: 'center',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: isDark
                  ? 'rgb(149, 149, 149)'
                  : 'rgb(255, 255, 255)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 6,
              }}>
              <Image
                source={
                  isDark
                    ? require('../assets/notification-dark.png')
                    : require('../assets/notification.png')
                }
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
              backgroundColor: isDark ? '#000' : 'rgba(177, 177, 177, 0.14)',
              height: 40,
              width: '11%',
              alignSelf: 'center',
              borderWidth: 1,
              borderColor: isDark ? 'rgb(149, 149, 149)' : 'rgb(255, 255, 255)',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={
                isDark
                  ? require('../assets/chat-icon-dark.png')
                  : require('../assets/chat-icon.png')
              }
              style={{
                width: 24,
                height: 22,
                alignSelf: 'center',
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <SearchBar
          placeholder={'Search here'}
          lists={userRole === 'buyer' ? [recentPosts, nearbyPosts] : [posts]}
          setFilteredLists={setFilteredLists}
          searchKey="title"  
        />

        {userRole === 'buyer' ? (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{height: Height * 0.69, flexGrow: 1}}>
              <FlatList
                style={{
                  width: Width,
                  left: '2%',
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
                    color: isDark ? 'white' : 'black',

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
                  data={filteredLists[0]}
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
                    color: isDark ? 'white' : 'black',
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
                  data={filteredLists[1]}
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
                data={fullCategorydata}
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
                    color: isDark ? 'white' : 'black',
                    marginBottom: 0,
                  },
                ]}>
                Recent posts
              </Text>
              <View style={{width: Width * 0.97, marginLeft: 0}}>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: '2%',
                  }}>
                  {filteredLists[0].map(item => (
                    <View key={item._id} style={{width: '48%', margin: '1%'}}>
                      {renderSellerRectangleList({item})}
                    </View>
                  ))}
                </View>
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
    marginRight: '3%',
    height: 78,
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
    marginRight: 2,
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
    width: 110,
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
    width: Width * 0.85,
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: '500',
    color: 'black',
    height: 45,
    left: 16,
  },
});
