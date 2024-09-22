import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface EmptyListProps {
  onSyncContacts: () => void;
  onAddContact: () => void;
}

const EmptyList: React.FC<EmptyListProps> = ({ onSyncContacts, onAddContact }) => (
  <View style={styles.emptyContainer}>
    <Text testID="empty-text" style={styles.emptyText}>No contacts found.</Text>
    <Text testID="info-text" style={styles.infoText}>Sync your mobile contacts or add manually.</Text>
    <View style={styles.actionButtons}>
      <TouchableOpacity testID="sync-button" style={styles.syncButton} onPress={onSyncContacts}>
        <Ionicons name="sync" size={24} color="white" />
        <Text testID="sync-button-text" style={styles.syncButtonText}>Sync Contacts</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="add-button" style={styles.addButton} onPress={onAddContact}>
        <MaterialIcons name="add" size={24} color="white" />
        <Text testID="add-button-text" style={styles.addButtonText}>Add Manually</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  syncButton: {
    backgroundColor: '#40BF56',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default EmptyList;
