import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Text, TouchableOpacity } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { Appbar, Drawer, DataTable, Portal, Modal, Button, PaperProvider } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import useOrderManagement from '../hooks/useOrderManagement';
import useUserManagement from '../hooks/useUserManagement';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomPagination from '../components/CustomPagination';
import { formatDateForDisplay, parseDateFromAPI } from '../utils/dateUtils';

interface DrawerLayoutRef {
  openDrawer: () => void;
  closeDrawer: () => void;
}

export default function TodaysOrderScreen() {
  const { id } = useLocalSearchParams();
  const { userId, setUserId, orders, handleOrderConfirmation, handleOrderCancellation } = useOrderManagement();
  const { handleLogout } = useUserManagement();

  // Sorting state: only for 'name' and 'address'
  const [sortColumn, setSortColumn] = useState<'customerName' | 'customerAddress'>('customerName');
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');

  // Helper function to format date consistently
  const formatDate = (dateString: string) => {
    const date = parseDateFromAPI(dateString);
    return formatDateForDisplay(date);
  };

  // Animation value for the table container
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (id) {
      setUserId(id as string);
    }
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [id, setUserId, animation]);

  // Drawer ref
  const drawerRef = useRef<DrawerLayoutRef | null>(null);

  const handleLogoutButton = () => {
    handleLogout();
    router.push('/screens/landingPage');
  };

  const handleSort = (column: 'customerName' | 'customerAddress') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortColumn(column);
      setSortDirection('ascending');
    }
  };

  // Sort the milkmans data based on the selected column and direction.
  const sortedOrders = [...orders].sort((a, b) => {
    const aValue = (a[sortColumn] || '').toString();
    const bValue = (b[sortColumn] || '').toString();
    return sortDirection === 'ascending'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const from = page * rowsPerPage;
  const to = Math.min((page + 1) * rowsPerPage, sortedOrders.length);

  // State for selected row (order) modal
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onRowPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const confirmOrder = () => {
    // Implement order confirmation logic here (e.g., update status or call an API)
    console.log("confirmOrder");
    console.log('Order confirmed for:', selectedItem);
    console.log('Order date being sent:', selectedItem.orderDate);
    handleOrderConfirmation(selectedItem.orderId, {
      orderDate: selectedItem.orderDate,
      remark: 'Order confirmed'
    });
    setModalVisible(false);
    setSelectedItem(null);
  };

  const cancelOrder = () => {
    // Implement order cancellation logic here
    console.log('Order cancelled for:', selectedItem);
    console.log("cancelOrder");
    console.log('Order cancelled for:', selectedItem);
    console.log('Order date being sent:', selectedItem.orderDate);
    handleOrderCancellation(selectedItem.orderId, {
      orderDate: selectedItem.orderDate,
      remark: 'Order canceled'
    });
    setModalVisible(false);
    setSelectedItem(null);
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
            active={false}
            onPress={() => router.push(`/screens/milkmanHome?id=${userId}`)}
            style={styles.drawerItem}
            theme={{ colors: { onSurfaceVariant: '#000000', onSurface: '#000000' } }}
          />
          <Drawer.Item
            label="Today's Order"
            icon="calendar"
            active={true}
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
      <PaperProvider theme={{ colors: { text: '#000000', primary: '#000000', onSurface: '#000000' } }}>
        <LinearGradient
          colors={['#FFFFFF', '#E3F2FD', '#BBDEFB']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
              <Appbar.Action icon="menu" onPress={() => drawerRef.current?.openDrawer()} />
              <Appbar.Content title="Today's Order" titleStyle={styles.appbarTitle} />
              <Appbar.Action icon="logout" onPress={handleLogoutButton} />
            </Appbar.Header>

            {/* Animated Table Container */}
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
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableTitle}>Today's Orders</Text>
                <Text style={styles.tableSubtitle}>{sortedOrders.length} orders to process</Text>
              </View>
              
              <DataTable>
                <DataTable.Header style={styles.tableHeader}>
                  <DataTable.Title
                    sortDirection={sortColumn === 'customerName' ? sortDirection : undefined}
                    onPress={() => handleSort('customerName')}
                    style={styles.headerCell}
                    textStyle={styles.headerText}
                  >
                    Customer
                  </DataTable.Title>
                  <DataTable.Title
                    style={styles.headerCell}
                    textStyle={styles.headerText}
                  >
                    Quantity
                  </DataTable.Title>
                  <DataTable.Title
                    sortDirection={sortColumn === 'customerAddress' ? sortDirection : undefined}
                    onPress={() => handleSort('customerAddress')}
                    style={styles.headerCell}
                    textStyle={styles.headerText}
                  >
                    Address
                  </DataTable.Title>
                </DataTable.Header>

                {sortedOrders.length === 0 ? (
                  <View style={styles.noDataContainer}>
                    <MaterialCommunityIcons name="calendar-blank" size={48} color="#BBDEFB" />
                    <Text style={styles.noDataText}>No orders for today</Text>
                    <Text style={styles.noDataSubtext}>Check back later for new orders</Text>
                  </View>
                ) : (
                  sortedOrders.slice(from, to).map((item, index) => (
                    <DataTable.Row 
                      key={item.orderId?.toString()} 
                      onPress={() => onRowPress(item)}
                      style={[
                        styles.tableRow,
                        index % 2 === 0 ? styles.evenRow : styles.oddRow
                      ]}
                    >
                      <DataTable.Cell style={styles.cell}>
                        <View style={styles.customerCell}>
                          <Text style={styles.customerName}>{item.customerName}</Text>
                          <Text style={styles.orderDate}>
                            {item.orderDate ? formatDate(item.orderDate) : 'N/A'}
                          </Text>
                        </View>
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.cell}>
                        <View style={styles.quantityCell}>
                          <Text style={styles.quantityText}>{item.milkQuantity}</Text>
                          <Text style={styles.quantityUnit}>liters</Text>
                        </View>
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.cell}>
                        <Text style={styles.addressText} numberOfLines={2}>
                          {item.customerAddress}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))
                )}
              </DataTable>

              {sortedOrders.length > 0 && (
                <CustomPagination
                  page={page}
                  numberOfPages={Math.ceil(sortedOrders.length / rowsPerPage)}
                  onPageChange={(page) => setPage(page)}
                />
              )}
            </Animated.View>

            {/* Modal for Confirm/Cancel Order */}
            <Portal>
              <Modal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                contentContainerStyle={styles.modalContainer}
              >
                <View style={styles.cardContainer}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Order Details</Text>
                    <Text style={styles.orderStatus}>{selectedItem?.status}</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>Customer Information</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Name:</Text>
                        <Text style={styles.detailValue}>{selectedItem?.customerName}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Address:</Text>
                        <Text style={styles.detailValue}>{selectedItem?.customerAddress}</Text>
                      </View>
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>Order Information</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Order Date:</Text>
                        <Text style={styles.detailValue}>
                          {selectedItem?.orderDate ? formatDate(selectedItem.orderDate) : 'N/A'}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Quantity:</Text>
                        <Text style={styles.detailValue}>{selectedItem?.milkQuantity || 0} liters</Text>
                      </View>
                    </View>

                    {selectedItem?.note && (
                      <View style={styles.detailSection}>
                        <Text style={styles.sectionTitle}>Additional Notes</Text>
                        <View style={styles.noteContainer}>
                          <Text style={styles.noteText}>{selectedItem.note}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                  <View style={styles.cardActions}>
                    <Button 
                      mode="contained" 
                      onPress={confirmOrder} 
                      style={[styles.button, styles.confirmButton]}
                    >
                      Confirm Order
                    </Button>
                    <Button 
                      mode="outlined" 
                      onPress={cancelOrder} 
                      style={[styles.button, styles.cancelButton]}
                    >
                      Cancel Order
                    </Button>
                  </View>
                </View>
              </Modal>
            </Portal>
          </View>
        </LinearGradient>
      </PaperProvider>
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
  tableContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  modalContainer: {
    backgroundColor: 'transparent',
    margin: 20,
    padding: 20,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    textTransform: 'capitalize',
  },
  cardContent: {
    padding: 16,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  detailLabel: {
    width: '30%',
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    width: '70%',
    fontSize: 14,
    color: '#333',
  },
  noteContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  noteText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  cardActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    borderColor: '#f44336',
  },
  tableHeaderContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  tableSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
    color: '#495057',
  },
  tableRow: {
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#f8f9fa',
  },
  cell: {
    justifyContent: 'center',
  },
  customerCell: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  quantityCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginRight: 4,
  },
  quantityUnit: {
    fontSize: 12,
    color: '#666',
  },
  addressText: {
    fontSize: 13,
    color: '#495057',
    lineHeight: 18,
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
});