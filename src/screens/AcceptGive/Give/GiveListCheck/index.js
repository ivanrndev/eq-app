/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Card, IconButton, Paragraph, Snackbar} from 'react-native-paper';
import T from '../../../../i18n';
// components
import Appbar from '../../../../components/Appbar';
import {
  getProperErrorTransfer,
  handleNavigateToSingleItemPage,
} from '../../../../utils/helpers.js';
import DarkButton from '../../../../components/Buttons/DarkButton';
import TransparentButton from '../../../../components/Buttons/TransparentButton';

// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  allowNewScan,
  clearGiveItemQty,
  clearGiveList,
  getTotalCountMyCompanyItems,
  loader,
  makeTransfer,
  updateGiveList,
} from '../../../../actions/actions.js';
import ItemListCard from '../../../../components/ItemListCard';
import {TouchableOpacity} from 'react-native-gesture-handler';
import TariffLimitModal from '../../../../components/TariffLimitModal';

const GiveListCheck = props => {
  const dispatch = useDispatch();
  const [scan, give, settings, limit, totalItemsCount] = useSelector(
    ({scan, give, settings, auth, companyItems}) => [
      scan,
      give,
      settings,
      auth.currentCompany.plan && auth.currentCompany.plan.items,
      companyItems.totalItemsCount,
    ],
  );
  const [error, setError] = useState('');
  const [isModalShown, setIsModalShown] = useState(false);

  let showEmptyError = !scan.scanGiveList.length;
  const userCurrentId = give.userCurrentId;
  const errorId = !!scan.currentScan
    ? scan.currentScan
    : scan.scanInfo.metadata && scan.scanInfo.metadata.title;
  const givenListsId = give.giveList.map(item => item.id);
  const list =
    give.giveList.length > 0
      ? scan.scanGiveList
          .filter(item => !givenListsId.includes(item._id))
          .map(item => ({
            id: item._id,
            quantity: item.batch ? item.batch.quantity : 1,
          }))
      : scan.scanGiveList.map(item => ({
          id: item._id,
          quantity: item.batch ? item.batch.quantity : 1,
        }));

  const isQtyBtnShow = item =>
    item.batch && +item.batch.quantity !== 1 && !setItemQty(item._id);

  useEffect(() => dispatch(getTotalCountMyCompanyItems()), [totalItemsCount]);
  const setItemQty = itemId => give.giveList.find(pc => pc.id === itemId);

  useEffect(() => {
    const correctItem = scan.scanGiveList.find(
      item => item._id === scan.selectGiveId,
    );

    const responsible = correctItem && correctItem.person._id;
    if (responsible === give.userCurrentId) {
      setError(
        `${T.t('give_alredy_user_first')} "${scan.currentScan}" ${T.t(
          'give_alredy_user_second',
        )}`,
      );
      deleteItem(scan.selectGiveId);
    }
  }, [scan.selectGiveId]);

  useEffect(() => {
    const valueArr = scan.scanGiveList.map(item => item._id);
    const isDuplicate = valueArr.some(
      (item, idx) => valueArr.indexOf(item) !== idx,
    );
    if (isDuplicate) {
      const editGiveList = [...scan.scanGiveList];
      const uniqueList = Array.from(new Set(editGiveList.map(a => a._id))).map(
        id => editGiveList.find(a => a._id === id),
      );

      dispatch(updateGiveList(uniqueList));
      setError(getProperErrorTransfer('Copy', errorId));
    } else {
      if (scan.scanInfoError) {
        setError(getProperErrorTransfer(scan.scanInfoError, errorId));
      }
    }
  }, [scan.scanGiveList, scan.currentScan, scan.scanInfoError]);

  const handleChangeQty = item => {
    if (limit > totalItemsCount) {
      handleNavigateToSingleItemPage(
        item.code,
        props.navigation,
        item._id,
        'GiveSetQuantity',
        dispatch,
      );
    } else {
      setIsModalShown(true);
    }
  };
  const deleteItem = id => {
    let updateList = scan.scanGiveList.filter(item => item._id !== id);
    dispatch(updateGiveList(updateList));
  };

  const addMore = () => {
    props.navigation.navigate(settings.startPageGive);
    dispatch(allowNewScan(true));
  };

  const createTransfer = () => {
    dispatch(loader(true));
    dispatch(
      makeTransfer(
        props.navigation,
        [...list, ...give.giveList],
        userCurrentId,
      ),
    );
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        clearGiveList={true}
        goTo={'GiveList'}
        title={T.t('create_request')}
      />
      {isModalShown && <TariffLimitModal handleClose={setIsModalShown} />}
      <View style={styles.body}>
        <ScrollView>
          {showEmptyError && (
            <Paragraph style={styles.text}>{T.t('no_item_transfer')}</Paragraph>
          )}
          {scan.scanGiveList.map(item => (
            <Card style={styles.card} key={item._id}>
              <ItemListCard item={item} isPriceShown={false}>
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
                  <IconButton
                    {...props}
                    icon="delete"
                    onPress={() => deleteItem(item._id)}
                  />
                </View>
              </ItemListCard>
            </Card>
          ))}
        </ScrollView>
        <View style={styles.buttons}>
          <DarkButton text={T.t('add')} onPress={addMore} />
          {scan.scanGiveList.length > 0 && (
            <TransparentButton
              text={`${T.t('apply_request')} (${scan.scanGiveList.length})`}
              onPress={createTransfer}
            />
          )}
        </View>

        <Snackbar
          visible={!!error.length}
          onDismiss={() => {
            dispatch(allowNewScan(true));
            setError('');
          }}
          action={{
            label: T.t('close'),
            onPress: () => {
              dispatch(allowNewScan(true));
              setError('');
            },
          }}>
          {error}
        </Snackbar>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    marginTop: -10,
    paddingTop: 25,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height / 1.1,
  },
  card: {
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
    color: '#22215B',
    borderRadius: 10,
  },
  load: {
    marginTop: 10,
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
  title: {
    fontSize: 14,
    textAlign: 'center',
  },
  buttons: {
    marginTop: 15,
    display: 'flex',
    alignSelf: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 70,
  },
  button: {
    flex: 1,
  },
});

export default GiveListCheck;
