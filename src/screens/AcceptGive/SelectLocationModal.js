import React from 'react';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
import {Dimensions, StyleSheet, View} from 'react-native';
import T from '../../i18n';
import {Picker} from '@react-native-community/picker';
import {changeLocationLoc, changeLocationMain} from '../../actions/actions';
import {useDispatch, useSelector} from 'react-redux';

export const SelectLocationModal = ({showModal, setShowModal}) => {
  const dispatch = useDispatch();
  const [objects, selectedValue, selectedValueLoc] = useSelector(
    ({settings}) => [
      settings.locations ? settings.locations : [],
      settings.locationMain,
      settings.locationLoc,
    ],
  );

  const currentLocation = objects.filter(x => {
    if (x.title === selectedValue) {
      return x;
    }
  });
  const handleChangeLocation = itemValue => {
    dispatch(changeLocationMain(itemValue));
    dispatch(changeLocationLoc(''));
  };
  return (
    <Portal>
      <Dialog visible={showModal} onDismiss={() => setShowModal(false)}>
        <Dialog.Content>
          <View style={styles.container}>
            <Text style={styles.left}>{T.t('object')}:</Text>
            <Picker
              selectedValue={selectedValue}
              style={styles.picker}
              onValueChange={itemValue => handleChangeLocation(itemValue)}>
              <Picker.Item label={T.t('choise')} value="" />
              {objects.map((item, index) => {
                return (
                  <Picker.Item
                    key={index}
                    label={item.title}
                    value={item.title}
                  />
                );
              })}
            </Picker>
            {!!selectedValue && (
              <>
                <Text style={styles.leftTwo}>{T.t('location')}:</Text>
                <Picker
                  selectedValue={selectedValueLoc}
                  style={styles.pickerTwo}
                  onValueChange={itemValue => {
                    dispatch(changeLocationLoc(itemValue));
                  }}>
                  <Picker.Item label={T.t('choise')} value="" />
                  {currentLocation
                    ? currentLocation[0].locations.map((item, index) => {
                        return (
                          <Picker.Item key={index} label={item} value={item} />
                        );
                      })
                    : null}
                </Picker>
              </>
            )}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowModal(false)}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  left: {
    fontSize: 14,
    paddingLeft: 15,
    textAlign: 'left',
    marginBottom: -70,
  },
  leftTwo: {
    fontSize: 14,
    textAlign: 'left',
    marginBottom: -95,
    marginLeft: 20,
  },

  picker: {
    // marginTop: -45,
  },
  pickerTwo: {
    marginTop: 50,
    marginBottom: -40,
  },
  container: {
    paddingTop: 25,
    width: Dimensions.get('window').width / 1.4,
    height: 'auto',
  },
});
