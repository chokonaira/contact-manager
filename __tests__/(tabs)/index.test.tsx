import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)'; 
import { useContacts } from '@/hooks/useContacts';

jest.mock('@/hooks/useContacts');

const mockContacts = [
  { id: '1', name: 'John Doe', phone: '123456789', email: 'john@example.com', photo: null },
  { id: '2', name: 'Jane Doe', phone: '987654321', email: 'jane@example.com', photo: 'some-photo-url' },
];

describe('HomeScreen Component', () => {
  let mockUseContacts;

  beforeEach(() => {
    mockUseContacts = {
      contacts: mockContacts,
      filteredContacts: mockContacts,
      searchQuery: '',
      isLoadingContacts: false,
      flatListRef: { current: null },
      filterContacts: jest.fn(),
      addContact: jest.fn(),
      editContact: jest.fn(),
      handleDeleteContact: jest.fn(),
      scrollToContact: jest.fn(),
      highlightedContactId: null,
      syncContacts: jest.fn(),
      deleteAllContacts: jest.fn(),
    };

    useContacts.mockReturnValue(mockUseContacts);
  });

  it('renders loading indicator when contacts are loading', () => {
    mockUseContacts.isLoadingContacts = true;
    useContacts.mockReturnValue(mockUseContacts);

    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders header and icons when contacts are available', async () => {
    const { getByTestId } = render(<HomeScreen />);

    await waitFor(() => getByTestId('header-title'));

    expect(getByTestId('header-title')).toBeTruthy();
    expect(getByTestId('add-icon')).toBeTruthy();
    expect(getByTestId('menu-icon')).toBeTruthy();
  });

  it('opens the menu modal when menu icon is pressed', () => {
    const { getByTestId } = render(<HomeScreen />);

    fireEvent.press(getByTestId('menu-icon'));
    expect(getByTestId('menu-modal').props.visible).toBe(true);
  });

  it('filters contacts when searching', async () => {
    const { getByTestId } = render(<HomeScreen />);

    fireEvent.changeText(getByTestId('search-input'), 'John');
    await waitFor(() => {
      expect(mockUseContacts.filterContacts).toHaveBeenCalledWith('John');
    });
  });
});
