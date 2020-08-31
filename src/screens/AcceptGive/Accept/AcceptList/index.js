/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {isEmpty, isEqual} from 'lodash';
import T from '../../../../i18n';
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
  Paragraph,
  Snackbar,
  Portal,
  ActivityIndicator,
} from 'react-native-paper';
// components
import Appbar from '../../../../components/Appbar';
import DarkButton from '../../../../components/Buttons/DarkButton';
import TransparentButton from '../../../../components/Buttons/TransparentButton';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  loader,
  clearUserAcceptBid,
  alreadyScannedBids,
  makeAccept,
  allowNewScan,
} from '../../../../actions/actions.js';

const AcceptList = props => {
  const dispatch = useDispatch();
  const accept = useSelector(state => state.accept);
  const settings = useSelector(state => state.settings);
  const scan = useSelector(state => state.scan);
  const alreadyScanned = accept.alreadyScannedBids;
  const [error, setError] = useState('');
  let reject = [];

  let bidItems = accept.acceptList.filter(item => {
    return item._id === accept.userAcceptBid;
  });

  const [acceptedIds, setAcceptedIds] = useState(alreadyScanned);
  const [showButtonsScan, setShowButtonsScan] = useState(true);

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
            `Идентификатор ${scan.currentScan} не относиться к этой заявке`,
          );
        }
      }
    }
  }, [scan.currentScan]);

  useEffect(() => {
    if (!isEmpty(bidItems)) {
      if (bidItems[0].items.length === accept.alreadyScannedBids.length) {
        setShowButtonsScan(false);
      } else {
        setShowButtonsScan(true);
      }
    }
    if (!isEqual(accept.alreadyScannedBids, acceptedIds)) {
      setAcceptedIds(accept.alreadyScannedBids);
    }
  }, [accept.alreadyScannedBids, accept.userAcceptBid]);

  const makeAcceptBid = () => {
    let scannde = accept.alreadyScannedBids;
    let allBids = bidItems[0].items;
    if (scannde.length === 0) {
      reject = allBids;
    }
    if (allBids.length === scannde.length) {
      reject = [];
    }
    if (scannde.length > 0 && scannde.length < allBids.length) {
      reject = allBids
        .filter(x => !scannde.includes(x))
        .concat(scannde.filter(x => !allBids.includes(x)));
    }
    let rejectIds = reject.map(item => item._id);
    dispatch(loader(true));
    dispatch(makeAccept(accept.userAcceptBid, rejectIds, props.navigation));
  };

  const makeScan = () => {
    props.navigation.navigate('SelectScanAccept');
    dispatch(allowNewScan(true));
  };

  const cancelScan = () => {
    props.navigation.navigate('Accept');
    dispatch(allowNewScan(true));
    dispatch(clearUserAcceptBid());
    dispatch(alreadyScannedBids([]));
  };

  let showEmptyError = !isEmpty(bidItems) ? !bidItems[0].items.length : false;
  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        clearUserAcceptBid={true}
        alreadyScannedBids={true}
        goTo={'Accept'}
        title={T.t('accept')}
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
          {!isEmpty(bidItems)
            ? bidItems[0].items.map((item, index) => (
                <Card.Title
                  key={index}
                  style={styles.card}
                  title={`${item.metadata.brand} / ${item.code}`}
                  subtitle={
                    item.metadata.title
                      ? item.metadata.title
                      : `${item.type} ${item.brand} ${item.model} ${
                          item.serial
                        }`
                  }
                  right={props =>
                    alreadyScanned.map(i => i._id).includes(item._id) ? (
                      <IconButton {...props} icon="check" onPress={() => {}} />
                    ) : (
                      <IconButton {...props} icon="close" onPress={() => {}} />
                    )
                  }
                />
              ))
            : null}
        </ScrollView>
        <>
          <View style={styles.buttons}>
            {showButtonsScan && (
              <View style={styles.buttonBlock}>
                <DarkButton
                  text={T.t('title_continued_accept')}
                  onPress={makeScan}
                />
              </View>
            )}
            {!showButtonsScan && (
              <View style={styles.buttonBlock}>
                <DarkButton
                  text={T.t('title_accept_bid')}
                  onPress={() => makeAcceptBid()}
                />
              </View>
            )}
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
    width: Dimensions.get('window').height / 4.3,
    textAlign: 'center',
  },
  load: {
    marginTop: 10,
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#EDF6FF',
  },
  cardTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
  },
  buttons: {
    marginTop: 15,
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-around',
    width: Dimensions.get('window').width,
    marginBottom: 70,
  },
  button: {
    width: Dimensions.get('window').width / 2,
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
});

export default AcceptList;
