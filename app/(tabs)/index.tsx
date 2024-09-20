import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, FlatList, Alert, StyleSheet } from 'react-native';
import * as Contacts from 'expo-contacts';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface Contact {
  id: string;
  name: string;
  phoneNumbers?: Contacts.PhoneNumber[];
  emails?: Contacts.Email[];
  image?: string;
}

type RootStackParamList = {
  AddContact: undefined;
  EditContact: { contact: Contact };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddContact'>;

export default function HomeScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [hasSynced, setHasSynced] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const syncContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync();
      const contactList: Contact[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        phoneNumbers: item.phoneNumbers,
        emails: item.emails,
      }));
      setContacts(contactList);
      setHasSynced(true);
    } else {
      Alert.alert('Permission Denied', 'Please enable contact permissions to sync contacts.');
    }
  };

  const handleAddContact = () => {
    navigation.navigate('AddContact');
  };

  if (!hasSynced) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your contact list is empty.</Text>
        <Text style={styles.infoText}>Start syncing your contacts now.</Text>
        <TouchableOpacity style={styles.syncButton} onPress={syncContacts}>
          <Text style={styles.buttonText}>Sync Contacts</Text>
        </TouchableOpacity>
        <Button title="Add Manually" color="orange" onPress={handleAddContact} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('EditContact', { contact: item })}>
            <Text style={styles.contactItem}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No contacts found.</Text>}
      />
      <Button title="Add Contact" color="orange" onPress={handleAddContact} />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'orange',
  },
  syncButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 12,
    marginBottom: 20,
    color: 'gray',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  contactItem: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
