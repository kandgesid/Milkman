import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import UserForm from './components/UserForm';
import useUserManagement from './hooks/useUserManagement';
import useMilkManagement from './hooks/useMilkmanManagement';
import { Milkman, User } from './types';

export default function HomeScreen() {
  const { role } = useLocalSearchParams();
  const [showAddUser, setShowAddUser] = useState(false);
  const { milkmans, handleSubmit } = useMilkManagement();
  

  const handleAddUser = (userData: { name: string; phone: string; address: string, email: string}) => {
    
    const newUser: Milkman = {
      name: userData.name,
      phoneNumber: userData.phone,
      address: userData.address,
      email: userData.email,
    };
    handleSubmit(newUser);
    setShowAddUser(false);
  };

  const renderItem = ({ item }: { item: Milkman }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userInfo}>📱 {item.phoneNumber}</Text>
      <Text style={styles.userInfo}>📍 {item.address}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {role === 'MILKMAN' ? 'My Customers' : 'Available Milkmen'}
        </Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddUser(true)}
        >
          <Text style={styles.addButtonText}>+ Add {role === 'MILKMAN' ? 'CUSTOMER' : 'MILKMAN'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={milkmans}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      <UserForm
        visible={showAddUser}
        onClose={() => setShowAddUser(false)}
        onSubmit={handleAddUser}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  userInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
}); 