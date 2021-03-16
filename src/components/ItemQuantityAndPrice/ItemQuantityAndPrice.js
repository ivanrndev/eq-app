import React from 'react';
import {Dimensions, StyleSheet, Text} from 'react-native';
import T from '../../i18n';
import {useQuantityAndPrice} from '../../hooks/useQuantityAndPrice';

export const ItemQuantityAndPrice = () => {
  const {
    quantity,
    units,
    price,
    currency,
    totalLotPrice,
  } = useQuantityAndPrice();

  return (
    <>
      <Text style={styles.text}>
        {T.t('detail_quantity')}: {quantity} {units}
      </Text>

      {price && (
        <Text style={styles.text}>
          {T.t('detail_price_per_item')}: {price} {currency}
        </Text>
      )}
      {price && !!quantity && quantity !== 1 && (
        <Text style={styles.text}>
          {T.t('detail_price_per_lot')}: {`${totalLotPrice} ${currency}`}
        </Text>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    paddingBottom: 5,
    color: '#7A7A9D',
    width: Dimensions.get('window').width / 1.3,
  },
});
