import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import { Drawer, Avatar } from 'react-native-paper';

const CustomDrawer = ({state: {routes}, navigation}) => {
  return (
    <SafeAreaView>
      <View style={styles.user}>
        <View>
          <Avatar.Text size={40} label="XD" />
          <Text style={styles.text}>Alexey Solodukhin</Text>
        </View>
      </View>
      <Drawer.Section title="Some title">
        {
          routes && routes.length > 0 && routes.map((item) => {
            return (
              <Drawer.Item
                label={item.name}
                key={item.key}
                onPress={() => { navigation.navigate(item.name) }}
              />
            )
          })
        }
      </Drawer.Section>
    </SafeAreaView>
  )
};

export default CustomDrawer;

const styles = StyleSheet.create({
  user: {
    height: 100,
    backgroundColor: '#f7f7f7',
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  text: {
    fontWeight: "500",
    fontFamily: "Montserrat-Medium"
  }
});
