import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AuthInput from './AuthInput';
import AuthSocialButtons from './AuthSocialButtons';

// Password strength criteria
const hasLength = (password: string) => password.length >= 8;
const hasUpperCase = (password: string) => /[A-Z]/.test(password);
const hasLowerCase = (password: string) => /[a-z]/.test(password);
const hasNumber = (password: string) => /[0-9]/.test(password);
const hasSpecialChar = (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password);

const getPasswordStrength = (password: string) => {
  const criteria = [
    hasLength(password),
    hasUpperCase(password),
    hasLowerCase(password),
    hasNumber(password),
    hasSpecialChar(password),
  ];
  
  const strengthScore = criteria.filter(Boolean).length;
  
  if (strengthScore <= 2) return { level: 'weak', color: '#e74c3c' };
  if (strengthScore <= 4) return { level: 'medium', color: '#f39c12' };
  return { level: 'strong', color: '#27ae60' };
};

interface SignUpStep1Props {
  formData: {
    fullName: string;
    email: string;
    password: string;
    agreeToTerms: boolean;
  };
  updateFormData: (data: Partial<SignUpStep1Props['formData']>) => void;
  onNext: () => void;
}

export default function SignUpStep1({ formData, updateFormData, onNext }: SignUpStep1Props) {
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    terms: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      terms: '',
    };

    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password || getPasswordStrength(formData.password).level === 'weak') {
      newErrors.password = 'Please enter a stronger password';
      isValid = false;
    }

    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the Terms and Conditions';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <View style={styles.container}>
      <AuthInput
        label="Full Name"
        value={formData.fullName}
        onChangeText={(text) => updateFormData({ fullName: text })}
        placeholder="Enter your full name"
        icon="account"
        error={errors.fullName}
        autoCapitalize="words"
      />

      <AuthInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => updateFormData({ email: text })}
        placeholder="Enter your email"
        icon="email"
        error={errors.email}
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <AuthInput
          label="Password"
          value={formData.password}
          onChangeText={(text) => updateFormData({ password: text })}
          placeholder="Create a password"
          icon="lock"
          secureTextEntry
          error={errors.password}
        />
        
        {formData.password.length > 0 && (
          <View style={styles.strengthIndicator}>
            <View style={styles.strengthBars}>
              <View style={[
                styles.strengthBar,
                { backgroundColor: passwordStrength.color },
                { flex: passwordStrength.level === 'weak' ? 1 : passwordStrength.level === 'medium' ? 2 : 3 }
              ]} />
            </View>
            <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
              {passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.termsContainer}
        onPress={() => updateFormData({ agreeToTerms: !formData.agreeToTerms })}
      >
        <MaterialCommunityIcons
          name={formData.agreeToTerms ? 'checkbox-marked' : 'checkbox-blank-outline'}
          size={24}
          color={errors.terms ? '#e74c3c' : '#3498db'}
        />
        <Text style={styles.termsText}>
          I agree to the <Text style={styles.termsLink}>Terms and Conditions</Text>
        </Text>
      </TouchableOpacity>
      {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or sign up with</Text>
        <View style={styles.dividerLine} />
      </View>

      <AuthSocialButtons />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  passwordContainer: {
    marginBottom: 16,
  },
  strengthIndicator: {
    marginTop: 8,
  },
  strengthBars: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginBottom: 4,
    flexDirection: 'row',
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  termsText: {
    marginLeft: 8,
    color: '#2c3e50',
    flex: 1,
  },
  termsLink: {
    color: '#3498db',
    fontWeight: '600',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#7f8c8d',
  },
});