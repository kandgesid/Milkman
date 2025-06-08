import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { Appbar, Text, Drawer, FAB, Searchbar, Surface, useTheme, DataTable, Portal, Modal, Provider as PaperProvider, Button, TextInput } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import UserForm from '../components/UserForm';
import useMilkManagement from '../hooks/useMilkmanManagement';
import useUserManagement from '../hooks/useUserManagement';
import { Customer, Milkman, newCustomer } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomPagination from '../components/CustomPagination';

interface DrawerLayoutRef {
  openDrawer: () => void;
  closeDrawer: () => void;
}

const ITEMS_PER_PAGE = 5;

export default function MilkManHomeScreen() {
  const { id } = useLocalSearchParams();
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditRate, setShowEditRate] = useState(false);
  const [newRate, setNewRate] = useState('');
  const { userId, setUserId, customers, handleAddCustomer, handleMilkRateUpdate } = useMilkManagement();
  const { handleLogout } = useUserManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const theme = useTheme();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

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

  const handleEditRate = () => {
    if (!selectedCustomer || !newRate) return;
    
    handleMilkRateUpdate({
      customerId: selectedCustomer.id?.toString() || '',
      milkmanId: userId as string,
      milkRate: parseFloat(newRate)
    });
    router.push(`/screens/milkmanHome?id=${userId}`);
    setShowEditRate(false);
    setNewRate('');
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phoneNumber?.includes(searchQuery) ||
    customer.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const from = page * ITEMS_PER_PAGE;
  const to = Math.min((page + 1) * ITEMS_PER_PAGE, filteredCustomers.length);

  const handleCustomerPress = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

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
            onPress={() => router.push(`/screens/milkmanSettings?id=${userId}`)}
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
            <Appbar.Action icon="menu" onPress={() => drawerRef.current?.openDrawer()} color="#000000" />
            <Appbar.Content title="My Customers" titleStyle={styles.appbarTitle} />
            <View style={styles.headerActions}>
              <Appbar.Action 
                icon="account-plus" 
                onPress={() => setShowAddUser(true)}
                style={styles.addButton}
                color="#1976D2"
              />
              <Appbar.Action icon="logout" onPress={handleLogoutButton} color="#000000" />
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
                <View style={{ overflow: 'hidden' }}>
                  <MaterialCommunityIcons name="account-group" size={24} color="#1976D2" />
                  <Text style={styles.statNumber}>{customers.length}</Text>
                  <Text style={styles.statLabel}>Total Customers</Text>
                </View>
              </Surface>
              <Surface 
                style={[styles.statCard, styles.addCard]} 
                onTouchEnd={() => setShowAddUser(true)}
              >
                <View style={{ overflow: 'hidden' }}>
                  <MaterialCommunityIcons name="account-plus" size={24} color="#1976D2" />
                  <Text style={styles.statNumber}>+</Text>
                  <Text style={styles.statLabel}>Add Customer</Text>
                </View>
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
                <View>
                  <DataTable style={{ width: '100%' }}>
                    <DataTable.Header style={styles.tableHeader}>
                      <DataTable.Title
                        style={[styles.headerCell, { flex: 2 }]}
                        textStyle={[styles.headerText, { textAlign: 'center' }]}
                      >
                        Name
                      </DataTable.Title>
                      <DataTable.Title
                        style={[styles.headerCell, { flex: 1.5 }]}
                        textStyle={[styles.headerText, { textAlign: 'center' }]}
                      >
                        Phone
                      </DataTable.Title>
                      <DataTable.Title
                        style={[styles.headerCell, { flex: 1 }]}
                        textStyle={[styles.headerText, { textAlign: 'center' }]}
                      >
                        Due Amt
                      </DataTable.Title>
                    </DataTable.Header>

                    {filteredCustomers.length === 0 ? (
                      <View style={styles.noDataContainer}>
                        <MaterialCommunityIcons name="account-group-outline" size={48} color="#BBDEFB" />
                        <Text style={styles.noDataText}>No customers found</Text>
                        <Text style={styles.noDataSubtext}>Add your first customer using the + button</Text>
                      </View>
                    ) : (
                      filteredCustomers.slice(from, to).map((customer, index) => (
                        <TouchableOpacity
                          key={customer.id?.toString()}
                          onPress={() => handleCustomerPress(customer)}
                          style={styles.rowTouchable}
                        >
                          <DataTable.Row 
                            style={[
                              styles.tableRow,
                              index % 2 === 0 ? styles.evenRow : styles.oddRow
                            ]}
                          >
                            <DataTable.Cell style={[styles.cell, { flex: 2 }]}>
                              <Text style={[styles.customerName, { textAlign: 'center' }]} numberOfLines={1}>{customer.name}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={[styles.cell, { flex: 1.5 }]}>
                              <Text style={[styles.phoneText, { textAlign: 'center' }]} numberOfLines={1}>{customer.phoneNumber}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={[styles.cell, { flex: 1 }]}>
                              <Text style={[styles.phoneText, { textAlign: 'center' }]} numberOfLines={1}>{customer.dueAmount}</Text>
                            </DataTable.Cell>
                          </DataTable.Row>
                        </TouchableOpacity>
                      ))
                    )}
                  </DataTable>
                  <CustomPagination
                    page={page}
                    numberOfPages={Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE)}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                </View>
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

            <Modal
              visible={showCustomerDetails}
              onDismiss={() => setShowCustomerDetails(false)}
              contentContainerStyle={styles.customerDetailsModal}
            >
              {selectedCustomer && (
                <View style={styles.customerDetailsContainer}>
                  <View style={styles.customerDetailsHeader}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.customerDetailsTitle}>Customer Details</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => setShowCustomerDetails(false)}
                      style={styles.closeButton}
                    >
                      <MaterialCommunityIcons name="close" size={24} color="#1976D2" />
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.customerDetailsScroll}>
                    <View style={styles.customerDetailsContent}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Name:</Text>
                        <Text style={styles.detailValue} numberOfLines={1}>{selectedCustomer.name}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Phone:</Text>
                        <Text style={styles.detailValue} numberOfLines={1}>{selectedCustomer.phoneNumber}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Address:</Text>
                        <Text style={styles.detailValue} numberOfLines={2}>{selectedCustomer.address}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Due Amount:</Text>
                        <Text style={styles.detailValue} numberOfLines={1}>{selectedCustomer.dueAmount}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Rate:</Text>
                        <Text style={styles.detailValue} numberOfLines={1}>{selectedCustomer.milkRate}</Text>
                      </View>
                    </View>
                  </ScrollView>
                  <View style={styles.modalButtonsContainer}>
                    <Button
                      mode="outlined"
                      onPress={() => {
                        setShowCustomerDetails(false);
                        setNewRate(selectedCustomer.milkRate?.toString() || '');
                        setShowEditRate(true);
                      }}
                      style={[styles.modalButton, styles.editButton]}
                      icon="pencil"
                    >
                      Edit Rate
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => {
                        setShowCustomerDetails(false);
                        router.push(`/screens/customerHistory?customerId=${selectedCustomer.id}&milkmanId=${userId}&customerName=${encodeURIComponent(selectedCustomer.name || '')}&customerPhone=${selectedCustomer.phoneNumber || ''}&customerAddress=${encodeURIComponent(selectedCustomer.address || '')}&customerRate=${selectedCustomer.milkRate || ''}`);
                      }}
                      style={[styles.modalButton, styles.historyButton]}
                      icon="history"
                    >
                      View History
                    </Button>
                  </View>
                </View>
              )}
            </Modal>

            <Modal
              visible={showEditRate}
              onDismiss={() => setShowEditRate(false)}
              contentContainerStyle={styles.editRateModal}
            >
              <View style={styles.editRateContainer}>
                <View style={styles.editRateHeader}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.editRateTitle}>Update Rate</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setShowEditRate(false)}
                    style={styles.closeButton}
                  >
                    <MaterialCommunityIcons name="close" size={24} color="#1976D2" />
                  </TouchableOpacity>
                </View>

                <View style={styles.editRateContent}>
                  <Text style={styles.editRateLabel}>New Rate (per liter)</Text>
                  <TextInput
                    mode="outlined"
                    value={newRate}
                    onChangeText={setNewRate}
                    keyboardType="numeric"
                    style={styles.rateInput}
                    placeholder="Enter new rate"
                    right={<TextInput.Affix text="₹" />}
                  />
                </View>

                <View style={styles.editRateButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowEditRate(false)}
                    style={[styles.editRateButton, styles.cancelButton]}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleEditRate}
                    style={[styles.editRateButton, styles.updateButton]}
                    disabled={!newRate}
                  >
                    Update Rate
                  </Button>
                </View>
              </View>
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
    alignItems: 'center',
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  tableRow: {
    height: 60,
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
    alignItems: 'center',
  },
  customerName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
    textAlign: 'center',
  },
  phoneText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  addressText: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 16,
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
  customerDetailsModal: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    padding: 0,
    margin: 20,
    borderRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  customerDetailsContainer: {
    width: '100%',
    height: '100%',
  },
  customerDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  customerDetailsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
  },
  customerDetailsScroll: {
    flex: 1,
  },
  customerDetailsContent: {
    padding: 20,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#1976D2',
    flex: 2,
    textAlign: 'right',
    marginLeft: 16,
  },
  rowTouchable: {
    width: '100%',
  },
  noDataContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginTop: 16,
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
    backgroundColor: '#FFFFFF',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#1976D2',
    color: '#000000',
  },
  historyButton: {
    backgroundColor: '#1976D2',
  },
  editRateModal: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    margin: 16,
    borderRadius: 16,
    width: Dimensions.get('window').width - 32,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  editRateContainer: {
    width: '100%',
  },
  editRateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
    backgroundColor: '#FFFFFF',
  },
  editRateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  editRateContent: {
    padding: 16,
    color: '#000000',
  },
  editRateLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  rateInput: {
    backgroundColor: 'white',
    fontSize: 15,
  },
  editRateButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  editRateButton: {
    flex: 1,
    marginHorizontal: 6,
    color: '#000000',
  },
  updateButton: {
    backgroundColor: '#1976D2',
    color: '#000000',
  },
  cancelButton: {
    backgroundColor: '#1976D2',
    color: '#000000',
  },
});