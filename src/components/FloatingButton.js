import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

const FloatingButton = ({}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    console.log('Floating Button Pressed');
    navigation.navigate('Categories', {isposting: true});
  };

  return (
    <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
      <FontAwesome
        name="plus-square-o"
        size={25}
        color="white"
        style={{top: 1}}
      />
    </TouchableOpacity>
  );
};

export default FloatingButton;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  floatingButton: {
    position: 'absolute',
    bottom: '55%',
    alignSelf: 'center',
    width: 55,
    height: 55,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 174, 239, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 10,
    // borderColor: '#fff',
  },
});
