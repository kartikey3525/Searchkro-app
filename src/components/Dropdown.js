import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {ThemeContext} from '../context/themeContext';
import {Text} from 'react-native';

const Width = Dimensions.get('window').width;

const Dropdown = ({
  placeholder,
  item = [],
  selectedValues,
  onChangeValue,
  half,
  single,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(item);
  const [value, setValue] = useState(single ? null : selectedValues || []);
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss(); // Dismiss keyboard if open
        setOpen(false); // Close dropdown on outside tap
      }}>
      <DropDownPicker
        style={[
          half ? styles.singleInputContainer : styles.multiInputContainer,
          {
            backgroundColor: isDark ? '#000' : '#FFF',
            borderColor: isDark ? '#555' : '#D3D3D3',
          },
        ]}
        placeholder={placeholder}
        placeholderStyle={{
          fontSize: 16,
          fontWeight: '400',
          color: isDark ? '#BDBDBD' : '#000',
        }}
        dropDownContainerStyle={[
          styles.dropdownContainer,
          {
            backgroundColor: isDark ? '#2B2B2B' : '#FFF',
            borderColor: isDark ? '#666' : '#E7E7E7',
            shadowColor: isDark ? '#000' : '#999',
          },
        ]}
        multiple={!single}
        open={open}
        value={value}
        items={items}
        mode={single ? 'SIMPLE' : 'BADGE'}
        listMode="SCROLLVIEW"
        setOpen={setOpen}
        setItems={setItems}
        setValue={setValue}
        onChangeValue={selected => {
          setValue(selected);
          onChangeValue(selected);

          if (single) {
            setTimeout(() => setOpen(false), 200); // ✅ Close dropdown after selection
          }
        }}
        textStyle={{color: isDark ? '#FFF' : '#000'}}
        ArrowDownIconStyle={{tintColor: isDark ? '#FFF' : '#000'}}
        ArrowUpIconStyle={{tintColor: isDark ? '#FFF' : '#000'}}
        tickIconStyle={{tintColor: isDark ? '#FFF' : '#000'}} // ✅ Tick color updates
        badgeStyle={{
          borderRadius: 6,
          padding: 5,
          borderWidth: 1,
          borderColor: isDark ? '#888' : '#000', // ✅ Border adjusts based on theme
        }}
        badgeTextStyle={{
          color: isDark ? '#000' : '#333', // 🔥 Explicitly set contrasting text color
          fontWeight: 'bold',
          backgroundColor: isDark ? 'transparent' : 'transparent', // ✅ Ensure no override
        }}
        listItemLabelStyle={{color: isDark ? '#DDD' : '#222'}}
      />
      {/* <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setOpen(false)}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity> */}
    </TouchableWithoutFeedback>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  multiInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    width: '90%',
    marginLeft: 20,
    height: 60,
    borderWidth: 1,
    borderRadius: 8,
  },
  singleInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    width: '43%',
    marginLeft: 20,
    height: 60,
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownContainer: {
    width: Width * 0.9,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 12,
    borderRadius: 10,
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000, // Ensures button is always visible
  },
  closeText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
