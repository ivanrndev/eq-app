import React from 'react';
import {isEmpty} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Divider, IconButton, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import T from '../../../i18n';
import {setGoBackPageGallery} from '../../../actions/addItemPhotoActions';
import {useUserData} from '../../../hooks/useUserData';

const image = require('./../../../assets/svg/empty.png');

const GalleryForItem = ({
  page,
  setIsGalleryOpen,
  setChosenPhoto,
  setPhotoDel,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [itemInfo, goBackPageGallery, createItemPhotos] = useSelector(
    ({scan, createItem}) => [
      scan.scanInfo,
      scan.goBackPageGallery,
      createItem.photos,
    ],
  );
  const initialPhoto =
    goBackPageGallery === 'CreateItem' ? createItemPhotos : itemInfo.photos;
  const itemPhotos = initialPhoto ?? [];

  const bigPhoto = !isEmpty(itemPhotos) && itemPhotos[0];
  const {role, userId} = useUserData();
  const isEditingPhotoAllowed =
    itemPhotos.length < 8 &&
    ((itemInfo.person && userId === itemInfo.person._id) ||
      (role === 'root' || role === 'stockman' || role === 'admin'));

  const smallPhotos = itemPhotos.length > 1 ? itemPhotos.slice(1) : [];

  const handlePressPhoto = (item, index = 0) => {
    setIsGalleryOpen(true);
    setChosenPhoto(index);
    setPhotoDel(item.name);
  };

  const handleAddPhoto = () => {
    navigation.navigate('ChooseItemPhotoMode');
    dispatch(setGoBackPageGallery(page));
  };

  const renderItem = ({item, index}) => {
    return (
      <View>
        <Image
          source={{uri: item.path ?? item.url}}
          containerStyle={styles.imageContainer}
          style={styles.bigImg}
        />
      </View>
    );
  };
  return (
    <View style={styles.wrap}>
      {!isEmpty(itemPhotos) ? (
        <>
          <ImageBackground source={image} style={styles.bgSvgBig}>
            <TouchableWithoutFeedback
              onPress={() => handlePressPhoto(bigPhoto, 0)}>
              <Image
                style={styles.bigImg}
                source={{
                  uri: bigPhoto.path ?? bigPhoto.url,
                }}
              />
            </TouchableWithoutFeedback>
          </ImageBackground>
          <View style={styles.smallTable}>
            {smallPhotos.map((photo, index) => (
              <TouchableWithoutFeedback
                onPress={() => handlePressPhoto(photo, index + 1)}
                key={photo.name}>
                <View>
                  <ImageBackground source={image} style={styles.bgSvg}>
                    <Image
                      style={styles.smallImg}
                      source={{
                        uri: photo.url ?? photo.path,
                      }}
                    />
                  </ImageBackground>
                </View>
              </TouchableWithoutFeedback>
            ))}
            {isEditingPhotoAllowed && (
              <IconButton
                icon="plus"
                size={25}
                color="#22215B"
                onPress={handleAddPhoto}
                style={styles.plusBtn}
              />
            )}
          </View>
        </>
      ) : (
        <>
          <ImageBackground source={image} style={styles.emptyBgSvg}>
            {isEditingPhotoAllowed && (
              <TouchableOpacity onPress={handleAddPhoto}>
                <Text style={styles.link}>{T.t('upload_photo')}</Text>
                <Divider style={styles.divider} />
              </TouchableOpacity>
            )}
          </ImageBackground>
          {isEditingPhotoAllowed && (
            <IconButton
              icon="plus"
              size={25}
              color="#22215B"
              style={styles.plusBtn}
              onPress={handleAddPhoto}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginTop: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width / 1.3,
  },
  smallTable: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 130,
  },

  smallImg: {
    marginRight: 5,
    marginBottom: 5,
    height: 50,
    width: 50,
    position: 'relative',
    zIndex: 100,
    borderRadius: 5,
  },
  bgSvg: {
    marginRight: 5,
    marginBottom: 5,
    height: 50,
    width: 50,
    position: 'relative',
    zIndex: 1,
    borderRadius: 5,
  },
  bigImg: {
    width: Dimensions.get('window').width / 2.2,
    height: 230,
    borderRadius: 5,
  },
  bgSvgBig: {
    marginRight: 5,
    marginBottom: 5,
    width: Dimensions.get('window').width / 2.2,
    height: 230,
    justifyContent: 'center',
    borderRadius: 5,
  },
  emptyBgSvg: {
    resizeMode: 'cover',
    width: Dimensions.get('window').width / 1.7,
    height: Dimensions.get('window').width / 2.2,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 0,
  },
  plusBtn: {
    height: 50,
    width: 50,
    borderRadius: 5,
    backgroundColor: '#D3E3F2',
    alignSelf: 'flex-start',
    margin: 0,
  },
  link: {
    color: '#22215B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 2,
    backgroundColor: '#22215B',
  },
});

export default GalleryForItem;
