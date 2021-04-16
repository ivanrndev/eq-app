import {Dialog, IconButton, Portal} from 'react-native-paper';
import {isEmpty} from 'lodash';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import React, {useRef} from 'react';
import Carousel from 'react-native-snap-carousel';

const {width} = Dimensions.get('window');
const image = require('./../../assets/svg/empty.png');

const Gallery = ({
  photoList,
  isPortalOpen,
  handlePortalClose,
  chosenPhoto,
  setChosenPhoto,
}) => {
  const entries = photoList.map(photo => ({illustration: photo.url}));
  const carouselRef = useRef(null);

  const handleChose = index => {
    carouselRef.current.snapToItem(index, true, true);
    setChosenPhoto(index);
  };
  const renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <Image
          source={{uri: item.illustration}}
          containerStyle={styles.imageContainer}
          style={styles.bigImg}
        />
      </View>
    );
  };

  return (
    <Portal style={styles.gallery}>
      <Dialog style={styles.gallery} visible={isPortalOpen}>
        <IconButton
          icon="close-circle-outline"
          color="#fff"
          onPress={handlePortalClose}
          style={styles.closeBtn}
          size={35}
        />
        {!isEmpty(photoList) && (
          <>
            <View style={styles.container}>
              <Carousel
                ref={carouselRef}
                data={entries}
                sliderWidth={width - 10}
                itemWidth={width - 10}
                inactiveSlideShift={0}
                renderItem={renderItem}
                onSnapToItem={slideIndex => setChosenPhoto(slideIndex)}
                firstItem={chosenPhoto}
                containerCustomStyle={{flex: 1}}
                slideStyle={{flex: 1}}
              />
            </View>

            <View style={styles.smallImgWrap}>
              {photoList.map((photo, index) => (
                <TouchableWithoutFeedback onPress={() => handleChose(index)}>
                  <ImageBackground source={image} style={styles.bgSvg}>
                    <Image
                      style={[
                        styles.smallImg,
                        index === chosenPhoto && styles.smallChosen,
                      ]}
                      source={{
                        uri: photo.url,
                      }}
                    />
                  </ImageBackground>
                </TouchableWithoutFeedback>
              ))}
            </View>
          </>
        )}
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  gallery: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 20,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  bigImg: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
  },
  smallImgWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    flexWrap: 'wrap',
    marginBottom: 40,
  },
  smallImg: {
    borderWidth: 3,
    height: 70,
    width: 70,
    marginRight: 5,
    borderColor: 'transparent',
  },
  bgSvg: {
    marginRight: 5,
    height: 70,
    width: 70,
    position: 'relative',
    zIndex: 1,
    marginTop: 10,
  },
  smallChosen: {
    borderWidth: 3,
    borderColor: '#137CDF',
  },
  closeBtn: {
    marginVertical: 15,
    marginRight: 10,
    alignSelf: 'flex-end',
  },

  container: {
    flex: 1,
    maxHeight: Dimensions.get('window').height - 300,
  },
  item: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: 'white',
    borderRadius: 8,
  },
});

export default Gallery;
