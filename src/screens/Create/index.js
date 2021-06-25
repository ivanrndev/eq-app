import React from 'react';
import {Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Appbar from '../../components/Appbar';
import T from '../../i18n';

const CreateItem = () => {
  const navigation = useNavigation();
  return (
    <>
      <Appbar
        navigation={navigation}
        arrow={true}
        goTo={'Home'}
        title={T.t('create_item')}
        pageToChosenItem="IdentInfo"
      />
      <Text>CREATE</Text>
    </>
  );
};
export default CreateItem;
