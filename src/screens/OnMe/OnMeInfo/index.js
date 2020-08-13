import React from 'react';
import {isEmpty} from 'lodash';
import {StyleSheet, View, Dimensions, SafeAreaView, Text} from 'react-native';
import {Title, Portal, ActivityIndicator} from 'react-native-paper';
import T from '../../../i18n';
// components
import DarkButton from '../../../components/Buttons/DarkButton';
import Appbar from '../../../components/Appbar';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  loader,
  getTransactions,
  getComments,
} from '../../../actions/actions.js';

export const OnMeInfo = props => {
  const settings = useSelector(state => state.settings);
  const store = useSelector(state => state.onMe);
  const dispatch = useDispatch();

  const myList = store.myList.filter(item => {
    return item._id === store.myCurrentId;
  });

  const metaData = myList.length ? myList[0] : {};
  const info = metaData.metadata;
  const show = !isEmpty(metaData);

  let nameOfProduct = '';
  if (info) {
    nameOfProduct = info.title
      ? info.title
      : `${info.type} ${info.brand} ${info.model} ${info.serial}`;
  }

  const handleTransactions = () => {
    dispatch(loader(true));
    dispatch(getTransactions(metaData._id, props.navigation, 0));
  };

  const getAllComments = () => {
    dispatch(loader(true));
    dispatch(getComments(props.navigation, metaData._id, 0, 'OnMeInfo'));
  };

  return (
    <>
      <Appbar
        navigation={props.navigation}
        newScan={true}
        arrow={true}
        goTo={'OnMe'}
        title={T.t('detail_info')}
      />
      <SafeAreaView />
      <Portal>
        {settings.loader && (
          <View style={styles.loader}>
            <ActivityIndicator
              style={styles.load}
              size={80}
              animating={true}
              color={'#EDF6FF'}
            />
          </View>
        )}
      </Portal>
      <View style={styles.body}>
        <View style={styles.container}>
          {store.myError && (
            <View style={styles.info}>
              <Title style={styles.titleError}>ТМЦ не найден</Title>
            </View>
          )}
          {!store.myError && (
            <View style={styles.info}>
              {show && (
                <View style={styles.info}>
                  {!!info && (
                    <Text style={styles.text}>
                      {T.t('detail_title')}: {nameOfProduct}
                    </Text>
                  )}
                  {!!info.brand && (
                    <Text style={styles.text}>
                      {T.t('detail_brand')}: {info.brand}
                    </Text>
                  )}
                  {!!info.model && (
                    <Text style={styles.text}>
                      {T.t('detail_model')}: {info.model}
                    </Text>
                  )}
                  {!!info.capacity && (
                    <Text style={styles.text}>
                      {T.t('detail_capacity')}: {info.capacity}
                    </Text>
                  )}
                  {!!info.serial && (
                    <Text style={styles.text}>
                      {T.t('detail_serial')}: {info.serial}
                    </Text>
                  )}
                  {!!info.type && (
                    <Text style={styles.text}>
                      {T.t('detail_type')}: {info.type}
                    </Text>
                  )}
                  {show
                    ? metaData.customFields.map((item, index) => {
                        return (
                          <Text key={index} style={styles.text}>
                            {item.label}: {item.value}
                          </Text>
                        );
                      })
                    : null}
                  {show ? (
                    <Text style={styles.text}>
                      {T.t('qr_code')}: {metaData.code}
                    </Text>
                  ) : null}
                </View>
              )}
            </View>
          )}
          {!store.myError ? (
            <View style={styles.buttons}>
              <DarkButton
                // size={fontSizer(width)}
                text={T.t('title_comments')}
                onPress={getAllComments}
              />
              <DarkButton
                text={T.t('title_history_of_transaction')}
                onPress={handleTransactions}
              />
            </View>
          ) : null}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    marginTop: -10,
    display: 'flex',
    paddingTop: 30,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 10,
    height: Dimensions.get('window').height / 1.3,
    paddingBottom: 10,
    paddingTop: 20,
    width: Dimensions.get('window').width / 1.1,
    backgroundColor: '#EDF6FF',
  },
  buttonBlock: {
    width: Dimensions.get('window').height / 3.3,
    textAlign: 'center',
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: Dimensions.get('window').height / 15,
  },
  title: {
    color: '#22215B',
    textAlign: 'center',
    padding: 30,
    fontSize: 21,
  },
  titleError: {
    color: '#E40B67',
    textAlign: 'center',
    padding: 30,
    fontSize: 21,
  },
  text: {
    fontSize: 16,
    paddingBottom: 5,
    color: '#7A7A9D',
    width: Dimensions.get('window').width / 1.3,
  },
  buttons: {
    position: 'absolute',
    bottom: 40,
    width: Dimensions.get('window').width / 1.5,
  },
  loader: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: Dimensions.get('window').height / 9,
    zIndex: 99,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default OnMeInfo;
