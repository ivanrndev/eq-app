import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import T from '../../i18n';

import {Card} from 'react-native-paper';
import Appbar from '../../components/Appbar';
import {useQuantityUnitsAndCurrency} from '../../hooks/useQuantityUnitsAndCurrency';
import DarkButton from '../../components/Buttons/DarkButton';
import TransparentButton from '../../components/Buttons/TransparentButton';
import ItemSetQuantityArea from '../../components/ItemSetQuantityArea';

const SetItemQuantity = ({actionName, pageToRedirect, title}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [id, metaData] = useSelector(({scan}) => [
    scan.scanInfo._id,
    scan.scanInfo.metadata,
  ]);
  const {quantity, units} = useQuantityUnitsAndCurrency();
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);
  const isEnteredQuantityValid = selectedQuantity <= quantity;

  let nameOfProduct = '';
  if (metaData) {
    nameOfProduct = metaData.title
      ? metaData.title
      : `${metaData.type} ${metaData.brand} ${metaData.model} ${
          metaData.serial
        }`;
  }
  const handleSave = () => {
    dispatch(actionName(id, selectedQuantity));
    navigation.navigate(pageToRedirect);
  };
  return (
    <>
      <Appbar
        navigation={navigation}
        arrow={true}
        newScan={true}
        goTo={pageToRedirect}
        title={title}
      />
      <View style={styles.body}>
        <Card style={styles.card}>
          <Card.Content>
            {metaData && (
              <Text style={styles.text}>
                {T.t('detail_title')}: {nameOfProduct}
              </Text>
            )}

            <Text style={styles.text}>
              {T.t('detail_quantity')}: {quantity} {units}
            </Text>
            <ItemSetQuantityArea
              isEnteredQuantityValid={isEnteredQuantityValid}
              mode="title_give_quantity"
              quantity={quantity}
              units={units}
              value={selectedQuantity}
              setQuantity={setSelectedQuantity}
            />

            <View style={styles.btns}>
              <View style={styles.btn}>
                <DarkButton
                  text={T.t('save')}
                  onPress={handleSave}
                  disabled={!isEnteredQuantityValid}
                />
              </View>
              <View style={styles.btn}>
                <TransparentButton
                  text={T.t('cancel')}
                  onPress={() => navigation.navigate(pageToRedirect)}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    marginTop: -10,
    display: 'flex',
    paddingTop: 25,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: '90%',
    paddingBottom: 80,
  },
  card: {
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.2,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
    color: '#22215B',
    borderRadius: 10,
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    width: Dimensions.get('window').width / 3,
  },
});

export default SetItemQuantity;
