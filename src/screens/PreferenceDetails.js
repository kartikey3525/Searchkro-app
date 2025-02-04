import React, {useContext, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
  Modal,
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Rating} from 'react-native-ratings';

import {Dimensions} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {Slider} from '@miblanchard/react-native-slider';
import RatingButtons from '../components/RatingButtons';
import {ThemeContext} from '../context/themeContext';

export default function PreferenceDetails({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState([0, 2]);
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

  const render2RectangleList = ({item, index}) => {
    return (
      <Pressable
        style={{
          justifyContent: 'center',
          marginBottom: 15,
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
          <Image
            source={item.img}
            style={{
              width: '94%',
              height: '50%',
              alignSelf: 'center',
              overflow: 'hidden',
              borderRadius: 10,
              margin: 10,
              marginTop: 12,
            }}
          />

          <View style={{alignSelf: 'flex-start'}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                numberOfLines={2}
                style={[
                  styles.recListText,
                  {
                    fontWeight: 'bold',
                    fontSize: 18,
                    margin: 2,
                    color: isDark
                      ? 'rgba(255, 255, 255, 1)'
                      : 'rgba(29, 30, 32, 1)',
                    marginLeft: 15,
                    width: Width * 0.56,
                  },
                ]}>
                {item.title}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 2,
                }}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.recListText,
                    {
                      fontWeight: 'bold',
                      marginTop: 0,
                      color: isDark
                        ? 'rgba(255, 255, 255, 1)'
                        : 'rgba(29, 30, 32, 1)',
                      fontSize: 13,
                      width: 30,
                    },
                  ]}>
                  4.5
                </Text>
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

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 2,
                marginLeft: 15,
                marginBottom: 3,
              }}>
              <Image
                source={require('../assets/location2.png')}
                style={{
                  width: 15,
                  height: 19,
                }}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.recListText,
                  {
                    marginTop: 0,
                    color: 'rgba(29, 30, 32, 1)',
                    fontWeight: '500',
                    fontSize: 14,
                    width: 300,
                    left: 8,
                    color: isDark
                      ? 'rgba(255, 255, 255, 1)'
                      : 'rgba(29, 30, 32, 1)',
                  },
                ]}>
                dddddddddddddddddddddddddddddddddddddddddddddd
              </Text>
            </View>

            <View
              style={{
                marginBottom: 3,
                alignItems: 'flex-start',
                marginTop: 4,
                marginLeft: 15,
              }}>
              <Text
                numberOfLines={2}
                style={[
                  styles.recListText,
                  {
                    marginTop: 0,
                    color: isDark
                      ? 'rgba(255, 255, 255, 1)'
                      : 'rgba(29, 30, 32, 1)',
                    fontWeight: 'bold',
                    fontSize: 12,
                  },
                ]}>
                Description :
              </Text>
              <Text
                numberOfLines={4}
                style={[
                  styles.recListText,
                  {
                    marginTop: 0,
                    color: isDark
                      ? 'rgba(255, 255, 255, 1)'
                      : 'rgba(29, 30, 32, 1)',
                    fontWeight: '500',
                    fontSize: 12,
                  },
                ]}>
                The MacBook Air is Apple’s lightest and most versatile laptop,
                powered by the next-generation M2 chip. It delivers exceptional
                performance, stunning visuals, and incredible battery life in a
                sleek and portable design.
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const DEFAULT_VALUE = 0;
  function Link(props) {
    return (
      <Text
        {...props}
        accessibilityRole="link"
        style={StyleSheet.compose(styles.link, props.style)}
      />
    );
  }

  const renderAboveThumbComponent = () => {
    return <View style={styles.container}></View>;
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
              textAlign: 'center',
              color: isDark ? '#fff' : 'rgba(94, 95, 96, 1)',
            },
          ]}>
          Preferences
        </Text>
      </View>

      <View
        style={{
          width: Width,
          height: Height * 0.87,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{
            padding: 5,
          }}
          data={recentPostList}
          keyExtractor={item => item.id}
          renderItem={render2RectangleList}
        />
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
  rectangle2: {
    backgroundColor: 'rgb(255, 255, 255)',
    width: Width * 0.9,
    height: 350,
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
