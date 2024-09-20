import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import ContactFormModal from '@/components/ContactFormModal';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photo?: string;
}

export default function HomeScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadContactsFromStorage();
  }, []);

  const loadContactsFromStorage = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem('contacts');
      if (storedContacts) {
        const parsedContacts = JSON.parse(storedContacts);
        const sortedContacts = parsedContacts.sort((a: Contact, b: Contact) => a.name.localeCompare(b.name));
        setContacts(sortedContacts);
      }
    } catch (error) {
      console.error('Failed to load contacts from storage', error);
    }
  };

  const saveContactsToStorage = async (contacts: Contact[]) => {
    try {
      await AsyncStorage.setItem('contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Failed to save contacts', error);
    }
  };

  const handleAddContact = (contact: Contact) => {
    const updatedContacts = [...contacts, { ...contact, id: Date.now().toString() }];
    const sortedContacts = updatedContacts.sort((a, b) => a.name.localeCompare(b.name));
    setContacts(sortedContacts);
    saveContactsToStorage(sortedContacts);
    setIsModalVisible(false);
  };

  const handleEditContactSubmit = (contact: Contact) => {
    const updatedContacts = contacts.map((c) => (c.id === contact.id ? contact : c));
    const sortedContacts = updatedContacts.sort((a, b) => a.name.localeCompare(b.name));
    setContacts(sortedContacts);
    saveContactsToStorage(sortedContacts);
    setIsModalVisible(false);
  };

  const handleDeleteContact = (contactId: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedContacts = contacts.filter((contact) => contact.id !== contactId);
            setContacts(updatedContacts);
            saveContactsToStorage(updatedContacts);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const syncContacts = async () => {
    try {
      setIsSyncing(true);
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const newContacts = data.map((contact) => ({
            id: contact.id,
            name: contact.name || 'No Name',
            phone: contact.phoneNumbers?.[0]?.number || 'No Phone',
            email: contact.emails?.[0]?.email,
          }));
          const sortedContacts = [...contacts, ...newContacts].sort((a, b) => a.name.localeCompare(b.name));
          setContacts(sortedContacts);
          saveContactsToStorage(sortedContacts);
        }
      }
    } catch (error) {
      console.error('Failed to sync contacts', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <View style={styles.contactContainer}>
      <TouchableOpacity
        style={styles.contactContent}
        onPress={() => {
          setSelectedContact(item);  // Set the selected contact for editing
          setIsModalVisible(true);   // Show the modal
        }}
      >
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.contactImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.initialsText}>{item.name.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactDetails}>{item.phone}</Text>
          {item.email && <Text style={styles.contactDetails}>{item.email}</Text>}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteContact(item.id)}>
        <MaterialIcons name="delete" size={24} color="gray" style={styles.deleteIcon} />
      </TouchableOpacity>
    </View>
  );
  

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No contacts found.</Text>
      <Text style={styles.infoText}>Sync your mobile contacts or add manually.</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.syncButton} onPress={syncContacts}>
          <Ionicons name="sync" size={24} color="white" />
          <Text style={styles.syncButtonText}>Sync Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <MaterialIcons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      {contacts.length > 0 && (
        <View style={styles.header}>
          {isSyncing ? (
            <ActivityIndicator size="small" color="#40BF56" style={styles.headerIcon} />
          ) : (
            <Ionicons
              name="sync"
              size={32}
              color="gray"
              onPress={syncContacts}
              style={styles.headerIcon}
            />
          )}
          <Text style={styles.headerTitle}>Contacts</Text>
          <MaterialIcons
            name="add"
            size={32}
            color="gray"
            onPress={() => {
              setSelectedContact(undefined);
              setIsModalVisible(true);
            }}
            style={styles.headerIcon}
          />
        </View>
      )}

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        contentContainerStyle={contacts.length === 0 ? styles.emptyContent : styles.listContent}
        ListEmptyComponent={renderEmptyList}
      />

      <ContactFormModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={selectedContact ? handleEditContactSubmit : handleAddContact}
        contact={selectedContact}
        isEditing={!!selectedContact}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcon: {
    paddingHorizontal: 10,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactDetails: {
    fontSize: 14,
    color: 'gray',
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 18,
    color: 'white',
  },
  deleteIcon: {
    marginLeft: 15,
  },
  listContent: {
    paddingTop: 10,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  syncButton: {
    backgroundColor: '#40BF56',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});
