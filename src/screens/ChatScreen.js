import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import io from 'socket.io-client';
import {launchImageLibrary} from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import {Dimensions} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {ThemeContext} from '../context/themeContext';

// Replace with your actual backend server URL
const socket = io('http://YOUR_SERVER_IP:5000');

const ChatScreen = ({navigation, route}) => {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const {chatId, userId} = route.params; // Unique chat room ID and user ID
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    socket.emit('joinRoom', {userId, chatId});

    socket.on('receiveMessage', newMessage => {
      setMessages(prevMessages => [newMessage, ...prevMessages]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const toggleModal = id => {
    if (selectedItemId === id) {
      setSelectedItemId(null); // Close modal if the same item is clicked again
    } else {
      setSelectedItemId(id); // Open modal for the clicked item
    }
  };

  const sendMessage = () => {
    if (text.trim() || image) {
      const newMessage = {
        id: Date.now(),
        text,
        image,
        senderId: userId,
      };

      socket.emit('sendMessage', {chatId, ...newMessage});
      setMessages(prevMessages => [newMessage, ...prevMessages]);
      setText('');
      setImage(null);
    }
  };

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && response.assets) {
        setImage(response.assets[0].uri);
      }
    });
  };

  return (
    <View
      style={[styles.container, {backgroundColor: isDark ? '#000' : '#fff'}]}>
      <View
        style={[
          styles.rectangle2,
          {
            flexDirection: 'row',
            backgroundColor: isDark ? '#000' : '#fff',
          },
        ]}>
        <Entypo
          onPress={() => navigation.goBack()}
          name="chevron-thin-left"
          size={20}
          color={isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(94, 95, 96, 1)'}
          style={{}}
        />
        <Image
          source={require('../assets/User-image.png')}
          style={{
            width: 50,
            height: 50,
            marginLeft: 10,
            marginRight: 10,
          }}
          resizeMode="contain"
        />
        <View style={{flex: 1}}>
          <Text
            numberOfLines={1}
            style={[
              styles.recListText,
              {
                fontWeight: 'bold',
                fontSize: 15,
                width: 180,
                color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
              },
            ]}>
            {route?.params ? route?.params?.item.title : 'seller name'}
          </Text>
          <Text
            numberOfLines={2}
            style={[
              styles.recListText,
              {
                fontWeight: '500',
                fontSize: 13,
                width: 180,
                marginTop: 5,
                color: 'rgba(75, 203, 27, 1)',
              },
            ]}>
            Online
          </Text>
        </View>
        <Entypo
          onPress={() => toggleModal('item.id')} // Use toggleModal instead of setModalVisible
          name="dots-three-vertical"
          size={24}
          color={isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)'}
          style={{alignSelf: 'flex-start', marginTop: 10}}
        />
        {selectedItemId === 'item.id' && (
          <Pressable
            style={{
              position: 'absolute',
              alignSelf: 'flex-end',
              top: 40,
              right: 30,
            }}
            onPress={() => toggleModal(item.id)}>
            <View
              style={[
                styles.modalContent,
                {backgroundColor: isDark ? '#121212' : '#fff'},
              ]}>
              <TouchableOpacity
                style={{
                  padding: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 5,
                }}
                onPress={() => {}}>
                <Octicons
                  name={'history'}
                  size={14}
                  color={
                    isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(94, 95, 96, 1)'
                  }
                />
                <Text
                  style={[
                    styles.bigText,
                    {
                      fontSize: 14,
                      marginLeft: 5,
                      fontWeight: '500',
                      color: isDark
                        ? 'rgba(255, 255, 255, 1)'
                        : 'rgba(94, 95, 96, 1)',
                    },
                  ]}>
                  View History
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  height: 1,
                  backgroundColor: isDark ? 'grey' : 'lightgrey',
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
                  marginLeft: 5,
                }}
                onPress={() => {}}>
                <Entypo
                  name={'block'}
                  size={16}
                  color={
                    isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(94, 95, 96, 1)'
                  }
                />
                <Text
                  style={[
                    styles.bigText,
                    {
                      fontSize: 14,
                      marginLeft: 5,
                      fontWeight: '500',
                      color: isDark
                        ? 'rgba(255, 255, 255, 1)'
                        : 'rgba(94, 95, 96, 1)',
                    },
                  ]}>
                  Block
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  height: 1,
                  backgroundColor: isDark ? 'grey' : 'lightgrey',
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
                  marginLeft: 5,
                }}
                onPress={() => {}}>
                <Octicons
                  name={'mute'}
                  size={16}
                  color={
                    isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(94, 95, 96, 1)'
                  }
                />
                <Text
                  style={[
                    styles.bigText,
                    {
                      fontSize: 14,
                      marginLeft: 5,
                      fontWeight: '500',
                      color: isDark
                        ? 'rgba(255, 255, 255, 1)'
                        : 'rgba(94, 95, 96, 1)',
                    },
                  ]}>
                  Mute
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        )}
      </View>

      <FlatList
        data={messages}
        inverted
        keyExtractor={item => item.id.toString()}
        renderItem={({item, index}) => {
          const isLatestMessage =
            index === 0 || messages[index - 1]?.senderId !== item.senderId;

          const isSentByUser = item.senderId === userId;

          return (
            <View
              style={[
                styles.messageRow,
                isSentByUser ? styles.sentRow : styles.receivedRow,
              ]}>
              {/* Show Profile Picture on Left for Received Messages */}
              {!isSentByUser && isLatestMessage && (
                <Image
                  source={require('../assets/user-male.png')}
                  style={styles.profileImage}
                />
              )}

              {/* Message Container */}
              <View
                style={[
                  styles.messageContainer,
                  isSentByUser ? styles.sentMessage : styles.receivedMessage,
                ]}>
                {item.text ? (
                  <Text
                    style={[styles.message, {color: isDark ? '#fff' : '#000'}]}>
                    {item.text}
                  </Text>
                ) : null}
                {item.image && (
                  <Image source={{uri: item.image}} style={styles.image} />
                )}
              </View>

              {/* Show Profile Picture on Right for Sent Messages */}
              {/* {isSentByUser && isLatestMessage && (
                <Image
                  source={require('../assets/User-image.png')}
                  style={styles.profileImage}
                />
              )} */}
            </View>
          );
        }}
      />

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? '#000' : '#fff',
          },
        ]}>
        <TextInput
          style={[styles.input, {color: isDark ? '#fff' : '#000'}]}
          value={text}
          onChangeText={setText}
          placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.51)' : '#000'}
          placeholder="Enter amount or chat"
        />
        <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
          <MaterialIcons
            name="image"
            size={35}
            color={
              isDark ? 'rgba(255, 255, 255, 0.51)' : 'rgba(86, 86, 86, 0.48)'
            }
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
          <Feather
            name="plus-circle"
            size={30}
            color={
              isDark ? 'rgba(255, 255, 255, 0.51)' : 'rgba(86, 86, 86, 0.48)'
            }
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Image
            source={require('../assets/chat-send-B.png')}
            style={{
              width: 20,
              height: 20,
              left: 2,
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  modalContent: {
    borderRadius: 5,
    width: 120,
    backgroundColor: 'white',
    elevation: 2,
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
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    borderBottomRightRadius: 0,
    marginVertical: 5,
    maxWidth: '80%',
  },
  receivedMessageContainer: {
    padding: 10,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: 'rgba(6, 196, 217, 1)',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: 'rgba(6, 196, 217, 0.41)',
    alignSelf: 'flex-start',
  },
  message: {fontSize: 16, color: '#fff'},
  image: {width: 200, height: 200, borderRadius: 10, marginBottom: 5},
  inputContainer: {
    width: Width,
    elevation: 25,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    height: 80,
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
  },
  sendButton: {
    marginLeft: 6,
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(6, 196, 217, 1)',
    borderRadius: 60,
  },
  sendText: {color: '#fff', fontSize: 16},
  iconButton: {padding: 2},

  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  sentRow: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  receivedRow: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  receivedMessageContainer: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  sentMessage: {
    backgroundColor: 'rgba(6, 196, 217, 1)',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: 'rgba(6, 196, 217, 0.41)',
    alignSelf: 'flex-start',
  },
  message: {
    fontSize: 16,
    color: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
});

export default ChatScreen;
