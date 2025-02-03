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

import {Dimensions} from 'react-native';
import {AuthContext} from '../context/authcontext';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {BarChart, YAxis, Grid} from 'react-native-svg-charts';
import {G, Rect} from 'react-native-svg'; // Use G and Rect for custom SVG if necessary
import * as scale from 'd3-scale';
import HorizontalRatingButtons from '../components/HorizontalRating';

export default function ProductCategories({navigation}) {
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
    {key: 'jacket', title: 'jacket'},
    {key: 'jeans', title: 'jeans'},
    {key: 'hoddies', title: 'hoddies'},
    {key: 'tshirts', title: 't-shirts'},
  ]);

  const jacket = () => (
    <View>
      <View style={{height: '100%', flexGrow: 1}}>
        <View style={{width: '100%', marginLeft: 14}}>
          <FlatList
            style={{
              marginTop: '2%',
              padding: 5,
            }}
            key={flatListKey}
            horizontal={false}
            scrollEnabled={false}
            numColumns={4}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={recentPostList}
            keyExtractor={item => item.id}
            renderItem={renderRectangleList}
          />
        </View>
      </View>
    </View>
  );

  const jeans = () => (
    <View>
      <View style={{height: '100%', flexGrow: 1}}>
        <View style={{width: '100%', marginLeft: 14}}>
          <FlatList
            style={{
              marginTop: '2%',
              padding: 5,
            }}
            key={flatListKey}
            horizontal={false}
            scrollEnabled={false}
            numColumns={4}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={recentPostList}
            keyExtractor={item => item.id}
            renderItem={renderRectangleList}
          />
        </View>
      </View>
    </View>
  );
  const hoddies = () => (
    <View>
      <View style={{height: '100%', flexGrow: 1}}>
        <View style={{width: '100%', marginLeft: 14}}>
          <FlatList
            style={{
              marginTop: '2%',
              padding: 5,
            }}
            key={flatListKey}
            horizontal={false}
            scrollEnabled={false}
            numColumns={4}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={recentPostList}
            keyExtractor={item => item.id}
            renderItem={renderRectangleList}
          />
        </View>
      </View>
    </View>
  );

  const tshirts = () => (
    <View>
      <View style={{height: '100%', flexGrow: 1}}>
        <View style={{width: '100%', marginLeft: 14}}>
          <FlatList
            style={{
              marginTop: '2%',
              padding: 5,
            }}
            key={flatListKey}
            horizontal={false}
            scrollEnabled={false}
            numColumns={4}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={recentPostList}
            keyExtractor={item => item.id}
            renderItem={renderRectangleList}
          />
        </View>
      </View>
    </View>
  );

  const renderScene = SceneMap({
    jacket: jacket,
    jeans: jeans,
    hoddies: hoddies,
    tshirts: tshirts,
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
        <View style={[styles.rectangle, {overflow: 'hidden'}]}>
          <Image source={item.img} style={{width: '100%', height: '100%'}} />
        </View>

        <Text numberOfLines={1} style={styles.recListText}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const getTabHeight = () => {
    switch (index) {
      case 0:
        return 600; // Height for Tab 1
      case 1:
        return 600; // Height for Tab 2
      case 2:
        return 600; // Height for Tab 3
      case 3:
        return 600; // Height for Tab 3
      default:
        return 200;
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
              color="rgba(94, 95, 96, 1)"
              style={{marginLeft: 20, padding: 5}}
            />
            <Text
              style={[
                {
                  fontSize: 20,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginLeft: '25%',
                  width: Width * 0.5,
                },
              ]}>
              Categories
            </Text>
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
                  indicatorStyle={{backgroundColor: 'black'}} // Active tab indicator
                  style={{
                    backgroundColor: 'white', // Tab bar background color
                    borderTopWidth: 1, // Top border
                    borderBottomWidth: 1, // Bottom border
                    borderColor: 'rgba(0, 0, 0, 0.1)', // Border color
                  }}
                  labelStyle={{
                    fontWeight: 'bold', // Ensure bold label
                    color: 'black', // Force black color for labels
                    textTransform: 'none', // Disable any text transformation (like uppercase)
                  }}
                  activeColor="black"
                  inactiveColor="grey"
                  pressColor="rgba(0, 0, 0, 0.1)"
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContainer: {
    height: Height * 1.8,
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
