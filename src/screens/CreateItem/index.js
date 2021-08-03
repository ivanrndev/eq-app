import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import T from '../../i18n';
import Appbar from '../../components/Appbar';
import DarkButton from '../../components/Buttons/DarkButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {useSelector} from 'react-redux';
import ItemListCard from '../../components/ItemListCard';
import {height, width} from '../../constants/dimentionsAndUnits';

const CreateItem = () => {
  const navigation = useNavigation();
  const [instanceAmount, setInstanceAmount] = useState(1);
  const baseInfo = useSelector(({createItem}) => createItem.baseInfo);
  const baseInfoMetadata = {metadata: baseInfo};
  return (
    <>
      <Appbar
        navigation={navigation}
        arrow={true}
        goTo={'Home'}
        title={T.t('create_item')}
        pageToChosenItem="IdentInfo"
      />

      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CreateItemBaseInfo')}>
          <Text style={styles.itemText}>
            {T.t('base_item_info')}
            <Text style={styles.required}> * </Text>
          </Text>
          {baseInfo && baseInfo.type ? (
            <ItemListCard item={baseInfoMetadata} width="100%" />
          ) : (
            <Text> {T.t('is_not_specified')}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CreateItemQty')}>
          <Text style={styles.itemText}>
            {T.t('type_and_value')}
            <Text style={styles.required}> * </Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CreateItemsPhotos')}>
          <Text style={styles.itemText}>{T.t('photos')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CreateItemLocation')}>
          <Text style={styles.itemText}>{T.t('item_location')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CreateItemResponsible')}>
          <Text style={styles.itemText}>{T.t('responsible')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CreateItemAdditionalInfo')}>
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
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -10,
    backgroundColor: '#D3E3F2',
    height: height,
    width: width,
    flex: 1,
  },
  menuItem: {
    minHeight: height / 11,
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
  required: {
    color: '#E40B67',
  },
});

export default CreateItem;
