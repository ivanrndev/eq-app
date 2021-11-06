import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View, TextInput, FlatList, LayoutAnimation} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getLocations} from '../../../../actions/actions';

import T from '../../../../i18n';
import {width} from '../../../../constants/dimentionsAndUnits';
import {useNavigation} from '@react-navigation/native';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import {CreateLocationContainer} from "./CreateLocationContainer";
import {saveMoveLocation, setChoosedUser} from "../../../../actions/moveToObjectsActions";
import {Button, Menu} from "react-native-paper";
import Arrow from "../../../../assets/svg/arrow-down.svg";

const MoveLocation = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [objects, location] = useSelector(({settings, moveToObject}) => [
    settings.locations ? settings.locations : [],
    moveToObject.location,
  ]);

  const [selectedLoc, setSelectedLoc] = useState('');
  const [selectedObj, setSelectedObj] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editModeLocation, setEditModeLocation] = useState(false);

  useEffect(() => {
    dispatch(getLocations());
    return setSelectedObj('') && setSelectedLoc('');
  }, []);
  useEffect(() => {
    if (!location) {
      setSelectedLoc('');
      setSelectedLoc('');
      setSelectedObj('');
    }
  }, [location]);
  const handleChangeLocation = itemValue => {
    dispatch(
        saveMoveLocation({
          objects: selectedObj ,
          location: selectedLoc ,
        }),
    );
    navigation.navigate('MoveStartPage');
  };

  const renderItem = ({item}) => {

    return <>

      {((item.title.indexOf(selectedObj) !== -1) && (item.title.indexOf(selectedObj) < 3)) &&
      < Text
          onPress={() => setSelectedObj(item.title)}
          style={styles.dropdown}
      >
        {item.title}
      </Text>
      }
    </>
  };

  const animateObject = (boolean) => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);

    setEditMode(boolean);
  };
  const animateLocation = () => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setEditModeLocation(!editModeLocation);
  };

  const renderItemLocation = ({item}) => {

    return <>
      <View>
        {
          item.locations.length > 0 && item.locations.map((item) => {
            return <Text
                onPress={() => setSelectedLoc(item)}
                style={styles.dropdown}>
              {item}
            </Text>
          })
        }
      </View>
    </>
  };
  useEffect(() =>{
    if(!selectedObj){
      animateObject(false);
    }
    if(selectedObj!==''){
      animateObject(true);
    }
  } ,[selectedObj])

  return (
      <CreateLocationContainer handleSave={handleChangeLocation} setSelectedObj={setSelectedObj} setSelectedLoc={setSelectedLoc}>
        <View >
          <Text style={styles.left}>{T.t('object')}:</Text>
          <TextInput
              style={styles.inputDropdown}
              onChangeText={text => {
                setSelectedObj(text)
              }}
              value={selectedObj}
              // onFocus={()=>animateObject(true)}
              onBlur={()=>animateObject(false)}
              placeholder={T.t('choose_object')}

          />
          {editMode &&
          <FlatList
              data={objects}
              renderItem={renderItem}
              keyExtractor={item => item.id}
          />
          }
          <Text style={styles.left}>{T.t('location')}:</Text>
          <TextInput
              style={styles.inputDropdown}
              onChangeText={text => setSelectedLoc(text)}
              value={selectedLoc}
              onFocus={animateLocation}
              onBlur={animateLocation}
              placeholder={T.t('choose_object')}

          />
          {editModeLocation
              ? <FlatList
                  data={objects.filter(item => item.title === selectedObj )}
                  renderItem={renderItemLocation}
                  keyExtractor={item => item.id}
              />
              : null
          }
        </View>
      </CreateLocationContainer>
  );
};
export default MoveLocation;

const styles = StyleSheet.create({
  itemWrap: {
    width: width / 1.3,
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: -10,
  },
  arrowWrap: {
    marginBottom: -1.5,
  },
  left: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 5,
    width: width / 1.1,
  },

  inputWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    marginVertical: 30,
    minHeight: 200,
  },
  textInput: {
    padding: 12,
    borderColor: '#22215B',
    borderWidth: 1,
    borderRadius: 5,
  },
  inputDropdown: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#929394',
    height: 55,
    borderRadius: 5,
    padding: 15,
  },
  inputBtn: {
    right: 10,
    height: 55,
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  dropdown: {
    top: 0,
    padding:15,
    fontSize: 14,
    borderWidth:1,
    justifyContent:'center',
    borderRadius:3,
    borderColor: 'rgb(255, 255, 255)',
    width: Dimensions.get('window').width / 1.12,
    alignSelf: 'center',
    backgroundColor: '#C5CDD5',
    position: 'relative',
    zIndex: 2,
  },
});
