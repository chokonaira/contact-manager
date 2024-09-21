import { useState, useEffect, useRef } from "react";
import { FlatList } from "react-native"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

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
    const storedContacts = await AsyncStorage.getItem("contacts");
    return storedContacts ? JSON.parse(storedContacts) : [];
  };

  const saveContactsToStorage = async (contacts: Contact[]) => {
    await AsyncStorage.setItem("contacts", JSON.stringify(contacts));
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
    const updatedContacts = [
      ...contacts,
      { ...contact, id: Date.now().toString() },
    ];
    const sortedContacts = updatedContacts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setContacts(sortedContacts);
    setFilteredContacts(sortedContacts);
    saveContactsToStorage(sortedContacts);

    return sortedContacts.findIndex(c => c.id === contact.id);
  };

  return {
    contacts,
    filteredContacts,
    searchQuery,
    isLoadingContacts,
    flatListRef,
    filterContacts,
    addContact,
    setFilteredContacts,
  };
};
