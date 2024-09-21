import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  errorMessage?: string;
}

const Input: React.FC<InputProps> = ({ placeholder, value, onChangeText, keyboardType = 'default', autoCapitalize = 'none', errorMessage }) => {
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999" 
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[styles.input, errorMessage && styles.inputError]}
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    width: '90%',
    marginBottom: 14,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    marginTop: 2,
    marginBottom: 5,
  },
});

export default Input;
