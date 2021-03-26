/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {isEmpty} from 'lodash';
import T from '../../../../i18n';
import CheckBox from '@react-native-community/checkbox';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {
  ActivityIndicator,
  Button,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
  Snackbar,
  Text,
} from 'react-native-paper';
// components
import Appbar from '../../../../components/Appbar';
import DarkButton from '../../../../components/Buttons/DarkButton';
import TransparentButton from '../../../../components/Buttons/TransparentButton';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  allowNewScan,
  alreadyScannedBids,
  changeLocationLoc,
  changeLocationMain,
  clearUserAcceptBid,
  loader,
  makeAccept,
} from '../../../../actions/actions.js';
import ItemListCard from '../../../../components/ItemListCard';

const AcceptList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [accept, settings, scan] = useSelector(({accept, settings, scan}) => [
    accept,
    settings,
    scan,
  ]);

  let bidItems = accept.acceptList.filter(item => {
    return item._id === accept.userAcceptBid;
  });
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [rejectIds, setRejectIds] = useState(
    bidItems[0] && bidItems[0].items.map(item => item._id),
  );

  const objects = settings.locations ? settings.locations : [];

  const [acceptedIds, setAcceptedIds] = useState([]);
  let showEmptyError = !isEmpty(bidItems) ? !bidItems[0].items.length : false;

  const selectedValue = settings.locationMain;
  const selectedValueLoc = settings.locationLoc;

  const currentLocation = objects.filter(x => {
    if (x.title === selectedValue) {
      return x;
    }
  });
  const isItemSelected = id => acceptedIds.includes(id);
  const acceptItemsCount = accept.length > 0 ? `(${acceptedIds.length})` : '';

  useEffect(() => {
    if (!isEmpty(bidItems)) {
      const filteredBids = bidItems[0].items.filter(x => {
        if (x.code === scan.currentScan) {
          return x.code === scan.currentScan;
        }
      });
      if (!isEmpty(filteredBids)) {
        if (!acceptedIds.includes(filteredBids[0].code)) {
          dispatch(alreadyScannedBids(acceptedIds.concat(filteredBids)));
        }
      } else {
        if (scan.currentScan) {
          setError(
            `${T.t('service_identifier_first')} ${scan.currentScan} ${T.t(
              'do_not_apply',
            )}`,
          );
        }
      }
    }
  }, [scan.currentScan]);

  const makeAcceptBid = () => {
    dispatch(loader(true));
    dispatch(
      makeAccept(
        accept.userAcceptBid,
        rejectIds,
        navigation,
        selectedValue,
        selectedValueLoc,
      ),
    );
  };
  useEffect(() => {
    if (scan.selectGiveId.length > 0) {
      setAcceptedIds([...acceptedIds, scan.selectGiveId]);
      setRejectIds(rejectIds.filter(item => item !== scan.selectGiveId));
    }
  }, [scan.selectGiveId]);

  const makeScan = () => {
    navigation.navigate(settings.startPageAccept);
    dispatch(allowNewScan(true));
  };

  const cancelScan = () => {
    navigation.navigate('Accept');
    dispatch(allowNewScan(true));
    dispatch(clearUserAcceptBid());
    dispatch(alreadyScannedBids([]));
  };
  const handleSelectCheckbox = (isChecked, id) => {
    if (!isChecked) {
      setAcceptedIds(acceptedIds.filter(item => item !== id));
      setRejectIds([...rejectIds, id]);
    } else {
      !isItemSelected(id) && setAcceptedIds([...acceptedIds, id]);
      setRejectIds(rejectIds.filter(item => item !== id));
    }
  };
  const handleSelecttAll = () => {
    if (rejectIds.length === 0) {
      setRejectIds(bidItems[0] && bidItems[0].items.map(item => item._id));
      setAcceptedIds([]);
    } else {
      setAcceptedIds(bidItems[0] && bidItems[0].items.map(item => item._id));
      setRejectIds([]);
    }
  };

  return (
    <>
      <Appbar
        navigation={navigation}
        arrow={true}
        newScan={true}
        clearUserAcceptBid={true}
        alreadyScannedBids={true}
        goTo={'Accept'}
        title={T.t('accept')}
        clearlocationMain={true}
        clearlocationLoc={true}
      />

      <IconButton
        icon={rejectIds.length === 0 ? 'select-inverse' : 'select-all'}
        size={35}
        color="#22215B"
        onPress={handleSelecttAll}
        style={styles.selectAllButton}
      />

      <SafeAreaView />
      <Portal>
        {settings.loader && (
          <View style={styles.loader}>
            <ActivityIndicator
              style={styles.load}
              size={80}
              animating={true}
              color={'#EDF6FF'}
            />
          </View>
        )}
      </Portal>
      <View style={styles.body}>
        <ScrollView>
          {showEmptyError && (
            <Paragraph style={styles.title}>
              {T.t('accept_not_added')}
            </Paragraph>
          )}

          {!isEmpty(bidItems) &&
            bidItems[0].items.map(item => (
              <View style={styles.card} key={item._id}>
                <ItemListCard isPriceShown={false} item={item} width="70%" />
                {!item.is_marked || isItemSelected(item._id) ? (
                  <CheckBox
                    value={isItemSelected(item._id)}
                    tintColor="#22215B"
                    onCheckColor="#22215B"
                    disabled={false}
                    boxType="square"
                    style={styles.checkBox}
                    lineWidth={1}
                    onValueChange={isChecked =>
                      handleSelectCheckbox(isChecked, item._id)
                    }
                  />
                ) : (
                  <IconButton
                    icon="qrcode-scan"
                    color="#22215B"
                    onPress={() => makeScan(item._id)}
                  />
                )}
              </View>
            ))}
        </ScrollView>
        <>
          <View style={styles.buttonObject}>
            <DarkButton
              text={T.t('select_location')}
              onPress={() => setShowModal(!showModal)}
            />
          </View>
          <View style={styles.buttons}>
            <View style={styles.buttonBlock}>
              <DarkButton
                text={`${T.t('title_accept_bid')}${acceptItemsCount}`}
                disabled={acceptedIds.length === 0}
                onPress={() => makeAcceptBid()}
              />
            </View>

            <View style={styles.buttonBlock}>
              <TransparentButton text={T.t('cancel')} onPress={cancelScan} />
            </View>
          </View>
        </>
        <Snackbar
          visible={!!error.length}
          onDismiss={() => {
            setError('');
          }}
          action={{
            label: T.t('close'),
            onPress: () => {
              setError('');
            },
          }}>
          {error}
        </Snackbar>
      </View>
      <Portal>
        <Dialog visible={showModal} onDismiss={() => setShowModal(false)}>
          {/* <Dialog.Title>{T.t('object')}</Dialog.Title> */}
          <Dialog.Content>
            <View style={styles.container}>
              <Text style={styles.left}>{T.t('object')}:</Text>
              <Picker
                selectedValue={selectedValue}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => {
                  dispatch(changeLocationMain(itemValue));
                }}>
                <Picker.Item label={T.t('choise')} value="" />
                {objects.map((item, index) => {
                  return (
                    <Picker.Item
                      key={index}
                      label={item.title}
                      value={item.title}
                    />
                  );
                })}
              </Picker>
              {!!selectedValue && (
                <>
                  <Text style={styles.leftTwo}>{T.t('location')}:</Text>
                  <Picker
                    selectedValue={selectedValueLoc}
                    style={styles.pickerTwo}
                    onValueChange={(itemValue, itemIndex) => {
                      dispatch(changeLocationLoc(itemValue));
                    }}>
                    <Picker.Item label={T.t('choise')} value="" />
                    {currentLocation
                      ? currentLocation[0].locations.map((item, index) => {
                          return (
                            <Picker.Item
                              key={index}
                              label={item}
                              value={item}
                            />
                          );
                        })
                      : null}
                  </Picker>
                </>
              )}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowModal(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height / 1.1,
  },
  buttonStyle: {
    height: Dimensions.get('window').height / 15,
  },
  buttonBlock: {
    width: Dimensions.get('window').width / 2.4,
    textAlign: 'center',
  },
  selectAllButton: {
    position: 'absolute',
    zIndex: 100,
    right: 10,
    bottom: Dimensions.get('window').height / 1.1 - 22,
  },
  buttonObject: {
    display: 'flex',
    width: Dimensions.get('window').width / 1.1,
  },
  load: {
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 5,
    marginVertical: 10,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#EDF6FF',
  },

  title: {
    fontSize: 14,
    paddingLeft: 15,
    textAlign: 'center',
  },
  left: {
    fontSize: 14,
    paddingLeft: 15,
    textAlign: 'left',
    marginBottom: -70,
  },
  leftTwo: {
    fontSize: 14,
    textAlign: 'left',
    marginBottom: -95,
    marginLeft: 20,
  },
  checkBox: {height: 20, marginRight: 3},
  buttons: {
    marginTop: 15,
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-around',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 70,
  },
  buttonTwo: {
    width: Dimensions.get('window').width / 2.4,
  },
  loader: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: Dimensions.get('window').height / 9,
    zIndex: 99,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  picker: {
    // marginTop: -45,
  },
  pickerTwo: {
    marginTop: 50,
    marginBottom: -40,
  },
  container: {
    paddingTop: 25,
    width: Dimensions.get('window').width / 1.4,
    height: 'auto',
  },
});

export default AcceptList;
