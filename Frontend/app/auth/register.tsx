import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import useUserManagement from '../hooks/useUserManagement';
import { User } from '../types';

interface FormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  noOfFamilyMembers: string;
  dailyMilkRequired: string;
}

export default function RegisterScreen() {
  const { handleSubmit } = useUserManagement();
  const [selectedRole, setSelectedRole] = useState<'MILKMAN' | 'CUSTOMER' | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    noOfFamilyMembers: '',
    dailyMilkRequired: ''
  });

  const handleRegister = () => {
    const newUser: User = {
      name: formData.name,
      phoneNumber: formData.phone,
      address: formData.address,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      noOfFamilyMembers: formData.noOfFamilyMembers,
      dailyMilkRequired: formData.dailyMilkRequired,
      role: selectedRole ? selectedRole : '',
    };
    handleSubmit(newUser);
  };

  const updateFormData = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (!selectedRole) {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Register as
        </Text>
        <Surface elevation={2} style={styles.roleContainer}>
          <Button
            mode="contained"
            buttonColor="#2196F3"
            onPress={() => setSelectedRole('MILKMAN')}
            style={styles.roleButton}
            uppercase={false}
          >
            🧑‍🌾 Milkman
          </Button>

          <Button
            mode="contained"
            buttonColor="#2196F3"
            onPress={() => setSelectedRole('CUSTOMER')}
            style={styles.roleButton}
            uppercase={false}
          >
            🧑 Customer
          </Button>

          <Button
            mode="outlined"
            textColor="#666"
            onPress={() => router.back()}
            style={styles.backButton}
            uppercase={false}
          >
            Go Back
          </Button>
        </Surface>
      </View>
    );
  }

  if(selectedRole == "MILKMAN"){
    return (
      <ScrollView style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Register as MILKMAN
        </Text>
        
        <Surface elevation={2} style={styles.form}>
          <TextInput
            label="Full Name"
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            left={<TextInput.Icon icon="account" />}
            style={styles.input}
          />
  
          <TextInput
            label="Phone Number"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
            style={styles.input}
          />
  
          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
          />
  
          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            secureTextEntry
            left={<TextInput.Icon icon="lock" />}
            style={styles.input}
          />
  
          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            secureTextEntry
            left={<TextInput.Icon icon="lock-check" />}
            style={styles.input}
          />
  
          <TextInput
            label="Address"
            value={formData.address}
            onChangeText={(value) => updateFormData('address', value)}
            multiline
            numberOfLines={3}
            left={<TextInput.Icon icon="map-marker" />}
            style={[styles.input, styles.addressInput]}
          />
  
          <Button
            mode="contained"
            buttonColor="#4CAF50"
            onPress={handleRegister}
            style={styles.registerButton}
            uppercase={false}
          >
            Register
          </Button>
  
          <Button
            mode="outlined"
            textColor="#666"
            onPress={() => setSelectedRole(null)}
            style={styles.backButton}
            uppercase={false}
          >
            Change Role
          </Button>
        </Surface>
      </ScrollView>
    );
  }else{
    return (
      <ScrollView style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Register as CUSTOMER
        </Text>
        
        <Surface elevation={2} style={styles.form}>
          <TextInput
            label="Full Name"
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            left={<TextInput.Icon icon="account" />}
            style={styles.input}
          />
  
          <TextInput
            label="Phone Number"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
            style={styles.input}
          />
  
          <TextInput
            label="Email (Optional)"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
          />
  
          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            secureTextEntry
            left={<TextInput.Icon icon="lock" />}
            style={styles.input}
          />
  
          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            secureTextEntry
            left={<TextInput.Icon icon="lock-check" />}
            style={styles.input}
          />
  
          <TextInput
            label="Address"
            value={formData.address}
            onChangeText={(value) => updateFormData('address', value)}
            multiline
            numberOfLines={3}
            left={<TextInput.Icon icon="map-marker" />}
            style={[styles.input, styles.addressInput]}
          />

          <TextInput
            label="Number of family members"
            value={formData.noOfFamilyMembers}
            onChangeText={(value) => updateFormData('noOfFamilyMembers', value)}
            left={<TextInput.Icon icon="map-marker" />}
            style={[styles.input]}
          />

          <TextInput
            label="Amount of milk required (Daily)"
            value={formData.dailyMilkRequired}
            onChangeText={(value) => updateFormData('dailyMilkRequired', value)}
            left={<TextInput.Icon icon="map-marker" />}
            style={[styles.input]}
          />  
  
          <Button
            mode="contained"
            buttonColor="#4CAF50"
            onPress={handleRegister}
            style={styles.registerButton}
            uppercase={false}
          >
            Register
          </Button>
  
          <Button
            mode="outlined"
            textColor="#666"
            onPress={() => setSelectedRole(null)}
            style={styles.backButton}
            uppercase={false}
          >
            Change Role
          </Button>
        </Surface>
      </ScrollView>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    color: '#333',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  roleContainer: {
    padding: 20,
    borderRadius: 12,
  },
  roleButton: {
    marginBottom: 20,
    height: 50,
  },
  form: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  addressInput: {
    height: 100,
  },
  registerButton: {
    height: 45,
    marginTop: 10,
    marginBottom: 10,
  },
  backButton: {
    height: 45,
  },
});