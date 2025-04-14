import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, ScrollView, Dimensions } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { Appbar, Text, Drawer, FAB, Searchbar, Surface, useTheme, DataTable, Portal, Modal, Provider as PaperProvider } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import UserForm from '../components/UserForm';
import useMilkManagement from '../hooks/useMilkmanManagement';
import useUserManagement from '../hooks/useUserManagement';
import { Milkman, newCustomer } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface DrawerLayoutRef {
  openDrawer: () => void;
  closeDrawer: () => void;
}

const ITEMS_PER_PAGE = 10;

export default function MilkManHomeScreen() {
  const { id } = useLocalSearchParams();
  const [showAddUser, setShowAddUser] = useState(false);
  const { userId, setUserId, customers, handleAddCustomer } = useMilkManagement();
  const { handleLogout } = useUserManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const theme = useTheme();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [id, setUserId, fadeAnim, slideAnim]);

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
    customer.phoneNumber?.includes(searchQuery) ||
    customer.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const from = page * ITEMS_PER_PAGE;
  const to = Math.min((page + 1) * ITEMS_PER_PAGE, filteredCustomers.length);

  const navigationView = () => (
    <PaperProvider theme={{ colors: { text: '#000000', primary: '#000000', onSurface: '#000000' } }}>
      <View style={styles.drawerContainer}>
        <View style={styles.drawerHeader}>
          <MaterialCommunityIcons name="cow" size={40} color="#1976D2" style={styles.drawerIcon} />
          <Text style={styles.drawerTitle}>MilkMate</Text>
        </View>
        <Drawer.Section title="Menu" style={styles.drawerSection} theme={{ colors: { text: '#000000', onSurfaceVariant: '#000000' } }}>
          <Drawer.Item
            label="My Customers"
            icon="account-group"
            active={true}
            onPress={() => router.push(`/screens/milkmanHome?id=${userId}`)}
            style={styles.drawerItem}
            theme={{ colors: { onSurfaceVariant: '#000000', onSurface: '#000000' } }}
          />
          <Drawer.Item
            label="Today's Order"
            icon="calendar"
            onPress={() => router.push(`/screens/todaysOrder?id=${userId}`)}
            style={styles.drawerItem}
            theme={{ colors: { onSurfaceVariant: '#000000', onSurface: '#000000' } }}
          />
          <Drawer.Item
            label="Settings"
            icon="cog"
            onPress={() => {}}
            style={styles.drawerItem}
            theme={{ colors: { onSurfaceVariant: '#000000', onSurface: '#000000' } }}
          />
        </Drawer.Section>
      </View>
    </PaperProvider>
  );

  return (
    <DrawerLayout
      ref={drawerRef as React.RefObject<DrawerLayout>}
      drawerWidth={250}
      drawerPosition="left"
      renderNavigationView={navigationView}
    >
      <LinearGradient
        colors={['#FFFFFF', '#E3F2FD', '#BBDEFB']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.container}>
          <Appbar.Header style={styles.appbar}>
            <Appbar.Action icon="menu" onPress={() => drawerRef.current?.openDrawer()} />
            <Appbar.Content title="My Customers" titleStyle={styles.appbarTitle} />
            <View style={styles.headerActions}>
              <Appbar.Action 
                icon="account-plus" 
                onPress={() => setShowAddUser(true)}
                style={styles.addButton}
                color="#1976D2"
              />
              <Appbar.Action icon="logout" onPress={handleLogoutButton} />
            </View>
          </Appbar.Header>

          <ScrollView style={styles.scrollView}>
            {/* Statistics Cards */}
            <Animated.View 
              style={[
                styles.statsContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Surface style={styles.statCard}>
                <MaterialCommunityIcons name="account-group" size={24} color="#1976D2" />
                <Text style={styles.statNumber}>{customers.length}</Text>
                <Text style={styles.statLabel}>Total Customers</Text>
              </Surface>
              <Surface 
                style={[styles.statCard, styles.addCard]} 
                onTouchEnd={() => setShowAddUser(true)}
              >
                <MaterialCommunityIcons name="account-plus" size={24} color="#1976D2" />
                <Text style={styles.statNumber}>+</Text>
                <Text style={styles.statLabel}>Add Customer</Text>
              </Surface>
            </Animated.View>

            {/* Search Bar */}
            <Animated.View
              style={[
                styles.searchContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Searchbar
                placeholder="Search customers..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                iconColor="#1976D2"
                inputStyle={{ color: '#000000' }}
                placeholderTextColor="#666"
              />
            </Animated.View>

            {/* Data Table */}
            <Animated.View
              style={[
                styles.tableContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableTitle}>Customer List</Text>
                <Text style={styles.tableSubtitle}>{filteredCustomers.length} customers</Text>
              </View>

              <PaperProvider
                theme={{
                  colors: {
                    text: '#000000',
                    primary: '#1976D2',
                    onSurface: '#000000',
                    surfaceVariant: '#E3F2FD',
                    onSurfaceVariant: '#000000',
                    outline: '#000000',
                    secondary: '#000000',
                    onSecondaryContainer: '#000000',
                    secondaryContainer: '#000000',
                    surface: '#ffffff',
                    onPrimaryContainer: '#000000',
                    primaryContainer: '#E3F2FD',
                  }
                }}
              >
                <DataTable>
                  <DataTable.Header style={styles.tableHeader}>
                    <DataTable.Title
                      style={styles.headerCell}
                      textStyle={styles.headerText}
                    >
                      Name
                    </DataTable.Title>
                    <DataTable.Title
                      style={styles.headerCell}
                      textStyle={styles.headerText}
                    >
                      Phone
                    </DataTable.Title>
                    <DataTable.Title
                      style={styles.headerCell}
                      textStyle={styles.headerText}
                    >
                      Address
                    </DataTable.Title>
                  </DataTable.Header>

                  {filteredCustomers.slice(from, to).map((customer, index) => (
                    <DataTable.Row 
                      key={customer.id?.toString()}
                      style={[
                        styles.tableRow,
                        index % 2 === 0 ? styles.evenRow : styles.oddRow
                      ]}
                    >
                      <DataTable.Cell style={styles.cell}>
                        <Text style={styles.customerName}>{customer.name}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.cell}>
                        <Text style={styles.phoneText}>{customer.phoneNumber}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.cell}>
                        <Text style={styles.addressText} numberOfLines={2}>
                          {customer.address}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}

                  <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${filteredCustomers.length}`}
                    style={styles.pagination}
                    showFastPaginationControls
                    numberOfItemsPerPage={ITEMS_PER_PAGE}
                    onItemsPerPageChange={() => {}}
                    selectPageDropdownLabel={'Rows per page'}
                  />
                </DataTable>
              </PaperProvider>
            </Animated.View>
          </ScrollView>

          <Portal>
            <Modal
              visible={showAddUser}
              onDismiss={() => setShowAddUser(false)}
              contentContainerStyle={styles.modalContainer}
            >
              <UserForm
                visible={showAddUser}
                onClose={() => setShowAddUser(false)}
                onSubmit={handleAddUser}
              />
            </Modal>
          </Portal>
        </View>
      </LinearGradient>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  appbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 0,
  },
  appbarTitle: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  statCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#1976D2',
  },
  statLabel: {
    fontSize: 12,
    color: '#1976D2',
    marginTop: 4,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#E3F2FD',
    color: '#000000',
  },
  tableContainer: {
    margin: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  tableHeaderContainer: {
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  tableSubtitle: {
    fontSize: 14,
    color: '#000000',
    marginTop: 4,
    fontWeight: 'bold',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    height: 50,
  },
  headerCell: {
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  tableRow: {
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  evenRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  oddRow: {
    backgroundColor: 'rgba(248, 249, 250, 0.95)',
  },
  cell: {
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  addressText: {
    fontSize: 13,
    color: '#000000',
    lineHeight: 18,
  },
  pagination: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: -8,
    marginBottom: -8,
  },
  modalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    margin: 20,
    borderRadius: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  addCard: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 40,
  },
  drawerHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  drawerIcon: {
    marginRight: 16,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  drawerSection: {
    marginTop: 16,
    backgroundColor: 'transparent',
  },
  drawerItem: {
    backgroundColor: 'transparent',
    marginVertical: 4,
  },
});