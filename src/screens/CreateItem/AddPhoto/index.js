import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import GalleryForItem from '../../../components/Gallery/GalleryForItem';
import {CreateItemContainer} from '../CreateItemContainer';
import Gallery from '../../../components/Gallery';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import T from '../../../i18n';
import {width} from '../../../constants/dimentionsAndUnits';

const AddPhoto = () => {
  const navigation = useNavigation();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [chosenPhoto, setChosenPhoto] = useState(0);
  const [photoDel, setPhotoDel] = useState('');

  const [photos] = useSelector(({createItem}) => [createItem.photos]);
  return (
    <>
      <CreateItemContainer handleSave={() => navigation.navigate('CreateItem')}>
        <Text style={styles.title}>{T.t('add_photo_to_new_item')}</Text>
        <GalleryForItem
          setChosenPhoto={setChosenPhoto}
          setIsGalleryOpen={setIsGalleryOpen}
          setPhotoDel={setPhotoDel}
          page="CreateItem"
        />
      </CreateItemContainer>
      <Gallery
        photoList={photos}
        chosenPhoto={chosenPhoto}
        handlePortalClose={() => setIsGalleryOpen(false)}
        isPortalOpen={isGalleryOpen}
        setChosenPhoto={setChosenPhoto}
        setPhotoDel={setPhotoDel}
        photoDel={photoDel}
      />
    </>
  );
};
export default AddPhoto;

const styles = StyleSheet.create({
  title: {
    width: width,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 30,
  },
});
