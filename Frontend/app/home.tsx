import React, { useState, useRef } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { Appbar, Text, Card, Drawer, Surface, FAB } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import UserForm from './components/UserForm';
import useMilkManagement from './hooks/useMilkmanManagement';
import useUserManagement from './hooks/useUserManagement';
import { Milkman } from './types';

interface DrawerLayoutRef {
  openDrawer: () => void;
  closeDrawer: () => void;
}

export default function HomeScreen() {
  const { role } = useLocalSearchParams();
  const [showAddUser, setShowAddUser] = useState(false);
  const { milkmans, handleSubmit } = useMilkManagement();
  const { handleLogout } = useUserManagement();

  // Explicitly type the drawer ref
  const drawerRef = useRef<DrawerLayoutRef | null>(null);

  const handleAddUser = (userData: { name: string; phone: string; address: string; email: string }) => {
    const newUser: Milkman = {
      name: userData.name,
      phoneNumber: userData.phone,
      address: userData.address,
      email: userData.email,
    };
    handleSubmit(newUser);
    setShowAddUser(false);
  };

  const handleLogoutButton = () => {
    // Add logout logic if needed
    handleLogout();
    router.push('/components/landingPage'); // Adjust the route as necessary
  };

  const renderItem = ({ item }: { item: Milkman }) => (
    <Surface style={styles.elevatedCard} elevation={2}>
      <Card style={styles.userCard} mode="outlined">
        <Card.Content>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userInfo}>📱 {item.phoneNumber}</Text>
          <Text style={styles.userInfo}>📍 {item.address}</Text>
        </Card.Content>
      </Card>
    </Surface>
  );

  const navigationView = () => (
    <View style={styles.drawerContainer}>
      <Drawer.Section title="Menu">
        <Drawer.Item
          label={role === 'MILKMAN' ? 'My Customers' : 'Available Milkmen'}
          icon={role === 'MILKMAN' ? 'account-group' : 'account'}
          active={true}
          onPress={() => {
            // Additional navigation or actions can be placed here
          }}
        />
        <Drawer.Item
          label="Settings"
          icon="cog"
          onPress={() => {
            // Navigate to settings screen (if available)
          }}
        />
      </Drawer.Section>
    </View>
  );

  return (
    <DrawerLayout
      ref={drawerRef as React.RefObject<DrawerLayout>}
      drawerWidth={250}
      drawerPosition="left"
      renderNavigationView={navigationView}
    >
      <View style={styles.container}>
        {/* Appbar Header */}
        <Appbar.Header style={styles.appbar}>
          <Appbar.Action icon="menu" onPress={() => drawerRef.current?.openDrawer()} />
          <Appbar.Content title={role === 'MILKMAN' ? 'My Customers' : 'Available Milkmen'} />
          <Appbar.Action icon="logout" onPress={handleLogoutButton} />
        </Appbar.Header>

        {/* User List */}
        <FlatList
          data={milkmans}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString() || ''}
          contentContainerStyle={styles.listContent}
          style={styles.list}
        />

        {/* Floating Action Button for Adding New User */}
        <FAB
          style={styles.fab}
          icon="plus"
          label={`Add ${role === 'MILKMAN' ? 'Customer' : 'Milkman'}`}
          onPress={() => setShowAddUser(true)}
        />

        {/* User Form Modal */}
        <UserForm
          visible={showAddUser}
          onClose={() => setShowAddUser(false)}
          onSubmit={handleAddUser}
        />
      </View>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  appbar: {
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Extra space for FAB
  },
  userCard: {
    marginBottom: 16,
    borderRadius: 12,
    marginHorizontal: 8,
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
  elevatedCard: {
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 8,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
  },
});