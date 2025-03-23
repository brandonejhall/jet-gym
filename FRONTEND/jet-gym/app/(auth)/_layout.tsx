import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
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
          name="signin"
          options={{
            title: 'Sign In',
          }}
        />
        <Stack.Screen 
          name="signup"
          options={{
            title: 'Create Account',
          }}
        />
      </Stack>
    </>
  );
}
