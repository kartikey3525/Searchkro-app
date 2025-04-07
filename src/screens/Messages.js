import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import {ThemeContext} from '../context/themeContext';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import {AuthContext} from '../context/authcontext';
import {useIsFocused} from '@react-navigation/native';
import {io} from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    userdata,
    buyerList,
    apiURL,
  } = useContext(AuthContext);
  const [filteredLists, setFilteredLists] = useState(
    userRole === 'buyer' ? filteredPosts : buyerList,
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getUserData();
      userRole === 'buyer' ? getFilteredPosts() : getBuyersList();
    }
  }, [isFocused]);

  useEffect(() => {
    if (userRole === 'buyer') {
      setFilteredLists(filteredPosts.length > 0 ? filteredPosts : []);
    } else {
      setFilteredLists(buyerList.length > 0 ? buyerList : []);
    }
  }, [filteredPosts, buyerList, userRole]);

  const [chatList, setChatList] = useState([]);
  const socketRef = useRef(null);

  const openWhatsApp = async phoneNumber => {
    try {
      // Remove all non-digit characters
      const cleanedNumber = phoneNumber.replace(/\D/g, '');

      // Check if WhatsApp is installed
      const url = `whatsapp://send?phone=${cleanedNumber}`;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        // If WhatsApp isn't installed, open browser version
        const webUrl = `https://wa.me/${cleanedNumber}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      Alert.alert('Error', 'Could not open WhatsApp');
    }
  };

  const render2RectangleList = (item, index) => (
    <Pressable
      onPress={() => {
        if (item.phone) {
          openWhatsApp(item.phone);
        } else {
          Alert.alert('Error', 'No phone number available for this contact');
        }
      }}
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
          source={{uri: item.profile[0]}}
          style={{
            width: 66,
            height: 66,
            marginRight: 20,
            borderRadius: 66,
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
            }}
          />
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
            {item?.name}
          </Text>
          <Text
            numberOfLines={2}
            style={[
              styles.recListText,
              {
                fontWeight: '500',
                fontSize: 14,
                width: 180,
                marginTop: 5,
                color: isDark ? '#fff' : '#1d1e20',
              },
            ]}>
            {item.isOnline ? 'Active' : 'offline'}
          </Text>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 10,
              position: 'absolute',
              right: 25,
              bottom: 0,
              marginBottom: 15,
              backgroundColor: 'rgba(6, 196, 217, 1)',
            }}
          />
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.screen, {backgroundColor: isDark ? '#000' : '#fff'}]}>
      <Header header={'Messages'} />
      <View style={{padding: 10}}>
        <SearchBar
          placeholder={'Search'}
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
});