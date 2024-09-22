import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MenuModal from '@/components/MenuModal';

describe('MenuModal Component', () => {
  const onCloseMock = jest.fn();
  const onSyncContactsMock = jest.fn();
  const onDeleteAllContactsMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal and buttons correctly when visible', () => {
    const { getByTestId, queryByTestId } = render(
      <MenuModal
        visible={true}
        onClose={onCloseMock}
        onSyncContacts={onSyncContactsMock}
        onDeleteAllContacts={onDeleteAllContactsMock}
        hasContacts={true}
      />
    );

    expect(getByTestId('menu-modal')).toBeTruthy();
    expect(getByTestId('sync-contacts')).toBeTruthy();
    expect(getByTestId('delete-all-contacts')).toBeTruthy();
    expect(getByTestId('close-modal')).toBeTruthy();
    expect(queryByTestId('menu-modal')).toBeTruthy();
  });

  it('calls onClose when the Close button is pressed', () => {
    const { getByTestId } = render(
      <MenuModal
        visible={true}
        onClose={onCloseMock}
        onSyncContacts={onSyncContactsMock}
        onDeleteAllContacts={onDeleteAllContactsMock}
        hasContacts={true}
      />
    );

    fireEvent.press(getByTestId('close-modal'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('calls onSyncContacts when the Sync Contacts button is pressed', () => {
    const { getByTestId } = render(
      <MenuModal
        visible={true}
        onClose={onCloseMock}
        onSyncContacts={onSyncContactsMock}
        onDeleteAllContacts={onDeleteAllContactsMock}
        hasContacts={true}
      />
    );

    fireEvent.press(getByTestId('sync-contacts'));
    expect(onSyncContactsMock).toHaveBeenCalled();
  });

  it('calls onDeleteAllContacts when the Delete All Contacts button is pressed and hasContacts is true', () => {
    const { getByTestId } = render(
      <MenuModal
        visible={true}
        onClose={onCloseMock}
        onSyncContacts={onSyncContactsMock}
        onDeleteAllContacts={onDeleteAllContactsMock}
        hasContacts={true}
      />
    );

    fireEvent.press(getByTestId('delete-all-contacts'));
    expect(onDeleteAllContactsMock).toHaveBeenCalled();
  });

  it('disables Delete All Contacts button when hasContacts is false', () => {
    const { getByTestId } = render(
      <MenuModal
        visible={true}
        onClose={onCloseMock}
        onSyncContacts={onSyncContactsMock}
        onDeleteAllContacts={onDeleteAllContactsMock}
        hasContacts={false}
      />
    );

    const deleteButton = getByTestId('delete-all-contacts');
    expect(deleteButton.props.disabled).toBe(undefined);
  });

  it('closes the modal when overlay is pressed', () => {
    const { getByTestId } = render(
      <MenuModal
        visible={true}
        onClose={onCloseMock}
        onSyncContacts={onSyncContactsMock}
        onDeleteAllContacts={onDeleteAllContactsMock}
        hasContacts={true}
      />
    );

    fireEvent.press(getByTestId('overlay'));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
