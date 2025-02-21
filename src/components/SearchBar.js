import React, { useContext, useState } from 'react';
import { View, TextInput, Image, StyleSheet, Dimensions } from 'react-native';
import { ThemeContext } from '../context/themeContext';

const Width = Dimensions.get('window').width;

const SearchBar = ({ placeholder, lists = [], setFilteredLists, searchKey }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [searchText, setSearchText] = useState('');

const searchFilterFunction = (text) => {
  setSearchText(text);

  if (typeof setFilteredLists !== 'function') {
    console.error('setFilteredLists is not a function. Check parent component.');
    return;
  }

  if (!Array.isArray(lists)) {
    console.error('lists is not an array:', lists);
    return;
  }

  if (text.trim() === '') {
    setFilteredLists(lists);
    return;
  }

  const lowerCaseText = text.toLowerCase();

  const filteredResults = lists.filter(item =>
    item?.[searchKey]?.toLowerCase().includes(lowerCaseText)
  );

  setFilteredLists(filteredResults);
};


  return (
    <View style={styles.container}>
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
          style={styles.icon}
          resizeMode="contain"
        />
        <TextInput
          style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
          placeholderTextColor={'rgba(94, 95, 96, 1)'}
          placeholder={placeholder}
          autoCapitalize="none"
          onChangeText={searchFilterFunction}
          autoCorrect={false}
          value={searchText}
        />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    height: 45,
    padding: 1,
  },
  icon: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    left: 10,
  },
  searchInput: {
    width: Width * 0.85,
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: '500',
    height: 45,
    left: 16,
  },
});
