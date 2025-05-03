import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Modal } from 'react-native';
import { Appbar, Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useOrderManagement from '../hooks/useOrderManagement';

export default function PlaceOrderScreen() {
  const { milkmanId, customerId } = useLocalSearchParams();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [milkAmount, setMilkAmount] = useState('');
  const [note, setNote] = useState('');
  const theme = useTheme();
  const { handlePlaceOrder } = useOrderManagement();  
  const calendarRef = useRef<View>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Always hide the date picker first to prevent state update issues
    setShowDatePicker(false);
    
    // Only update the date if a valid date was selected
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleOutsidePress = () => {
    setShowDatePicker(false);
  };

  const placeOrder = () => {
    // Format the date to ensure it's sent in the correct format
    const formattedDate = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0, 0, 0, 0
    ));

    const data = {
      milkmanId: milkmanId as string,
      customerId: customerId as string,
      orderDate: formattedDate,
      requestedQuantity: parseFloat(milkAmount),
      note: note
    }
    handlePlaceOrder(data);
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
            <Appbar.Content title="Place Order" titleStyle={styles.appbarTitle} />
          </Appbar.Header>

          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              {/* Date Picker Section */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Delivery Date</Text>
                <View style={styles.datePickerWrapper}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateButton}
                    icon="calendar"
                    textColor="#000000"
                    labelStyle={styles.dateButtonLabel}
                  >
                    {formatDate(date)}
                  </Button>
                  <Modal
                    visible={showDatePicker}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowDatePicker(false)}
                  >
                    <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
                      <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                          <View style={styles.calendarContainer}>
                            <View style={styles.calendarHeader}>
                              <Button
                                mode="text"
                                onPress={() => setShowDatePicker(false)}
                                icon="close"
                                textColor="#666"
                              >
                                Close
                              </Button>
                            </View>
                            <DateTimePicker
                              value={date}
                              mode="date"
                              display={Platform.OS === 'ios' ? 'inline' : 'default'}
                              onChange={handleDateChange}
                              minimumDate={new Date()}
                              textColor="#000000"
                              accentColor="#1976D2"
                              style={styles.calendar}
                              themeVariant="light"
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
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
                  value={note}
                  onChangeText={setNote}
                  style={[styles.input, styles.noteInput]}
                  placeholder="Add any special instructions"
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Place Order Button */}
              <Button
                mode="contained"
                onPress={placeOrder}
                style={styles.orderButton}
                labelStyle={styles.orderButtonLabel}
                icon="cart"
              >
                Place Order
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
  datePickerWrapper: {
    position: 'relative',
  },
  dateButton: {
    borderColor: '#1976D2',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
  },
  dateButtonLabel: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: Platform.OS === 'ios' ? Dimensions.get('window').width - 40 : Dimensions.get('window').width - 32,
    maxWidth: 400,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  calendar: {
    width: '100%',
    height: Platform.OS === 'ios' ? 350 : 300,
    backgroundColor: 'white',
    color: '#000000',
    alignSelf: 'center',
  },
  orderButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 16,
    elevation: 2,
  },
  orderButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
}); 