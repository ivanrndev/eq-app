import React from 'react';
import {Appbar} from 'react-native-paper';
import {withRouter} from 'react-router-native';
import {useDispatch} from 'react-redux';
import {allowNewScan} from '../../actions/actions.js';

const AppbarCustom = props => {
  const dispatch = useDispatch();
  const icon = props.arrow ? 'arrow-left' : 'menu';
  return (
    <Appbar.Header>
      <Appbar.Action
        icon={icon}
        onPress={() => {
          props.navigation.navigate(props.goTo);
          dispatch(allowNewScan(true));
        }}
      />
      <Appbar.Content title={props.title} />
    </Appbar.Header>
  );
};

export default withRouter(AppbarCustom);
