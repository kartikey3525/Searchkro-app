import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  Modal,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useIsFocused} from '@react-navigation/native';
import {ThemeContext} from '../context/themeContext';

import {Dimensions} from 'react-native';
import {AuthContext} from '../context/authcontext';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
export default function ProfileScreen({navigation}) {
  const {theme, changeTheme} = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [selectedtheme, setselectedtheme] = useState('SystemDefault');
  const {userRole} = useContext(AuthContext);

  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  useEffect(() => {}, [isFocused]);

  return (
    <View style={[styles.container]}>
      <Image
        source={require('../assets/profilebg.png')}
        style={{width: Width, height: Height, bottom: 20}}
      />

      <View
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDark
                ? 'rgba(0, 0, 0, 0.8)'
                : 'rgba(255, 255, 255, 0.79)',
            },
          ]}
          // onPress={() => navigation.navigate('Home')}
        >
          <View style={styles.modalContent}>
            <Text
              style={[
                styles.recListText,
                {
                  color: isDark ? 'white' : 'black',
                  fontSize: 24,
                  marginTop: '10%',
                  alignSelf: 'flex-start',
                  width: '100%',
                  margin: 10,
                  marginLeft: 2,
                },
              ]}>
              Profile
            </Text>

            <View
              style={{
                flexDirection: 'row',
                width: Width * 0.9,
                height: Height * 0.12,
                backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                alignSelf: 'center',
                alignItems: 'center',
                elevation: 10,
                borderRadius: 5,
              }}>
              <Image
                source={require('../assets/User-image.png')}
                style={{
                  width: Width * 0.15,
                  height: Height * 0.07,
                  marginLeft: 10,
                  marginRight: 10,
                }}
                resizeMode="contain"
              />

              <View>
                <Text
                  style={[
                    styles.recListText,
                    {
                      fontSize: 14,
                      width: Width * 0.5,
                      color: isDark ? 'white' : 'black',
                      marginLeft: 2,
                    },
                  ]}>
                  Itunuoluwa Abidoye
                </Text>

                <Text
                  style={[
                    styles.recListText,
                    {
                      color: isDark
                        ? 'rgba(253, 253, 253, 0.59)'
                        : 'rgba(23, 23, 23, 0.59)',
                      marginLeft: 2,
                    },
                  ]}>
                  @Itunuoluwa
                </Text>
              </View>
              <Feather
                onPress={() =>
                  userRole === 'buyer'
                    ? navigation.navigate('editProfile')
                    : null
                }
                name="edit"
                size={24}
                color={isDark ? 'white' : 'rgba(0, 0, 0, 0.34)'}
                style={{marginLeft: 20, padding: 5}}
              />
            </View>

            <View
              style={{
                width: Width * 0.9,
                height: Height * userRole === 'buyer' ? 0.63 : 0.63,
                marginTop: 14,
                elevation: 5,
                shadowColor: isDark ? '#fff' : '#000',
                borderRadius: 5,
              }}>
              <Pressable
                style={{
                  width: Width * 0.9,
                  height: Height * 0.065,
                  backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                  justifyContent: 'center',
                  borderBottomWidth: 1,
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                  borderTopStartRadius: 5,
                  borderTopRightRadius: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <Image
                    source={require('../assets/profile-2.png')}
                    style={{
                      width: 25,
                      height: 20,
                      marginLeft: 15,
                    }}
                    resizeMode="contain"
                  />

                  <Text
                    style={[
                      styles.recListText,
                      {
                        fontSize: 15,
                        width: Width * 0.69,
                        color: isDark ? 'white' : 'black',
                        marginLeft: 15,
                        fontWeight: '600',
                        letterSpacing: 0.5,
                      },
                    ]}>
                    Profile Settings
                  </Text>

                  <AntDesign
                    onPress={() => navigation.goBack()}
                    name="right"
                    size={16}
                    color={isDark ? 'white' : 'rgba(0, 0, 0, 0.34)'}
                    style={{padding: 5}}
                  />
                </View>
              </Pressable>

              <Pressable
                style={{
                  width: '100%',
                  height: Height * 0.065,
                  backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                  justifyContent: 'center',
                  borderBottomWidth: 1,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                }}
                onPress={() => navigation.navigate('Notification')}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <Image
                    source={require('../assets/notification-setting.png')}
                    style={{
                      width: 25,
                      height: 20,
                      marginLeft: 15,
                    }}
                    resizeMode="contain"
                  />

                  <Text
                    style={[
                      styles.recListText,
                      {
                        fontSize: 15,
                        width: Width * 0.69,
                        color: isDark ? 'white' : 'black',
                        marginLeft: 15,
                        fontWeight: '600',
                        letterSpacing: 0.5,
                      },
                    ]}>
                    Notifications setting
                  </Text>

                  <AntDesign
                    onPress={() => navigation.goBack()}
                    name="right"
                    size={16}
                    color={isDark ? 'white' : 'rgba(0, 0, 0, 0.34)'}
                    style={{padding: 5}}
                  />
                </View>
              </Pressable>

              <Pressable
                style={{
                  width: '100%',
                  height: Height * 0.065,
                  backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                  justifyContent: 'center',
                  borderBottomWidth: 1,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                }}
                onPress={() => navigation.navigate('helpscreen')}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <Image
                    source={require('../assets/help.png')}
                    style={{
                      width: 26,
                      height: 22,
                      marginLeft: 15,
                    }}
                    resizeMode="contain"
                  />

                  <Text
                    style={[
                      styles.recListText,
                      {
                        fontSize: 15,
                        width: Width * 0.69,
                        color: isDark ? 'white' : 'black',
                        marginLeft: 15,
                        fontWeight: '500',
                      },
                    ]}>
                    Help and Support
                  </Text>

                  <AntDesign
                    onPress={() => navigation.goBack()}
                    name="right"
                    size={16}
                    color={isDark ? 'white' : 'rgba(0, 0, 0, 0.34)'}
                    style={{padding: 5}}
                  />
                </View>
              </Pressable>

              <Pressable
                style={{
                  width: '100%',
                  height: Height * 0.065,
                  backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                  justifyContent: 'center',
                  borderBottomWidth: 1,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                }}
                onPress={() => navigation.navigate('privacyandsecurity')}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <Image
                    source={require('../assets/privacy.png')}
                    style={{
                      width: 25,
                      height: 20,
                      marginLeft: 15,
                    }}
                    resizeMode="contain"
                  />

                  <Text
                    style={[
                      styles.recListText,
                      {
                        fontSize: 15,
                        width: Width * 0.69,
                        color: isDark ? 'white' : 'black',
                        marginLeft: 15,
                        fontWeight: '500',
                        letterSpacing: 0.5,
                      },
                    ]}>
                    Privacy and Security
                  </Text>

                  <AntDesign
                    onPress={() => navigation.goBack()}
                    name="right"
                    size={16}
                    color={isDark ? 'white' : 'rgba(0, 0, 0, 0.34)'}
                    style={{padding: 5}}
                  />
                </View>
              </Pressable>

              {userRole === 'buyer' ? (
                <>
                  <Pressable
                    style={{
                      width: '100%',
                      height: Height * 0.065,
                      backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                      justifyContent: 'center',
                      borderBottomWidth: 1,
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    }}
                    onPress={() => navigation.navigate('payments')}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                        alignSelf: 'flex-start',
                        alignItems: 'center',
                        borderRadius: 5,
                      }}>
                      <Image
                        source={require('../assets/payment.png')}
                        style={{
                          width: 25,
                          height: 20,
                          marginLeft: 15,
                        }}
                        resizeMode="contain"
                      />

                      <Text
                        style={[
                          styles.recListText,
                          {
                            fontSize: 15,
                            width: Width * 0.69,
                            color: isDark ? 'white' : 'black',
                            marginLeft: 15,
                            fontWeight: '500',
                          },
                        ]}>
                        Payments
                      </Text>

                      <AntDesign
                        onPress={() => navigation.goBack()}
                        name="right"
                        size={16}
                        color={isDark ? 'white' : 'rgba(0, 0, 0, 0.34)'}
                        style={{padding: 5}}
                      />
                    </View>
                  </Pressable>

                  <Pressable
                    style={{
                      width: '100%',
                      height: Height * 0.065,
                      backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                      justifyContent: 'center',
                      borderBottomWidth: 1,
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    }}
                    onPress={() => navigation.navigate('referandearn')}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                        alignSelf: 'flex-start',
                        alignItems: 'center',
                        borderRadius: 5,
                      }}>
                      <Image
                        source={require('../assets/refer.png')}
                        style={{
                          width: 25,
                          height: 25,
                          marginLeft: 15,
                        }}
                        resizeMode="contain"
                      />

                      <Text
                        style={[
                          styles.recListText,
                          {
                            fontSize: 15,
                            width: Width * 0.69,
                            color: isDark ? 'white' : 'black',
                            marginLeft: 15,
                            fontWeight: '500',
                            letterSpacing: 0.5,
                          },
                        ]}>
                        Refer and Earn
                      </Text>

                      <AntDesign
                        onPress={() => navigation.goBack()}
                        name="right"
                        size={16}
                        color={isDark ? 'white' : 'rgba(0, 0, 0, 0.34)'}
                        style={{padding: 5}}
                      />
                    </View>
                  </Pressable>
                </>
              ) : null}

              <Pressable
                style={{
                  width: '100%',
                  height: Height * 0.065,
                  backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                  justifyContent: 'center',
                  borderBottomWidth: 1,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                }}
                onPress={() => navigation.navigate('legalpolicies')}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <Image
                    source={require('../assets/legal.png')}
                    style={{
                      width: 25,
                      height: 20,
                      marginLeft: 15,
                    }}
                    resizeMode="contain"
                  />

                  <Text
                    style={[
                      styles.recListText,
                      {
                        fontSize: 15,
                        width: Width * 0.69,
                        color: isDark ? 'white' : 'black',
                        marginLeft: 15,
                        fontWeight: '500',
                        letterSpacing: 0.5,
                      },
                    ]}>
                    Legal Policies
                  </Text>

                  <AntDesign
                    onPress={() => navigation.goBack()}
                    name="right"
                    size={16}
                    color={isDark ? 'white' : 'rgba(0, 0, 0, 0.34)'}
                    style={{padding: 5}}
                  />
                </View>
              </Pressable>

              {userRole === 'buyer' ? (
                <Pressable
                  style={{
                    width: '100%',
                    height: Height * 0.065,
                    backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                    justifyContent: 'center',
                    borderBottomWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                  }}
                  onPress={() => navigation.navigate('preferences')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                      alignSelf: 'flex-start',
                      alignItems: 'center',
                      borderRadius: 5,
                    }}>
                    <Image
                      source={require('../assets/prefernce.png')}
                      style={{
                        width: 25,
                        height: 25,
                        marginLeft: 15,
                      }}
                      resizeMode="contain"
                    />

                    <Text
                      style={[
                        styles.recListText,
                        {
                          fontSize: 15,
                          width: Width * 0.69,
                          color: isDark ? 'white' : 'black',
                          marginLeft: 15,
                          fontWeight: '500',
                          letterSpacing: 0.5,
                        },
                      ]}>
                      Prefernces
                    </Text>

                    <AntDesign
                      onPress={() => navigation.goBack()}
                      name="right"
                      size={16}
                      color={isDark ? 'white' : 'rgba(0, 0, 0, 0.34)'}
                      style={{padding: 5}}
                    />
                  </View>
                </Pressable>
              ) : null}

              <Pressable
                style={{
                  width: '100%',
                  height: Height * 0.065,
                  backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                  justifyContent: 'center',
                  borderBottomWidth: 1,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                }}
                onPress={() => setModalVisible(true)}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <Image
                    source={require('../assets/theme.png')}
                    style={{
                      width: 25,
                      height: 20,
                      marginLeft: 15,
                    }}
                    resizeMode="contain"
                  />

                  <Text
                    style={[
                      styles.recListText,
                      {
                        fontSize: 15,
                        width: Width * 0.69,
                        color: isDark ? 'white' : 'black',
                        marginLeft: 15,
                        fontWeight: '500',
                        letterSpacing: 0.5,
                      },
                    ]}>
                    Theme
                  </Text>

                  <AntDesign
                    onPress={() => navigation.goBack()}
                    name="right"
                    size={16}
                    color={isDark ? 'white' : 'rgba(0, 0, 0, 0.34)'}
                    style={{padding: 5}}
                  />
                </View>
              </Pressable>

              <Pressable
                style={{
                  width: '100%',
                  height: Height * 0.065,
                  backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                  justifyContent: 'center',
                  borderBottomWidth: 1,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  borderEndEndRadius: 5,
                  borderBottomLeftRadius: 5,
                }}
                onPress={() => setModalVisible2(true)}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: isDark ? 'rgb(0, 0, 0)' : 'white',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <Image
                    source={require('../assets/logout.png')}
                    style={{
                      width: 25,
                      height: 20,
                      marginLeft: 15,
                    }}
                    resizeMode="contain"
                  />

                  <Text
                    style={[
                      styles.recListText,
                      {
                        fontSize: 15,
                        width: Width * 0.69,
                        color: isDark ? 'white' : 'black',
                        marginLeft: 15,
                        fontWeight: '500',
                        letterSpacing: 0.5,
                      },
                    ]}>
                    Logout
                  </Text>

                  <AntDesign
                    onPress={() => navigation.goBack()}
                    name="right"
                    size={16}
                    color={isDark ? 'white' : 'rgba(0, 0, 0, 0.34)'}
                    style={{padding: 5}}
                  />
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <Modal
        transparent={modalVisible}
        visible={modalVisible}
        animationType="slide">
        <Pressable
          style={styles.modalContainer2}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent2}>
            <Text
              style={[
                styles.modalText,
                {
                  fontWeight: '600',
                  marginBottom: 10,
                  fontSize: 25,
                  marginLeft: 30,
                  textAlign: 'left',
                },
              ]}>
              Choose theme
            </Text>

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'rgba(243, 243, 243, 1)',
                width: '100%',
                height: 5,
              }}
            />

            <Pressable
              onPress={() => {
                setselectedtheme('SystemDefault'), changeTheme('SystemDefault');
              }}
              style={{
                flexDirection: 'row',
                marginLeft: 30,
                marginTop: 15,
                alignItems: 'center',
              }}>
              {selectedtheme === 'SystemDefault' ? (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgb(0, 0, 0)',
                  }}>
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      borderWidth: 2,
                      borderColor: 'white',
                      borderRadius: 10,
                      backgroundColor: 'rgb(0, 0, 0)',
                    }}></View>
                </View>
              ) : (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2.3,
                    borderColor: 'rgba(0, 0, 0, 0.11)',
                    backgroundColor: 'rgb(255, 255, 255)',
                  }}></View>
              )}
              <Text
                style={[
                  styles.modalText,
                  {
                    fontWeight: '400',
                    marginLeft: 20,
                    marginBottom: 0,
                    fontSize: 19,
                    textAlign: 'left',
                  },
                ]}>
                System Default
              </Text>
            </Pressable>

            <Pressable
              onPress={() => [setselectedtheme('Dark'), changeTheme('dark')]}
              style={{
                flexDirection: 'row',
                marginLeft: 30,
                marginTop: 15,
                alignItems: 'center',
              }}>
              {selectedtheme === 'Dark' ? (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgb(0, 0, 0)',
                  }}>
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      borderWidth: 2,
                      borderColor: 'white',
                      borderRadius: 10,
                      backgroundColor: 'rgb(0, 0, 0)',
                    }}></View>
                </View>
              ) : (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2.3,
                    borderColor: 'rgba(0, 0, 0, 0.11)',
                    backgroundColor: 'rgb(255, 255, 255)',
                  }}></View>
              )}
              <Text
                style={[
                  styles.modalText,
                  {
                    fontWeight: '400',
                    marginLeft: 20,
                    marginBottom: 0,
                    fontSize: 19,
                    textAlign: 'left',
                  },
                ]}>
                Dark
              </Text>
            </Pressable>

            <Pressable
              onPress={() => [setselectedtheme('Light'), changeTheme('light')]}
              style={{
                flexDirection: 'row',
                marginLeft: 30,
                marginTop: 15,
                alignItems: 'center',
              }}>
              {selectedtheme === 'Light' ? (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgb(0, 0, 0)',
                  }}>
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      borderWidth: 2,
                      borderColor: 'white',
                      borderRadius: 10,
                      backgroundColor: 'rgb(0, 0, 0)',
                    }}></View>
                </View>
              ) : (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2.3,
                    borderColor: 'rgba(0, 0, 0, 0.11)',
                    backgroundColor: 'rgb(255, 255, 255)',
                  }}></View>
              )}
              <Text
                style={[
                  styles.modalText,
                  {
                    fontWeight: '400',
                    marginLeft: 20,
                    marginBottom: 0,
                    fontSize: 19,
                    textAlign: 'left',
                  },
                ]}>
                Light
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        transparent={modalVisible2}
        visible={modalVisible2}
        animationType="slide">
        <View style={styles.modalContainer3}>
          <View style={styles.modalContent3}>
            <Text
              style={[
                styles.modalText,
                {fontWeight: 'bold', marginBottom: 10, fontSize: 20},
              ]}>
              Log out ?
            </Text>
            <Text style={styles.modalText}>
              Are you sure you want to log out your account ?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible2(false);
                }}
                style={styles.cancelButton}>
                <Text style={[styles.buttonText, {color: 'black'}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={handleDelete}
                style={styles.deleteButton}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.79)',
  },

  modalContent: {
    borderRadius: 10,
    padding: 20,
  },
  square: {
    backgroundColor: 'rgba(248, 247, 247, 1)',
    width: Width * 0.21,
    marginRight: '2%',
    height: 86,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  rectangle: {
    backgroundColor: 'rgba(248, 247, 247, 1)',
    width: 120,
    marginRight: 10,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  rectangle2: {
    backgroundColor: 'rgb(255, 255, 255)',
    width: 125,
    marginRight: 10,
    height: 200,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  newsDescription: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    right: 6,
    marginTop: 4,
  },
  recListText: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 110,
    color: '#000',
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
    textAlign: 'left',
    marginTop: 30,
    fontWeight: 'bold',
    marginBottom: 6,
    fontFamily: 'Poppins-Bold',
  },
  blueBotton: {
    backgroundColor: '#00AEEF',
    width: '88%',
    height: 56,
    borderRadius: 10,
    margin: 10,
    marginBottom: 20,
    marginTop: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgb(0, 0, 0)',
    borderWidth: 1,
    borderRadius: 14,
    height: 45,
    padding: 1,
  },
  searchInput: {
    width: '68%',
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: '500',
    color: 'black',
    height: 45,
    left: 16,
  },
  modalContainer2: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent2: {
    width: Width * 0.9,
    height: Height * 0.25,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    marginBottom: '80%',
    alignItems: 'flex-start',
    elevation: 10,
  },
  modalText: {
    fontSize: 18,
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
  modalContainer3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent3: {
    width: Width * 0.9,
    height: Height * 0.25,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
});
