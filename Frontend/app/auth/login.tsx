import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, TextInput, Button, Surface } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import useUserManagement from '../hooks/useUserManagement';
import { User } from '../types';


export default function LoginScreen() {
  const { role } = useLocalSearchParams();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { users, handleLogin } = useUserManagement();

  const handleSubmit = () => {
    // TODO: Implement actual login logic with API
    // For now, just simulate successful login
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
      <Text variant="h4" style={styles.title}>
        Login as {role === 'MILKMAN' ? 'MILKMAN' : 'CUSTOMER'}
      </Text>
      
      <Surface elevation={2} category="medium" style={styles.form}>
        <TextInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          leading={props => <Icon name="phone" {...props} />}
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leading={props => <Icon name="lock" {...props} />}
          style={styles.input}
        />

        <Button
          title="Login"
          variant="contained"
          color="#2196F3"
          tintColor="#fff"
          onPress={handleSubmit}
          style={styles.loginButton}
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
    gap: 20,
  },
  input: {
    backgroundColor: 'transparent',
  },
  loginButton: {
    height: 45,
    marginTop: 10,
  },
  backButton: {
    height: 45,
  },
}); 