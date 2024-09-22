import { useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const openAppSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

export const useImagePicker = (initialPhoto: string | null = null) => {
  const [photo, setPhoto] = useState<string | null>(initialPhoto);

  const setInitialPhoto = (initialPhoto: string | null) => {
    setPhoto(initialPhoto);
  };

  const requestPermissionIfDenied = async (permissionFunction: () => Promise<any>, permissionName: string) => {
    const { status } = await permissionFunction();
    
    if (status !== 'granted') {
      Alert.alert(
        `${permissionName} Permission Required`,
        `Please allow access to your ${permissionName.toLowerCase()} in your settings to use this feature.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openAppSettings },
        ]
      );
      return false;
    }
    return true;
  };

  const pickImageFromLibrary = async () => {
    const hasPermission = await requestPermissionIfDenied(
      ImagePicker.requestMediaLibraryPermissionsAsync,
      'Photo Library'
    );

    if (hasPermission) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    }
  };

  const takePhotoWithCamera = async () => {
    const hasPermission = await requestPermissionIfDenied(
      ImagePicker.requestCameraPermissionsAsync,
      'Camera'
    );

    if (hasPermission) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    }
  };

  const resetImage = () => {
    setPhoto(null);
  };

  return {
    photo,
    pickImageFromLibrary,
    takePhotoWithCamera,
    resetImage,
    setInitialPhoto,
  };
};
