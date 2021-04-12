import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DarkButton from '../../Buttons/DarkButton';
import {Card} from 'react-native-paper';
import Appbar from '../../Appbar';
import T from '../../../i18n';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {addPhotoToComment} from '../../../actions/commentsAction';

const ChoosePhotoMode = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const photos = useSelector(({comments}) => comments.photos);
  const maxPhotoCount = 3;
  const maxChoosePhotoCount = maxPhotoCount - photos.length;

  const handleChoosePhoto = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 600,
      compressImageMaxHeight: 600,
      multiple: true,
      maxFiles: maxChoosePhotoCount,
    })
      .then(images => {
        console.log('IMAGES', images);
        dispatch(addPhotoToComment(images));
      })
      .then(navigation.navigate('Comments'));
  };

  const handleTakePhoto = () =>
    ImagePicker.openCamera({
      multiple: true,
      compressImageMaxWidth: 600,
      compressImageMaxHeight: 600,
      height: 300,
      width: 300,
      maxFiles: maxChoosePhotoCount,
    })
      .then(images => {
        console.log(images);
        dispatch(addPhotoToComment([images]));
      })
      .then(navigation.navigate('Comments'));

  return (
    <>
      <Appbar
        navigation={navigation}
        newScan={true}
        arrow={true}
        goTo={'Comments'}
        title={T.t('title_comments')}
      />
      <View style={styles.wrap}>
        <Card style={styles.card}>
          <View style={styles.btns}>
            <DarkButton text={T.t('take_a_photo')} onPress={handleTakePhoto} />
            <DarkButton
              text={T.t('choose_from_gallery')}
              onPress={handleChoosePhoto}
            />
          </View>
        </Card>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  wrap: {
    height: Dimensions.get('window').height - 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: Dimensions.get('window').width / 1.1,
    marginBottom: 15,
    backgroundColor: '#EDF6FF',
    padding: 15,
  },
  btns: {},
});

export default ChoosePhotoMode;
