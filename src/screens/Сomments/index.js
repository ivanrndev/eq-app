/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {isEmpty} from 'lodash';
import moment from 'moment';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import T from '../../i18n';
import {
  Button,
  Card,
  IconButton,
  Paragraph,
  TextInput,
  Title,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

// components
import Appbar from '../../components/Appbar';
import {getProperErrorMessage} from '../../utils/helpers.js';
// redux and actions
import {useDispatch, useSelector} from 'react-redux';

import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Gallery from '../../components/Gallery';
import {
  clearComments,
  getComments,
  sendComments,
} from '../../actions/commentsAction';

const Comments = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [comments, scan, newPhotos] = useSelector(({comments, scan}) => [
    comments,
    scan,
    comments.photos,
  ]);

  let error = getProperErrorMessage(comments.commentsError);
  const [text, setText] = useState('');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [chosenPhoto, setChosenPhoto] = useState('');
  const [commentId, setCommentId] = useState('');
  const photosInGallery = comments.commentsList.find(
    item => item._id === commentId,
  );
  const bigPhoto =
    photosInGallery &&
    photosInGallery.photos.find(item => item.name === chosenPhoto);
  let scrollView = useRef();
  let showEmptyError = !comments.commentsList.length;
  let commentData = new FormData();
  commentData.append('message', text);

  if (!isEmpty(newPhotos)) {
    newPhotos.forEach(file => {
      commentData.append('file', {
        uri: `file:///${file.path}`,
        type: file.mime,
        name: file.filename,
      });
    });
  }

  const sendComment = () => {
    dispatch(sendComments(comments.itemId, commentData));
  };

  useEffect(() => {
    dispatch(clearComments());
    dispatch(getComments(navigation, comments.itemId, 0, comments.page));
    setText('');
  }, [comments.addNewComment]);

  const test = useCallback(() => {
    scrollView.current.scrollToEnd({animated: true});
  }, [scrollView]);

  const handleAddPhoto = () => navigation.navigate('ChoosePhotoMode');
  const handlePressPhoto = (commentId, photoId) => {
    setIsGalleryOpen(true);
    setCommentId(commentId);
    setChosenPhoto(photoId);
  };
  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
    setChosenPhoto('');
    setCommentId('');
  };
  console.log('PPPOK', newPhotos);
  return (
    <>
      <Appbar
        navigation={navigation}
        arrow={true}
        clearComments={true}
        newScan={false}
        goTo={comments.page}
        title={T.t('title_comments')}
      />
      <SafeAreaView />
      <View style={styles.body}>
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
                    <Card style={styles.card} key={item._id} onPress={() => {}}>
                      <Card.Content>
                        <Paragraph style={styles.paragraph}>
                          {T.t('transfer_from')}: {item.user.firstName}{' '}
                          {item.user.lastName}
                        </Paragraph>
                        <Paragraph style={styles.paragraph}>
                          {T.t('title_date')}:{' '}
                          {moment(item.updatedAt).format('YYYY-MM-DD HH:mm')}
                        </Paragraph>
                        {item.message.length > 0 && (
                          <Paragraph style={styles.paragraph}>
                            {T.t('title_comment')}: "{item.message}"
                          </Paragraph>
                        )}
                        <View style={styles.smallImgWrap}>
                          {!isEmpty(item.photos) &&
                            item.photos.map(photo => (
                              <TouchableWithoutFeedback
                                onPress={() =>
                                  handlePressPhoto(item._id, photo.name)
                                }>
                                <Image
                                  style={styles.smallImg}
                                  source={{
                                    uri: photo.url,
                                  }}
                                />
                              </TouchableWithoutFeedback>
                            ))}
                        </View>
                      </Card.Content>
                    </Card>
                  ))
                : null}
            </ScrollView>
          )}
          {error ? <Title style={styles.title}>{error}</Title> : null}
          <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={140}>
            <View style={styles.send}>
              {newPhotos.length > 0 &&
                newPhotos.map(photo => (
                  <Image
                    style={styles.smallImg}
                    source={{
                      uri: photo.path,
                    }}
                  />
                ))}
              <IconButton
                icon="paperclip"
                size={35}
                style={styles.addPhotoBtn}
                color="#22215B"
                onPress={handleAddPhoto}
                disabled={newPhotos.length >= 3}
              />
            </View>
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
                disabled={isEmpty(text.trim()) && isEmpty(newPhotos)}
                style={styles.button}
                contentStyle={styles.buttonSend}
                mode="contained"
                color="#D3E3F2"
                onPress={() => sendComment()}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
      <Gallery
        bigPhoto={bigPhoto}
        photoList={photosInGallery ? photosInGallery.photos : []}
        handleChoosePhoto={setChosenPhoto}
        handlePortalClose={handleCloseGallery}
        isPortalOpen={isGalleryOpen}
      />
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    zIndex: 1,
    marginTop: -10,
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#D3E3F2',
    height: Dimensions.get('window').height,
  },
  container: {
    zIndex: 1,
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
  btns: {
    marginLeft: 10,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  button: {
    textAlign: 'center',
    height: 70,
    width: 40,
    marginBottom: 10,
    marginLeft: 10,
  },
  buttonSend: {
    height: 70,
    width: 80,
  },
  textInput: {
    justifyContent: 'center',
    height: 70,
    color: '#7A7A9D',
    marginBottom: 10,
    backgroundColor: '#EDF6FF',
    flex: 1,
  },
  send: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 40,
    paddingLeft: 13,
    paddingRight: 13,
    marginTop: 20,
  },
  addPhotoBtn: {
    alignSelf: 'flex-end',
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    paddingBottom: 20,
    width: Dimensions.get('window').width / 1.2,
  },
  smallImgWrap: {
    flexDirection: 'row',
    paddingVertical: 10,
    flexWrap: 'wrap',
  },
  smallImg: {
    marginRight: 5,
    height: 70,
    width: 70,
  },
});

export default Comments;
