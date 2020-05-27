import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {SafeAreaView, Dimensions, StyleSheet, View, Picker} from 'react-native';
import Appbar from '../../components/Appbar';
import T from '../../i18n';
import I18n from '../../i18n';
import {Paragraph} from 'react-native-paper';
import {lang} from '../../actions/actions.js';
import {useDispatch} from 'react-redux';

const Settings = props => {
  const [selectedValue, setSelectedValue] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem('language').then(language => {
      setSelectedValue(language);
      I18n.locale = language;
    });
  }, [selectedValue]);

  return (
    <>
      <View style={styles.background}>
        <Appbar
          navigation={props.navigation}
          menu={true}
          newScan={false}
          goTo={'Home'}
          title={T.t('settings')}
        />
        <View style={styles.body}>
          <SafeAreaView />
          <Paragraph style={styles.title}>{T.t('select_lang')}:</Paragraph>
          <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              AsyncStorage.setItem('language', itemValue);
              dispatch(lang(itemValue));
              setSelectedValue(itemValue);
              I18n.locale = itemValue;
            }}>
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Russian" value="ru" />
          </Picker>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    alignSelf: 'center',
    backgroundColor: '#D3E3F2',
    paddingTop: Dimensions.get('window').height / 70,
    height: Dimensions.get('window').height,
  },
  background: {
    backgroundColor: '#D3E3F2',
  },
  title: {
    fontSize: 15,
    textAlign: 'left',
    paddingBottom: 0,
    width: Dimensions.get('window').width / 1.2,
  },
  picker: {
    marginTop: -45,
  },
});

export default Settings;
