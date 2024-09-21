import * as Contacts from "expo-contacts";
import { Contact } from "./useContacts";

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
            photo: contact.imageAvailable ? contact.thumbnailPath : undefined,
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
