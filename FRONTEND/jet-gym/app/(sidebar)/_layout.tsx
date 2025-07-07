import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function SidebarLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{
        headerShown: false,
        animation: 'fade',
        gestureEnabled: false,
        contentStyle: { backgroundColor: '#f8f9fa' }
      }}>
        <Stack.Screen 
          name="account-settings"
          options={{ title: 'Account Settings' }}
        />
        <Stack.Screen 
          name="app-preferences"
          options={{ title: 'App Preferences' }}
        />
        <Stack.Screen 
          name="help-support"
          options={{ title: 'Help & Support' }}
        />
        <Stack.Screen 
          name="about"
          options={{ title: 'About' }}
        />
      </Stack>
    </>
  );
} 