import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import instacnce from '../auth/axiosConfig';
import { Order } from '../types';

const API_URL = 'http://10.0.0.158:8080';

const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // if you need role as well

  const fetchOrders = useCallback(async () => {
    console.log("useMilkManagement : " + userId);
    if (!userId) return;
    try {
      console.log("fetchOrder : " + userId);
      const response = await instacnce.get(`${API_URL}/api/milkman/${userId}/orders/today`);
      console.log(response.data);
      setOrders(response.data);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to fetch users. Please check your connection and try again.'
      );
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId, fetchOrders]);

  return {
    orders,
    userId,
    setUserId,
    setUserRole,
  };
};

export default useOrderManagement; 