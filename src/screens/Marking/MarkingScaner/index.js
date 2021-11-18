import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StyleSheet, View, Dimensions, SafeAreaView, Text, Linking} from 'react-native';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import Scanner from '../../../components/Scanner';
import TransparentButton from "../../../components/Buttons/TransparentButton";
import {useSelector} from "react-redux";

const MarkingScaner = props => {
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
          arrow={true}
          newScan={true}
          goTo={'MarkingList'}
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
              page={'MarkingFinish'}
              text={T.t('title_input_detail_new')}
            />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingTop: 20,
    alignItems: 'center',
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    height: Dimensions.get('window').height / 8,
    marginBottom: 15,
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
    fontSize: 13,
    color: '#fff',
    textAlign: 'right',
    width: Dimensions.get('window').width / 1.3,
  },
  textStyle:{
    color:'rgb(255,255,255)',
    fontSize: 30,
    position:'absolute',
    width: Dimensions.get('window').width,
    textAlign:'center',
  },
});

export default MarkingScaner;
