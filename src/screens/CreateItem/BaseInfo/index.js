import React, {useEffect, useState} from 'react';
import T from '../../../i18n';
import {Dimensions, StyleSheet, Text, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
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

const initialFormValues = {
  type: '',
  title: '',
  brand: '',
  model: '',
  serial: '',
};
const initialErrors = {
  type: '',
};

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

  const [errors, setErrors] = useState(initialErrors);
  useEffect(() => {
    dispatch(getTitle());
    dispatch(getBrands());
    dispatch(getTypes());
  }, []);
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
    if (brand > 0) {
      dispatch(getModels(brand));
    }
  }, [brand]);

  const handleTypeField = text => {
    setType(text);
    text.length === 0
      ? setErrors({...errors, type: T.t('error_required')})
      : setErrors({...errors, type: ''});
  };
  const handleCreate = () => {
    type.length === 0
      ? setErrors({...errors, type: T.t('error_required')})
      : setErrors({...errors, type: ''});
    if (errors.type.length === 0) {
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
      <KeyboardAwareScrollView style={styles.container}>
        <Card style={styles.card}>
          <AutocompleteDropdown
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
              style: styles.input,
              placeholderTextColor: 'gray',
              defaultValue: baseInfo.type,
              value: type,
            }}
            rightButtonsContainerStyle={styles.inputBtn}
            suggestionsListContainerStyle={styles.dropdown}
            containerStyle={{marginBottom: -15}}
          />
          <Text style={styles.err}>{errors.type}</Text>
          <AutocompleteDropdown
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
              defaultValue: baseInfo.title,
              value: title,
            }}
            rightButtonsContainerStyle={styles.inputBtn}
            suggestionsListContainerStyle={styles.dropdown}
          />
          <AutocompleteDropdown
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
              defaultValue: baseInfo.brand,
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
              defaultValue: baseInfo.model,
              value: model,
              style: !!brand.length
                ? styles.input
                : {...styles.input, opacity: 0.4},
              editable: brand.length > 0,
              placeholderTextColor: 'gray',
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
      </KeyboardAwareScrollView>
    </CreateItemContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginVertical: 15,
    alignSelf: 'center',
    paddingBottom: 30,
    paddingHorizontal: 15,
  },
  input: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: Dimensions.get('window').width / 1.3,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#929394',
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
    color: '#8c231f',
    width: Dimensions.get('window').width / 1.3,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: -15,
  },

  container: {
    flex: 1,
  },
  inputBtn: {
    right: 10,
    height: 55,
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  dropdown: {
    top: 0,
    width: Dimensions.get('window').width / 1.3,
    alignSelf: 'center',
    backgroundColor: '#C5CDD5',
    position: 'relative',
    zIndex: 2,
  },
});
export default BaseInfo;
