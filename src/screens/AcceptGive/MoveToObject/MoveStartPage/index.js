import React, {useEffect, useState} from 'react';
import {
  Dimensions, FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import T from '../../../../i18n';
import {Button, Card, Menu, Snackbar} from 'react-native-paper';
import Appbar from '../../../../components/Appbar';
import DarkButton from '../../../../components/Buttons/DarkButton';
import ItemListCard from '../../../../components/ItemListCard';
import {
  getInventoryMesageError,
} from '../../../../utils/helpers';
import {
  changeLocation, changeLocationWithoutUser,
  deleteMoveItem,
  openMoveScan, setChoosedUser,
  setScanedMoveItem
} from "../../../../actions/moveToObjectsActions";
import Icon from 'react-native-vector-icons/FontAwesome';
import Arrow from "../../../../assets/svg/arrow-down.svg";
import {width} from "../../../../constants/dimentionsAndUnits";
import {cleanScan, getUserList} from "../../../../actions/actions";


const MoveStartPage = (props) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const location = useSelector(({moveToObject}) => moveToObject.location);
  const choosedUser = useSelector(({moveToObject}) => moveToObject.choosedUser);
  const role = useSelector(({auth}) => auth.role);
  const [visible, setVisible] = useState(false);
  const users = useSelector(({give}) => give.userList );

  const [settings, inventory, scan] = useSelector(
    ({settings, inventory, scan}) => [settings, inventory, scan],
  );
  const renderedList = useSelector(({moveToObject}) => moveToObject.scanedItem);

  const createNewLocation = ( ) => {
    if(renderedList.length > 0){
      renderedList.map(item => {
        const locationObject = {
          item_ids: [
            {
              id: item._id,
              quantity: 1
            }
          ],
          user: choosedUser.id,
        }
        const locationObjectWithoutUser = {
          item_ids: [
            {
              id: item._id,
              quantity: 1
            }
          ],
          object: location.objects,
          location: location.location
        }

        if(!choosedUser.id){
          dispatch(changeLocationWithoutUser(locationObjectWithoutUser, item.company._id, navigation));
        }else{
          dispatch(changeLocation(locationObject, item.company._id, navigation));
          dispatch(changeLocationWithoutUser(locationObjectWithoutUser, item.company._id, navigation));
        }
      })
    }
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
      dispatch( cleanScan());
    }
  }, [scan.scanInfo]);
  useEffect(()=>{dispatch(getUserList(navigation, '', 'MoveStartPage'))},[])


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
      <ScrollView contentContainerStyle={styles.cards}>
        {renderedList.length > 0 &&
          renderedList.map(item => (
              <View style={{flexDirection: 'row'}} >
                <Card  style={styles.card} key={item._id}>
                  <ItemListCard item={item} isPriceShown={false} />
                </Card>
                <Icon onPress = {()=> dispatch(deleteMoveItem(item._id))} name="trash" size={30} color="rgb(0, 0, 0)" style={styles.iconStyle}/>
              </View>
          ))}
      </ScrollView>
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
          onPress={() => dispatch(openMoveScan(props.navigation, settings.moveScanPage))}
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
  itemWrap: {
    width: width / 1.3,
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: -10,
  },
  iconStyle:{
    alignSelf:'center',
    margin:10,
  },
  cards: {
    marginTop: -10,
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowWrap: {
    marginBottom: -1.5,
  },
  card: {
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.2,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
    color: '#22215B',
    borderRadius: 10,
    paddingBottom: 10,
  },
  btns: {
    width: Dimensions.get('window').width / 1.1,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default MoveStartPage;
