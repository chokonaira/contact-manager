import React, { forwardRef } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatListProps,
} from 'react-native';
import { Contact } from '@/hooks/useContacts';

interface ContactListProps extends Partial<FlatListProps<Contact>> {
  contacts: Contact[];
  onPress: (contact: Contact) => void;
  highlightedContactId?: string | null;
}

const ContactList = forwardRef<FlatList<Contact>, ContactListProps>(
  ({ contacts, onPress, highlightedContactId, ...flatListProps }, ref) => {
    const renderContactItem = ({ item }: { item: Contact }) => (
      <View
        style={[
          styles.contactContainer,
          highlightedContactId === item.id ? styles.highlightedContact : {},
        ]}
      >
        <TouchableOpacity onPress={() => onPress(item)} style={styles.contactContent}>
          {item.photo ? (
            <Image source={{ uri: item.photo }} style={styles.contactImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.initials}>{item.name.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{item.name}</Text>
            {item.phone && <Text style={styles.contactPhone}>{item.phone}</Text>}
            {item.email && <Text style={styles.contactEmail}>{item.email}</Text>}
          </View>
        </TouchableOpacity>
      </View>
    );

    return (
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        ref={ref}
        {...flatListProps}
      />
    );
  }
);

const styles = StyleSheet.create({
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  highlightedContact: {
    backgroundColor: '#e0e0e0',
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  initials: {
    fontSize: 20,
    color: '#fff',
  },
  contactInfo: {
    marginLeft: 10,
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 14,
    color: 'gray',
  },
  contactEmail: {
    fontSize: 14,
    color: 'gray',
  },
});

export default ContactList;
