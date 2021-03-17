import React from 'react';
import {Dimensions, StyleSheet, Text} from 'react-native';
import T from '../../i18n';
import {useQuantityUnitsAndCurrency} from '../../hooks/useQuantityUnitsAndCurrency';
import {getTotalLotPrice} from '../../utils/helpers';

export const ItemCardQuantityAndPrice = ({quantity, units, price, styles}) => {
  const {currency} = useQuantityUnitsAndCurrency();
  const totalLotPrice = getTotalLotPrice(quantity, price);
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
