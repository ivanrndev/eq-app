/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  Snackbar,
  Text,
  Title,
} from 'react-native-paper';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';
import TransparentButton from '../../../components/Buttons/TransparentButton';
import {
  getProperErrorTransfer,
  handleNavigateToSingleItemPage,
} from '../../../utils/helpers.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {loader, nfc, updateTransfer} from '../../../actions/actions.js';
import SetQtyCard from '../../../components/SetQtyCard';

const TransferEdit = props => {
  const dispatch = useDispatch();
  const [transfers, scan, transfersList, transferId] = useSelector(
    ({transfers, scan}) => [
      transfers,
      scan,
      transfers.transferList,
      transfers.transferId,
    ],
  );

  const [infoList, setInfoList] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [error, setError] = useState('');

  // auto save after scaner
  useEffect(() => {
    if (!scan.selectGiveId) {
      return;
    }
    if (scan.scanInfoError) {
      setError(
        getProperErrorTransfer(scan.scanInfoError, scan.currentScan, true),
      );
    } else {
      const valueArr = infoList.map(item => item._id);
      const isDuplicate = valueArr.includes(scan.selectGiveId);
      if (isDuplicate) {
        setError(getProperErrorTransfer('Copy', scan.currentScan, true));
      } else {
        infoList.push(scan.scanInfo);
        let updateList = infoList.filter(item => {
          if (!item.willDelete) {
            return item;
          }
        });
        dispatch(
          updateTransfer(
            props.navigation,
            transfers.transferId,
            updateList,
            'TransfersEdit',
          ),
        );
      }
    }
  }, [scan.scanInfo]);

  // get transfer list
  useEffect(() => {
    const transferList = transfers.transferList;
    let correctItem = transferList.find(item => {
      return item._id === transfers.transferId;
    });
    setInfoList(correctItem ? correctItem.items : []);
    if (transfers.transferUpdateError) {
      setError(
        getProperErrorTransfer(
          transfers.transferUpdateError.type,
          scan.currentScan,
          true,
        ),
      );
    }
  }, [transfers]);

  const transferredItems = transfersList.find(item => item._id === transferId);

  // confirm delete
  const deleteItem = id => {
    const unUpdatedItems = transferredItems.items.filter(pc => pc._id !== id);

    dispatch(loader(true));
    dispatch(
      updateTransfer(
        props.navigation,
        transfers.transferId,
        unUpdatedItems,
        'TransfersEdit',
      ),
    );
  };
  const handleChangeQty = item => {
    handleNavigateToSingleItemPage(
      item.code,
      props.navigation,
      item._id,
      'TransferSetQty',
      dispatch,
    );
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        goTo={'TransferInfo'}
        title={T.t('edit')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.container}>
          <ScrollView>
            {infoList && infoList.length < 1 && (
              <Text style={styles.infoText}>{T.t('empty_transfer')}</Text>
            )}
            {infoList &&
              infoList.map(item => (
                <SetQtyCard
                  item={item}
                  deleteItem={() => deleteItem(item._id)}
                  handleChangeQty={() => handleChangeQty(item)}
                  setItemQty={() => false}
                  navigation={props.navigation}
                  dispatch={dispatch}
                />
              ))}
          </ScrollView>
          <View style={styles.buttons}>
            <View style={styles.buttonBlock}>
              <DarkButton
                text={T.t('add')}
                onPress={() => {
                  dispatch(
                    nfc(
                      'TransfersEdit',
                      'TransfersEdit',
                      false,
                      'TransferEdit',
                      null,
                      false,
                    ),
                  );
                  props.navigation.navigate('TransferScaner');
                }}
              />
            </View>
            {infoList && infoList.map(i => i.willDelete).includes(true) && (
              <View style={styles.buttonBlock}>
                <TransparentButton
                  text={T.t('delete')}
                  onPress={() => setIsModal(true)}
                />
              </View>
            )}
          </View>
        </View>
      </View>
      <Portal>
        <Dialog
          style={styles.dialogOpen}
          visible={isModal}
          onDismiss={() => setIsModal(false)}>
          <>
            <Dialog.Title>
              <Title style={styles.titleForgot}>{T.t('delete')}</Title>
            </Dialog.Title>
            <Dialog.Content>
              <Text style={styles.titleForgotText}>
                {T.t('delete_confirm')}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={deleteItem}>{T.t('delete')}</Button>
            </Dialog.Actions>
          </>
        </Dialog>
      </Portal>
      <Snackbar
        visible={!!error.length}
        onDismiss={() => setError('')}
        action={{
          label: T.t('close'),
          onPress: () => {
            setError('');
          },
        }}>
        {error}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    marginTop: -10,
    display: 'flex',
    paddingTop: 30,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  container: {
    height: Dimensions.get('window').height / 1.2,
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
    borderRadius: 10,
  },
  cardDelete: {
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(144, 146, 176, 0.66)',
  },
  cardTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: 'black',
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttons: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  buttonBlock: {
    width: Dimensions.get('window').height / 5.5,
    textAlign: 'center',
    margin: 4,
  },
  dialogOpen: {
    backgroundColor: '#EDF6FF',
  },
  titleForgot: {
    color: '#22215B',
    fontSize: 23,
    marginBottom: 20,
    textAlign: 'left',
  },
  titleForgotText: {
    marginTop: -10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
});

export default TransferEdit;
