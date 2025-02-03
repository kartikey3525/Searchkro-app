import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useContext} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Dimensions} from 'react-native';
import {AuthContext} from '../context/authcontext';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default function CommonScreen({navigation}) {
  const {userRole, setUserRole} = useContext(AuthContext);

  return (
    <ScrollView style={styles.screen}>
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          alignSelf: 'center',
          width: 300,
        }}>
        <Text style={styles.bigText}>Choose your role in the trade</Text>
        <Text style={styles.smallText}>
          Filling your invoice details and getting finance for it, is just a few
          steps away.
        </Text>

        <TouchableOpacity
          style={[
            styles.recitem,
            {
              borderColor:
                userRole === 'buyer'
                  ? 'rgba(6, 196, 217, 1)'
                  : 'rgb(255, 255, 255)',
            },
          ]}
          onPress={() => setUserRole('buyer')}>
          <View
            style={{
              width: Width * 0.12,
              marginLeft: 20,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(6, 196, 217, 1)',
              borderRadius: 10,
            }}>
            <FontAwesome5
              name="shopping-bag"
              size={22}
              color="rgba(255, 255, 255, 1)"
              style={{}}
            />
          </View>
          <View style={{marginLeft: 20, width: Width * 0.6}}>
            <Text style={{fontWeight: 'bold'}}>BUYER</Text>
            <Text style={{fontSize: 13}}>I want to request a product.</Text>
          </View>
          <Entypo
            name="chevron-thin-right"
            size={16}
            color="rgba(94, 95, 96, 1)"
            style={{}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.recitem,
            {
              borderColor:
                userRole === 'seller'
                  ? 'rgba(6, 196, 217, 1)'
                  : 'rgb(255, 255, 255)',
            },
          ]}
          onPress={() => setUserRole('seller')}>
          <View
            style={{
              width: Width * 0.12,
              marginLeft: 20,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(6, 196, 217, 1)',
              borderRadius: 10,
            }}>
            <FontAwesome5
              name="tag"
              size={22}
              color="rgba(255, 255, 255, 1)"
              style={{marginLeft: 2}}
            />
          </View>
          <View style={{marginLeft: 20, width: Width * 0.6}}>
            <Text style={{fontWeight: 'bold'}}>SELLER</Text>
            <Text style={{fontSize: 13}}>I have products to sell</Text>
          </View>
          <Entypo
            name="chevron-thin-right"
            size={16}
            color="rgba(94, 95, 96, 1)"
            style={{}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.blueBotton}
          onPress={() => navigation.navigate('Login')}>
          <Text
            style={[
              {
                color: '#fff',
                fontSize: 20,
                marginBottom: 0,
              },
            ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2FCF8',
  },
  recitem: {
    flexDirection: 'row',
    width: Width * 0.9,
    height: Height * 0.1,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(6, 196, 217, 1)',
  },
  smallText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 1)',
    textAlign: 'left',
    width: Width * 0.79,
    fontFamily: 'NunitoSans-VariableFont_YTLC,opsz,wdth,wght',
  },

  bigText: {
    fontSize: 26,
    color: 'black',
    textAlign: 'center',
    marginTop: Height * 0.1,
    fontWeight: 'bold',
    marginBottom: 2,
    width: Width * 0.98,
    fontFamily: 'Poppins-Bold',
  },
  blueBotton: {
    backgroundColor: '#00AEEF',
    width: Width * 0.9,
    height: Height * 0.07,
    borderRadius: 10,
    margin: 10,
    marginTop: Height * 0.4,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
