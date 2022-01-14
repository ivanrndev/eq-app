import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import T from '../../i18n';
import Appbar from '../Appbar';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {changeQuantity} from '../../actions/moveToObjectsActions';

export const ItemDetail = item => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [number, setNumber] = useState(0);
  const [check, setCheck] = useState(false);
  const quantity = item.route.params.batch.quantity;
  const userQuantity = useSelector(({moveToObject}) => moveToObject.scanedItemToMove);
  const currentQuantity = userQuantity.filter(ite => ite.id === item.route.params._id);

  const saveButton = () => {
    if (number > quantity) {
      setCheck(true);
    } else {
      setCheck(false);
      dispatch(
        changeQuantity({
          id: item.route.params._id,
          number,
          companyId: item.route.params.company._id,
          userId: item.route.params?.person?._id,
          object: item.route.params.metadata?.object,
          location: item.route.params.metadata?.location,
        }),
      );
      navigation.navigate('MoveStartPage');
      setNumber(0);
    }
  };

  const cancelButton = () => {
    navigation.navigate('MoveStartPage');
    setNumber(0);
  };

  return (
    <KeyboardAvoidingView style={styles.body}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.body}>
          <Appbar
            navigation={item.navigation}
            arrow={true}
            newScan={true}
            clearMarking={true}
            clearInventory={true}
            goTo={'MoveStartPage'}
            isMutiple={true}
            title={T.t('move_to_object')}
            isSearchForGiveItem={false}
          />
          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}>
            <View style={styles.card}>
              {item.route.params.metadata.title && (
                <View style={{flexDirection: 'row', borderBottomWidth: 1, margin: 5}}>
                  <Text style={styles.titleText}>Название:</Text>
                  <Text style={styles.marginText}>{item.route.params.metadata.title}</Text>
                </View>
              )}
              {item.route.params.batch.quantity && (
                <View style={{flexDirection: 'row', margin: 5}}>
                  <Text style={styles.titleText}>{T.t('detail_quantity')}:</Text>
                  <Text style={styles.marginText}>
                    {item.route.params.batch.quantity} {item.route.params.batch.units}
                  </Text>
                </View>
              )}
              <View style={{width: 250, margin: 5}}>
                <Text>Задайте количество ТМЦ которые хотите переместить</Text>
              </View>
              <TextInput
                style={{
                  borderWidth: 1,
                  width: Dimensions.get('window').width / 1.17,
                  height: 35,
                  marginLeft: 5,
                  padding: 5,
                }}
                keyboardType="numeric"
                placeholder={T.t('set_quantity')}
                onChangeText={num => setNumber(num)}
                defaultValue={currentQuantity[0]?.quantity}
              />
              {check && (
                <Text
                  style={{color: 'red', width: Dimensions.get('window').width / 1.05, margin: 5}}>
                  Указанное значение превышает доступный остатоток, операция не может быть совершена
                </Text>
              )}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  onPress={() => saveButton()}
                  style={{
                    padding: 15,
                    borderRadius: 10,
                    backgroundColor: '#2D2C71',
                    width: Dimensions.get('window').width / 2.5,
                    margin: 5,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      padding: 15,
                      borderRadius: 40,
                      color: '#ffffff',
                    }}>
                    {T.t('save')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => cancelButton()}
                  style={{
                    padding: 15,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#2D2C71',
                    width: Dimensions.get('window').width / 2.5,
                    margin: 5,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      padding: 15,
                      borderRadius: 40,
                    }}>
                    {T.t('cancel')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  body: {
    // flex:1,
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  buttonsContainer: {
    flex: 1,
    width: Dimensions.get('window').width / 1.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    margin: 10,
  },
  titleText: {
    width: 110,
  },
  card: {
    marginVertical: 10,
    flex: 1,
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    borderRadius: 15,
    backgroundColor: '#EDF6FF',
    color: '#22215B',
  },
});
