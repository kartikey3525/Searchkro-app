import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import {ThemeContext} from '../context/themeContext';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import {AuthContext} from '../context/authcontext';
import {useIsFocused} from '@react-navigation/native';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function Messages({navigation, route}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const {
    getFilteredPosts,
    filteredPosts,
    getUserData,
    Userfulldata,
    getBuyersList,
    userRole,
    buyerList,
  } = useContext(AuthContext);
  const [filteredLists, setFilteredLists] = useState(
    userRole === 'buyer' ? filteredPosts : buyerList,
  );

  const isFocused = useIsFocused(); // ✅ Get boolean value

  useEffect(() => {
    if (isFocused) {
      // ✅ Use the boolean value
      getUserData();

      userRole === 'buyer' ? getFilteredPosts() : getBuyersList();
    }
    //  console.log('first', buyerList[0].isOnline);
  }, [isFocused]); // ✅ Correct dependency

  useEffect(() => {
    if (userRole === 'buyer') {
      setFilteredLists(filteredPosts.length > 0 ? filteredPosts : []);
    } else {
      setFilteredLists(buyerList.length > 0 ? buyerList : []);
    }
  }, [filteredPosts, buyerList, userRole]);

  const [recentPostList, setRecentPostList] = useState([
    {
      id: 1,
      title: 'aindsey Culhane requested a payment of $780.2',
      img: require('../assets/User-image.png'),
      time: '9:00 am',
      status: 'Active',
    },
    {
      id: 2,
      title: 'Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
      status: 'Active',
      time: '9:00 am',
    },
    {
      id: 3,
      title: 'Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
      status: 'Active',
      time: '9:00 am',
    },
    {
      id: 4,
      title: 'Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
      status: 'Active',
      time: '9:00 am',
    },
    {
      id: 5,
      title: 'Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
      status: 'Active',
      time: '9:00 am',
    },
    {
      id: 6,
      title: 'Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
      status: 'Active',
      time: '9:00 am',
    },
    {
      id: 7,
      title: 'Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
      status: 'Active',
      time: '9:00 am',
    },
    {
      id: 8,
      title: 'Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
      status: 'Active',
      time: '9:00 am',
    },
    {
      id: 9,
      title: 'Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
      status: 'Active',
      time: '9:00 am',
    },
    {
      id: 10,
      title: 'Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
      status: 'Active',
      time: '9:00 am',
    },
  ]);

  const render2RectangleList = (item, index) => (
    <Pressable
      onPress={() =>
        navigation.navigate('Chatscreen', {
          item: item,
          userId: Userfulldata._id,
        })
      }
      key={index}
      style={{
        justifyContent: 'center',
        marginBottom: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: isDark ? '#ccc' : 'rgba(0, 0, 0, 0.1)',
      }}>
      <View
        style={[
          styles.rectangle2,
          {
            flexDirection: 'row',
            backgroundColor: isDark ? '#000' : '#fff',
          },
        ]}>
        <Image
          // source={recentPostList[0].img}
          source={{uri: item.profile[0]}}
          style={{
            width: 66,
            height: 66,
            marginRight: 20,
            borderRadius: 50,
          }}
          resizeMode="contain"
        />

        {item.isOnline ? (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 10,
              position: 'absolute',
              left: 60,
              bottom: 0,
              marginBottom: 10,
              backgroundColor: 'rgba(75, 203, 27, 1)',
            }}></View>
        ) : null}
        <View style={{flex: 1}}>
          <Text
            numberOfLines={1}
            style={[
              styles.recListText,
              {
                fontWeight: 'bold',
                fontSize: 16,
                width: 180,
                color: isDark ? '#fff' : '#000',
              },
            ]}>
            {item?.name.charAt(0).toUpperCase() + item.name.slice(1)}
          </Text>
          <Text
            numberOfLines={2}
            style={[
              styles.recListText,
              {
                color: 'rgba(0, 0, 0, 0.37)',
                fontWeight: '500',
                fontSize: 14,
                width: 180,
                marginTop: 5,
                color: isDark ? '#fff' : '#1d1e20',
              },
            ]}>
            {item.isOnline ? 'Active' : 'offline'}
          </Text>
          {/* <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 10,
              position: 'absolute',
              right: 25,
              bottom: 0,
              marginBottom: 15,
              backgroundColor: 'rgba(6, 196, 217, 1)',
            }}></View> */}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.screen, {backgroundColor: isDark ? '#000' : '#fff'}]}>
      <Header header={'New message'} />
      <View style={{padding: 10}}>
        <SearchBar
          placeholder={'Search '}
          lists={userRole === 'buyer' ? filteredPosts : buyerList}
          setFilteredLists={setFilteredLists}
          searchKey="name"
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredLists.map((item, index) => render2RectangleList(item, index))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    margin: 5,
    marginLeft: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Height * 0.1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '26%',
  },
  rectangle2: {
    backgroundColor: '#fff',
    width: Width * 0.95,
    height: 80,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  recListText: {
    color: '#1d1e20',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.36)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: '12%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'rgba(217, 217, 217, 1)',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
  },
  deleteButton: {
    backgroundColor: 'rgba(6, 196, 217, 1)',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 18,
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