import React from 'react';
import { View, FlatList, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Contact } from '@/hooks/useContacts';

interface ContactListProps {
  contacts: Contact[];
  onPress: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onPress }) => {
  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.contactItem}>
      {item.photo ? (
        <Image source={{ uri: item.photo }} style={styles.contactImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.initials}>{item.name.charAt(0)}</Text>
        </View>
      )}
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={renderContactItem}
    />
  );
};

const styles = StyleSheet.create({
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
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
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 20,
    color: '#fff',
  },
  contactInfo: {
    marginLeft: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactPhone: {
    color: '#888',
  },
});

export default ContactList;
