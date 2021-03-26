import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Card, Paragraph, Title} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import T from '../../i18n';
// components
import Appbar from '../../components/Appbar';
import {getProperErrorMessage} from '../../utils/helpers.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  clearInventory,
  getUserList,
  saveCurrentUserInventory,
} from '../../actions/actions.js';

const Inventory = props => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.give);
  let showEmptyError = !users.userList.length;
  let error = getProperErrorMessage(users.getUsetError);
  const [userLists, setUserLists] = useState(users.userList);
  const [showText, setShowText] = useState(true);
  useEffect(() => {
    dispatch(getUserList(props.nav, '', 'Inventory'));
    dispatch(clearInventory());
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('role').then(role => {
      if (role === 'worker') {
        AsyncStorage.getItem('userId').then(userId => {
          let newList = users.userList.filter(item => {
            return item._id === userId;
          });
          setShowText(false);
          setUserLists(newList);
        });
      } else {
        setUserLists(users.userList);
        setShowText(true);
      }
    });
  }, [users.userList]);

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        clearUserList={true}
        newScan={true}
        goTo={'Home'}
        isMutiple={true}
        title={T.t('select_user')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        {!error && (
          <>
            <ScrollView>
              {showEmptyError && (
                <Paragraph style={styles.text}>{T.t('no_users')}</Paragraph>
              )}
              {!error &&
                userLists.map((item, index) => (
                  <Card
                    style={styles.card}
                    key={index}
                    onPress={() => {
                      dispatch(
                        saveCurrentUserInventory(
                          item._id,
                          props.navigation,
                          'InventoryChooseMode',
                        ),
                      );
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
    fontSize: 18,
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
  textCheckbox: {
    marginTop: -30,
    marginLeft: 40,
    marginBottom: 20,
  },
});

export default Inventory;
