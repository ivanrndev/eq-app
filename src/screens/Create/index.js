import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import T from '../../i18n';
import Appbar from '../../components/Appbar';
import DarkButton from '../../components/Buttons/DarkButton';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const CreateItem = () => {
  const navigation = useNavigation();
  const [instanceAmount, setInstanceAmount] = useState(1);
  return (
    <>
      <Appbar
        navigation={navigation}
        arrow={true}
        goTo={'Home'}
        title={T.t('create_item')}
        pageToChosenItem="IdentInfo"
      />
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.itemText}>{T.t('base_item_info')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.itemText}>{T.t('type_and_value')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.itemText}>{T.t('photos')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.itemText}>{T.t('item_location')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.itemText}>{T.t('responsible')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.itemText}>{T.t('additional_info')}</Text>
        </TouchableOpacity>
        <View style={styles.amount}>
          <Text style={styles.itemText}>{T.t('amount_of_instances')}</Text>
          <TextInput
            value={instanceAmount}
            style={styles.qtyInput}
            keyboardType="numeric"
            mode="outlined"
            onChangeText={text => setInstanceAmount(text)}
          />
        </View>
        <View style={styles.btn}>
          <DarkButton
            onPress={() => navigation.navigate('CreateItem')}
            text={`${T.t('create')}`}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -10,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: height,
    width: width,
  },
  menuItem: {
    height: height / 11,
    borderBottomWidth: 2,
    borderBottomColor: '#7A7A9D',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    padding: 10,
  },
  itemText: {
    color: '#22215B',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  btn: {
    width: width / 1.1,
  },
  amount: {
    margin: 25,
    alignItems: 'flex-start',
    width: width / 1.1,
  },
  qtyInput: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: width / 1.1,
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default CreateItem;
