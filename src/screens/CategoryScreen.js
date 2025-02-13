import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {Dimensions} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

import {ScrollView} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import {AuthContext} from '../context/authcontext';
import {ThemeContext} from '../context/themeContext';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';

export default function CategoryScreen({navigation, route}) {
  const isFocused = useIsFocused();
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const {getCategories, fullCategorydata, isposting} = useContext(AuthContext);

  useEffect(() => {
    getCategories();
  }, [isFocused]);
  const [categoryIcons, setcategoryIcons] = useState([
    {id: 1, title: 'Phone', img: require('../assets/phone.png')},
    {id: 2, title: 'Laptop', img: require('../assets/Laptop.png')},
    {id: 3, title: 'Medicine', img: require('../assets/medicine.png')},
    {id: 4, title: 'Clothes', img: require('../assets/clothes.png')},
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
          width: Width * 0.9,
          borderWidth: 1,
          flexDirection: 'row',
          alignSelf: 'center',
          backgroundColor: isDark
            ? 'rgba(29, 30, 32, 1)'
            : 'rgba(255, 255, 255, 1)',
          borderRadius: 10,
          borderColor: isDark
            ? 'rgba(109, 109, 109, 0.43)'
            : 'rgba(0, 0, 0, 1)',
          height: Height * 0.08,
          justifyContent: 'flex-start',
        }}
        onPress={() => [
          navigation.navigate('Subcategory', {
            item: item.subCategories,
            isposting: isposting,
            selectedcategory: [item.name],
          }),
        ]}>
        <View style={[styles.square]}>
          <Image
            source={{uri: item.image}}
            style={{
              width: item.id === 12 ? 30 : 50,
              height: 35,
              marginLeft: 10,
            }}
            resizeMode="contain"
          />
        </View>

        <Text
          style={{
            marginLeft: 10,
            fontWeight: 'bold',
            width: Width * 0.64,
            color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
          }}>
          {item.name}
        </Text>
        <Entypo
          name="chevron-thin-right"
          size={22}
          color={isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(94, 95, 96, 1)'}
          style={{marginRight: 5}}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'rgba(255, 255, 255, 1)',
        },
      ]}>
      <Header header={'Categories'} />

      <View
        style={{
          width: Width,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <SearchBar placeholder={'Search Categories'} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{height: Height * 0.73, flexGrow: 1}}>
          {fullCategorydata.map((item, index) => (
            <View key={item.id}>{rendersquareList({item, index})}</View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    width: Width,
    height: Height,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    width: Width * 0.9,
    borderColor: 'rgb(0, 0, 0)',
    borderWidth: 1,
    borderRadius: 14,
    height: 50,
    padding: 1,
  },
  searchInput: {
    width: '68%',
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: '500',
    height: 45,
    left: 16,
  },
});
