import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Dimensions} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

import {ScrollView} from 'react-native-gesture-handler';

export default function InSubCategory({navigation, route}) {
  const [categoryIcons, setcategoryIcons] = useState([
    {id: 1, title: 'shirt', img: require('../assets/phone.png')},
    {id: 2, title: 'pent', img: require('../assets/Laptop.png')},
    {id: 3, title: 'coat', img: require('../assets/medicine.png')},
  ]);

  const rendersquareList = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          marginBottom: 15,
          alignItems: 'center',
          width: Width * 0.9,
          backgroundColor: 'rgba(249, 249, 249, 1)',
          flexDirection: 'row',
          alignSelf: 'center',
          borderRadius: 10,
          height: Height * 0.08,
          justifyContent: 'flex-start',
        }}
        onPress={() =>
          item.subCategories === null
            ? navigation.navigate('Subcategory', {
                item: item.subCategories,
                isposting: route?.params?.isposting,
                selectedcategory: route?.params?.selectedcategory,
              })
            : route?.params?.isposting
            ? navigation.navigate('postdetails', {
                item: item,
                selectedcategory: route?.params?.selectedcategory,
              })
            : navigation.navigate('shopScreen', {
                item: item,
              })
        }>
        <Text
          style={{
            fontSize: 17,
            marginLeft: 20,
            fontWeight: '600',
            width: Width * 0.74,
          }}>
          {/* {item.name} */}
          {item.title}
        </Text>
        <Entypo
          name="chevron-thin-right"
          size={22}
          color="rgba(94, 95, 96, 1)"
          style={{marginRight: 5}}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
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
          color="rgba(94, 95, 96, 1)"
          style={{marginLeft: 20, padding: 5}}
        />
        <Text
          style={[
            styles.bigText,
            {
              fontSize: 20,
              fontWeight: 'bold',
              alignSelf: 'center',
              marginLeft: '21%',
            },
          ]}>
          Sub Categories
        </Text>
      </View>

      <View
        style={{
          width: Width,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15,
          }}>
          <View style={styles.inputContainer}>
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
              style={styles.searchInput}
              // onChangeText={setText}
              placeholderTextColor={'rgba(94, 95, 96, 1)'}
              placeholder="Search Categories"
              autoCapitalize="none"
              onSubmitEditing={event => handleSearch(event.nativeEvent.text)}
            />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{height: Height * 0.74, flexGrow: 1}}>
          <FlatList
            showsHorizontalScrollIndicator={false} // Hides the horizontal scrollbar
            // data={route.params.item}
            data={categoryIcons}
            keyExtractor={item => item.id.toString()}
            renderItem={rendersquareList}
          />
        </ScrollView>
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
