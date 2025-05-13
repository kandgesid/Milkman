import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Text, ScrollView } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { Appbar, Drawer, DataTable, Portal, Modal, Button, Chip, Menu, PaperProvider } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import useCustomerOrderManagement from '../hooks/useCustomerOrderManagement';
import useUserManagement from '../hooks/useUserManagement';
import { MyOrder } from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomPagination from '../components/CustomPagination';

interface DrawerLayoutRef {
  openDrawer: () => void;
  closeDrawer: () => void;
}

export default function MyOrderScreen() {
  const { id } = useLocalSearchParams();
  const { userId, setUserId, myOrders, handleOrderCancellation } = useCustomerOrderManagement();
  const { handleLogout } = useUserManagement();

  // Tab state
  const [activeTab, setActiveTab] = useState<'current' | 'previous'>('current');

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<'orderDate' | 'status'>('orderDate');
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');

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

  const handleSort = (column: 'orderDate' | 'status') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortColumn(column);
      setSortDirection('ascending');
    }
  };

  // Filter and sort orders
  const filteredAndSortedOrders = React.useMemo(() => {
    // Get today's date at midnight UTC
    const today = new Date();
    const todayUTC = new Date(Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0, 0, 0, 0
    ));

    let filtered = myOrders.filter(order => {
      // Parse the order date and create UTC date
      const [year, month, day] = order.orderDate.split('-').map(Number);
      const orderDateUTC = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      
      const matchesTab = activeTab === 'current' 
        ? orderDateUTC >= todayUTC 
        : orderDateUTC < todayUTC;
      
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      return matchesTab && matchesStatus;
    });

    return filtered.sort((a, b) => {
      if (sortColumn === 'orderDate') {
        const [yearA, monthA, dayA] = a.orderDate.split('-').map(Number);
        const [yearB, monthB, dayB] = b.orderDate.split('-').map(Number);
        const dateA = new Date(Date.UTC(yearA, monthA - 1, dayA, 0, 0, 0, 0)).getTime();
        const dateB = new Date(Date.UTC(yearB, monthB - 1, dayB, 0, 0, 0, 0)).getTime();
        return sortDirection === 'ascending' ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === 'ascending'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
    });
  }, [myOrders, activeTab, statusFilter, sortColumn, sortDirection]);

  // Helper function to format date consistently
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const from = page * rowsPerPage;
  const to = Math.min((page + 1) * rowsPerPage, filteredAndSortedOrders.length);

  // State for selected row (order) modal
  const [selectedItem, setSelectedItem] = useState<MyOrder | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onRowPress = (item: MyOrder) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleEditOrder = () => {
    if (selectedItem) {
      router.push({
        pathname: '/screens/editOrder',
        params: {
          orderId: selectedItem.orderId,
          quantity: selectedItem.quantity.toString(),
          note: selectedItem.note || '',
          orderDate: selectedItem.orderDate,
          userId: userId
        }
      });
    }
    setModalVisible(false);
  };

  const handleDeleteOrder = () => {
    // Implement delete order logic here
    console.log('Delete order:', selectedItem);
    setModalVisible(false);
    if (selectedItem) {
      handleOrderCancellation(selectedItem.orderId);
    }
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
            label="My Milkmans"
            icon="account-group"
            active={false}
            onPress={() => {
              router.push(`/screens/customerHome?id=${userId}`);
            }}
            style={styles.drawerItem}
            theme={{ colors: { onSurfaceVariant: '#000000', onSurface: '#000000' } }}
          />
          <Drawer.Item
            label="My Orders"
            icon="calendar"
            active={true}
            onPress={() => {
              router.push(`/screens/myOrder?id=${userId}`);
            }}
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

  const renderFilterSection = () => (
    <View style={styles.filterContainer}>
      <View style={styles.tabContainer}>
        <Chip
          selected={activeTab === 'current'}
          onPress={() => setActiveTab('current')}
          style={[
            styles.tabChip,
            activeTab === 'current' && styles.activeTabChip
          ]}
          textStyle={[
            styles.chipText,
            activeTab === 'current' && styles.activeChipText
          ]}
        >
          Current Orders
        </Chip>
        <Chip
          selected={activeTab === 'previous'}
          onPress={() => setActiveTab('previous')}
          style={[
            styles.tabChip,
            activeTab === 'previous' && styles.activeTabChip
          ]}
          textStyle={[
            styles.chipText,
            activeTab === 'previous' && styles.activeChipText
          ]}
        >
          Previous Orders
        </Chip>
      </View>
      
      <View style={styles.filterRow}>
        <Menu
          visible={statusMenuVisible}
          onDismiss={() => setStatusMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setStatusMenuVisible(true)}
              style={[
                styles.filterButton,
                statusFilter && styles.activeFilterButton
              ]}
              textColor="#000"
            >
              {statusFilter ? `Status: ${statusFilter}` : 'Filter by Status'}
            </Button>
          }
        >
          <Menu.Item onPress={() => { setStatusFilter(null); setStatusMenuVisible(false); }} title="All" />
          <Menu.Item onPress={() => { setStatusFilter('PENDING'); setStatusMenuVisible(false); }} title="Pending" />
          <Menu.Item onPress={() => { setStatusFilter('DELIVERED'); setStatusMenuVisible(false); }} title="Delivered" />
          <Menu.Item onPress={() => { setStatusFilter('NOT DELIVERED'); setStatusMenuVisible(false); }} title="Not Delivered" />
        </Menu>

        {statusFilter && (
          <Button
            mode="text"
            onPress={() => setStatusFilter(null)}
            style={styles.clearButton}
            textColor="#000"
          >
            Clear Filter
          </Button>
        )}
      </View>
    </View>
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
            <Appbar.Content title="My Orders" titleStyle={styles.appbarTitle} />
            <Appbar.Action icon="logout" onPress={handleLogoutButton} />
          </Appbar.Header>

          <ScrollView style={styles.scrollView}>
            {renderFilterSection()}

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
                <Text style={styles.tableTitle}>
                  {activeTab === 'current' ? 'Current Orders' : 'Previous Orders'}
                </Text>
                <Text style={styles.tableSubtitle}>{filteredAndSortedOrders.length} orders found</Text>
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
                      sortDirection={sortColumn === 'orderDate' ? sortDirection : undefined}
                      onPress={() => handleSort('orderDate')}
                      style={[styles.headerCell, { flex: 2 }]}
                      textStyle={styles.headerText}
                    >
                      Order Date
                    </DataTable.Title>
                    <DataTable.Title
                      style={[styles.headerCell, { flex: 2 }]}
                      textStyle={styles.headerText}
                    >
                      Milkman Name
                    </DataTable.Title>
                    <DataTable.Title
                      style={[styles.headerCell, { flex: 1 }]}
                      textStyle={styles.headerText}
                    >
                      Quantity
                    </DataTable.Title>
                    <DataTable.Title
                      sortDirection={sortColumn === 'status' ? sortDirection : undefined}
                      onPress={() => handleSort('status')}
                      style={[styles.headerCell, { flex: 1.5 }]}
                      textStyle={styles.headerText}
                    >
                      Status
                    </DataTable.Title>
                  </DataTable.Header>

                  {filteredAndSortedOrders.slice(from, to).map((item, index) => (
                    <DataTable.Row 
                      key={item.orderId} 
                      onPress={() => onRowPress(item)}
                      style={[
                        styles.tableRow,
                        index % 2 === 0 ? styles.evenRow : styles.oddRow
                      ]}
                    >
                      <DataTable.Cell style={[styles.cell, { flex: 2 }]}>
                        <Text style={styles.cellText}>
                          {item?.orderDate ? formatDate(item.orderDate) : 'N/A'}
                        </Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={[styles.cell, { flex: 2 }]}>
                        <Text style={styles.cellText}>{item.milkmanName}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={[styles.cell, { flex: 1 }]}>
                        <Text style={styles.cellText}>{item.quantity} L</Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={[styles.cell, { flex: 1.5 }]}>
                        <Text style={[
                          styles.cellText,
                          styles.statusText,
                          { 
                            color: item.status === 'DELIVERED' 
                              ? '#2E7D32' 
                              : item.status === 'PENDING'
                                ? '#F57C00'
                                : '#D32F2F'
                          }
                        ]}>
                          {item.status}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}

                  <CustomPagination
                    page={page}
                    numberOfPages={Math.ceil(filteredAndSortedOrders.length / rowsPerPage)}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                </DataTable>
              </PaperProvider>
            </Animated.View>
          </ScrollView>

          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={styles.modalContainer}
            >
              <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Order Details</Text>
                  <Text style={[
                    styles.orderStatus,
                    { color: selectedItem?.status === 'DELIVERED' ? '#4CAF50' : '#FFA000' }
                  ]}>
                    {selectedItem?.status}
                  </Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Order Information</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Order Date:</Text>
                      <Text style={styles.detailValue}>
                        {selectedItem?.orderDate ? formatDate(selectedItem.orderDate) : 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Milkman Name:</Text>
                      <Text style={styles.detailValue}>{selectedItem?.milkmanName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Quantity:</Text>
                      <Text style={styles.detailValue}>{selectedItem?.quantity} L</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Rate:</Text>
                      <Text style={styles.detailValue}>₹{selectedItem?.rate}/L</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Total Amount:</Text>
                      <Text style={styles.detailValue}>₹{selectedItem?.amount}</Text>
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
                  {selectedItem?.status === 'PENDING' ? (
                    <>
                      <Button 
                        mode="contained" 
                        onPress={handleEditOrder} 
                        style={[styles.button, styles.editButton]}
                      >
                        Edit Order
                      </Button>
                      <Button 
                        mode="outlined" 
                        onPress={handleDeleteOrder} 
                        style={[styles.button, styles.deleteButton]}
                      >
                        Delete Order
                      </Button>
                    </>
                  ) : (
                    <Text style={styles.disabledActionText}>
                      Orders can only be edited or deleted when they are in PENDING status
                    </Text>
                  )}
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
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  tabChip: {
    marginHorizontal: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeTabChip: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  chipText: {
    color: '#000',
    fontWeight: '500',
  },
  activeChipText: {
    color: '#fff',
  },
  filterButton: {
    borderColor: '#1976D2',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  activeFilterButton: {
    backgroundColor: '#E3F2FD',
  },
  clearButton: {
    marginLeft: 8,
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
    color: '#000',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
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
    color: '#000',
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
    color: '#000',
    fontWeight: '500',
  },
  detailValue: {
    width: '70%',
    fontSize: 14,
    color: '#000',
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
    color: '#000',
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
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    borderColor: '#f44336',
  },
  tableHeaderContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  tableSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerCell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  tableRow: {
    height: 60,
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
    paddingHorizontal: 8,
  },
  cellText: {
    fontSize: 14,
    color: '#000',
  },
  statusText: {
    textTransform: 'capitalize',
    fontWeight: '500',
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
  disabledActionText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    padding: 8,
  },
});