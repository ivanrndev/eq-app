import React, { useState } from 'react';
import { useDispatch } from 'redux-react-hook';
import { SafeAreaView, Dimensions, ScrollView, Linking, TouchableOpacity, StyleSheet, Text, View, Button, RefreshControl } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

// components
import AppbarCustom from '../../сomponents/Appbar';
import Scanner from '../../сomponents/Scanner';

const normalCoordinates = [
  {
    x: [120, 300],
    y: [600, 700]
  },
  {
    x: [60, 100],
    y: [600, 700]
  },
  {
    x: [60, 100],
    y: [450, 500]
  }
];

const isInBounds = (coordinate, bounds) => {
  if(coordinate >= bounds[0] && coordinate <= bounds[1]) {
    return true
  }
  return false;
}

const Main = props => {
  const [open, setOpen] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false);
  const [scannedItems, setScanned] = React.useState([]);
  const dispatch = useDispatch();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch({
      type: "GET_AUTH"
    });
    setTimeout(() => {
     setRefreshing(false)
    }, 2000);
  }, [refreshing]);

  const onScan = (e) => {
    console.log(e);
    const {bounds: {origin}} = e;
    for(let i in origin) {
      const coordinate = origin[i];
      const inBounds = isInBounds(coordinate, normalCoordinates[i]);
      if(!inBounds) {
        return;
      }
    }
    const newData = [...scannedItems, e.data].filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    setScanned(newData);
    console.log(scannedItems);
  };

  return (
    <>
      <AppbarCustom navigation={props.navigation} closed={open}/>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
        >
        {/* {open && 
          <Scanner 
            onScan={onScan} 
            close={() => setOpen(false)} 
            indicator={scannedItems}/>
        }
        {!open && <View>
          <Button 
            style={styles.button} 
            title='Сканер' 
            onPress={() => setOpen(!open)}/>
          <Text>{scannedItems.join(',')}</Text>
        </View>} */}
        </ScrollView>
      </SafeAreaView>
    </>
  )
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    width: Dimensions.get('window').width / 2.5,
    marginTop: 50,
    borderRadius: 5
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default Main;


