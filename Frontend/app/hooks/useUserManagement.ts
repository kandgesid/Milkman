import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_URL = 'http://localhost:8080';

const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      password: '',
      confirmPassword: '',
      role: ''
    });
  }, []);

  const handleLogin = useCallback(async (data?: User) => {
    try {
      const submitData = data || formData;
      
      if (!submitData.phoneNumber || ! submitData.password) {
        Alert.alert('Validation Error', 'Please enter both phone and password');
        return;
      }
      
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username: submitData.phoneNumber, // assuming phone acts as the username, or adjust accordingly
        password :submitData.password,
      });
      const token = response.data.token;
      console.log(response.data.authorities[0]);
      
      if (token) {
        // Store the token for later API calls.
        await AsyncStorage.setItem('jwtToken', token);
        // Optionally, you can also store other user details if provided.
        Alert.alert('Success', 'Login successful');
        router.replace(`/home?role=${'response.data.authorities[0].authority'}`);
      } else {
        Alert.alert('Login Failed', 'No token received');
      }
      resetForm();
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Error', 'Failed to login user. Please try again.'
      );
    }
  }, [formData, resetForm]);

  const handleSubmit = useCallback(async (data?: User) => {
    try {
      const submitData = data || formData;
      console.log(submitData)
      if (!submitData.name || !submitData.phoneNumber || !submitData.address || !submitData.email || !submitData.password || !submitData.confirmPassword) {
        Alert.alert('Validation Error', 'Please fill in all required fields');
        return;
      }

      if (submitData.password != submitData.confirmPassword) {
        Alert.alert('Validation Error', 'Please confirm your password !!');
        return;
      }
      
      const payload = {
        email: submitData.email,  
        password: submitData.password,
        role: submitData.role,
        name: submitData.name,
        phoneNumber: submitData.phoneNumber,
        address: submitData.address,
      };

      await axios.post(`${API_URL}/api/auth/register`, payload);
      Alert.alert('Success', 'User registered successfully');
      
      resetForm();
      router.replace(`/auth/login?role=${submitData.role}`);
    } catch (error) {
      Alert.alert(
        'Error', 'Failed to register user. Please try again.'
      );
    }
  }, [formData, resetForm]);



  return {
    users,
    formData,
    setFormData,
    handleSubmit,
    handleLogin,
  };
};

export default useUserManagement; 