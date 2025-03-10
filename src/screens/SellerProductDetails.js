import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {ThemeContext} from '../context/themeContext';
import Header from '../components/Header';
import {useIsFocused} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

export default function SellerProductDetails({navigation, route}) {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [Data, setData] = useState([]);

  useEffect(() => {
    console.log('data', route.params.item.images);
    setData(route?.params?.item);
  }, [useIsFocused()]);

  const product = {
    id: 1,
    title: 'Samsung Phone',
    location: 'New York, USA ',
    contact: '+1 234 567 890',
    email: 'contact@samsung.com',
    description:
      'Looking for Blue Cotton T-Shirts in bulk? I need high-quality T-shirts in sizes M, L, and XL. Please share the price, delivery options, and other details. Contact me for further requirements.',
    images: [
      require('../assets/sam-phone.png'),
      require('../assets/watch.png'),
      require('../assets/packagedfood.png'),
    ],
  };
  const ImageCarousel = ({images}) => {
    return (
      <View style={{height: 300}}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          snapToInterval={width} // Ensure images snap in place
          decelerationRate="fast"
          snapToAlignment="center"
          renderItem={({item}) => (
            <View
              style={{width, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={{uri: item}}
                style={{
                  width: width * 0.9, // Ensure images are not exceeding screen width
                  height: 300,
                  resizeMode: 'cover',
                  borderRadius: 10,
                }}
              />
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.container, {backgroundColor: isDark ? '#000' : '#fff'}]}>
      <Header header={'Product Details'} />

      {/* Image Scrolling */}
      <View style={styles.carouselContainer}>
        <FlatList
          data={product.images}
          horizontal
          renderItem={({item}) => (
            <View style={styles.imageContainer}>
              <View style={styles.imageContainer}>
                <ImageCarousel images={route.params.item.images} />
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.9} // Make each image snap into place
          decelerationRate="fast" // Make the scroll stop quickly after a user swipes
          snapToAlignment="center" // Ensure the image is centered when snapped
        />
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text
          numberOfLines={2}
          style={[styles.title, {color: isDark ? '#fff' : '#000'}]}>
          {Data.description}
        </Text>
        <Text style={[styles.info, {color: isDark ? '#fff' : '#000'}]}>
          <Ionicons name="location-outline" size={16} /> {Data.location}
        </Text>
        <Text style={[styles.info, {color: isDark ? '#fff' : '#000'}]}>
          <Ionicons name="call-outline" size={16} /> {Data.contactNumber}
        </Text>
        <Text style={[styles.info, {color: isDark ? '#fff' : '#000'}]}>
          <Ionicons name="mail-outline" size={16} /> {Data.contactEmail}
        </Text>
        {/* <Text
          numberOfLines={5}
          style={[
            styles.description,
            {color: isDark ? '#fff' : 'black', fontWeight: 'bold'},
          ]}>
          description :
        </Text>
        <Text
          numberOfLines={5}
          style={[
            styles.description,
            {marginTop: 0, color: isDark ? '#fff' : 'black'},
          ]}>
          {Data.description}
        </Text> */}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${Data?.contactNumber}`)}
          style={[styles.button, {backgroundColor: 'rgba(7, 201, 29, 1)'}]}>
          <Ionicons name="call-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Chatscreen', {item: Data});
          }}
          style={[styles.button, {backgroundColor: 'rgba(15, 92, 246, 1)'}]}>
          <Ionicons name="chatbubble-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>SMS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: 'rgba(33, 150, 243, 1)'}]}>
          <Entypo name="share" size={20} color="#fff" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  carouselContainer: {
    width: width * 0.72,
    height: height * 0.4,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    marginTop: 40,
  },
  imageContainer: {
    height: height * 0.4,
  },
  image: {
    width: width * 0.9,
    height: height * 0.4,
    resizeMode: 'contain',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    marginVertical: 4,
    color: '#555',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
});
