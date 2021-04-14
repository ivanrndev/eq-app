import React from 'react';
import {isEmpty} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {
  Dimensions,
  Image,
  ImageBackground,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Divider, IconButton, Text} from 'react-native-paper';

const image = require('./../../../assets/svg/empty.png');

const GalleryForItem = ({setIsGalleryOpen, setChosenPhoto}) => {
  const itemInfo = useSelector(({scan}) => scan.scanInfo);
  const itemPhotos = itemInfo.photos ?? [];
  const bigPhoto = !isEmpty(itemPhotos) && itemPhotos[0];
  const smallPhotos = itemPhotos.length > 1 ? itemPhotos.slice(1) : [];
  const dispatch = useDispatch();
  const isShown = isEmpty(itemPhotos) || isEmpty(smallPhotos);
  console.log('::::', isShown);
  const handlePressPhoto = index => {
    setIsGalleryOpen(true);
    setChosenPhoto(index);
  };

  return (
    <View style={styles.wrap}>
      {!isEmpty(itemPhotos) ? (
        <>
          <TouchableWithoutFeedback onPress={() => handlePressPhoto(index)}>
            <ImageBackground source={image} style={styles.bgSvgBig}>
              <Image
                style={styles.bigImg}
                source={{
                  uri: bigPhoto.url,
                }}
              />
            </ImageBackground>
          </TouchableWithoutFeedback>
          <View style={styles.smallTable}>
            {smallPhotos.map((photo, index) => (
              <TouchableWithoutFeedback
                onPress={() => handlePressPhoto(index)}
                key={photo.name}>
                <ImageBackground source={image} style={styles.bgSvg}>
                  <Image
                    style={styles.smallImg}
                    source={{
                      uri: photo.url,
                    }}
                  />
                </ImageBackground>
              </TouchableWithoutFeedback>
            ))}
            <IconButton icon="plus" size={25} color="#22215B" />
          </View>
        </>
      ) : (
        <>
          <ImageBackground source={image} style={styles.emptyBgSvg}>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.link}>Upload your photo</Text>
              <Divider style={styles.divider} />
            </TouchableOpacity>
          </ImageBackground>
          <IconButton
            icon="plus"
            size={25}
            color="#22215B"
            style={styles.plusBtn}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
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
    marginRight: 5,
    width: Dimensions.get('window').width / 2.2,
    height: 230,
    position: 'relative',
    zIndex: 100,
    borderRadius: 5,
  },
  bgSvgBig: {
    marginRight: 5,
    marginBottom: 5,
    width: Dimensions.get('window').width / 2.2,
    height: 230,
    position: 'relative',
    zIndex: 1,
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
    flex: 1,
    alignSelf: 'flex-start',
    marginVertical: 0,
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
