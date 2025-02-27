import {createContext, useState, useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Alert, AppState} from 'react-native';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
let apiURL = 'http://192.168.1.31:8080';
// let apiURL = 'https://8b0zr4h5-8080.inc1.devtunnels.ms';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [singleShop, setSingleShop] = useState([]);
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

  const isFocused = useIsFocused(); // ✅ Correct way to use `useIsFocused()`

  // not crashing
  useEffect(() => {
    console.log('🔄 useEffect triggered');

    // ✅ Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: 'searchkro-d6ff3.firebaseapp.com',
      offlineAccess: true,
    });

    // ✅ Ensure Notification Permissions
    requestNotificationPermission();

    // ✅ Get Device Token
    getDeviceToken();
    checkLoginStatus();

    // ✅ Handle initial notification (App was killed & opened from notification)
    const handleInitialNotification = async () => {
      try {
        const remoteMessage = await messaging().getInitialNotification();
        console.log(
          '📩 Initial Notification:',
          JSON.stringify(remoteMessage, null, 2),
        );

        if (remoteMessage) {
          handleNotification(remoteMessage, 'Initial');
        } else {
          console.log('⚠️ No initial notification found.');
        }
      } catch (error) {
        console.error('❌ Error fetching initial notification:', error);
      }
    };

    handleInitialNotification();

    // ✅ Handle background notification click
    const unsubscribeOnOpen = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          '📬 Notification opened from background:',
          JSON.stringify(remoteMessage, null, 2),
        );
        if (remoteMessage) {
          handleNotification(remoteMessage, 'Background');
        }
      },
    );

    // ✅ Handle foreground notifications
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log(
        '📨 Foreground message received:',
        JSON.stringify(remoteMessage, null, 2),
      );
      if (remoteMessage) {
        handleNotification(remoteMessage, 'Foreground');
      }
    });

    // ✅ Cleanup
    return () => {
      unsubscribeOnOpen();
      unsubscribeOnMessage();
    };
  }, []);

  // ✅ Function to request notification permissions
  const requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ Notification permission granted.');
    } else {
      console.log('❌ Notification permission denied.');
    }
  };

  // ✅ Function to handle notifications safely
  const handleNotification = (remoteMessage, source) => {
    console.log(
      `🔔 ${source} Notification Data:`,
      JSON.stringify(remoteMessage.data, null, 2),
    );

    if (remoteMessage.notification) {
      const {title, body} = remoteMessage.notification;
      const data = remoteMessage.data || {};

      console.log(
        `📜 Notification Details: Title: ${title}, Body: ${body}, Data:`,
        data,
      );

      if (AppState.currentState === 'active') {
        Alert.alert(
          `${title || 'Notification'} (${source})`,
          `${body || 'You have a new message'}\n\nData: ${JSON.stringify(
            data,
          )}`,
        );
      }
    } else {
      console.log(`⚠️ No "notification" object found in ${source} message.`);
    }
  };

  // getting data throught firestore but crashing
  // useEffect(() => {
  //   console.log('🔄 useEffect triggered');

  //   // ✅ Configure Google Sign-In
  //   GoogleSignin.configure({
  //     webClientId: 'searchkro-d6ff3.firebaseapp.com',
  //     offlineAccess: true,
  //   });

  //   // ✅ Ensure Notification Permissions
  //   requestNotificationPermission();

  //   // ✅ Get Device Token
  //   getDeviceToken();
  //   checkLoginStatus();

  //   // ✅ Handle initial notification (App was killed & opened from notification)
  //   const handleInitialNotification = async () => {
  //     try {
  //       const remoteMessage = await messaging().getInitialNotification();
  //       console.log(
  //         '📩 Initial Notification:',
  //         JSON.stringify(remoteMessage, null, 2),
  //       );

  //       if (!remoteMessage) {
  //         console.log('⚠️ No initial notification found.');
  //         return;
  //       }

  //       const {notification, data} = remoteMessage;
  //       const title = notification?.title || 'Notification';
  //       const body = notification?.body || 'You have a new message';

  //       console.log(
  //         `📜 Initial Notification Details: Title: ${title}, Body: ${body}, Data:`,
  //         data,
  //       );

  //       Alert.alert(title, body);
  //     } catch (error) {
  //       console.error('❌ Error fetching initial notification:', error);
  //     }
  //   };

  //   handleInitialNotification();

  //   // ✅ Handle background notification click
  //   const unsubscribeOnOpen = messaging().onNotificationOpenedApp(
  //     remoteMessage => {
  //       console.log(
  //         '📬 Notification opened from background:',
  //         JSON.stringify(remoteMessage, null, 2),
  //       );
  //       if (remoteMessage) {
  //         handleNotification(remoteMessage, 'Background');
  //       }
  //     },
  //   );

  //   // ✅ Handle foreground notifications
  //   messaging().onMessage(async remoteMessage => {
  //     try {
  //       console.log(
  //         '📨 Foreground message received:',
  //         JSON.stringify(remoteMessage, null, 2),
  //       );

  //       if (!remoteMessage) {
  //         console.log('⚠️ No remoteMessage found in onMessage.');
  //         return;
  //       }

  //       // 🛡 Ensure `notification` and `data` exist before accessing
  //       const notification = remoteMessage?.notification || {};
  //       const data = remoteMessage?.data || {};

  //       console.log(`📜 Safe Notification Details:`, {
  //         title: notification?.title || 'No Title',
  //         body: notification?.body || 'No Body',
  //         data: Object.keys(data).length ? data : 'No Data',
  //       });

  //       // ✅ Show an alert ONLY if App is in foreground (to prevent crashes)
  //       if (AppState.currentState === 'active') {
  //         try {
  //           Alert.alert(
  //             notification?.title || 'Notification',
  //             notification?.body || 'You have a new message',
  //           );
  //         } catch (alertError) {
  //           console.error('🚨 Alert crashed the app:', alertError);
  //         }
  //       }
  //     } catch (error) {
  //       console.error(
  //         '❌ CRASH PREVENTED: Error handling foreground notification:',
  //         error,
  //       );
  //     }
  //   });

  //   // ✅ Cleanup
  //   return () => {
  //     unsubscribeOnOpen();
  //     unsubscribeOnMessage();
  //   };
  // }, []);

  // // ✅ Function to request notification permissions
  // const requestNotificationPermission = async () => {
  //   try {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log('✅ Notification permission granted.');
  //     } else {
  //       console.log('❌ Notification permission denied.');
  //     }
  //   } catch (error) {
  //     console.error('❌ Error requesting notification permission:', error);
  //   }
  // };

  // // ✅ Function to handle notifications safely
  // const handleNotification = (remoteMessage, source) => {
  //   try {
  //     console.log(
  //       `🔔 ${source} Notification Data:`,
  //       JSON.stringify(
  //         remoteMessage?.data || {message: 'No data received'},
  //         null,
  //         2,
  //       ),
  //     );

  //     if (!remoteMessage || !remoteMessage.notification) {
  //       console.log(`⚠️ No "notification" object found in ${source} message.`);
  //       return;
  //     }

  //     const {title, body} = remoteMessage.notification || {};
  //     const safeData =
  //       remoteMessage.data && Object.keys(remoteMessage.data).length
  //         ? remoteMessage.data
  //         : {message: 'No data received'};

  //     console.log(
  //       `📜 Safe Notification Details: Title: ${title || 'No Title'}, Body: ${
  //         body || 'No Body'
  //       }, Data:`,
  //       safeData,
  //     );

  //     if (AppState.currentState === 'active') {
  //       try {
  //         Alert.alert(
  //           `${title || 'Notification'} (${source})`,
  //           `${body || 'You have a new message'}\n\nData: ${JSON.stringify(
  //             safeData,
  //           )}`,
  //         );
  //       } catch (alertError) {
  //         console.error('🚨 Alert crashed the app:', alertError);
  //       }
  //     }
  //   } catch (error) {
  //     console.error(
  //       `❌ CRASH PREVENTED: Error handling ${source} notification:`,
  //       error,
  //     );
  //   }
  // };

  // crashing but have data througt api useEffect(() => {
  //   console.log('🔄 useEffect triggered');

  //   // ✅ Configure Google Sign-In
  //   GoogleSignin.configure({
  //     webClientId: 'searchkro-d6ff3.firebaseapp.com',
  //     offlineAccess: true,
  //   });

  //   // ✅ Fetch Device Token
  //   getDeviceToken();
  //   checkLoginStatus();

  //   // ✅ Handle initial notification (when app is killed & opened from notification)
  //   const handleInitialNotification = async () => {
  //     try {
  //       const remoteMessage = await messaging().getInitialNotification();
  //       console.log('📩 Initial Notification:', remoteMessage);

  //       if (remoteMessage?.notification) {
  //         const {title, body} = remoteMessage.notification;
  //         if (AppState.currentState === 'active') {
  //           Alert.alert(
  //             title || 'Notification',
  //             body || 'You have a new message',
  //           );
  //         }
  //       } else {
  //         console.log('⚠️ No initial notification found.');
  //       }
  //     } catch (error) {
  //       console.error('❌ Error fetching initial notification:', error);
  //     }
  //   };

  //   handleInitialNotification();

  //   // ✅ Handle background notification click
  //   const unsubscribeOnOpen = messaging().onNotificationOpenedApp(
  //     remoteMessage => {
  //       console.log('📬 Notification opened from background:', remoteMessage);
  //       if (!remoteMessage) {
  //         console.log('⚠️ No remoteMessage found in onNotificationOpenedApp.');
  //         return;
  //       }
  //     },
  //   );

  //   // ✅ Handle foreground notifications
  //   const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
  //     try {
  //       console.log('📨 Foreground message received:', remoteMessage);

  //       if (!remoteMessage) {
  //         console.log('⚠️ No remoteMessage found in onMessage.');
  //         return;
  //       }

  //       const {notification} = remoteMessage;
  //       if (notification) {
  //         Alert.alert(
  //           notification.title || 'Notification',
  //           notification.body || 'You have a new message',
  //         );
  //       } else {
  //         console.log('⚠️ No notification data found in foreground message.');
  //       }
  //     } catch (error) {
  //       console.error('❌ Error handling foreground notification:', error);
  //     }
  //   });

  //   // ✅ Cleanup
  //   return () => {
  //     unsubscribeOnOpen();
  //     unsubscribeOnMessage();
  //   };
  // }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setUserdata(JSON.parse(userData));
        if (navigation.isReady()) {
          navigation.navigate('BottomTabs');
        }
      }
      // else {
      //   if (navigation.isReady()) {
      //     navigation.navigate('Login');
      //   }
      // }
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

  const getFAQs = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/faq/getFaqs`, {
        headers: {
          Authorization: `Bearer ${userdata.token}`,
          // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
        },
      });

      const FAQs = response.data;

      //  console.log('FAQs', FAQs);
      setFAQs(FAQs);
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

  const getPosts = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/api/requirementPost/getRequirement`,
        {
          headers: {
            Authorization: `Bearer ${userdata.token}`,
            // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzc3OWFlOTMxNTNlNDAxNmM1ZWNhYTIiLCJyb2xlIjoic2VsbGVyIiwicm9sZUlkIjoxLCJpYXQiOjE3MzU5NjczNDh9.-zeNvyQJa0D5I1WXTczx1X4k70ht2bINI6nZBNbMW9M'}`,
          },
        },
      );

      const Posts = response.data;

      //  console.log('Posts', Posts);
      setposts(Posts.data);
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
        console.error('Failed to load shop data');
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
      //     console.log('Shop Rating:', ShopRating);
      // If response contains 'data', set shop rating
      // if (response.data && response.data.data) {
      //   const ShopRating = response.data.data.find(shop => shop._id === shopId);

      //   if (ShopRating) {
      //     setShopRating(ShopRating);
      //     console.log('Shop Rating:', ShopRating);
      //   } else {
      //     console.log('No shop found with the given shopId');
      //   }
      // } else {
      //   console.log('Invalid API response structure');
      // }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error fetching shop:',
          error.response?.data || 'No error response',
        );
      } else {
        console.error('Failed to load shop data');
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
            // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzc3OWFlOTMxNTNlNDAxNmM1ZWNhYTIiLCJyb2xlIjoic2VsbGVyIiwicm9sZUlkIjoxLCJpYXQiOjE3MzU5NjczNDh9.-zeNvyQJa0D5I1WXTczx1X4k70ht2bINI6nZBNbMW9M'}`,
          },
        },
      );
      const PostsHistory = response.data.data;
      setPostsHistory(PostsHistory);
      // console.log('PostsHistory:', response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.log('Error 107', error.response?.data || 'No error response');
      } else {
        console.log('Error 109', 'Failed to load categories');
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
            // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzc3OWFlOTMxNTNlNDAxNmM1ZWNhYTIiLCJyb2xlIjoic2VsbGVyIiwicm9sZUlkIjoxLCJpYXQiOjE3MzU5NjczNDh9.-zeNvyQJa0D5I1WXTczx1X4k70ht2bINI6nZBNbMW9M'}`,
          },
        },
      );
      const notificationList = response.data.data;
      setnotificationList(notificationList);
      // console.log('notificationList:', response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.log('Error 107', error.response?.data || 'No error response');
      } else {
        console.log('Error 109', 'Failed to load categories');
      }
    }
  };

  const PostReviewLikes = async (userId, postId, like) => {
    // console.log('userId, postId', userId, postId, like);

    try {
      const payload = {
        status: 'like', // Ensure `like` is defined before calling
      };

      const headers = {
        Authorization: `Bearer ${userdata.token}`,
      };

      const response = await axios.post(
        `${apiURL}/api/rate/likeRating?postId=${postId}&userId=${userId}&status=${like}`,
        payload, // Pass payload correctly
        {headers}, // Move headers inside config
      );

      const RatingLiked = response.data;
      setRatingLiked(RatingLiked); // Ensure `setRatingLiked` is defined
      // console.log('Success:', 'Rating Liked!', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error 107', error.response?.data || 'No error response');
      } else {
        console.log('Error 109', 'Failed to load likes');
      }
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

      // navigation.navigate('BottomTabs');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.log('Error 107', error.response?.data || 'No error response');
      } else {
        console.log('Error 109', 'Failed to load categories');
      }
    }
  };

  const PostRating = async (postId, rating, media, description) => {
    // const formattedMedia = Array.isArray(media)
    //   ? media.map(item => item.uri || item)
    //   : [];
    // console.log('formattedMedia',formattedMedia)
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
    selectedCategories,
    description,
    phone,
    email,
    location,
    media,
  ) => {
    console.log(
      'first',
      selectedCategories,
      description,
      phone,
      email,
      location,
      media,
    );
    try {
      const payload = {
        categories: selectedCategories,
        images: media,
        description: description,
        contactNumber: phone,
        contactEmail: email,
        location: location,
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
        Authorization: `Bearer ${userdata.token}`,

        // Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzg4ZjVmMzczMmEzMWIzMWI5NzViMGUiLCJyb2xlIjoiYnV5ZXIiLCJyb2xlSWQiOjAsImlhdCI6MTczNzE4MDEyMH0.UsHVlk7CXbgl_3XtHpH0kQymaEErvFHyNSXj4T8LgqM'}`,
      };

      const response = await axios.post(
        `${apiURL}/api/requirementPost/postRequirement`,
        payload,
        {headers},
      );

      console.log('Response 171:', response.data);
      // Alert.alert('Success', 'Post created successfully!');
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

  const createSellerProfile = async (
    email,
    description,
    phone,
    location,
    profile,
    Availability,
    bussinessAddress,
    Socialmedia,
    ownerName,
    shopName,
    selectedScale,
    selectedAvailabity,
    products,
  ) => {
    try {
      const payload = {
        name: shopName,
        email: email,
        description: 'description',
        phone: '9999999999',
        googleData: {},
        profile:
          'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        fcmToken: fcmToken,
        openTime: '9:00 am',
        closeTime: '10:00 pm',
        categoriesPost: [
          {
            title: 'new Post 1 Title',
            categories: ['Technology', 'AI'],
            images: ['image1.jpg', 'image2.jpg'],
          },
          {
            title: 'new Post 2 Title',
            categories: ['Lifestyle', 'Travel'],
            images: ['image3.jpg', 'image4.jpg'],
          },
          {
            title: 'new Post 3 Title',
            categories: ['Food', 'Cooking'],
            images: ['image5.jpg', 'image6.jpg'],
          },
        ],
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
      // Alert.alert('Success', 'Post created successfully!');
      // navigation.navigate('BottomTabs');
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
        gender: gender[0],
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
      // console.log('userdata731', response.data);

      setUserfulldata(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error fetching shop:',
          error.response?.data || 'No error response',
        );
      } else {
        console.error('Failed to load shop data');
      }
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
        roleId: userRole === 'buyer' ? 0 : 1,
        fcmToken: fcmToken,
        gender: 'male',
      });

      const user = response.data;

      // navigation.navigate('BottomTabs'); // Redirect to home
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const VerifyOTP = async (email, otp) => {
    try {
      const response = await axios.post(`${apiURL}/api/user/verifyOTP`, {
        emailPhone: email,
        otp,
        fcmToken: fcmToken,
      });
      const user = response.data;
      setUserdata(response.data);
      // console.log('userdata', response.data);
      // ✅ Ensure AsyncStorage saves the token correctly
      await AsyncStorage.setItem('userToken', user.token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      // Debugging: Check if token is saved correctly
      const storedToken = await AsyncStorage.getItem('userToken');
      //  console.log('Stored Token:', storedToken); // 🔍 Should not be null

      if (response.data.msg) {
        console.log('Success', 'Verification successful!');
        navigation.navigate('AddressScreen');
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
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');

      // Clear user session
      setUserdata(null);
      setIsLoggedIn(false);

      console.log('User logged out successfully!');

      // Reset navigation and go to Login screen
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Something went wrong while logging out.');
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

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices(); // Ensure Google Play Services is available
      const {fcmToken} = await GoogleSignin.signIn(); // Start Google login flow

      const googleCredential = auth.GoogleAuthProvider.credential(fcmToken);

      return (
        await auth().signInWithCredential(googleCredential),
        navigation.navigate('BottomTabs')
      );
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      Alert.alert('Signed Out', 'You have been logged out!');
    } catch (error) {
      console.error(error);
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
        getPostsHistory,
        PostsHistory,
        PostReportissue,
        fcmToken,
        signInWithGoogle,
        signOut,
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
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthProvider, AuthContext};
