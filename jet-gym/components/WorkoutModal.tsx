import React, { useState, useEffect } from 'react';
import { Exercise, Set, Workout } from '../types';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface ExerciseItemProps {
  exercise: Exercise;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateExercise: (exercise: Exercise) => void;
  onAddSet: () => void;
  onDeleteSet: (setId: string) => void;
  onUpdateSet: (set: Set) => void;
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
  const renderRightActions = (progress, dragX) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={onDelete}
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
          <View style={styles.setHeader}>
            <Text style={styles.setHeaderText}>Set</Text>
            <Text style={styles.setHeaderText}>Weight</Text>
            <Text style={styles.setHeaderText}>Reps</Text>
          </View>
          
          {exercise.sets.map((set, index) => (
            <Swipeable
              key={set.id}
              renderRightActions={() => (
                <TouchableOpacity
                  style={styles.deleteSetAction}
                  onPress={() => onDeleteSet(set.id)}
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
                    onUpdateSet({ ...set, weight: parseInt(text) || 0 })
                  }
                />
                <TextInput
                  style={styles.setInput}
                  value={String(set.reps)}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    onUpdateSet({ ...set, reps: parseInt(text) || 0 })
                  }
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
  workout: Workout | null;
  onClose: () => void;
  onSave: (workout: Workout) => void;
}

export default function WorkoutModal({ visible, workout, onClose, onSave }: WorkoutModalProps) {
  const [editedWorkout, setEditedWorkout] = useState(null);
  const [expandedExercises, setExpandedExercises] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (workout) {
      setEditedWorkout({ ...workout });
      setExpandedExercises({});
      setHasChanges(false);
    }
  }, [workout]);

  const toggleExercise = (exerciseId) => {
    setExpandedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const handleAddExercise = () => {
    const newExercise = {
      id: String(Date.now()),
      name: 'New Exercise',
      sets: [],
    };
    setEditedWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
    setExpandedExercises(prev => ({
      ...prev,
      [newExercise.id]: true
    }));
    setHasChanges(true);
  };

  const handleAddSet = (exerciseId) => {
    const exercise = editedWorkout.exercises.find(e => e.id === exerciseId);
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet = {
      id: String(Date.now()),
      weight: lastSet ? lastSet.weight : 0,
      reps: lastSet ? lastSet.reps : 0,
      completed: false,
    };
    
    setEditedWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(e =>
        e.id === exerciseId
          ? { ...e, sets: [...e.sets, newSet] }
          : e
      )
    }));
    setHasChanges(true);
  };

  if (!visible || !editedWorkout) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TextInput
              style={styles.workoutName}
              value={editedWorkout.name}
              onChangeText={(text) => {
                setEditedWorkout(prev => ({ ...prev, name: text }));
                setHasChanges(true);
              }}
            />
            <View style={styles.headerButtons}>
              {hasChanges && (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => onSave(editedWorkout)}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <MaterialCommunityIcons name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.exerciseList}>
            {editedWorkout.exercises.map(exercise => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                isExpanded={expandedExercises[exercise.id]}
                onToggle={() => toggleExercise(exercise.id)}
                onDelete={() => {
                  setEditedWorkout(prev => ({
                    ...prev,
                    exercises: prev.exercises.filter(e => e.id !== exercise.id)
                  }));
                  setHasChanges(true);
                }}
                onUpdateExercise={(updatedExercise) => {
                  setEditedWorkout(prev => ({
                    ...prev,
                    exercises: prev.exercises.map(e =>
                      e.id === exercise.id ? updatedExercise : e
                    )
                  }));
                  setHasChanges(true);
                }}
                onAddSet={() => handleAddSet(exercise.id)}
                onDeleteSet={(setId) => {
                  setEditedWorkout(prev => ({
                    ...prev,
                    exercises: prev.exercises.map(e =>
                      e.id === exercise.id
                        ? { ...e, sets: e.sets.filter(s => s.id !== setId) }
                        : e
                    )
                  }));
                  setHasChanges(true);
                }}
                onUpdateSet={(updatedSet) => {
                  setEditedWorkout(prev => ({
                    ...prev,
                    exercises: prev.exercises.map(e =>
                      e.id === exercise.id
                        ? {
                            ...e,
                            sets: e.sets.map(s =>
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
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  exerciseList: {
    padding: 16,
  },
  exerciseContainer: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
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
});