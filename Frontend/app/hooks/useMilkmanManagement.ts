import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { Milkman, User } from '../types';

const API_URL = 'http://localhost:8080';

const useUserManagement = () => {
  const [milkmans, setUsers] = useState<Milkman[]>([]);
  const [formData, setFormData] = useState<Milkman>({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/milkman`);
      setUsers(response.data);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to fetch users. Please check your connection and try again.'
      );
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
    });
    setEditingId(null);
  }, []);

  const handleSubmit = useCallback(async (data?: Milkman) => {
    try {
      const submitData = data || formData;
      console.log(submitData)
      if (!submitData.name || !submitData.phoneNumber || !submitData.address || !submitData.email) {
        Alert.alert('Validation Error', 'Please fill in all required fields');
        return;
      }

      if (editingId) {
        await axios.put(`${API_URL}/api/milkman/${editingId}`, submitData);
        Alert.alert('Success', 'User updated successfully');
      } else {
        await axios.post(`${API_URL}/api/milkman`, submitData);
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
    setFormData(user);
    setEditingId(user.id!);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/milkman/${id}`);
      Alert.alert('Success', 'User deleted successfully');
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user. Please try again.');
    }
  }, [fetchUsers]);

  return {
    milkmans,
    formData,
    editingId,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
  };
};

export default useUserManagement; 