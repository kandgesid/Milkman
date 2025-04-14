import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { Appbar, Drawer, DataTable, Portal, Modal, Button } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import useMilkManagement from '../hooks/useMilkmanManagement';
import useUserManagement from '../hooks/useUserManagement';

interface DrawerLayoutRef {
  openDrawer: () => void;
  closeDrawer: () => void;
}

export default function TodaysOrderScreen() {
  const { id } = useLocalSearchParams();
  const { userId, setUserId, milkmans } = useMilkManagement();
  const { handleLogout } = useUserManagement();

  // Sorting state: only for 'name' and 'address'
  const [sortColumn, setSortColumn] = useState<'name' | 'address'>('name');
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

  const handleSort = (column: 'name' | 'address') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortColumn(column);
      setSortDirection('ascending');
    }
  };

  // Sort the milkmans data based on the selected column and direction.
  const sortedMilkmans = [...milkmans].sort((a, b) => {
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
  const to = Math.min((page + 1) * rowsPerPage, sortedMilkmans.length);

  // State for selected row (order) modal
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onRowPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const confirmOrder = () => {
    // Implement order confirmation logic here (e.g., update status or call an API)
    console.log('Order confirmed for:', selectedItem);
    setModalVisible(false);
    setSelectedItem(null);
  };

  const cancelOrder = () => {
    // Implement order cancellation logic here
    console.log('Order cancelled for:', selectedItem);
    setModalVisible(false);
    setSelectedItem(null);
  };

  const navigationView = () => (
    <View style={styles.drawerContainer}>
      <Drawer.Section title="Menu">
        <Drawer.Item
          label="My Customers"
          icon="account-group"
          active={false}
          onPress={() => {
            router.push(`/screens/milkmanHome?id=${userId}`);
          }}
        />
        <Drawer.Item
          label="Today's Order"
          icon="calendar"
          active={true}
          onPress={() => {
            router.push(`/screens/todaysOrder?id=${userId}`);
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
          <Appbar.Content title="Today's Order" />
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
          <DataTable>
            <DataTable.Header>
              <DataTable.Title
                sortDirection={sortColumn === 'name' ? sortDirection : undefined}
                onPress={() => handleSort('name')}
              >
                Name
              </DataTable.Title>
              <DataTable.Title>
                Phone
              </DataTable.Title>
              <DataTable.Title>
                Quantity
              </DataTable.Title>
              <DataTable.Title
                sortDirection={sortColumn === 'address' ? sortDirection : undefined}
                onPress={() => handleSort('address')}
              >
                Address
              </DataTable.Title>
            </DataTable.Header>

            {sortedMilkmans.slice(from, to).map((item) => (
              <DataTable.Row key={item.id?.toString()} onPress={() => onRowPress(item)}>
                <DataTable.Cell>{item.name}</DataTable.Cell>
                <DataTable.Cell>{item.phoneNumber}</DataTable.Cell>
                <DataTable.Cell>{0}</DataTable.Cell>
                <DataTable.Cell>{item.address}</DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(sortedMilkmans.length / rowsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${sortedMilkmans.length}`}
            />
          </DataTable>
        </Animated.View>

        {/* Modal for Confirm/Cancel Order */}
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <View>
              <DataTable>
                <DataTable.Row>
                  <DataTable.Cell>{selectedItem?.name}</DataTable.Cell>
                  <DataTable.Cell>{selectedItem?.phoneNumber}</DataTable.Cell>
                  <DataTable.Cell>{selectedItem?.quantity || 0}</DataTable.Cell>
                  <DataTable.Cell>{selectedItem?.address}</DataTable.Cell>
                </DataTable.Row>
              </DataTable>
              <Button mode="contained" onPress={confirmOrder} style={styles.button}>
                Confirm Order
              </Button>
              <Button mode="outlined" onPress={cancelOrder} style={styles.button}>
                Cancel Order
              </Button>
            </View>
          </Modal>
        </Portal>
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
  modalContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  button: {
    marginTop: 10,
  },
});