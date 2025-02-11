import {createContext, useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
// let apiURL = 'http://192.168.1.24:8080';
let apiURL = 'https://8b0zr4h5-8080.inc1.devtunnels.ms';


const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [categorydata, setcategorydata] = useState([]);
  const [posts, setposts] = useState([]);

  const [fullCategorydata, setFullCategorydata] = useState([]);
  const [userRole, setUserRole] = useState('buyer');

  const [recentPosts, setrecentPosts] = useState([]);
  const [nearbyPosts, setnearbyPosts] = useState([]);
  const [filteredPosts, setfilteredPosts] = useState([]);

  const [userdata, setUserdata] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isposting, setisposting] = useState(false);

  useEffect(() => {
    getDeviceToken();
    // messaging().onMessage(async (remoteMessage) => {
    //   console.log('New foreground message:', remoteMessage);
    //   Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    // });

    // // Background & Quit state notifications
    // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //   console.log('New background message:', remoteMessage);
    // });

    console.log('token', userdata.token);
  }, []);

  const getDeviceToken = async () => {
    try {
      // Request user permission for notifications
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        Alert.alert(
          'Permission Denied',
          'Enable push notifications to receive updates.',
        );
        return;
      }

      // Get the FCM Device Token
      const token = await messaging().getToken();
      if (token) {
        console.log('Device Token:', token);
        return token; // Use this token for sending notifications
      } else {
        console.log('Failed to get device token');
      }
    } catch (error) {
      console.error('Error fetching device token:', error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/api/requirementPost/getCategory`,
        {
          headers: {
            // Authorization: `Bearer ${userdata.token}`,
            Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
          },
        },
      );

      const categories = response.data;
      setFullCategorydata(categories.data);
      const filteredData = categories.data.slice(0, 11);
      const newData = [
        ...filteredData,
        {
          id: 12,
          name: 'See more',
          image: 'https://i.postimg.cc/W1bRGDRM/see-more.png',
        },
      ];
      // console.log('newData130', newData);
      setcategorydata(newData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error', error.response.data.body);
      } else {
        console.log('Error', 'Failed to load categories');
      }
    }
  };

  const getSellerCategories = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/api/seller/category/getCategory`,
        {
          headers: {
            // Authorization: `Bearer ${userdata.token}`,
            Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
          },
        },
      );

      const categories = response.data;
      // setFullCategorydata(categories.data);
      // const filteredData = categories.data.slice(0, 11);
      // const newData = [
      //   ...filteredData,
      //   {
      //     id: 12,
      //     name: 'See more',
      //     image: 'https://i.postimg.cc/W1bRGDRM/see-more.png',
      //   },
      // ];
      // console.log('newData130', newData);
      setcategorydata(categories.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error', error.response.data.body);
      } else {
        console.log('Error', 'Failed to load categories');
      }
    }
  };

  const getPosts = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/post/get`, {
        headers: {
          // Authorization: `Bearer ${userdata.token}`,
          Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzc3OWFlOTMxNTNlNDAxNmM1ZWNhYTIiLCJyb2xlIjoic2VsbGVyIiwicm9sZUlkIjoxLCJpYXQiOjE3MzU5NjczNDh9.-zeNvyQJa0D5I1WXTczx1X4k70ht2bINI6nZBNbMW9M'}`,
        },
      });

      const Posts = response.data;

      // console.log('Posts', Posts);
      setposts(Posts.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error', error.response.data.body);
      } else {
        console.log('Error', 'Failed to load categories');
      }
    }
  };

  const getRecentPosts = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/buyer/post/recentPosts`, {
        headers: {
          // Authorization: `Bearer ${userdata.token}`,
          Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
        },
      });

      const RecentPosts = response.data.data;
      setrecentPosts(RecentPosts);
      // console.log('newData38', response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error', error.response.data.body);
      } else {
        console.log('Error', 'Failed to load categories');
      }
    }
  };

  const getNearbyPosts = async () => {
    try {
      const payload = {
        startDistance: '',
        endDistance: '33',
        latitude: '40.758896',
        longitude: '-73.985130',
        rating: 2,
        topRated: true, // true, false
        key: '',
        categories: [
          // "Rentals"
        ],
        myPost: false, // true, false
        userId: '',
      };

      const headers = {
        Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
      };

      const response = await axios.post(
        `${apiURL}/api/buyer/post/allPosts`,
        payload,
        {headers},
      );

      // console.log('Response:', response.data.data);

      const NearbyPosts = response.data.data;
      setnearbyPosts(NearbyPosts);
      // console.log('NearbyPosts:', NearbyPosts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.log('Error 107', error.response?.data || 'No error response');
      } else {
        console.log('Error 109', 'Failed to load categories');
      }
    }
  };

  const getFilteredPosts = async categories => {
    try {
      const payload = {
        distance: 5,
        rating: '',
        topRated: '',
        key: '',
        categories: categories,
        myPost: false, // true, false
        userId: '',
      };

      const headers = {
        Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
      };

      const response = await axios.post(
        `${apiURL}/api/buyer/post/allPosts`,
        payload,
        {headers},
      );

      // console.log('Response:', response.data.data);

      const FilteredPosts = response.data.data;
      setfilteredPosts(FilteredPosts);
      // console.log('FilteredPosts:', FilteredPosts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.log('Error 107', error.response?.data || 'No error response');
      } else {
        console.log('Error 109', 'Failed to load categories');
      }
    }
  };

  const createPost = async (
    selectedCategories,
    description,
    phone,
    email,
    location,
    media,
  ) => {
    try {
      const payload = {
        categories: selectedCategories,
        images: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
        ],
        description: description,
        contactNumber: phone,
        contactEmail: email,
        location: '',
        latitude: location.latitude,
        longitude: location.longitude,
        locationUrl: 'https://maps.google.com/?q=New+York',
        // categories: ['Electronics', 'Smartphones'],
        // images: [
        //   'https://example.com/image1.jpg',
        //   'https://example.com/image2.jpg',
        // ],
        // description:
        //   'Looking for a smartphone with good battery life and under $500.',
        // contactNumber: '1234567890',
        // contactEmail: 'buyer@example.com',
        // location: 'New York, NY',
        // latitude: '',
        // longitude: '',
        // locationUrl: 'https://maps.google.com/?q=New+York',
      };

      const headers = {
        Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
      };

      const response = await axios.post(
        `${apiURL}/api/requirementPost/postRequirement`,
        payload,
        {headers},
      );

      console.log('Response 171:', response.data);
      Alert.alert('Success', 'Post created successfully!');
      navigation.navigate('BottomTabs');
      // console.log('NearbyPosts:', NearbyPosts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.log('Error 107', error.response?.data || 'No error response');
      } else {
        console.log('Error 109', 'Failed to load categories');
      }
    }
  };

  const updateUserData = async () => {
    try {
      const response = await api.get(`api/users/${user.email}`);
      const userData = response.data;
      setUserdata(userData);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleRegister = async (email, password, name) => {
    try {
      const response = await api.post('api/register', {
        email,
        password,
        name,
      });
      const user = response.data;
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error creating and registering new user:', error);
    }
  };

  const handleLogin = async (email, password, username) => {
    try {
      const response = await axios.post(`${apiURL}/api/user/sendOTP`, {
        emailPhone: email,
        password,
        username,
        isAcceptTermConditions: true,
      });
      const user = response.data;

      // navigation.navigate('Home');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.error('Error response:', error.response.data);
        Alert.alert('Error', error.response.data.body);
      } else {
        // console.error('Error logging in:=========', error);
        Alert.alert('Error', 'Invalid email or password.');
      }
    }
  };

  const VerifyOTP = async (email, otp) => {
    try {
      const response = await axios.post(`${apiURL}/api/user/verifyOTP`, {
        emailPhone: email,
        otp,
        fcmToken: '',
      });
      const user = response.data;
      setUserdata(response.data);
      console.log('userdata', response.data.token);

      if (response.data.msg) {
        console.log('Success', 'Verification successful!');
        navigation.navigate('BottomTabs');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response.data.body);
      } else {
        Alert.alert('Error', 'Invalid otp or password.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('api/logout');
      setIsLoggedIn(false);
      console.log('User logged out!');
      // navigation.reset({
      //   index: 0,
      //   routes: [{name: 'Home'}], // Replace 'Login' with your login screen name
      // });
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleResetPassword = async email => {
    try {
      if (!email.trim()) {
        Alert.alert('Error', 'Please provide a valid email address.');
        return;
      }
      await api.post('api/reset-password', {
        email,
      });
      Alert.alert(
        'Reset Email Sent',
        'A password reset email has been sent to your email address.',
      );
    } catch (error) {
      console.error('Error sending password reset email:', error);
      Alert.alert(
        'Error',
        'Failed to send password reset email. Please try again.',
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userdata,
        isLoggedIn,
        setIsLoggedIn,
        handleRegister,
        handleLogin,
        handleLogout,
        updateUserData,
        handleResetPassword,
        VerifyOTP,
        getCategories,
        categorydata,
        getRecentPosts,
        recentPosts,
        getNearbyPosts,
        nearbyPosts,
        fullCategorydata,
        createPost,
        getPosts,
        userRole,
        setUserRole,
        getSellerCategories,
        posts,
        setisposting,
        isposting,
        getFilteredPosts,
        filteredPosts,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthProvider, AuthContext};
