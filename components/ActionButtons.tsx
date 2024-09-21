import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface ActionButtonsProps {
  onAddContact: () => void;
  onSyncContacts: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAddContact, onSyncContacts }) => (
  <View style={styles.actionButtons}>
    <TouchableOpacity style={styles.syncButton} onPress={onSyncContacts}>
      <Ionicons name="sync" size={24} color="white" />
      <Text style={styles.syncButtonText}>Sync Contacts</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.addButton} onPress={onAddContact}>
      <MaterialIcons name="add" size={24} color="white" />
      <Text style={styles.addButtonText}>Add Manually</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
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

export default ActionButtons;