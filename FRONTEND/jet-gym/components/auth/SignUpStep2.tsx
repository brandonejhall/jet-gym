import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AuthInput from './AuthInput';
import DateTimePicker from '@react-native-community/datetimepicker';

const experienceLevels = [
  { id: 'beginner', label: 'Beginner', icon: 'exercise' },
  { id: 'intermediate', label: 'Intermediate', icon: 'weight-lifter' },
  { id: 'advanced', label: 'Advanced', icon: 'weight' },
];

interface SignUpStep2Props {
  formData: {
    birthdate: string;
    gender: string;
    height: string;
    weight: string;
    experienceLevel: string;
  };
  updateFormData: (data: Partial<SignUpStep2Props['formData']>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SignUpStep2({ formData, updateFormData, onNext, onBack }: SignUpStep2Props) {
  const [errors, setErrors] = useState({
    birthdate: '',
    gender: '',
    height: '',
    weight: '',
    experienceLevel: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateForm = () => {
    const newErrors = {
      birthdate: '',
      gender: '',
      height: '',
      weight: '',
      experienceLevel: '',
    };

    let isValid = true;

    if (!formData.birthdate) {
      newErrors.birthdate = 'Birth date is required';
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
      isValid = false;
    }

    if (!formData.height) {
      newErrors.height = 'Height is required';
      isValid = false;
    }

    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
      isValid = false;
    }

    if (!formData.experienceLevel) {
      newErrors.experienceLevel = 'Please select your experience level';
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

  const handleDateChange = (event: any, selectedDate: { toISOString: () => string; }) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateFormData({ birthdate: selectedDate.toISOString().split('T')[0] });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.label}>Birth Date</Text>
        <View style={styles.dateDisplay}>
          <MaterialCommunityIcons name="calendar" size={24} color="#7f8c8d" />
          <Text style={styles.dateText}>
            {formData.birthdate || 'Select your birth date'}
          </Text>
        </View>
        {errors.birthdate ? <Text style={styles.errorText}>{errors.birthdate}</Text> : null}
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={formData.birthdate ? new Date(formData.birthdate) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <View style={styles.genderSection}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderButtons}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              formData.gender === 'male' && styles.genderButtonActive
            ]}
            onPress={() => updateFormData({ gender: 'male' })}
          >
            <MaterialCommunityIcons
              name="gender-male"
              size={24}
              color={formData.gender === 'male' ? 'white' : '#7f8c8d'}
            />
            <Text style={[
              styles.genderButtonText,
              formData.gender === 'male' && styles.genderButtonTextActive
            ]}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderButton,
              formData.gender === 'female' && styles.genderButtonActive
            ]}
            onPress={() => updateFormData({ gender: 'female' })}
          >
            <MaterialCommunityIcons
              name="gender-female"
              size={24}
              color={formData.gender === 'female' ? 'white' : '#7f8c8d'}
            />
            <Text style={[
              styles.genderButtonText,
              formData.gender === 'female' && styles.genderButtonTextActive
            ]}>Female</Text>
          </TouchableOpacity>
        </View>
        {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
      </View>

      <View style={styles.measurementsRow}>
        <View style={styles.measurementInput}>
          <AuthInput
            label="Height (cm)"
            value={formData.height}
            onChangeText={(text) => updateFormData({ height: text })}
            placeholder="175"
            keyboardType="numeric"
            error={errors.height}
          />
        </View>

        <View style={styles.measurementInput}>
          <AuthInput
            label="Weight (kg)"
            value={formData.weight}
            onChangeText={(text) => updateFormData({ weight: text })}
            placeholder="70"
            keyboardType="numeric"
            error={errors.weight}
          />
        </View>
      </View>

      <View style={styles.experienceSection}>
        <Text style={styles.label}>Fitness Experience</Text>
        {experienceLevels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.experienceButton,
              formData.experienceLevel === level.id && styles.experienceButtonActive
            ]}
            onPress={() => updateFormData({ experienceLevel: level.id })}
          >
            <MaterialCommunityIcons
              name={level.icon}
              size={24}
              color={formData.experienceLevel === level.id ? 'white' : '#7f8c8d'}
            />
            <Text style={[
              styles.experienceButtonText,
              formData.experienceLevel === level.id && styles.experienceButtonTextActive
            ]}>{level.label}</Text>
          </TouchableOpacity>
        ))}
        {errors.experienceLevel ? <Text style={styles.errorText}>{errors.experienceLevel}</Text> : null}
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  dateInput: {
    marginBottom: 16,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  genderSection: {
    marginBottom: 16,
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  genderButtonActive: {
    backgroundColor: '#3498db',
  },
  genderButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#7f8c8d',
  },
  genderButtonTextActive: {
    color: 'white',
  },
  measurementsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  measurementInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  experienceSection: {
    marginBottom: 16,
  },
  experienceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
  },
  experienceButtonActive: {
    backgroundColor: '#3498db',
  },
  experienceButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  experienceButtonTextActive: {
    color: 'white',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
});