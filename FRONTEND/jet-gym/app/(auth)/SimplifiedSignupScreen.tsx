import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AuthInput from '../../components/auth/AuthInput';
import { useRouter } from 'expo-router';

const GOALS = [
  { key: 'build_muscle', label: 'Build Muscle', icon: 'arm-flex' },
  { key: 'lose_weight', label: 'Lose Weight', icon: 'scale-bathroom' },
  { key: 'get_stronger', label: 'Get Stronger', icon: 'weight-lifter' },
  { key: 'improve_health', label: 'Improve Health', icon: 'heart-pulse' },
];

export default function SimplifiedSignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState<string | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const router = useRouter();

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!goal) newErrors.goal = 'Select a fitness goal';
    if (!agreeToTerms) newErrors.terms = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, goal }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors({ api: data.message || 'Signup failed' });
        setIsLoading(false);
        return;
      }
      // If profileComplete is false, redirect to CompleteProfile
      if (data.user && data.user.profileComplete === false) {
        router.replace({ pathname: '/signin' });
      } else {
        router.replace({ pathname: '/signin' });
      }
    } catch (err) {
      setErrors({ api: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Create your JetGym account</Text>

          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            icon="email"
          />

          <AuthInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            error={errors.password}
            secureTextEntry
            icon="lock"
          />

          <Text style={styles.sectionLabel}>Fitness Goal</Text>
          <View style={styles.goalsRow}>
            {GOALS.map(g => (
              <TouchableOpacity
                key={g.key}
                style={[styles.goalOption, goal === g.key && styles.goalOptionSelected]}
                onPress={() => setGoal(g.key)}
                accessibilityLabel={g.label}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons name={g.icon as any} size={32} color={goal === g.key ? '#3498db' : '#7f8c8d'} />
                <Text style={[styles.goalLabel, goal === g.key && { color: '#3498db', fontWeight: 'bold' }]}>{g.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.goal && <Text style={styles.errorText}>{errors.goal}</Text>}

          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => router.push({ pathname: '/signin' })}
            activeOpacity={0.7}
          >
            <TouchableOpacity
              style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              accessibilityLabel="Agree to terms"
              accessibilityRole="checkbox"
            >
              {agreeToTerms && <MaterialCommunityIcons name="check" size={18} color="white" />}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms and Conditions</Text>
            </Text>
          </TouchableOpacity>
          {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

          {errors.api && <Text style={styles.errorText}>{errors.api}</Text>}

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            accessibilityRole="button"
          >
            <Text style={styles.submitButtonText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/signin')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  goalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f0f4f8',
    flex: 1,
    marginHorizontal: 4,
  },
  goalOptionSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#3498db',
    borderWidth: 2,
  },
  goalLabel: {
    marginTop: 6,
    fontSize: 13,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#3498db',
  },
  termsText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  termsLink: {
    color: '#3498db',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 2,
  },
  submitButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  loginLink: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
}); 