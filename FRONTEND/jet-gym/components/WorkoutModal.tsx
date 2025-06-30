import React, { useState, useEffect } from 'react';
import { WorkoutDTO, ExerciseDTO, ExerciseSetDTO } from '@/api/types';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { workoutService } from '../api/services/workout';
import { CacheService } from '../api/services/cacheservice';
import { exerciseService } from '../api/services/exercise';
import { exerciseSetService } from '../api/services/exerciseSet';

interface ExerciseItemProps {
  exercise: ExerciseDTO;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateExercise: (exercise: ExerciseDTO) => void;
  onAddSet: () => void;
  onDeleteSet: (setId: number) => void;
  onUpdateSet: (set: ExerciseSetDTO) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  isExpanded,
  onToggle,
  onDelete,
  onUpdateExercise,
  onAddSet,
  onDeleteSet,
  onUpdateSet,
}) => {
  const [isTimeBased, setIsTimeBased] = useState(exercise.isTimeBased || false);
  const hasSets = exercise.sets && exercise.sets.length > 0;

  const handleTimeBasedToggle = () => {
    if (hasSets) {
      Alert.alert(
        'Cannot Change Exercise Type',
        'Please remove all sets before changing the exercise type.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    const newValue = !isTimeBased;
    setIsTimeBased(newValue);
    onUpdateExercise({ ...exercise, isTimeBased: newValue });
  };

  const handleExerciseDelete = async () => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              const userId = await CacheService.getItem<string>('userId');
              if (!userId) throw new Error('User ID not found');
              await exerciseService.deleteExercise({ userId: userId, exerciseId: String(exercise.id ?? '') });
              onDelete();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete exercise.');
            }
          }
        },
      ]
    );
  };

  const handleSetDelete = async (setId: number) => {
    Alert.alert(
      'Delete Set',
      'Are you sure you want to delete this set?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              const userId = await CacheService.getItem<string>('userId');
              if (!userId) throw new Error('User ID not found');
              await exerciseSetService.deleteSet({ userId: userId, exerciseSetId: String(setId ?? '') });
              onDeleteSet(setId);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete set.');
            }
          }
        },
      ]
    );
  };

  const renderRightActions = (progress: any, dragX: any) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={handleExerciseDelete}
      >
        <View style={styles.deleteActionContent}>
          <MaterialCommunityIcons name="delete" size={24} color="white" />
          <Text style={styles.deleteActionText}>Delete</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.exerciseContainer}>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity
          style={styles.exerciseHeader}
          onPress={onToggle}
        >
          <TextInput
            style={styles.exerciseName}
            value={exercise.name}
            onChangeText={(text) => onUpdateExercise({ ...exercise, name: text })}
            placeholder="Exercise Name"
          />
          <MaterialCommunityIcons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#7f8c8d"
          />
        </TouchableOpacity>
      </Swipeable>

      {isExpanded && (
        <View style={styles.setsContainer}>
          <View style={styles.exerciseOptions}>
            <View style={[
              styles.timeBasedToggle,
              hasSets && styles.timeBasedToggleDisabled
            ]}>
              <Text style={styles.toggleLabel}>Time Based</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  { backgroundColor: exercise.isTimeBased ? '#3498db' : '#e0e0e0' },
                  hasSets && styles.toggleButtonDisabled
                ]}
                onPress={handleTimeBasedToggle}
                disabled={hasSets}
              >
                <Text style={[
                  styles.toggleText,
                  { color: exercise.isTimeBased ? 'white' : '#666' },
                  hasSets && styles.toggleTextDisabled
                ]}>
                  {exercise.isTimeBased ? 'Yes' : 'No'}
                </Text>
              </TouchableOpacity>
              {hasSets && (
                <MaterialCommunityIcons 
                  name="lock" 
                  size={14} 
                  color="#95a5a6" 
                  style={styles.lockIcon} 
                />
              )}
            </View>
          </View>

          <View style={styles.setHeader}>
            <Text style={styles.setHeaderText}>Set</Text>
            <Text style={styles.setHeaderText}>Weight</Text>
            <Text style={styles.setHeaderText}>{exercise.isTimeBased ? 'Time (s)' : 'Reps'}</Text>
          </View>
          
          {exercise.sets?.map((set: ExerciseSetDTO, index: number) => (
            <Swipeable
              key={set.id}
              renderRightActions={() => (
                <TouchableOpacity
                  style={styles.deleteSetAction}
                  onPress={() => handleSetDelete(set.id || 0)}
                >
                  <MaterialCommunityIcons name="delete" size={20} color="white" />
                </TouchableOpacity>
              )}
            >
              <View style={styles.setRow}>
                <Text style={styles.setNumber}>{index + 1}</Text>
                <TextInput
                  style={styles.setInput}
                  value={String(set.weight)}
                  keyboardType="numeric"
                  onChangeText={(text) => 
                    onUpdateSet({ ...set, weight: parseFloat(text) || 0 })
                  }
                  placeholder="0"
                />
                <TextInput
                  style={styles.setInput}
                  value={String(set.value)}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    onUpdateSet({ ...set, value: parseInt(text) || 0 })
                  }
                  placeholder="0"
                />
              </View>
            </Swipeable>
          ))}
          
          <TouchableOpacity
            style={styles.addSetButton}
            onPress={onAddSet}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#3498db" />
            <Text style={styles.addSetText}>Add Set</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

interface WorkoutModalProps {
  visible: boolean;
  workout: WorkoutDTO | null;
  onClose: () => void;
  onSave: (workout: WorkoutDTO) => void;
}

export default function WorkoutModal({ visible, workout, onClose, onSave }: WorkoutModalProps) {
  const [editedWorkout, setEditedWorkout] = useState<WorkoutDTO | null>(null);
  const [expandedExercises, setExpandedExercises] = useState<Record<number, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (workout) {
      // Deep clone the workout to avoid mutating the original
      setEditedWorkout(JSON.parse(JSON.stringify(workout)));
      setExpandedExercises({});
      setHasChanges(false);
    }
  }, [workout]);

  const toggleExercise = (exerciseId: number) => {
    setExpandedExercises(prev => ({
      ...prev,
      [String(exerciseId)]: !prev[exerciseId]
    }));
  };

  const handleAddExercise = () => {
    if (!editedWorkout) return;

    const newExercise: ExerciseDTO = {
      id: undefined,
      name: '',
      sets: [],
      workoutId: editedWorkout.id || 0,
      muscleGroup: '',
      canonicalName: '',
      normalizedName: '',
      isTimeBased: false
    };

    setEditedWorkout(prev => ({
      ...prev!,
      exercises: [...(prev!.exercises || []), newExercise]
    }));

    setExpandedExercises(prev => ({
      ...prev,
      [String(newExercise.id)]: true
    }));
    setHasChanges(true);
  };

  const handleAddSet = (exerciseId: number) => {
    if (!editedWorkout) return;

    const exercise = editedWorkout.exercises?.find(e => e.id === exerciseId);
    if (!exercise) return;

    const newSet: ExerciseSetDTO = {
      id: undefined,
      exerciseId: exerciseId,
      weight: 0,
      value: 0,
      completed: false,
      isTimeBased: exercise.isTimeBased || false // Inherit from exercise
    };

    setEditedWorkout(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises?.map(e =>
          e.id === exerciseId ? {
            ...e,
            sets: [...(e.sets || []), newSet]
          } : e
        )
      };
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!editedWorkout) return;
    setIsSaving(true);

    try {
      // Get the current userId from cache
      const userId = await CacheService.getItem<string>('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }

      // Log the workout data before saving
      console.log('Saving workout with data:', {
        workoutId: editedWorkout.id,
        name: editedWorkout.name,
        exercises: editedWorkout.exercises?.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          workoutId: exercise.workoutId,
          sets: exercise.sets?.map(set => ({
            id: set.id,
            exerciseId: set.exerciseId,
            weight: set.weight,
            value: set.value,
            completed: set.completed,
            isTimeBased: set.isTimeBased
          }))
        }))
      });

      // Validate exercise names
      const hasInvalidExercise = editedWorkout.exercises?.some(
        exercise => !exercise.name || exercise.name.trim() === ''
      );

      if (hasInvalidExercise) {
        Alert.alert(
          'Invalid Exercise Name',
          'Please provide a valid name for all exercises.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Ensure all exercises have the correct workoutId
      const updatedExercises = editedWorkout.exercises?.map(exercise => ({
        ...exercise,
        workoutId: editedWorkout.id || 0
      }));

      const workoutToSave = {
        ...editedWorkout,
        exercises: updatedExercises
      };

      // Log the final workout data being sent with full sets array
      console.log('Final workout data being sent:', JSON.stringify(workoutToSave, null, 2));

      // If this is a new workout (no id), create it
      if (!editedWorkout.id) {
        const response = await workoutService.createWorkout({
          ...workoutToSave,
          userId: parseInt(userId)
        });
        onSave(response);
      } else {
        // Update existing workout
        await workoutService.updateWorkout({
          userId: parseInt(userId),
          workoutId: editedWorkout.id,
          workoutDTO: workoutToSave
        });
        
        // Fetch the latest workout data after update
        const workouts = await workoutService.getUserWorkouts(userId);
        const updatedWorkout = workouts.find(w => w.id === editedWorkout.id);
        if (updatedWorkout) {
          onSave(updatedWorkout);
        } else {
          onSave(workoutToSave);
        }
      }
    } catch (error) {
      console.error('Failed to save workout:', error);
      Alert.alert(
        'Error',
        'Failed to save workout. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: keyof WorkoutDTO, value: any) => {
    if (!editedWorkout) return;
    setEditedWorkout(prev => ({ ...prev!, [field]: value }));
    setHasChanges(true);
  };

  if (!visible || !editedWorkout) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {isSaving && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Saving workout...</Text>
          </View>
        )}
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#7f8c8d" />
            </TouchableOpacity>
            <TextInput
              style={styles.workoutNameInput}
              value={editedWorkout?.name || ''}
              onChangeText={(text) => handleFieldChange('name', text)}
              placeholder="Workout Name"
            />
            {hasChanges ? (
              <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={isSaving}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.saveButtonPlaceholder} />
            )}
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => handleFieldChange('completed', !editedWorkout?.completed)}
            >
              <Text style={styles.optionLabel}>Completed</Text>
              <View style={styles.checkboxContainer}>
                <MaterialCommunityIcons
                  name={editedWorkout?.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={24}
                  color={editedWorkout?.completed ? '#27ae60' : '#7f8c8d'}
                />
                {!editedWorkout?.completed && (
                  <Text style={styles.checkboxLabel}>In Progress</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {editedWorkout?.exercises?.map((exercise, index) => (
              <ExerciseItem
                key={exercise.id || `new-exercise-${index}`}
                exercise={exercise}
                isExpanded={expandedExercises[exercise.id || 0]}
                onToggle={() => toggleExercise(exercise.id || 0)}
                onDelete={() => {
                  setEditedWorkout(prev => ({
                    ...prev!,
                    exercises: prev!.exercises?.filter(e => e.id !== exercise.id)
                  }));
                  setHasChanges(true);
                }}
                onUpdateExercise={(updatedExercise) => {
                  setEditedWorkout(prev => ({
                    ...prev!,
                    exercises: prev!.exercises?.map(e =>
                      e.id === exercise.id ? updatedExercise : e
                    )
                  }));
                  setHasChanges(true);
                }}
                onAddSet={() => handleAddSet(exercise.id || 0)}
                onDeleteSet={(setId) => {
                  setEditedWorkout(prev => ({
                    ...prev!,
                    exercises: prev!.exercises?.map(e =>
                      e.id === exercise.id
                        ? { ...e, sets: e.sets?.filter(s => s.id !== setId) }
                        : e
                    )
                  }));
                  setHasChanges(true);
                }}
                onUpdateSet={(updatedSet) => {
                  setEditedWorkout(prev => ({
                    ...prev!,
                    exercises: prev!.exercises?.map(e =>
                      e.id === exercise.id
                        ? {
                            ...e,
                            sets: e.sets?.map(s =>
                              s.id === updatedSet.id ? updatedSet : s
                            )
                          }
                        : e
                    )
                  }));
                  setHasChanges(true);
                }}
              />
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.addExerciseButton}
            onPress={handleAddExercise}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#3498db" />
            <Text style={styles.addExerciseText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    padding: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 16,
    color: '#2c3e50',
    fontSize: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutNameInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 12,
  },
  saveButton: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  exerciseList: {
    padding: 16,
  },
  exerciseContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  setsContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  exerciseOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeBasedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeBasedToggleActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginRight: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  toggleText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#2c3e50',
  },
  toggleTextActive: {
    color: '#fff',
  },
  setHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  setHeaderText: {
    flex: 1,
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  setNumber: {
    flex: 1,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  setInput: {
    flex: 1,
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 8,
  },
  addSetText: {
    color: '#3498db',
    marginLeft: 8,
    fontWeight: '600',
  },
  deleteAction: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  deleteActionContent: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  deleteSetAction: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addExerciseText: {
    color: '#3498db',
    marginLeft: 8,
    fontWeight: '600',
  },
  saveButtonPlaceholder: {
    width: 70, // Matches rough size of save button
  },
  optionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#7f8c8d',
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  timeBasedToggleDisabled: {
    opacity: 0.7,
    borderColor: '#bdc3c7',
  },
  toggleButtonDisabled: {
    opacity: 0.7,
  },
  toggleTextDisabled: {
    color: '#95a5a6',
  },
  lockIcon: {
    marginLeft: 8,
  },
});