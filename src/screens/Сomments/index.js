/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {isEmpty} from 'lodash';
import moment from 'moment';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import T from '../../i18n';
import {Card, Title, Paragraph, TextInput, Button} from 'react-native-paper';
// components
import Appbar from '../../components/Appbar';
import {getProperErrorMessage} from '../../utils/helpers.js';
// redux and actions
import {useSelector, useDispatch} from 'react-redux';
import {
  getComments,
  sendComments,
  clearComments,
} from '../../actions/actions.js';

const Comments = props => {
  const dispatch = useDispatch();
  const comments = useSelector(state => state.comments);
  const scan = useSelector(state => state.scan);
  let error = getProperErrorMessage(comments.commentsError);
  const [text, setText] = useState('');
  let scrollView = useRef();
  let showEmptyError = !comments.commentsList.length;

  const sendComment = () => {
    dispatch(sendComments(comments.itemId, text));
  };

  useEffect(() => {
    dispatch(clearComments());
    dispatch(getComments(props.navigation, comments.itemId, 0, comments.page));
    setText('');
  }, [comments.addNewComment]);

  const test = useCallback(() => {
    scrollView.current.scrollToEnd({animated: true});
  }, [scrollView]);
  return (
    <>
      <Appbar
        navigation={props.navigation}
        arrow={true}
        clearComments={true}
        newScan={false}
        goTo={comments.page}
        title={T.t('title_comments')}
      />
      <SafeAreaView />
      <View style={styles.body}>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={90}>
          <View style={styles.container}>
            {!error && (
              <ScrollView ref={scrollView} onContentSizeChange={test}>
                {showEmptyError && (
                  <Paragraph style={styles.text}>
                    {T.t('format_comments_empty_first')} {scan.currentScan}{' '}
                    {T.t('format_comments_empty_second')}
                  </Paragraph>
                )}
                {!error
                  ? comments.commentsList.map(item => (
                      <Card
                        style={styles.card}
                        key={item._id}
                        onPress={() => {}}>
                        <Card.Content>
                          <Paragraph style={styles.paragraph}>
                            {T.t('transfer_from')}: {item.user.firstName}{' '}
                            {item.user.lastName}
                          </Paragraph>
                          <Paragraph style={styles.paragraph}>
                            {T.t('title_date')}:{' '}
                            {moment(item.updatedAt).format('YYYY-MM-DD HH:mm')}
                          </Paragraph>
                          <Paragraph style={styles.paragraph}>
                            {T.t('title_comment')}: "{item.message}"
                          </Paragraph>
                        </Card.Content>
                      </Card>
                    ))
                  : null}
              </ScrollView>
            )}
            {error ? <Title style={styles.title}>{error}</Title> : null}
            <View style={styles.send}>
              <TextInput
                multiline={true}
                style={styles.textInput}
                mode="outlined"
                label={T.t('title_comment_new')}
                value={text}
                onChangeText={text => setText(text)}
              />
              <Button
                icon="send"
                disabled={isEmpty(text.trim()) ? true : false}
                style={styles.button}
                contentStyle={styles.buttonSend}
                mode="contained"
                color="#D3E3F2"
                onPress={() => sendComment()}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    zIndex: 1,
    marginTop: -10,
    display: 'flex',
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  container: {
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 10,
    height: Dimensions.get('window').height / 1.3,
    paddingBottom: 10,
    paddingTop: 20,
    marginLeft: 11,
    marginRight: 11,
    backgroundColor: '#EDF6FF',
  },
  load: {
    marginTop: 10,
  },
  card: {
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.2,
    marginBottom: 0,
    backgroundColor: '#EDF6FF',
    borderWidth: 0,
    shadowColor: '#EDF6FF',
    borderRadius: 0,
    borderBottomWidth: 1,
    borderColor: '#D3E3F2',
  },
  cardTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 15,
    color: '#7A7A9D',
  },
  button: {
    textAlign: 'center',
    height: 56,
    width: 50,
  },
  buttonSend: {
    height: 56,
    width: 80,
  },
  textInput: {
    display: 'flex',
    justifyContent: 'center',
    height: 56,
    color: '#7A7A9D',
    marginTop: -6,
    marginBottom: 10,
    backgroundColor: '#EDF6FF',
    width: Dimensions.get('window').width / 1.77,
  },
  send: {
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 40,
    paddingLeft: 13,
    paddingRight: 13,
    marginTop: 20,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    paddingBottom: 20,
    width: Dimensions.get('window').width / 1.2,
  },
});

export default Comments;
