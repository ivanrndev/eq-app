import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DarkButton from '../../Buttons/DarkButton';
import {Card} from 'react-native-paper';
import Appbar from '../../Appbar';
import T from '../../../i18n';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {isEmpty} from 'lodash';
import {addItemsPhoto} from '../../../actions/addItemPhotoActions';

const ChooseItemPhotoMode = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const didMount = useRef(true);
  const [newPhoto, setNewPhoto] = useState([]);
  const [itemInfo, currentParent, goBackPageGallery] = useSelector(({scan}) => [
    scan.scanInfo,
    scan.currentParent,
    scan.goBackPageGallery,
  ]);

  const id = itemInfo._id ?? currentParent;
  const itemPhotos = itemInfo.photos ?? [];
  const maxPhotoCount = 8;
  const maxAddPhotoCount = maxPhotoCount - itemPhotos.length;
  let photos = new FormData();

  if (!isEmpty(newPhoto)) {
    newPhoto.forEach(file => {
      photos.append('file', {
        uri: `file:///${file.path}`,
        type: file.mime,
        name: file.filename ?? 'file.path',
      });
    });
  }
  useEffect(() => {
    if (didMount.current) {
      didMount.current = false;
      return;
    }
    if (!isEmpty(newPhoto)) {
      dispatch(addItemsPhoto(id, photos, goBackPageGallery, navigation));
    }
  }, [newPhoto]);

  const handleChoosePhoto = () =>
    ImagePicker.openPicker({
      compressImageMaxWidth: 400,
      compressImageMaxHeight: 400,
      multiple: true,
      maxFiles: maxAddPhotoCount,
    }).then(images => setNewPhoto(images));

  const handleTakePhoto = () =>
    ImagePicker.openCamera({
      multiple: true,
      compressImageMaxWidth: 400,
      compressImageMaxHeight: 400,
      maxFiles: maxAddPhotoCount,
    }).then(images => setNewPhoto([images]));

  return (
    <>
      <Appbar
        navigation={navigation}
        arrow={true}
        goTo={goBackPageGallery}
        title={T.t('detail_info')}
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
});

export default ChooseItemPhotoMode;
