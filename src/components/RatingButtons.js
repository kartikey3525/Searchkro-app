import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';

const RatingButtons = () => {
  const [selectedRating, setSelectedRating] = useState(null); // State for selected rating

  const ratings = [
    {label: '3.5 +', value: '3.5+'},
    {label: '4.0', value: '4.0'},
    {label: '4.5 +', value: '4.5+'},
    {label: '5.0', value: '5.0'},
    {label: 'Any', value: 'Any'},
  ];

  const handlePress = value => {
    // Toggle the selected rating or unselect if already selected
    setSelectedRating(selectedRating === value ? null : value);
  };

  return (
    <View style={{alignSelf: 'flex-start'}}>
      {/* First row */}
      <View style={styles.row}>
        {ratings.slice(0, 3).map(rating => (
          <TouchableOpacity
            key={rating.value}
            style={[
              styles.button,
              selectedRating === rating.value && styles.selectedButton,
            ]}
            onPress={() => handlePress(rating.value)}>
            <Text
              style={[
                styles.text,
                selectedRating === rating.value && styles.selectedText,
              ]}>
              {rating.label}
            </Text>
            <>
              <Octicons
                name="star-fill"
                size={22}
                color={
                  selectedRating === rating.value
                    ? 'white'
                    : 'rgba(255, 219, 17, 1)'
                }
              />
            </>
          </TouchableOpacity>
        ))}
      </View>
      {/* Second row */}
      <View style={styles.row}>
        {ratings.slice(3).map(rating => (
          <TouchableOpacity
            key={rating.value}
            style={[
              styles.button,
              selectedRating === rating.value && styles.selectedButton,
            ]}
            onPress={() => handlePress(rating.value)}>
            <Text
              style={[
                styles.text,
                selectedRating === rating.value && styles.selectedText,
              ]}>
              {rating.label}
            </Text>
            {rating.label != 'Any' ? (
              <Octicons
                name="star-fill"
                size={22}
                color={
                  selectedRating === rating.value
                    ? 'white'
                    : 'rgba(255, 219, 17, 1)'
                }
              />
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: '5%',
  },
  button: {
    borderRadius: 15,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    borderColor: 'rgba(228, 228, 228, 1)',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: '5%',
    backgroundColor: 'white', // Default background
  },
  selectedButton: {
    backgroundColor: 'rgba(6, 196, 217, 1)', // Highlighted background
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 6,
    color: 'black', // Default text color
  },
  selectedText: {
    color: 'rgba(255, 255, 255, 1)', // Highlighted text color
  },
});

export default RatingButtons;
