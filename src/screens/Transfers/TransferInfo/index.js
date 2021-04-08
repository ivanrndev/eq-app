import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Card, Portal, Dialog, Title, Text, Button} from 'react-native-paper';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';
import TransparentButton from '../../../components/Buttons/TransparentButton';

// redux and actions
import {useSelector, useDispatch} from 'react-redux';
import {loader} from '../../../actions/actions.js';
import {deleteTransfer} from '../../../actions/actions.js';
import ItemListCard from '../../../components/ItemListCard';

const TransferInfo = props => {
  const dispatch = useDispatch();
  const transfers = useSelector(state => state.transfers);
  const [infoList, setInfoList] = useState();
  const [transferOwner, setTransferOwner] = useState(false);
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    const transferList = transfers.transferList;
    let correctItem = transferList.find(item => {
      return item._id === transfers.transferId;
    });
    setInfoList(correctItem);

    // check owner of transfer
    AsyncStorage.getItem('userId').then(userId => {
      let sender = correctItem ? correctItem.sender._id : '';
      if (userId === sender && correctItem.status === 'pending') {
        setTransferOwner(true);
      } else {
        setTransferOwner(false);
      }
    });
  }, [transfers]);

  const handelDeleteTransfer = () => {
    setIsModal(false);
    dispatch(loader(true));
    dispatch(deleteTransfer(props.navigation, infoList._id, 'Transfers'));
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        goTo={'Transfers'}
        title={T.t('detail_info')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.container}>
          <ScrollView>
            {infoList && infoList.items.length < 1 && (
              <Text style={styles.infoText}>{T.t('empty_transfer')}</Text>
            )}
            {infoList &&
              infoList.items.map(item => (
                <Card style={styles.card} key={item._id}>
                  <ItemListCard item={item} isPriceShown={false} />
                </Card>
              ))}
          </ScrollView>
          <View style={styles.buttons}>
            {transferOwner ? (
              <>
                <View style={styles.buttonBlock}>
                  <DarkButton
                    text={T.t('edit')}
                    onPress={() => props.navigation.navigate('TransfersEdit')}
                  />
                </View>
                <View style={styles.buttonBlock}>
                  <TransparentButton
                    text={T.t('delete')}
                    onPress={() => setIsModal(true)}
                  />
                </View>
              </>
            ) : (
              <View style={styles.buttonBlock}>
                <DarkButton
                  text={T.t('to_list')}
                  onPress={() => props.navigation.navigate('Transfers')}
                />
              </View>
            )}
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
                  {T.t('delete_transfer_confirm')}
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={handelDeleteTransfer}>{T.t('delete')}</Button>
              </Dialog.Actions>
            </>
          </Dialog>
        </Portal>
      </View>
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
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  button: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttonBlock: {
    width: Dimensions.get('window').height / 5.5,
    textAlign: 'center',
    margin: 4,
  },
  buttons: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
});

export default TransferInfo;
