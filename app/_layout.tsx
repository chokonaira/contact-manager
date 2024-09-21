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

export default function Layout() {
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
        <Text style={styles.headerTitle}>
          {contacts.length > 0 ? `${contacts.length} Contacts` : 'Contacts'}
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
        />
      </View>

      {contacts.length > 0 && (
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
      />

      <MenuModal
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onSyncContacts={handleSyncContacts}
        onDeleteAllContacts={handleDeleteAllContacts}
        hasContacts={contacts.length > 0}
      />

      <FormModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={selectedContact ? handleEditContactSubmit : handleAddContact}
        contact={selectedContact}
        isEditing={!!selectedContact}
        onDelete={() => selectedContact && onDeleteContact(selectedContact.id)}
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
