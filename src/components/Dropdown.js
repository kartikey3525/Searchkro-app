import React, {useState} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const Width = Dimensions.get('window').width;

const Dropdown = ({
  placeholder,
  item = [],
  selectedValues,
  onChangeValue,
  half,
  single, // Controls whether selection is single or multiple
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(item); // Initialize state with props
  const [value, setValue] = useState(single ? null : selectedValues || []);

  return (
    <DropDownPicker
      style={half ? styles.singleInputContainer : styles.multiInputContainer}
      placeholder={placeholder}
      placeholderStyle={{fontSize: 16, fontWeight: '400'}}
      dropDownContainerStyle={{
        borderWidth: 1,
        width: half ? Width * 0.43 : Width * 0.9,
        borderColor: 'rgba(231, 231, 231, 1)',
        alignSelf: 'left',
        marginLeft: 20,
        marginTop: 12,
        borderRadius: 10,
        elevation: 2,
      }}
      setValue={selected => {
        setValue(selected);
        onChangeValue(selected);
      }}
      multiple={!single} // If single is true, disable multiple selections
      open={open}
      value={value}
      items={items}
      mode={single ? 'SIMPLE' : 'BADGE'} // Use 'SIMPLE' mode when single selection is enabled
      listMode="SCROLLVIEW"
      setOpen={setOpen}
      setItems={setItems}
    />
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  multiInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.12)',
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
    borderColor: 'rgba(0, 0, 0, 0.12)',
    alignSelf: 'flex-start',
    width: '43%',
    marginLeft: 20,
    height: 60,
    borderWidth: 1,
    borderRadius: 8,
  },
});
