import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import T from '../../i18n';

export const ItemSetQuantityArea = ({
  quantity,
  units,
  value,
  isEnteredQuantityValid,
  setQuantity,
  mode,
}) => (
  <>
    {quantity > 1 && (
      <>
        <Text style={styles.text}>{T.t(`title_${mode}_quantity`)}</Text>
        <View style={styles.quantityInputWrap}>
          <TextInput
            style={styles.quantityInput}
            mode="outlined"
            value={`${value}`}
            keyboardType="numeric"
            onChangeText={text => setQuantity(text)}
          />
          <Text style={styles.quantityUnits}>{units}</Text>
        </View>
        <Text style={styles.error}>
          {!isEnteredQuantityValid && T.t('error_service_quantity')}
        </Text>
      </>
    )}
  </>
);
const styles = StyleSheet.create({
  error: {
    color: '#E40B67',
    alignSelf: 'flex-start',
    fontSize: 15,
    marginVertical: 10,
    height: 60,
  },
  text: {
    fontSize: 15,
    paddingBottom: 5,
    color: '#7A7A9D',
    width: Dimensions.get('window').width / 1.3,
  },
  quantityInputWrap: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  quantityUnits: {
    fontSize: 15,
    color: '#7A7A9D',
  },
  quantityInput: {
    height: 50,
    width: 100,
    marginRight: 10,
  },
});
