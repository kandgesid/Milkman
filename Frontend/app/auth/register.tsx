import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { Text, TextInput, Button, Surface, useTheme } from 'react-native-paper';
import useUserManagement from '../hooks/useUserManagement';
import { User } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

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
  const theme = useTheme();
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

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const roleAnim = useRef(new Animated.Value(0)).current;
  const inputAnim = useRef(new Animated.Value(0)).current;

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

  const handleInputFocus = () => {
    Animated.spring(inputAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 5,
    }).start();
  };

  const handleInputBlur = () => {
    Animated.spring(inputAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 5,
    }).start();
  };

  const handleRoleSelect = (role: 'MILKMAN' | 'CUSTOMER') => {
    setSelectedRole(role);
    Animated.spring(roleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 5,
    }).start();
  };

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
              <Surface elevation={4} style={styles.header}>
                <MaterialCommunityIcons
                  name="cow"
                  size={40}
                  color="#1976D2"
                  style={styles.headerIcon}
                />
                <Text variant="headlineMedium" style={styles.title}>
                  Join MilkMate
                </Text>
                <Text variant="bodyMedium" style={styles.subTitle}>
                  Choose your role to get started
                </Text>
              </Surface>
            </Animated.View>

            <Animated.View
              style={[
                styles.roleContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Surface elevation={2} style={styles.roleSurface}>
                <Button
                  mode="contained"
                  buttonColor="#1976D2"
                  onPress={() => handleRoleSelect('MILKMAN')}
                  style={styles.roleButton}
                  uppercase={false}
                  icon="account-tie"
                  labelStyle={styles.buttonLabel}
                >
                  Milkman
                </Button>

                <Button
                  mode="contained"
                  buttonColor="#1976D2"
                  onPress={() => handleRoleSelect('CUSTOMER')}
                  style={styles.roleButton}
                  uppercase={false}
                  icon="account"
                  labelStyle={styles.buttonLabel}
                >
                  Customer
                </Button>

                <Button
                  mode="outlined"
                  textColor="#1976D2"
                  onPress={() => router.back()}
                  style={styles.backButton}
                  uppercase={false}
                  icon="arrow-left"
                  labelStyle={styles.buttonLabel}
                >
                  Go Back
                </Button>
              </Surface>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }

  const renderForm = () => (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Surface elevation={4} style={styles.header}>
          <MaterialCommunityIcons
            name={selectedRole === 'MILKMAN' ? 'account-tie' : 'account'}
            size={40}
            color="#1976D2"
            style={styles.headerIcon}
          />
          <Text variant="headlineMedium" style={styles.title}>
            Register as {selectedRole}
          </Text>
          <Text variant="bodyMedium" style={styles.subTitle}>
            Fill in your details to get started
          </Text>
        </Surface>
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
          <Animated.View 
            style={[
              styles.inputContainer,
              {
                transform: [
                  {
                    scale: inputAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.02],
                    }),
                  },
                ],
              },
            ]}
          >
            <MaterialCommunityIcons
              name="account"
              size={24}
              color="#1976D2"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              mode="outlined"
              style={[styles.input, { color: '#000000' }]}
              outlineColor="#1976D2"
              activeOutlineColor="#1976D2"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              textColor="#000000"
            />
          </Animated.View>

          <Animated.View 
            style={[
              styles.inputContainer,
              {
                transform: [
                  {
                    scale: inputAnim.interpolate({
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
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              keyboardType="phone-pad"
              mode="outlined"
              style={[styles.input, { color: '#000000' }]}
              outlineColor="#1976D2"
              activeOutlineColor="#1976D2"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              textColor="#000000"
            />
          </Animated.View>

          <Animated.View 
            style={[
              styles.inputContainer,
              {
                transform: [
                  {
                    scale: inputAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.02],
                    }),
                  },
                ],
              },
            ]}
          >
            <MaterialCommunityIcons
              name="email"
              size={24}
              color="#1976D2"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder={selectedRole === 'CUSTOMER' ? "Email (Optional)" : "Email"}
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              mode="outlined"
              style={[styles.input, { color: '#000000' }]}
              outlineColor="#1976D2"
              activeOutlineColor="#1976D2"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              textColor="#000000"
            />
          </Animated.View>

          <Animated.View 
            style={[
              styles.inputContainer,
              {
                transform: [
                  {
                    scale: inputAnim.interpolate({
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
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              secureTextEntry
              mode="outlined"
              style={[styles.input, { color: '#000000' }]}
              outlineColor="#1976D2"
              activeOutlineColor="#1976D2"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              textColor="#000000"
            />
          </Animated.View>

          <Animated.View 
            style={[
              styles.inputContainer,
              {
                transform: [
                  {
                    scale: inputAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.02],
                    }),
                  },
                ],
              },
            ]}
          >
            <MaterialCommunityIcons
              name="lock-check"
              size={24}
              color="#1976D2"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              secureTextEntry
              mode="outlined"
              style={[styles.input, { color: '#000000' }]}
              outlineColor="#1976D2"
              activeOutlineColor="#1976D2"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              textColor="#000000"
            />
          </Animated.View>

          <Animated.View 
            style={[
              styles.inputContainer,
              {
                transform: [
                  {
                    scale: inputAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.02],
                    }),
                  },
                ],
              },
            ]}
          >
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color="#1976D2"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Address"
              value={formData.address}
              onChangeText={(value) => updateFormData('address', value)}
              multiline
              numberOfLines={3}
              mode="outlined"
              style={[styles.input, styles.addressInput, { color: '#000000' }]}
              outlineColor="#1976D2"
              activeOutlineColor="#1976D2"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              textColor="#000000"
            />
          </Animated.View>

          {selectedRole === 'CUSTOMER' && (
            <>
              <Animated.View 
                style={[
                  styles.inputContainer,
                  {
                    transform: [
                      {
                        scale: inputAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.02],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="account-group"
                  size={24}
                  color="#1976D2"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Number of family members"
                  value={formData.noOfFamilyMembers}
                  onChangeText={(value) => updateFormData('noOfFamilyMembers', value)}
                  keyboardType="numeric"
                  mode="outlined"
                  style={[styles.input, { color: '#000000' }]}
                  outlineColor="#1976D2"
                  activeOutlineColor="#1976D2"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  textColor="#000000"
                />
              </Animated.View>

              <Animated.View 
                style={[
                  styles.inputContainer,
                  {
                    transform: [
                      {
                        scale: inputAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.02],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="bottle-soda"
                  size={24}
                  color="#1976D2"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Amount of milk required (Daily)"
                  value={formData.dailyMilkRequired}
                  onChangeText={(value) => updateFormData('dailyMilkRequired', value)}
                  keyboardType="numeric"
                  mode="outlined"
                  style={[styles.input, { color: '#000000' }]}
                  outlineColor="#1976D2"
                  activeOutlineColor="#1976D2"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  textColor="#000000"
                />
              </Animated.View>
            </>
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              buttonColor="#1976D2"
              onPress={handleRegister}
              style={styles.registerButton}
              uppercase={false}
              icon="account-plus"
              labelStyle={styles.buttonLabel}
            >
              Register
            </Button>

            <Button
              mode="outlined"
              textColor="#1976D2"
              onPress={() => setSelectedRole(null)}
              style={styles.backButton}
              uppercase={false}
              icon="account-switch"
              labelStyle={styles.buttonLabel}
            >
              Change Role
            </Button>
          </View>
        </Surface>
      </Animated.View>
    </ScrollView>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#FFFFFF', '#E3F2FD', '#BBDEFB']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {renderForm()}
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
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: height * 0.04,
    marginBottom: height * 0.03,
  },
  header: {
    width: width * 0.9,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  headerIcon: {
    marginBottom: 12,
  },
  title: {
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subTitle: {
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  roleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleSurface: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  roleButton: {
    marginBottom: 20,
    height: 50,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginTop: 15,
  },
  form: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
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
  addressInput: {
    height: 100,
    paddingTop: 8,
    paddingBottom: 8,
    color: '#000000',
  },
  buttonContainer: {
    marginTop: 16,
    gap: 8,
  },
  registerButton: {
    height: 48,
    borderRadius: 8,
  },
  backButton: {
    height: 48,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});