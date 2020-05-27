import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Card, IconButton} from 'react-native-paper';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';
// redux and actions
import {useSelector} from 'react-redux';

const TransferInfo = props => {
  const transfers = useSelector(state => state.transfers);
  const [infoList, setInfoList] = useState();

  useEffect(() => {
    const transferList = transfers.transferList;
    let correctItem = transferList.find(item => {
      return item._id === transfers.transferId;
    });
    setInfoList(correctItem);
  }, [transfers]);

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
            {infoList &&
              infoList.items.map((item, index) => (
                <Card.Title
                  key={index}
                  style={styles.card}
                  title={`${item.metadata.brand} / ${item.code}`}
                  subtitle={`${item.metadata.serial} / ${item.metadata.model}`}
                  right={props => <IconButton {...props} onPress={() => {}} />}
                />
              ))}
          </ScrollView>
          <View style={styles.button}>
            <View style={styles.buttonBlock}>
              <DarkButton
                text={T.t('to_list')}
                onPress={() => props.navigation.navigate('Transfers')}
              />
            </View>
          </View>
        </View>
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
  buttonBlock: {
    width: Dimensions.get('window').height / 3.3,
    textAlign: 'center',
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
  button: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default TransferInfo;
