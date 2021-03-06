import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import {Card} from 'react-native-paper';
import T from '../../i18n';
import {getTotalLotPrice} from '../../utils/helpers';
import {useQuantityUnitsAndCurrency} from '../../hooks/useQuantityUnitsAndCurrency';
import {
  deleteItem,
  deleteItemInventory,
  getUserList,
  unMountItemFromParent,
} from '../../actions/actions';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {deleteMoveItem} from '../../actions/moveToObjectsActions';
import Icon from 'react-native-vector-icons/FontAwesome';

const ItemListCard = ({
  item,
  width,
  isPriceShown = true,
  isResponsibleShown = false,
  isBacket = false,
  isStocktaking = false,
  children,
  itemsKit,
  restoreObject,
}) => {
  const {currency} = useQuantityUnitsAndCurrency();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userList = useSelector(({give}) => give.userList);
  const itemsUuid = useSelector(({inventory}) => inventory.itemsUuid);
  const inventoryId = useSelector(({inventory}) => inventory.inventoryId);
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    if (!!item.person && !item.person.firstName) {
      dispatch(getUserList(navigation, ''));
    }
  }, []);
  useEffect(() => setUserInfo(userList.find(user => user._id === item.responsible)), [userList]);

  const deleteInventoryItem = id => {
    const uid = itemsUuid.filter(i => i.id === id);
    dispatch(deleteItemInventory(id));
    dispatch(deleteItem(inventoryId, uid));
  };

  const deleteItem = () => {
    dispatch(deleteMoveItem(item._id));
    if (itemsKit) {
      dispatch(unMountItemFromParent(item.parent, [item._id]));
      restoreObject(item);
    }
  };

  return (
    <Card.Content icon={'delete'} style={{width}}>
      <View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row', paddingTop: 10}}>
            {!!item?.photos?.length > 0 ? (
              <Image
                style={styles.tinyLogo}
                defaultSource={require('../../assets/svg/empty.png')}
                source={{
                  uri: item.photos[0].url ? item.photos[0].url : item.photos[0],
                }}
              />
            ) : item.metadata?.title ? (
              <Text style={styles.titleText}>{T.t('detail_title')}:</Text>
            ) : null}
            <Text
              style={!item?.photos?.length > 0 ? styles.marginText : {marginLeft: 55, width: 110}}>
              {item.metadata?.title}
            </Text>
          </View>
          {item.metadata?.type ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.titleText}>{T.t('detail_type')}:</Text>
              <Text style={styles.marginText}>
                {item.metadata?.type}
                {item.code && '/ ' + item.code}
              </Text>
            </View>
          ) : null}
          {item.metadata.brand ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.titleText}>{T.t('detail_brand')}:</Text>
              <Text style={styles.marginText}>{item.metadata.brand}</Text>
            </View>
          ) : null}

          {item.metadata.model ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.titleText}>{T.t('detail_model')}:</Text>
              <Text style={styles.marginText}>{item.metadata.model}</Text>
            </View>
          ) : null}

          {item.metadata.serial ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.titleText}>{T.t('detail_serial')}:</Text>
              <Text style={styles.marginText}>{item.metadata.serial}</Text>
            </View>
          ) : null}

          {!!item.batch && (
            <>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleText}>{T.t('detail_quantity')}:</Text>
                <Text style={styles.marginText}>
                  {item.batch.quantity} {item.batch.units}
                </Text>
              </View>
              {isPriceShown && (
                <>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleText}>{T.t('detail_price_per_item')}:</Text>
                    <Text style={styles.marginText}>
                      {item.metadata.price} {currency}
                    </Text>
                  </View>
                  {+item.batch.quantity !== 1 && (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.titleText}>{T.t('detail_price_per_lot')}:</Text>
                      <Text style={styles.marginText}>
                        {` ${getTotalLotPrice(
                          item.metadata.price,
                          item.batch.quantity,
                        )} ${currency || ''}`}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </>
          )}
          {!!item.metadata.object && (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.titleText}>{T.t('object')}:</Text>
              <Text style={styles.marginText}>{item.metadata.object}</Text>
            </View>
          )}
          {!!item.metadata.location && (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.titleText}>{T.t('location')}:</Text>
              <Text style={styles.marginText}>{item.metadata.location}</Text>
            </View>
          )}
          {!!item.person && (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.titleText}>{T.t('responsible')}:</Text>
              <Text style={styles.marginText}>
                {item.person.lastName
                  ? `${item.person.firstName} ${item.person.lastName}`
                  : item.person.firstName}
              </Text>
            </View>
          )}
          {children}
        </View>
        {isBacket && (
          <View style={styles.iconWrap}>
            <Icon onPress={deleteItem} name="trash" size={30} color="rgb(0, 0, 0)" />
          </View>
        )}
        {isStocktaking && (
          <View style={styles.iconWrap}>
            <Icon
              onPress={() => deleteInventoryItem(item._id, item)}
              name="trash"
              size={30}
              color="rgb(0, 0, 0)"
            />
          </View>
        )}
      </View>
    </Card.Content>
  );
};

const styles = StyleSheet.create({
  load: {
    marginTop: 10,
  },
  titleText: {
    width: 110,
  },
  marginText: {
    marginLeft: 45,
    width: Dimensions.get('window').width / 2.9,
    maxWidth: Dimensions.get('window').width / 3.4,
  },
  tinyLogo: {
    width: 100,
    height: 100,
  },
  iconWrap: {
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 10,
  },
});

export default ItemListCard;
