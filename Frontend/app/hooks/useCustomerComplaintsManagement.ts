import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { instance, API_URL } from '../auth/axiosConfig';
import { MyOrder, newOrder, editMyOrder, MyComplaint, newComplaint } from '../types';
import { router } from 'expo-router';
import { formatDateForAPI } from '../utils/dateUtils';

const useCustomerComplaintsManagement = () => {
  const [myComplaints, setMyComplaints] = useState<MyComplaint[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchMyComplaints = useCallback(async () => {
    console.log("useCustomerComplaintsManagement : " + userId);
    if (!userId) return;
    try {
      // console.log("fetchOrder : " + userId);
      const response = await instance.get(`${API_URL}/api/customer/myComplaints/${userId}`);
      console.log("Raw response data, MyComplaints:", response.data);
      // Log each order's date
    //   response.data.forEach((order: any) => {
    //     // console.log(`Order ${order.milkmanCustomerId} date:`, order.orderDate);
    //   });
      setMyComplaints(response.data);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to fetch myComplaints. Please check your connection and try again.'
      );
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchMyComplaints();
    }
  }, [userId, fetchMyComplaints]);

  const handleRaiseComplaint = async (data: newComplaint) => {
    try {
      const response = await instance.post(`${API_URL}/api/complaint/`, data);
      
      if(response.status === 200){
        Alert.alert('Success', 'Complaint raised successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to raise complaint. Please check your connection and try again.');
      console.log(error);
    }
  }

  return {
    myComplaints,
    userId,
    setUserId,
    setUserRole,
    handleRaiseComplaint,
  };
};

export default useCustomerComplaintsManagement; 