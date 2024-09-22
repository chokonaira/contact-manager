import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '@/components/Button';

describe('Button Component', () => {
  const onPressMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the button with the correct title', () => {
    const { getByText } = render(<Button title="Submit" onPress={onPressMock} />);
    expect(getByText('Submit')).toBeTruthy();
  });

  it('calls onPress when the button is pressed', () => {
    const { getByText } = render(<Button title="Submit" onPress={onPressMock} />);
    fireEvent.press(getByText('Submit'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when the button is disabled', () => {
    const { getByText } = render(<Button title="Submit" onPress={onPressMock} disabled={true} />);
    fireEvent.press(getByText('Submit'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows ActivityIndicator when isLoading is true', () => {
    const { getByTestId, queryByText } = render(
      <Button title="Submit" onPress={onPressMock} isLoading={true} />
    );
    expect(getByTestId('activity-indicator')).toBeTruthy();
    expect(queryByText('Submit')).toBeNull();
  });

  it('renders button with correct color when passed', () => {
    const { getByTestId } = render(
      <Button title="Submit" onPress={onPressMock} color="blue" />
    );

    const button = getByTestId('button');
    const buttonStyles = Array.isArray(button.props.style) ? button.props.style : [button.props.style];

    const backgroundColorStyle = buttonStyles.find((style) => style.backgroundColor);

    expect(backgroundColorStyle).toMatchObject({ backgroundColor: 'blue' });
  });
});
