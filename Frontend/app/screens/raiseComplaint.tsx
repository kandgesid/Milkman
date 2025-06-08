import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Text, TextInput, Button, Surface, useTheme } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useCustomerComplaintsManagement from '../hooks/useCustomerComplaintsManagement';

export default function RaiseComplaintScreen() {
  const { milkmanId, customerId } = useLocalSearchParams();
  const theme = useTheme();
  const [complaintText, setComplaintText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleRaiseComplaint } = useCustomerComplaintsManagement();
  const handleSubmit = () => {
    if (!complaintText.trim()) {
      // Show error message
      return;
    }

    setIsSubmitting(true);
     handleRaiseComplaint({
      milkmanId: milkmanId as string,
      customerId: customerId as string,
      description: complaintText,
      category: 'Default'
     });
     setIsSubmitting(false);
     router.push(`../screens/myComplaints?id=${customerId}`);
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#E3F2FD', '#BBDEFB']}
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Raise Complaint" titleStyle={styles.appbarTitle} />
        </Appbar.Header>

        <ScrollView style={styles.scrollView}>
          <Surface style={styles.formContainer}>
            <Text style={styles.formTitle}>Complaint Details</Text>
            
            {/* Complaint Text */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Complaint Description</Text>
              <TextInput
                mode="outlined"
                multiline
                numberOfLines={4}
                value={complaintText}
                onChangeText={setComplaintText}
                placeholder="Describe your complaint in detail..."
                style={styles.complaintInput}
                theme={{ colors: { primary: '#1976D2', text: '#000000' } }}
                textColor="#000000"
              />
            </View>

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting || !complaintText.trim()}
              style={styles.submitButton}
              labelStyle={styles.submitButtonLabel}
            >
              Submit Complaint
            </Button>
          </Surface>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  appbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 0,
  },
  appbarTitle: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 8,
  },
  complaintInput: {
    backgroundColor: 'transparent',
    color: '#000000',
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 8,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
}); 