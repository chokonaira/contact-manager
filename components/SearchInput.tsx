import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCancelSearch: () => void;
  isSearchFocused: boolean;
  contactsAvailable: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  onSearchChange,
  onCancelSearch,
  isSearchFocused,
  contactsAvailable,
}) => (
  <View style={styles.searchContainer}>
    <TextInput
      placeholder="Search Contacts"
      placeholderTextColor="gray"
      value={searchQuery}
      onChangeText={onSearchChange}
      style={styles.searchInput}
      editable={contactsAvailable}
    />
    <TouchableOpacity
      style={[styles.cancelSearchButton, { opacity: isSearchFocused && searchQuery ? 1 : 0.5 }]}
      onPress={onCancelSearch}
      disabled={!isSearchFocused || !searchQuery}
    >
      <Text style={styles.cancelSearchText}>Cancel</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  cancelSearchButton: {
    marginLeft: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 15,
    justifyContent: 'center',
    height: 40,
  },
  cancelSearchText: {
    color: 'gray',
  },
});

export default SearchInput;