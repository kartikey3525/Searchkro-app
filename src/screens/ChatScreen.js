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
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  const [socketReady, setSocketReady] = useState(false);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const flatListRef = useRef(null);

  const toggleModal = id => setSelectedItemId(selectedItemId === id ? null : id);

  useEffect(() => {
    if (socket && socket.connected && recipientId) {
      initializeChat(socket);
    }
  }, [socket, recipientId]);

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
      setSocketReady(true);
      initializeChat(newSocket);
      processPendingMessages();
    });

    newSocket.on('connect_error', error =>
      console.error('🚨 Socket connection error:', error.message),
    );

    newSocket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setSocketReady(false);
    });

    newSocket.on('newMessage', newMessage => {
      console.log('📩 New message received:', newMessage);
      setMessages(prevMessages => [...prevMessages, newMessage]); // Append to end
    });

    newSocket.on('isTyping', ({ userId: typingUserId }) => {
      if (typingUserId !== userId) {
        setOtherUserTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setOtherUserTyping(false), 2000);
      }
    });

    newSocket.on('userStoppedTyping', ({ userId: typingUserId }) => {
      if (typingUserId !== userId) setOtherUserTyping(false);
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

    console.log(`🔹 Emitting createChat for users: Sender=${userId}, Recipient=${recipientId}`);
    socket.emit('createChat', { userId: recipientId, userToken }, response => {
      console.log('📩 Received createChat response:', JSON.stringify(response, null, 2));
      if (response?.data?._id) setChatId(response.data._id);
      else console.error('❌ No chatId in response:', response);
      setMessages(response?.msgData?.length ? response.msgData : []);
    });

    socket.once('openChat', response => {
      console.log('📩 Received openChat:', JSON.stringify(response, null, 2));
      if (response?.data?._id) setChatId(response.data._id);
      else console.error('❌ No chatId in response:', response);
      setMessages(response?.msgData?.length ? response.msgData : []);
    });
  };

  const ensureSocketConnection = async () => {
    if (!socket) return false;
    if (socket.connected) return true;
    console.log('🔌 Attempting to reconnect socket...');
    return new Promise(resolve => {
      socket.connect();
      socket.once('connect', () => resolve(true));
      socket.once('connect_error', () => resolve(false));
      setTimeout(() => resolve(false), 5000);
    });
  };

  const pickImage = () => {
    try {
      launchImageLibrary({ mediaType: 'photo' }, response => {
        if (!response.didCancel && response.assets) {
          const selectedImage = response.assets[0].uri;
          setImage(selectedImage);
          sendMessage('', selectedImage);
          console.log('📷 Image selected:', selectedImage);
        }
      });
    } catch (error) {
      console.error('🚨 Error picking image:', error.message);
    }
  };

  const sendMessage = async (msgText = '', imageUrl = '') => {
    if (!socketReady || !socket) {
      console.log('📨 Queuing message due to socket not ready:', { msgText, imageUrl });
      setPendingMessages(prev => [...prev, { msgText, imageUrl }]);
      return;
    }

    const isConnected = await ensureSocketConnection();
    if (!isConnected) {
      console.log('📨 Queuing message due to connection failure:', { msgText, imageUrl });
      setPendingMessages(prev => [...prev, { msgText, imageUrl }]);
      return;
    }

    if (!chatId) {
      console.warn('⏳ Waiting for chatId...');
      setPendingMessages(prev => [...prev, { msgText, imageUrl }]);
      return;
    }

    if (!msgText.trim() && !imageUrl) {
      console.log('⚠️ Nothing to send');
      return;
    }

    try {
      let uploadedImageUrl = '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        uploadedImageUrl = await uploadImage(imageUrl);
        if (!uploadedImageUrl) {
          console.error('❌ Image upload failed');
          setPendingMessages(prev => [...prev, { msgText, imageUrl }]);
          return;
        }
      }

      const messagePayload = {
        chatId,
        msg: msgText.trim(),
        msgType: uploadedImageUrl || imageUrl ? 'image' : 'text',
        thumbnail: uploadedImageUrl || imageUrl || '',
        userToken,
      };
      console.log('📤 Emitting sendMsg:', JSON.stringify(messagePayload, null, 2));

      socket.emit('sendMsg', messagePayload, response => {
        console.log('✅ Server Response:', JSON.stringify(response, null, 2));
        if (response?.error) {
          console.error('❌ Message send failed:', response.error);
          setPendingMessages(prev => [...prev, { msgText, imageUrl }]);
          return;
        }
        if (!response?.savedMessage?._id) {
          console.error('❌ Invalid server response:', response);
          return;
        }
        setMessages(prev => [...prev, response.savedMessage]); // Append to end
      });

      setText('');
      setImage(null);
      setIsTyping(false);
    } catch (error) {
      console.error('🚨 Error in sendMessage:', error.message);
      setPendingMessages(prev => [...prev, { msgText, imageUrl }]);
    }
  };

  const processPendingMessages = async () => {
    if (!socketReady || !socket || !socket.connected || !chatId || !pendingMessages.length) {
      console.log('⏳ Skipping pending messages due to invalid state');
      return;
    }

    console.log('📨 Processing pending messages:', pendingMessages.length);
    const messagesToSend = [...pendingMessages];
    setPendingMessages([]);

    for (const { msgText, imageUrl } of messagesToSend) {
      await sendMessage(msgText, imageUrl);
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

  const handleTyping = text => {
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

  const isMessageRead = message => {
    return message.readBy && message.readBy.some(read => String(read.userId) === String(recipientId));
  };

  // Auto-scroll to bottom when messages update or on initial mount
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false }); // Scroll to bottom (newest message with inverted)
    }
  }, [messages]);

  return (
    <KeyboardAvoidingContainer>
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={[styles.rectangle2, { flexDirection: 'row', backgroundColor: isDark ? '#000' : '#fff', zIndex: 9999 }]}>
          <Entypo onPress={() => navigation.goBack()} name="chevron-thin-left" size={20} color={isDark ? '#fff' : 'rgba(94, 95, 96, 1)'} />
          <Image source={{ uri: item.profile[0] }} style={{ width: 50, height: 50, marginLeft: 10, marginRight: 10, borderRadius: 69 }} resizeMode="contain" />
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={[styles.recListText, { fontWeight: 'bold', fontSize: 15, width: 180, color: isDark ? '#fff' : '#000' }]}>
              {item?.name}
            </Text>
            <Text numberOfLines={2} style={[styles.recListText, { fontWeight: '500', fontSize: 13, width: 180, marginTop: 5, color: item.isOnline ? 'rgba(75, 203, 27, 1)' : '#101010' }]}>
              {item.isOnline ? 'Active' : 'offline'}
            </Text>
          </View>
          <Entypo onPress={() => toggleModal('item.id')} name="dots-three-vertical" size={24} color={isDark ? '#fff' : '#000'} style={{ alignSelf: 'flex-start', marginTop: 10 }} />
          {selectedItemId === 'item.id' && (
            <Pressable style={{ position: 'absolute', alignSelf: 'flex-end', top: 40, right: 30 }} onPress={() => toggleModal('item.id')}>
              <View style={[styles.modalContent, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
                <TouchableOpacity style={{ padding: 4, flexDirection: 'row', alignItems: 'center', marginLeft: 5 }} onPress={() => {}}>
                  <Octicons name="history" size={14} color={isDark ? '#fff' : '#000'} />
                  <Text style={[styles.bigText, { fontSize: 14, marginLeft: 5, fontWeight: '500', color: isDark ? '#fff' : '#000' }]}>View History</Text>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: isDark ? 'grey' : 'lightgrey', width: 120, alignSelf: 'center', borderRadius: 10 }} />
                <TouchableOpacity style={{ padding: 4, flexDirection: 'row', alignItems: 'center', marginLeft: 5 }} onPress={() => {}}>
                  <Entypo name="block" size={16} color={'#f00'} />
                  <Text style={[styles.bigText, { fontSize: 14, marginLeft: 5, fontWeight: '500', color: '#f00' }]}>Block</Text>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: isDark ? 'grey' : 'lightgrey', width: 120, alignSelf: 'center', borderRadius: 10 }} />
                <TouchableOpacity style={{ padding: 4, flexDirection: 'row', alignItems: 'center', marginLeft: 5 }} onPress={() => {}}>
                  <Octicons name="mute" size={16} color={isDark ? '#fff' : '#000'} />
                  <Text style={[styles.bigText, { fontSize: 14, marginLeft: 5, fontWeight: '500', color: isDark ? '#fff' : '#000' }]}>Mute</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          )}
        </View>

        <FlatList
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          data={messages}
          keyExtractor={item => item._id?.toString() || Math.random().toString()}
          renderItem={({ item }) => {
            console.log('🔍 Rendering message:', item);
            const isSentByUser = String(item.senderId) === String(userId);
            const read = isMessageRead(item);

            return (
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: isSentByUser ? 'flex-end' : 'flex-start' }}>
                <View style={[isSentByUser ? styles.senderContainer : styles.receivermessageContainer, isSentByUser ? styles.sentMessage : styles.receivedMessage]}>
                  {item.msg && <Text style={isSentByUser ? styles.sendermessage : styles.message}>{item.msg}</Text>}
                  {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.image} />}
                </View>
                {isSentByUser && (
                  <View style={styles.tickContainer}>
                    {read ? (
                      <>
                        <Ionicons name="checkmark" size={12} color="blue" />
                        <Ionicons name="checkmark" size={12} color="blue" style={styles.doubleTick} />
                      </>
                    ) : (
                      <Ionicons name="checkmark" size={12} color="#888" />
                    )}
                  </View>
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
          <TouchableOpacity onPress={() => sendMessage(text)} style={styles.iconButton}>
            <Feather name="send" size={30} color="#06C4D9" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  rectangle2: { backgroundColor: '#fff', width: Width * 0.95, height: 80, justifyContent: 'flex-start', alignItems: 'center', borderRadius: 10, padding: 10 },
  modalContent: { borderRadius: 5, width: 120, backgroundColor: 'white', elevation: 2 },
  receivermessageContainer: { padding: 8, borderRadius: 10, borderTopLeftRadius: 0, marginVertical: 5, maxWidth: '80%' },
  senderContainer: { padding: 8, borderRadius: 10, borderTopRightRadius: 0, marginVertical: 5, maxWidth: '80%' },
  sentMessage: { backgroundColor: '#06C4D9' },
  receivedMessage: { backgroundColor: '#E0E0E0' },
  message: { fontSize: 16, color: '#000' },
  sendermessage: { fontSize: 16, color: '#fff' },
  image: { width: 150, height: 150, borderRadius: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  input: { flex: 1, fontSize: 16, padding: 10, borderRadius: 10 },
  iconButton: { padding: 5 },
  tickContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft: 5 },
  doubleTick: { marginLeft: -8 },
  recListText: {},
  bigText: {},
});

export default ChatScreen;