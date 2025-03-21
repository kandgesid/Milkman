import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import axios from 'axios';

interface User {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

const API_URL = 'http://localhost:8080/api/users';

export default function Index() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ name: '', email: '', phoneNumber: '', address: '' });
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to save user');
    }
  };

  const handleEdit = (user: User) => {
    setFormData(user);
    setEditingId(user.id!);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{editingId ? 'Edit User' : 'Add New User'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{editingId ? 'Update' : 'Add'} User</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.title}>Users List</Text>
        {users.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text>{user.email}</Text>
              <Text>{user.phoneNumber}</Text>
              <Text>{user.address}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => handleEdit(user)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDelete(user.id!)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: '#f44336',
  },
});
