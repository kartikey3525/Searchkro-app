import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {Dimensions} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
import {ThemeContext} from '../context/themeContext';

import {ScrollView} from 'react-native-gesture-handler';
import {AuthContext} from '../context/authcontext';

export default function SubCategory({navigation, route}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const {isposting} = useContext(AuthContext);

  const [categoryIcons, setcategoryIcons] = useState([
    {id: 1, title: 'men', img: require('../assets/phone.png')},
    {id: 2, title: 'women', img: require('../assets/Laptop.png')},
    {id: 3, title: 'children', img: require('../assets/medicine.png')},
  ]);

  const rendersquareList = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          marginBottom: 15,
          alignItems: 'center',
          width: Width * 0.9,
          backgroundColor: isDark
            ? 'rgba(26, 26, 26, 1)'
            : 'rgba(249, 249, 249, 1)',
          flexDirection: 'row',
          alignSelf: 'center',
          borderRadius: 10,
          height: Height * 0.08,
          justifyContent: 'flex-start',
        }}
        onPress={() =>
          !isposting
            ? navigation.navigate('Insubcategory', {
                item: item.subCategories,
                selectedcategory: route?.params?.selectedcategory,
              })
            : navigation.navigate('postdetails', {
                item: item,
                selectedcategory: route?.params?.selectedcategory,
              })
        }>
        <Text
          style={{
            fontSize: 17,
            marginLeft: 20,
            fontWeight: '600',
            width: Width * 0.74,
            color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
          }}>
          {item.name}
        </Text>
        <Entypo
          name="chevron-thin-right"
          size={22}
          color={isDark ? 'rgb(255, 255, 255)' : 'rgba(94, 95, 96, 1)'}
          style={{marginRight: 5}}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screen, {backgroundColor: isDark ? '#000' : '#fff'}]}>
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
          color={isDark ? 'rgb(255, 255, 255)' : 'rgba(94, 95, 96, 1)'}
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
              color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
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
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark
                  ? 'rgba(26, 26, 26, 1)'
                  : 'rgb(255, 255, 255)',
                borderColor: isDark ? 'rgba(94, 95, 96, 1)' : 'rgb(0, 0, 0)',
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
            data={route.params.item}
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
