import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import T from '../../../i18n';
import Appbar from '../../../components/Appbar';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import TransparentButton from '../../../components/Buttons/TransparentButton';
import DarkButton from '../../../components/Buttons/DarkButton';
import {Modal} from 'react-native-paper';
import {
  checkInventoryList,
  clearInventory,
  deleteInventory,
  getSavedInventory,
} from '../../../actions/actions';
import AsyncStorage from '@react-native-community/async-storage';

export const InventoryQuestion = item => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [activeModal, setActiveModal] = useState(false);
  const inventoryId = useSelector(state => state.inventory.inventoryId);

  const startNewInventory = () => {
    !inventoryId && navigation.navigate('InventoryChooseMode');
    setActiveModal(true);
  };

  const startSavedInventory = () => {
    dispatch(getSavedInventory(inventoryId));
    navigation.navigate('InventoryChooseMode');
  };

  const newInventory = () => {
    dispatch(deleteInventory(inventoryId));
    dispatch(clearInventory());
    navigation.navigate('InventoryChooseMode');
    setActiveModal(false);
  };

  const cancelDeleteInventory = () => {
    setActiveModal(false);
  };
  useEffect(() => {
    setActiveModal(false);
    AsyncStorage.getItem('userId').then(id =>
      dispatch(checkInventoryList(item.route.params.id, id)),
    );
  }, [item]);

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
            goTo={'Inventory'}
            isMutiple={true}
            title={T.t('select_user')}
            isSearchForGiveItem={false}
          />
          <View style={styles.buttonsContainer}>
            <DarkButton
              onPress={startNewInventory}
              // disabled={renderedList.length === 0}
              text={'Начать новую'}
            />
            {!!inventoryId && (
              <>
                <TransparentButton onPress={startSavedInventory} text={'Продолжить предыдущую'} />
                <Modal visible={activeModal} animationType="slide">
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 10,
                      marginHorizontal: 90,
                      width: 250,
                      height: 150,
                      // flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{marginTop: 10}}>
                      У вас есть незавершенная инвентаризация, удалить ее и начать новую?
                    </Text>
                    {/*<View*/}
                    {/*  style={{*/}
                    {/*    flex: 2,*/}
                    {/*    flexDirection: 'row',*/}
                    {/*    alignItems: 'flex-end',*/}
                    {/*    justifyContent: 'space-between',*/}
                    {/*  }}>*/}
                    {/*  <TouchableOpacity onPress={cancelDeleteInventory}>*/}
                    {/*    <Text*/}
                    {/*      style={{*/}
                    {/*        borderWidth: 1,*/}
                    {/*        borderColor: 'blue',*/}
                    {/*        color: 'blue',*/}
                    {/*        margin: 10,*/}
                    {/*        fontSize: 16,*/}
                    {/*      }}>*/}
                    {/*      Отмена*/}
                    {/*    </Text>*/}
                    {/*  </TouchableOpacity>*/}
                    {/*  <TouchableOpacity onPress={newInventory}>*/}
                    {/*    <Text*/}
                    {/*      style={{*/}
                    {/*        color: 'white',*/}
                    {/*        backgroundColor: 'blue',*/}
                    {/*        margin: 10,*/}
                    {/*        fontSize: 16,*/}
                    {/*      }}>*/}
                    {/*      Да*/}
                    {/*    </Text>*/}
                    {/*  </TouchableOpacity>*/}
                    {/*</View>*/}
                    <View
                      style={{
                        // width: Dimensions.get('window').width / 3,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                      }}>
                      <TouchableOpacity
                        onPress={cancelDeleteInventory}
                        style={{
                          // padding: 17,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: '#2D2C71',
                          width: Dimensions.get('window').width / 5,
                          margin: 5,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            padding: 5,
                            borderRadius: 40,
                          }}>
                          Отмена
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={newInventory}
                        style={{
                          // padding: 10,
                          borderRadius: 10,
                          backgroundColor: '#2D2C71',
                          width: Dimensions.get('window').width / 5,
                          margin: 5,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            padding: 5,
                            borderRadius: 40,
                            color: '#ffffff',
                          }}>
                          Да
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </>
            )}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
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
