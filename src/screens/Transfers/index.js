import React, {useState, useEffect} from 'react';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
// components
import Appbar from '../../components/Appbar';
import {
  getProperErrorMessage,
  getProperTransferStatus,
} from '../../utils/helpers.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  loadMoreTransfers,
  getTransfers,
  saveCurrenTransferId,
} from '../../actions/actions.js';

const Transfers = props => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();
  const transfers = useSelector(state => state.transfers);
  let error = getProperErrorMessage(transfers.transferError);

  useEffect(() => {
    AsyncStorage.getItem('userId').then(_id => {
      setUserId(_id);
    });
  }, [userId]);

  const getMoreItems = () => {
    dispatch(loadMoreTransfers(true));
    dispatch(getTransfers(props.navigation, userId, transfers.offSet));
  };

  let showEmptyError = !transfers.transferList.length;

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        clearTransfer={true}
        goTo={'AcceptGive'}
        title={'История заявок'}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.container}>
          {!error && (
            <>
              <ScrollView>
                {showEmptyError && (
                  <Paragraph style={styles.text}>
                    На данный момент в истории нет заявок
                  </Paragraph>
                )}
                {!error &&
                  transfers.transferList.map((item, index) => (
                    <Card
                      style={styles.card}
                      key={index}
                      onPress={() =>
                        dispatch(
                          saveCurrenTransferId(props.navigation, item._id),
                        )
                      }>
                      <Card.Content>
                        <Paragraph style={styles.paragraph}>
                          От кого: {item.sender.firstName}{' '}
                          {item.sender.lastName}
                        </Paragraph>
                        <Paragraph style={styles.paragraph}>
                          Создано:{' '}
                          {moment(item.createdAt).format('YYYY-MM-DD HH:mm')}
                        </Paragraph>
                        <Paragraph style={styles.paragraph}>
                          Колличество: {item.items.length}
                        </Paragraph>
                        <Paragraph style={styles.paragraph}>
                          Кому: {item.recipient.firstName}{' '}
                          {item.recipient.lastName}
                        </Paragraph>
                        <Paragraph style={styles.paragraph}>
                          Статус: {getProperTransferStatus(item.status)}
                        </Paragraph>
                      </Card.Content>
                    </Card>
                  ))}
              </ScrollView>
              {transfers.transferList.length > 5 && (
                <>
                  {!transfers.loadMoreTransfers && (
                    <Button
                      style={styles.button}
                      mode="Text"
                      color="#22215B"
                      onPress={getMoreItems}>
                       Загрузить еще
                    </Button>
                  )}
                  {transfers.loadMoreTransfers && (
                    <ActivityIndicator
                      style={styles.load}
                      size={'large'}
                      animating={true}
                      color={'#7A7A9D'}
                    />
                  )}
                </>
              )}
            </>
          )}
          {error ? <Title style={styles.title}>{error}</Title> : null}
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
    display: 'flex',
    alignItems: 'center',
    borderRadius: 10,
    height: Dimensions.get('window').height / 1.3,
    paddingBottom: 10,
    paddingTop: 20,
    paddingLeft: 11,
    paddingRight: 11,
    backgroundColor: '#EDF6FF',
  },
  load: {
    marginTop: 10,
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.2,
    marginBottom: 0,
    backgroundColor: '#EDF6FF',
    borderWidth: 0,
    shadowColor: '#EDF6FF',
    borderRadius: 0,
    borderBottomWidth: 1,
    borderColor: '#D3E3F2',
  },
  cardTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 15,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    paddingBottom: 20,
    width: Dimensions.get('window').width / 1.2,
  },
});

export default Transfers;
