import React, { useEffect } from 'react';
import { View, Modal, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
    phoneError,
    emailError,
    isLoading,
    handleNameChange,
    handlePhoneChange,
    handleEmailChange,
    handleSubmit,
  } = useFormValidation(contact, isEditing);

  const { photo, pickImage, resetImage, setInitialPhoto } = useImagePicker(contact?.photo || null);

  useEffect(() => {
    setInitialPhoto(contact?.photo || null);
  }, [contact]);

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
    }, onClose); 
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {isEditing && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteIconTopLeft}>
              <Ionicons name="trash-outline" size={25} color="gray" />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onClose} style={styles.cancelIcon}>
            <Ionicons name="close-circle-outline" size={30} color="gray" />
          </TouchableOpacity>

          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.imageTouchable}>
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
            errorMessage={phoneError}
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
