import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
// import axios from 'axios';
import { instance, API_URL } from '../auth/axiosConfig';
import { Milkman, newCustomer, User, Order, Customer, MilkRateUpdate } from '../types';

const useMilkManagement = () => {
  const [customers, setCutomers] = useState<Customer[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // if you need role as well
  const [formData, setFormData] = useState<Milkman>({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    milkRate: 0,
    dueAmount: 0,
  });

  const [newCustomerFormData, setNewCustomerFormData] = useState<newCustomer>({
    phoneNumber: '',
    rate: '',
    milkManId: '',
  });
  
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    console.log("useMilkManagement : " + userId);
    if (!userId) return;
    try {
      // console.log("fetchUser : " + userId);
      const response = await instance.get(`${API_URL}/api/milkman/myCustomers/${userId}`);
      // console.log(response.data);
      setCutomers(response.data);
      // for (let i = 0; i < response.data.length; i++) {
      //   console.log(response.data[i].milkRate);
      // }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to fetch users. Please check your connection and try again.'
      );
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUsers();
    }
  }, [userId, fetchUsers]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      milkRate: 0,
      dueAmount: 0,
    });
    setEditingId(null);
  }, []);

  const resetNewCustomerForm = useCallback(() => {
    setNewCustomerFormData({
      phoneNumber: '',
      rate: '',
      milkManId: '',
    });
    setEditingId(null);
  }, []);

  const handleAddCustomer = useCallback(async (data?: newCustomer) => {
    try {
      // console.log(data) 
      const submitData = data || newCustomerFormData;
      
      if (!submitData.phoneNumber || !submitData.rate || !submitData.milkManId) {
        Alert.alert('Validation Error', 'Please fill in all required fields');
        return;
      }
      const response = await instance.post(`${API_URL}/api/milkman/addNewCustomer`, submitData);
      // console.log(response);
      Alert.alert('Success', 'User added successfully');
      resetNewCustomerForm();
      fetchUsers();
    } catch (error) {
      Alert.alert(
        'Error', 'Failed to add user. Please try again.'
      );
    }
  }, [newCustomerFormData, resetNewCustomerForm, fetchUsers]);

  const handleSubmit = useCallback(async (data?: Milkman) => {
    try {
      const submitData = data || formData;
      // console.log(submitData)
      if (!submitData.name || !submitData.phoneNumber || !submitData.address || !submitData.email) {
        Alert.alert('Validation Error', 'Please fill in all required fields');
        return;
      }

      if (editingId) {
        await instance.put(`${API_URL}/api/milkman/${editingId}`, submitData);
        Alert.alert('Success', 'User updated successfully');
      } else {
        await instance.post(`${API_URL}/api/milkman`, submitData);
        Alert.alert('Success', 'User added successfully');
      }
      
      resetForm();
      fetchUsers();
    } catch (error) {
      Alert.alert(
        'Error',
        editingId
          ? 'Failed to update user. Please try again.'
          : 'Failed to add user. Please try again.'
      );
    }
  }, [formData, editingId, resetForm, fetchUsers]);

  const handleEdit = useCallback((user: User) => {
    setFormData(user as unknown as Milkman);
    setEditingId(user.id!);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await instance.delete(`${API_URL}/api/milkman/${id}`);
      Alert.alert('Success', 'User deleted successfully');
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user. Please try again.');
    }
  }, [fetchUsers]);

  const handleMilkRateUpdate = async (data: MilkRateUpdate) => {
    console.log("handleMilkRateUpdate : " + data);
    try {
      const response = await instance.post(`${API_URL}/api/milkman/updateOrderRate`, data);
      if(response.status === 200){
        Alert.alert('Success', 'Milk rate updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update milk rate. Please check your connection and try again.');
      console.log(error);
    }
  }

  return {
    customers,
    formData,
    editingId,
    userId,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    setUserId,
    setUserRole,
    handleAddCustomer,
    handleMilkRateUpdate
  };
};

export default useMilkManagement; 