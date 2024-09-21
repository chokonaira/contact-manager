import React, { useState } from 'react';
import { SafeAreaView, ActivityIndicator, Alert, Modal } from 'react-native';
import { ContactList } from '@/components/ContactList';
import { SearchInput } from '@/components/SearchInput';
import { useContacts, useSyncContacts, Contact } from '@/hooks/useContacts';
import FormModal from '@/components/FormModal';
import ActionButtons from '@/components/ActionButtons';

export default function HomeScreen() {
  const { contacts, filteredContacts, searchQuery, isLoadingContacts, flatListRef, filterContacts, addContact, setFilteredContacts } = useContacts();
  const { syncContacts } = useSyncContacts(setFilteredContacts);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleCancelSearch = () => {
    filterContacts('');
    setIsSearchFocused(false);
  };

  const handlePressContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalVisible(true);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsModalVisible(true);
  };

  const handleSyncContacts = async () => {
    await syncContacts();
    Alert.alert('Sync Completed', 'Contacts synced successfully');
  };

  const handleSaveContact = (contact: Contact) => {
    addContact(contact);
    setIsModalVisible(false);
  };

  if (isLoadingContacts) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#40BF56" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchInput
        searchQuery={searchQuery}
        onSearchChange={filterContacts}
        onCancelSearch={handleCancelSearch}
        isSearchFocused={isSearchFocused}
        contactsAvailable={contacts.length > 0}
      />

      <ContactList
        contacts={filteredContacts}
        highlightedContactId={null}
        onPress={handlePressContact}
      />

      <ActionButtons onAddContact={handleAddContact} onSyncContacts={handleSyncContacts} />

      <FormModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleSaveContact}
        contact={selectedContact}
        isEditing={!!selectedContact}
      />
    </SafeAreaView>
  );
}
