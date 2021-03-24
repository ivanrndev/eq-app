import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import T from '../../../../i18n';
import {useNavigation} from '@react-navigation/native';

import Appbar from '../../../../components/Appbar';

const CreateItem = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.body}>
      <Appbar
        navigation={navigation}
        arrow={true}
        goTo={'InventoryChooseMode'}
        title={T.t('create_item')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
});

export default CreateItem;
