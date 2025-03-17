import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const SIDEBAR_WIDTH = Dimensions.get('window').width * 0.8;

const menuItems = [
  { id: 'account', icon: 'account-cog', label: 'Account Settings' },
  { id: 'preferences', icon: 'cog', label: 'App Preferences' },
  { id: 'help', icon: 'help-circle', label: 'Help & Support' },
  { id: 'about', icon: 'information', label: 'About' },
];

export default function Sidebar({ visible, onClose }) {
  const translateX = React.useRef(new Animated.Value(SIDEBAR_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <BlurView intensity={20} style={StyleSheet.absoluteFill}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View
            style={[
              styles.sidebar,
              { transform: [{ translateX }] }
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <MaterialCommunityIcons name="close" size={24} color="#7f8c8d" />
            </TouchableOpacity>

            <View style={styles.profileSection}>
              <Image
                source={{ uri: 'https://api.a0.dev/assets/image?text=profile%20photo%20of%20athletic%20person&aspect=1:1' }}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>Alex Johnson</Text>
              <View style={styles.membershipBadge}>
                <MaterialCommunityIcons name="star" size={16} color="#f1c40f" />
                <Text style={styles.membershipText}>Premium Member</Text>
              </View>
            </View>

            <View style={styles.menuSection}>
              {menuItems.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color="#2c3e50"
                  />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.logoutButton}>
              <MaterialCommunityIcons name="logout" size={24} color="#e74c3c" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9e6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  membershipText: {
    marginLeft: 6,
    color: '#f1c40f',
    fontWeight: '600',
  },
  menuSection: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#2c3e50',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 32,
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
  },
});