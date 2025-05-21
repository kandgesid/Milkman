import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { instance, API_URL } from '../auth/axiosConfig';
import { Customer } from '../types';
import useUserManagement from './useUserManagement';

const useCustomerSettingsManagement = () => {
  const [userDetails, setUserDetails] = useState<Customer>();
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { handleLogout } = useUserManagement();
  const fetchUserDetails = useCallback(async () => {
    console.log("useCustomerSettingsManagement : " + userId);
    if (!userId) return;
    try {
      console.log("fetchUserDetails : " + userId);
      const response = await instance.get(`${API_URL}/api/customer/${userId}`);
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

  const handleUserEdit = async (id: string, data: { name: string, email: string, address: string, familySize: number, defaultMilkQty: number }) => {
    console.log("handleUserEdit : " + id);
    console.log(data);
    try {
      const response = await instance.post(`${API_URL}/api/customer/updateCustomer/${id}`, data);
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

    console.log("handleAccountCancellation : " + id);
    try {
      const response = await instance.post(`${API_URL}/api/customer/deleteCustomer/${id}`);
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

export default useCustomerSettingsManagement; 