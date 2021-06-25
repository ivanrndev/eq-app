import React, {useState} from 'react';
import T from '../../../i18n';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Appbar from '../../../components/Appbar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Card, TextInput} from 'react-native-paper';
import TransparentButton from '../../../components/Buttons/TransparentButton';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {saveBaseItemInfo} from '../../../actions/createItem';

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
  const [formValues, setFormValues] = useState(baseInfo ?? initialFormValues);
  const [errors, setErrors] = useState(initialErrors);
  console.log('BASE', baseInfo);
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
      setFormValues(initialFormValues);
      dispatch(saveBaseItemInfo(formValues));
      navigation.navigate('CreateItem');
    }
  };
  return (
    <View style={styles.body}>
      <Appbar
        navigation={navigation}
        arrow={true}
        goTo={'CreateItem'}
        title={T.t('create_item')}
      />
      <KeyboardAwareScrollView style={styles.container}>
        <Card style={styles.card}>
          <TextInput
            value={formValues.type}
            style={styles.input}
            label={`${T.t('detail_type')}*`}
            mode="outlined"
            error={errors.type}
            onChangeText={text => handleTextChange(text, 'type')}
          />
          <Text style={styles.err}>{errors.type}</Text>
          <TextInput
            value={formValues.title}
            style={[styles.input, styles.secondInput]}
            label={T.t('detail_title')}
            mode="outlined"
            onChangeText={text => handleTextChange(text, 'title')}
          />
          <TextInput
            value={formValues.brand}
            style={styles.input}
            label={T.t('detail_brand')}
            mode="outlined"
            onChangeText={text => handleTextChange(text, 'brand')}
          />
          <TextInput
            value={formValues.model}
            style={styles.input}
            label={T.t('detail_model')}
            mode="outlined"
            onChangeText={text => handleTextChange(text, 'model')}
          />
          <TextInput
            value={formValues.serial}
            style={styles.input}
            label={T.t('detail_serial')}
            mode="outlined"
            onChangeText={text => handleTextChange(text, 'serial')}
          />

          <View style={styles.btns}>
            <TransparentButton text={T.t('save')} onPress={handleCreate} />
          </View>
        </Card>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
    paddingBottom: 70,
  },
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
  btns: {
    marginTop: 30,
  },
  container: {
    flex: 1,
  },
});
export default BaseInfo;
