/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useCallback, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Title} from 'react-native-paper';
import T from '../../../../i18n';
// components
import Appbar from '../../../../components/Appbar';
import DarkButton from '../../../../components/Buttons/DarkButton';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {updateGiveList, allowNewScan} from '../../../../actions/actions.js';
import {
  getProperErrorTransfer,
  getProperTransferStatus,
} from '../../../../utils/helpers.js';

const GiveFinish = props => {
  const dispatch = useDispatch();
  const give = useSelector(state => state.give);
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState('');
  const [titleStatus, setTitleStatus] = useState(false);

  let showButton = false;
  if (give.statusTransfer !== 'error') {
    showButton = true;
  }

  const goMenu = () => {
    dispatch(updateGiveList([]));
    dispatch(allowNewScan(true));
    props.navigation.navigate('Home');
  };

  const allErrors = useCallback(() => {
    let errorsMessages = give.transferError.map(error => {
      return getProperErrorTransfer(error.type, error.code);
    });
    setErrors(errorsMessages);
  });

  useEffect(() => {
    allErrors();
    if (give.statusTransfer === 'complete') {
      setStatus(T.t('auto_accept_transfer'));
      setTitleStatus(true);
    } else {
      setTitleStatus(false);
      setStatus(getProperTransferStatus(give.statusTransfer));
    }
  }, [give.statusTransfer]);

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        goTo={'GiveListCheck'}
        title={T.t('status_request')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.container}>
          <View style={styles.info}>
            <ScrollView style={styles.scrollView}>
              {status ? (
                <Title style={titleStatus ? styles.titleLarge : styles.title}>
                  {status}
                </Title>
              ) : null}
              {errors
                ? errors.map((item, index) => {
                    return (
                      <Title style={styles.text} key={index}>
                        {item}
                      </Title>
                    );
                  })
                : null}
            </ScrollView>
          </View>
          <View style={styles.buttons}>
            {showButton ? (
              <View style={styles.buttonBlock}>
                <DarkButton text={T.t('menu')} onPress={goMenu} />
              </View>
            ) : null}
            {!showButton ? (
              <View style={styles.buttonBlock}>
                <DarkButton
                  text={T.t('back')}
                  onPress={() => props.navigation.navigate('GiveListCheck')}
                />
              </View>
            ) : null}
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
    paddingTop: 25,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  buttonBlock: {
    width: Dimensions.get('window').height / 2.8,
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 10,
    minHeight: Dimensions.get('window').height / 2.1,
    paddingBottom: 10,
    paddingTop: 20,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#EDF6FF',
  },
  buttons: {
    position: 'absolute',
    bottom: 15,
  },
  button: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonStyle: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 15,
  },
  cardTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 15,
  },
  text: {
    textAlign: 'left',
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    marginTop: 10,
    lineHeight: 20,
  },
  title: {
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 21,
    color: '#22215B',
  },
  titleLarge: {
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 14,
    color: '#22215B',
  },
  info: {
    height: Dimensions.get('window').height / 1.6,
  },
});

export default GiveFinish;
