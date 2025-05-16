import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated, Dimensions, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card, TextInput, Surface, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import useUserManagement from '../hooks/useUserManagement';
import { User, UserLogin } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useUserManagement();
  const theme = useTheme();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const phoneInputAnim = useRef(new Animated.Value(0)).current;
  const passwordInputAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleInputFocus = (inputRef: Animated.Value) => {
    Animated.spring(inputRef, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 5,
    }).start();
  };

  const handleInputBlur = (inputRef: Animated.Value) => {
    Animated.spring(inputRef, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 5,
    }).start();
  };

  const handleSubmit = () => {
    const newUser: UserLogin = {
      phoneNumber: phone,
      password: password,
      role: '',
    };
    handleLogin(newUser);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#FFFFFF', '#E3F2FD', '#BBDEFB']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <Animated.View
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.header} elevation={4}>
              <Card.Content>
                <MaterialCommunityIcons
                  name="cow"
                  size={40}
                  color="#1976D2"
                  style={styles.headerIcon}
                />
                <Text variant="headlineMedium" style={styles.headerText}>
                  Welcome to MilkMate
                </Text>
                <Text variant="bodyMedium" style={styles.subHeaderText}>
                  Fresh Milk, Every Morning
                </Text>
              </Card.Content>
            </Card>
          </Animated.View>

          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Surface style={styles.form} elevation={4}>
              <View style={{ overflow: 'hidden' }}>
                <Text variant="headlineSmall" style={styles.loginTitle}>
                  Login
                </Text>
                <Animated.View 
                  style={[
                    styles.inputContainer,
                    {
                      transform: [
                        {
                          scale: phoneInputAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.02],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="phone"
                    size={24}
                    color="#1976D2"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={[styles.input, { color: '#000000' }]}
                    mode="outlined"
                    outlineColor="#1976D2"
                    activeOutlineColor="#1976D2"
                    onFocus={() => handleInputFocus(phoneInputAnim)}
                    onBlur={() => handleInputBlur(phoneInputAnim)}
                    textColor="#000000"
                  />
                </Animated.View>
                <Animated.View 
                  style={[
                    styles.inputContainer,
                    {
                      transform: [
                        {
                          scale: passwordInputAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.02],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="lock"
                    size={24}
                    color="#1976D2"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={[styles.input, { color: '#000000' }]}
                    mode="outlined"
                    outlineColor="#1976D2"
                    activeOutlineColor="#1976D2"
                    onFocus={() => handleInputFocus(passwordInputAnim)}
                    onBlur={() => handleInputBlur(passwordInputAnim)}
                    textColor="#000000"
                  />
                </Animated.View>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.loginButton}
                  uppercase={false}
                  labelStyle={styles.buttonLabel}
                >
                  Login
                </Button>
              </View>
            </Surface>

            <Animated.View style={styles.registerContainer}>
              <Text variant="bodyMedium" style={styles.registerText}>
                New to MilkMate?
              </Text>
              <Button
                mode="contained"
                onPress={() => router.push('/auth/register')}
                uppercase={false}
                style={styles.registerButton}
                labelStyle={styles.buttonLabel}
              >
                Register Now
              </Button>
            </Animated.View>
          </Animated.View>

          <Text variant="bodySmall" style={styles.footerText}>
            Made with ♥ by MilkMate
          </Text>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    padding: width * 0.05,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  header: {
    width: width * 0.9,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
  },
  headerIcon: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subHeaderText: {
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  loginTitle: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingLeft: 40,
    color: '#000000',
  },
  loginButton: {
    height: 50,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#1976D2',
  },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    marginBottom: 10,
  },
  registerButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});