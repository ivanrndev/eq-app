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
  useEffect(() => {
    dispatch(getTitle());
    dispatch(getBrands());
    dispatch(getTypes());
  }, []);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState(initialErrors);
  useEffect(() => {
    if (
      !baseInfo.type &&
      !baseInfo.title &&
      !baseInfo.model &&
      !baseInfo.serial &&
      !baseInfo.type
    ) {
      setFormValues(initialFormValues);
    }
  }, [baseInfo]);
  useEffect(() => {
    if (formValues.brand > 0) {
      dispatch(getModels(formValues.brand));
    }
  }, [formValues.brand]);

  const handleTextChange = (text, name) => {
    setFormValues({...formValues, [name]: text});

    if (name === 'type') {
      text.length === 0
        ? setErrors({...errors, type: T.t('error_required')})
        : setErrors({...errors, type: ''});
    }
  };
  const handleCreate = () => {
    formValues.type.length === 0
      ? setErrors({...errors, type: T.t('error_required')})
      : setErrors({...errors, type: ''});
    if (errors.type.length === 0) {
      dispatch(saveBaseItemInfo({...baseInfo, ...formValues}));
      navigation.navigate('CreateItem');
      /*     setFormValues(initialFormValues);*/
    }
  };
  return (
    <CreateItemContainer
      handleSave={handleCreate}
      isSaveBtnEnabled={formValues.type.length > 0}>
      <KeyboardAwareScrollView style={styles.container}>
        <Card style={styles.card}>
          <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={true}
            onChangeText={text => handleTextChange(text ?? '', 'type')}
            onSelectItem={text =>
              handleTextChange(text ? text.title : '', 'type')
            }
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
              value: formValues.type,
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
            onChangeText={text => handleTextChange(text ?? '', 'title')}
            onSelectItem={text =>
              handleTextChange(text ? text.title : '', 'title')
            }
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
              value: formValues.title,
            }}
            rightButtonsContainerStyle={styles.inputBtn}
            suggestionsListContainerStyle={styles.dropdown}
          />
          <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={true}
            onChangeText={text => handleTextChange(text ?? '', 'brand')}
            onSelectItem={text =>
              handleTextChange(text ? text.title : '', 'brand')
            }
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
              value: formValues.brand,
            }}
            rightButtonsContainerStyle={styles.inputBtn}
            suggestionsListContainerStyle={styles.dropdown}
          />
          <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={true}
            onChangeText={text => handleTextChange(text ?? '', 'model')}
            onSelectItem={text =>
              handleTextChange(text ? text.title : '', 'model')
            }
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
              value: formValues.model,
              style: !!formValues.brand.length
                ? styles.input
                : {...styles.input, opacity: 0.4},
              editable: formValues.brand.length > 0,
              placeholderTextColor: 'gray',
            }}
            rightButtonsContainerStyle={styles.inputBtn}
            suggestionsListContainerStyle={styles.dropdown}
          />
          <TextInput
            defaultValue={baseInfo.serial}
            value={formValues.serial}
            style={styles.input}
            placeholder={T.t('detail_serial')}
            placeholderTextColor="gray"
            onChangeText={text => handleTextChange(text, 'serial')}
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
