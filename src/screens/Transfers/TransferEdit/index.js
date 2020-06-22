/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Card,
  IconButton,
  Portal,
  Dialog,
  Title,
  Button,
  Text,
  Snackbar,
} from 'react-native-paper';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';
import TransparentButton from '../../../components/Buttons/TransparentButton';
import {getProperErrorTransfer} from '../../../utils/helpers.js';
// redux and actions
import {useSelector, useDispatch} from 'react-redux';
import {loader, updateTransfer} from '../../../actions/actions.js';

const TransferEdit = props => {
  const dispatch = useDispatch();
  const transfers = useSelector(state => state.transfers);
  const scan = useSelector(state => state.scan);
  const [infoList, setInfoList] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [error, setError] = useState('');

  // auto save after scaner
  useEffect(() => {
    if (!scan.selectGiveId) {
      return;
    }
    if (scan.scanInfoError) {
      setError(getProperErrorTransfer(scan.scanInfoError, scan.currentScan));
    } else {
      const valueArr = infoList.map(item => item._id);
      const isDuplicate = valueArr.includes(scan.selectGiveId);
      if (isDuplicate) {
        setError(getProperErrorTransfer('Copy', scan.currentScan));
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
        ),
      );
    }
  }, [transfers]);

  // delete + undo item
  const editItem = (id, status) => {
    let undoList = infoList.map(item => {
      if (item._id === id) {
        item.willDelete = status;
      }
      return item;
    });
    setInfoList(undoList);
  };

  // confirm delete
  const deleteItem = () => {
    setIsModal(false);
    let updateList = infoList.filter(item => {
      if (!item.willDelete) {
        return item;
      }
    });
    dispatch(loader(true));
    dispatch(
      updateTransfer(
        props.navigation,
        transfers.transferId,
        updateList,
        'TransfersEdit',
      ),
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
              infoList.map((item, index) => (
                <Card.Title
                  key={index}
                  style={item.willDelete ? styles.cardDelete : styles.card}
                  title={
                    item.metadata ? `${item.metadata.brand} / ${item.code}` : ''
                  }
                  subtitle={
                    item.metadata
                      ? `${item.metadata.serial} / ${item.metadata.model}`
                      : ''
                  }
                  right={props =>
                    item.willDelete ? (
                      <IconButton
                        {...props}
                        icon="undo"
                        onPress={() => editItem(item._id, false)}
                      />
                    ) : (
                      <IconButton
                        {...props}
                        icon="delete"
                        onPress={() => editItem(item._id, true)}
                      />
                    )
                  }
                />
              ))}
          </ScrollView>
          <View style={styles.buttons}>
            <View style={styles.buttonBlock}>
              <DarkButton
                text={T.t('add')}
                onPress={() => props.navigation.navigate('TransferScaner')}
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
