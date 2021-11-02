import React from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import T from '../../../../i18n';
import Appbar from '../../../../components/Appbar';
import {useNavigation} from '@react-navigation/native';
import {height, width} from '../../../../constants/dimentionsAndUnits';
import DarkButton from '../../../../components/Buttons/DarkButton';

export const CreateLocationContainer = ({
  handleSave,
  isBtnVisible = true,
  isSaveBtnEnabled = true,
  children,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Appbar
        navigation={navigation}
        arrow={true}
        goTo={'MoveStartPage'}
        title={T.t('choose_location')}
      />

      {children}
      {isBtnVisible && (
        <View style={styles.btns}>
          <DarkButton
            onPress={handleSave}
            text={`${T.t('save')}`}
            disabled={!isSaveBtnEnabled}
          />
        </View>
      )}
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
  btns: {
    marginBottom: 30,
    width: width / 1.3,
    alignSelf: 'center',
  },
});
