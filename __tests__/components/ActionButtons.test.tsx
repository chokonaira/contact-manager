import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ActionButtons from '@/components/ActionButtons'; 

describe('ActionButtons Component', () => {
  const onAddContactMock = jest.fn();
  const onSyncContactsMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Sync Contacts and Add Manually buttons', () => {
    const { getByText } = render(
      <ActionButtons onAddContact={onAddContactMock} onSyncContacts={onSyncContactsMock} />
    );

    expect(getByText('Sync Contacts')).toBeTruthy();
    expect(getByText('Add Manually')).toBeTruthy();
  });

  it('calls onSyncContacts when Sync Contacts button is pressed', () => {
    const { getByText } = render(
      <ActionButtons onAddContact={onAddContactMock} onSyncContacts={onSyncContactsMock} />
    );

    fireEvent.press(getByText('Sync Contacts'));
    expect(onSyncContactsMock).toHaveBeenCalled();
  });

  it('calls onAddContact when Add Manually button is pressed', () => {
    const { getByText } = render(
      <ActionButtons onAddContact={onAddContactMock} onSyncContacts={onSyncContactsMock} />
    );

    fireEvent.press(getByText('Add Manually'));
    expect(onAddContactMock).toHaveBeenCalled();
  });
});
