/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useState, useCallback, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StyleSheet, View, Dimensions, SafeAreaView, ScrollView, Text} from 'react-native';
import {Portal, Card, Dialog, IconButton, Button, Snackbar} from 'react-native-paper';
import {isEmpty} from 'lodash';
// components
import Appbar from '../../../components/Appbar';
import MountScanner from '../../../components/MountScanner';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {loader, unMountItemFromParent, getMarkingList, mountItemFromParent} from '../../../actions/actions.js';
import T from '../../../i18n';
import DarkButton from '../../../components/Buttons/DarkButton';
import TransparentButton from '../../../components/Buttons/TransparentButton';
import {fontSizer} from '../../../utils/helpers.js';
import {getProperErrorTransfer} from '../../../utils/helpers.js';
import AsyncStorage from '@react-native-community/async-storage';

export const MountList = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.scan);
  const width = Dimensions.get('window').width;
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const editItems = store.scanInfo.items;
  const [isText, setIsText] = useState('');
  const [userId, setUserId] = useState();

  const getUserId = async () => {
    try {
      const value = await AsyncStorage.getItem('userId');
      if (value !== null) {
        setUserId(value);
      }
    } catch (e) {
      console.log('no role');
    }
  };
  getUserId();

  useEffect(() => {
    const personId = store.mountScanInfo.person ? store.mountScanInfo.person._id : null;
    const gaveAcess = userId === personId ? true : false;

    const newItem = store.mountScanInfo._id;
    const checkInArray = !isEmpty(editItems) && editItems.map(i => i._id).includes(newItem) ? 'DuplicateMount' : false;

    const inComplect =
       (store.mountScanInfo.items && !isEmpty(store.mountScanInfo.items)) ||
       (store.mountScanInfo.parent  && !isEmpty(store.mountScanInfo.parent)) ? true : false;

    if (inComplect) {
      setIsText(T.t('inComplect'));
    }

    const isParent =  store.mountScan === store.currentScan ? true : false;
    if (isParent) {
      setIsText(T.t('parentError'));
    }

    if (!isEmpty(store.mountScan) && !gaveAcess) {
      setIsText(T.t('no_acesss'));
    }

    const itemError = getProperErrorTransfer((store.mountError || checkInArray), store.mountScan);
    if (!isEmpty(itemError)) {
      setIsText(itemError);
    }

    if (!isText && gaveAcess) {
      dispatch(
        mountItemFromParent(
          store.scanInfo._id,
          newItem,
          store.currentScan,
          props.navigation,
          'MountList',
        ),
      );
    }
  }, [store.mountScanInfo, store.mountError]);

  const [scaner, setScaner] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setScaner(true);
      return () => {
        setIsText('');
        setScaner(false);
      };
    }, []),
  );

  const deleteItem = () => {
    setIsOpen(false);
    setIsText('');
    dispatch(loader(true));
    dispatch(unMountItemFromParent(
      store.scanInfo._id,
      [deleteId],
      store.scanInfo.code,
      props.navigation,
      'MountList'
    ));
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={false}
        arrow={true}
        goTo={'back'}
        title={T.t('edit')}
      />
      <SafeAreaView/>
        <View style={styles.container}>
            <View style={styles.scaner}>
              {scaner && (
                <MountScanner
                  nav={props.navigation}
                  page={'MountList'}
                  saveItems={false}
                />
              )}
            </View>
            <ScrollView style={styles.scroll}>
              <View style={styles.allBtn}>
                <View style={styles.buttonBlock}>
                    <TransparentButton
                      size={fontSizer(width)}
                      text={T.t('not_marking')}
                      onPress={() => {
                        dispatch(getMarkingList(false, props.navigation, false));
                        props.navigation.navigate('MountNoMarking');
                      }}
                    />
                </View>
                <View style={styles.buttonBlock}>
                    <DarkButton
                      size={fontSizer(width)}
                      text={T.t('done')}
                      onPress={() => props.navigation.goBack()}
                    />
                </View>
              </View>
              <View style={styles.cardBlock}>
              {!isEmpty(editItems) && editItems.map((item, index) => (
                        <Card.Title
                        key={index}
                        style={styles.card}
                        title={`${item.metadata.title ? item.metadata.title : ''}`}
                        subtitle={`${item.metadata.type ? item.metadata.type + ',' : ''} ${item.metadata.brand ? item.metadata.brand + ',' : ''} ${item.metadata.model ? item.metadata.model : ''} ${item.metadata.serial ? item.metadata.serial : ''}`}
                        right={props =>
                            <IconButton
                                {...props}
                                icon="delete"
                                onPress={() => {
                                    setDeleteId(item._id);
                                    setIsOpen(true);
                                }}
                            />
                        }
                    />
              ))}
              </View>
            </ScrollView>
            <Portal>
            <Dialog style={styles.dialog} visible={isOpen} onDismiss={() => {setIsOpen(!isOpen);}}>
              <Dialog.Title>{T.t('delete_item')}</Dialog.Title>
              <Dialog.Actions>
                      <Button onPress={() => deleteItem()}>{T.t('delete')}</Button>
              </Dialog.Actions>
            </Dialog>
            <Snackbar
              visible={!!isText.length}
              onDismiss={() => {
                setIsText('');
              }}
              action={{
                label: T.t('close'),
                onPress: () => {
                  setIsText('');
                },
              }}>
              {isText}
            </Snackbar>
          </Portal>
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#EDF6FF',
  },
    allBtn: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    width: Dimensions.get('window').width,
  },
  buttonBlock: {
    width: Dimensions.get('window').width / 2,
    paddingLeft: 10,
    paddingRight: 10,
  },
  container: {
    backgroundColor: '#EDF6FF',
    borderRadius: 10,
    height: Dimensions.get('window').height,
    paddingBottom: 20,
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: Dimensions.get('window').height / 30,
  },
  title: {
    color: '#7A7A9D',
    textAlign: 'center',
    padding: 30,
  },
  titleError: {
    color: '#E40B67',
    textAlign: 'center',
    padding: 30,
  },
  text: {
    fontSize: 16,
    paddingBottom: 5,
    color: '#7A7A9D',
    width: Dimensions.get('window').width / 1.3,
  },
  deleteBtn: {
    alignSelf: 'flex-end',
    width: 20,
    marginTop: -30,
    marginRight: -20,
    paddingLeft: 14,
    marginBottom: 10,
  },
  scaner: {
    height: Dimensions.get('window').height / 2,
    backgroundColor: 'gray',
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
  },
  cardTitle: {
    fontSize: 13,
    textTransform: 'uppercase',
    color: '#22215B',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 15,
    color: '#22215B',
  },
  cardBlock: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width / 1,
    marginBottom: 90,
  },
  scroll: {
    backgroundColor: '#D3E3F2',
  },
});

export default MountList;
