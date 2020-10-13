/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {StyleSheet, View, Dimensions, SafeAreaView, ScrollView} from 'react-native';
import {Card, IconButton, Searchbar, Button, ActivityIndicator, Dialog, Portal} from 'react-native-paper';
import {isEmpty} from 'lodash';
// components
import Appbar from '../../../components/Appbar';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {loader, loadMore, searchItem, mountItemFromParent} from '../../../actions/actions.js';
import T from '../../../i18n';

export const MountNoMarking = props => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.scan);
  const noMarking = useSelector(state => state.marking);
  const marking = useSelector(state => state.marking);
  const editItems = noMarking.markingList;
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const originalList = store.scanInfo.items;

  const itemSearch = query => {
    setSearch(query);
    dispatch(loadMore(true));
    dispatch(searchItem(false, query, 0, true));
  };

  const getMoreItems = () => {
    dispatch(loadMore(true));
    dispatch(searchItem(false, search, marking.offSet, false));
  };

  const addItem = item => {
    // setIsOpen(true);
    dispatch(loader(true));
    dispatch(mountItemFromParent(
      store.scanInfo._id,
      item,
      store.scanInfo.code,
      props.navigation,
      'MountNoMarking'
    ));
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={false}
        arrow={true}
        goTo={'back'}
        title={T.t('edit')}
      />
      <SafeAreaView/>
        <View style={styles.container}>
        <Searchbar
            placeholder={T.t('search')}
            onChangeText={query => itemSearch(query)}
            value={search}
            style={styles.search}
          />
            <ScrollView style={styles.scroll}>
              <View style={styles.cardBlock}>
              {!isEmpty(editItems) && editItems.map((item, index) => (
                        <Card.Title
                        key={index}
                        style={styles.card}
                        title={`${item.metadata.title ? item.metadata.title : ''}`}
                        subtitle={`${item.metadata.type ? item.metadata.type + ',' : ''} ${item.metadata.brand ? item.metadata.brand + ',' : ''} ${item.metadata.model ? item.metadata.model + ',' : ''} ${item.metadata.serial ? item.metadata.serial : ''}`}
                        right={props =>
                          !isEmpty(originalList) && originalList.map(i => i._id).includes(item._id) ? (
                            <IconButton {...props} icon="check" onPress={() => {}} />
                          ) : (
                            !item.parent && ( <IconButton {...props} icon="plus" onPress={() => addItem(item._id)} /> )
                          )
                        }
                    />
              ))}
              </View>
            </ScrollView>
            {!marking.loadMore && (
              <Button
                style={styles.button}
                mode="Text"
                color="#22215B"
                onPress={getMoreItems}>
                 {T.t('load_more')}
              </Button>
            )}
            {marking.loadMore && (
              <ActivityIndicator
                style={styles.load}
                size={'large'}
                animating={true}
                color={'#EDF6FF'}
              />
            )}
        </View>
        <Portal>
          <Dialog style={styles.dialog} visible={isOpen} onDismiss={() => setIsOpen(!isOpen)}>
            <Dialog.Title>{T.t('add')}</Dialog.Title>
            <Dialog.Actions>
              <Button onPress={() => setIsOpen(!isOpen)}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
    </>
  );
};

const styles = StyleSheet.create({
search: {
    backgroundColor: '#EDF6FF',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 10,
    alignSelf: 'center',
    },
  container: {
    backgroundColor: '#D3E3F2',
    paddingTop: 20,
    borderRadius: 10,
    height: Dimensions.get('window').height / 1.14,
    paddingBottom: 20,
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: Dimensions.get('window').height / 30,
  },
  title: {
    color: '#7A7A9D',
    textAlign: 'center',
    padding: 30,
  },
  text: {
    fontSize: 16,
    paddingBottom: 5,
    color: '#7A7A9D',
    width: Dimensions.get('window').width / 1.3,
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
  },
  cardTitle: {
    fontSize: 13,
    textTransform: 'uppercase',
    color: '#22215B',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 15,
    color: '#22215B',
  },
  cardBlock: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width / 1,
    marginBottom: 90,
    paddingTop: 10,
  },
  scroll: {
    backgroundColor: '#D3E3F2',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  load: {
    marginTop: 10,
  },
});

export default MountNoMarking;
