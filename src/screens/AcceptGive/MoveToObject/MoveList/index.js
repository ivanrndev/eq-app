import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Card, Title, Searchbar, Paragraph} from 'react-native-paper';
import T from '../../../../i18n';
// components
import Appbar from '../../../../components/Appbar';
import {getProperErrorMessage} from '../../../../utils/helpers.js';
import AsyncStorage from '@react-native-community/async-storage';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  saveCurrentUser,
  getUserList,
  clearGiveList,
} from '../../../../actions/actions.js';

const MoveList = props => {
  const dispatch = useDispatch();
  const give = useSelector(state => state.give);
  const settings = useSelector(state => state.settings);
  let error = getProperErrorMessage(give.getUsetError);
  const [search, setSearch] = useState('');
  const [userList, setUserList] = useState([]);
  let showEmptyError = !give.userList.length;

  const itemSearch = query => {
    setSearch(query);
    dispatch(getUserList(props.navigation, query));
  };

  useEffect(() => {
    AsyncStorage.getItem('userId').then(id => {
      let list = give.userList.filter(item => {
        return item._id !== id;
      });
      setUserList(list);
    });
  }, [give.userList]);

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={false}
        goTo={'AcceptGive'}
        title={T.t('select_user')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        {!error && (
          <Searchbar
            placeholder={T.t('search')}
            onChangeText={query => itemSearch(query)}
            value={search}
            style={styles.search}
          />
        )}
        {showEmptyError && (
          <Paragraph style={styles.text}>{T.t('no_users')}</Paragraph>
        )}
        {!error && (
          <>
            <ScrollView>
              {!error &&
                userList.map(item => (
                  <Card
                    style={styles.card}
                    key={item._id}
                    onPress={() => {
                      dispatch(
                        saveCurrentUser(
                          item._id,
                          item.role,
                          props.navigation,
                          settings.startPageGive,
                        ),
                      );
                      dispatch(clearGiveList());
                    }}>
                    <Card.Content>
                      <Title style={styles.cardTitle}>
                        {item.firstName} {item.lastName}
                      </Title>
                    </Card.Content>
                  </Card>
                ))}
            </ScrollView>
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
    paddingTop: 25,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: '90%',
    paddingBottom: 80,
  },
  load: {
    marginTop: 10,
  },
  search: {
    backgroundColor: '#EDF6FF',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 20,
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
  },
  cardTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export default MoveList;
