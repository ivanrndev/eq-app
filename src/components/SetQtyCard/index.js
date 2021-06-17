import ItemListCard from '../ItemListCard';
import {Dimensions, Text, View, StyleSheet} from 'react-native';
import T from '../../i18n';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DarkButton from '../Buttons/DarkButton';
import {Card, IconButton} from 'react-native-paper';
import React from 'react';

const SetQtyCard = ({
  item,
  handleChangeQty,
  deleteItem,
  setItemQty,
  isResponsibleShown,
}) => {
  const isQtyBtnShow = item =>
    item.batch && +item.batch.quantity !== 1 && !setItemQty(item._id);

  return (
    <Card style={styles.card} key={item._id}>
      <ItemListCard
        item={item}
        isPriceShown={false}
        isResponsibleShown={isResponsibleShown}>
        {setItemQty(item._id) && (
          <View style={styles.giveArea}>
            <Text style={styles.cardTitle}>
              {T.t('give')}:{' '}
              {setItemQty(item._id) && setItemQty(item._id).quantity}
            </Text>
            <TouchableOpacity onPress={() => handleChangeQty(item)}>
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.cardBottom}>
          <View style={styles.setQtyBtn}>
            {isQtyBtnShow(item) && (
              <DarkButton
                onPress={() => handleChangeQty(item)}
                text={T.t('set_quantity')}
              />
            )}
          </View>
          <IconButton icon="delete" onPress={() => deleteItem(item._id)} />
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
});
export default SetQtyCard;
