import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const tabs = [
  { id: 'Home', icon: 'home', label: 'Home' },
  { id: 'Workouts', icon: 'dumbbell', label: 'Workouts' },
  { id: 'Analytics', icon: 'chart-bar', label: 'Analytics' },
];

export default function BottomNav({ activeTab }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => navigation.navigate(tab.id)}
        >
          <MaterialCommunityIcons 
            name={tab.icon} 
            size={24} 
            color={activeTab === tab.id.toLowerCase() ? '#3498db' : '#95a5a6'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === tab.id.toLowerCase() && styles.activeText
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 4,
  },
  activeText: {
    color: '#3498db',
  },
});