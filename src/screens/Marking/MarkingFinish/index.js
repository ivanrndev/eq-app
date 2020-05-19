/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import {Title} from 'react-native-paper';
// components
import Appbar from '../../../components/Appbar';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {
  makeMarking,
  allowNewScan,
  clearMarking,
} from '../../../actions/actions.js';
import {getProperErrorMessage} from '../../../utils/helpers.js';
import DarkButton from '../../../components/Buttons/DarkButton';

const MarkingFinish = props => {
  const dispatch = useDispatch();
  const marking = useSelector(state => state.marking);
  const currentScan = useSelector(state => state.scan.currentScan);
  const scanInfo = useSelector(state => state.scan.currentScan);
  const [error, setError] = useState(processerErrorMessasge);
  const [title, setTitle] = useState('');
  const [oldId, setOldId] = useState('');
  const showMarking = marking.marking;

  const processerErrorMessasge = getProperErrorMessage(
    marking.markingErrorDone,
    currentScan,
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(makeMarking(marking.currentItemMark, currentScan));
      return () => {};
    }, [currentScan]),
  );

  useEffect(() => {
    let info = marking.markingList.filter(
      item => item._id === marking.currentItemMark,
    );
    if (info[0]) {
      setTitle(info[0].metadata.title);
      setOldId(info[0].code);
    }
  }, [scanInfo]);

  useEffect(() => {
    if (error !== marking.markingErrorDone) {
      setError(processerErrorMessasge);
    }
  }, [currentScan, marking.markingErrorDone]);

  const cancelButton = () => {
    props.navigation.navigate('Marking');
    dispatch(allowNewScan(true));
    dispatch(clearMarking());
  };

  const toListButton = () => {
    props.navigation.navigate('Marking');
    dispatch(allowNewScan(true));
    dispatch(clearMarking());
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        clearMarking={true}
        goTo={'Marking'}
        title={marking.marking ? 'Перемаркировка' : 'Маркировка'}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <View style={styles.container}>
          <View style={styles.info}>
            {!!error && <Title style={styles.titleError}>{error}</Title>}
            {marking.markingSuccess && (
              <Title style={styles.title}>
                {showMarking
                  ? `Вы успешно перемаркировали "${title}" ${oldId} на ${currentScan}.`
                  : `Вы успешно добавили ${currentScan}`}
              </Title>
            )}
          </View>
          <View style={styles.buttons}>
            {marking.markingSuccess && (
              <View style={styles.buttonBlock}>
                <DarkButton text={'К списку'} onPress={toListButton} />
              </View>
            )}
            {!!error && (
              <View style={styles.buttonBlock}>
                <DarkButton text={'Отмена'} onPress={cancelButton} />
              </View>
            )}
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
    width: Dimensions.get('window').height / 3.3,
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 10,
    height: Dimensions.get('window').height / 2.1,
    paddingBottom: 10,
    paddingTop: 20,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#EDF6FF',
  },
  buttons: {
    position: 'absolute',
    display: 'flex',
    alignSelf: 'center',
    bottom: 20,
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
    fontSize: 13,
    color: '#fff',
    textAlign: 'right',
    width: Dimensions.get('window').width / 1.3,
  },
  title: {
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    color: '#22215B',
    fontSize: 21,
  },
  titleError: {
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    color: '#E40B67',
    fontSize: 21,
  },
});

export default MarkingFinish;
