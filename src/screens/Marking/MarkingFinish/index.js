import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import {Title, Button} from 'react-native-paper';
// components
import Appbar from '../../../components/Appbar';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  makeMarking,
  allowNewScan,
  makeMarkingErrorDefault,
} from '../../../actions/actions.js';
import {getProperErrorMessage} from '../../../utils/helpers.js';

const MarkingFinish = props => {
  const dispatch = useDispatch();
  const marking = useSelector(state => state.marking);
  const currentScan = useSelector(state => state.scan.currentScan);
  const [error, setError] = useState(processerErrorMessasge);

  const processerErrorMessasge = getProperErrorMessage(
    marking.markingErrorDone,
    currentScan,
  );

  useEffect(() => {
    dispatch(makeMarking(marking.currentItemMark, currentScan));
  }, [currentScan, dispatch, marking.currentItemMark]);

  useEffect(() => {
    if (error !== marking.markingErrorDone) {
      setError(processerErrorMessasge);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScan, marking.markingErrorDone]);

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        goTo={'Marking'}
        title={'Подтверждение'}
      />
      <SafeAreaView />
      <View style={styles.container}>
        <View style={styles.info}>
          {!!error && <Title style={styles.title}>{error}</Title>}

          {marking.markingSuccess && (
            <Title style={styles.title}>
              Вы успешно добавили {currentScan}
            </Title>
          )}
        </View>
        <View style={styles.buttons}>
          {marking.markingSuccess && (
            <Button
              style={styles.button}
              contentStyle={styles.buttonStyle}
              mode="contained"
              color="#3a6fdb"
              onPress={() => {
                props.navigation.navigate('Marking');
                dispatch(allowNewScan(true));
                dispatch(makeMarkingErrorDefault());
              }}>
              К списку
            </Button>
          )}
          {!!error && (
            <Button
              style={styles.button}
              contentStyle={styles.buttonStyle}
              mode="contained"
              color="#3a6fdb"
              onPress={() => {
                props.navigation.navigate('Marking');
                dispatch(allowNewScan(true));
              }}>
              Отмена
            </Button>
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
  buttons: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: Dimensions.get('window').height / 1.5,
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
  },
});

export default MarkingFinish;
