import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import {
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Button,
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
// components
import Appbar from '../../components/Appbar';
import {getProperErrorMessage} from '../../utils/helpers.js';
import {getDescription} from '../../utils/helpers.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {loadMoreTransactions, getTransactions} from '../../actions/actions.js';

const Transactions = props => {
  const [role, setRole] = useState();
  const transactions = useSelector(state => state.transactions);
  let error = getProperErrorMessage(transactions.transactionError);
  let showEmptyError = !transactions.transactionList.length;
  const dispatch = useDispatch();

  const getRole = async () => {
    try {
      const value = await AsyncStorage.getItem('role');
      if (value !== null) {
        setRole(value);
      }
    } catch (e) {
      console.log('no role');
    }
  };
  getRole();

  const getMoreItems = () => {
    dispatch(loadMoreTransactions(true));
    dispatch(
      getTransactions(
        transactions.transactionItemId,
        props.navigation,
        transactions.offSet,
      ),
    );
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={false}
        goTo={'back'}
        clearTransaction={true}
        title={'Транзакции'}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.container}>
          {!error && (
            <>
              <ScrollView>
                {showEmptyError && (
                  <Paragraph style={styles.text}>
                    Выдача и прием ТМЦ пока не производились
                  </Paragraph>
                )}
                {!error &&
                  transactions.transactionList.map((item, index) => (
                    <Card style={styles.card} key={index} onPress={() => {}}>
                      <Card.Content>
                        <Paragraph style={styles.paragraph}>
                          Идентификатор: {item.item.code}
                        </Paragraph>
                        <Paragraph style={styles.paragraph}>
                          Дата операции:{' '}
                          {moment(item.updatedAt).format('YYYY-MM-DD HH:mm')}
                        </Paragraph>
                        <Paragraph style={styles.paragraph}>
                          Кто проводил: {item.user.firstName}{' '}
                          {item.user.lastName}
                        </Paragraph>
                        <Paragraph style={styles.paragraph}>
                          Инфо: {getDescription(item, role)}
                        </Paragraph>
                      </Card.Content>
                    </Card>
                  ))}
              </ScrollView>
              {transactions.transactionList.length > 5 ? (
                <>
                  {!transactions.loadMoreTransaction && (
                    <Button
                      style={styles.button}
                      mode="Text"
                      color="#22215B"
                      onPress={getMoreItems}>
                       Загрузить еще
                    </Button>
                  )}
                  {transactions.loadMoreTransaction && (
                    <ActivityIndicator
                      style={styles.load}
                      size={'large'}
                      animating={true}
                      color={'#7A7A9D'}
                    />
                  )}
                </>
              ) : null}
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
    color: '#7A7A9D',
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
    color: '#7A7A9D',
    fontWeight: 'normal',
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

export default Transactions;
