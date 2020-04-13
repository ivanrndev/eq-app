import React from 'react';
import {Appbar} from 'react-native-paper';
import {withRouter} from 'react-router-native';
import {useDispatch} from 'react-redux';
import {
  allowNewScan,
  clearTransfer,
  clearTransaction,
} from '../../actions/actions.js';

const AppbarCustom = props => {
  const dispatch = useDispatch();
  const icon = props.arrow ? 'arrow-left' : 'menu';
  return (
    <Appbar.Header>
      <Appbar.Action
        icon={icon}
        onPress={() => {
          if (props.goTo === 'back') {
            props.navigation.goBack();
          } else {
            props.navigation.navigate(props.goTo);
          }
          if (props.newScan) {
            dispatch(allowNewScan(true));
          }
          if (props.clearTransfer) {
            dispatch(clearTransfer());
          }
          if (props.clearTransaction) {
            dispatch(clearTransaction());
          }
        }}
      />
      <Appbar.Content title={props.title} />
    </Appbar.Header>
  );
};

export default withRouter(AppbarCustom);
