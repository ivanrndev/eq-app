import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import T from '../../../i18n';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {width} from '../../../constants/dimentionsAndUnits';
import {Card, TextInput} from 'react-native-paper';
import {QtyForm} from './QtyForm';
import {CreateItemContainer} from '../CreateItemContainer';
import {useDispatch, useSelector} from 'react-redux';
import {saveAccountingAndValue} from '../../../actions/createItem';
import {validateFloatNumbers} from '../../../utils/validation';

const AccountingAndValue = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [qtyMode, setQtyMode] = useState('qty');
  const [sngPrice, setSngPrice] = useState(1);
  const [sngErr, setSngErr] = useState('');
  const accountType = useSelector(({createItem}) => createItem.accountType);
  useEffect(() => {
    qtyMode === 'qty' && setSngErr('');
  }),
    [qtyMode];
  useEffect(() => {
    if (+accountType.pricePerPiece === 1) {
      setSngPrice(1);
    }
  }, [accountType]);
  const handleMode = (e, mode) => {
    e.preventDefault();
    setQtyMode(mode);
  };
  const normalizedValues = {
    batch: {
      quantity: 1,
      units: T.t('piece'),
    },
    pricePerPiece: sngPrice,
  };
  const handleSave = () => {
    if (qtyMode === 'sng' && sngErr.length === 0 && sngPrice.length > 0) {
      dispatch(saveAccountingAndValue(normalizedValues));
      navigation.navigate('CreateItem');
    }
  };
  const handleSngChange = text => {
    setSngPrice(text);
    if (text.length === 0) {
      setSngErr(T.t('error_required'));
    }
    !validateFloatNumbers(text)
      ? setSngErr(T.t('error_only_positive_numbers'))
      : setSngErr('');
  };

  return (
    <CreateItemContainer
      isBtnVisible={qtyMode !== 'qty'}
      handleSave={handleSave}
      isSaveBtnEnabled={
        qtyMode === 'sng' && sngErr.length === 0 && sngPrice.length > 0
      }>
      <>
        <View style={styles.modeWrap}>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              {backgroundColor: qtyMode === 'sng' ? '#22215B' : '#C5CDD5'},
            ]}
            onPress={e => handleMode(e, 'sng')}>
            <Text
              style={{
                color: qtyMode === 'sng' ? '#fff' : '#22215B',
                fontWeight: 'bold',
              }}>
              {T.t('single')}
            </Text>
            <View>
              <Text style={{color: qtyMode === 'sng' ? '#fff' : '#22215B'}}>
                {T.t('example')}
              </Text>
              <Text style={{color: qtyMode === 'sng' ? '#fff' : '#22215B'}}>
                {T.t('single_example')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              {backgroundColor: qtyMode === 'qty' ? '#22215B' : '#C5CDD5'},
            ]}
            onPress={e => handleMode(e, 'qty')}>
            <Text
              style={{
                color: qtyMode === 'qty' ? '#fff' : '#22215B',
                fontWeight: 'bold',
              }}>
              {T.t('quantitative')}
            </Text>
            <View>
              <Text style={{color: qtyMode === 'qty' ? '#fff' : '#22215B'}}>
                {T.t('example')}
              </Text>
              <Text style={{color: qtyMode === 'qty' ? '#fff' : '#22215B'}}>
                {T.t('quantitative_example')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView style={styles.form}>
          <Card style={styles.card}>
            {qtyMode === 'qty' ? (
              <QtyForm />
            ) : (
              <>
                <TextInput
                  value={sngPrice.toString()}
                  defaultValue={accountType.pricePerPiece}
                  style={styles.input}
                  label={T.t('detail_price_per_item')}
                  keyboardType="numeric"
                  mode="outlined"
                  onChangeText={text => handleSngChange(text)}
                  error={sngErr}
                />
                <Text style={styles.err}>{sngErr}</Text>
              </>
            )}
          </Card>
        </KeyboardAwareScrollView>
      </>
    </CreateItemContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    width: width / 1.1,
    marginVertical: 15,
    alignSelf: 'center',
    paddingBottom: 30,
    paddingHorizontal: 15,
  },
  form: {flex: 1},
  modeWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width / 1.1,
    alignSelf: 'center',
    marginTop: 20,
    height: 150,
  },
  modeBtn: {
    width: '47%',
    borderRadius: 10,
    justifyContent: 'space-between',
    height: 130,
    padding: 15,
  },
  input: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: width / 1.3,
    backgroundColor: '#fff',
  },
  err: {
    width: width / 1.3,
    color: '#8c231f',
    height: 15,
    marginTop: 5,
    marginLeft: 10,
  },
});

export default AccountingAndValue;
