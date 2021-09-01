import React, {useState} from 'react';
import T from '../../../i18n';
import {Dimensions, StyleSheet, Text} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Card, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {saveBaseItemInfo} from '../../../actions/createItem';
import {CreateItemContainer} from '../CreateItemContainer';

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
  const baseInfo = useSelector(({createItem}) => createItem.baseInfo);
  const [formValues, setFormValues] = useState(baseInfo);
  const [errors, setErrors] = useState(initialErrors);
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
    }
  };
  return (
    <CreateItemContainer
      handleSave={handleCreate}
      isSaveBtnEnabled={formValues.type.length > 0}>
      <KeyboardAwareScrollView style={styles.container}>
        <Card style={styles.card}>
          <TextInput
            defaultValue={formValues.type}
            style={styles.input}
            label={`${T.t('detail_type')}*`}
            mode="outlined"
            error={errors.type}
            onChangeText={text => handleTextChange(text, 'type')}
          />
          <Text style={styles.err}>{errors.type}</Text>
          <TextInput
            defaultValue={formValues.title}
            style={[styles.input, styles.secondInput]}
            label={T.t('detail_title')}
            mode="outlined"
            onChangeText={text => handleTextChange(text, 'title')}
          />
          <TextInput
            defaultValue={formValues.brand}
            style={styles.input}
            label={T.t('detail_brand')}
            mode="outlined"
            onChangeText={text => handleTextChange(text, 'brand')}
          />
          <TextInput
            defaultValue={formValues.model}
            style={styles.input}
            label={T.t('detail_model')}
            mode="outlined"
            onChangeText={text => handleTextChange(text, 'model')}
          />
          <TextInput
            defaultValue={formValues.serial}
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
