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
  Linking,
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Rating} from 'react-native-ratings';
import {useIsFocused} from '@react-navigation/native';
import {ThemeContext} from '../context/themeContext';

import {Dimensions} from 'react-native';
import {AuthContext} from '../context/authcontext';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {BarChart, YAxis, Grid} from 'react-native-svg-charts';
import {G, Rect} from 'react-native-svg'; // Use G and Rect for custom SVG if necessary
import * as scale from 'd3-scale';
import HorizontalRatingButtons from '../components/HorizontalRating';

export default function ShopDetails({navigation}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [numColumns, setNumColumns] = useState(4);
  const isFocused = useIsFocused();
  const {VerifyOTP, handleLogin, getCategories, userdata, categorydata} =
    useContext(AuthContext);

  useEffect(() => {
    // getCategories();
  }, [isFocused]);

  const data = [
    {value: 100, label: '5'},
    {value: 80, label: '4'},
    {value: 50, label: '3'},
    {value: 40, label: '2'},
    {value: 20, label: '1'},
  ];
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

  const dynamicRatings = [
    {label: '3.5', value: '3.5'},
    {label: '4.0', value: '4.0'},
    {label: '4.5', value: '4.5'},
    {label: '5.0', value: '5.0'},
    {label: '4.0', value: '4.0'},
  ];

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'overview', title: 'Overview'},
    {key: 'category', title: 'Category'},
    {key: 'review', title: 'Review'},
    {key: 'photos', title: 'Photos'},
  ]);

  const [selectedItemId, setSelectedItemId] = useState(null);

  const toggleModal = id => {
    if (selectedItemId === id) {
      setSelectedItemId(null); // Close modal if the same item is clicked again
    } else {
      setSelectedItemId(id); // Open modal for the clicked item
    }
  };

  const Overview = () => (
    <View>
      <View style={{height: '100%', flexGrow: 1}}>
        <Text
          style={[
            styles.bigText,
            {
              alignSelf: 'flex-start',
              color: isDark ? 'white' : 'black',
              fontSize: 18,
              left: 25,
              marginTop: 10,
              marginBottom: 0,
            },
          ]}>
          Quick information
        </Text>

        <Text
          style={[
            styles.bigText,
            {
              alignSelf: 'flex-start',
              fontSize: 14,
              color: isDark ? 'white' : 'black',
              left: 25,
              marginTop: 5,
              marginBottom: 0,
            },
          ]}>
          Address
        </Text>

        <Text
          numberOfLines={3}
          style={[
            styles.bigText,
            {
              alignSelf: 'flex-start',
              fontSize: 12,
              color: 'grey',
              left: 25,
              width: '95%',
              marginTop: 5,
              marginBottom: 0,
            },
          ]}>
          Chauhan Market Rd, near Fortis Hospital, Rasoolpur Nawada, Rasoolpur,
          Sector 62, Navaada, Noida, Uttar Pradesh 201301
        </Text>

        <Text
          style={[
            styles.bigText,
            {
              alignSelf: 'flex-start',
              fontSize: 14,
              color: isDark ? 'white' : 'black',

              left: 25,
              marginTop: 5,
              marginBottom: 0,
            },
          ]}>
          Contact
        </Text>

        <Text
          numberOfLines={3}
          style={[
            styles.bigText,
            {
              alignSelf: 'flex-start',
              fontSize: 12,
              color: 'grey',
              left: 25,
              width: '95%',
              marginTop: 5,
              marginBottom: 0,
            },
          ]}>
          9876549812
        </Text>

        <Text
          style={[
            styles.bigText,
            {
              alignSelf: 'flex-start',
              fontSize: 18,
              color: isDark ? 'white' : 'black',
              left: 25,
              marginTop: 5,
              marginBottom: 0,
            },
          ]}>
          Product categories
        </Text>
        <View style={{width: '100%', marginLeft: 14}}>
          <FlatList
            style={{
              marginTop: '2%',
              padding: 5,
            }}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={recentPostList}
            keyExtractor={item => item.id}
            renderItem={renderRectangleList}
          />
        </View>

        <TouchableOpacity
          style={styles.blueBotton}
          // onPress={() => setModalVisible(true)}
          onPress={() => navigation.navigate('productcategories', {})}>
          <Text
            style={[
              styles.smallText,
              {color: '#fff', fontSize: 20, marginBottom: 0},
            ]}>
            Categories
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.bigText,
            {
              alignSelf: 'flex-start',
              fontSize: 18,
              left: 25,
              color: isDark ? 'white' : 'black',
              marginTop: 5,
              marginBottom: 0,
            },
          ]}>
          Rating review
        </Text>
        <View style={{flexDirection: 'row', marginLeft: 25}}>
          <View
            style={{
              flexDirection: 'row',
              height: 200,
              alignSelf: 'flex-start',
              width: Width * 0.7,
            }}>
            {/* Y-Axis */}
            <YAxis
              data={data}
              yAccessor={({index}) => index}
              scale={scale.scaleBand}
              contentInset={{top: 10, bottom: 10}}
              formatLabel={(_, index) => data[index].label}
              propsForLabels={{
                fontSize: 20, // Set the font size here
                fontWeight: 'bold', // Optional: Make the label text bold
              }}
            />

            {/* BarChart */}
            <BarChart
              style={{flex: 1, marginLeft: 8}}
              data={data}
              horizontal={true}
              svg={{fill: 'rgba(255, 180, 0, 1)'}}
              spacing={0}
              gridMin={0}
              contentInset={{top: 5, bottom: 10}}>
              {/* Render the grid for vertical lines */}
              <Grid direction={Grid.Direction.VERTICAL} />

              {/* Render custom rectangles (bars) */}
              <G>
                {data.map((item, index) => (
                  <Rect
                    key={index}
                    x={0}
                    y={index * 36 + 20}
                    width={item.value * 2.5} // Adjust width as needed
                    height={10} // Height of each bar
                    rx={4} // Rounded corners (radius)
                    ry={4} // Rounded corners (radius)
                    fill="rgba(255, 180, 0, 1)" // Custom fill
                  />
                ))}
              </G>
            </BarChart>
          </View>

          <View style={{marginTop: '10%'}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  styles.bigText,
                  {
                    alignSelf: 'flex-start',
                    fontSize: 14,
                    color: isDark ? 'white' : 'black',
                    marginTop: 5,
                    marginBottom: 0,
                  },
                ]}>
                4.5
              </Text>
              <Octicons
                name="star-fill"
                size={15}
                color={'rgba(255, 219, 17, 1)'}
                style={{marginTop: 8, marginLeft: 5, alignSelf: 'center'}}
              />
            </View>

            <Text
              numberOfLines={1}
              style={[
                styles.bigText,
                {
                  alignSelf: 'flex-start',
                  fontSize: 12,
                  color: 'grey',
                  marginTop: 10,
                  marginBottom: 0,
                },
              ]}>
              9876549812
            </Text>

            <Text
              style={[
                styles.bigText,
                {
                  alignSelf: 'flex-start',
                  fontSize: 14,
                  color: isDark ? 'white' : 'black',

                  marginTop: 10,
                  marginBottom: 0,
                },
              ]}>
              88%
            </Text>

            <Text
              numberOfLines={1}
              style={[
                styles.bigText,
                {
                  alignSelf: 'flex-start',
                  fontSize: 12,
                  color: 'grey',
                  marginTop: 10,
                  marginBottom: 0,
                },
              ]}>
              Recommended
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.bigText,
            {
              alignSelf: 'flex-start',
              fontSize: 14,
              marginTop: 10,
              marginLeft: 25,
              marginBottom: 0,
              color: isDark ? 'white' : 'black',
            },
          ]}>
          Recent rating review
        </Text>

        <HorizontalRatingButtons ratings={dynamicRatings} />

        <TouchableOpacity
          style={styles.blueBotton}
          // onPress={() => setModalVisible(true)}
          onPress={() => navigation.navigate('ratedscreen', {})}>
          <Text
            style={[
              styles.smallText,
              {color: '#fff', fontSize: 20, marginBottom: 0},
            ]}>
            Write a review
          </Text>
        </TouchableOpacity>

        <View style={{height: 440}}>
          <FlatList
            style={{
              marginTop: '2%',
            }}
            showsHorizontalScrollIndicator={false}
            data={recentPostList}
            keyExtractor={item => item.id}
            renderItem={render2RectangleList}
          />
        </View>

        <Text
          style={[
            styles.bigText,
            {
              alignSelf: 'flex-start',
              fontSize: 18,
              left: 25,
              marginTop: 5,
              marginBottom: 0,
            },
          ]}>
          Photos
        </Text>
        <View style={{width: '100%', marginLeft: 14}}>
          <FlatList
            style={{
              marginTop: '2%',
              padding: 5,
            }}
            key={flatListKey}
            horizontal={false}
            scrollEnabled={false}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={recentPostList}
            keyExtractor={item => item.id}
            renderItem={renderPhotosList}
          />
        </View>
      </View>
    </View>
  );

  const Category = () => (
    <View>
      <View style={{}}>
        <Text
          style={[
            styles.bigText,
            {
              alignSelf: 'flex-start',
              fontSize: 18,
              left: 25,
              marginTop: 5,
              marginBottom: 0,
            },
          ]}>
          Product categories
        </Text>
        <View style={{width: '100%', marginLeft: 14}}>
          <FlatList
            style={{
              marginTop: '2%',
              padding: 5,
            }}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={recentPostList}
            keyExtractor={item => item.id}
            renderItem={renderRectangleList}
          />
        </View>

        <TouchableOpacity
          style={styles.blueBotton}
          // onPress={() => setModalVisible(true)}
          onPress={() => navigation.navigate('productcategories', {})}>
          <Text
            style={[
              styles.smallText,
              {color: '#fff', fontSize: 20, marginBottom: 0},
            ]}>
            Categories
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const Review = () => (
    <View>
      <View style={{height: '75%', flexGrow: 1}}>
        <Text
          style={[
            styles.bigText,
            {
              alignSelf: 'flex-start',
              fontSize: 18,
              left: 25,
              marginTop: 5,
              marginBottom: 0,
            },
          ]}>
          Rating review
        </Text>
        <View style={{flexDirection: 'row', marginLeft: 25}}>
          <View
            style={{
              flexDirection: 'row',
              height: 200,
              alignSelf: 'flex-start',
              width: Width * 0.7,
            }}>
            {/* Y-Axis */}
            <YAxis
              data={data}
              yAccessor={({index}) => index}
              scale={scale.scaleBand}
              contentInset={{top: 10, bottom: 10}}
              formatLabel={(_, index) => data[index].label}
              propsForLabels={{
                fontSize: 20, // Set the font size here
                fontWeight: 'bold', // Optional: Make the label text bold
              }}
            />

            {/* BarChart */}
            <BarChart
              style={{flex: 1, marginLeft: 8}}
              data={data}
              horizontal={true}
              svg={{fill: 'rgba(255, 180, 0, 1)'}}
              spacing={0}
              gridMin={0}
              contentInset={{top: 5, bottom: 10}}>
              {/* Render the grid for vertical lines */}
              <Grid direction={Grid.Direction.VERTICAL} />

              {/* Render custom rectangles (bars) */}
              <G>
                {data.map((item, index) => (
                  <Rect
                    key={index}
                    x={0}
                    y={index * 36 + 20}
                    width={item.value * 2.5} // Adjust width as needed
                    height={10} // Height of each bar
                    rx={4} // Rounded corners (radius)
                    ry={4} // Rounded corners (radius)
                    fill="rgba(255, 180, 0, 1)" // Custom fill
                  />
                ))}
              </G>
            </BarChart>
          </View>

          <View style={{marginTop: '10%'}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  styles.bigText,
                  {
                    alignSelf: 'flex-start',
                    fontSize: 14,
                    marginTop: 5,
                    marginBottom: 0,
                  },
                ]}>
                4.5
              </Text>
              <Octicons
                name="star-fill"
                size={15}
                color={'rgba(255, 219, 17, 1)'}
                style={{marginTop: 8, marginLeft: 5, alignSelf: 'center'}}
              />
            </View>

            <Text
              numberOfLines={1}
              style={[
                styles.bigText,
                {
                  alignSelf: 'flex-start',
                  fontSize: 12,
                  color: 'grey',
                  marginTop: 10,
                  marginBottom: 0,
                },
              ]}>
              9876549812
            </Text>

            <Text
              style={[
                styles.bigText,
                {
                  alignSelf: 'flex-start',
                  fontSize: 14,
                  marginTop: 10,
                  marginBottom: 0,
                },
              ]}>
              88%
            </Text>

            <Text
              numberOfLines={1}
              style={[
                styles.bigText,
                {
                  alignSelf: 'flex-start',
                  fontSize: 12,
                  color: 'grey',
                  marginTop: 10,
                  marginBottom: 0,
                },
              ]}>
              Recommended
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.bigText,
            {
              alignSelf: 'flex-start',
              fontSize: 14,
              marginTop: 10,
              marginLeft: 25,
              marginBottom: 0,
            },
          ]}>
          Recent rating review
        </Text>

        <HorizontalRatingButtons ratings={dynamicRatings} />

        <TouchableOpacity
          style={styles.blueBotton}
          // onPress={() => setModalVisible(true)}
          onPress={() => navigation.navigate('ratedscreen', {})}>
          <Text
            style={[
              styles.smallText,
              {color: '#fff', fontSize: 20, marginBottom: 0},
            ]}>
            Write a review
          </Text>
        </TouchableOpacity>

        <View style={{height: 440}}>
          <FlatList
            style={{
              marginTop: '2%',
            }}
            showsHorizontalScrollIndicator={false}
            data={recentPostList}
            keyExtractor={item => item.id}
            renderItem={render2RectangleList}
          />
        </View>
      </View>
    </View>
  );

  const Photos = () => (
    <View>
      <Text
        style={[
          styles.bigText,
          {
            alignSelf: 'flex-start',
            fontSize: 18,
            left: 25,
            marginTop: 5,
            marginBottom: 0,
          },
        ]}>
        Photos
      </Text>
      <View style={{width: '100%', marginLeft: 14}}>
        <FlatList
          style={{
            marginTop: '2%',
            padding: 5,
          }}
          key={flatListKey}
          horizontal={false}
          scrollEnabled={false}
          numColumns={3}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={recentPostList}
          keyExtractor={item => item.id}
          renderItem={renderPhotosList}
        />
      </View>
    </View>
  );

  const renderScene = SceneMap({
    overview: Overview,
    category: Category,
    review: Review,
    photos: Photos,
  });

  const flatListKey = `flat-list-${numColumns}`;

  const renderRectangleList = ({item, index}) => {
    const isFirst = index === 0;
    const isLast = index === item.length - 1;

    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          marginBottom: 15,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('details', {item: item})}>
        <View
          style={[
            styles.rectangle,
            {
              overflow: 'hidden',
              backgroundColor: isDark
                ? 'rgb(0, 0, 0)'
                : 'rgba(248, 247, 247, 1)',
            },
          ]}>
          <Image source={item.img} style={{width: '100%', height: '100%'}} />
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
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#ccc' : 'rgba(0, 0, 0, 0.1)',
        }}
        onPress={() => navigation.navigate('details', {item: item})}>
        <View
          style={[
            styles.rectangle2,
            {
              overflow: 'hidden',
              flexDirection: 'row',
              backgroundColor: isDark ? '#121212' : 'rgba(248, 247, 247, 1)',
            },
          ]}>
          <View
            style={{
              width: 70,
              height: 70,
              overflow: 'hidden',
              borderRadius: 50,
              marginLeft: 25,
              margin: 8,
              marginBottom: 0,
            }}>
            <Image source={item.img} style={{width: '100%', height: '100%'}} />
          </View>
          <Entypo
            name={'dots-three-vertical'}
            size={16}
            color={isDark ? '#fff' : 'rgba(94, 95, 96, 1)'}
            style={{position: 'absolute', right: 10, top: 20}}
            onPress={() => toggleModal(item.id)}
          />
          {selectedItemId === item.id && (
            <Pressable
              style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                top: 10,
                right: 24,
              }}
              onPress={() => toggleModal(item.id)}>
              <View
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: isDark ? 'black' : 'white',
                    borderWidth: 1,
                    borderColor: 'rgb(255, 255, 255)',
                  },
                ]}>
                <TouchableOpacity
                  style={{
                    padding: 4,

                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20,
                  }}
                  onPress={() => {}}>
                  <Text
                    style={[
                      {
                        fontSize: 16,
                        marginLeft: 5,
                        fontWeight: '500',
                        color: isDark ? '#fff' : 'rgba(94, 95, 96, 1)',
                      },
                    ]}>
                    Edit
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    height: 1,
                    backgroundColor: 'lightgrey',
                    width: 120,
                    alignSelf: 'center',
                    borderRadius: 10,
                  }}
                />

                <TouchableOpacity
                  style={{
                    padding: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20,
                  }}
                  onPress={() => deleteItem(item.id)}>
                  <Text
                    style={[
                      {
                        fontSize: 16,
                        marginLeft: 5,
                        fontWeight: '500',
                        color: isDark ? '#fff' : 'rgba(94, 95, 96, 1)',
                      },
                    ]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          )}
          <View></View>
          <View>
            <Text
              numberOfLines={1}
              style={[
                styles.recListText,
                {
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: isDark ? '#fff' : '#000',
                },
              ]}>
              {item.title}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: 5,
                alignItems: 'center',
                marginTop: -2,
              }}>
              <Text
                numberOfLines={2}
                style={[
                  {
                    marginTop: 0,
                    color: isDark ? '#fff' : 'rgba(29, 30, 32, 1)',
                    fontWeight: '500',
                    fontSize: 12,
                    left: 2,
                  },
                ]}>
                12 reviews
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
              }}>
              <Rating
                type="star"
                ratingColor="#FFD700"
                isDisabled={true}
                readonly
                ratingBackgroundColor="#ccc"
                startingValue={3}
                imageSize={15}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}>
          <Text
            style={[
              {
                marginTop: 0,
                color: isDark ? '#fff' : 'rgba(94, 95, 96, 1)',
                fontWeight: '500',
                fontSize: 12,
                marginRight: 20,
              },
            ]}>
            8 month ago
          </Text>

          <View
            style={{
              marginRight: 15,
              borderRadius: 5,
              borderWidth: 1,
              padding: 5,
              flexDirection: 'row',
              borderColor: 'rgba(228, 228, 228, 1)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AntDesign
              name={'like1'}
              size={16}
              color={isDark ? '#fff' : 'rgba(94, 95, 96, 1)'}
            />
            <Text
              style={[
                {
                  marginLeft: 5,
                  color: isDark ? '#fff' : 'rgba(94, 95, 96, 1)',
                  fontWeight: '500',
                  fontSize: 12,
                },
              ]}>
              Helpfull
            </Text>
          </View>

          <Pressable
            style={{
              marginRight: 15,
              borderRadius: 5,
              borderWidth: 1,
              padding: 5,
              flexDirection: 'row',
              borderColor: 'rgba(228, 228, 228, 1)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.navigate('messages', {item: item})}>
            <FontAwesome
              name={'commenting-o'}
              size={16}
              color={isDark ? '#fff' : 'rgba(94, 95, 96, 1)'}
            />
            <Text
              style={[
                {
                  marginLeft: 5,
                  color: isDark ? '#fff' : 'rgba(94, 95, 96, 1)',
                  fontWeight: '500',
                  fontSize: 12,
                },
              ]}>
              comment
            </Text>
          </Pressable>

          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              padding: 5,
              flexDirection: 'row',
              borderColor: 'rgba(228, 228, 228, 1)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Feather
              name={'send'}
              size={16}
              color={isDark ? '#fff' : 'rgba(94, 95, 96, 1)'}
            />
            <Text
              style={[
                {
                  marginLeft: 5,
                  color: isDark ? '#fff' : 'rgba(94, 95, 96, 1)',
                  fontWeight: '500',
                  fontSize: 12,
                },
              ]}>
              share
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderPhotosList = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          marginBottom: 10,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('details', {item: item})}>
        <View style={[styles.rectangle, {overflow: 'hidden'}]}>
          <Image source={item.img} style={{width: '100%', height: '100%'}} />
        </View>
      </TouchableOpacity>
    );
  };

  const getTabHeight = () => {
    switch (index) {
      case 0:
        return 1720; // Height for Tab 1
      case 1:
        return 430; // Height for Tab 2
      case 2:
        return 950; // Height for Tab 3
      case 3:
        return 600; // Height for Tab 3
      default:
        return 200;
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={[styles.container, {backgroundColor: isDark ? '#000' : '#fff'}]}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginTop: '2%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              width: Width,
              flexDirection: 'row',
              height: 60,
              justifyContent: 'flex-start',
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
                  marginLeft: '25%',
                  color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
                },
              ]}>
              Shop Details
            </Text>
          </View>

          <Image
            source={require('../assets/shop-pic.png')}
            style={{
              width: Width * 0.9,
              height: Height * 0.2,
            }}
            resizeMode="contain"
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#000' : 'white',
              justifyContent: 'flex-start',
              bottom: 40,
              right: 35,
              elevation: 1,
            }}>
            <View
              style={[
                styles.inputContainer,
                {
                  borderWidth: 0,
                  backgroundColor: isDark ? '#000' : 'rgba(255, 255, 255, 1)',
                },
              ]}>
              <View
                style={[
                  styles.searchInput,
                  {
                    width: '65%',
                    left: 1,
                    color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
                  },
                ]}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginTop: 2,
                    color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
                  }}>
                  Your Locaiton
                </Text>

                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 13,
                    fontWeight: '500',
                    marginTop: 0,
                    color: isDark
                      ? 'rgba(255, 255, 255, 1)'
                      : 'rgba(0, 0, 0, 0.4)',
                  }}>
                  {' '}
                  6391 Elgin St. Celina, Delaware 10299...
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              alignSelf: 'flex-start',
              marginLeft: '8%',
              bottom: '2%',
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                numberOfLines={1}
                style={[
                  styles.recListText,
                  {
                    fontWeight: 'bold',
                    marginTop: 0,
                    fontSize: 16,
                    width: 30,
                    color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
                  },
                ]}>
                4.5
              </Text>
              <Rating
                type="star"
                ratingColor="rgba(255, 219, 17, 1)"
                isDisabled={true}
                readonly
                ratingBackgroundColor="rgba(255, 219, 17, 1)"
                startingValue={3}
                imageSize={20}
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  borderWidth: 0,
                  backgroundColor: isDark ? '#000' : 'rgba(255, 255, 255, 1)',
                },
              ]}>
              <View
                style={[
                  styles.searchInput,
                  {
                    width: '65%',
                    left: 0,
                    backgroundColor: isDark ? '#000' : 'rgba(255, 255, 255, 1)',
                  },
                ]}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginTop: 2,
                      color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
                    }}>
                    Open :
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'grey',
                      fontWeight: '500',
                      marginTop: 2,
                      color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
                    }}>
                    9:30 am–10:30 pm
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
                      marginTop: 2,
                    }}>
                    About :
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 13,
                      fontWeight: '500',
                      marginTop: 0,
                      alignSelf: 'center',
                      left: 0,
                      color: isDark
                        ? 'rgba(255, 255, 255, 1)'
                        : 'rgba(0, 0, 0, 0.86)',
                    }}>
                    {' '}
                    6391 Elgin St. Celina, Delaware 10299...
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-start',
              marginLeft: '7%',
            }}>
            <Pressable style={styles.iconStyle}>
              <Ionicons
                onPress={() => navigation.goBack()}
                name="call"
                size={26}
                color="rgba(255, 255, 255, 1)"
              />
            </Pressable>

            <Pressable
              style={[
                styles.iconStyle,
                {backgroundColor: 'rgba(15, 92, 246, 1)'},
              ]}>
              <Ionicons
                onPress={() => navigation.goBack()}
                name="chatbubble-ellipses-outline"
                size={26}
                color="rgba(255, 255, 255, 1)"
              />
            </Pressable>

            <Pressable
              style={[
                styles.iconStyle,
                {backgroundColor: 'rgba(255, 219, 17, 1)'},
              ]}>
              <Octicons
                onPress={() => navigation.goBack()}
                name="star-fill"
                size={26}
                color="rgba(255, 255, 255, 1)"
              />
            </Pressable>

            <Pressable
              style={[
                styles.iconStyle,
                {backgroundColor: 'rgba(33, 150, 243, 1)'},
              ]}>
              <FontAwesome
                onPress={() => navigation.goBack()}
                name="share"
                size={26}
                color="rgba(255, 255, 255, 1)"
              />
            </Pressable>
          </View>

          <View style={[styles.tabContainer, {height: getTabHeight()}]}>
            <TabView
              swipeEnabled={false}
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{width: Width}}
              renderTabBar={props => (
                <TabBar
                  {...props}
                  indicatorStyle={{backgroundColor: isDark ? 'white' : 'black'}} // Active tab indicator
                  style={{
                    backgroundColor: isDark ? 'black' : 'white', // Tab bar background color
                    borderTopWidth: 1, // Top border
                    borderBottomWidth: 1, // Bottom border
                    borderColor: isDark
                      ? 'rgba(0, 0, 0, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)', // Border color
                  }}
                  labelStyle={{
                    fontWeight: 'bold', // Ensure bold label
                    color: isDark ? 'white' : 'black', // Force black color for labels
                    textTransform: 'none', // Disable any text transformation (like uppercase)
                  }}
                  activeColor={isDark ? 'white' : 'black'}
                  inactiveColor="grey"
                  pressColor={
                    isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                  }
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: isDark ? 'black' : 'rgba(255, 255, 255, 1)',
          flexDirection: 'row',
          borderTopWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          position: 'absolute',
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          width: Width,
          height: 90,
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity
          style={[
            styles.smallblueBotton,
            {
              backgroundColor: isDark ? 'black' : 'rgb(255, 255, 255)',
              borderWidth: 1,
              borderColor: isDark
                ? 'rgba(255, 255, 255, 1)'
                : 'rgba(15, 92, 246, 1)',
            },
          ]}
          onPress={() => navigation.navigate('messages', {item: null})}>
          <Text
            style={[
              styles.smallText,
              {
                color: isDark
                  ? 'rgba(255, 255, 255, 1)'
                  : 'rgba(15, 92, 246, 1)',
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 0,
              },
            ]}>
            Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallblueBotton}
          onPress={() => Linking.openURL(`tel:${8860315531}`)}>
          <Text
            style={[
              styles.smallText,
              {
                color: '#fff',
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 0,
              },
            ]}>
            Call
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContent: {
    borderRadius: 5,
    width: 120,
    backgroundColor: 'white',
    elevation: 2,
  },
  tabContainer: {
    height: Height * 1.8,
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  iconStyle: {
    width: Width * 0.13,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '7%',
    backgroundColor: 'rgba(7, 201, 29, 1)',
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
    width: Width,
    marginRight: 10,

    height: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    left: 2,
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
  smallblueBotton: {
    backgroundColor: 'rgba(7, 201, 29, 1)',
    width: '30%',
    height: 56,
    borderRadius: 10,
    margin: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueBotton: {
    backgroundColor: '#00AEEF',
    width: '88%',
    height: 56,
    borderRadius: 10,
    margin: 10,
    alignSelf: 'center',
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
