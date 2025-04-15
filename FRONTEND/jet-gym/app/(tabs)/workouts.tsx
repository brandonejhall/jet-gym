import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal, FlatList, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WorkoutList from '../../components/WorkoutList';
import WorkoutModal from '../../components/WorkoutModal';
import TimeFilter from '../../components/TimeFilter';
import { Workout, TimeFilter as TimeFilterType } from '../../types';
import { workoutService } from '../../api/services/workout';
import { exerciseService } from '../../api/services/exercise';
import { WorkoutDTO } from '@/api/types';
import { CacheService } from '@/api/services/cacheservice';
import DateTimePicker from '@react-native-community/datetimepicker';

type FilterType = 'date' | 'month' | 'year';

interface FilterState {
  type: FilterType;
  day: number | null;
  month: number | null;
  year: number;
  isCustomFilter?: boolean;
}

const FilterOption = ({ 
  label, 
  value, 
  onPress, 
  isSelected 
}: { 
  label: string;
  value: string;
  onPress: () => void;
  isSelected: boolean;
}) => (
  <TouchableOpacity
    style={[
      styles.filterOption,
      isSelected && styles.filterOptionSelected
    ]}
    onPress={onPress}
  >
    <Text style={[
      styles.filterOptionText,
      isSelected && styles.filterOptionTextSelected
    ]}>{label}</Text>
  </TouchableOpacity>
);

const FilterIndicator = ({ filter, onClear, timeFilter }: { 
  filter: FilterState; 
  onClear: () => void;
  timeFilter: TimeFilterType;
}) => {
  const getFilterText = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // For quick select filters (timeFilter)
    if (!filter.isCustomFilter) {
      const now = new Date();
      switch(timeFilter) {
        case 'week': {
          const start = getStartOfWeek(now);
          const end = getEndOfWeek(now);
          return `Current Week (${start.getDate()} ${monthNames[start.getMonth()]} - ${end.getDate()} ${monthNames[end.getMonth()]})`;
        }
        case 'month':
          return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
        case 'year':
          return `${now.getFullYear()}`;
      }
    }
    
    // For custom filters
    switch(filter.type) {
      case 'date':
        return filter.day && filter.month !== null
          ? `${filter.day} ${monthNames[filter.month]} ${filter.year}`
          : '';
      case 'month':
        return filter.month !== null
          ? `${monthNames[filter.month]} ${filter.year}`
          : '';
      case 'year':
        return `${filter.year}`;
      default:
        return '';
    }
  };
  
  const filterText = getFilterText();
  if (!filterText) return null;

  return (
    <View style={styles.filterIndicatorContainer}>
      <Text style={styles.filterIndicatorText}>{filterText}</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClear}>
        <MaterialCommunityIcons name="close" size={16} color="#3498db" />
      </TouchableOpacity>
    </View>
  );
};

const FilterModal = ({ 
  visible, 
  onClose, 
  onApply,
  initialFilter
}: { 
  visible: boolean;
  onClose: () => void;
  onApply: (filter: FilterState) => void;
  initialFilter: FilterState;
}) => {
  const [filterType, setFilterType] = useState<FilterType>(initialFilter.type);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setFilterType(initialFilter.type);
      const date = new Date();
      if (initialFilter.year) {
        date.setFullYear(initialFilter.year);
      }
      if (initialFilter.month !== null) {
        date.setMonth(initialFilter.month);
      }
      if (initialFilter.day !== null) {
        date.setDate(initialFilter.day);
      }
      setSelectedDate(date);
    }
  }, [visible, initialFilter]);

  const handleFilterTypeChange = (type: FilterType) => {
    setFilterType(type);
    setShowPicker(true);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowPicker(false);
    if (date) {
      if (filterType === 'year') {
        const currentDate = new Date(selectedDate);
        currentDate.setFullYear(date.getFullYear());
        setSelectedDate(currentDate);
      } else if (filterType === 'month') {
        const currentDate = new Date(selectedDate);
        currentDate.setFullYear(date.getFullYear());
        currentDate.setMonth(date.getMonth());
        setSelectedDate(currentDate);
      } else {
        setSelectedDate(date);
      }
    }
  };

  const renderDateDisplay = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (filterType === 'year') {
      return selectedDate.getFullYear().toString();
    } else if (filterType === 'month') {
      return `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    } else {
      const day = selectedDate.getDate();
      const month = monthNames[selectedDate.getMonth()];
      const year = selectedDate.getFullYear();
      return `${day} ${month} ${year}`;
    }
  };

  const renderDatePicker = () => {
    if (!showPicker) {
      return (
        <TouchableOpacity 
          style={styles.dateDisplay}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateDisplayText}>{renderDateDisplay()}</Text>
          <MaterialCommunityIcons name="calendar" size={24} color="#4B5563" />
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.datePickerContainer}>
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date(new Date().getFullYear() - 2, 0, 1)}
          maximumDate={new Date()}
        />
        <Text style={styles.hintText}>
          {filterType === 'year' 
            ? 'Select a year'
            : filterType === 'month'
            ? 'Select a month and year'
            : 'Select a date'}
        </Text>
      </View>
    );
  };

  const handleApply = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    onApply({
      type: filterType,
      year,
      month: filterType === 'year' ? null : month,
      day: filterType === 'date' ? day : null
    });
    onClose();
  };

  const handleReset = () => {
    const now = new Date();
    setFilterType('month');
    setSelectedDate(now);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Custom Filter</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterTypeContainer}>
            <Text style={styles.filterLabel}>Filter by:</Text>
            <View style={styles.filterTypeOptions}>
              <FilterOption
                label="Date"
                value="date"
                isSelected={filterType === 'date'}
                onPress={() => handleFilterTypeChange('date')}
              />
              <FilterOption
                label="Month"
                value="month"
                isSelected={filterType === 'month'}
                onPress={() => handleFilterTypeChange('month')}
              />
              <FilterOption
                label="Year"
                value="year"
                isSelected={filterType === 'year'}
                onPress={() => handleFilterTypeChange('year')}
              />
            </View>
          </View>

          <View style={styles.selectorsContainer}>
            {renderDatePicker()}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStartOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  return new Date(date.setDate(diff));
};

const getEndOfWeek = (date: Date) => {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
};

export default function WorkoutManagementScreen() {
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('week');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDTO | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = 1; // Changed to number to match DTO type
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterState & { isCustomFilter?: boolean }>({
    type: 'month',
    day: null,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    isCustomFilter: false
  });
  const [displayedWorkouts, setDisplayedWorkouts] = useState<WorkoutDTO[]>([]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const response: WorkoutDTO[] | null = await CacheService.getItem('workouts');
      setWorkouts(response || []);
    } catch (error) {
      console.error('Failed to load workouts:', error);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId: number) => {
    try {
      await workoutService.deleteWorkout({ userId, workoutId });
      setWorkouts(workouts.filter(w => w.id !== workoutId));
    } catch (error) {
      console.error('Failed to delete workout:', error);
    }
  };

  const handleAddWorkout = async () => {
    const newWorkout: WorkoutDTO = {
      userId,
      name: 'New Workout',
      date: new Date().toISOString(),
      notes: '',
      duration: 0,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      completed: false,
      exercises: []
    };

    try {
      const response = await workoutService.createWorkout(newWorkout);
      if (response) {
        setWorkouts([response, ...workouts]);
        setSelectedWorkout(response);
      }
    } catch (error) {
      console.error('Failed to create workout:', error);
      // Fallback to mock behavior
      const mockNewWorkout = {
        id: Date.now(),
        ...newWorkout
      };
      setWorkouts([mockNewWorkout, ...workouts]);
      setSelectedWorkout(mockNewWorkout);
    }
  };

  const handleTimeFilterChange = (filter: TimeFilterType) => {
    setTimeFilter(filter);
    const now = new Date();
    
    switch(filter) {
      case 'week': {
        const startOfWeek = getStartOfWeek(new Date());
        const endOfWeek = getEndOfWeek(new Date());
        const weekWorkouts = workouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          return workoutDate >= startOfWeek && workoutDate <= endOfWeek;
        });
        setDisplayedWorkouts(weekWorkouts);
        setActiveFilter({
          type: 'date',
          day: null,
          month: now.getMonth(),
          year: now.getFullYear(),
          isCustomFilter: false
        });
        break;
      }
      case 'month': {
        const monthWorkouts = workouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          return workoutDate.getMonth() === now.getMonth() && 
                 workoutDate.getFullYear() === now.getFullYear();
        });
        setDisplayedWorkouts(monthWorkouts);
        setActiveFilter({
          type: 'month',
          day: null,
          month: now.getMonth(),
          year: now.getFullYear(),
          isCustomFilter: false
        });
        break;
      }
      case 'year': {
        const yearWorkouts = workouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          return workoutDate.getFullYear() === now.getFullYear();
        });
        setDisplayedWorkouts(yearWorkouts);
        setActiveFilter({
          type: 'year',
          day: null,
          month: null,
          year: now.getFullYear(),
          isCustomFilter: false
        });
        break;
      }
    }
  };

  const applyFilter = (filter: FilterState) => {
    setActiveFilter({ ...filter, isCustomFilter: true });
    setFilterModalVisible(false);
    
    const filteredWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      const workoutYear = workoutDate.getFullYear();
      const workoutMonth = workoutDate.getMonth();
      const workoutDay = workoutDate.getDate();
      
      switch(filter.type) {
        case 'date':
          return workoutYear === filter.year && 
                 workoutMonth === filter.month && 
                 workoutDay === filter.day;
        case 'month':
          return workoutYear === filter.year && 
                 workoutMonth === filter.month;
        case 'year':
          return workoutYear === filter.year;
        default:
          return true;
      }
    });
    
    setDisplayedWorkouts(filteredWorkouts);
  };
  
  const clearFilter = () => {
    // Reset to Month quick select filter
    handleTimeFilterChange('month');
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  useEffect(() => {
    // When workouts change, reapply the current time filter
    handleTimeFilterChange(timeFilter);
  }, [workouts]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.filterTypeOptions}>
            <FilterOption
              label="Week"
              value="week"
              isSelected={timeFilter === 'week'}
              onPress={() => handleTimeFilterChange('week')}
            />
            <FilterOption
              label="Month"
              value="month"
              isSelected={timeFilter === 'month'}
              onPress={() => handleTimeFilterChange('month')}
            />
            <FilterOption
              label="Year"
              value="year"
              isSelected={timeFilter === 'year'}
              onPress={() => handleTimeFilterChange('year')}
            />
          </View>
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => setFilterModalVisible(true)}
          >
            <MaterialCommunityIcons name="filter-variant" size={24} color="#4A90E2" />
            {activeFilter.isCustomFilter && <View style={styles.filterDot} />}
          </TouchableOpacity>
        </View>

        <FilterIndicator 
          filter={activeFilter} 
          onClear={clearFilter} 
          timeFilter={timeFilter}
        />
        
        <WorkoutList
          workouts={displayedWorkouts}
          onWorkoutPress={setSelectedWorkout}
          onDeleteWorkout={handleDeleteWorkout}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddWorkout}
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>

        <WorkoutModal
          visible={!!selectedWorkout}
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
          onSave={(updatedWorkout) => {
            setWorkouts(workouts.map(w => 
              w.id === updatedWorkout.id ? updatedWorkout : w
            ));
            setSelectedWorkout(null);
          }}
        />

        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          onApply={applyFilter}
          initialFilter={activeFilter}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    padding: 8,
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3498db',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  filterTypeContainer: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  selectorsContainer: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 16,
  },
  applyButton: {
    flex: 1,
    marginLeft: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  filterIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    marginLeft: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  filterIndicatorText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 4,
    backgroundColor: '#F3F4F6',
  },
  filterOptionSelected: {
    backgroundColor: '#3498db',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
  filterTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  optionsContainer: {
    maxHeight: 300,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  dateDisplayText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  datePickerContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 16,
  },
  hintText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});