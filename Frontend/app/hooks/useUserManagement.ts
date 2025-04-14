import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { UserLogin, User } from '../types';
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
    noOfFamilyMembers: '',
    dailyMilkRequired: '',
  });

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      password: '',
      confirmPassword: '',
      role: '',
      noOfFamilyMembers: '',
      dailyMilkRequired: '',
    });
  }, []);

  const [loginUsers, setLoginUsers] = useState<UserLogin[]>([]);
  const [loginFormData, setLoginFormData] = useState<UserLogin>({
    phoneNumber: '',
    password: '',
    role: ''
  });

  const resetLoginForm = useCallback(() => {
    setLoginFormData({
      phoneNumber: '',
      password: '',
      role: ''
    });
  }, []);

  const handleLogout = async () => {
    try {
      // Get the token from AsyncStorage
      await AsyncStorage.removeItem('jwtToken');
      // Optionally clear other user state or cached data here
      Alert.alert('Success', 'Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleLogin = useCallback(async (data?: UserLogin) => {
    try {
      const submitData = data || loginFormData;

      if (!submitData.phoneNumber || !submitData.password) {
        Alert.alert('Validation Error', 'Please enter both phone and password');
        return;
      }
      // console.log(submitData);
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username: submitData.phoneNumber, // assuming phone acts as the username, or adjust accordingly
        password: submitData.password,
      });
      const token = response.data.token;
      console.log(response.data);

      if (token) {
        // Store the token for later API calls.
        await AsyncStorage.setItem('jwtToken', token);
        Alert.alert('Success', 'Login successful');
        const role = response.data.authorities[0].authority;
        if(role === "MILKMAN"){
          router.replace(`/screens/milkmanHome?id=${response.data.id}`);
        }else{
          router.replace(`/screens/customerHome?id=${response.data.id}`);
        }
        
      } else {
        Alert.alert('Login Failed', 'No token received');
      }
      resetLoginForm();
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Error', 'Failed to login user. Please try again.'
      );
    }
  }, [loginFormData, resetLoginForm]);

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

      const payload = {} as any;
      payload.email = submitData.email;
      payload.password = submitData.password;
      payload.role = submitData.role;
      payload.name = submitData.name;
      payload.phoneNumber = submitData.phoneNumber;
      payload.address = submitData.address;
      if (submitData.role === "CUSTOMER") {
        const noOfFamilyMembers = parseInt(submitData.noOfFamilyMembers);
        const dailyMilkRequired = parseInt(submitData.dailyMilkRequired);

        if (isNaN(noOfFamilyMembers) || isNaN(dailyMilkRequired)) {
          Alert.alert('Validation Error', 'Number of family members and daily milk required must be integers');
          return;
        }

        if (noOfFamilyMembers <= 0 || dailyMilkRequired <= 0) {
          Alert.alert('Validation Error', 'Number of family members and daily milk required must be positive integers');
          return;
        }

        payload.noOfFamilyMembers = noOfFamilyMembers;
        payload.dailyMilkRequired = dailyMilkRequired;
      }
      await axios.post(`${API_URL}/api/auth/register`, payload);
      Alert.alert('Success', 'User registered successfully');

      resetForm();
      router.replace(`../components/landingPage/`);
    } catch (error) {
      Alert.alert(
        'Error', 'Failed to register user. Please try again.'
      );
    }
  }, [formData, resetForm]);



  return {
    users,
    loginUsers,
    loginFormData,
    formData,
    setFormData,
    setLoginFormData,
    handleSubmit,
    handleLogin,
    handleLogout,
  };
};

export default useUserManagement; 