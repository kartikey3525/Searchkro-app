import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useIsFocused} from '@react-navigation/native';

import {Dimensions} from 'react-native';
import {AuthContext} from '../context/authcontext';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {ThemeContext} from '../context/themeContext';

export default function ProductCategories({navigation}) {
  const [numColumns, setNumColumns] = useState(4);
  const isFocused = useIsFocused();
  const {VerifyOTP, handleLogin, getCategories, userdata, categorydata} =
    useContext(AuthContext);

  useEffect(() => {
    // getCategories();
  }, [isFocused]);

  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

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
        <View style={{width: '100%', marginLeft: 8}}>
          <FlatList
            style={{
              marginTop: '2%',
              padding: 5,
            }}
            key={flatListKey}
            horizontal={false}
            scrollEnabled={false}
            numColumns={3}
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
        <View style={{width: '100%', marginLeft: 8}}>
          <FlatList
            style={{
              marginTop: '2%',
              padding: 5,
            }}
            key={flatListKey}
            horizontal={false}
            scrollEnabled={false}
            numColumns={3}
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
        <View style={{width: '100%', marginLeft: 8}}>
          <FlatList
            style={{
              marginTop: '2%',
              padding: 5,
            }}
            key={flatListKey}
            horizontal={false}
            scrollEnabled={false}
            numColumns={3}
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
        <View style={{width: '100%', marginLeft: 8}}>
          <FlatList
            style={{
              marginTop: '2%',
              padding: 5,
            }}
            key={flatListKey}
            horizontal={false}
            scrollEnabled={false}
            numColumns={3}
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
              backgroundColor: isDark ? '#121212' : 'rgba(248, 247, 247, 1)',
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

  const getTabHeight = () => {
    switch (index) {
      case 0:
        return 550; // Height for Tab 1
      case 1:
        return 550; // Height for Tab 2
      case 2:
        return 550; // Height for Tab 3
      case 3:
        return 550; // Height for Tab 3
      default:
        return 550;
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
              color={isDark ? '#fff' : 'rgba(94, 95, 96, 1)'}
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
                  color: isDark ? '#fff' : '#000',
                },
              ]}>
              Categories
            </Text>
            <Image
              source={
                isDark
                  ? require('../assets/search-icon-dark.png')
                  : require('../assets/search-icon.png')
              }
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
                  indicatorStyle={{backgroundColor: isDark ? 'white' : 'black'}} // Active tab indicator
                  style={{
                    backgroundColor: isDark ? 'black' : 'white', // Tab bar background color
                    borderTopWidth: 1, // Top border
                    borderBottomWidth: 1, // Bottom border
                    borderColor: isDark ? 'grey' : 'rgba(0, 0, 0, 0.1)', // Border color
                  }}
                  labelStyle={{
                    fontWeight: 'bold', // Ensure bold label
                    color: isDark ? 'white' : 'black', // Force black color for labels
                    textTransform: 'none', // Disable any text transformation (like uppercase)
                  }}
                  activeColor={isDark ? 'white' : 'black'}
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
    width: Width * 0.295,
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
});
