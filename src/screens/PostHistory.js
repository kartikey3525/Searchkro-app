import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {ThemeContext} from '../context/themeContext';

import {Dimensions} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

import {ScrollView} from 'react-native-gesture-handler';

export default function PostHistory({navigation}) {
  const [selectedItemId, setSelectedItemId] = useState(null);
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

  const toggleModal = id => {
    if (selectedItemId === id) {
      setSelectedItemId(null); // Close modal if the same item is clicked again
    } else {
      setSelectedItemId(id); // Open modal for the clicked item
    }
  };

  const render2RectangleList = ({item, index}) => {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          marginBottom: 15,
          alignItems: 'center',
        }}>
        <View
          style={[
            styles.rectangle2,
            {
              overflow: 'hidden',
              flexDirection: 'row',
              backgroundColor: isDark ? 'rgba(28, 28, 28, 1)' : 'white',
            },
          ]}>
          <Image
            source={item.img}
            style={{
              width: '36%',
              height: '86%',
              alignSelf: 'center',
              overflow: 'hidden',
              borderRadius: 10,
              margin: 8,
            }}
          />

          <View style={{alignSelf: 'flex-start'}}>
            <Text
              numberOfLines={2}
              style={[
                styles.recListText,
                {
                  fontWeight: '600',
                  fontSize: 14,
                  margin: 5,
                  marginTop: 10,
                  color: isDark ? 'white' : 'rgba(29, 30, 32, 1)',
                  marginLeft: 0,
                  width: Width * 0.45,
                },
              ]}>
              {item.title}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: 5,
                alignItems: 'center',
                marginTop: 4,
              }}>
              <Text
                numberOfLines={2}
                style={[
                  styles.recListText,
                  {
                    marginTop: 0,
                    color: isDark ? 'white' : 'rgba(29, 30, 32, 1)',
                    fontWeight: '400',
                    fontSize: 12,
                    width: 130,
                    lineHeight: 18,
                  },
                ]}>
                post : at 21th Nov 2024, 12:23pm
              </Text>
            </View>
          </View>
          <Entypo
            onPress={() => toggleModal(item.id)} // Use toggleModal instead of setModalVisible
            name="dots-three-vertical"
            size={24}
            color={isDark ? 'rgb(154, 154, 154)' : 'rgb(0, 0, 0)'}
            style={{alignSelf: 'flex-start', marginTop: 10}}
          />
        </View>
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
                {backgroundColor: isDark ? '#121212' : 'white'},
              ]}>
              <TouchableOpacity
                style={{
                  padding: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 20,
                }}
                onPress={() => deleteItem(item.id)}>
                <Ionicons
                  name={'trash-outline'}
                  size={16}
                  color={isDark ? '#fff' : 'rgba(94, 95, 96, 1)'}
                />
                <Text
                  style={[
                    styles.bigText,
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

              <View
                style={{
                  height: 1,
                  backgroundColor: 'lightgrey',
                  width: 150,
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
                <Ionicons
                  name={'trash-outline'}
                  size={16}
                  color={isDark ? '#fff' : 'rgba(94, 95, 96, 1)'}
                />
                <Text
                  style={[
                    styles.bigText,
                    {
                      fontSize: 16,
                      marginLeft: 5,
                      fontWeight: '500',
                      color: isDark ? '#fff' : 'rgba(94, 95, 96, 1)',
                    },
                  ]}>
                  Delete all
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        )}
      </Pressable>
    );
  };

  return (
    <View style={[styles.screen, {backgroundColor: isDark ? '#000' : '#fff'}]}>
      <View
        style={{
          alignItems: 'center',
          width: Width,
          flexDirection: 'row',
          height: Height * 0.1,
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
            styles.bigText,
            {
              fontSize: 20,
              fontWeight: 'bold',
              alignSelf: 'center',
              width: Width * 0.72,
              color: isDark ? '#fff' : 'rgb(0, 0, 0)',
              textAlign: 'center',
            },
          ]}>
          Post History
        </Text>
      </View>

      <View
        style={{
          width: Width,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{height: Height * 0.8, flexGrow: 1}}>
          <FlatList
            style={{
              marginTop: '2%',
              padding: 5,
            }}
            data={recentPostList}
            keyExtractor={item => item.id}
            renderItem={render2RectangleList}
          />
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

  blueBotton: {
    backgroundColor: '#00AEEF',
    width: '100%',
    height: 56,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    width: Width,
    height: Height,
  },

  modalContent: {
    borderRadius: 5,
    width: 150,
    backgroundColor: 'white',
    elevation: 2,
  },
  rectangle2: {
    backgroundColor: 'rgb(255, 255, 255)',
    width: Width * 0.9,
    // marginRight: 10,
    height: 120,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    width: Width * 0.74,
    borderColor: 'rgba(94, 95, 96, 1)',
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
