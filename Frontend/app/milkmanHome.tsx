import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { Appbar, Text, Drawer, FAB, DataTable } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import UserForm from './components/UserForm';
import useMilkManagement from './hooks/useMilkmanManagement';
import useUserManagement from './hooks/useUserManagement';
import { Milkman, newCustomer } from './types';

interface DrawerLayoutRef {
  openDrawer: () => void;
  closeDrawer: () => void;
}

export default function HomeScreen() {
  const { id } = useLocalSearchParams();
  const [showAddUser, setShowAddUser] = useState(false);
  const { userId, setUserId, milkmans, handleAddCustomer } = useMilkManagement();
  const { handleLogout } = useUserManagement();

  // State for table sorting with correct sort direction values
  const [sortColumn, setSortColumn] = useState<'name' | 'phoneNumber' | 'address'>('name');
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');

  // Animation value for the table container
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (id) {
      console.log("home : " + id);
      setUserId(id as string);
    }
    // Animate the table container when component mounts
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [id, setUserId, animation]);

  // Explicitly type the drawer ref
  const drawerRef = useRef<DrawerLayoutRef | null>(null);

  const handleAddUser = (userData: { phone: string; rate: string }) => {
    const newUser: newCustomer = {
      phoneNumber: userData.phone,
      rate: userData.rate,
      milkManId: userId as string,
    };
    handleAddCustomer(newUser);
    setShowAddUser(false);
  };

  const handleLogoutButton = () => {
    handleLogout();
    router.push('/components/landingPage'); // Adjust the route as necessary
  };

  const handleSort = (column: 'name' | 'phoneNumber' | 'address') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortColumn(column);
      setSortDirection('ascending');
    }
  };

  const sortedMilkmans = [...milkmans].sort((a, b) => {
    const aValue = (a[sortColumn] || '').toString();
    const bValue = (b[sortColumn] || '').toString();
    return sortDirection === 'ascending'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const navigationView = () => (
    <View style={styles.drawerContainer}>
      <Drawer.Section title="Menu">
        <Drawer.Item
          label="My Customers"
          icon="account-group"
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
          <Appbar.Content title="My Customers" />
          <Appbar.Action icon="logout" onPress={handleLogoutButton} />
        </Appbar.Header>

        {/* Animated Table Container as a box */}
        <Animated.View
          style={[
            styles.tableContainer,
            {
              opacity: animation,
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <DataTable>
            <DataTable.Header>
              <DataTable.Title
                sortDirection={sortColumn === 'name' ? sortDirection : undefined}
                onPress={() => handleSort('name')}
              >
                Name
              </DataTable.Title>
              <DataTable.Title
                sortDirection={sortColumn === 'phoneNumber' ? sortDirection : undefined}
                onPress={() => handleSort('phoneNumber')}
              >
                Phone
              </DataTable.Title>
              <DataTable.Title
                sortDirection={sortColumn === 'address' ? sortDirection : undefined}
                onPress={() => handleSort('address')}
              >
                Address
              </DataTable.Title>
            </DataTable.Header>

            {sortedMilkmans.map((item) => (
              <DataTable.Row key={item.id?.toString()}>
                <DataTable.Cell>{item.name}</DataTable.Cell>
                <DataTable.Cell>{item.phoneNumber}</DataTable.Cell>
                <DataTable.Cell>{item.address}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Animated.View>

        {/* Floating Action Button for Adding New User */}
        <FAB
          style={styles.fab}
          icon="plus"
          label="Add Customer"
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
  tableContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
    overflow: 'hidden',
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