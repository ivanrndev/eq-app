import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CreateItemContainer} from '../CreateItemContainer';
import {useDispatch, useSelector} from 'react-redux';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {getLocations} from '../../../actions/actions';

import T from '../../../i18n';
import {width} from '../../../constants/dimentionsAndUnits';
import {saveLocation} from '../../../actions/createItem';
import {useNavigation} from '@react-navigation/native';

const ItemLocation = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [objects, selectedValue] = useSelector(({settings}) => [
    settings.locations ? settings.locations : [],
    settings.locationMain,
  ]);

  const [selectedLoc, setSelectedLoc] = useState('');
  const [selectedLocObj, setSelectedLocObj] = useState('');
  const [selectedObj, setSelectedObj] = useState('');
  const [selectedObjObj, setSelectedObjObj] = useState([]);

  useEffect(() => dispatch(getLocations()), []);

  const handleChangeLocation = itemValue => {
    dispatch(
      saveLocation({
        location: selectedLoc.name ? selectedLoc.name : selectedLoc,
        objects: selectedObj.name,
      }),
    );
    navigation.navigate('CreateItem');
  };

  const handleSelectObj = item => {
    setSelectedLoc(item);
    const selectedObj = objects.find(obj => obj._id === item.id);
    setSelectedLocObj(selectedObj);
    !!selectedObj && setSelectedObjObj(selectedObj.locations);
  };
  const objectLoc = selectedObjObj.length
    ? selectedObjObj.map(item => ({
        name: item,
        id: Math.floor(Math.random() * 1000),
      }))
    : [];

  return (
    <CreateItemContainer handleSave={handleChangeLocation}>
      <View style={styles.inputWrap}>
        <Text style={styles.left}>{T.t('object')}:</Text>
        <SearchableDropdown
          onItemSelect={item => handleSelectObj(item)}
          containerStyle={styles.inputContainer}
          onRemoveItem={() => setSelectedLoc('')}
          itemStyle={styles.item}
          textInputStyle={styles.input}
          itemsContainerStyle={styles.itemsContainer}
          items={objects.map(item => ({
            name: item.title,
            id: item._id,
          }))}
          resetValue={false}
          textInputProps={{
            placeholder: 'Choose object',
            underlineColorAndroid: 'transparent',
            style: styles.textInput,
            value: selectedLoc.name,
            onTextChange: text => setSelectedLoc({name: text}),
          }}
          listProps={{
            nestedScrollEnabled: true,
          }}
        />

        <Text style={styles.left}>{T.t('location')}:</Text>
        <SearchableDropdown
          onItemSelect={item => setSelectedObj(item)}
          containerStyle={styles.inputContainer2}
          onRemoveItem={() => setSelectedLoc('')}
          itemStyle={styles.item}
          textInputStyle={styles.input}
          itemsContainerStyle={styles.itemsContainer}
          items={objectLoc}
          resetValue={false}
          textInputProps={{
            placeholder: 'Choose location',
            underlineColorAndroid: 'transparent',
            style: styles.textInput,
            value: selectedObj.name,
            editable: !!selectedLoc.name,
            onTextChange: text => setSelectedObj({name: text}),
          }}
          listProps={{
            nestedScrollEnabled: true,
          }}
        />
      </View>
    </CreateItemContainer>
  );
};
export default ItemLocation;

const styles = StyleSheet.create({
  left: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 5,
    width: width / 1.1,
  },
  leftTwo: {
    fontSize: 14,
    textAlign: 'left',
    marginBottom: -95,
    marginLeft: 20,
  },
  inputWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    marginTop: 30,
  },
  inputContainer: {
    width: width / 1.1,
    height: 137,
    marginTop: 0,
  },
  itemsContainer: {
    maxHeight: 140,
    position: 'relative',
    zIndex: 1000,
  },
  inputContainer2: {
    width: width / 1.1,
    height: 162,
    position: 'relative',
    zIndex: -1,
  },
  input: {
    width: width / 1.1,
    height: 50,
  },
  item: {
    padding: 5,
    marginTop: 2,
    backgroundColor: '#EDF6FF',
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 5,
  },
  textInput: {
    padding: 12,
    borderColor: '#22215B',
    borderWidth: 1,
    borderRadius: 5,
  },
});
