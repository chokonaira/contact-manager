import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ContactList from '@/components/ContactList';

const mockContacts = [
  { id: '1', name: 'John Doe', phone: '123456789', email: 'john@example.com', photo: null },
  { id: '2', name: 'Jane Doe', phone: '987654321', email: 'jane@example.com', photo: 'http://example.com/jane.jpg' },
];

describe('ContactList Component', () => {
  const onPressMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the list of contacts', () => {
    const { getByText } = render(
      <ContactList contacts={mockContacts} onPress={onPressMock} />
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Jane Doe')).toBeTruthy();
    expect(getByText('123456789')).toBeTruthy();
    expect(getByText('987654321')).toBeTruthy();
  });

  it('calls onPress with the correct contact when an item is pressed', () => {
    const { getByTestId } = render(
      <ContactList contacts={mockContacts} onPress={onPressMock} />
    );

    const contactTouchable = getByTestId('contact-touchable-1');
    fireEvent.press(contactTouchable);

    expect(onPressMock).toHaveBeenCalledWith(mockContacts[0]);
  });

  it('highlights the correct contact when highlightedContactId is provided', () => {
    const { getByTestId } = render(
      <ContactList contacts={mockContacts} onPress={onPressMock} highlightedContactId="1" />
    );

    const contactItem = getByTestId('contact-item-1');

    const contactItemStyle = contactItem.props.style;

    const flattenedStyle = Array.isArray(contactItemStyle) ? contactItemStyle.flat() : [contactItemStyle];

    expect(flattenedStyle).toContainEqual({ backgroundColor: '#e0e0e0' });
  });

  it('displays initials when contact has no photo', () => {
    const { getByText } = render(
      <ContactList contacts={mockContacts} onPress={onPressMock} />
    );

    expect(getByText('J')).toBeTruthy();
  });

  it('displays the contact photo when provided', () => {
    const { getByTestId } = render(
      <ContactList contacts={mockContacts} onPress={onPressMock} />
    );

    const contactImage = getByTestId('contact-image-2');
    expect(contactImage.props.source.uri).toBe('http://example.com/jane.jpg');
  });
});