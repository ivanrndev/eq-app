import Appbar from '../../../components/Appbar';
import T from '../../../i18n';
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const CreateFinish = () => {
  const navigation = useNavigation();
  return (
    <>
      <Appbar
        navigation={navigation}
        arrow={true}
        goTo={'Home'}
        title={T.t('create_item')}
        createItem={true}
      />
      <View style={styles.wrap}>
        <Text style={styles.titleLarge}>{T.t('created')}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleLarge: {
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 24,
    color: '#22215B',
    fontWeight: 'bold',
  },
});
export default CreateFinish;
