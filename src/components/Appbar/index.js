import React, { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { withRouter } from 'react-router-native';

const AppbarCustom = props => {
  const {closed} = props;
  // const [visible, setVisible] = useState(false);
  return (
    !closed && <Appbar.Header>
      <Appbar.Action icon="menu" onPress={() => props.navigation.openDrawer()}/>
      <Appbar.Content
        title="EcMan"
      />

      {/* <Menu
        visible={visible}
        onDismiss={() => {setVisible(false)}}
        anchor={
          <Appbar.Action icon="dots-vertical" color='#fff' onPress={() => setVisible(true)}/>
        }
      >
        <Menu.Item onPress={() => {}} title="Item 1" />
      </Menu> */}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 100
  },
  icon: {
    color: "#fff"
  },
});

export default withRouter(AppbarCustom);
