import { useState } from 'react';
import { Alert } from 'react-native';
import instacnce from '../auth/axiosConfig';
import {getHistoryData, MilkmanHistory } from '../types';
import { router } from 'expo-router';
const API_URL = 'http://10.0.0.158:8080';

const useMilkmanHistoryManagement = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleGetHistory = async (data: getHistoryData): Promise<MilkmanHistory[]> => {
    try {
      // Format the date to YYYY-MM-DD
      const formattedData = {
        ...data,
        toDate: new Date(data.toDate).toISOString().split('T')[0],
        fromDate: new Date(data.fromDate).toISOString().split('T')[0]
      };
      const response = await instacnce.get(`${API_URL}/api/history/milkman/getHistory/`, {
        params: formattedData
      });
      console.log("Raw response data, History:", response.data);
      
      if(response.status === 200 && response.data) {
        Alert.alert('Success', 'History retrieved successfully');
        return response.data;
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve history. Please check your connection and try again.');
      console.log(error);
      return [];
    }
  } 

  return {
    userId,
    setUserId,
    setUserRole,
    handleGetHistory,
  };
};

export default useMilkmanHistoryManagement; 