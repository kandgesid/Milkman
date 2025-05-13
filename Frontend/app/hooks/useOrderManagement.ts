import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import instacnce from '../auth/axiosConfig';
import { Order, cancleOrder, confirmOrder, newOrder } from '../types';
import { router } from 'expo-router';
const API_URL = 'http://172.31.20.122:8080';

const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    console.log("useMilkManagement : " + userId);
    if (!userId) return;
    try {
      // console.log("fetchOrder : " + userId);
      const response = await instacnce.get(`${API_URL}/api/milkman/${userId}/orders/today`);
      console.log("Today's Orders response data:", response.data);
      // Log each order's date
      response.data.forEach((order: any) => {
        // console.log(`Order ${order.milkmanCustomerId} date:`, order.orderDate);
      });
      setOrders(response.data);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to fetch todays orders. Please check your connection and try again.'
      );
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId, fetchOrders]);

  const handlePlaceOrder = async (data: newOrder) => {
    
    try {
      // Format the date to YYYY-MM-DD
      const formattedData = {
        ...data,
        orderDate: new Date(data.orderDate).toISOString().split('T')[0]
      };
      // console.log("handlePlaceOrder date: " + formattedData); 
      const response = await instacnce.post(`${API_URL}/api/order/`, formattedData);
      
      if(response.status === 200){
        Alert.alert('Success', 'Order placed successfully');
        router.push(`../screens/customerHome?id=${data.customerId}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please check your connection and try again.');
      console.log(error);
    }
  }

  const handleOrderConfirmation = async (id: string, data: confirmOrder) => {

    console.log("handleOrderConfirmation : " + id);
    console.log(data);
    try {
      const response = await instacnce.post(`${API_URL}/api/order/milkman-customer/${id}/deliveries`, data);
      if(response.status === 200){
        Alert.alert('Success', 'Order confirmed successfully');
        fetchOrders();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to confirm order. Please check your connection and try again.');
      console.log(error);
      fetchOrders();
    }
  }

  const handleOrderCancellation = async (id: string, data: cancleOrder) => {

    console.log("handleOrderCancellation : " + id);
    console.log(data);
    try {
      const response = await instacnce.post(`${API_URL}/api/order/milkman-customer/${id}/cancelOrder`, data);
      if(response.status === 200){
        Alert.alert('Success', 'Order cancelled successfully');
        fetchOrders();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel order. Please check your connection and try again.');
      console.log(error);
      fetchOrders();
    }
  }

  return {
    orders,
    userId,
    setUserId,
    setUserRole,
    handleOrderConfirmation,
    handlePlaceOrder,
    handleOrderCancellation,
  };
};

export default useOrderManagement; 