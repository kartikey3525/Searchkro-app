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
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ThemeContext} from '../context/themeContext';
import Header from '../components/Header';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function NotificationScreen({navigation}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [recentPostList, setRecentPostList] = useState([
    {
      id: 1,
      title: ' Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
      time: '9:00 am',
    },
    {
      id: 2,
      title: ' Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
      time: '9:00 am',
    },
    {
      id: 3,
      title: ' Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
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
      key={index}
      style={{
        justifyContent: 'center',
        marginBottom: 10,
        alignItems: 'center',
        borderColor: isDark ? '#ccc' : '#fff',
        borderBottomWidth: 1,
      }}
      onLongPress={() => handleLongPress(item)}>
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
        <View style={{flex: 1}}>
          <Text
            numberOfLines={2}
            style={[
              styles.recListText,
              {
                fontWeight: 'bold',
                fontSize: 14,
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
                fontWeight: '500',
                fontSize: 14,
                width: 180,
                marginTop: 5,
                color: isDark ? '#fff' : '#000',
              },
            ]}>
            {item.time}
          </Text>
        </View>
        {item.selected && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color="rgba(6, 196, 217, 1)"
            style={{marginRight: 10}}
          />
        )}
      </View>
    </Pressable>
  );

  return (
    <View
      showsVerticalScrollIndicator={false}
      style={[styles.screen, {backgroundColor: isDark ? '#000' : '#fff'}]}>
      <Header header={'Notifications'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{height: Height * 0.8, flexGrow: 1}}>
        <Text style={[styles.sectionHeader, {color: isDark ? '#fff' : '#000'}]}>
          Today
        </Text>
        {recentPostList.map((item, index) => render2RectangleList(item, index))}

        <Text style={[styles.sectionHeader, {color: isDark ? '#fff' : '#000'}]}>
          Yesterday
        </Text>
        {recentPostList.map((item, index) => render2RectangleList(item, index))}

        <Text style={[styles.sectionHeader, {color: isDark ? '#fff' : '#000'}]}>
          This week
        </Text>
        {recentPostList.map((item, index) => render2RectangleList(item, index))}
      </ScrollView>
      {/* Confirmation Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
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
                  setModalVisible(false), handleLongPress;
                }}
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor: isDark
                      ? 'rgba(51, 51, 51, 1)'
                      : 'rgba(217, 217, 217, 1)',
                  },
                ]}>
                <Text
                  style={[
                    styles.buttonText,
                    {color: isDark ? '#fff' : 'black'},
                  ]}>
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
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  sectionHeader: {
    fontWeight: '400',
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
});
