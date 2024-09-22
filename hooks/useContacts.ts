import { useState, useEffect, useRef } from "react";
import { FlatList, Platform, Linking, Alert } from "react-native";
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
  const [highlightedContactId, setHighlightedContactId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<Contact>>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  /**
   * Loads contacts from AsyncStorage on mount, sorts them by name, and sets them in state.
   * This function is triggered when the hook is first loaded and ensures that contacts are 
   * retrieved and displayed.
   */
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

  /**
   * Retrieves contacts from AsyncStorage.
   * If no contacts are found, returns an empty array.
   */
  const loadContactsFromStorage = async () => {
    const storedContacts = await AsyncStorage.getItem("contacts");
    return storedContacts ? JSON.parse(storedContacts) : [];
  };

  /**
   * Persists the provided contacts to AsyncStorage.
   * This ensures that any changes to the contact list are saved.
   */
  const saveContactsToStorage = async (contacts: Contact[]) => {
    await AsyncStorage.setItem("contacts", JSON.stringify(contacts));
  };

  /**
   * Filters the list of contacts based on a search query, matching by name, phone, or email.
   * If no query is provided, resets the filtered list to the original contact list.
   */
  const filterContacts = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const normalizedQuery = query.replace(/\D/g, "");

      const filtered = contacts.filter((contact) => {
        const nameMatch = contact.name.toLowerCase().includes(lowercasedQuery);

        let phoneMatch = false;
        if (normalizedQuery.length > 0) {
          const normalizedPhone = contact.phone.replace(/\D/g, "");
          phoneMatch = normalizedPhone.includes(normalizedQuery);
        }

        let emailMatch = false;
        if (contact.email) {
          emailMatch = contact.email.toLowerCase().includes(lowercasedQuery);
        }

        return nameMatch || phoneMatch || emailMatch;
      });
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  };

  /**
   * Adds a new contact to the contact list if it doesn't already exist.
   * Sorts the contact list by name after adding the contact and persists the list to storage.
   * Returns the index of the new contact in the sorted list.
   */
  const addContact = (contact: Contact) => {
    const duplicate = contacts.find((c) => c.phone === contact.phone);
    if (duplicate) {
      return -1;
    }

    const newContact = { ...contact, id: Date.now().toString() };
    const updatedContacts = [...contacts, newContact];
    const sortedContacts = updatedContacts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setContacts(sortedContacts);
    setFilteredContacts(sortedContacts);

    saveContactsToStorage(sortedContacts);

    return sortedContacts.findIndex((c) => c.id === newContact.id);
  };

  /**
   * Edits an existing contact in the contact list.
   * Updates the contact with new data, re-sorts the list by name, and persists the list to storage.
   * If the phone number already exists for another contact, returns -1 to indicate a duplicate.
   */
  const editContact = (contact: Contact) => {
    const duplicate = contacts.find(
      (c) => c.phone === contact.phone && c.id !== contact.id
    );
    if (duplicate) {
      return -1;
    }

    const updatedContacts = contacts.map((c) =>
      c.id === contact.id ? contact : c
    );
    const sortedContacts = updatedContacts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setContacts(sortedContacts);
    setFilteredContacts(sortedContacts);
    saveContactsToStorage(sortedContacts);

    const index = sortedContacts.findIndex((c) => c.id === contact.id);
    return index;
  };

  /**
   * Deletes a contact from the contact list based on the provided contact ID.
   * Updates the contact list in state and persists the updated list to storage.
   */
  const handleDeleteContact = (contactId: string) => {
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
    saveContactsToStorage(updatedContacts);
  };

  /**
   * Scrolls to a specific contact in the list by its index and highlights it temporarily.
   */
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

  /**
   * Opens the app settings for the user to manage permissions if necessary.
   * Handles both iOS and Android.
   */
  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  /**
   * Syncs contacts from the phone's contact list if permissions are granted.
   * Requests permissions if not already granted, and retrieves contacts with phone numbers.
   * Merges phone contacts with existing contacts, deduplicates them, and persists the merged list.
   */
  const syncContacts = async () => {
    try {
      let { status } = await Contacts.getPermissionsAsync();

      if (status !== "granted") {
        const permissionResponse = await Contacts.requestPermissionsAsync();
        status = permissionResponse.status;
      }

      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const contactsWithPhoneNumbers = data.filter(
            (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
          );

          const newContacts = contactsWithPhoneNumbers.map((contact) => ({
            id: contact.id || Date.now().toString(),
            name: contact.name || "No Name",
            phone: contact.phoneNumbers?.[0]?.number || "No Phone",
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
          const sortedContacts = uniqueContacts.sort((a, b) =>
            a.name.localeCompare(b.name)
          );

          setContacts(sortedContacts);
          setFilteredContacts(sortedContacts);
          saveContactsToStorage(sortedContacts);
        } else {
          console.log("No contacts found");
        }
      } else {
        Alert.alert(
          "Permission Denied",
          "Permission to access contacts was denied. Please enable it in settings to sync contacts.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: openAppSettings },
          ]
        );
      }
    } catch (error) {
      console.error("Failed to sync contacts", error);
      Alert.alert("Sync Error", "There was an error syncing your contacts.");
    }
  };

  /**
   * Deletes all contacts from AsyncStorage and clears the contact list in state.
   */
  const deleteAllContacts = async () => {
    await AsyncStorage.removeItem("contacts");
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
