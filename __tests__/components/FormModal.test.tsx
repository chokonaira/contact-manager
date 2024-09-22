import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ContactFormModal from '@/components/FormModal';
import { Contact } from '@/hooks/useFormValidation';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return Object.setPrototypeOf(
    {
      Alert: {
        alert: jest.fn(),
      },
    },
    RN
  );
});

describe('ContactFormModal Component', () => {
  const onCloseMock = jest.fn();
  const onSubmitMock = jest.fn();
  const onDeleteMock = jest.fn();

  const mockContact: Contact = {
    id: '1',
    name: 'John Doe',
    phone: '123456789',
    email: 'john@example.com',
    photo: 'http://example.com/photo.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when adding a new contact', () => {
    const { getByPlaceholderText, getByText, queryByTestId } = render(
      <ContactFormModal
        isVisible={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        isEditing={false}
      />
    );

    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Phone')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByText('Add')).toBeTruthy();
    expect(queryByTestId('delete-icon-top-left')).toBeNull(); 
  });

  it('renders correctly when editing an existing contact', () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <ContactFormModal
        isVisible={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        contact={mockContact}
        isEditing={true}
      />
    );

    expect(getByPlaceholderText('Name').props.value).toBe(mockContact.name);
    expect(getByPlaceholderText('Phone').props.value).toBe(mockContact.phone);
    expect(getByPlaceholderText('Email').props.value).toBe(mockContact.email);
    expect(getByTestId('delete-icon-top-left')).toBeTruthy(); 
    expect(getByText('Save')).toBeTruthy();
  });

  it('calls onSubmit with updated contact information when Save button is pressed', async () => {
    const { getByText, getByPlaceholderText } = render(
      <ContactFormModal
        isVisible={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        contact={mockContact}
        isEditing={true}
      />
    );

    fireEvent.changeText(getByPlaceholderText('Name'), 'Jane Doe');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        id: mockContact.id,
        name: 'Jane Doe',
        phone: mockContact.phone,
        email: mockContact.email,
        photo: mockContact.photo,
      });
    });
  });

  it('calls onDelete and onClose when the Delete button is pressed', async () => {
    const { getByTestId } = render(
      <ContactFormModal
        isVisible={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        onDelete={onDeleteMock}
        contact={mockContact}
        isEditing={true}
      />
    );

    fireEvent.press(getByTestId('delete-icon-top-left'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      expect.any(Array),
      { cancelable: true }
    );

    const deleteButton = Alert.alert.mock.calls[0][2][1];
    deleteButton.onPress();

    expect(onDeleteMock).toHaveBeenCalledWith(mockContact.id);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('calls onClose when the cancel button is pressed', () => {
    const { getByTestId } = render(
      <ContactFormModal
        isVisible={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        isEditing={false}
      />
    );

    fireEvent.press(getByTestId('cancel-icon'));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
