import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AuthSocialButtons from '../../components/auth/AuthSocialButtons';
import SignUpStep1 from '../../components/auth/SignUpStep1';
import SignUpStep2 from '../../components/auth/SignUpStep2';
import SignUpStep3 from '../../components/auth/SignUpStep3';
import ProgressSteps from '../../components/auth/ProgressSteps';
import { authService } from '../../api/services/auth';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    
    // Step 2
    birthdate: '',
    gender: '',
    height: '',
    weight: '',
    experienceLevel: '',
    
    // Step 3
    fitnessGoal: '',
    weeklyFrequency: '',
    workoutDuration: '',
    equipment: '',
  });

  const router = useRouter();

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({
        x: SCREEN_WIDTH * currentStep,
        animated: true,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({
        x: SCREEN_WIDTH * (currentStep - 2),
        animated: true,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        membershipStatus: 'free',
        // Add other relevant registration data
        /*
        profile: {
          birthdate: formData.birthdate,
          gender: formData.gender,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          experienceLevel: formData.experienceLevel,
          fitnessGoal: formData.fitnessGoal,
          weeklyFrequency: parseInt(formData.weeklyFrequency),
          workoutDuration: formData.workoutDuration,
          equipment: formData.equipment,
        }
        */
      });

      if (response) {
        router.push('/(tabs)');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      // Add error handling here
    }
  };

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons name="dumbbell" size={48} color="#3498db" />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the JetGym community</Text>
        </View>

        <ProgressSteps currentStep={currentStep} totalSteps={3} />

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={styles.stepsContainer}
        >
          <View style={[styles.step, { width: SCREEN_WIDTH }]}>
            <SignUpStep1
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
            />
          </View>

          <View style={[styles.step, { width: SCREEN_WIDTH }]}>
            <SignUpStep2
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          </View>

          <View style={[styles.step, { width: SCREEN_WIDTH }]}>
            <SignUpStep3
              formData={formData}
              updateFormData={updateFormData}
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#3498db" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          {currentStep < 3 ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <MaterialCommunityIcons name="arrow-right" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Create Account</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  stepsContainer: {
    flex: 1,
  },
  step: {
    padding: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    marginLeft: 8,
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});