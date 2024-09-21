import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Input from './Input';
import Button from './Button';

interface Contact {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  photo?: string;
}

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
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [photo, setPhoto] = useState<string | null>(null);

  const [nameError, setNameError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isEditing && contact) {
      setName(contact.name);
      setPhone(contact.phone);
      setEmail(contact.email || '');
      setPhoto(contact.photo || null);
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setPhoto(null);
      setNameError('');
      setPhoneError('');
      setEmailError('');
    }
  }, [isVisible, contact, isEditing]);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (!text.trim()) {
      setNameError('Name is required');
    } else {
      setNameError('');
    }
  };

  const handlePhoneChange = (text: string) => {
    const cleanedPhone = text.replace(/[^0-9]/g, '');
    setPhone(cleanedPhone);
    if (!cleanedPhone.trim()) {
      setPhoneError('Phone number is required');
    } else {
      setPhoneError('');
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
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

  const handleResetImage = () => {
    setPhoto(null);
  };

  const handleSubmit = () => {
    if (!name || !phone) {
      Alert.alert('Validation Error', 'Name and phone number are required.');
      return;
    }

    if (email && !validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onSubmit({ id: contact?.id, name, phone, email, photo });
      setIsLoading(false);
      onClose();
    }, 800);
  };

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

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {isEditing && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteIconTopLeft}>
              <Ionicons name="trash-outline" size={30} color="gray" />
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
            <TouchableOpacity onPress={handleResetImage} style={styles.deleteIcon}>
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
            onPress={handleSubmit}
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
