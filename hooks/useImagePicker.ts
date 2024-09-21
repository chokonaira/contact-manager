import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const useImagePicker = (initialPhoto: string | null = null) => {
  const [photo, setPhoto] = useState<string | null>(initialPhoto);

  const setInitialPhoto = (initialPhoto: string | null) => {
    setPhoto(initialPhoto);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const resetImage = () => {
    setPhoto(null);
  };

  return {
    photo,
    pickImage,
    resetImage,
    setInitialPhoto,
  };
};
