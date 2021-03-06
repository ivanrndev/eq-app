import React from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
// components
import T from '../../../i18n';
import Appbar from '../../../components/Appbar';
import DarkButton from '../../../components/Buttons/DarkButton';
import TransparentButton from '../../../components/Buttons/TransparentButton';
import {fontSizer} from '../../../utils/helpers.js';
import {useDispatch, useSelector} from 'react-redux';
import {nfc} from '../../../actions/actions.js';

const ServiceMenu = props => {
  const width = Dimensions.get('window').width;
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        goTo={'Home'}
        title={T.t('service_title')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.buttons}>
          <View style={styles.buttonBlock}>
            <DarkButton
              size={fontSizer(width)}
              text={T.t('send_service')}
              onPress={() => {
                props.navigation.navigate(settings.startPageService);
                dispatch(
                  nfc(
                    'ServiceMenu',
                    'ServiceInfo',
                    false,
                    'Service',
                    'startPageService',
                  ),
                );
              }}
            />
          </View>
          <View style={styles.buttonBlock}>
            <TransparentButton
              size={fontSizer(width)}
              text={T.t('back_service')}
              onPress={() => {
                props.navigation.navigate(settings.startPageBack);
                dispatch(
                  nfc(
                    'ServiceMenu',
                    'BackInfo',
                    false,
                    'BackScanner',
                    'startPageBack',
                  ),
                );
              }}
            />
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
  buttonBlock: {
    width: Dimensions.get('window').height / 3.3,
    textAlign: 'center',
  },
  title: {
    color: '#fff',
  },
  button: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttonStyle: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 15,
  },
  buttons: {
    top: Dimensions.get('window').height / 3,
  },
  BottomButton: {
    position: 'absolute',
    bottom: 140,
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default ServiceMenu;
