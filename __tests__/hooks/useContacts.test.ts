import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useContacts } from '../../hooks/useContacts'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Contacts from 'expo-contacts';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-contacts', () => ({
  requestPermissionsAsync: jest.fn(),
  getContactsAsync: jest.fn(),
  Fields: {
    PhoneNumbers: 'phoneNumbers',
    Emails: 'emails',
  },
}));

describe('useContacts hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('should load contacts from AsyncStorage on mount', async () => {
    const mockStoredContacts = JSON.stringify([
      { id: '1', name: 'John Doe', phone: '123456789' },
      { id: '2', name: 'Jane Doe', phone: '987654321' },
    ]);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockStoredContacts);

    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('contacts');
      expect(result.current.contacts.length).toBe(2);
      expect(result.current.filteredContacts.length).toBe(2);
    });
  });

  
  it('should edit an existing contact and update storage', async () => {
    const mockContact = { id: '1', name: 'John Doe', phone: '123456789' };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockContact]));

    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(result.current.contacts.length).toBe(1);
    });

    const updatedContact = { id: '1', name: 'Johnathan Doe', phone: '123456789' };

    await act(async () => {
      const index = result.current.editContact(updatedContact);
      expect(index).toBe(0);
    });

    expect(result.current.contacts[0].name).toBe('Johnathan Doe');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'contacts',
      JSON.stringify(result.current.contacts)
    );
  });

  it('should delete a contact and update storage', async () => {
    const mockContact = { id: '1', name: 'John Doe', phone: '123456789' };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockContact]));

    const { result } = renderHook(() => useContacts());

    await waitFor(() => {
      expect(result.current.contacts.length).toBe(1);
    });

    await act(async () => {
      result.current.handleDeleteContact('1');
    });

    expect(result.current.contacts.length).toBe(0);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('contacts', JSON.stringify([]));
  });

  it('should sync contacts with phone contacts when permission is granted', async () => {
    (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Contacts.getContactsAsync as jest.Mock).mockResolvedValue({
      data: [
        { id: '1', name: 'New Contact', phoneNumbers: [{ number: '555666777' }] },
      ],
    });

    const { result } = renderHook(() => useContacts());

    await act(async () => {
      await result.current.syncContacts();
    });

    expect(result.current.contacts.length).toBe(1);
    expect(result.current.contacts[0].name).toBe('New Contact');
    expect(result.current.contacts[0].phone).toBe('555666777');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'contacts',
      JSON.stringify(result.current.contacts)
    );
  });
});
