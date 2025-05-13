import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import instacnce from '../auth/axiosConfig';
import { MyOrder, newOrder, editMyOrder } from '../types';
import { router } from 'expo-router';
const API_URL = 'http://172.31.20.122:8080';

const useCustomerOrderManagement = () => {
  const [myOrders, setMyOrders] = useState<MyOrder[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    console.log("useCustomerOrderManagement : " + userId);
    if (!userId) return;
    try {
      // console.log("fetchOrder : " + userId);
      const response = await instacnce.get(`${API_URL}/api/customer/${userId}/myOrders/`);
      console.log("Raw response data, MyOrders:", response.data);
      // Log each order's date
    //   response.data.forEach((order: any) => {
    //     // console.log(`Order ${order.milkmanCustomerId} date:`, order.orderDate);
    //   });
      setMyOrders(response.data);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to fetch myOrders. Please check your connection and try again.'
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

  const handleOrderEdit = async (id: string, data: editMyOrder) => {

    console.log("handleMyOrderEdit : " + id);
    console.log(data);
    try {
      const response = await instacnce.post(`${API_URL}/api/customer/updateMyOrder/${id}`, data);
      if(response.status === 200){
        Alert.alert('Success', 'Order updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update order. Please check your connection and try again.');
      console.log(error);
      
    }
  }

  const handleOrderCancellation = async (id: string) => {

    console.log("handleOrderCancellation : " + id);
    try {
      const response = await instacnce.post(`${API_URL}/api/customer/cancelMyOrder/${id}`);
      if(response.status === 200){
        Alert.alert('Success', 'Order cancelled successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel order. Please check your connection and try again.');
      console.log(error);
    }finally{
      fetchOrders();
    }
  }

  return {
    myOrders,
    userId,
    setUserId,
    setUserRole,
    handleOrderEdit,
    handlePlaceOrder,
    handleOrderCancellation,
  };
};

export default useCustomerOrderManagement; 