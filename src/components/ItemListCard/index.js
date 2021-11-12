import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import {Card, Paragraph, Title} from 'react-native-paper';
import T from '../../i18n';
import {getTotalLotPrice} from '../../utils/helpers';
import {useQuantityUnitsAndCurrency} from '../../hooks/useQuantityUnitsAndCurrency';
import {getUserList} from '../../actions/actions';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

const ItemListCard = ({
  item,
  width,
  isPriceShown = true,
  isResponsibleShown = false,
  children,
}) => {
  const {currency} = useQuantityUnitsAndCurrency();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userList = useSelector(({give}) => give.userList);
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    if (!!item.person && !item.person.firstName) {
      dispatch(getUserList(navigation, ''));
    }
  }, []);
  useEffect(
    () => setUserInfo(userList.find(user => user._id === item.responsible)),
    [userList],
  );
  return (
    <Card.Content  icon={'delete'}  style={{width}}>
      <View style={{flexDirection: 'row', paddingTop:10}}>
        {item.photos.length > 0
            ? <Image
                style={styles.tinyLogo}
                defaultSource={require('../../assets/svg/empty.png')}

                source={{
                  uri: item.photos[0].url ? item.photos[0].url : item.photos[0],
                }}
            />
            : item.metadata.title && <Text style={styles.titleText}>{T.t('detail_title')}:</Text>}
            <Text style={!item.photos.length > 0 ? styles.marginText : {marginLeft: 60}}>
              {item.metadata.title}
            </Text>
          </View>
      {item.metadata.type && (
          <View style={{flexDirection:'row'}} >
            <Text style={styles.titleText}>
              {T.t('detail_type')}:
            </Text>
            <Text style={styles.marginText}>
              {item.metadata.type}{item.code && '/ ' + item.code}
            </Text>
          </View>
      )}
      {item.metadata.brand && (
          <View style={{flexDirection:'row'}}>
            <Text style={styles.titleText}>
              {T.t('detail_brand')}:
            </Text>
            <Text style={styles.marginText}>
              {item.metadata.brand}
            </Text>
          </View>
      ) }

      {item.metadata.model && (
          <View style={{flexDirection:'row'}}>
            <Text style={styles.titleText}>
              {T.t('detail_model')}:
            </Text>
            <Text style={styles.marginText}>
              {item.metadata.model}
            </Text>
          </View>
      ) }

      {item.metadata.serial && (
          <View style={{flexDirection:'row'}}>
            <Text style={styles.titleText}>
              {T.t('detail_serial')}:
            </Text>
            <Text style={styles.marginText}>
              {item.metadata.serial}
            </Text >
          </View>
      ) }

      {item.batch && (
        <>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.titleText}>
              {T.t('detail_quantity')}:
            </Text>
            <Text style={styles.marginText}>
              {item.batch.quantity} {item.batch.units}
            </Text>
          </View>
          {isPriceShown && (
            <>
              <View style={{flexDirection:'row'}}>
                <Text style={styles.titleText}>
                  {T.t('detail_price_per_item')}:
                </Text>
                <Text style={styles.marginText}>
                  {item.metadata.price} {currency}
                </Text>
              </View>
              {+item.batch.quantity !== 1 && (
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.titleText}>
                      {T.t('detail_price_per_lot')}:
                    </Text>
                    <Text style={styles.marginText}>
                      {` ${getTotalLotPrice(
                              item.metadata.price,
                              item.batch.quantity,
                            )} ${currency}`}
                    </Text>
                  </View>
              )}
            </>
          )}
        </>
      )}
      {!!item.metadata.object && (
          <View style={{flexDirection:'row'}}>
            <Text style={styles.titleText}>
              {T.t('object')}:
            </Text>
            <Text style={styles.marginText}>
              {item.metadata.object}
            </Text>
          </View>
      )}
      {!!item.metadata.location && (
          <View style={{flexDirection:'row'}}>
            <Text style={styles.titleText}>
              {T.t('location')}:
            </Text>
            <Text style={styles.marginText}>
              {item.metadata.location}
            </Text>
          </View>
      )}
      {!!item.person && (
          <View style={{flexDirection:'row'}}>
            <Text style={styles.titleText}>
              {T.t('responsible')}:
            </Text>
            <Text style={styles.marginText}>
              { item.person.lastName ? `${item.person.firstName} ${item.person.lastName}` : item.person.firstName}
            </Text>
          </View>
      )}
      {children}
    </Card.Content>
  );
};

const styles = StyleSheet.create({
  load: {
    marginTop: 10,
  },
  titleText:{
    width:110
  },
  marginText:{
    marginLeft:45,
    maxWidth: Dimensions.get('window').width/2.5,
  },
  tinyLogo: {
    width: 100,
    height: 100,

  },
});

export default ItemListCard;
