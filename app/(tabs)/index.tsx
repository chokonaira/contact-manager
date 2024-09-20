import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
;


export default function HomeScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Contact Manager App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoText: {
    fontSize: 16,
    marginBottom: 20,
    color: 'gray',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
