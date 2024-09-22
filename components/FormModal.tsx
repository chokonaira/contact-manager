import React, { useEffect } from 'react';
import { View, Modal, Image, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ActionSheetIOS, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from './Input';
import Button from './Button';
import { useFormValidation, Contact } from '@/hooks/useFormValidation';
import { useImagePicker } from '@/hooks/useImagePicker';

interface ContactFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (contact: Contact) => void;
  contact?: Contact | null;
  isEditing?: boolean;
  onDelete?: (contactId: string) => void;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  contact,
  isEditing = false,
  onDelete,
}) => {
  const {
    name,
    phone,
    email,
    nameError,
    emailError,
    isLoading,
    handleNameChange,
    handlePhoneChange,
    handleEmailChange,
    handleSubmit,
    resetForm,
  } = useFormValidation(contact, isEditing);

  const {
    photo,
    pickImageFromLibrary,
    takePhotoWithCamera,
    resetImage,
    setInitialPhoto
  } = useImagePicker(contact?.photo || null);

  useEffect(() => {
    if (!isEditing && isVisible) {
      resetForm();
      setInitialPhoto(null); 
    } else if (isEditing && contact) {
      setInitialPhoto(contact.photo || null);
    }
  }, [isEditing, isVisible, contact]);
  

  const handleDelete = () => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (contact && contact.id && onDelete) {
              onDelete(contact.id);
              resetForm();
              onClose();
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSaveContact = () => {
    handleSubmit((savedContact: Contact) => {
      onSubmit({
        ...savedContact,
        photo,
      });
      resetForm();
    }, onClose);
  };

  const showImagePickerOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            takePhotoWithCamera();
          } else if (buttonIndex === 2) {
            pickImageFromLibrary();
          }
        }
      );
    } else {
      Alert.alert(
        'Select Option',
        'Choose a photo option:',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Take Photo',
            onPress: takePhotoWithCamera,
          },
          {
            text: 'Choose from Library',
            onPress: pickImageFromLibrary,
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {isEditing && (
              <TouchableOpacity testID="delete-icon-top-left" onPress={handleDelete} style={styles.deleteIconTopLeft}>
                <Ionicons name="trash-outline" size={24} color="gray" />
              </TouchableOpacity>
            )}

            <TouchableOpacity testID="cancel-icon" onPress={onClose} style={styles.cancelIcon}>
              <Ionicons name="close-circle-outline" size={30} color="gray" />
            </TouchableOpacity>

            <View style={styles.imageContainer}>
              <TouchableOpacity testID="profile-image" onPress={showImagePickerOptions} style={styles.imageTouchable}>
                <Image
                  source={photo ? { uri: photo } : require('@/assets/images/defaultThumbnail.jpg')}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>

            {photo && (
              <TouchableOpacity onPress={resetImage} style={styles.deleteIcon}>
                <Ionicons name="trash-outline" size={18} color="gray" />
              </TouchableOpacity>
            )}

            <Input
              placeholder="Name"
              value={name}
              onChangeText={handleNameChange}
              autoCapitalize="words"
              errorMessage={nameError}
            />

            <Input
              placeholder="Phone"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
            />

            <Input
              placeholder="Email"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              errorMessage={emailError}
            />

            <Button
              onPress={handleSaveContact}
              title={isEditing ? 'Save' : 'Add'}
              isLoading={isLoading}
              style={styles.smallSubmitButton}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 20,
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    marginBottom: 40
  },
  cancelIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteIconTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
    width: 120,
    height: 120,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
  },
  deleteIcon: {
    marginBottom: 15,
    alignSelf: 'center',
  },
  smallSubmitButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#40BF56',
    width: '30%',
  },
  errorText: {
    width: '90%',
    color: 'red',
    fontSize: 8,
    textAlign: 'left',
  },
});

export default ContactFormModal;
