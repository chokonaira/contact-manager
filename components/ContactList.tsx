import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Contact } from '@/hooks/useContacts';

interface ContactListProps {
  contacts: Contact[];
  highlightedContactId: string | null;
  onPress: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, highlightedContactId, onPress }) => {
  const renderContactItem = ({ item }: { item: Contact }) => (
    <View
      style={[
        styles.contactContainer,
        highlightedContactId === item.id ? styles.highlightedContact : {},
      ]}
    >
      <TouchableOpacity style={styles.contactContent} onPress={() => onPress(item)}>
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.contactImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.initialsText}>{item.name.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactDetails}>{item.phone}</Text>
          {item.email && <Text style={styles.contactDetails}>{item.email}</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={contacts}
      keyExtractor={item => item.id}
      renderItem={renderContactItem}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
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
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  highlightedContact: {
    backgroundColor: '#e0e0e0',
  },
});

export default ContactList;