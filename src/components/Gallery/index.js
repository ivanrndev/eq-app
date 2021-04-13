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
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';

const {width: screenWidth} = Dimensions.get('window');
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
  const renderItem = ({item, index}, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={{uri: item.illustration}}
          containerStyle={styles.imageContainer}
          style={styles.bigImg}
          parallaxFactor={0.4}
          {...parallaxProps}
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
                sliderWidth={screenWidth}
                sliderHeight={screenWidth}
                itemWidth={screenWidth - 60}
                data={entries}
                renderItem={renderItem}
                hasParallaxImages={true}
                onSnapToItem={slideIndex => setChosenPhoto(slideIndex)}
                firstItem={chosenPhoto}
              />
            </View>

            <View style={styles.smallImgWrap}>
              {photoList.map((photo, index) => (
                <TouchableWithoutFeedback onPress={() => handleChose(index)}>
                  <ImageBackground source={image} style={styles.bgSvg}>
                    <Image
                      style={
                        index === chosenPhoto
                          ? styles.smallChosen
                          : styles.smallImg
                      }
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
    resizeMode: 'cover',
  },
  smallImgWrap: {
    flexDirection: 'row',
    paddingVertical: 10,
    flexWrap: 'wrap',
  },
  smallImg: {
    borderWidth: 3,
    height: 70,
    width: 70,
    marginRight: 5,
    borderColor: 'transparent',
  },
  smallChosen: {
    height: 70,
    width: 70,
    marginRight: 5,
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
    width: Dimensions.get('window').width - 60,
    height: Dimensions.get('window').height - 350,
  },
  imageContainer: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  bgSvg: {
    marginRight: 5,
    height: 70,
    width: 70,
    position: 'relative',
    zIndex: 1,
  },
});

export default Gallery;
