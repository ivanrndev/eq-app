import React, {useEffect, useState} from 'react';
import {
  Dimensions, FlatList,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import T from '../../../../i18n';
import {Button, Card, Menu, Snackbar} from 'react-native-paper';
import Appbar from '../../../../components/Appbar';
import DarkButton from '../../../../components/Buttons/DarkButton';
import ItemListCard from '../../../../components/ItemListCard';
import {
  actionCheckError,
  getInventoryMesageError,
} from '../../../../utils/helpers';
import {
  changeLocation, changeLocationWithoutUser, changeQuantity,
  deleteMoveItem,
  openMoveScan, setChoosedUser, setIsAddMove,
  setScanedMoveItem
} from "../../../../actions/moveToObjectsActions";
import Icon from 'react-native-vector-icons/FontAwesome';
import Arrow from "../../../../assets/svg/arrow-down.svg";
import {width} from "../../../../constants/dimentionsAndUnits";
import {cleanScan, getSearchItem, getUserList, loader, updateTransfer} from "../../../../actions/actions";


const MoveStartPage = (props) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const location = useSelector(({moveToObject}) => moveToObject.location);
  const choosedUser = useSelector(({moveToObject}) => moveToObject.choosedUser);
  const role = useSelector(({auth}) => auth.role);
  const [visible, setVisible] = useState(false);
  const [number, setNumber] = useState(1);


  const userQuantity = useSelector(({moveToObject}) => moveToObject.scanedItemToMove);

  const [settings, inventory, scan, renderedList, scanedItemToMove, users] = useSelector(
    ({settings, inventory, scan, moveToObject, give}) => [
      settings,
      inventory,
      scan,
      moveToObject.scanedItem,
      moveToObject.scanedItemToMove,
      give.userList
    ],
  );


  const createNewLocation = ( ) => {
    if(renderedList.length > 0){
      scanedItemToMove.map(item => {
        const locationObject = {
          item_ids: [
            {
              id: item.id,
              quantity: item.quantity ? item.quantity : 1
            }
          ],
          user: choosedUser.id,

          object: {
            object: location.objects,
            location: location.location
          }
        }
        const changeUserObject = {
          item_ids: [
            {
              id: item.id,
              quantity: item.quantity ? item.quantity : 1
            }
          ],
          user: choosedUser.id,

        }
        const locationObjectWithoutUser = {
          item_ids: [
            {
              id: item.id,
              quantity: item.quantity ? item.quantity : 1
            }
          ],
          object: location.objects,
          location: location.location
        }

        if(!choosedUser.id){
          dispatch(changeLocationWithoutUser(locationObjectWithoutUser, item.companyId, navigation));
        }else{
          dispatch(changeLocation(location.objects ? locationObject : changeUserObject, item.companyId, navigation));
          // dispatch(changeLocationWithoutUser(locationObjectWithoutUser, item.companyId, navigation));
        }
      })
    }
    setNumber(1);
  };
  const renderItem = ({item}) => (
      <Menu.Item
          onPress={() => {
            dispatch(setChoosedUser({id:item._id, firstName: item.firstName})),
                setVisible(false)
          }}
          title={item.firstName}
      />
  );

  const [error, setError] = useState('');
  const isAlreadyScaned = id =>
    inventory.inventoryScanList.find(item => item._id === id);

  useEffect(() => {
    if (scan.scanInfoError !== 'InRepair' && scan.scanInfoError !== 'IsBan') {
      setError(getInventoryMesageError(scan.scanInfoError, scan.currentScan));
    }
    if (scan.scanInfoError === 'InRepair') {
      setError(
        `${T.t('item')}  "${scan.selectGiveId}" ${T.t('error_services')}`,
      );
    }
    let isDuplicate = isAlreadyScaned(scan.selectGiveId);
    if (isDuplicate) {
      setError(getInventoryMesageError('Duplicate', scan.currentScan));
    }
    if (
      !isAlreadyScaned(scan.selectGiveId) &&
      scan.scanInfoError !== 'NotFound' &&
      Object.keys(scan.scanInfo).length > 0
    ) {
      dispatch( setScanedMoveItem(scan.scanInfo, scan.scanInfo._id));
      dispatch(changeQuantity({id: scan.scanInfo._id, companyId: scan.scanInfo.company._id}));
      // dispatch( cleanScan());
    }
  }, [scan.scanInfo]);
  useEffect(()=>{dispatch(getUserList(navigation, '', 'MoveStartPage'))},[])

  const handleCurrentQuantity = item => {
    navigation.navigate('ItemDetail', item)
  };

  return (
    <View style={styles.body}>
      <Appbar
        navigation={navigation}
        arrow={true}
        newScan={true}
        clearMarking={true}
        clearInventory={true}
        goTo={'AcceptGive'}
        isMutiple={true}
        title={T.t('move_to_object')}
        isSearchForGiveItem={false}
      />
      <View style={{
        flex: 1,
        alignItems: 'center'
      }}>
        <ScrollView    style={{ marginTop: 15, borderRadius: 15 }}>
          {renderedList.length > 0 &&
            renderedList.map(item => {
              const tmcFilter = userQuantity?.filter(cart => cart.id === item._id)[0];
              return (
                <TouchableOpacity  style={styles.card} key={item._id}>
                  <ItemListCard item={item} isPriceShown={false} isBacket={true}/>
                  <View style={{ height: 1, backgroundColor: '#D3E3F2', width: '90%', marginLeft: '5%', marginTop: 10}} />
                  {item?.batch?.quantity > 1 ?
                    <View style={styles.buttonsContainer}>
                      <Text style={{marginHorizontal: 15, marginTop: 5}}>
                        Выдать
                      </Text>
                      <Button onPress={() => handleCurrentQuantity(item)}
                              style={{
                                backgroundColor: tmcFilter?.quantity ? '#EDF6FF' : '#22215B',
                                marginLeft: tmcFilter?.quantity ? 50 : 90,
                                width: tmcFilter?.quantity ? 160 : 110,
                                borderRadius: 10}}>
                        {tmcFilter?.quantity ? (<Text style={{fontSize: 12, color: '#22215B'}}>{tmcFilter?.quantity} изменить</Text>) :
                            <Text style={{color: '#f3f3f5'}}>
                              Задать
                            </Text>}
                      </Button>
                    </View> : null}
                </TouchableOpacity>
            )})}
        </ScrollView>
      </View>
      <View style={styles.btns}>
        { role === 'root' ||
        role === 'stockman' ||
        role === 'admin' ?
            <View style={styles.itemWrap}>
              <Menu
                  visible={visible}
                  onDismiss={() => setVisible(false)}
                  anchor={
                    <Button onPress={() => setVisible(true)}>
                      {choosedUser.firstName ? choosedUser.firstName : T.t('choose_responsible')}
                      <View style={styles.arrowWrap}>
                        <Arrow width={15} height={15} />
                      </View>
                    </Button>
                  }>
                <FlatList
                    data={users}
                    keyExtractor={item => item}
                    renderItem={renderItem}
                />
              </Menu>
            </View> : null
        }
        <DarkButton
          onPress={() => navigation.navigate('CreateMoveLocation')}
          disabled={renderedList.length === 0}
          text={T.t('choose_object')}
        />
        <DarkButton
            onPress={() => {
              dispatch(openMoveScan(props.navigation, settings.moveScanPage));
              dispatch(setIsAddMove(true));
            }}
            text={T.t('add')}
        />
        <DarkButton
            onPress={() => createNewLocation()}
            disabled={!choosedUser.id && !location.objects}
            text={T.t('move')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  inputsStyle: {
    width: Dimensions.get('window').width / 2.5,
    marginTop: 5,
    marginRight: 5,
    borderWidth: 1,
    borderRadius: 10,
    height: Dimensions.get('window').height / 13,
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    width: Dimensions.get('window').width / 2.6,
    flexDirection: 'row',
  },
  itemWrap: {
    width: width / 1.3,
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: -10,
  },

  cards: {
    marginTop: -10,
    paddingTop: 25,
    // alignItems: 'center',
    // justifyContent: 'center',

  },
  arrowWrap: {
    marginBottom: -1.5,
  },
  card: {
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    borderRadius: 15,
    backgroundColor: '#EDF6FF',
    color: '#22215B',
  },
  btns: {
    width: Dimensions.get('window').width / 1.1,
    alignSelf: 'center',
    marginTop:10,
  },
});

export default MoveStartPage;
