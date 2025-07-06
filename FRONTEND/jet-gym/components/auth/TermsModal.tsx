import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TermsModal({ visible, onClose }: TermsModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Terms and Conditions</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#2c3e50" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using JetGym, you accept and agree to be bound by the terms and provision of this agreement.
          </Text>

          <Text style={styles.sectionTitle}>2. Use License</Text>
          <Text style={styles.paragraph}>
            Permission is granted to temporarily download one copy of the app per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </Text>
          <Text style={styles.bulletPoint}>• Modify or copy the materials</Text>
          <Text style={styles.bulletPoint}>• Use the materials for any commercial purpose or for any public display</Text>
          <Text style={styles.bulletPoint}>• Attempt to reverse engineer any software contained in the app</Text>
          <Text style={styles.bulletPoint}>• Remove any copyright or other proprietary notations from the materials</Text>

          <Text style={styles.sectionTitle}>3. Health and Safety Disclaimer</Text>
          <Text style={styles.paragraph}>
            JetGym is designed to help you track your fitness activities. However, we strongly recommend that you:
          </Text>
          <Text style={styles.bulletPoint}>• Consult with a healthcare provider before starting any new exercise program</Text>
          <Text style={styles.bulletPoint}>• Listen to your body and stop exercising if you experience pain or discomfort</Text>
          <Text style={styles.bulletPoint}>• Use proper form and technique when performing exercises</Text>
          <Text style={styles.bulletPoint}>• Start slowly and gradually increase intensity</Text>

          <Text style={styles.sectionTitle}>4. Privacy Policy</Text>
          <Text style={styles.paragraph}>
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using JetGym, you agree to our Privacy Policy.
          </Text>

          <Text style={styles.sectionTitle}>5. User Account</Text>
          <Text style={styles.paragraph}>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </Text>

          <Text style={styles.sectionTitle}>6. Prohibited Uses</Text>
          <Text style={styles.paragraph}>
            You may not use JetGym for any unlawful purpose or to solicit others to perform unlawful acts. You may not use the app to:
          </Text>
          <Text style={styles.bulletPoint}>• Harass, abuse, or harm another person</Text>
          <Text style={styles.bulletPoint}>• Submit false or misleading information</Text>
          <Text style={styles.bulletPoint}>• Upload or transmit viruses or any other type of malicious code</Text>
          <Text style={styles.bulletPoint}>• Collect or track the personal information of others</Text>

          <Text style={styles.sectionTitle}>7. Termination</Text>
          <Text style={styles.paragraph}>
            We may terminate or suspend your account and bar access to the app immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </Text>

          <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            In no event shall JetGym, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the app.
          </Text>

          <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
          </Text>

          <Text style={styles.sectionTitle}>10. Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms and Conditions, please contact us at support@jetgym.com
          </Text>

          <Text style={styles.lastUpdated}>
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: '#495057',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 20,
    color: '#495057',
    marginLeft: 16,
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    fontStyle: 'italic',
  },
}); 