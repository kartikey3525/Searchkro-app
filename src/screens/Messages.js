import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {ThemeContext} from '../context/themeContext';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function Messages({navigation}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [recentPostList, setRecentPostList] = useState([
    {
      id: 1,
      title: 'Lindsey Culhane requested a payment of $780.1',
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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleLongPress = item => {
    const updatedList = recentPostList.map(listItem =>
      listItem.id === item.id
        ? {...listItem, selected: !listItem.selected}
        : listItem,
    );
    setRecentPostList(updatedList);
    setSelectedItem(item);
    setModalVisible(true);
  };
  const handleDelete = () => {
    const updatedList = recentPostList.filter(
      item => item.id !== selectedItem.id,
    );
    setRecentPostList(updatedList);
    setModalVisible(false);
  };

  const render2RectangleList = (item, index) => (
    <Pressable
      onPress={() => navigation.navigate('Chatscreen', {item: item})}
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
          source={item.img}
          style={{
            width: 66,
            height: 66,
            marginRight: 20,
          }}
          resizeMode="contain"
        />
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
            {item.title}
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
            {item.status}
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
            }}></View>
        </View>
        <Feather
          name="camera"
          size={24}
          color={isDark ? '#fff' : 'rgba(75, 77, 77, 0.44)'}
        />
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.screen, {backgroundColor: isDark ? '#000' : '#fff'}]}>
      <View style={styles.header}>
        <Entypo
          onPress={() => navigation.goBack()}
          name="chevron-thin-left"
          size={20}
          color={isDark ? '#fff' : 'rgba(94, 95, 96, 1)'}
          style={{marginLeft: 20}}
        />
        <Text style={[styles.headerText, {color: isDark ? '#fff' : '#000'}]}>
          New message
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 15,
        }}>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDark ? '#121212' : '#fff',
              borderColor: isDark ? '#ccc' : 'rgba(0, 0, 0, 0.1)',
            },
          ]}>
          <Image
            source={require('../assets/search-icon.png')}
            style={{
              width: 20,
              height: 20,
              alignSelf: 'center',
              left: 10,
            }}
            resizeMode="contain"
          />
          <TextInput
            // value={'text'}
            style={[styles.searchInput, {color: isDark ? '#fff' : '#000'}]}
            // onChangeText={setText}
            placeholderTextColor={isDark ? '#fff' : 'rgba(94, 95, 96, 1)'}
            placeholder="Search"
            autoCapitalize="none"
            onSubmitEditing={event => handleSearch(event.nativeEvent.text)}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {recentPostList.map((item, index) => render2RectangleList(item, index))}
      </ScrollView>
      {/* Confirmation Modal */}
      {/* <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: isDark ? '#121212' : '#fff'},
            ]}>
            <Text
              style={[
                styles.modalText,
                {
                  fontWeight: 'bold',
                  marginBottom: 10,
                  color: isDark ? '#fff' : '#000',
                },
              ]}>
              Delete ?
            </Text>
            <Text style={[styles.modalText, {color: isDark ? '#fff' : '#000'}]}>
              Are you sure want Delete?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false), handleLongPress();
                }}
                style={styles.cancelButton}>
                <Text style={[styles.buttonText, {color: 'black'}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
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
