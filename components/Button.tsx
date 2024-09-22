import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  color?: string;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({ onPress, title, isLoading = false, disabled = false, color = '#40BF56', style }) => {
  return (
    <TouchableOpacity
      testID="button"
      onPress={onPress}
      disabled={isLoading || disabled}
      style={[styles.button, style, { backgroundColor: color, opacity: disabled ? 0.7 : 1 }]}
    >
      {isLoading ? (
        <ActivityIndicator testID="activity-indicator" size="small" color="#FFF" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
  },
});

export default Button;
