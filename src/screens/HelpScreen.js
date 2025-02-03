import React, {useState} from 'react';
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

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function HelpScreen({navigation}) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Entypo
          onPress={() => navigation.goBack()}
          name="chevron-thin-left"
          size={20}
          color="rgba(94, 95, 96, 1)"
          style={{marginLeft: 20}}
        />
        <Text style={styles.headerText}>Help and Support</Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('faqscreen')}
        style={{
          width: Width * 0.9,
          alignSelf: 'center',
          borderRadius: 10,
          height: '10%',
          margin: 10,
          justifyContent: 'center',
          backgroundColor: 'rgba(223, 223, 223, 0.36)',
        }}>
        <Text style={[styles.headerText, {marginLeft: 20, fontWeight: '500'}]}>
          FAQs
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('chatsupport')}
        style={{
          width: Width * 0.9,
          alignSelf: 'center',
          borderRadius: 10,
          height: '10%',
          margin: 10,

          justifyContent: 'center',
          backgroundColor: 'rgba(223, 223, 223, 0.36)',
        }}>
        <Text style={[styles.headerText, {marginLeft: 20, fontWeight: '500'}]}>
          Chat support
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('reportissue')}
        style={{
          width: Width * 0.9,
          alignSelf: 'center',
          borderRadius: 10,
          margin: 10,
          height: '10%',
          justifyContent: 'center',
          backgroundColor: 'rgba(223, 223, 223, 0.36)',
        }}>
        <Text style={[styles.headerText, {marginLeft: 20, fontWeight: '500'}]}>
          Report a issue
        </Text>
      </TouchableOpacity>
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
    marginLeft: '24%',
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
