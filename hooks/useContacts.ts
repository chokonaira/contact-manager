import { useState, useEffect, useRef } from 'react';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Contacts from 'expo-contacts';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photo?: string;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [highlightedContactId, setHighlightedContactId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<Contact>>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const storedContacts = await loadContactsFromStorage();
      const sortedContacts = storedContacts.sort((a: Contact, b: Contact) =>
        a.name.localeCompare(b.name)
      );
      setContacts(sortedContacts);
      setFilteredContacts(sortedContacts);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const loadContactsFromStorage = async () => {
    const storedContacts = await AsyncStorage.getItem('contacts');
    return storedContacts ? JSON.parse(storedContacts) : [];
  };

  const saveContactsToStorage = async (contacts: Contact[]) => {
    await AsyncStorage.setItem('contacts', JSON.stringify(contacts));
  };

  const filterContacts = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filtered = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  };

  const addContact = (contact: Contact) => {
    const duplicate = contacts.find((c) => c.phone === contact.phone);
    if (duplicate) {
      return -1; 
    }
  
    const newContact = { ...contact, id: Date.now().toString() };
    const updatedContacts = [...contacts, newContact];
    const sortedContacts = updatedContacts.sort((a, b) => a.name.localeCompare(b.name));
    
    setContacts(sortedContacts); 
    setFilteredContacts(sortedContacts);
    
    saveContactsToStorage(sortedContacts); 
    
    return sortedContacts.findIndex((c) => c.id === newContact.id);
  };  

  const editContact = (contact: Contact) => {
    const duplicate = contacts.find((c) => c.phone === contact.phone && c.id !== contact.id);
    if (duplicate) {
      return -1;
    }

    const updatedContacts = contacts.map((c) => (c.id === contact.id ? contact : c));
    const sortedContacts = updatedContacts.sort((a, b) => a.name.localeCompare(b.name));
    setContacts(sortedContacts);
    setFilteredContacts(sortedContacts);
    saveContactsToStorage(sortedContacts);

    const index = sortedContacts.findIndex((c) => c.id === contact.id);
    return index;
  };

  const handleDeleteContact = (contactId: string) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== contactId);
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
    saveContactsToStorage(updatedContacts);
  };

  const scrollToContact = (index: number) => {
    if (index !== -1) {
      const contactId = filteredContacts[index]?.id;
      setHighlightedContactId(contactId);
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setTimeout(() => {
        setHighlightedContactId(null);
      }, 2000);
    }
  };

  const syncContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        });
  
        if (data.length > 0) {
          const contactsWithPhoneNumbers = data.filter(
            (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
          );
  
          const newContacts = contactsWithPhoneNumbers.map((contact) => ({
            id: contact.id || Date.now().toString(),
            name: contact.name || 'No Name',
            phone: contact.phoneNumbers?.[0]?.number || 'No Phone',
            email: contact.emails?.[0]?.email,
            photo: contact.imageAvailable ? contact.image?.uri : undefined, 
          }));
  
          const mergedContacts = [...contacts, ...newContacts];
  
          const uniqueContactsMap = new Map<string, Contact>();
          mergedContacts.forEach((contact) => {
            if (contact.phone) {
              uniqueContactsMap.set(contact.phone, contact);
            }
          });
          const uniqueContacts = Array.from(uniqueContactsMap.values());
  
          const sortedContacts = uniqueContacts.sort((a, b) => a.name.localeCompare(b.name));
          setContacts(sortedContacts);
          setFilteredContacts(sortedContacts);
          saveContactsToStorage(sortedContacts);
        }
      }
    } catch (error) {
      console.error('Failed to sync contacts', error);
    }
  };  

  const deleteAllContacts = async () => {
    await AsyncStorage.removeItem('contacts');
    setContacts([]);
    setFilteredContacts([]);
  };

  return {
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
  };
};
