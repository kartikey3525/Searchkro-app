import React, {useContext, useState} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {ThemeContext} from '../context/themeContext';

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
    <DropDownPicker
      style={[
        half ? styles.singleInputContainer : styles.multiInputContainer,
        {
          backgroundColor: isDark ? '#121212' : '#fff',
          borderColor: isDark ? '#333' : '#fff',
        },
      ]}
      placeholder={placeholder}
      placeholderStyle={{
        fontSize: 16,
        fontWeight: '400',
        color: isDark ? '#E0E0E0' : '#000',
      }}
      dropDownContainerStyle={[
        styles.dropdownContainer,
        {
          backgroundColor: isDark ? '#252525' : '#fff',
          borderColor: isDark ? '#444' : 'rgba(231, 231, 231, 1)',
        },
      ]}
      setValue={selected => {
        setValue(selected);
        onChangeValue(selected);
      }}
      multiple={!single}
      open={open}
      value={value}
      items={items}
      mode={single ? 'SIMPLE' : 'BADGE'}
      listMode="SCROLLVIEW"
      setOpen={setOpen}
      setItems={setItems}
      textStyle={{color: isDark ? 'white' : 'black'}}
      ArrowDownIconStyle={{tintColor: isDark ? 'white' : 'black'}} // Fix for arrow color
      ArrowUpIconStyle={{tintColor: isDark ? 'white' : 'black'}} // Fix for arrow color
    />
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
    alignSelf: 'left',
    marginLeft: 20,
    marginTop: 12,
    borderRadius: 10,
    elevation: 2,
  },
});
