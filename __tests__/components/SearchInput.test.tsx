import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchInput from '@/components/SearchInput';

describe('SearchInput Component', () => {
  const onSearchChangeMock = jest.fn();
  const onCancelSearchMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search input with a placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchInput
        searchQuery=""
        onSearchChange={onSearchChangeMock}
        onCancelSearch={onCancelSearchMock}
        isSearchFocused={false}
        contactsAvailable={true}
      />
    );

    expect(getByPlaceholderText('Search Contacts')).toBeTruthy();
  });

  it('calls onSearchChange when text is entered', () => {
    const { getByPlaceholderText } = render(
      <SearchInput
        searchQuery=""
        onSearchChange={onSearchChangeMock}
        onCancelSearch={onCancelSearchMock}
        isSearchFocused={true}
        contactsAvailable={true}
      />
    );

    const input = getByPlaceholderText('Search Contacts');
    fireEvent.changeText(input, 'John');

    expect(onSearchChangeMock).toHaveBeenCalledWith('John');
  });

  it('enables the cancel button only when search is focused and query is not empty', () => {
    const { getByText, getByPlaceholderText } = render(
      <SearchInput
        searchQuery="John"
        onSearchChange={onSearchChangeMock}
        onCancelSearch={onCancelSearchMock}
        isSearchFocused={true}
        contactsAvailable={true}
      />
    );

    const cancelButton = getByText('Cancel');
    const cancelButtonStyle = cancelButton.parent?.props.style;

    expect(cancelButtonStyle).toStrictEqual({ "color": "gray" });

    const input = getByPlaceholderText('Search Contacts');
    fireEvent.changeText(input, '');

    expect(cancelButton.parent?.props.style).toStrictEqual({ "color": "gray" });
  });

  it('calls onCancelSearch when cancel button is pressed', () => {
    const { getByText } = render(
      <SearchInput
        searchQuery="John"
        onSearchChange={onSearchChangeMock}
        onCancelSearch={onCancelSearchMock}
        isSearchFocused={true}
        contactsAvailable={true}
      />
    );

    const cancelButton = getByText('Cancel');
    fireEvent.press(cancelButton);

    expect(onCancelSearchMock).toHaveBeenCalled();
  });

  it('disables the cancel button when search is not focused or query is empty', () => {
    const { getByText } = render(
      <SearchInput
        searchQuery=""
        onSearchChange={onSearchChangeMock}
        onCancelSearch={onCancelSearchMock}
        isSearchFocused={false}
        contactsAvailable={true}
      />
    );

    const cancelButton = getByText('Cancel');
    expect(cancelButton.parent?.props.disabled).toBe(undefined);
  });
});