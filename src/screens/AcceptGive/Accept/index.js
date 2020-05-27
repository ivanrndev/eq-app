import React from 'react';
import moment from 'moment';
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
import T from '../../../i18n';
import AsyncStorage from '@react-native-community/async-storage';
// components
import Appbar from '../../../components/Appbar';
import {
  getProperErrorMessage,
  getProperTransferStatus,
} from '../../../utils/helpers.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  userAcceptBid,
  getBidList,
  acceptloadMoreStatus,
} from '../../../actions/actions.js';

const Accept = props => {
  const dispatch = useDispatch();
  const accept = useSelector(state => state.accept);
  let error = getProperErrorMessage(accept.acceptError);

  const getMoreItems = () => {
    AsyncStorage.getItem('userId').then(userId => {
      dispatch(acceptloadMoreStatus(true));
      dispatch(getBidList(props.navigation, userId, accept.offSet));
    });
  };

  let showEmptyError = !accept.acceptList.length;

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        clearBidList={true}
        goTo={'AcceptGive'}
        title={T.t('title_choose')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        {!error && (
          <>
            <View style={styles.container}>
              <ScrollView>
                {showEmptyError && (
                  <Paragraph style={styles.text}>
                    {T.t('no_available')}
                  </Paragraph>
                )}
                {!error
                  ? accept.acceptList.map((item, index) => (
                      <Card
                        style={styles.card}
                        key={index}
                        onPress={() =>
                          dispatch(userAcceptBid(props.navigation, item._id))
                        }>
                        <Card.Content>
                          <Title style={styles.cardTitle}>
                            {T.t('transfer_from')}: {item.sender.firstName}{' '}
                            {item.sender.lastName}
                          </Title>
                          <Paragraph style={styles.paragraph}>
                            {T.t('transfer_status')}:{' '}
                            {getProperTransferStatus(item.status)}
                          </Paragraph>
                          <Paragraph style={styles.paragraph}>
                            {T.t('title_date')}:{' '}
                            {moment(item.createdAt).format('YYYY-MM-DD HH:mm')}
                          </Paragraph>
                          <Paragraph style={styles.paragraph}>
                            {T.t('transfer_count')}: {item.items.length}
                          </Paragraph>
                        </Card.Content>
                      </Card>
                    ))
                  : null}
              </ScrollView>
            </View>
            {accept.acceptList.length > 5 && (
              <>
                {!accept.acceptloadMore && (
                  <Button
                    style={styles.button}
                    mode="Text"
                    color="#22215B"
                    onPress={getMoreItems}>
                     {T.t('load_more')}
                  </Button>
                )}
                {accept.acceptloadMore && (
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
    height: Dimensions.get('window').height / 1.35,
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
  },
  cardTitle: {
    fontSize: 14,
    color: '#22215B',
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 15,
    color: '#22215B',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    paddingBottom: 20,
    color: '#22215B',
    width: Dimensions.get('window').width / 1.2,
  },
});

export default Accept;
