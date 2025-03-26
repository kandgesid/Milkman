import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import useUserManagement from '../hooks/useUserManagement';
import { User } from '../types';

export default function LoginScreen() {
  const { role } = useLocalSearchParams();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useUserManagement();

  const handleSubmit = () => {
    // TODO: Implement actual login logic with API
    const newUser: User = {
      name: '',
      phoneNumber: phone,
      address: '',
      email: '',
      password: password,
      confirmPassword: '',
      role: typeof role === 'string' ? role : role[0],
    };
    handleLogin(newUser);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Login as {role === 'MILKMAN' ? 'MILKMAN' : 'CUSTOMER'}
      </Text>
      
      <Surface elevation={2} style={styles.form}>
        <TextInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          left={<TextInput.Icon icon="phone" />}
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          left={<TextInput.Icon icon="lock" />}
          style={styles.input}
        />

        <Button
          mode="contained"
          buttonColor="#2196F3"
          onPress={handleSubmit}
          style={styles.loginButton}
          uppercase={false}
        >
          Login
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
  form: {
    padding: 20,
    borderRadius: 12,
    // Using marginBottom on children for spacing is a safe alternative to gap.
  },
  input: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  loginButton: {
    height: 45,
    marginTop: 10,
    marginBottom: 10,
  },
  backButton: {
    height: 45,
  },
});