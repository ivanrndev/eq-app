import {ActivityIndicator} from 'react-native-paper';
import {Dimensions, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import ItemListCard from '../ItemListCard';
import React from 'react';

export const CardList = ({
  data,
  getMoreItems,
  navigation,
  settings,
  loadMore,
  saveCurrentItem,
  handleItemPress,
}) => {
  return (
    <>
      <FlatList
        data={data}
        keyExtractor={item => item._id}
        onEndReached={() => {
          !loadMore && getMoreItems();
        }}
        onEndReachedThreshold={0.2}
        renderItem={item => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              saveCurrentItem &&
                saveCurrentItem(item.item._id, navigation, settings.startPageMarking);
              handleItemPress && handleItemPress(item.item);
            }}>
            <ItemListCard item={item.item} isResponsibleShown={true} />
          </TouchableOpacity>
        )}
      />
      {loadMore && (
        <ActivityIndicator style={styles.load} size={'large'} animating={true} color={'#EDF6FF'} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  load: {
    marginTop: 10,
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
  },
});
