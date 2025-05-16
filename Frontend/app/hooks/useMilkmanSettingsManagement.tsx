import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import instacnce from '../auth/axiosConfig';
import { Milkman } from '../types';
import useUserManagement from './useUserManagement';
const API_URL = 'http://10.0.0.158:8080';

  const useMilkmanSettingsManagement = () => {
  const [userDetails, setUserDetails] = useState<Milkman>();
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { handleLogout } = useUserManagement();
  const fetchUserDetails = useCallback(async () => {
    console.log("useMilkmanSettingsManagement milkman: " + userId);
    if (!userId) return;
    try {
      console.log("fetchUserDetails milkman: " + userId);
      const response = await instacnce.get(`${API_URL}/api/milkman/${userId}`);
      console.log("Raw response data, UserDetails:", response.data);
      // Log each order's date
    //   response.data.forEach((order: any) => {
    //     // console.log(`Order ${order.milkmanCustomerId} date:`, order.orderDate);
    //   });
      setUserDetails(response.data);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to fetch user details. Please check your connection and try again.'
      );
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId, fetchUserDetails]);

  const handleUserEdit = async (id: string, data: { name: string, email: string, address: string}) => {
    console.log("handleUserEdit milkman: " + id);
    console.log(data);
    try {
      const response = await instacnce.post(`${API_URL}/api/milkman/updateMilkman/${id}`, data);
      if(response.status === 200){
        Alert.alert('Success', 'Information updated successfully');
        fetchUserDetails();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update information. Please check your connection and try again.');
      console.log(error);
    }
  }

  const handleAccountCancellation = async (id: string) => {

    console.log("handleAccountCancellation milkman: " + id);
    try {
      const response = await instacnce.post(`${API_URL}/api/milkman/deleteMilkman/${id}`);
      if(response.status === 200){
        Alert.alert('Success', 'Account deleted successfully');
        handleLogout();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account. Please check your connection and try again.');
      console.log(error);
    }
  }

  return {
    userDetails,
    userId,
    setUserId,
    setUserRole,
    handleUserEdit,
    handleAccountCancellation,
  };
};

export default useMilkmanSettingsManagement; 