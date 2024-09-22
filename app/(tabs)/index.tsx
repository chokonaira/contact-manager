import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import FormModal from '@/components/FormModal';
import { useContacts, Contact } from '@/hooks/useContacts';
import ContactList from '@/components/ContactList';
import EmptyList from '@/components/EmptyList';
import MenuModal from '@/components/MenuModal';

export default function HomeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const {
    contacts,
    filteredContacts,
    searchQuery,
    isLoadingContacts,
    flatListRef,
    filterContacts,
    addContact,
    editContact,
    handleDeleteContact,
    scrollToContact,
    highlightedContactId,
    syncContacts,
    deleteAllContacts,
  } = useContacts();

  const handleAddContact = (contact: Contact) => {
    const index = addContact(contact);
    if (index !== -1) {
      setIsModalVisible(false);
      scrollToContact(index);
    } else {
      Alert.alert('Duplicate Contact', 'A contact with this phone number already exists.');
    }
  };

  const handleEditContactSubmit = (contact: Contact) => {
    const index = editContact(contact);
    if (index !== -1) {
      setIsModalVisible(false);
      scrollToContact(index);
    } else {
      Alert.alert('Duplicate Contact', 'A contact with this phone number already exists.');
    }
  };

  const onDeleteContact = (contactId: string) => {
    handleDeleteContact(contactId);
    setIsModalVisible(false);
  };

  const handleSyncContacts = async () => {
    setIsMenuVisible(false);
    await syncContacts();
    setTimeout(() => {
      Alert.alert('Sync Completed', 'Contacts synced successfully');
    }, 500);
  };

  const handleDeleteAllContacts = () => {
    Alert.alert('Delete All Contacts', 'Are you sure you want to delete all contacts?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteAllContacts();
          Alert.alert('Contacts Deleted', 'All contacts have been deleted.');
        },
      },
    ]);
  };

  const handleSearchChange = (query: string) => {
    filterContacts(query);
  };

  const handleCancelSearch = () => {
    filterContacts('');
  };

  if (isLoadingContacts) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ActivityIndicator
          size="large"
          color="#40BF56"
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          testID="loading-indicator"
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
          testID="menu-icon"
        />
        <Text testID="header-title" style={styles.headerTitle}>
        {contacts.length > 0 ? `${contacts.length} Contact${contacts.length === 1 ? '' : 's'}` : 'No Contacts'}
        </Text>
        <MaterialIcons
          name="add"
          size={32}
          color="gray"
          onPress={() => {
            setSelectedContact(undefined);
            setIsModalVisible(true);
          }}
          style={styles.headerIcon}
          testID="add-icon"
        />
      </View>

      {contacts.length > 0 && (
        <View style={styles.searchContainer} testID="search-container">
          <TextInput
            placeholder="Search Contacts"
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={handleSearchChange}
            style={styles.searchInput}
            editable={contacts.length > 0}
            testID="search-input"
          />
          <TouchableOpacity
            style={styles.cancelSearchButton}
            onPress={handleCancelSearch}
            disabled={!searchQuery}
            testID="cancel-search-button"
          >
            <Text style={styles.cancelSearchText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <ContactList
        contacts={filteredContacts}
        onPress={(contact) => {
          setSelectedContact(contact);
          setIsModalVisible(true);
        }}
        highlightedContactId={highlightedContactId}
        ref={flatListRef}
        ListEmptyComponent={
          <EmptyList
            onSyncContacts={handleSyncContacts}
            onAddContact={() => {
              setSelectedContact(undefined);
              setIsModalVisible(true);
            }}
          />
        }
        contentContainerStyle={
          filteredContacts.length === 0 ? styles.emptyContent : styles.listContent
        }
        testID="contact-list"
      />

      <MenuModal
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onSyncContacts={handleSyncContacts}
        onDeleteAllContacts={handleDeleteAllContacts}
        hasContacts={contacts.length > 0}
        testID="menu-modal"
      />

      <FormModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={selectedContact ? handleEditContactSubmit : handleAddContact}
        contact={selectedContact}
        isEditing={!!selectedContact}
        onDelete={() => selectedContact && onDeleteContact(selectedContact.id)}
        testID="form-modal"
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
    fontSize: 16,
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
  listContent: {
    paddingTop: 10,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
