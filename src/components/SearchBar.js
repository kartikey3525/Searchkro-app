import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import {ThemeContext} from '../context/themeContext';

import {useIsFocused} from '@react-navigation/native'; 
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const SearchBar = ({navigation, placeholder}) => {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [value, setValue] = React.useState('');
  const [documentData, setDocumentData] = React.useState([]);
  const [arrayholder, setArrayholder] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const searchFilterFunction = async text => {
    setValue(text);
    try {
      const newData = arrayholder.filter(item => {
        if (item.data.toUpperCase().startsWith(text.toUpperCase())) {
          const itemData = `${item.data.toUpperCase()}`;
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        }
      });
      setDocumentData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const renderSeparator = () => {
    return (
      <View
        accessibilityLabel="ProductSearchScreen_View_1"
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  return (
    <>
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
              backgroundColor: isDark ? '#000' : '#fff',
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
            style={[styles.searchInput, {color: isDark ? '#fff' : '#000'}]}
            placeholderTextColor={'rgba(94, 95, 96, 1)'}
            placeholder={placeholder}
            autoCapitalize="none"
            onChangeText={text => searchFilterFunction(text)}
            autoCorrect={false}
            value={value}
            // onSubmitEditing={event => handleSearch(event.nativeEvent.text)}
          />
        </View>
      </View>

      {/* <View style={{flex: 1}}>
        <FlatList accessibilityLabel='ProductSearchScreen_FlatList_1'
            data={documentData}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={renderFooter(loading)}
            renderItem={({item}) => (
              <ListItem
                Divider
                onPress={() => {
                  navigation.navigate('ProductDetails', {item: item});
                }}>
                <ListItem.Content accessibilityLabel='ProductSearchScreen_ListItem.Content_1'>
                  <ListItem.Title accessibilityLabel='ProductSearchScreen_ListItem.Title_1'>{item.data}</ListItem.Title>
                  <ListItem.Subtitle accessibilityLabel='ProductSearchScreen_ListItem.Subtitle_1'>{item.groupName}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron accessibilityLabel='ProductSearchScreen_ListItem.Chevron_1' />
              </ListItem>
            )}
            ItemSeparatorComponent={renderSeparator}
          />
      </View>  */}
    </>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    width: '100%',
  },
  inputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgb(0, 0, 0)',
    borderWidth: 1,
    borderRadius: 14,
    height: 45,
    padding: 1,
  },
  searchInput: {
    width: Width * 0.85,
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: '500',
    color: 'black',
    height: 45,
    left: 16,
  },
});
