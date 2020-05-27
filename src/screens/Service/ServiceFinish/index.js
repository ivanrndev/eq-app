import React from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import {Title} from 'react-native-paper';
// components
import T from '../../../i18n';
import Appbar from '../../../components/Appbar';
import {getProperErrorMessage} from '../../../utils/helpers.js';
import DarkButton from '../../../components/Buttons/DarkButton';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {allowNewScan} from '../../../actions/actions.js';

export const ServiceFinish = props => {
  const dispatch = useDispatch();
  const services = useSelector(state => state.services);
  const store = useSelector(state => state.scan);
  const error = getProperErrorMessage(
    services.inServicesError,
    store.currentScan,
  );

  const goMenu = () => {
    props.navigation.navigate('Home');
    dispatch(allowNewScan(true));
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={true}
        arrow={true}
        goTo={'Service'}
        title={T.t('send_service')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.container}>
          <View style={styles.info}>
            <View style={styles.info}>
              {!services.inServicesError && (
                <Title style={styles.title}>{T.t('send_service_finish')}</Title>
              )}
              {!!services.inServicesError && (
                <Title style={styles.titleError}>{error}</Title>
              )}
            </View>
          </View>
          <View style={styles.buttons}>
            <View style={styles.buttonBlock}>
              <DarkButton text={T.t('menu')} onPress={goMenu} />
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

export default ServiceFinish;
