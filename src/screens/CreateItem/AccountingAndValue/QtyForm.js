import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import T from '../../../i18n';
import {Button, Menu, TextInput} from 'react-native-paper';
import {height, units, width} from '../../../constants/dimentionsAndUnits';
import DarkButton from '../../../components/Buttons/DarkButton';
import {useNavigation} from '@react-navigation/native';
import {validateFloatNumbers} from '../../../utils/validation';
import {useDispatch, useSelector} from 'react-redux';
import {saveAccountingAndValue} from '../../../actions/createItem';
import Arrow from '../../../assets/svg/arrow-down.svg';

const initialValues = {
  quantity: 1,
  units: T.t('piece'),
  pricePerPiece: 1,
  pricePerLot: 1,
};
export const QtyForm = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const accountType = useSelector(({createItem}) => createItem.accountType);
  const [visible, setVisible] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [error, setError] = useState('');
  const renderItem = item => (
    <Menu.Item onPress={() => handleChoseMenu(item)} title={item.item} />
  );
  useEffect(() => {
    if (+accountType.batch.quantity === 1 && +accountType.pricePerPiece === 1) {
      setFormValues(initialValues);
    }
  }, [accountType]);
  useEffect(
    () =>
      setFormValues({
        ...formValues,
        pricePerPiece:
          formValues.quantity > 0
            ? formValues.pricePerLot / formValues.quantity
            : formValues.pricePerPiece,
      }),
    [formValues.pricePerLot, formValues.quantity],
  );

  useEffect(
    () =>
      setFormValues({
        ...formValues,
        pricePerLot:
          formValues.quantity > 0
            ? formValues.pricePerPiece * formValues.quantity
            : formValues.pricePerLot,
      }),
    [formValues.pricePerPiece, formValues.quantity],
  );

  const handleChoseMenu = item => {
    setVisible(false);
    setFormValues({...formValues, units: item.item});
  };

  const handleTextChange = (text, name) => {
    setFormValues({...formValues, [name]: text});
    if (name === 'qty') {
      !validateFloatNumbers(text)
        ? setError(T.t('error_only_positive_numbers'))
        : setError('');
    }
  };
  const normalizedValues = {
    batch: {
      quantity: formValues.quantity,
      units: formValues.units,
    },
    pricePerPiece: formValues.pricePerLot,
  };

  const handleSave = () => {
    dispatch(saveAccountingAndValue(normalizedValues));
    navigation.navigate('CreateItem');
  };

  return (
    <>
      <View style={styles.qty}>
        <TextInput
          value={formValues.quantity.toString()}
          defaultValue={accountType.batch.quantity}
          style={[styles.qtyInput]}
          label={T.t('detail_quantity')}
          keyboardType="numeric"
          mode="outlined"
          error={error.length > 0}
          onChangeText={text => handleTextChange(text, 'quantity')}
        />
        <Menu
          visible={visible}
          anchor={
            <Button onPress={() => setVisible(true)}>
              {formValues.units}{' '}
              <View style={styles.arrowWrap}>
                <Arrow width={10} height={10} />
              </View>
            </Button>
          }>
          <FlatList
            data={units}
            keyExtractor={item => item}
            renderItem={renderItem}
          />
        </Menu>
        <Text style={styles.qtyError}>{error}</Text>
      </View>
      <TextInput
        value={formValues.pricePerPiece.toString()}
        defaultValue={accountType.pricePerPiece}
        style={[styles.input, styles.secondInput]}
        label={T.t('detail_price_per_item')}
        keyboardType="numeric"
        mode="outlined"
        onChangeText={text => handleTextChange(text, 'pricePerPiece')}
      />
      <TextInput
        value={formValues.pricePerLot.toString()}
        style={[styles.input, styles.lastInput]}
        label={T.t('detail_price_per_lot')}
        keyboardType="numeric"
        mode="outlined"
        onChangeText={text => handleTextChange(text, 'pricePerLot')}
      />

      <DarkButton onPress={handleSave} text={`${T.t('save')}`} />
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#D3E3F2',
    height: height,
    paddingBottom: 70,
  },
  card: {
    justifyContent: 'center',
    width: width / 1.1,
    marginVertical: 15,
    alignSelf: 'center',
    paddingBottom: 30,
    paddingHorizontal: 15,
  },
  input: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: width / 1.3,
    backgroundColor: '#fff',
  },
  secondInput: {
    marginTop: 0,
  },
  lastInput: {
    marginBottom: 30,
  },
  qtyInput: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: width / 2.2,
    backgroundColor: '#fff',
  },
  err: {
    height: 15,
    color: '#8c231f',
    width: width / 1.3,
    alignSelf: 'center',
    marginTop: 5,
    fontSize: 10,
  },
  qty: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: width / 1.1,
    alignSelf: 'center',
  },
  qtyError: {
    width: width / 1.3,
    color: '#8c231f',
    height: 15,
    marginTop: 5,
  },
  arrowWrap: {
    marginBottom: -1,
  },
});
