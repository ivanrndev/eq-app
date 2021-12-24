import React, {useState} from 'react';
import {Dimensions, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import T from '../../i18n';
import Appbar from '../../components/Appbar';
import DarkButton from '../../components/Buttons/DarkButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {useDispatch, useSelector} from 'react-redux';
import {height, width} from '../../constants/dimentionsAndUnits';
import {cleanCreateItem, createItem, createItemAndUser} from '../../actions/createItem';
import {isEmpty} from 'lodash';
import {cleanScanInfo} from '../../actions/actions';

const CreateItem = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [instanceAmount, setInstanceAmount] = useState(1);
  const [baseInfo, accountType, location, photos, responsible, additionalInfo] = useSelector(
    ({createItem}) => [
      createItem.baseInfo,
      createItem.accountType,
      createItem.location,
      createItem.photos,
      createItem.responsible,
      createItem.additionalInfo,
    ],
  );

  const item = {
    ...(baseInfo.type && {type: baseInfo.type}),
    ...(baseInfo.brand && {brand: baseInfo.brand}),
    ...(baseInfo.model && {model: baseInfo.model}),
    ...(baseInfo.serial && {serial: baseInfo.serial}),
    ...(baseInfo.title && {title: baseInfo.title}),
    ...(responsible.id && {person: responsible.id}),
    ...(location.object && {location: location.object}),
    ...(location.location && {object: location.location}),
    ...(accountType.batch &&
      accountType.batch.quantity && {
        batch: {
          quantity: accountType.batch.quantity,
          units: accountType.batch.units,
        },
      }),
    customFields: additionalInfo,
    price: accountType.pricePerPiece,
    count: +instanceAmount,
  };
  const user = responsible.firstName &&
    responsible.email && {
      role: responsible.role.item,
      firstName: responsible.firstName,
      email: responsible.email,
    };

  let itemPhotos = new FormData();
  if (!isEmpty(photos)) {
    photos.forEach(file => {
      itemPhotos.append('file', {
        uri: `file:///${file.path}`,
        type: file.mime,
        name: file.filename ?? 'file.path',
      });
    });
  }

  const createNewItem = () => {
    if (baseInfo.type) {
      if (user) {
        dispatch(createItemAndUser(user, item, navigation, photos.length && itemPhotos));
      } else {
        dispatch(createItem(item, navigation, photos.length && itemPhotos));
        dispatch(cleanCreateItem());
      }
    }
  };
  const pricePerLot = accountType.batch && +accountType.batch.quantity * +accountType.pricePerPiece;

  const renderPhotoItem = ({item}) => {
    return (
      <View style={styles.smallImgWrap}>
        <Image
          style={styles.smallImg}
          source={{
            uri: item.url ?? item.path,
          }}
        />
      </View>
    );
  };
  const renderAdditionalInfoItem = ({item}) => (
    <View style={styles.valuesWrap}>
      <Text style={styles.valueText}>{item.label}: </Text>
      <Text style={styles.valueText}>{item.value}</Text>
    </View>
  );

  return (
    <>
      <Appbar
        navigation={navigation}
        arrow={true}
        goTo={'Home'}
        title={T.t('create_item')}
        pageToChosenItem="IdentInfo"
        createItem={true}
      />

      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CreateItemBaseInfo')}>
          <>
            <Text style={styles.itemText}>
              {T.t('base_item_info')}
              <Text style={styles.required}> * </Text>
            </Text>
            {baseInfo && baseInfo.type ? (
              <View style={styles.itemContent}>
                <Text style={styles.itemContentText}>
                  {T.t('detail_type')}: {baseInfo.type}
                </Text>
                {baseInfo.title ? (
                  <Text style={styles.itemContentText}>
                    {T.t('detail_title')}: {baseInfo.title}
                  </Text>
                ) : null}
                {baseInfo.brand ? (
                  <Text style={styles.itemContentText}>
                    {T.t('detail_brand')}: {baseInfo.brand}
                  </Text>
                ) : null}
                {baseInfo.model ? (
                  <Text style={styles.itemContentText}>
                    {T.t('detail_model')}: {baseInfo.model}
                  </Text>
                ) : null}

                {baseInfo.serial ? (
                  <Text style={styles.itemContentText}>
                    {T.t('detail_serial')}: {baseInfo.serial}
                  </Text>
                ) : null}
              </View>
            ) : (
              <Text> {T.t('is_not_specified')}</Text>
            )}
          </>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CreateItemQty')}>
          <Text style={styles.itemText}>
            {T.t('type_and_value')}
            <Text style={styles.required}> * </Text>
          </Text>
          {accountType.pricePerPiece ? (
            <View style={styles.itemContent}>
              <Text style={styles.itemContentText}>
                {T.t('detail_type')}: {accountType.batch ? T.t('quantitative') : T.t('single')}
              </Text>
              {accountType.batch && (
                <>
                  <Text style={styles.itemContentText}>
                    {T.t('detail_quantity')}: {accountType.batch.quantity}
                    {accountType.batch.units}
                  </Text>
                  <Text style={styles.itemContentText}>
                    {T.t('detail_price_per_item')}: {accountType.pricePerPiece}
                  </Text>
                  <Text style={styles.itemContentText}>
                    {T.t('detail_price_per_lot')}: {pricePerLot}
                  </Text>
                </>
              )}
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate('CreateItemsPhotos');
            dispatch(cleanScanInfo());
          }}>
          <Text style={styles.itemText}>{T.t('photos')}</Text>
          {photos.length ? (
            <View style={styles.itemContent}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={photos}
                renderItem={renderPhotoItem}
                keyExtractor={item => item.id}
                horizontal={true}
              />
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CreateItemLocation')}>
          <Text style={styles.itemText}>{T.t('item_location')}</Text>
          {location ? (
            <View style={styles.itemContent}>
              {location.object ? (
                <Text style={styles.itemContentText}>
                  {T.t('object')}: {location.object}
                </Text>
              ) : null}
              {location.location ? (
                <Text style={styles.itemContentText}>
                  {T.t('location')}: {location.location}
                </Text>
              ) : null}
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CreateItemResponsible')}>
          <Text style={styles.itemText}>{T.t('responsible')}</Text>
          {responsible.firstName ? (
            <View style={styles.itemContent}>
              <Text style={styles.itemContentText}>
                {T.t('responsible')}: {responsible.firstName}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CreateItemAdditionalInfo')}>
          <Text style={styles.itemText}>{T.t('additional_info')}</Text>
          {additionalInfo.length ? (
            <View style={styles.itemContent}>
              <FlatList
                data={additionalInfo}
                renderItem={renderAdditionalInfoItem}
                keyExtractor={item => item.name}
              />
            </View>
          ) : null}
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
          <DarkButton onPress={createNewItem} text={`${T.t('create')}`} disabled={!baseInfo.type} />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
  itemContent: {
    marginTop: 5,
    width: width / 1.2,
    alignItems: 'flex-start',
  },
  itemContentText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#22215B',
  },
  smallImgWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    flexWrap: 'wrap',
  },
  smallImg: {
    borderWidth: 3,
    height: 50,
    width: 50,
    marginRight: 5,
    borderColor: 'transparent',
  },
  valuesWrap: {
    flexDirection: 'row',
    marginTop: 20,
  },
  valueText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#22215B',
    fontWeight: 'bold',
    textAlign: 'left',
    marginRight: 5,
    maxWidth: Dimensions.get('window').width / 2.6,
  },
});

export default CreateItem;
