import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

const stepTitles = [
  'Account',
  'Profile',
  'Preferences'
];

export default function ProgressSteps({ currentStep, totalSteps }: ProgressStepsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <View style={styles.stepContainer}>
            <View style={[
              styles.stepCircle,
              index + 1 === currentStep && styles.activeStep,
              index + 1 < currentStep && styles.completedStep
            ]}>
              {index + 1 < currentStep ? (
                <MaterialCommunityIcons name="check" size={16} color="white" />
              ) : (
                <Text style={[
                  styles.stepNumber,
                  index + 1 === currentStep && styles.activeStepNumber
                ]}>
                  {index + 1}
                </Text>
              )}
            </View>
            <Text style={[
              styles.stepTitle,
              index + 1 === currentStep && styles.activeStepTitle
            ]}>
              {stepTitles[index]}
            </Text>
          </View>
          {index < totalSteps - 1 && (
            <View style={[
              styles.connector,
              index + 1 < currentStep && styles.completedConnector
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeStep: {
    backgroundColor: '#3498db',
  },
  completedStep: {
    backgroundColor: '#2ecc71',
  },
  stepNumber: {
    color: '#7f8c8d',
    fontSize: 14,
    fontWeight: '600',
  },
  activeStepNumber: {
    color: 'white',
  },
  stepTitle: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeStepTitle: {
    color: '#3498db',
    fontWeight: '600',
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  completedConnector: {
    backgroundColor: '#2ecc71',
  },
}); 