import React, {useState} from 'react';
import GalleryForItem from '../../../components/Gallery/GalleryForItem';
import {CreateItemContainer} from '../CreateItemContainer';

const AddPhoto = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [chosenPhoto, setChosenPhoto] = useState(0);
  const [photoDel, setPhotoDel] = useState('');
  return (
    <CreateItemContainer>
      <GalleryForItem
        setChosenPhoto={setChosenPhoto}
        setIsGalleryOpen={setIsGalleryOpen}
        setPhotoDel={setPhotoDel}
        page="CreateItem"
      />
    </CreateItemContainer>
  );
};
export default AddPhoto;
