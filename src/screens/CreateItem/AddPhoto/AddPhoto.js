import React, {useState} from 'react';
import GalleryForItem from '../../../components/Gallery/GalleryForItem';

export const AddPhoto = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [chosenPhoto, setChosenPhoto] = useState(0);
  const [photoDel, setPhotoDel] = useState('');
  return (
    <GalleryForItem
      setChosenPhoto={setChosenPhoto}
      setIsGalleryOpen={setIsGalleryOpen}
      setPhotoDel={setPhotoDel}
      page="AddPhoto"
    />
  );
};
