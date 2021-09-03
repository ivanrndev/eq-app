import React, {useEffect, useState} from 'react';
import T from '../../../i18n';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Card, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getBrands,
  getTitle,
  getTypes,
  saveBaseItemInfo,
} from '../../../actions/createItem';
import {CreateItemContainer} from '../CreateItemContainer';
import SearchableDropdown from 'react-native-searchable-dropdown';

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
      createItem.accountType,
      createItem.location,
      createItem.photos,
      createItem.responsible,
      createItem.additionalInfo,
      createItem.types,
      createItem.brands,
      createItem.titles,
      createItem.models,
    ],
  );
  /*  useEffect(() => {
    dispatch(getTitle());
    dispatch(getBrands());
    dispatch(getTypes());
  }, []);*/
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
          <TextInput
            defaultValue={baseInfo.type}
            value={formValues.type}
            style={styles.input}
            label={`${T.t('detail_type')}*`}
            mode="outlined"
            error={errors.type}
            onChangeText={text => handleTextChange(text, 'type')}
          />
          <Text style={styles.err}>{errors.type}</Text>
          <TextInput
            defaultValue={baseInfo.title}
            value={formValues.title}
            style={[styles.input, styles.secondInput]}
            label={T.t('detail_title')}
            mode="outlined"
            onChangeText={text => handleTextChange(text, 'title')}
          />
          <TextInput
            defaultValue={baseInfo.brand}
            value={formValues.brand}
            style={styles.input}
            label={T.t('detail_brand')}
            mode="outlined"
            onChangeText={text => handleTextChange(text, 'brand')}
          />
          <TextInput
            defaultValue={baseInfo.model}
            value={formValues.model}
            style={styles.input}
            label={T.t('detail_model')}
            mode="outlined"
            onChangeText={text => handleTextChange(text, 'model')}
          />
          <TextInput
            defaultValue={baseInfo.serial}
            value={formValues.serial}
            style={styles.input}
            label={T.t('detail_serial')}
            mode="outlined"
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
  },
  secondInput: {
    marginTop: 0,
  },
  err: {
    height: 15,
    color: '#8c231f',
    width: Dimensions.get('window').width / 1.3,
    alignSelf: 'center',
    marginTop: 5,
  },

  container: {
    flex: 1,
  },
});
export default BaseInfo;
