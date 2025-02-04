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
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ThemeContext} from '../context/themeContext';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function FAQScreen({navigation}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [selectedItemId, setSelectedItemId] = useState(null);

  const [recentPostList, setRecentPostList] = useState([
    {
      id: 1,
      title: 'Lindsey Culhane requested ?',
      img: require('../assets/User-image.png'),
      description:
        'To manage notifications, go to  Settings,  select Notification Settings,  and customize your preferences.',
    },
    {
      id: 2,
      title: 'Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
      description: '9:00 am',
    },
    {
      id: 3,
      title: 'Lindsey Culhane requested a payment of $780.1',
      img: require('../assets/User-image.png'),
      description: '9:00 am',
    },
  ]);

  const toggleDescription = itemId => {
    setSelectedItemId(prevItemId => (prevItemId === itemId ? null : itemId));
  };

  const render2RectangleList = (item, index) => (
    <View
      key={index}
      style={{
        justifyContent: 'flex-start',
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <View style={{marginLeft: 16}}>
        <View
          style={[
            styles.rectangle2,
            {
              flexDirection: 'row',
              backgroundColor: isDark ? '#121212' : '#fff',
            },
          ]}>
          <Text
            onPress={() => toggleDescription(item.id)}
            numberOfLines={1}
            style={[
              styles.recListText,
              {
                fontWeight: 'bold',
                fontSize: 18,
                textAlign: 'left',
                color: isDark ? '#fff' : 'rgba(0, 0, 0, 0.67)',
              },
            ]}>
            {item.title}
          </Text>

          <FontAwesome5
            onPress={() => toggleDescription(item.id)}
            name={selectedItemId === item.id ? 'angle-up' : 'angle-down'}
            size={18}
            color={isDark ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'}
            style={{padding: 5}}
          />
        </View>

        {selectedItemId === item.id && (
          <Text
            numberOfLines={3}
            style={[
              styles.recListText,
              {
                fontWeight: '500',
                fontSize: 15,
                width: Width * 0.9,
                marginLeft: '4%',
                textAlign: 'left',
                color: isDark ? '#fff' : 'rgba(94, 95, 96, 1)',
              },
            ]}>
            {item.description}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View
      style={[styles.screen, {backgroundColor: isDark ? '#121212' : '#fff'}]}>
      <View style={styles.header}>
        <Entypo
          onPress={() => navigation.goBack()}
          name="chevron-thin-left"
          size={20}
          color="rgba(94, 95, 96, 1)"
          style={{marginLeft: 20}}
        />
        <Text style={[styles.headerText, {color: isDark ? '#fff' : '#000'}]}>
          FAQS
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
              borderColor: isDark ? '#333' : '#000',
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
            style={[
              styles.searchInput,
              {
                color: isDark ? '#fff' : '#000',
                backgroundColor: isDark ? '#121212' : '#fff',
              },
            ]}
            // onChangeText={setText}
            placeholderTextColor={'rgba(94, 95, 96, 1)'}
            placeholder="Search for help"
            autoCapitalize="none"
            onSubmitEditing={event => handleSearch(event.nativeEvent.text)}
          />
        </View>
      </View>

      {recentPostList.map((item, index) => render2RectangleList(item, index))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
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
    width: Width * 0.8,
    textAlign: 'center',
  },
  rectangle2: {
    backgroundColor: '#fff',
    width: Width * 0.9,
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
