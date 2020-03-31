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
// components
import Appbar from '../../../components/Appbar';
import {getProperErrorMessage} from '../../../utils/getPropertyErrorMessage.js';
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

  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        goTo={'Marking'}
        title={'Список'}
      />
      <SafeAreaView />
      {!error && (
        <Searchbar
          placeholder="Поиск"
          onChangeText={query => itemSearch(query)}
          value={search}
        />
      )}
      <View style={styles.container}>
        {!error && (
          <>
            <ScrollView>
              {!error &&
                marking.markingList.map(item => (
                  <Card
                    style={styles.card}
                    key={item._id}
                    onPress={() =>
                      dispatch(saveCurrentItemMark(item._id, props.navigation))
                    }>
                    <Card.Content>
                      <Title style={styles.cardTitle}>
                        {item.metadata.type} {item.code && '/ ' + item.code}
                      </Title>
                      <Paragraph style={styles.paragraph}>
                        {item.metadata.brand}
                      </Paragraph>
                      <Paragraph style={styles.paragraph}>
                        {item.metadata.model}
                      </Paragraph>
                      <Paragraph style={styles.paragraph}>
                        {item.metadata.serial}
                      </Paragraph>
                    </Card.Content>
                  </Card>
                ))}
            </ScrollView>
            {marking.markingList.length > 5 && (
              <>
                {!marking.loadMore && (
                  <Button
                    style={styles.button}
                    mode="contained"
                    color="#3a6fdb"
                    onPress={getMoreItems}>
                     Загрузить еще
                  </Button>
                )}
                {marking.loadMore && (
                  <ActivityIndicator
                    style={styles.load}
                    size={'large'}
                    animating={true}
                    color={'#3a6fdb'}
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
  container: {
    display: 'flex',
    paddingTop: 20,
    alignItems: 'center',
    height: Dimensions.get('window').height / 1.3,
  },
  load: {
    marginTop: 10,
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 15,
  },
  button: {
    marginTop: 10,
  },
  text: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'right',
    width: Dimensions.get('window').width / 1.3,
  },
});

export default MarkingList;
