import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, ScrollView, Dimensions } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { Appbar, Text, Drawer, FAB, Card, Avatar, IconButton, Searchbar, Chip } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import UserForm from '../components/UserForm';
import useMilkManagement from '../hooks/useMilkmanManagement';
import useUserManagement from '../hooks/useUserManagement';
import { Customer, newCustomer } from '../types';

interface DrawerLayoutRef {
  openDrawer: () => void;
  closeDrawer: () => void;
}

export default function CustomerHomeScreen() {
  const { id } = useLocalSearchParams();
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { userId, setUserId, customers, handleAddCustomer } = useMilkManagement();
  const { handleLogout } = useUserManagement();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (id) {
      setUserId(id as string);
    }
    // Animate components when mounted
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [id, setUserId, fadeAnim, scaleAnim]);

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
    router.push('/screens/landingPage');
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phoneNumber?.includes(searchQuery)
  );

  const navigationView = () => (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Avatar.Text size={50} label="MD" />
        <Text style={styles.drawerTitle}>Milkman Dashboard</Text>
      </View>
      <Drawer.Section title="Menu" style={styles.drawerSection}>
        <Drawer.Item
          label="My Customers"
          icon="account-group"
          active={true}
          onPress={() => drawerRef.current?.closeDrawer()}
        />
        <Drawer.Item
          label="Settings"
          icon="cog"
          onPress={() => {
            // Navigate to settings screen
          }}
        />
        <Drawer.Item
          label="Logout"
          icon="logout"
          onPress={handleLogoutButton}
        />
      </Drawer.Section>
    </View>
  );

  return (
    <DrawerLayout
      ref={drawerRef as React.RefObject<DrawerLayout>}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={navigationView}
    >
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.Action icon="menu" onPress={() => drawerRef.current?.openDrawer()} />
          <Appbar.Content title="My Customers" />
          <Appbar.Action icon="bell" onPress={() => {}} />
        </Appbar.Header>

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Searchbar
            placeholder="Search customers..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />

          <ScrollView style={styles.scrollView}>
            <View style={styles.customerGrid}>
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} style={styles.customerCard}>
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <Avatar.Text
                        size={40}
                        label={customer.name?.charAt(0) || 'C'}
                        style={styles.avatar}
                      />
                      <View style={styles.customerInfo}>
                        <Text style={styles.customerName}>{customer.name}</Text>
                        <Text style={styles.customerPhone}>{customer.phoneNumber}</Text>
                      </View>
                    </View>
                    <View style={styles.cardFooter}>
                      <Chip icon="map-marker" style={styles.addressChip}>
                        {customer.address || 'No address'}
                      </Chip>
                      <View style={styles.actionButtons}>
                        <IconButton
                          icon="phone"
                          size={20}
                          onPress={() => {}}
                        />
                        <IconButton
                          icon="message"
                          size={20}
                          onPress={() => {}}
                        />
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </ScrollView>

          <FAB
            style={styles.fab}
            icon="plus"
            label="Add Customer"
            onPress={() => setShowAddUser(true)}
          />

          <UserForm
            visible={showAddUser}
            onClose={() => setShowAddUser(false)}
            onSubmit={handleAddUser}
          />
        </Animated.View>
      </View>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appbar: {
    backgroundColor: '#fff',
    elevation: 0,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  customerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  customerCard: {
    width: (Dimensions.get('window').width - 48) / 2,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    marginRight: 12,
    backgroundColor: '#007AFF',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerPhone: {
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressChip: {
    backgroundColor: '#f0f0f0',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  drawerHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  drawerTitle: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerSection: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
  },
});