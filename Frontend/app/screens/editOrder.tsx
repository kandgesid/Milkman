import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Modal } from 'react-native';
import { Appbar, Text, TextInput, Button } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import useCustomerOrderManagement from '../hooks/useCustomerOrderManagement';

export default function EditOrderScreen() {
  const { orderId, quantity, note, orderDate, userId } = useLocalSearchParams();
  const [milkAmount, setMilkAmount] = useState(quantity as string);
  const [noteText, setNoteText] = useState(note as string);
  const { handleOrderEdit } = useCustomerOrderManagement();

  const updateOrder = () => {
    const data = {
      requestedQuantity: parseFloat(milkAmount),
      note: noteText
    };
    console.log("updateOrder : " + data);
    handleOrderEdit(orderId as string, data);
    router.push(`../screens/myOrder?id=${userId}`);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={['#FFFFFF', '#E3F2FD', '#BBDEFB']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.container}>
          <Appbar.Header style={styles.appbar}>
            <Appbar.BackAction onPress={() => router.back()} />
            <Appbar.Content title="Edit Order" titleStyle={styles.appbarTitle} />
          </Appbar.Header>

          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              {/* Order Date Display (Read-only) */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Delivery Date</Text>
                <View style={styles.dateDisplay}>
                  <Text style={styles.dateText}>{orderDate}</Text>
                </View>
              </View>

              {/* Milk Amount Section */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Milk Amount (Liters)</Text>
                <TextInput
                  mode="outlined"
                  value={milkAmount}
                  onChangeText={setMilkAmount}
                  keyboardType="numeric"
                  style={styles.input}
                  placeholder="Enter amount in liters"
                  right={<TextInput.Affix text="L" />}
                />
              </View>

              {/* Note Section */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Note (Optional)</Text>
                <TextInput
                  mode="outlined"
                  value={noteText}
                  onChangeText={setNoteText}
                  style={[styles.input, styles.noteInput]}
                  placeholder="Add any special instructions"
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Update Order Button */}
              <Button
                mode="contained"
                onPress={updateOrder}
                style={styles.updateButton}
                labelStyle={styles.updateButtonLabel}
                icon="content-save"
              >
                Update Order
              </Button>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateDisplay: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  updateButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 16,
    elevation: 2,
  },
  updateButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
}); 