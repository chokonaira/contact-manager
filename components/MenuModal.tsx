import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  onSyncContacts: () => void;
  onDeleteAllContacts: () => void;
  hasContacts: boolean;
}

const MenuModal: React.FC<MenuModalProps> = ({
  visible,
  onClose,
  onSyncContacts,
  onDeleteAllContacts,
  hasContacts,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" testID="menu-modal">
      <TouchableWithoutFeedback onPress={onClose} testID="overlay">
        <View style={styles.menuContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContent}>
              <TouchableOpacity testID="sync-contacts" style={styles.menuItem} onPress={onSyncContacts}>
                <Text style={styles.menuText}>Sync Contacts</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="delete-all-contacts"
                style={[styles.menuItem, { opacity: hasContacts ? 1 : 0.5 }]}
                onPress={hasContacts ? onDeleteAllContacts : undefined}
                disabled={!hasContacts}
              >
                <Text style={styles.menuText}>Delete All Contacts</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="close-modal" style={styles.menuItem} onPress={onClose}>
                <Text style={styles.menuText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  menuText: {
    fontSize: 16,
    color: 'black',
  },
});

export default MenuModal;
