import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Contacts from "expo-contacts";

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

  const flatListRef = useRef(null);

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

export const useSyncContacts = (setContacts: (contacts: Contact[]) => void) => {
  const syncContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const contactsWithPhoneNumbers = data.filter(
            (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
          );

          const newContacts = contactsWithPhoneNumbers.map((contact) => ({
            id: contact.id,
            name: contact.name || "No Name",
            phone: contact.phoneNumbers?.[0]?.number || "No Phone",
            email: contact.emails?.[0]?.email,
          }));

          const uniqueContacts = Array.from(
            new Map(newContacts.map((item) => [item.id, item])).values()
          );

          setContacts((prevContacts) => {
            const mergedContacts = [...prevContacts, ...uniqueContacts];
            return mergedContacts.sort((a, b) => a.name.localeCompare(b.name));
          });
        }
      }
    } catch (error) {
      console.error("Failed to sync contacts", error);
    }
  };

  return { syncContacts };
};
