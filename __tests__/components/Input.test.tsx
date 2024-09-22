import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from '@/components/Input';

describe('Input Component', () => {
  const onChangeTextMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the input with placeholder text', () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Enter name"
        value=""
        onChangeText={onChangeTextMock}
      />
    );

    expect(getByPlaceholderText('Enter name')).toBeTruthy();
  });

  it('calls onChangeText when text is changed', () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Enter name"
        value=""
        onChangeText={onChangeTextMock}
      />
    );

    fireEvent.changeText(getByPlaceholderText('Enter name'), 'John Doe');
    expect(onChangeTextMock).toHaveBeenCalledWith('John Doe');
  });

  it('renders with an error message if provided', () => {
    const { getByText } = render(
      <Input
        placeholder="Enter email"
        value="john@example.com"
        onChangeText={onChangeTextMock}
        errorMessage="Invalid email"
      />
    );

    expect(getByText('Invalid email')).toBeTruthy();
  });

  it('displays the correct keyboard type', () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Enter phone number"
        value=""
        onChangeText={onChangeTextMock}
        keyboardType="phone-pad"
      />
    );

    const input = getByPlaceholderText('Enter phone number');
    expect(input.props.keyboardType).toBe('phone-pad');
  });

  it('applies the error style when there is an error message', () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Enter email"
        value="invalid-email"
        onChangeText={onChangeTextMock}
        errorMessage="Invalid email"
      />
    );

    const input = getByPlaceholderText('Enter email');
    expect(input.props.style).toContainEqual({ borderColor: 'red' });
  });
});
