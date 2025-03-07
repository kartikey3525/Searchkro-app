import React, {useEffect, useState} from 'react';
import {View, Keyboard, Animated} from 'react-native';

const KeyboardAvoidingContainer = ({children, style}) => {
  const [translateY] = useState(new Animated.Value(0));

  useEffect(() => {
    const keyboardDidShow = event => {
      Animated.timing(translateY, {
        toValue: -event.endCoordinates.height, // Move content up
        duration: 250,
        useNativeDriver: true,
      }).start();
    };

    const keyboardDidHide = () => {
      Animated.timing(translateY, {
        toValue: 0, // Reset position
        duration: 250,
        useNativeDriver: true,
      }).start();
    };

    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Animated.View style={[{flex: 1, transform: [{translateY}]}, style]}>
      {children}
    </Animated.View>
  );
};

export default KeyboardAvoidingContainer;
