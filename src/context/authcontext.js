import {createContext, useState, useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Alert, AppState, Linking} from 'react-native';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
// let apiURL = 'http://192.168.1.20:8080';
let apiURL = 'https://service.kartikengitech.info';
// let apiURL = 'https://fgrd857c-8080.inc1.devtunnels.ms';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import LocationPermission from '../hooks/uselocation';
import io from 'socket.io-client';
// Import at the top of your file
// import notifee from '@notifee/react-native';
import notifee, {EventType,AndroidImportance} from '@notifee/react-native';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [categorydata, setcategorydata] = useState([]);
  const [posts, setposts] = useState([]);

  const [fullCategorydata, setFullCategorydata] = useState([]);
  const [userRole, setUserRole] = useState('buyer');
  const [location, setLocation] = useState(null);

  const [recentPosts, setrecentPosts] = useState([]);
  const [nearbyPosts, setnearbyPosts] = useState([]);
  const [filteredPosts, setfilteredPosts] = useState([]);
  const [singleShop, setSingleShop] = useState([]);
  const [buyerList, setbuyerList] = useState([]);

  const [shopRating, setShopRating] = useState([]);
  const [imageUrl, setimageUrl] = useState([]);

  const [PostsHistory, setPostsHistory] = useState([]);
  const [notificationList, setnotificationList] = useState([]);

  const [RatingLiked, setRatingLiked] = useState([]);

  const [FAQs, setFAQs] = useState([]);
  const [userdata, setUserdata] = useState([]);

  const [Userfulldata, setUserfulldata] = useState([]);

  const [fcmToken, setFcmToken] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isposting, setisposting] = useState(false);
  const [isLoading, setIsLoading] = useState({
    register: false,
    login: false,
    google: false
  });

  const isFocused = useIsFocused(); // ✅ Correct way to use `useIsFocused()`

  const [socket, setSocket] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [handleRemenberme, sethandleRemenberme] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastVisitedNotification, setLastVisitedNotification] = useState(null);

  useEffect(() => {
    const handleDeepLink = (url) => {
      if (!url || typeof url !== 'string') return; // Guard against null/undefined or non-string URLs

      // Extract product ID if present
      if (url.includes('/product/')) {
        const productId = url.split('/product/')[1]?.split('?')[0]; // Remove query params if any
        if (productId) {
          navigation.navigate('ProductDetails', { productId });
          return;
        }
      }

      // Extract shop ID if present
      if (url.includes('/shop/')) {
        const shopId = url.split('/shop/')[1]?.split('?')[0]; // Remove query params if any
        if (shopId) {
          navigation.navigate('ShopDetails', { shopId });
          return;
        }
      }

      // Optionally log unhandled URLs for debugging
      console.log('Unhandled deep link:', url);
    };

    // Handle initial URL when app is opened from a deep link
    Linking.getInitialURL()
      .then((url) => handleDeepLink(url))
      .catch((err) => console.error('Error getting initial URL:', err));

    // Add listener for deep links when app is already running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.remove();
    };
  }, [navigation]);

  // Add this useEffect for app state handling
  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground - reconnect socket
        initializeSocket();
        getUserData();
      } else if (nextAppState.match(/inactive|background/)) {
        // App went to background - disconnect socket
        if (socket) {
          socket.disconnect();
          setSocket(null);
        }
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
      // Clean up socket on unmount
      if (socket) {
        socket.disconnect();
      }
    };
  }, [appState, socket]);

  // Modified socket initialization function
  const initializeSocket = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      // Disconnect existing socket if any
      if (socket) {
        socket.disconnect();
      }

      const newSocket = io(`${apiURL}/chat`, {
        transports: ['websocket'],
        extraHeaders: {token},
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket connected!');
        setSocket(newSocket);
        initializeChat(newSocket);
      });

      newSocket.on('connect_error', error => {
        console.error('🚨 Socket connection error:', error.message);
      });

      newSocket.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
      });
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  };

  useEffect(() => {
    // Initialize Google Signin
    GoogleSignin.configure({
      webClientId: '872169733649-p0sgqghd00uij5engmlt21lr3s2me28r.apps.googleusercontent.com',
      offlineAccess: true,
    });

    // Request location permission
    <LocationPermission setLocation={setLocation} />;
    
    // Get device token
    getDeviceToken();
    
    // Check login status
    checkLoginStatus();

    // Notification handlers
    const setupNotifications = async () => {
      try {
        // 1. Request notification permissions (required for iOS)
        await messaging().requestPermission();
        
        // 2. Create notification channel (required for Android)
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });

        // 3. Handle initial notification (app opened from quit state)
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
          navigation.navigate('Notification', {
            notificationData: initialNotification.data
          });
        }

        // 4. Handle notification opened from background state
        const unsubscribeOnOpen = messaging().onNotificationOpenedApp(remoteMessage => {
          if (remoteMessage) {
            navigation.navigate('Notification', {
              notificationData: remoteMessage.data
            });
          }
        });

        // 5. Handle foreground notifications
        const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
          console.log('Foreground Notification:', remoteMessage);
          
          if (remoteMessage?.notification) {
            await notifee.displayNotification({
              title: remoteMessage.notification.title || 'New Notification',
              body: remoteMessage.notification.body || 'You have a new message',
              android: {
                channelId: 'default',
                pressAction: {
                  id: 'default',
                },
              },
              ios: {
                foregroundPresentationOptions: {
                  badge: true,
                  sound: true,
                  banner: true,
                  list: true,
                },
              },
              data: remoteMessage.data || {},
            });
          }
        });

        // 6. Handle notification press (foreground)
        const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
          if (type === EventType.PRESS) {
            navigation.navigate('Notification', {
              notificationData: detail.notification?.data,
            });
          }
        });

        return () => {
          unsubscribeOnOpen();
          unsubscribeOnMessage();
          unsubscribeNotifee();
        };
      } catch (error) {
        console.error('Notification setup error:', error);
      }
    };

    setupNotifications();

    // Other logic
    if (userdata?._id) {
      getSingleShop(userdata._id);
    }
  }, [navigation]);
 

  // Update your checkLoginStatus to use initializeSocket
  const checkLoginStatus = async () => {
    try {
      const rememberMe = await AsyncStorage.getItem('rememberMe');
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      const userRole = await AsyncStorage.getItem('selectedUserRole');

      if (rememberMe === 'true' && token && userData) {
        const parsedUserData = JSON.parse(userData);
        setUserdata(parsedUserData);

        // Initialize socket when user is logged in
        initializeSocket();

        if (navigation.isReady()) {
          if (userRole === 'buyer') {
            setUserRole(userRole);
            navigation.navigate('BottomTabs');
          } else if (userRole === 'seller') {
            setUserRole(userRole);
            navigation.navigate('BottomTabs');
          } else {
            navigation.navigate('BottomTabs');
          }
        }
      } else if (token && userData) {
        // User has credentials but didn't check "Remember Me"
        await handleLogout(); // Clear their session
      }
    } catch (error) {
      console.error('❌ Error checking login status:', error);
    }
  };

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
        setFcmToken(token);

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
            Authorization: `Bearer ${userdata.token}`,
            // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
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
      // console.log('userdata.token', userdata.token);
      setcategorydata(newData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error', error.response.data.body);
      } else {
        console.log('Error', 'Failed to load categories');
      }
    }
  };

  const getFAQs = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/faq/getFaqs`, {
        headers: {
          Authorization: `Bearer ${userdata.token}`,
          // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
        },
      });

      const faqs = response.data;

      // console.log('FAQs', faqs);
      setFAQs(faqs);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error223', error.response.data.body);
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
            Authorization: `Bearer ${userdata.token}`,
            // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
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
      setFullCategorydata(categories.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error', error.response.data.body);
      } else {
        console.log('Error', 'Failed to load categories');
      }
    }
  };

  const getPosts = async (category = null) => {
    try {
      let url = `${apiURL}/api/requirementPost/getRequirement`;

      // Add the category query parameter only if it is valid
      if (
        category !== null &&
        category !== undefined &&
        category.trim() !== ''
      ) {
        url += `?category=${encodeURIComponent(category.trim())}`;
      }

      // console.log('Fetching data from URL:', url); // Log the URL

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${userdata.token}`,
        },
      });

      const Posts = response.data;
      // console.log('API Response:', Posts.data[0]); // Log the API response
      setposts(Posts.data); // Update the state with filtered posts
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error 205', error.response.data.body);
      } else {
        console.log('Error', 'Failed to load categories');
      }
    }
  };

  const getRecentPosts = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/buyer/post/recentPosts`, {
        headers: {
          Authorization: `Bearer ${userdata.token}`,
          // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
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
        Authorization: `Bearer ${userdata.token}`,

        // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
      };

      const response = await axios.post(
        `${apiURL}/api/buyer/post/allPosts`,
        payload,
        {headers},
      );

      // console.log('Response:', response.data.data);

      const NearbyPosts = response.data.data;
      setnearbyPosts(NearbyPosts);
      //  console.log('NearbyPosts:', NearbyPosts[0].userData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.log('Error 107', error.response?.data || 'No error response');
      } else {
        console.log('Error 109', 'Failed to load categories');
      }
    }
  };

  const getFilteredPosts = async (
    // userId,
    categories = [],
    ratingFilter = null,
    distanceFilter = null,
  ) => {
    // console.log('categories:', categories);

    try {
      const payload = {
        // distance: distanceFilter,
        // rating: ratingFilter,
        // topRated: '',
        // key: '',
        // categories: categories,
        // myPost: false, // true, false
        // userId: userId,
      };

      const headers = {
        Authorization: `Bearer ${userdata.token}`,

        // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
      };

      const response = await axios.get(
        `${apiURL}/api/user/getAllProfile`,
        payload,
        // {headers},
      );

      const posts = response.data.data;
      // console.log('posts:', posts.length);

      // If no filters are passed, return all posts
      if (distanceFilter === null && ratingFilter === null) {
        setfilteredPosts(posts);
        return;
      } else {
        setfilteredPosts(filteredPosts);
      }

      // Apply filters if they are provided
      const filteredPosts = posts.filter(post => {
        // Apply distance filter only if provided
        const withinDistance =
          distanceFilter !== null ? post.distance <= distanceFilter : true;

        // Apply rating filter only if provided
        const matchesRating =
          ratingFilter !== null ? post.rating >= ratingFilter : true;

        return withinDistance && matchesRating;
      });

      // console.log('FilteredPosts:', filteredPosts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.log('Error 107', error.response?.data || 'No error response');
      } else {
        console.log('Error 109', 'Failed to load categories');
      }
    }
  };
  const getSingleShop = async userId => {
    setSingleShop([]);

    try {
      const headers = {
        Authorization: `Bearer ${userdata.token}`,
      };

      const response = await axios.get(`${apiURL}/api/user/getAllProfile`, {
        headers,
      });

      // Find the user with the matching ID
      const singleShop = response.data.data.find(shop => shop._id === userId);

      if (singleShop) {
        setSingleShop(singleShop);
        // console.log('Single Shop:', singleShop._id);
      } else {
        console.log('No shop found with the given userId');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error fetching shop:',
          error.response?.data || 'No error response',
        );
      } else {
        console.error('Failed to load SingleShop data');
      }
    }
  };

  const getBuyersList = async userId => {
    try {
      const headers = {
        Authorization: `Bearer ${userdata.token}`,
      };

      const response = await axios.get(
        `${apiURL}/api/user/getAllProfileBuyer`,
        {
          headers,
        },
      );

      const buyersList = response.data.data;

      // console.log('buyersList', buyersList);
      setbuyerList(buyersList);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error fetching Buyers List:',
          error.response?.data || 'No error response',
        );
      } else {
        console.error('Failed to load SingleShop data');
      }
    }
  };

  const getShopRating = async shopId => {
    // console.log('shopId', shopId);
    try {
      const headers = {
        Authorization: `Bearer ${userdata.token}`,
      };

      const response = await axios.get(
        `${apiURL}/api/rate/getRating?postId=${shopId}`,
        {headers},
      );

      // Log response to check structure
      // console.log('Rating API Response:', response.data);
      setShopRating(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error fetching shop Rating:',
          error.response?.data || 'No error response',
        );
      } else {
        console.error('Failed to load ShopRating data');
      }
    }
  };

  const getPostsHistory = async (categories = []) => {
    try {
      const response = await axios.get(
        `${apiURL}/api/requirementPost/getRequirement`,
        {
          headers: {
            Authorization: `Bearer ${userdata.token}`,
          },
        },
      );

      const allPosts = response.data.data;

      // Filtering posts to only include those matching the current user's token
      const filteredPosts = allPosts.filter(
        post => post.userId === userdata._id,
      );

      setPostsHistory(filteredPosts);
      console.log('Filtered Posts:', filteredPosts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error:', error.response?.data || 'No error response');
      } else {
        console.error('Error:', 'Failed to load categories');
      }
    }
  };

  const getNotification = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/api/notifications/myNotifications`,
        {
          headers: {
            Authorization: `Bearer ${userdata.token}`,
          },
        },
      );

      const notificationList = response.data.data;
      setnotificationList(notificationList);

      // Calculate unread count based on last visited time
      if (lastVisitedNotification) {
        const unread = notificationList.filter(
          notif =>
            new Date(notif.createdAt) > new Date(lastVisitedNotification),
        );
        setUnreadCount(unread.length);
      } else {
        // If never visited, all notifications are unread
        setUnreadCount(notificationList.length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Add a function to mark notifications as read
  const markNotificationsAsRead = async () => {
    const now = new Date();
    setLastVisitedNotification(now);
    setUnreadCount(0);
    await AsyncStorage.setItem('lastVisitedNotification', now.toISOString());
  };

  // Update your checkLoginStatus or initialization to load the last visited time
  const loadLastVisitedTime = async () => {
    try {
      const lastVisited = await AsyncStorage.getItem('lastVisitedNotification');
      if (lastVisited) {
        setLastVisitedNotification(new Date(lastVisited));
      }
    } catch (error) {
      console.error('Error loading last visited time:', error);
    }
  };

  // Call loadLastVisitedTime when your app initializes
  useEffect(() => {
    loadLastVisitedTime();
  }, []);

  const PostReviewLikes = async (userId, postId, like) => {
    try {
      // Validate required parameters
      if (!userId || !postId || like === undefined) {
        console.error('Missing required parameters:', {userId, postId, like});
        throw new Error('Missing required parameters for like action');
      }

      const payload = {
        status: like ? 'like' : 'unlike', // Convert boolean to status string
      };

      const headers = {
        Authorization: `Bearer ${userdata?.token}`,
      };

      // Using template literals for cleaner URL construction
      const response = await axios.post(
        `${apiURL}/api/rate/likeRating`,
        {
          postId,
          userId,
          status: payload.status,
        },
        {headers},
      );

      const RatingLiked = response.data;
      setRatingLiked(RatingLiked);
      return RatingLiked; // Return the result for further processing
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to process like action';
        console.error('API Error:', errorMessage, error.response?.status);

        // You might want to show this to the user
        Alert.alert('Error', errorMessage);
      } else {
        console.error('Unexpected Error:', error);
        Alert.alert('Error', 'An unexpected error occurred');
      }
      throw error; // Re-throw to allow calling code to handle
    }
  };

  const PostReportissue = async (media, description) => {
    // console.log('Success343', media, description);
    const formattedMedia = Array.isArray(media)
      ? media.map(item => item.uri || item)
      : [];

    try {
      const payload = {
        images: formattedMedia,
        description: description,
      };

      const headers = {
        Authorization: `Bearer ${userdata.token}`,

        // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
      };

      const response = await axios.post(
        `${apiURL}/api/issues/reportIssue`,
        payload,
        {headers},
      );

      // console.log('Response:', response.data.data);

      console.log('Success', ' Report Post successful!');
      Alert.alert('Success', 'Report submitted successfully!');

      navigation.navigate('BottomTabs');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.log('Error 107', error.response?.data || 'No error response');
      } else {
        console.log('Error 109', 'Failed to load categories');
      }
    }
  };

  const PostRating = async (postId, rating, media, description) => {
    try {
      const payload = {
        rate: rating, // User-selected rating
        feedback: description, // User feedback (optional)
        images: media[0], // Array of image URLs (optional)
      };

      const headers = {
        Authorization: `Bearer ${userdata.token}`,

        // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
      };

      const response = await axios.post(
        `${apiURL}/api/rate/rating?postId=${postId}`, // Dynamic Post ID
        payload,
        {headers},
      );

      navigation.navigate(navigation.goBack());
      console.log('Success', 'Rating Posted Successfully!', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error:', error.response?.data || 'No error response');
      } else {
        console.log('Error:', 'Failed to post rating');
      }
    }
  };

  const createPost = async (
    name,
    selectedCategories,
    description,
    phone,
    email,
    location,
    media,
  ) => {
    console.log(
      'first',
      name,
      selectedCategories,
      description,
      phone,
      email,
      location,
      media,
    );
    try {
      const payload = {
        productName: name,
        categories: selectedCategories,
        images: media,
        description: description,
        contactNumber: phone,
        contactEmail: email,
        location: 'New York, NY',
        latitude: location.latitude,
        longitude: location.longitude,
        locationUrl: 'https://maps.google.com/?q=New+York',
      };

      const headers = {
        Authorization: `Bearer ${userdata.token}`,

        // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
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
        console.log('Error 109', 'Failed to create post');
      }
    }
  };

  const deletePost = async id => {
    try {
      const headers = {
        Authorization: `Bearer ${userdata.token}`,
      };

      const response = await axios.delete(
        `${apiURL}/api/requirementPost/deleteRequirement?id=${id}`, // Passing id as a query param
        {headers},
      );

      console.log('Deleted Post Response:', response.data);

      // Update local state by filtering out the deleted post
      await getPostsHistory();
      setPostsHistory(prevPosts => prevPosts.filter(post => post._id !== id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          'Error deleting post:',
          error.response?.data || 'No error response',
        );
      } else {
        console.log('Error:', error);
      }
    }
  };

  const deleteNotification = async id => {
    try {
      const headers = {
        Authorization: `Bearer ${userdata.token}`,
      };

      const response = await axios.delete(
        `${apiURL}/api/notifications/deleteNotifications?id=${id}`, // Passing id as a query param
        {headers},
      );

      console.log('Deleted Post Response:', response.data);

      // Update local state by filtering out the deleted post
      // setPostsHistory(prevPosts => prevPosts.filter(post => post._id !== id));
      console.log('notification deleted');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          'Error deleting post:',
          error.response?.data || 'No error response',
        );
      } else {
        console.log('Error:', error);
      }
    }
  };

  const deleteAccount = async id => {
    try {
      const headers = {
        Authorization: `Bearer ${userdata.token}`,
      };

      const response = await axios.delete(
        `${apiURL}/api/user/deleteProfile`, // Passing id as a query param
        {headers},
      );

      console.log('Deleted Account Response:', response.data);
      // Reset navigation and go to Login screen
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');

      // Clear user session
      setUserdata(null);
      setIsLoggedIn(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'commonscreen'}],
      });
      // Update local state by filtering out the deleted post
      // setPostsHistory(prevPosts => prevPosts.filter(post => post._id !== id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          'Error deleting post:',
          error.response?.data || 'No error response',
        );
      } else {
        console.log('Error:', error);
      }
    }
  };

  const deleteProduct = async id => {
    try {
      const headers = {
        Authorization: `Bearer ${userdata.token}`,
      };

      const response = await axios.delete(
        `${apiURL}/api/post/deletes?id=${id}`, // Passing id as a query param
        {headers},
      );

      console.log('Deleted product Response:', response.data);

      // Update local state by filtering out the deleted post
      // setPostsHistory(prevPosts => prevPosts.filter(post => post._id !== id));
      console.log('product deleted');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          'Error deleting product:',
          error.response?.data || 'No error response',
        );
      } else {
        console.log('Error:', error);
      }
    }
  };

  const createSellerProfile = async (
    description,
    phone,
    location,
    profile,
    selectedCategories,
    businessAddress,
    Socialmedia,
    establishmentYear,
    gstin,
    ownerName,
    shopName,
    openAt,
    closeAt,
    selectedScale,
    selectedAvailabity,
  ) => {
    // console.log(
    //   'Response 787:',
    //   // description,
    //   // phone,
    //   // location,
    //   // profile,
    //   // selectedCategories,
    //   // businessAddress,
    //   // Socialmedia,
    //   // establishmentYear,
    //   // gstin,
    //   // ownerName,
    //   // shopName,
    //   // openAt,
    //   // closeAt,
    //   // selectedScale,
    //   // selectedAvailabity,
    //   // products,
    // );
    console.log('Response 1011:', selectedAvailabity);

    try {
      const payload = {
        description: description,
        phone: phone,
        location: location,
        profile: profile,
        selectedCategories: selectedCategories,
        businessAddress: businessAddress,
        socialMedia: Socialmedia,
        establishmentYear: establishmentYear,
        gstin: gstin,
        ownerName: ownerName,
        name: shopName,
        businessScale: selectedScale,
        isDeliveryAvailable: selectedAvailabity,
        openTime: openAt,
        closeTime: closeAt,
        // categoriesPost: products,
        fcmToken: fcmToken,
      };

      const headers = {
        Authorization: `Bearer ${userdata.token}`,

        // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
      };

      const response = await axios.put(
        `${apiURL}/api/user/updateProfile`,
        payload,
        {headers},
      );

      console.log('Response 171:', response.data);
      await getUserData();
      navigation.navigate('BottomTabs');
      Alert.alert('Success', 'Profile created / updated successfully!');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error 107:', error.response?.data || 'No error response');
      } else {
        console.log('Error 109:', error.message || 'Failed to load categories');
      }
    }
  };

  const createSellerProducts = async products => {
    console.log(
      'Response 787:',

      products,
    );

    try {
      const payload = {
        categoriesPost: products,
      };

      const headers = {
        Authorization: `Bearer ${userdata.token}`,

        // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
      };

      const response = await axios.put(
        `${apiURL}/api/user/updateProfile`,
        payload,
        {headers},
      );

      console.log('Response 171:', response.data);
      Alert.alert('Success', 'product created successfully!');
      // navigation.goBack();
      // Alert.alert('Success', 'Post created successfully!');
      navigation.navigate('BottomTabs');
      // console.log('NearbyPosts:', NearbyPosts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error 107:', error.response?.data || 'No error response');
      } else {
        console.log('Error 109:', error.message || 'Failed to load categories');
      }
    }
  };

  const updatebuyerProfile = async (name, date, value, gender, imageUrl) => {
    // const formattedMedia = Array.isArray(media)
    //   ? media.map(item => item.uri || item)
    //   : [];

    // console.log('gender', gender);
    try {
      const payload = {
        name: name,
        dob: date,
        phone: value,
        gender: gender,
        profile: imageUrl,
        fcmToken: fcmToken,
      };

      const headers = {
        Authorization: `Bearer ${userdata.token}`,

        // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
      };

      const response = await axios.put(
        `${apiURL}/api/user/updateProfile`,
        payload,
        {headers},
      );

      console.log('Response 171:', response.data);
      await getUserData();
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.navigate('profilesettings');
      // console.log('NearbyPosts:', NearbyPosts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error 107:', error.response?.data || 'No error response');
      } else {
        console.log('Error 109:', error.message || 'Failed to load categories');
      }
    }
  };

  const updateProduct = async (data, title, images, categories) => {
    // const formattedMedia = Array.isArray(media)
    //   ? media.map(item => item.uri || item)
    //   : [];

    console.log('data', title, images, categories);
    try {
      const payload = {
        title: title,
        categories: categories,
        images: images,
        fcmToken: fcmToken,
      };

      const headers = {
        Authorization: `Bearer ${userdata.token}`,

        // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
      };

      const response = await axios.put(
        `${apiURL}/api/post/update?id=${data._id}`,
        payload,
        {headers},
      );

      console.log('Response 171:', response.data);
      Alert.alert('Success', 'Product Updated successfully!');
      navigation.navigate('BottomTabs');
      // console.log('NearbyPosts:', NearbyPosts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error 107:', error.response?.data || 'No error response');
      } else {
        console.log('Error 109:', error.message || 'Failed to load categories');
      }
    }
  };

  const uploadImage = async image => {
    console.log('image:', image);

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image[0].uri,
        name: image[0].fileName || `photo_${Date.now()}.jpg`,
        type: image[0].type || 'image/jpeg',
      });

      const headers = {
        Authorization: `Bearer ${userdata.token}`,
        'Content-Type': 'multipart/form-data',
      };

      const response = await axios.post(
        `${apiURL}/api/user/uploadImage`,
        formData,
        {headers},
      );

      if (response.status === 200) {
        const fileUrl = response.data?.data[0]; // Extracting the first URL from the array
        console.log('✅ Image uploaded successfully. File URL:', fileUrl);
        setimageUrl(fileUrl);
        return fileUrl; // Return only the URL
      } else {
        console.log(
          '❌ Failed to upload image:',
          response.status,
          response.data,
        );
      }
    } catch (error) {
      console.log('❌ Error uploading image:', error.response?.data || error);
    }
  };

  const getUserData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${userdata.token}`,
      };

      const response = await axios.get(`${apiURL}/api/user/getProfile`, {
        headers,
      });
      // console.log('userdata1226', response.data.data.isDeliveryAvailable);

      setUserfulldata(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error fetching UserData:',
          error.response?.data || 'No error response',
        );
      } else {
        console.error('Failed to load User data');
      }
    }
  };

 const handleRegister = async (email, password, name, rememberMe) => {
  setIsLoading(prev => ({...prev, register: true}));
  try {
    const response = await axios.post(`${apiURL}/api/user/sendOTP`, {
      emailPhone: email,
      password,
      userName: name,
      isAcceptTermConditions: true,
      roleId: userRole === 'buyer' ? 0 : 1,
      fcmToken: fcmToken,
    });

    await AsyncStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
    
    navigation.navigate('OTPScreen', {
      emailPhone: email,
      password: password,
    });
  } catch (error) {
    let errorMessage = 'An unexpected error occurred.';
    if (axios.isAxiosError(error)) {
      console.error('Registration error:', error.response?.data);
      errorMessage = error.response?.data?.body || 'Email already exists.';
    }
    Alert.alert('Registration Failed', errorMessage);
  } finally {
    setIsLoading(prev => ({...prev, register: false}));
  }
};

const handleLogin = async (email, password, rememberMe) => {
  setIsLoading(prev => ({...prev, login: true}));
  try {
    const response = await axios.post(`${apiURL}/api/user/login`, {
      emailPhone: email,
      password,
      isAcceptTermConditions: true,
      roleId: userRole === 'buyer' ? 0 : 1,
      fcmToken: fcmToken,
    });

    const user = response.data;
    setUserdata(user);

    await AsyncStorage.multiSet([
      ['userToken', user.token],
      ['userData', JSON.stringify(user)],
      ['selectedUserRole', userRole],
      ['rememberMe', rememberMe ? 'true' : 'false'],
    ]);

    navigation.navigate('BottomTabs');
  } catch (error) {
    let errorMessage = 'Login failed. Please try again.';
    if (axios.isAxiosError(error)) {
      console.error('Login error:', error.response?.data);
      errorMessage = error.response?.data?.body || 'Invalid credentials.';
    }
    Alert.alert('Login Failed', errorMessage);
  } finally {
    setIsLoading(prev => ({...prev, login: false}));
  }
};

const signInWithGoogle = async () => {
  setIsLoading(prev => ({...prev, google: true}));
  
  try {
    // 1. Check Google Play Services
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true
      });
    } catch (playServicesError) {
      console.warn('Google Play Services error:', playServicesError);
      throw new Error('Google Play Services are required or need to be updated.');
    }

    // 2. Sign in with Google
    let signInResult, idToken;
    try {
      signInResult = await GoogleSignin.signIn();
      idToken = signInResult.data.idToken || signInResult.user?.idToken;
      
      if (!idToken) {
        throw new Error('No ID token received from Google');
      }
    } catch (googleSignInError) {
      console.warn('Google Sign-In error:', googleSignInError);
      throw new Error('Failed to sign in with Google. Please try again.');
    }

    // 3. Firebase authentication
    let userCredential;
    try {
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      userCredential = await auth().signInWithCredential(googleCredential);
      
      if (!userCredential?.user?.email) {
        throw new Error('Could not retrieve user information from Firebase');
      }
    } catch (firebaseError) {
      console.warn('Firebase authentication error:', firebaseError);
      throw new Error('Failed to authenticate with Firebase.');
    }

    // 4. Get existing user data safely
    let storedUserData = null;
    try {
      const data = await AsyncStorage.getItem('userData');
      storedUserData = data ? JSON.parse(data) : null;
    } catch (storageError) {
      console.warn('AsyncStorage error:', storageError);
      // Continue with null storedUserData
    }

    const profileImage = Userfulldata?.profile || 
                        storedUserData?.profile || 
                        userCredential.user.photoURL;

    // 5. Google login API call with additional error handling
    let response;
    try {
      const headers = {Authorization: `Bearer ${idToken}`};
      response = await axios.post(
        `${apiURL}/api/user/googleLogin`,
        {
          email: userCredential.user.email,
          name: userCredential.user.displayName,
          profile: profileImage,
          roleId: userRole === 'buyer' ? 0 : 1,
          fcmToken: fcmToken,
          idToken: idToken,
        },
        {
          headers,
          timeout: 10000 // 10 seconds timeout
        }
      );

      if (!response.data) {
        throw new Error('No data received from server');
      }
    } catch (apiError) {
      console.warn('API error:', apiError);
      
      // Handle specific axios errors
      if (apiError.response) {

        // The request was made and the server responded with a status code
        const status = apiError.response.status;
        let backendErrorMessage = apiError.response.data?.message || 
                                apiError.response.data?.error || 
                                'Request failed';
        
        // For 400 errors, check if there's validation message
        if (status === 400 && apiError.response.data?.errors) {
          backendErrorMessage = Object.values(apiError.response.data.errors).join('\n');
        }
        
        throw new Error(backendErrorMessage);
      } else if (apiError.request) {
        // The request was made but no response was received
        throw new Error('Network error. Please check your connection.');
      } else {
        // Something happened in setting up the request
        throw new Error('Request setup error. Please try again.');
      }
    }

    // 6. Merge and store user data
    try {
      const mergedUserData = {
        ...(storedUserData || {}),
        ...response.data,
        profile: profileImage,
        token: response.data.token,
      };

      setUserdata(mergedUserData);
      
      await AsyncStorage.multiSet([
        ['userToken', mergedUserData.token],
        ['userData', JSON.stringify(mergedUserData)],
        ['selectedUserRole', userRole],
        ['rememberMe', 'true'],
      ]);

      navigation.navigate('AddressScreen');
    } catch (storageError) {
      console.warn('Data storage error:', storageError);
      throw new Error('Failed to save user data.');
    }

  } catch (error) {
    console.error('Google Sign-In Error:', error);
    
    let errorMessage = 'Google sign-in failed. Please try again.';
    if (error.message) {
      errorMessage = error.message;
    }
    
    // Show alert with the error message
    Alert.alert(
      'Sign-in Failed',
      errorMessage,
      [{ text: 'OK' }],
      { cancelable: false }
    );
  } finally {
    setIsLoading(prev => ({...prev, google: false}));
  }
};

  const VerifyOTP = async (email, otp) => {
    // console.log('user', email);

    try {
      const response = await axios.post(`${apiURL}/api/user/verifyOTP`, {
        emailPhone: email,
        roleId: userRole === 'buyer' ? 0 : 1,
        otp,
        fcmToken: fcmToken,
      });

      const user = response.data;
      setUserdata(response.data);
      // ✅ Save user token & data
      await AsyncStorage.setItem('userToken', user.token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      await AsyncStorage.setItem('selectedUserRole', userRole);

      console.log('user', user);
      // ✅ OneSignal: Set external user ID and add role tag

      if (response.data.msg) {
        console.log('Success', 'Verification successful!');
        navigation.navigate('AddressScreen');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          'Error',
          error.response?.data?.body || 'Something went wrong.',
        );
      } else {
        Alert.alert('Error', 'Invalid OTP or password.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      // Disconnect socket first
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      // Get current profile before clearing data
      const currentProfile = Userfulldata?.profile;
      const currentUserData = await AsyncStorage.getItem('userData').then(
        data => (data ? JSON.parse(data) : null),
      );

      await GoogleSignin.signOut();

      // Clear all auth-related data but keep the rememberMe preference
      const rememberMe = await AsyncStorage.getItem('rememberMe');

      await AsyncStorage.multiSet([
        ['userToken', ''],
        [
          'userData',
          JSON.stringify({
            ...(currentUserData || {}),
            profile: currentProfile,
            token: null,
          }),
        ],
        ['rememberMe', 'false'], // Explicitly set rememberMe to false on logout
      ]);

      setUserfulldata(null);
      setIsLoggedIn(false);

      navigation.reset({
        index: 0,
        routes: [{name: 'commonscreen'}],
      });
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Something went wrong while logging out.');
    }
  };

  const handleForgetPassword = async email => {
    try {
      const response = await axios.post(
        `${apiURL}/api/user/sendForgotPasswordOTP`,
        {
          email,
        },
      );

      console.log('res', response.data);
      navigation.navigate('OTPScreen', {
        emailPhone: email,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error fetching Reset Password:',
          error.response?.data || 'No error response',
        );
      } else {
        console.error('Failed to load ResetPassword data');
      }
    }
  };

  const handleVerifyPasswordOtp = async (email, otp) => {
    try {
      const response = await axios.post(
        `${apiURL}/api/user/verifyForgotPasswordOTP`,
        {
          email,
          otp,
        },
      );

      console.log('res', response.data);
      navigation.navigate('NewPassword', {
        email: email,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error fetching Reset Password:',
          error.response?.data || 'No error response',
        );
      } else {
        console.error('Failed to load ResetPassword data');
      }
    }
  };

  const handleNewPassword = async (email, newPassword) => {
    try {
      const response = await axios.post(`${apiURL}/api/user/resetPassword`, {
        email,
        newPassword,
      });
      console.log('res', response.data);
      navigation.navigate('Login', {
        //  email: email
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error fetching Reset Password:',
          error.response?.data || 'No error response',
        );
      } else {
        console.error('Failed to load ResetPassword data');
      }
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
        handleForgetPassword,
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
        getPostsHistory,
        PostsHistory,
        PostReportissue,
        fcmToken,
        signInWithGoogle,
        PostRating,
        createSellerProfile,
        getFAQs,
        FAQs,
        deletePost,
        getSingleShop,
        singleShop,
        getShopRating,
        shopRating,
        PostReviewLikes,
        RatingLiked,
        getUserData,
        Userfulldata,
        updatebuyerProfile,
        uploadImage,
        imageUrl,
        apiURL,
        getNotification,
        notificationList,
        deleteNotification,
        deleteAccount,
        location,
        setLocation,
        getBuyersList,
        buyerList,
        createSellerProducts,
        updateProduct,
        deleteProduct,
        handleRemenberme,
        sethandleRemenberme,
        unreadCount,
        markNotificationsAsRead,
        initializeSocket,
        handleVerifyPasswordOtp,
        handleNewPassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthProvider, AuthContext};
