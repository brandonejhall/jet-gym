import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const fitnessGoals = [
  { id: 'build_muscle', label: 'Build Muscle', icon: 'arm-flex' },
  { id: 'lose_weight', label: 'Lose Weight', icon: 'scale-bathroom' },
  { id: 'get_stronger', label: 'Get Stronger', icon: 'weight-lifter' },
  { id: 'improve_health', label: 'Improve Health', icon: 'heart-pulse' },
];

const weeklyFrequencies = [
  { id: '2-3', label: '2-3 times' },
  { id: '3-4', label: '3-4 times' },
  { id: '4-5', label: '4-5 times' },
  { id: '6+', label: '6+ times' },
];

const workoutDurations = [
  { id: '30', label: '30 minutes' },
  { id: '45', label: '45 minutes' },
  { id: '60', label: '60 minutes' },
  { id: '90', label: '90+ minutes' },
];

const equipmentOptions = [
  { id: 'full_gym', label: 'Full Gym Access', icon: 'dumbbell' },
  { id: 'home_basic', label: 'Basic Home Equipment', icon: 'home' },
  { id: 'bodyweight', label: 'Bodyweight Only', icon: 'account' },
];

interface SignUpStep3Props {
  formData: {
    fitnessGoal: string;
    weeklyFrequency: string;
    workoutDuration: string;
    equipment: string;
  };
  updateFormData: (data: Partial<SignUpStep3Props['formData']>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function SignUpStep3({ formData, updateFormData, onSubmit, onBack }: SignUpStep3Props) {
  const [errors, setErrors] = useState({
    fitnessGoal: '',
    weeklyFrequency: '',
    workoutDuration: '',
    equipment: '',
  });

  const validateForm = () => {
    const newErrors = {
      fitnessGoal: '',
      weeklyFrequency: '',
      workoutDuration: '',
      equipment: '',
    };

    let isValid = true;

    if (!formData.fitnessGoal) {
      newErrors.fitnessGoal = 'Please select your primary fitness goal';
      isValid = false;
    }

    if (!formData.weeklyFrequency) {
      newErrors.weeklyFrequency = 'Please select your weekly workout frequency';
      isValid = false;
    }

    if (!formData.workoutDuration) {
      newErrors.workoutDuration = 'Please select your preferred workout duration';
      isValid = false;
    }

    if (!formData.equipment) {
      newErrors.equipment = 'Please select your available equipment';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's your primary fitness goal?</Text>
        <View style={styles.goalsGrid}>
          {fitnessGoals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                formData.fitnessGoal === goal.id && styles.goalCardActive
              ]}
              onPress={() => updateFormData({ fitnessGoal: goal.id })}
            >
              <MaterialCommunityIcons
                name={goal.icon}
                size={32}
                color={formData.fitnessGoal === goal.id ? 'white' : '#3498db'}
              />
              <Text style={[
                styles.goalText,
                formData.fitnessGoal === goal.id && styles.goalTextActive
              ]}>{goal.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.fitnessGoal ? <Text style={styles.errorText}>{errors.fitnessGoal}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How often can you work out?</Text>
        <View style={styles.optionsContainer}>
          {weeklyFrequencies.map((frequency) => (
            <TouchableOpacity
              key={frequency.id}
              style={[
                styles.optionButton,
                formData.weeklyFrequency === frequency.id && styles.optionButtonActive
              ]}
              onPress={() => updateFormData({ weeklyFrequency: frequency.id })}
            >
              <Text style={[
                styles.optionText,
                formData.weeklyFrequency === frequency.id && styles.optionTextActive
              ]}>{frequency.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.weeklyFrequency ? <Text style={styles.errorText}>{errors.weeklyFrequency}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferred workout duration?</Text>
        <View style={styles.optionsContainer}>
          {workoutDurations.map((duration) => (
            <TouchableOpacity
              key={duration.id}
              style={[
                styles.optionButton,
                formData.workoutDuration === duration.id && styles.optionButtonActive
              ]}
              onPress={() => updateFormData({ workoutDuration: duration.id })}
            >
              <Text style={[
                styles.optionText,
                formData.workoutDuration === duration.id && styles.optionTextActive
              ]}>{duration.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.workoutDuration ? <Text style={styles.errorText}>{errors.workoutDuration}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What equipment do you have access to?</Text>
        {equipmentOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.equipmentButton,
              formData.equipment === option.id && styles.equipmentButtonActive
            ]}
            onPress={() => updateFormData({ equipment: option.id })}
          >
            <MaterialCommunityIcons
              name={option.icon}
              size={24}
              color={formData.equipment === option.id ? 'white' : '#7f8c8d'}
            />
            <Text style={[
              styles.equipmentText,
              formData.equipment === option.id && styles.equipmentTextActive
            ]}>{option.label}</Text>
          </TouchableOpacity>
        ))}
        {errors.equipment ? <Text style={styles.errorText}>{errors.equipment}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  goalCardActive: {
    backgroundColor: '#3498db',
  },
  goalText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  goalTextActive: {
    color: 'white',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    flex: 1,
    minWidth: '45%',
    margin: 4,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#3498db',
  },
  optionText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  optionTextActive: {
    color: 'white',
  },
  equipmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
  },
  equipmentButtonActive: {
    backgroundColor: '#3498db',
  },
  equipmentText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  equipmentTextActive: {
    color: 'white',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
});