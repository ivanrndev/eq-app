import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
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

  const name =
    item.person && !!item.person.firstName
      ? ` ${item.person.firstName}  ${item.person.lastName ?? ''}`
      : userInfo
      ? ` ${userInfo.firstName}  ${userInfo.lastName ?? ''}`
      : '';

  return (
    <Card.Content  icon={'delete'}  style={{width}}>
      {item.metadata.title ? (
        <Title style={styles.cardTitle}>
          {T.t('detail_title')}: {item.metadata.title}
        </Title>
      ) : (
        <Title style={styles.cardTitle}>
          {T.t('detail_type')}: {item.metadata.type} {item.metadata.brand}
          {T.t('detail_model')}: {item.metadata.model} {item.metadata.serial}
        </Title>
      )}
      {item.metadata.type && (
        <Paragraph style={styles.paragraph}>
          {T.t('detail_type')}: {item.metadata.type}
          {item.code && '/ ' + item.code}
        </Paragraph>
      )}
      {item.metadata.brand ? (
        <Paragraph style={styles.paragraph}>
          {T.t('detail_brand')}: {item.metadata.brand}
        </Paragraph>
      ) : null}
      {item.metadata.model ? (
        <Paragraph style={styles.paragraph}>
          {T.t('detail_model')}: {item.metadata.model}
        </Paragraph>
      ) : null}
      {item.metadata.serial ? (
        <Paragraph style={styles.paragraph}>
          {T.t('detail_serial')}: {item.metadata.serial}
        </Paragraph>
      ) : null}
      {item.batch && (
        <>
          <Paragraph style={styles.paragraph}>
            {T.t('detail_quantity')}: {item.batch.quantity} {item.batch.units}
          </Paragraph>
          {isPriceShown && (
            <>
              <Paragraph style={styles.paragraph}>
                {T.t('detail_price_per_item')}: {item.metadata.price} {currency}
              </Paragraph>
              {+item.batch.quantity !== 1 && (
                <Paragraph style={styles.paragraph}>
                  {T.t('detail_price_per_lot')}:
                  {` ${getTotalLotPrice(
                    item.metadata.price,
                    item.batch.quantity,
                  )} ${currency}`}
                </Paragraph>
              )}
            </>
          )}
        </>
      )}
      {!!item.metadata.object && (
        <Paragraph style={styles.paragraph}>
          {T.t('object')}: {item.metadata.object}
        </Paragraph>
      )}
      {!!item.metadata.location && (
        <Paragraph style={styles.paragraph}>
          {T.t('location')}: {item.metadata.location}
        </Paragraph>
      )}
      {!!item.person && (
          <Paragraph style={styles.paragraph}>
            {T.t('responsible')}: {item.person.firstName}
          </Paragraph>
      )}
      {children}
    </Card.Content>
  );
};

const styles = StyleSheet.create({
  load: {
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 13,
    textTransform: 'uppercase',
    color: '#22215B',
    marginRight: 25,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 15,
    color: '#22215B',
  },
});

export default ItemListCard;
