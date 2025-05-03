import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { Appbar, Text, Drawer, Searchbar, Surface, useTheme, DataTable, Portal, Modal, Provider as PaperProvider, Button } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';

import useUserManagement from '../hooks/useUserManagement';
import useCustomerManagement from '../hooks/useCustomerManagement';
import { Milkman } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CustomPagination from '../components/CustomPagination';

interface DrawerLayoutRef {
  openDrawer: () => void;
  closeDrawer: () => void;
}

const ITEMS_PER_PAGE = 10;

export default function CustomerHomeScreen() {
  const { id } = useLocalSearchParams();
  const [selectedMilkman, setSelectedMilkman] = useState<Milkman | null>(null);
  const [showMilkmanDetails, setShowMilkmanDetails] = useState(false);
  const { userId, setUserId, milkmans } = useCustomerManagement();
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

  const handleMilkmanPress = (milkman: Milkman) => {
    setSelectedMilkman(milkman);
    setShowMilkmanDetails(true);
  };

  const handleLogoutButton = () => {
    handleLogout();
    router.push('/screens/landingPage');
  };

  const handlePlaceOrder = (milkmanId: string, customerId: string) => {
    router.push({
      pathname: '/screens/placeOrder',
      params: { milkmanId, customerId }
    });
    setShowMilkmanDetails(false);
  };

  const filteredCustomers = milkmans.filter(milkman => 
    milkman.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    milkman.phoneNumber?.includes(searchQuery)
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
            label="My Milkmans"
            icon="account-group"
            active={true}
            onPress={() => router.push(`/screens/customerHome?id=${userId}`)}
            style={styles.drawerItem}
            theme={{ colors: { onSurfaceVariant: '#000000', onSurface: '#000000' } }}
          />
          <Drawer.Item
            label="My Orders"
            icon="calendar"
            onPress={() => router.push(`/screens/myOrder?id=${userId}`)}
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
            <Appbar.Content title="My Milkmans" titleStyle={styles.appbarTitle} />
            <Appbar.Action icon="logout" onPress={handleLogoutButton} />
          </Appbar.Header>

          <ScrollView style={styles.scrollView}>
            {/* Statistics Card */}
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
                <Text style={styles.statNumber}>{milkmans.length}</Text>
                <Text style={styles.statLabel}>Total Milkmans</Text>
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
                placeholder="Search milkmans..."
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
                <Text style={styles.tableTitle}>Milkman List</Text>
                <Text style={styles.tableSubtitle}>{filteredCustomers.length} milkmans</Text>
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
                        <MaterialCommunityIcons name="truck-delivery-outline" size={48} color="#BBDEFB" />
                        <Text style={styles.noDataText}>No milkmans found</Text>
                        <Text style={styles.noDataSubtext}>Add a milkman to start ordering</Text>
                      </View>
                    ) : (
                      filteredCustomers.slice(from, to).map((milkman, index) => (
                        <TouchableOpacity
                          key={milkman.id?.toString()}
                          onPress={() => handleMilkmanPress(milkman)}
                          style={styles.rowTouchable}
                        >
                          <DataTable.Row 
                            style={[
                              styles.tableRow,
                              index % 2 === 0 ? styles.evenRow : styles.oddRow
                            ]}
                          >
                            <DataTable.Cell style={[styles.cell, { flex: 2 }]}>
                              <Text style={[styles.customerName, { textAlign: 'center' }]} numberOfLines={1}>{milkman.name}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={[styles.cell, { flex: 1.5 }]}>
                              <Text style={[styles.phoneText, { textAlign: 'center' }]} numberOfLines={1}>{milkman.phoneNumber}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={[styles.cell, { flex: 1 }]}>
                              <Text style={[styles.phoneText, { textAlign: 'center' }]} numberOfLines={1}>{milkman.dueAmount || '0'}</Text>
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

          {/* Milkman Details Modal */}
          <Portal>
            <Modal
              visible={showMilkmanDetails}
              onDismiss={() => setShowMilkmanDetails(false)}
              contentContainerStyle={styles.modalContainer}
            >
              {selectedMilkman && (
                <View style={styles.cardContainer}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleContainer}>
                      <MaterialCommunityIcons name="account-circle" size={32} color="#1976D2" />
                      <Text style={styles.cardTitle}>Milkman Details</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => setShowMilkmanDetails(false)}
                      style={styles.closeButton}
                    >
                      <MaterialCommunityIcons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.cardContent}>
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>Personal Information</Text>
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="account" size={24} color="#1976D2" />
                        <View style={styles.detailTextContainer}>
                          <Text style={styles.detailLabel}>Name</Text>
                          <Text style={styles.detailValue}>{selectedMilkman.name}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.detailDivider} />
                      
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="phone" size={24} color="#1976D2" />
                        <View style={styles.detailTextContainer}>
                          <Text style={styles.detailLabel}>Phone</Text>
                          <Text style={styles.detailValue}>{selectedMilkman.phoneNumber}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.detailDivider} />
                      
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="map-marker" size={24} color="#1976D2" />
                        <View style={styles.detailTextContainer}>
                          <Text style={styles.detailLabel}>Address</Text>
                          <Text style={styles.detailValue}>{selectedMilkman.address}</Text>
                        </View>
                      </View>

                      <View style={styles.detailDivider} />
                      
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="currency-inr" size={24} color="#1976D2" />
                        <View style={styles.detailTextContainer}>
                          <Text style={styles.detailLabel}>Milk Rate</Text>
                          <Text style={styles.detailValue}>{selectedMilkman.milkRate || '0'}</Text>
                        </View>
                      </View>

                      <View style={styles.detailDivider} />
                      
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="cash" size={24} color="#1976D2" />
                        <View style={styles.detailTextContainer}>
                          <Text style={styles.detailLabel}>Due Amount</Text>
                          <Text style={styles.detailValue}>{selectedMilkman.dueAmount || '0'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardActions}>
                    <Button
                      mode="contained"
                      onPress={() => handlePlaceOrder(selectedMilkman.id?.toString() || '', userId || '')}
                      style={styles.orderButton}
                      labelStyle={styles.orderButtonLabel}
                      icon="cart"
                    >
                      Place Order
                    </Button>
                  </View>
                </View>
              )}
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
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
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
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#E3F2FD',
    marginVertical: 8,
  },
  cardActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  orderButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 2,
  },
  orderButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 4,
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
});