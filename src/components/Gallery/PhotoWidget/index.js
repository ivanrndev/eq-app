import React from 'react';
import {View, Text, Image} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import TransparentButton from '../../Buttons/TransparentButton';

const PhotoWidget = () => {
  const [photos, setPhotos] = React.useState([]);
  const maxPhotoCount = 8;
  const maxChoosePhotoCount = maxPhotoCount - photos.length;
  const handleChoosePhoto = () => {
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: maxChoosePhotoCount,
    }).then(images => {
      setPhotos(images);
    });
  };

  return (
    <View>
      <Text> Photo hear</Text>
      <TransparentButton text="Photo" onPress={handleChoosePhoto} />
      {photos.length > 0
        ? photos.map(photo => (
            <Image
              style={{width: 200, height: 200}}
              source={{
                uri: photo.path,
              }}
            />
          ))
        : null}
    </View>
  );
};

export default PhotoWidget;
