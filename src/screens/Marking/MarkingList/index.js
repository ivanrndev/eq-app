import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Searchbar,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import T from '../../../i18n';
// components
import Appbar from '../../../components/Appbar';
import {getProperErrorMessage} from '../../../utils/helpers.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';
import {
  saveCurrentItemMark,
  searchItem,
  loadMore,
} from '../../../actions/actions.js';

const MarkingList = props => {
  const dispatch = useDispatch();
  const marking = useSelector(state => state.marking);
  const settings = useSelector(state => state.settings);
  let error = getProperErrorMessage(marking.markingError);
  const [search, setSearch] = useState('');

  const itemSearch = query => {
    setSearch(query);
    dispatch(loadMore(true));
    dispatch(searchItem(marking.marking, query, 0, true));
  };

  const getMoreItems = () => {
    dispatch(loadMore(true));
    dispatch(searchItem(marking.marking, search, marking.offSet, false));
  };

  let showEmptyError = false;
  if (!marking.marking && marking.markingList.length === 0) {
    showEmptyError = true;
  }

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        newScan={true}
        goTo={'Marking'}
        title={marking.marking ? T.t('title_remark') : T.t('title_mark')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        {!error && (
          <Searchbar
            placeholder={T.t('search')}
            onChangeText={query => itemSearch(query)}
            value={search}
            style={styles.search}
          />
        )}
        {!error && (
          <>
            <View style={styles.container}>
              <ScrollView style={styles.scroll}>
                {showEmptyError && (
                  <Paragraph style={styles.text}>
                    {T.t('no_available')}
                  </Paragraph>
                )}
                {!error &&
                  marking.markingList.map((item, index) => (
                    <Card
                      style={styles.card}
                      key={index}
                      onPress={() =>
                        dispatch(
                          saveCurrentItemMark(
                            item._id,
                            props.navigation,
                            settings.startPageMarking,
                          ),
                        )
                      }>
                      <Card.Content>
                        {item.metadata.title ? (
                          <Title style={styles.cardTitle}>
                            {item.metadata.title}
                          </Title>
                        ) : (
                          <Title style={styles.cardTitle}>
                            {item.metadata.type} {item.metadata.brand}{' '}
                            {item.metadata.model} {item.metadata.serial}
                          </Title>
                        )}
                        {item.metadata.type && (
                          <Paragraph style={styles.paragraph}>
                            {item.metadata.type} {item.code && '/ ' + item.code}
                          </Paragraph>
                        )}
                        {item.metadata.brand && (
                          <Paragraph style={styles.paragraph}>
                            {item.metadata.brand}
                          </Paragraph>
                        )}
                        {item.metadata.model && (
                          <Paragraph style={styles.paragraph}>
                            {item.metadata.model}
                          </Paragraph>
                        )}
                        {item.metadata.serial && (
                          <Paragraph style={styles.paragraph}>
                            {item.metadata.serial}
                          </Paragraph>
                        )}
                      </Card.Content>
                    </Card>
                  ))}
              </ScrollView>
            </View>
            {marking.markingList.length > 5 && (
              <>
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
              </>
            )}
          </>
        )}
        {error ? <Title style={styles.title}>{error}</Title> : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    marginTop: -10,
    display: 'flex',
    paddingTop: 25,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  container: {
    height: Dimensions.get('window').height / 1.5,
  },
  search: {
    backgroundColor: '#EDF6FF',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 20,
  },
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
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    paddingBottom: 20,
    width: Dimensions.get('window').width / 1.2,
  },
});

export default MarkingList;
