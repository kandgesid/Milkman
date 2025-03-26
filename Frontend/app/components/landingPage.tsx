import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card, TextInput, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import useUserManagement from '../hooks/useUserManagement';
import { User } from '../types';

export default function LandingPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useUserManagement();

  // Create an animated value for the login title
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSubmit = () => {
    const newUser: User = {
      name: '',
      phoneNumber: phone,
      address: '',
      email: '',
      password: password,
      confirmPassword: '',
      role: '',
    };
    handleLogin(newUser);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Card style={styles.header} elevation={2}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.headerText}>
            Welcome to MilkMate
          </Text>
        </Card.Content>
      </Card>

      {/* Middle section: Animated login title and form */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text variant="headlineLarge" style={styles.loginTitle}>
          Login
        </Text>
      </Animated.View>
      <Surface style={styles.form} elevation={2}>
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
        {/* Register section */}
        <Animated.View style={styles.registerContainer}>
          <Text variant="bodyMedium" style={styles.registerText}>
            New to MilkMate?
          </Text>
          <Button
            mode="contained"
            buttonColor="#4CAF50"
            onPress={() => router.push('/auth/register')}
            uppercase={false}
            style={styles.registerButton}
          >
            Register Now
          </Button>
        </Animated.View>
      </Surface>

      {/* Footer */}
      <Text variant="displayMedium" style={styles.footerText}>
        Made with ♥ by MilkMate
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  header: {
    alignSelf: 'stretch',
    borderRadius: 12,
    marginBottom: 10,
  },
  headerText: {
    color: '#333',
    textAlign: 'center',
  },
  loginTitle: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  form: {
    padding: 20,
    borderRadius: 12,
    alignSelf: 'stretch',
  },
  input: {
    backgroundColor: 'transparent',
    marginBottom: 15,
  },
  loginButton: {
    height: 45,
    marginBottom: 10,
  },
  registerContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
  },
  registerButton: {
    height: 45,
  },
  footerText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 12,
    marginTop: 20,
  },
});