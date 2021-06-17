import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Card, Portal} from 'react-native-paper';
import T from '../../i18n';

import TransparentButton from '../Buttons/TransparentButton';
import DarkButton from '../Buttons/DarkButton';
import {useUserData} from '../../hooks/useUserData';

export const TariffLimitModal = ({handleClose}) => {
  const {role, email, firstName, lastName} = useUserData();
  const isAdminOrStockman = !(role === 'user' || role === 'worker');

  return (
    <Portal>
      <View style={styles.body}>
        <Card style={styles.card}>
          <Card.Title title={T.t('popup_limit_exceeded_title')} />
          <Card.Content>
            <Text>
              {isAdminOrStockman
                ? T.t('popup_limit_exceeded_body_admin')
                : `${T.t(
                    'popup_limit_exceeded_body_worker',
                  )}: ${firstName} ${lastName}, ${email}`}
            </Text>

            <TransparentButton
              text={T.t('close')}
              onPress={() => handleClose(false)}
            />

            {isAdminOrStockman && (
              <DarkButton text={T.t('change_tariff_plan')} onPress={() => {}} />
            )}
          </Card.Content>
        </Card>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Dimensions.get('window').height / 9,
    zIndex: 99,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  card: {
    width: Dimensions.get('window').width / 1.2,
  },
});

export default TariffLimitModal;
