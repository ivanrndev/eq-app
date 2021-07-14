import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Appbar from '../../../components/Appbar';
import T from '../../../i18n';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {height, units, width} from '../../../constants/dimentionsAndUnits';
import {Button, Card, Menu, TextInput} from 'react-native-paper';
import DarkButton from '../../../components/Buttons/DarkButton';
import {QtyForm} from './QtyForm';

const AccountingAndValue = () => {
  const navigation = useNavigation();
  const [qtyMode, setQtyMode] = useState('qty');
  const [sngPrice, setSngPrice] = useState('');

  return (
    <View style={styles.container}>
      <Appbar
        navigation={navigation}
        arrow={true}
        goTo={'CreateItem'}
        title={T.t('create_item')}
      />
      <View style={styles.modeWrap}>
        <TouchableOpacity
          style={[
            styles.modeBtn,
            {backgroundColor: qtyMode === 'sng' ? '#22215B' : '#C5CDD5'},
          ]}
          onPress={() => setQtyMode('sng')}>
          <Text
            style={{
              color: qtyMode === 'sng' ? '#fff' : '#22215B',
              fontWeight: 'bold',
            }}>
            {T.t('single')}
          </Text>
          <View>
            <Text style={{color: qtyMode === 'sng' ? '#fff' : '#22215B'}}>
              {T.t('example')}
            </Text>
            <Text style={{color: qtyMode === 'sng' ? '#fff' : '#22215B'}}>
              {T.t('single_example')}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeBtn,
            {backgroundColor: qtyMode === 'qty' ? '#22215B' : '#C5CDD5'},
          ]}
          onPress={() => setQtyMode('qty')}>
          <Text
            style={{
              color: qtyMode === 'qty' ? '#fff' : '#22215B',
              fontWeight: 'bold',
            }}>
            {T.t('quantitative')}
          </Text>
          <View>
            <Text style={{color: qtyMode === 'qty' ? '#fff' : '#22215B'}}>
              {T.t('example')}
            </Text>
            <Text style={{color: qtyMode === 'qty' ? '#fff' : '#22215B'}}>
              {T.t('quantitative_example')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView style={styles.form}>
        <Card style={styles.card}>
          {qtyMode === 'qty' ? (
            <QtyForm />
          ) : (
            <>
              <TextInput
                value={sngPrice.toString()}
                style={styles.input}
                label={T.t('detail_price_per_item')}
                keyboardType="numeric"
                mode="outlined"
                onChangeText={text => setSngPrice(text)}
              />

              <DarkButton
                onPress={() => navigation.navigate('CreateItem')}
                text={`${T.t('save')}`}
              />
            </>
          )}
        </Card>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -10,
    backgroundColor: '#D3E3F2',
    height: height,
    width: width,
    flex: 1,
    justifyContent: 'flex-start',
  },
  card: {
    justifyContent: 'center',
    width: width / 1.1,
    marginVertical: 15,
    alignSelf: 'center',
    paddingBottom: 30,
    paddingHorizontal: 15,
  },
  form: {flex: 1},
  modeWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width / 1.1,
    alignSelf: 'center',
    marginTop: 20,
    height: 150,
  },
  modeBtn: {
    width: '47%',
    borderRadius: 10,
    justifyContent: 'space-between',
    height: 130,
    padding: 15,
  },
  input: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: width / 1.3,
    backgroundColor: '#fff',
    marginBottom: 30,
  },
});

export default AccountingAndValue;
