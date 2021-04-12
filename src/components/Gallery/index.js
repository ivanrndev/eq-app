import {Dialog, IconButton, Portal} from 'react-native-paper';
import {isEmpty} from 'lodash';
import {Image, View, StyleSheet, Dimensions} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import React from 'react';

const Gallery = ({
  bigPhoto,
  photoList,
  isPortalOpen,
  handlePortalClose,
  handleChoosePhoto,
}) => {
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
            <Image
              style={styles.bigImg}
              source={{
                uri: bigPhoto.url,
              }}
            />
            <View style={styles.smallImgWrap}>
              {photoList.map(photo => (
                <TouchableWithoutFeedback
                  onPress={() => handleChoosePhoto(photo.name)}>
                  <Image
                    style={
                      photo.name === bigPhoto.name
                        ? styles.smallChosen
                        : styles.smallImg
                    }
                    source={{
                      uri: photo.url,
                    }}
                  />
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
    width: Dimensions.get('window').width / 1.1,
    height: Dimensions.get('window').height - 270,
    borderWidth: 3,
    borderColor: '#137CDF',
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
});

export default Gallery;
