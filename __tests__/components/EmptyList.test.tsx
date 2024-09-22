import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EmptyList from '@/components/EmptyList';

describe('EmptyList Component', () => {
  const onSyncContactsMock = jest.fn();
  const onAddContactMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the empty message and buttons', () => {
    const { getByTestId } = render(
      <EmptyList onSyncContacts={onSyncContactsMock} onAddContact={onAddContactMock} />
    );

    expect(getByTestId('empty-text').props.children).toBe('No contacts found.');
    expect(getByTestId('info-text').props.children).toBe('Sync your mobile contacts or add manually.');
    expect(getByTestId('sync-button')).toBeTruthy();
    expect(getByTestId('sync-button-text').props.children).toBe('Sync Contacts');
    expect(getByTestId('add-button')).toBeTruthy();
    expect(getByTestId('add-button-text').props.children).toBe('Add Manually');
  });

  it('calls onSyncContacts when the Sync Contacts button is pressed', () => {
    const { getByTestId } = render(
      <EmptyList onSyncContacts={onSyncContactsMock} onAddContact={onAddContactMock} />
    );

    fireEvent.press(getByTestId('sync-button'));
    expect(onSyncContactsMock).toHaveBeenCalled();
  });

  it('calls onAddContact when the Add Manually button is pressed', () => {
    const { getByTestId } = render(
      <EmptyList onSyncContacts={onSyncContactsMock} onAddContact={onAddContactMock} />
    );

    fireEvent.press(getByTestId('add-button'));
    expect(onAddContactMock).toHaveBeenCalled();
  });
});
