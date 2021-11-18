import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StyleSheet, View, Dimensions, SafeAreaView, Text, Linking} from 'react-native';
import T from '../../../../i18n';
// components
import Appbar from '../../../../components/Appbar';
import Scanner from '../../../../components/Scanner';
import {useSelector} from "react-redux";
import TransparentButton from "../../../../components/Buttons/TransparentButton";

const AcceptScaner = props => {
  const [scaner, setScaner] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setScaner(true);
      return () => setScaner(false);
    }, []),
  );
  const  isAvailableCamera = useSelector(({auth}) => auth.isAvailableCamera);

  return (
    <>
        <View style={{backgroundColor: 'rgb(0,0,0)', flex:1}}>
          <Appbar
            navigation={props.navigation}
            newScan={true}
            arrow={true}
            goTo={'AcceptList'}
            title={T.t('title_scan')}
            switch={true}
            typeSwitchNFC={true}
          />
          <SafeAreaView />
          <View>
              <Text style={styles.textStyle}>{T.t('title_scan')}</Text>
          </View>
            {!isAvailableCamera &&
            <View style={{ flex:1, justifyContent: 'center'}}>
                <Text style={{textAlign: 'center', marginHorizontal:30, color:'rgb(255,255,255)'}}>{T.t('message_for_camera_permission')}</Text>
                <View style={{width: Dimensions.get('window').height / 5,alignSelf:'center'}}>
                    <TransparentButton
                        text={T.t('open_settings')}
                        onPress={Linking.openSettings}
                    />
                </View>
            </View>
            }
          <View style={styles.body}>
            {scaner && (
              <Scanner
                nav={props.navigation}
                page={'AcceptList'}
                saveItems={false}
              />
            )}
          </View>
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#fff',
  },
  input: {
    marginBottom: 10,
    marginTop: 10,
    width: Dimensions.get('window').width / 1.3,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'right',
    width: Dimensions.get('window').width / 1.3,
  },
  button: {
    marginTop: 30,
  },
  snackbar: {},
    textStyle:{
        color:'rgb(255,255,255)',
        fontSize: 30,
        position:'absolute',
        width: Dimensions.get('window').width,
        textAlign:'center',
    },
});

export default AcceptScaner;
