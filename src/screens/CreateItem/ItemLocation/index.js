import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {CreateItemContainer} from '../CreateItemContainer';
import {useDispatch, useSelector} from 'react-redux';
import {getLocations} from '../../../actions/actions';

import T from '../../../i18n';
import {width} from '../../../constants/dimentionsAndUnits';
import {saveLocation} from '../../../actions/createItem';
import {useNavigation} from '@react-navigation/native';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';

const ItemLocation = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [objects, location] = useSelector(({settings, createItem}) => [
    settings.locations ? settings.locations : [],
    createItem.location,
  ]);

  const [selectedLoc, setSelectedLoc] = useState('');
  const [selectedLocObj, setSelectedLocObj] = useState('');
  const [selectedObj, setSelectedObj] = useState('');
  const [selectedObjObj, setSelectedObjObj] = useState([]);

  useEffect(() => dispatch(getLocations()), []);
  useEffect(() => {
    if (selectedLoc && selectedLoc.name.length === 0) {
      setSelectedObj('');
    }
  }, [selectedLoc.name]);
  useEffect(() => {
    if (!location.location && !location.object) {
      setSelectedLoc('');
      setSelectedLoc('');
      setSelectedObj('');
      setSelectedObjObj('');
    }
  }, [location]);
  const handleChangeLocation = itemValue => {
    dispatch(
      saveLocation({
        location: selectedLoc.name,
        objects: selectedObj.name,
      }),
    );
    navigation.navigate('CreateItem');
  };

  const handleSelectObj = item => {
    setSelectedLoc(item);
    if (!!item) {
      const selectedObj =
        objects.length > 0 ? objects.find(obj => obj._id === item.id) : [];
      setSelectedLocObj(selectedObj);
      !!selectedObj && setSelectedObjObj(selectedObj.locations);
    }
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
        <AutocompleteDropdown
          clearOnFocus={false}
          closeOnBlur={true}
          closeOnSubmit={true}
          showClear={false}
          onChangeText={text => setSelectedLoc({name: text})}
          onSelectItem={item => {
            handleSelectObj(item);
            setSelectedLoc({name: item ? item.title : ''});
          }}
          dataSet={() =>
            objects.length
              ? objects.map(item => ({
                  title: item ? item.title : '',
                  id: item ? item._id : '',
                }))
              : []
          }
          textInputProps={{
            placeholder: 'Choose object',
            autoCorrect: false,
            autoCapitalize: 'none',
            style: styles.inputDropdown,
            placeholderTextColor: 'gray',
            value: selectedLoc.name,
            defaultValue: location.location,
          }}
          rightButtonsContainerStyle={styles.inputBtn}
          suggestionsListContainerStyle={styles.dropdown}
        />

        <Text style={styles.left}>{T.t('location')}:</Text>
        <AutocompleteDropdown
          clearOnFocus={false}
          closeOnBlur={true}
          closeOnSubmit={true}
          showClear={false}
          onChangeText={text => setSelectedObj({name: text})}
          onSelectItem={item => setSelectedObj({name: item ? item.title : ''})}
          dataSet={() =>
            objects.length
              ? objectLoc.map(item => ({
                  title: item ? item.name : '',
                  id: item ? item._id : '',
                }))
              : []
          }
          textInputProps={{
            placeholder: 'Choose object',
            autoCorrect: false,
            autoCapitalize: 'none',
            style: styles.inputDropdown,
            placeholderTextColor: 'gray',
            value: selectedObj.name,
            defaultValue: location.object,
          }}
          rightButtonsContainerStyle={styles.inputBtn}
          suggestionsListContainerStyle={styles.dropdown}
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

  inputWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    marginVertical: 30,
    minHeight: 200,
  },
  textInput: {
    padding: 12,
    borderColor: '#22215B',
    borderWidth: 1,
    borderRadius: 5,
  },
  inputDropdown: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#929394',
    height: 55,
    borderRadius: 5,
    padding: 15,
  },
  inputBtn: {
    right: 10,
    height: 55,
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  dropdown: {
    top: 0,
    width: Dimensions.get('window').width / 1.1,
    alignSelf: 'center',
    backgroundColor: '#C5CDD5',
    position: 'relative',
    zIndex: 2,
  },
});
