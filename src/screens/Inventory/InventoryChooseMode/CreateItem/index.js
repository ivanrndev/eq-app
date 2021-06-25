import React, {useState} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import T from '../../../../i18n';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Appbar from '../../../../components/Appbar';
import {Button, Card, Menu, TextInput} from 'react-native-paper';
import DarkButton from '../../../../components/Buttons/DarkButton';
import TransparentButton from '../../../../components/Buttons/TransparentButton';
import {validateFloatNumbers} from '../../../../utils/validation';
import {saveCreatedInventoryItem} from '../../../../actions/actions';
import {useDispatch} from 'react-redux';

const initialFormValues = {
  type: '',
  title: '',
  brand: '',
  model: '',
  serial: '',
  quantity: 1,
};
const initialErrors = {
  type: '',
  quantity: '',
};
const units = [T.t('piece'), T.t('kg'), T.t('litre'), T.t('tons')];

const CreateItemOld = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [selectedUnits, setSelectedUnits] = useState(T.t('piece'));
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState(initialErrors);

  const handleChoseMenu = item => {
    setVisible(false);
    setSelectedUnits(item.item);
  };
  const renderItem = item => (
    <Menu.Item onPress={() => handleChoseMenu(item)} title={item.item} />
  );
  const handleCancelCreate = () => {
    navigation.navigate('InventoryChooseMode');
    setFormValues(initialFormValues);
    setErrors(initialErrors);
  };
  const handleTextChange = (text, name) => {
    setFormValues({...formValues, [name]: text});
    if (name === 'quantity') {
      !validateFloatNumbers(text)
        ? setErrors({...errors, quantity: T.t('error_only_positive_numbers')})
        : setErrors({...errors, quantity: ''});
    }
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
    if (errors.type.length === 0 && errors.quantity.length === 0) {
      dispatch(
        saveCreatedInventoryItem({
          metadata: formValues,
          batch: {quantity: formValues.quantity, units: selectedUnits},
        }),
      );
      navigation.navigate('InventoryChooseMode');
      setFormValues(initialFormValues);
    }
  };
  return (
    <View style={styles.body}>
      <Appbar
        navigation={navigation}
        arrow={true}
        goTo={'InventoryChooseMode'}
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
          <View style={styles.qty}>
            <TextInput
              value={`${formValues.quantity}`}
              style={styles.qtyInput}
              label={T.t('detail_quantity')}
              keyboardType="numeric"
              mode="outlined"
              error={errors.quantity}
              onChangeText={text => handleTextChange(text, 'quantity')}
            />

            <Menu
              visible={visible}
              anchor={
                <Button onPress={() => setVisible(true)}>
                  {selectedUnits}
                </Button>
              }>
              <FlatList
                data={units}
                keyExtractor={item => item}
                renderItem={renderItem}
              />
            </Menu>
            <Text style={styles.qtyError}>{errors.quantity}</Text>
          </View>
          <View style={styles.btns}>
            <DarkButton text={T.t('create_item')} onPress={handleCreate} />
            <TransparentButton
              text={T.t('cancel')}
              onPress={handleCancelCreate}
            />
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
  qtyInput: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 2.2,
    backgroundColor: '#fff',
  },
  err: {
    height: 15,
    color: '#8c231f',
    width: Dimensions.get('window').width / 1.3,
    alignSelf: 'center',
    marginTop: 5,
  },
  qty: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: Dimensions.get('window').width / 1.1,
    alignSelf: 'center',
  },
  qtyError: {
    width: Dimensions.get('window').width / 1.3,
    color: '#8c231f',
    height: 15,
    marginTop: 5,
  },
  btns: {
    marginTop: 30,
  },
  container: {
    flex: 1,
  },
});

export default CreateItemOld;
