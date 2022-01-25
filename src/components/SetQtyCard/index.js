import ItemListCard from '../ItemListCard';
import {Dimensions, Text, View, StyleSheet} from 'react-native';
import T from '../../i18n';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DarkButton from '../Buttons/DarkButton';
import {Button, Card, Dialog, IconButton, Portal} from 'react-native-paper';
import React, {useState} from 'react';
import {isEmpty} from 'lodash';
import {loader, unMountItemFromParent} from '../../actions/actions';

const SetQtyCard = ({
  item,
  handleChangeQty,
  deleteItem,
  setItemQty,
  isResponsibleShown,
  dispatch,
}) => {
  const isQtyBtnShow = item => item.batch && +item.batch.quantity !== 1 && !setItemQty(item._id);

  const deleteItemModal = (parent, id) => {
    dispatch(unMountItemFromParent(parent, [id]));
  };

  return (
    <Card style={styles.card} key={item._id}>
      <ItemListCard item={item} isPriceShown={false} isResponsibleShown={isResponsibleShown}>
        {setItemQty(item._id) && (
          <View style={styles.giveArea}>
            <Text style={styles.cardTitle}>
              {T.t('give')}: {setItemQty(item._id) && setItemQty(item._id).quantity}
            </Text>
            <TouchableOpacity onPress={() => handleChangeQty(item)}>
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.cardBottom}>
          <View style={styles.setQtyBtn}>
            {isQtyBtnShow(item) && (
              <DarkButton onPress={() => handleChangeQty(item)} text={T.t('set_quantity')} />
            )}
          </View>
          <IconButton
            icon="delete"
            size={35}
            onPress={() => {
              deleteItem(item._id);
              item?.parent && deleteItemModal(item.parent, item._id);
            }}
          />
        </View>
      </ItemListCard>
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
    color: '#22215B',
    borderRadius: 10,
  },
  giveArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#22215B',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setQtyBtn: {
    width: Dimensions.get('window').width / 2.2,
  },
  edit: {
    color: '#8c03fc',
  },
  deleteBtn: {
    alignSelf: 'flex-end',
    width: 20,
    marginTop: -60,
    marginRight: 0,
    paddingLeft: 14,
    marginBottom: 10,
    height: Dimensions.get('window').height / 15,
  },
  textTmc: {
    fontSize: 16,
    marginTop: 20,
    paddingBottom: 10,
    color: '#22215B',
    width: Dimensions.get('window').width / 1.3,
  },
  buttonContentStyle: {
    marginLeft: -13,
  },
});
export default SetQtyCard;
