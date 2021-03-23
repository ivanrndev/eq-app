/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {SafeAreaView, Dimensions, StyleSheet, View} from 'react-native';
import Appbar from '../../components/Appbar';
import {useSelector} from 'react-redux';
import {isEmpty} from 'lodash';
import T from '../../i18n';
import {Portal, ActivityIndicator} from 'react-native-paper';
import Button from '../../components/Buttons/Menu';
import {copilot, walkthroughable, CopilotStep} from 'react-native-copilot';
import {useDispatch} from 'react-redux';
import {helps, nfc, changeIsMultiple} from '../../actions/actions.js';
import {menuSvg} from '../../utils/menuSvg.js';
import withLayout from '../../hooks/withLayout';

const Main = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.auth);
  const settings = useSelector(state => state.settings);
  const [myRole, setMyRole] = useState();
  const CopilotText = walkthroughable(View);

  // check is logOut
  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      if (isEmpty(token)) {
        props.navigation.navigate('Auth');
      }
    });
    AsyncStorage.getItem('role').then(role => setMyRole(role));
  }, [store.isLogOut]);

  // check help
  useEffect(() => {
    AsyncStorage.getItem('help').then(help => {
      if (help === '1') {
        props.start();
        AsyncStorage.setItem('help', '0');
        dispatch(helps(0));
      }
    });
  }, []);

  return (
    <>
      <View style={styles.background}>
        <Appbar
          navigation={props.navigation}
          arrow={false}
          newScan={false}
          menu={true}
          goTo={'Home'}
          title={'EqMan'}
        />
        <View style={styles.body}>
          <SafeAreaView />
          <Portal>
            {settings.loader && (
              <View style={styles.loader}>
                <ActivityIndicator
                  style={styles.load}
                  size={80}
                  animating={true}
                  color={'#EDF6FF'}
                />
              </View>
            )}
          </Portal>
          <CopilotStep text={T.t('ident_help')} order={1} name="Identification">
            <CopilotText>
              <Button
                nav={props.navigation}
                text={T.t('identification')}
                route={settings.startPageIdent}
                onPress={() =>
                  dispatch(
                    nfc('Home', 'IdentInfo', false, 'Ident', 'startPageIdent'),
                  )
                }
                svg={'ident'}
              />
            </CopilotText>
          </CopilotStep>
          <CopilotStep text={T.t('mark_help')} order={2} name="Marking">
            <CopilotText>
              <Button
                nav={props.navigation}
                text={T.t('mark')}
                route={'Marking'}
                svg={'marking'}
              />
            </CopilotText>
          </CopilotStep>
          <CopilotStep text={T.t('invent_help')} order={3} name="Inventory">
            <CopilotText>
              <Button
                nav={props.navigation}
                text={T.t('inventori')}
                getUserList={true}
                svg={'inventory'}
                onPress={() => dispatch(changeIsMultiple(true))}
              />
            </CopilotText>
          </CopilotStep>

          <CopilotStep text={T.t('accept_help')} order={4} name="AcceptGive">
            <CopilotText>
              <Button
                nav={props.navigation}
                text={T.t('give_accept')}
                route={'AcceptGive'}
                svg={'acceptGive'}
              />
            </CopilotText>
          </CopilotStep>

          {myRole !== 'worker' && (
            <>
              <CopilotStep text={T.t('service_help')} order={5} name="Service">
                <CopilotText>
                  <Button
                    nav={props.navigation}
                    text={T.t('service')}
                    route={'ServiceMenu'}
                    svg={'services'}
                  />
                </CopilotText>
              </CopilotStep>
              <CopilotStep
                text={T.t('write_off_help')}
                order={6}
                name="writeOff">
                <CopilotText>
                  <Button
                    nav={props.navigation}
                    text={T.t('ban')}
                    route={settings.startPageWriteOff}
                    onPress={() =>
                      dispatch(
                        nfc(
                          'Home',
                          'WriteOffInfo',
                          false,
                          'WriteOff',
                          'startPageWriteOff',
                        ),
                      )
                    }
                    svg={'writeOff'}
                  />
                </CopilotText>
              </CopilotStep>
            </>
          )}

          <CopilotStep text={T.t('my_account')} order={7} name="Who_i">
            <CopilotText>
              <Button
                nav={props.navigation}
                text={T.t('who_i')}
                getItemsOnMe={true}
                loader={true}
                svg={'my'}
              />
            </CopilotText>
          </CopilotStep>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    alignSelf: 'center',
    backgroundColor: '#D3E3F2',
    paddingTop: Dimensions.get('window').height / 70,
    height: Dimensions.get('window').height,
  },
  background: {
    backgroundColor: '#D3E3F2',
  },
  loader: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: Dimensions.get('window').height / 9,
    zIndex: 99,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default withLayout(
  copilot({
    animated: true,
    backdropColor: 'rgba(72, 124, 168, 0.68)',
    overlay: 'svg',
    labels: {
      previous: <View>{menuSvg('left')}</View>,
      next: <View>{menuSvg('right')}</View>,
      skip: <View>{menuSvg('close')}</View>,
      finish: <View>{menuSvg('close')}</View>,
    },
  })(Main),
);
