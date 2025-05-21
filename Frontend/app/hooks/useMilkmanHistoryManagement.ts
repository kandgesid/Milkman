import { useState } from 'react';
import { Alert } from 'react-native';
import { instance, API_URL } from '../auth/axiosConfig';
import { getHistoryData, MilkmanHistory } from '../types';
import { router } from 'expo-router';
import { formatDateForAPI } from '../utils/dateUtils';

const useMilkmanHistoryManagement = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleGetHistory = async (data: getHistoryData): Promise<MilkmanHistory[]> => {
    try {
      // Format the dates using the utility function
      const formattedData = {
        ...data,
        toDate: formatDateForAPI(data.toDate),
        fromDate: formatDateForAPI(data.fromDate)
      };
      
      const response = await instance.get(`${API_URL}/api/history/milkman/getHistory/`, {
        params: formattedData
      });
      
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