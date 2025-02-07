import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useIsFocused} from '@react-navigation/native';

import {Dimensions} from 'react-native';
import {AuthContext} from '../context/authcontext';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {ThemeContext} from '../context/themeContext';

export default function Preferences({navigation}) {
  const [numColumns, setNumColumns] = useState(4);
  const isFocused = useIsFocused();
  const {userRole, getSellerCategories, getPosts, posts} =
    useContext(AuthContext);

  useEffect(() => {
    // getCategories();
  }, [isFocused]);
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

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

  const flatListKey = `flat-list-${numColumns}`;

  const renderRectangleList = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'flex-start',
          marginBottom: 15,
          alignItems: 'center',
          width: Width * 0.5, // Take half the screen width for two columns
        }}
        onPress={() => navigation.navigate('preferencedetails', {item: item})}>
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

  const renderSellerRectangleList = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'flex-start',
          marginBottom: 15,
          alignItems: 'center',
          width: Width * 0.5,
        }}
        onPress={() => navigation.navigate('preferencedetails', {item: item})}>
        <View
          style={[
            styles.rectangle1,
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
          style={[
            styles.recListText2,
            {fontSize: 15, color: isDark ? '#fff' : '#000'},
          ]}>
          {item.title}
        </Text>
        <Text
          numberOfLines={2}
          style={[styles.recListText2, {color: isDark ? '#fff' : '#000'}]}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View
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
                  color: isDark ? '#fff' : '#000',
                  width: Width * 0.5,
                },
              ]}>
              {userRole === 'buyer' ? 'Preferences' : 'Recent Posts'}
            </Text>
          </View>

          <FlatList
            style={{
              marginTop: '2%',
              height: Height * 0.9,
            }}
            key={flatListKey}
            horizontal={false}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={userRole === 'buyer' ? recentPostList : posts}
            keyExtractor={item => (userRole === 'buyer' ? item.id : item._id)} // Ensure unique key as a string
            renderItem={
              userRole === 'buyer'
                ? renderRectangleList
                : renderSellerRectangleList
            }
          />
        </View>
      </View>
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
    width: Width * 0.44,
    height: 160,
    justifyContent: 'flex-start',
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
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
    color: '#000',
    marginTop: 4,
  },
  recListText2: {
    fontSize: 12,
    fontWeight: '500',
    width: 150,
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
});
