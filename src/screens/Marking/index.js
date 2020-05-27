import React from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import T from '../../i18n';
// components
import Appbar from '../../components/Appbar';
import DarkButton from '../../components/Buttons/DarkButton';
import TransparentButton from '../../components/Buttons/TransparentButton';
import {Portal, ActivityIndicator} from 'react-native-paper';

// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {getMarkingList, loader} from '../../actions/actions.js';

const Marking = props => {
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);

  const getMarking = () => {
    dispatch(loader(true));
    dispatch(getMarkingList(false, props.navigation));
  };

  const getReMarking = () => {
    dispatch(loader(true));
    dispatch(getMarkingList(true, props.navigation));
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        clearMarking={true}
        goTo={'Home'}
        title={T.t('mark')}
      />
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
      <View style={styles.body}>
        <View style={styles.buttons}>
          <View style={styles.buttonBlock}>
            <DarkButton text={T.t('title_to_mark')} onPress={getMarking} />
            <TransparentButton
              text={T.t('title_to_remark')}
              onPress={getReMarking}
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
  buttons: {
    top: Dimensions.get('window').height / 3,
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

export default Marking;
