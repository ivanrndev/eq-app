/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Card, IconButton, Paragraph, Snackbar} from 'react-native-paper';
import T from '../../../../i18n';
// components
import Appbar from '../../../../components/Appbar';
import {getProperErrorTransfer} from '../../../../utils/helpers.js';
import DarkButton from '../../../../components/Buttons/DarkButton';
import TransparentButton from '../../../../components/Buttons/TransparentButton';

// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  loader,
  allowNewScan,
  updateGiveList,
  makeTransfer,
} from '../../../../actions/actions.js';
import ItemListCardContent from '../../../../components/ItemListCardContent';

const GiveListCheck = props => {
  const dispatch = useDispatch();
  const [scan, give, settings] = useSelector(({scan, give, settings}) => [
    scan,
    give,
    settings,
  ]);
  const quantity = scan.scanGiveList.batch
    ? scan.scanGiveList.batch.quantity
    : 1;
  const [error, setError] = useState('');
  const [giveList, setGiveList] = useState(
    scan.scanGiveList.map(item => ({id: item._id, quantity})),
  );
  let showEmptyError = !scan.scanGiveList.length;
  const userCurrentId = give.userCurrentId;

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
      setError(getProperErrorTransfer('Copy', scan.currentScan));
    } else {
      if (scan.scanInfoError) {
        setError(getProperErrorTransfer(scan.scanInfoError, scan.currentScan));
      }
    }
  }, [scan.scanGiveList, scan.currentScan, scan.scanInfoError]);

  const deleteItem = id => {
    let updateList = scan.scanGiveList.filter(item => item._id !== id);
    dispatch(updateGiveList(updateList));
  };

  const createTransfer = () => {
    dispatch(makeTransfer(props.navigation, giveList, userCurrentId));
  };

  const addMore = () => {
    props.navigation.navigate(settings.startPageGive);
    dispatch(allowNewScan(true));
  };
  const setQuantity = () => {};
  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        goTo={'GiveList'}
        title={T.t('create_request')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <ScrollView>
          {showEmptyError && (
            <Paragraph style={styles.text}>{T.t('no_item_transfer')}</Paragraph>
          )}
          {scan.scanGiveList.map((item, index) => (
            <Card style={styles.card}>
              <ItemListCardContent item={item}>
                <View style={styles.cardBottom}>
                  <View style={styles.setQtyBtn}>
                    {+item.batch.quantity !== 1 && (
                      <DarkButton
                        onPress={setQuantity}
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
              </ItemListCardContent>
            </Card>
          ))}
        </ScrollView>
        <View style={styles.buttons}>
          <DarkButton text={T.t('add')} onPress={addMore} />
          {scan.scanGiveList.length > 0 && (
            <TransparentButton text={T.t('create')} onPress={createTransfer} />
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
    display: 'flex',
    paddingTop: 25,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height / 1.1,
  },

  load: {
    marginTop: 10,
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
    color: '#22215B',
    borderRadius: 10,
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
