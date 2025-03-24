import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text, TextInput, Button, Surface } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import useUserManagement from '../hooks/useUserManagement';
import { User } from '../types';

interface FormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
}

export default function RegisterScreen() {
  const { users, handleSubmit } = useUserManagement();
  const [selectedRole, setSelectedRole] = useState<'MILKMAN' | 'CUSTOMER' | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const handleRegister = () => {
    const newUser: User = {
      name: formData.name,
      phoneNumber: formData.phone,
      address: formData.address,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
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
        <Text variant="h4" style={styles.title}>Register as</Text>
        
        <Surface elevation={2} category="medium" style={styles.roleContainer}>
          <Button
            title="🧑‍🌾 Milkman"
            variant="contained"
            color="#2196F3"
            tintColor="#fff"
            onPress={() => setSelectedRole('MILKMAN')}
            style={styles.roleButton}
            uppercase={false}
          />

          <Button
            title="🧑 Customer"
            variant="contained"
            color="#2196F3"
            tintColor="#fff"
            onPress={() => setSelectedRole('CUSTOMER')}
            style={styles.roleButton}
            uppercase={false}
          />

          <Button
            title="Go Back"
            variant="outlined"
            color="#666"
            onPress={() => router.back()}
            style={styles.backButton}
            uppercase={false}
          />
        </Surface>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text variant="h4" style={styles.title}>
        Register as {selectedRole === 'MILKMAN' ? 'MILKMAN' : 'CUSTOMER'}
      </Text>
      
      <Surface elevation={2} category="medium" style={styles.form}>
        <TextInput
          label="Full Name"
          value={formData.name}
          onChangeText={(value) => updateFormData('name', value)}
          leading={props => <Icon name="account" {...props} />}
          style={styles.input}
        />

        <TextInput
          label="Phone Number"
          value={formData.phone}
          onChangeText={(value) => updateFormData('phone', value)}
          keyboardType="phone-pad"
          leading={props => <Icon name="phone" {...props} />}
          style={styles.input}
        />

        <TextInput
          label="Email (Optional)"
          value={formData.email}
          onChangeText={(value) => updateFormData('email', value)}
          keyboardType="email-address"
          leading={props => <Icon name="email" {...props} />}
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={formData.password}
          onChangeText={(value) => updateFormData('password', value)}
          secureTextEntry
          leading={props => <Icon name="lock" {...props} />}
          style={styles.input}
        />

        <TextInput
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(value) => updateFormData('confirmPassword', value)}
          secureTextEntry
          leading={props => <Icon name="lock-check" {...props} />}
          style={styles.input}
        />

        <TextInput
          label="Address"
          value={formData.address}
          onChangeText={(value) => updateFormData('address', value)}
          multiline
          numberOfLines={3}
          leading={props => <Icon name="map-marker" {...props} />}
          style={[styles.input, styles.addressInput]}
        />

        <Button
          title="Register"
          variant="contained"
          color="#4CAF50"
          tintColor="#fff"
          onPress={handleRegister}
          style={styles.registerButton}
          uppercase={false}
        />

        <Button
          title="Change Role"
          variant="outlined"
          color="#666"
          onPress={() => setSelectedRole(null)}
          style={styles.backButton}
          uppercase={false}
        />
      </Surface>
    </ScrollView>
  );
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
    gap: 20,
  },
  roleButton: {
    height: 50,
  },
  form: {
    padding: 20,
    borderRadius: 12,
    gap: 20,
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'transparent',
  },
  addressInput: {
    height: 100,
  },
  registerButton: {
    height: 45,
    marginTop: 10,
  },
  backButton: {
    height: 45,
  },
}); 