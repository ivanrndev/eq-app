import React from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import {Title} from 'react-native-paper';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import {getProperErrorMessage} from '../../../utils/helpers.js';
import DarkButton from '../../../components/Buttons/DarkButton';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {allowNewScan} from '../../../actions/actions.js';

export const WriteOffFinish = props => {
  const dispatch = useDispatch();
  const writeoff = useSelector(state => state.writeoff);
  const settings = useSelector(state => state.settings);
  const store = useSelector(state => state.scan);
  const error = getProperErrorMessage(
    writeoff.inWriteOffError,
    store.currentScan,
  );

  const againSend = () => {
    props.navigation.navigate(settings.startPageWriteOff);
    dispatch(allowNewScan(true));
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={true}
        arrow={true}
        goTo={settings.startPageWriteOff}
        title={T.t('ban')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.container}>
          <View style={styles.info}>
            <View style={styles.info}>
              {!writeoff.inWriteOffError && (
                <Title style={styles.title}>{T.t('title_ban_done')}</Title>
              )}
              {!!writeoff.inWriteOffError && (
                <Title style={styles.titleError}>{error}</Title>
              )}
            </View>
          </View>
          <View style={styles.buttons}>
            <View style={styles.buttonBlock}>
              <DarkButton
                text={T.t('title_inventorization_question')}
                onPress={againSend}
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
    display: 'flex',
    alignItems: 'center',
    borderRadius: 10,
    height: Dimensions.get('window').height / 1.3,
    paddingBottom: 10,
    paddingTop: 20,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#EDF6FF',
  },
  buttonBlock: {
    width: Dimensions.get('window').height / 3.3,
    textAlign: 'center',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: '#22215B',
    textAlign: 'center',
    padding: 30,
    fontSize: 21,
  },
  titleError: {
    color: '#E40B67',
    textAlign: 'center',
    padding: 30,
    fontSize: 21,
  },
  text: {
    fontSize: 20,
    color: '#22215B',
    width: Dimensions.get('window').width / 1.3,
  },
  buttons: {
    position: 'absolute',
    bottom: 20,
  },
});

export default WriteOffFinish;
