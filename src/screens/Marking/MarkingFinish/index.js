import React from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView} from 'react-native';
import {Title, Button} from 'react-native-paper';
// components
import Appbar from '../../../components/Appbar';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {makeMarking, allowNewScan} from '../../../actions/actions.js';

const MarkingFinish = props => {
  const dispatch = useDispatch();
  const marking = useSelector(state => state.marking);
  const currentScan = useSelector(state => state.scan.currentScan);
  const _id = marking.currentItemMark;

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        goTo={'Marking'}
        title={'Подтверждение'}
      />
      <SafeAreaView />
      <View style={styles.container}>
        <Title style={styles.title}>Вы успешно добавили ID</Title>
        <View style={styles.buttons}>
          <Button
            style={styles.button}
            mode="contained"
            color="#3a6fdb"
            onPress={() =>
              dispatch(makeMarking(_id, currentScan, props.navigation))
            }>
            Подтвердить
          </Button>
          <Button
            style={styles.button}
            mode="contained"
            color="#3a6fdb"
            onPress={() => {
              props.navigation.navigate('Marking');
              dispatch(allowNewScan(true));
            }}>
            Отмена
          </Button>
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
    height: Dimensions.get('window').height / 15,
    alignSelf: 'center',
    marginTop: 10,
    width: Dimensions.get('window').width / 1.5,
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
});

export default MarkingFinish;
