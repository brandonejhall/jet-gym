import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const filters = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
];

export default function TimeFilter({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      {filters.map(filter => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterButton,
            selected === filter.id && styles.filterButtonActive
          ]}
          onPress={() => onSelect(filter.id)}
        >
          <Text style={[
            styles.filterText,
            selected === filter.id && styles.filterTextActive
          ]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f8f9fa',
  },
  filterButtonActive: {
    backgroundColor: '#3498db',
  },
  filterText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  filterTextActive: {
    color: 'white',
  },
});