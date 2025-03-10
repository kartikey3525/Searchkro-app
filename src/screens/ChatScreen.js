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
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import {Dimensions} from 'react-native';
import {ThemeContext} from '../context/themeContext';
import KeyboardAvoidingContainer from '../components/KeyboardAvoided';
import {AuthContext} from '../context/authcontext';

const Width = Dimensions.get('window').width;

const ChatScreen = ({navigation, route}) => {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const {apiURL, userdata} = useContext(AuthContext);
  const {item} = route.params;
  const userId = userdata._id; // Use logged-in user's ID
  const recipientId = item._id; // The other user in the chat
  const userToken = userdata.token;
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [socket, setSocket] = useState(null);

  const toggleModal = id =>
    setSelectedItemId(selectedItemId === id ? null : id);

  useEffect(() => {
    console.log('item', item);
    const newSocket = io(`${apiURL}/chat`, {
      transports: ['websocket'],
      extraHeaders: {token: userToken},
    });

    newSocket.on('connect', () => console.log('✅ Socket connected!'));
    newSocket.on('connect_error', error =>
      console.error('🚨 Socket connection error:', error.message),
    );
    newSocket.on('disconnect', () => console.log('🔌 Socket disconnected'));

    setSocket(newSocket);
    initializeChat(newSocket);

    return () => {
      newSocket.disconnect();
      newSocket.off('connect');
      newSocket.off('connect_error');
      newSocket.off('disconnect');
      newSocket.off('chatCreated');
      newSocket.off('openChat');
    };
  }, [apiURL, userToken, userId]);

  const initializeChat = async socket => {
    try {
      console.log(
        `🔹 Emitting createChat for user: ${userId} with token: ${userToken}`,
      );
      socket.emit('createChat', {userId, userToken});

      socket.on('chatCreated', response => {
        console.log('✅ Chat Created Response:', response);
        if (response?.error) {
          console.error('❌ Chat creation failed:', response.error);
          return;
        }
        if (response?.data?._id) {
          console.log(`✅ Chat ID set: ${response.data._id}`);
          setChatId(response.data._id);
        } else {
          console.error('❌ No chatId in response:', response);
        }
      });

      socket.on('openChat', newMessage => {
        console.log('📩 Received openChat:', newMessage);
        if (!newMessage?.msgData || !Array.isArray(newMessage.msgData)) {
          console.error('❌ Invalid message data:', newMessage);
          return;
        }

        const receivedMsgs = newMessage.msgData.map(msg => ({
          _id: msg._id || Math.random().toString(),
          text: msg.msg || '',
          senderId: msg.senderId,
          chatId: newMessage.data?._id,
          image: msg.image || '',
          date: msg.date || new Date().toISOString(),
        }));
        setMessages(prev => [...receivedMsgs, ...prev]);
        setChatId(newMessage.data._id);
      });
    } catch (error) {
      console.error('🚨 Error in initializeChat:', error.message);
    }
  };

  useEffect(() => {
    if (chatId && socket) fetchMessages(chatId);
  }, [chatId, socket]);

  const fetchMessages = async chatId => {
    try {
      const response = await fetch(`${apiURL}/api/chat/${chatId}/messages`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('❌ Fetch messages failed:', response.status);
        return;
      }

      const data = await response.json();
      console.log('📥 Fetched messages:', data);
      setMessages(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (error) {
      console.error('❌ Fetch error:', error.message);
    }
  };

  const sendMessage = async () => {
    if (!chatId || !socket) {
      console.error('❌ Cannot send message: chatId or socket missing');
      return;
    }
    if (!text.trim() && !image) {
      console.log('⚠️ Nothing to send');
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImage(image);
        if (!imageUrl) {
          console.error('❌ Image upload failed');
          return;
        }
      }

      const newMessage = {
        text: text.trim(),
        image: imageUrl,
        senderId: userId,
        chatId,
        date: new Date().toISOString(),
        _id: Math.random().toString(),
      };

      console.log('📤 Sending message:', newMessage);

      setMessages(prev => [newMessage, ...prev]);
      setText('');
      setImage(null);

      socket.emit('sendMsg', {...newMessage, userToken}, response => {
        console.log('✅ Server Response:', response);
        if (response?.error) {
          console.error('❌ Message send failed:', response.error);
          setMessages(prev => prev.filter(msg => msg._id !== newMessage._id));
          return;
        }
        const savedMessage = {
          _id: response.savedMessage?._id || newMessage._id,
          text: response.savedMessage?.msg || newMessage.text,
          image: response.savedMessage?.image || newMessage.image,
          senderId: response.savedMessage?.senderId || newMessage.senderId,
          chatId: response.savedMessage?.chatId || newMessage.chatId,
          date: response.savedMessage?.date || newMessage.date,
        };
        console.log('🔄 Updating with saved message:', savedMessage);
        setMessages(prev => [
          savedMessage,
          ...prev.filter(msg => msg._id !== newMessage._id),
        ]);
      });
    } catch (error) {
      console.error('🚨 Error sending message:', error.message);
    }
  };

  const uploadImage = async uri => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        name: `photo_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });

      const response = await fetch(`${apiURL}/api/user/uploadImage`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data?.data?.[0]) {
        console.log('✅ Image uploaded:', data.data[0]);
        return data.data[0];
      }
      console.error('❌ Image upload failed:', data);
      return null;
    } catch (error) {
      console.error('🚨 Image upload error:', error.message);
      return null;
    }
  };

  const pickImage = () => {
    try {
      launchImageLibrary({mediaType: 'photo'}, response => {
        if (!response.didCancel && response.assets) {
          setImage(response.assets[0].uri);
        }
      });
    } catch (error) {
      console.error('🚨 Error picking image:', error.message);
    }
  };

  return (
    <KeyboardAvoidingContainer>
      <View
        style={[styles.container, {backgroundColor: isDark ? '#000' : '#fff'}]}>
        <View
          style={[
            styles.rectangle2,
            {flexDirection: 'row', backgroundColor: isDark ? '#000' : '#fff'},
          ]}>
          <Entypo
            onPress={() => navigation.goBack()}
            name="chevron-thin-left"
            size={20}
            color={isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(94, 95, 96, 1)'}
          />
          <Image
            // source={require('../assets/User-image.png')}
            source={{uri: item.images[0]}}
            style={{width: 50, height: 50, marginLeft: 10, marginRight: 10}}
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
              {item?.description}
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
            onPress={() => toggleModal('item.id')}
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
              onPress={() => toggleModal('item.id')}>
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
                    name="history"
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
                    name="block"
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
                    name="mute"
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
          keyExtractor={item =>
            item._id?.toString() || Math.random().toString()
          }
          renderItem={({item}) => {
            console.log('🔍 Rendering message:', {
              userId,
              senderId: item.senderId,
            });
            const isSentByUser = item.senderId === userId;
            return (
              <View
                style={[
                  styles.messageContainer,
                  isSentByUser ? styles.sentMessage : styles.receivedMessage,
                ]}>
                {item.text && <Text style={styles.message}>{item.text}</Text>}
                {item.image && (
                  <Image source={{uri: item.image}} style={styles.image} />
                )}
              </View>
            );
          }}
        />

        <View
          style={[
            styles.inputContainer,
            {backgroundColor: isDark ? '#000' : '#fff'},
          ]}>
          <TextInput
            style={[styles.input, {color: isDark ? '#fff' : '#000'}]}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={isDark ? '#888' : '#888'}
          />
          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <MaterialIcons
              name="image"
              size={30}
              color={isDark ? '#fff' : '#888'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={sendMessage} style={styles.iconButton}>
            <Feather name="send" size={30} color="#06C4D9" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingContainer>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},
  rectangle2: {
    backgroundColor: '#fff',
    width: Width * 0.95,
    height: 80,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  modalContent: {
    borderRadius: 5,
    width: 120,
    backgroundColor: 'white',
    elevation: 2,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sentMessage: {backgroundColor: '#06C4D9', alignSelf: 'flex-end'},
  receivedMessage: {backgroundColor: '#E0E0E0', alignSelf: 'flex-start'},
  message: {fontSize: 16, color: '#fff'},
  image: {width: 150, height: 150, borderRadius: 10},
  inputContainer: {flexDirection: 'row', alignItems: 'center', padding: 10},
  input: {flex: 1, fontSize: 16, padding: 10, borderRadius: 10},
  iconButton: {padding: 5},
});

export default ChatScreen;
