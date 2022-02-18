import React, {useEffect, useState} from 'react';
import T from '../../../i18n';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {Card} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getBrands,
  getModels,
  getTitle,
  getTypes,
  saveBaseItemInfo,
} from '../../../actions/createItem';
import {CreateItemContainer} from '../CreateItemContainer';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';

const BaseInfo = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [baseInfo, types, brands, titles, models] = useSelector(
    ({createItem}) => [
      createItem.baseInfo,
      createItem.types,
      createItem.brands,
      createItem.titles,
      createItem.models,
    ],
  );

  const [type, setType] = useState(baseInfo.type);
  const [title, setTitle] = useState(baseInfo.title);
  const [brand, setBrand] = useState(baseInfo.brand);
  const [model, setModel] = useState(baseInfo.model);
  const [serial, setSerial] = useState(baseInfo.serial);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    dispatch(getTypes(type));
  }, [type]);

  useEffect(() => {
    dispatch(getTitle(title));
  }, [title]);

  useEffect(() => {
    dispatch(getBrands(brand));
  }, [brand]);

  useEffect(() => {
    if (
      !baseInfo.type &&
      !baseInfo.title &&
      !baseInfo.model &&
      !baseInfo.serial &&
      !baseInfo.type
    ) {
      setType('');
      setTitle('');
      setBrand('');
      setModel('');
      setSerial('');
    }
  }, [baseInfo]);
  useEffect(() => {
    if (brand.length > 0) {
      dispatch(getModels(brand, title));
    }
  }, [brand, model]);

  const handleTypeField = text => {
    setType(text);
    !text ? setErrors(T.t('error_required')) : setErrors('');
  };
  const handleCreate = () => {
    type.length === 0 ? setErrors(T.t('error_required')) : setErrors('');
    if (errors.length === 0) {
      dispatch(
        saveBaseItemInfo({...baseInfo, type, title, model, brand, serial}),
      );
      navigation.navigate('CreateItem');
    }
  };

  return (
    <CreateItemContainer
      handleSave={handleCreate}
      isSaveBtnEnabled={type.length > 0}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Card style={styles.card}>
          <AutocompleteDropdown
            onFocus={()=>{
              dispatch(getTypes(type));
            }}
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={true}
            showClear={false}
            onChangeText={handleTypeField}
            onSelectItem={text => handleTypeField(text ? text.title : '')}
            dataSet={() =>
              types.map(type => ({id: type._id, title: type.title}))
            }
            textInputProps={{
              placeholder: `${T.t('detail_type')}*`,
              autoCorrect: false,
              autoCapitalize: 'none',
              style: errors.length > 0 ? styles.errorInput : styles.input,
              placeholderTextColor: 'gray',
              value: type,
            }}
            rightButtonsContainerStyle={styles.inputBtn}
            suggestionsListContainerStyle={styles.dropdown}
            containerStyle={{marginBottom: -15}}
          />
          <Text style={styles.err}>{errors}</Text>

          <AutocompleteDropdown
            onFocus={()=>{
              dispatch(getTypes(title));
            }}
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={true}
            showClear={false}
            onChangeText={setTitle}
            onSelectItem={text => setTitle(text ? text.title : '')}
            dataSet={() =>
              titles.map(type => ({id: type._id, title: type.title}))
            }
            textInputProps={{
              placeholder: T.t('detail_title'),
              autoCorrect: false,
              autoCapitalize: 'none',
              style: styles.input,
              placeholderTextColor: 'gray',
              value: title,
            }}
            rightButtonsContainerStyle={styles.inputBtn}
            suggestionsListContainerStyle={styles.dropdown}
          />
          <AutocompleteDropdown
            onFocus={()=>{
              dispatch(getTypes(brand));
            }}
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={true}
            showClear={false}
            onChangeText={setBrand}
            onSelectItem={text => setBrand(text ? text.title : '')}
            dataSet={() =>
              brands.map(type => ({id: type._id, title: type.title}))
            }
            textInputProps={{
              placeholder: T.t('detail_brand'),
              autoCorrect: false,
              autoCapitalize: 'none',
              style: styles.input,
              placeholderTextColor: 'gray',
              value: brand,
            }}
            rightButtonsContainerStyle={styles.inputBtn}
            suggestionsListContainerStyle={styles.dropdown}
          />
          <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={true}
            showClear={false}
            onChangeText={setModel}
            onSelectItem={text => setModel(text ? text.title : '')}
            dataSet={() =>
              models.map(item => ({
                id: Math.floor(Math.random() * 1000),
                title: item,
              }))
            }
            textInputProps={{
              placeholder: T.t('detail_model'),
              autoCorrect: false,
              autoCapitalize: 'none',
              style: !!brand.length
                ? styles.input
                : {...styles.input, opacity: 0.4},
              editable: brand.length > 0,
              placeholderTextColor: 'gray',
              value: model,
            }}
            rightButtonsContainerStyle={styles.inputBtn}
            suggestionsListContainerStyle={styles.dropdown}
          />
          <TextInput
            defaultValue={baseInfo.serial}
            value={serial}
            style={styles.input}
            placeholder={T.t('detail_serial')}
            placeholderTextColor="gray"
            onChangeText={setSerial}
          />
        </Card>
      </TouchableWithoutFeedback>
    </CreateItemContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginVertical: 10,
    alignSelf: 'center',
    paddingBottom: 30,
    paddingHorizontal: 15,
    position: 'relative',
    zIndex: 1,
  },
  input: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: Dimensions.get('window').width / 1.3,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#929394',
    height: 50,
    zIndex: -1,
    borderRadius: 5,
    padding: 15,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: '#8c231f',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: Dimensions.get('window').width / 1.3,
    backgroundColor: '#fff',
    height: 55,
    zIndex: -1,
    borderRadius: 5,
    padding: 15,
  },
  secondInput: {
    marginTop: 0,
  },
  err: {
    height: 15,
    fontSize: 10,
    color: '#8c231f',
    width: Dimensions.get('window').width / 1.3,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: -10,
  },

  container: {
    flex: 1,
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
    width: Dimensions.get('window').width / 1.3,
    alignSelf: 'center',
    backgroundColor: '#C5CDD5',
    position: 'relative',
    zIndex: 1002,
  },
});
export default BaseInfo;
