import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View, FlatList} from 'react-native';
import {CreateItemContainer} from '../CreateItemContainer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Button, Card, IconButton, TextInput} from 'react-native-paper';
import {width} from '../../../constants/dimentionsAndUnits';
import T from '../../../i18n';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  saveAdditionalInfo,
  saveBaseItemInfo,
} from '../../../actions/createItem';

const AdditionalInfo = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [additionalInfo, setAdditionalInfo] = useState({
    label: '',
    value: '',
  });
  const [additionalInfoArr, setAdditionalInfoArr] = useState([]);

  const handleAddInfo = () => {
    if (additionalInfo.label.length > 0 && additionalInfo.value.length > 0) {
      setAdditionalInfoArr([...additionalInfoArr, additionalInfo]);
      setAdditionalInfo({label: '', value: ''});
    }
  };

  const handleDel = index => {
    let newArr = additionalInfoArr.filter(
      (info, infoIndex) => index !== infoIndex,
    );
    setAdditionalInfoArr(newArr);
  };
  const handleSave = () => {
    dispatch(saveAdditionalInfo(additionalInfoArr));
    navigation.navigate('CreateItem');
  };
  const renderItem = ({item, index}) => (
    <View style={styles.row}>
      <View style={styles.valuesWrap}>
        <Text style={styles.valueText}>{item.label}: </Text>
        <Text style={styles.valueText}>{item.value}</Text>
      </View>
      <IconButton
        icon="delete"
        size={30}
        color="#22215B"
        onPress={() => handleDel(index)}
        style={styles.btn}
      />
    </View>
  );

  return (
    <CreateItemContainer handleSave={handleSave}>
      <KeyboardAwareScrollView style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.row}>
            <TextInput
              value={additionalInfo.label}
              style={styles.input}
              label={`${T.t('name')}`}
              mode="outlined"
              onChangeText={text =>
                setAdditionalInfo({...additionalInfo, label: text})
              }
            />
            <TextInput
              value={additionalInfo.value}
              style={styles.input}
              label={`${T.t('value')}`}
              mode="outlined"
              onChangeText={text =>
                setAdditionalInfo({...additionalInfo, value: text})
              }
            />
            <IconButton
              icon="plus-circle-outline"
              size={30}
              color="#22215B"
              style={styles.btn}
              onPress={handleAddInfo}
              disabled={
                additionalInfo.label.length === 0 ||
                additionalInfo.value.length === 0
              }
            />
          </View>
          {additionalInfoArr.length ? (
            <FlatList
              data={additionalInfoArr}
              renderItem={renderItem}
              keyExtractor={item => item.label}
              ItemSeparatorComponent={() => (
                <View style={styles.itemSeparator} />
              )}
            />
          ) : null}
        </Card>
      </KeyboardAwareScrollView>
    </CreateItemContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    width: width / 1.1,
    marginVertical: 15,
    alignSelf: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 3,
    backgroundColor: '#fff',
  },
  valuesWrap: {
    flexDirection: 'row',
    marginTop: 20,
  },
  valueText: {
    color: '#22215B',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 16,
    marginRight: 10,
    maxWidth: Dimensions.get('window').width / 2.6,
  },
  btn: {
    marginRight: 0,
  },
  itemSeparator: {
    height: 2,
    backgroundColor: '#22215B',
    maxWidth: Dimensions.get('window').width / 1.1,
  },
});
export default AdditionalInfo;
