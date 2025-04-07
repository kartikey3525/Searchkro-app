import React, { useState, useEffect, useContext, useRef } from 'react';
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
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import { Dimensions } from 'react-native';
import { ThemeContext } from '../context/themeContext';
import KeyboardAvoidingContainer from '../components/KeyboardAvoided';
import { AuthContext } from '../context/authcontext';

const Width = Dimensions.get('window').width;

const ChatScreen = ({ navigation, route }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const { apiURL, userdata } = useContext(AuthContext);
  const { item } = route.params;
  const userId = userdata._id;
  const recipientId = item._id;
  const userToken = userdata.token;
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [imageSelected, setImageSelected] = useState(false); // New state for image selection
  const typingTimeoutRef = useRef(null);

  const toggleModal = id => setSelectedItemId(selectedItemId === id ? null : id);

  useEffect(() => {
    if (socket && socket.connected && recipientId) {
      initializeChat(socket);
    }
  }, [recipientId]);
  
  useEffect(() => {
    const newSocket = io(`${apiURL}/chat`, {
      transports: ['websocket'],
      extraHeaders: { token: userToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected!');
      setSocket(newSocket);
      initializeChat(newSocket);
    });

    newSocket.on('connect_error', error =>
      console.error('🚨 Socket connection error:', error.message),
    );

    newSocket.on('disconnect', () => console.log('🔌 Socket disconnected'));

    newSocket.off('newMessage');
    newSocket.on('newMessage', newMessage => {
      console.log('📩 New message received:', newMessage);
      setMessages(prevMessages => {
        const updatedMessages = [newMessage, ...prevMessages];
        console.log('🔄 Updated Messages:', updatedMessages);
        return updatedMessages;
      });
    });

    newSocket.on('isTyping', ({ userId: typingUserId }) => {
      if (typingUserId !== userId) {
        setOtherUserTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setOtherUserTyping(false);
        }, 2000);
      }
    });

    newSocket.on('userStoppedTyping', ({ userId: typingUserId }) => {
      if (typingUserId !== userId) {
        setOtherUserTyping(false);
      }
    });

    return () => {
      newSocket.disconnect();
      newSocket.off('newMessage');
      newSocket.off('isTyping');
      newSocket.off('userStoppedTyping');
      clearTimeout(typingTimeoutRef.current);
    };
  }, [apiURL, userToken, userId]);

  const initializeChat = socket => {
    if (!socket || !socket.connected) {
      console.error('❌ Cannot emit createChat. Socket is disconnected!');
      return;
    }

    console.log(
      `🔹 Emitting createChat for users: Sender=${userId}, Recipient=${recipientId}`,
    );

    socket.emit('createChat', { userId: recipientId, userToken }, response => {
      console.log(
        '📩 Received createChat response:',
        JSON.stringify(response, null, 2),
      );

      if (response?.data?._id) {
        setChatId(response.data._id);
      } else {
        console.error('❌ No chatId in response:', response);
      }

      if (response?.msgData?.length) {
        setMessages(response.msgData.reverse());
      } else {
        setMessages([]);
      }
    });

    socket.once('openChat', response => {
      console.log('📩 Received openChat:', JSON.stringify(response, null, 2));

      if (response?.data?._id) {
        setChatId(response.data._id);
      } else {
        console.error('❌ No chatId in response:', response);
      }

      if (response?.msgData?.length) {
        setMessages(response.msgData.reverse());
      }
    });
  };

  const pickImage = () => {
    try {
      launchImageLibrary({ mediaType: 'photo' }, response => {
        if (!response.didCancel && response.assets) {
          const selectedImage = response.assets[0].uri;
          setImage(selectedImage);  // Set the selected image URI
          sendMessage(selectedImage);  // Immediately send the image
          console.log('📷 Image selected:', selectedImage);
        }
      });
    } catch (error) {
      console.error('🚨 Error picking image:', error.message);
    }
  };
  
  const sendMessage = async (imageUri = null) => {
    if (!chatId) {
      console.warn('⏳ Waiting for chatId...');
      return;
    }
  
    if (!socket || !socket.connected) {
      console.error('❌ Cannot send message: Socket is disconnected');
      return;
    }
  
    if (!text.trim() && !imageUri) {
      console.log('⚠️ Nothing to send');
      return;
    }
  
    try {
      let imageUrl = '';
      if (imageUri) {
        imageUrl = await uploadImage(imageUri); // Upload image
        if (!imageUrl) {
          console.error('❌ Image upload failed');
          return;
        }
      }
  
      socket.emit(
        'sendMsg',
        {
          chatId,
          msg: text.trim(),
          msgType: imageUri ? 'image' : 'text',  // Check if message is image or text
          thumbnail: imageUrl || '',  // Image URL if available
          userToken,
        },
        response => {
          console.log('✅ Server Response:', response);
  
          if (response?.error) {
            console.error('❌ Message send failed:', response.error);
            return;
          }
  
          if (!response.savedMessage?._id) {
            console.error('❌ No valid server response');
            return;
          }
  
          setMessages(prev => [response.savedMessage, ...prev]);
        },
      );
  
      setText('');  // Clear text input after sending message
      setImage(null);  // Clear the selected image
      setIsTyping(false);  // Reset typing indicator
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
 

  const handleTyping = (text) => {
    setText(text);
    
    if (!socket || !socket.connected) return;

    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      socket.emit('typing', { chatId, userId, userToken });
    } else if (text.length === 0 && isTyping) {
      setIsTyping(false);
      socket.emit('stopTyping', { chatId, userId, userToken });
    }
  };

  return (
    <KeyboardAvoidingContainer>
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View
          style={[
            styles.rectangle2,
            {
              flexDirection: 'row',
              backgroundColor: isDark ? '#000' : '#fff',
              zIndex: 9999,
            },
          ]}>
          <Entypo
            onPress={() => navigation.goBack()}
            name="chevron-thin-left"
            size={20}
            color={isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(94, 95, 96, 1)'}
          />
          <Image
            source={{ uri: item.profile[0] }}
            style={{ width: 50, height: 50, marginLeft: 10, marginRight: 10, borderRadius: 69 }}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }}>
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
              {item?.name}
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
                  color: item.isOnline ? 'rgba(75, 203, 27, 1)' : 'rgb(16, 16, 16)',
                },
              ]}>
              {item.isOnline ? 'Active' : 'offline'}
            </Text>
          </View>
          <Entypo
            onPress={() => toggleModal('item.id')}
            name="dots-three-vertical"
            size={24}
            color={isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)'}
            style={{ alignSelf: 'flex-start', marginTop: 10 }}
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
                  { backgroundColor: isDark ? '#121212' : '#fff' },
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
                    color={isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)'}
                  />
                  <Text
                    style={[
                      styles.bigText,
                      {
                        fontSize: 14,
                        marginLeft: 5,
                        fontWeight: '500',
                        color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
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
                    color={'rgb(255, 0, 0)'}
                  />
                  <Text
                    style={[
                      styles.bigText,
                      {
                        fontSize: 14,
                        marginLeft: 5,
                        fontWeight: '500',
                        color:'rgb(255, 0, 0)',
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
                    color={isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)'}
                  />
                  <Text
                    style={[
                      styles.bigText,
                      {
                        fontSize: 14,
                        marginLeft: 5,
                        fontWeight: '500',
                        color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgb(0, 0, 0)',
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
          showsVerticalScrollIndicator={false}
          data={messages}
          keyExtractor={item => item._id?.toString() || Math.random().toString()}
          inverted
          renderItem={({ item }) => {
            console.log('🔍 Rendering message:', item);
            const isSentByUser = String(item.senderId) === String(userId);

            return (
              <View
                style={[
                  isSentByUser ? styles.senderContainer : styles.receivermessageContainer,
                  isSentByUser ? styles.sentMessage : styles.receivedMessage,
                ]}>
                {item.msg && (
                  <Text style={isSentByUser ? styles.sendermessage : styles.message}>
                    {item.msg}
                  </Text>
                )}
                {item.thumbnail && (
                  <Image source={{ uri: item.thumbnail }} style={styles.image} />
                )}
              </View>
            );
          }}
        />

        <View style={[styles.inputContainer, { backgroundColor: isDark ? '#000' : '#fff' }]}>
          <TextInput
            style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
            value={text}
            onChangeText={handleTyping}
            placeholder="Type a message..."
            placeholderTextColor={isDark ? '#888' : '#888'}
          />
          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <MaterialIcons name="image" size={30} color={isDark ? '#fff' : '#888'} />
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
  container: { flex: 1, padding: 10 },
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
  receivermessageContainer: {
    padding: 10,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    marginVertical: 5,
    maxWidth: '80%',
  },
  senderContainer: {
    padding: 10,
    borderRadius: 10,
    borderTopRightRadius: 0,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sentMessage: { backgroundColor: '#06C4D9', alignSelf: 'flex-end' },
  receivedMessage: { backgroundColor: '#E0E0E0', alignSelf: 'flex-start' },
  message: { fontSize: 16, color: '#000' },
  sendermessage: { fontSize: 16, color: '#fff' },
  image: { width: 150, height: 150, borderRadius: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  input: { flex: 1, fontSize: 16, padding: 10, borderRadius: 10 },
  iconButton: { padding: 5 },
  typingIndicator: {
    padding: 5,
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  imageSelectedContainer: {
    padding: 5,
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
  },
  imageSelectedText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  recListText: {},
  bigText: {},
});

export default ChatScreen;