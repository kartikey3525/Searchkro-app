import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function WelcomeScreen({}) {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.screen}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          left: 30,
        }}
        onPress={() => navigation.navigate('commonscreen')}>
        <Text
          style={[
            styles.smallText,
            {
              color: '#00AEEF',
              width: 30,
              top: 60,
              alignSelf: 'center',
              position: 'absolute',
              right: 95,
            },
          ]}>
          Skip
        </Text>
        <Image
          source={require('../assets/Back-Container.png')}
          style={{
            width: 160,
            height: 150,
            // backgroundColor: '#00AEEF',
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Image
        source={require('../assets/box-image.png')}
        style={{
          width: 353,
          // height: 353,
          height: Height * 0.38,
        }}
        resizeMode="contain"
      />

      <View style={{justifyContent: 'center'}}>
        <Image
          source={require('../assets/welcome-rectangle.png')}
          style={{width: Width * 0.99, height: Height * 0.5, marginTop: -40}}
          resizeMode="contain"
        />

        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            alignSelf: 'center',

            width: 300,
          }}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: '#00AEEF',
                width: 10,
                height: 10,
                borderRadius: 100,
                margin: 2,
              }}
            />
            <View
              style={{
                backgroundColor: '#9DA49E1A',
                width: 10,
                height: 10,
                borderRadius: 100,
                margin: 2,
              }}
            />
          </View>

          <Text style={styles.bigText}>"Style Starts Here!"</Text>
          <Text style={styles.smallText}>
            Shop the latest trends, exclusive collections, and timeless fashion.
          </Text>

          <TouchableOpacity
            style={styles.blueBotton}
            onPress={() => navigation.navigate('Welcome2')}>
            <AntDesign name="arrowright" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen: {
    width: Width,
    height: Height,
    backgroundColor: '#F2FCF8',
  },
  smallText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1D1E20',
    textAlign: 'center',
    width: 250,
    fontFamily: 'NunitoSans-VariableFont_YTLC,opsz,wdth,wght',
  },

  bigText: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
    marginTop: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
  },
  blueBotton: {
    backgroundColor: '#00AEEF',
    width: 56,
    height: 56,
    borderRadius: 100,
    margin: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
