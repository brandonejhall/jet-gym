import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function AccountSettingsPage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account Settings</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          Manage your account information, change your password, and update your personal details here.
        </Text>
        {/* Add more sections or settings here in the future */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 16,
  },
}); 