import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import ContactFormModal from '@/components/ContactFormModal';
import { debounce } from 'lodash';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photo?: string;
}

export default function HomeScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [highlightedContactId, setHighlightedContactId] = useState<string | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const flatListRef = useRef<FlatList<Contact>>(null);

  useEffect(() => {
    loadContactsFromStorage();
  }, []);

  const loadContactsFromStorage = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem('contacts');
      if (storedContacts) {
        const parsedContacts = JSON.parse(storedContacts);
        const sortedContacts = parsedContacts.sort((a: Contact, b: Contact) =>
          a.name.localeCompare(b.name)
        );
        setContacts(sortedContacts);
        setFilteredContacts(sortedContacts);
      }
    } catch (error) {
      console.error('Failed to load contacts from storage', error);
    } finally {
      setIsLoadingContacts(false);
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
    setFilteredContacts(sortedContacts);
    saveContactsToStorage(sortedContacts);
    setIsModalVisible(false);

    scrollToContact(contact.id);
  };

  const handleEditContactSubmit = (contact: Contact) => {
    const updatedContacts = contacts.map((c) => (c.id === contact.id ? contact : c));
    const sortedContacts = updatedContacts.sort((a, b) => a.name.localeCompare(b.name));
    setContacts(sortedContacts);
    setFilteredContacts(sortedContacts);
    saveContactsToStorage(sortedContacts);
    setIsModalVisible(false);

    scrollToContact(contact.id);
  };

  const handleDeleteContact = (contactId: string) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== contactId);
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
    saveContactsToStorage(updatedContacts);
    setIsModalVisible(false);
  };

  const syncContacts = async () => {
    setIsMenuVisible(false);
    try {
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
          const mergedContacts = [...contacts, ...newContacts];
          const uniqueContacts = Array.from(
            new Map(mergedContacts.map((item) => [item.id, item])).values()
          );
          const sortedContacts = uniqueContacts.sort((a, b) => a.name.localeCompare(b.name));
          setContacts(sortedContacts);
          setFilteredContacts(sortedContacts);
          saveContactsToStorage(sortedContacts);
        }
      }
    } catch (error) {
      console.error('Failed to sync contacts', error);
    } finally {
      setTimeout(() => {
        Alert.alert('Sync Completed', 'Contacts synced successfully');
      }, 500);
    }
  };

  const scrollToContact = (contactId: string) => {
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index !== -1) {
      setHighlightedContactId(contactId);
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setTimeout(() => {
        setHighlightedContactId(null);
      }, 2000);
    }
  };

  const deleteAllContacts = () => {
    Alert.alert(
      'Delete All Contacts',
      'Are you sure you want to delete all contacts?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('contacts');
            setContacts([]);
            setFilteredContacts([]);
            Alert.alert('Contacts Deleted', 'All contacts have been deleted.');
          },
        },
      ]
    );
  };

  const searchContacts = debounce((query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredContacts(filtered);
  }, 300);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    searchContacts(query);
  };

  const handleCancelSearch = () => {
    setSearchQuery('');
    setFilteredContacts(contacts);
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <View
      style={[
        styles.contactContainer,
        highlightedContactId === item.id ? styles.highlightedContact : {},
      ]}
    >
      <TouchableOpacity
        style={styles.contactContent}
        onPress={() => {
          setSelectedContact(item);
          setIsModalVisible(true);
        }}
      >
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.contactImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.initialsText}>{item.name ? item.name.charAt(0) : ''}</Text>
          </View>
        )}
        <View style={styles.contactInfo}>
          {item.name && <Text style={styles.contactName}>{item.name}</Text>}
          {item.phone && <Text style={styles.contactDetails}>{item.phone}</Text>}
          {item.email && <Text style={styles.contactDetails}>{item.email}</Text>}
        </View>
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

  if (isLoadingContacts) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ActivityIndicator
          size="large"
          color="#40BF56"
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <Ionicons
          name="ellipsis-horizontal"
          size={32}
          color="gray"
          onPress={() => setIsMenuVisible(true)}
          style={styles.headerIcon}
        />
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

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Contacts"
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={styles.searchInput}
          editable={contacts.length > 0}
        />
        <TouchableOpacity
          style={styles.cancelSearchButton}
          onPress={handleCancelSearch}
          disabled={!searchQuery}
        >
          <Text style={styles.cancelSearchText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        contentContainerStyle={filteredContacts.length === 0 ? styles.emptyContent : styles.listContent}
        ListEmptyComponent={renderEmptyList}
        ref={flatListRef}
      />

      <Modal visible={isMenuVisible} transparent animationType="slide">
        <View style={styles.menuContainer}>
          <View style={styles.menuContent}>
            <TouchableOpacity style={styles.menuItem} onPress={syncContacts}>
              <Text style={styles.menuText}>Sync Contacts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, { opacity: contacts.length > 0 ? 1 : 0.5 }]}
              onPress={contacts.length > 0 ? deleteAllContacts : undefined}
              disabled={contacts.length === 0}
            >
              <Text style={styles.menuText}>Delete All Contacts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setIsMenuVisible(false)}>
              <Text style={styles.menuText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ContactFormModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={selectedContact ? handleEditContactSubmit : handleAddContact}
        contact={selectedContact}
        isEditing={!!selectedContact}
        onDelete={handleDeleteContact}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  cancelSearchButton: {
    marginLeft: 10,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  cancelSearchText: {
    color: 'gray',
  },
  contactContainer: {
    flexDirection: 'row',
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
  listContent: {
    paddingTop: 10,
  },
  highlightedContact: {
    backgroundColor: '#e0e0e0',
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
  menuContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  menuText: {
    fontSize: 16,
    color: 'black',
  },
});
