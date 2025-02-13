import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {ThemeContext} from '../context/themeContext';
import Header from '../components/Header';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function LegalPolicies({navigation}) {
  const {theme} = useContext(ThemeContext); // Get the theme context
  const isDark = theme === 'dark'; // Check if the theme is dark
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={[styles.screen, {backgroundColor: isDark ? '#000' : '#fff'}]}>
      <Header header={'Legal Policies'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, {color: isDark ? '#fff' : '#000'}]}>
          Term:
        </Text>
        <Text
          style={[
            styles.description,
            {color: isDark ? '#b0b0b0' : 'rgba(0, 0, 0, 0.53)'},
          ]}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </Text>

        <Text style={[styles.title, {color: isDark ? '#fff' : '#000'}]}>
          Searchkro Service:
        </Text>
        <Text
          style={[
            styles.description,
            {color: isDark ? '#b0b0b0' : 'rgba(0, 0, 0, 0.53)'},
          ]}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s...
        </Text>

        <Text style={[styles.title, {color: isDark ? '#fff' : '#000'}]}>
          Searchkro Access:
        </Text>
        <Text
          style={[
            styles.description,
            {color: isDark ? '#b0b0b0' : 'rgba(0, 0, 0, 0.53)'},
          ]}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s...
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // Ensures the screen takes the full available height
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
  scrollContent: {
    paddingBottom: 20, // Ensures space at the bottom for better scrolling
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 6,
  },
});
