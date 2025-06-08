import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Appbar, Text, DataTable, useTheme, Menu, Button, Surface, Chip, Modal, Portal, Drawer, Provider as PaperProvider } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useCustomerComplaintsManagement from '../hooks/useCustomerComplaintsManagement';
import useUserManagement from '../hooks/useUserManagement';
import { MyComplaint } from '../types';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';

interface DrawerLayoutRef {
  openDrawer: () => void;
  closeDrawer: () => void;
}

// Mock data - replace with actual data from your backend

const statusColors = {
  'PENDING': '#FFA000',
  'NEW': '#FFA000',
  'IN_PROGRESS': '#1976D2',
  'RESOLVED': '#43A047',
} as const;

type StatusType = keyof typeof statusColors;

const { width } = Dimensions.get('window');

const ITEMS_PER_PAGE = 2;

export default function MyComplaintsScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const [statusFilter, setStatusFilter] = useState<StatusType | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<MyComplaint | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(0);
  const { myComplaints, userId, setUserId, setUserRole } = useCustomerComplaintsManagement();
  const { handleLogout } = useUserManagement();

  const animation = useRef(new Animated.Value(0)).current;
  const drawerRef = useRef<DrawerLayoutRef | null>(null);

  useEffect(() => {
    if (id) {
      setUserId(id as string);
    }
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [id]);

  const handleLogoutButton = () => {
    handleLogout();
    router.push('/screens/landingPage');
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
            onPress={() => router.push(`/screens/customerHome?id=${userId}`)}
            style={styles.drawerItem}
            theme={{ colors: { onSurfaceVariant: '#000000', onSurface: '#000000' } }}
          />
          <Drawer.Item
            label="My Orders"
            icon="calendar"
            active={false}
            onPress={() => router.push(`/screens/myOrder?id=${userId}`)}
            style={styles.drawerItem}
            theme={{ colors: { onSurfaceVariant: '#000000', onSurface: '#000000' } }}
          />
          <Drawer.Item
            label="My Raised Complaints"
            icon="alert-circle"
            active={true}
            onPress={() => router.push(`/screens/myComplaints?id=${userId}`)}
            style={styles.drawerItem}
            theme={{ colors: { onSurfaceVariant: '#000000', onSurface: '#000000' } }}
          />
          <Drawer.Item
            label="Settings"
            icon="cog"
            onPress={() => router.push(`/screens/customerSettings?id=${userId}`)}
            style={styles.drawerItem}
            theme={{ colors: { onSurfaceVariant: '#000000', onSurface: '#000000' } }}
          />
        </Drawer.Section>
      </View>
    </PaperProvider>
  );

  const filteredComplaints = myComplaints
    .filter(complaint => !statusFilter || complaint.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.complaintDate).getTime();
      const dateB = new Date(b.complaintDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const from = page * ITEMS_PER_PAGE;
  const to = Math.min((page + 1) * ITEMS_PER_PAGE, filteredComplaints.length);
  const paginatedComplaints = filteredComplaints.slice(from, to);

  const handleComplaintPress = (complaint: MyComplaint) => {
    setSelectedComplaint(complaint);
    setModalVisible(true);
  };

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
            <Appbar.Content title="My Complaints" titleStyle={styles.appbarTitle} />
            <Appbar.Action icon="logout" onPress={handleLogoutButton} color="#000000" />
          </Appbar.Header>

          <ScrollView style={styles.scrollView}>
            {/* Statistics Card */}
            <Surface style={styles.statsCard}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="alert-circle" size={24} color="#1976D2" />
                  <Text style={styles.statNumber}>{filteredComplaints.length}</Text>
                  <Text style={styles.statLabel}>Total Complaints</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="clock-outline" size={24} color="#FFA000" />
                  <Text style={styles.statNumber}>
                    {filteredComplaints.filter(c => c.status === 'NEW' || c.status === 'PENDING').length}
                  </Text>
                  <Text style={styles.statLabel}>Pending / New</Text>
                </View>
              </View>
            </Surface>

            {/* Filters */}
            <View style={styles.filterContainer}>
              <Menu
                visible={statusMenuVisible}
                onDismiss={() => setStatusMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setStatusMenuVisible(true)}
                    style={styles.filterButton}
                    icon="filter"
                    contentStyle={styles.filterButtonContent}
                    textColor="#000000"
                    labelStyle={styles.filterButtonLabel}
                  >
                    {statusFilter || 'Filter by Status'}
                  </Button>
                }
              >
                <Menu.Item onPress={() => { setStatusFilter(null); setStatusMenuVisible(false); }} title="All" />
                <Menu.Item onPress={() => { setStatusFilter('NEW'); setStatusMenuVisible(false); }} title="New" />
                <Menu.Item onPress={() => { setStatusFilter('PENDING'); setStatusMenuVisible(false); }} title="Pending" />
                <Menu.Item onPress={() => { setStatusFilter('IN_PROGRESS'); setStatusMenuVisible(false); }} title="In Progress" />
                <Menu.Item onPress={() => { setStatusFilter('RESOLVED'); setStatusMenuVisible(false); }} title="Resolved" />
              </Menu>

              <Menu
                visible={sortMenuVisible}
                onDismiss={() => setSortMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setSortMenuVisible(true)}
                    style={styles.filterButton}
                    icon="sort"
                    contentStyle={styles.filterButtonContent}
                    textColor="#000000"
                    labelStyle={styles.filterButtonLabel}
                  >
                    Sort by Date
                  </Button>
                }
              >
                <Menu.Item onPress={() => { setSortOrder('desc'); setSortMenuVisible(false); }} title="Newest First" />
                <Menu.Item onPress={() => { setSortOrder('asc'); setSortMenuVisible(false); }} title="Oldest First" />
              </Menu>
            </View>

            {/* Complaints List */}
            <Surface style={styles.tableContainer}>
              {filteredComplaints.length === 0 ? (
                <View style={styles.noDataContainer}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#BBDEFB" />
                  <Text style={styles.noDataText}>No complaints found</Text>
                  <Text style={styles.noDataSubtext}>
                    {statusFilter ? `No ${statusFilter.toLowerCase()} complaints` : 'You have not raised any complaints yet'}
                  </Text>
                </View>
              ) : (
                <DataTable>
                  <DataTable.Header style={styles.tableHeader}>
                    <DataTable.Title style={[styles.headerCell, { flex: 1.5 }]}>
                      <Text style={styles.headerText}>Date</Text>
                    </DataTable.Title>
                    <DataTable.Title style={[styles.headerCell, { flex: 2 }]}>
                      <Text style={styles.headerText}>Milkman</Text>
                    </DataTable.Title>
                    <DataTable.Title style={[styles.headerCell, { flex: 1.2 }]}>
                      <Text style={styles.headerText}>Status</Text>
                    </DataTable.Title>
                  </DataTable.Header>

                  {paginatedComplaints.map((complaint) => (
                    <TouchableOpacity
                      key={complaint.id}
                      onPress={() => handleComplaintPress(complaint)}
                    >
                      <DataTable.Row style={styles.tableRow}>
                        <DataTable.Cell style={[styles.cell, { flex: 1.5 }]}>
                          <Text style={styles.dateText}>{complaint.complaintDate}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={[styles.cell, { flex: 2 }]}>
                          <Text style={styles.milkmanName} numberOfLines={1}>{complaint.milkmanName}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={[styles.cell, { flex: 1.2 }]}>
                          <Chip
                            mode="flat"
                            style={[styles.statusChip, { backgroundColor: statusColors[complaint.status as StatusType] }]}
                            textStyle={styles.statusChipText}
                          >
                            {complaint.status}
                          </Chip>
                        </DataTable.Cell>
                      </DataTable.Row>
                    </TouchableOpacity>
                  ))}

                  <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE)}
                    onPageChange={setPage}
                    label={`${from + 1}-${to} of ${filteredComplaints.length}`}
                    showFastPaginationControls
                    numberOfItemsPerPage={ITEMS_PER_PAGE}
                    selectPageDropdownLabel={'Rows per page'}
                    style={styles.pagination}
                    theme={{
                      colors: {
                        text: '#000000',
                        primary: '#000000',
                        onSurface: '#000000',
                        onSurfaceVariant: '#000000',
                        surfaceDisabled: '#000000',
                        onSurfaceDisabled: '#000000',
                        secondary: '#000000',
                        onSecondary: '#000000',
                      },
                    }}
                  />
                </DataTable>
              )}
            </Surface>
          </ScrollView>

          {/* Complaint Details Modal */}
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={styles.modalContainer}
            >
              {selectedComplaint && (
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Complaint Details</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <MaterialCommunityIcons name="close" size={24} color="#000000" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalBody}>
                    <View style={styles.modalRow}>
                      <Text style={styles.modalLabel}>Milkman</Text>
                      <Text style={styles.modalText}>{selectedComplaint.milkmanName}</Text>
                    </View>

                    <View style={styles.modalRow}>
                      <Text style={styles.modalLabel}>Date</Text>
                      <Text style={styles.modalText}>{selectedComplaint.complaintDate}</Text>
                    </View>

                    <View style={styles.modalRow}>
                      <Text style={styles.modalLabel}>Status</Text>
                      <Chip
                        mode="flat"
                        style={[styles.statusChip, { backgroundColor: statusColors[selectedComplaint.status as StatusType] }]}
                        textStyle={styles.statusChipText}
                      >
                        {selectedComplaint.status}
                      </Chip>
                    </View>

                    <View style={styles.modalRow}>
                      <Text style={styles.modalLabel}>Complaint</Text>
                      <Text style={styles.modalText}>{selectedComplaint.description}</Text>
                    </View>
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
  statsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    padding: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#000000',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    flex: 1,
    maxWidth: 200,
    borderColor: '#000000',
    borderWidth: 1,
  },
  filterButtonContent: {
    height: 40,
  },
  filterButtonLabel: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  tableContainer: {
    margin: 16,
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000000',
  },
  tableHeader: {
    backgroundColor: '#FFFFFF',
    height: 50,
  },
  headerCell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  tableRow: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  milkmanName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  dateText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  statusChip: {
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
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
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    width: '90%',
    alignSelf: 'center',
  },
  modalContent: {
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  modalBody: {
    paddingTop: 16,
    gap: 16,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  modalLabel: {
    width: 80,
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  modalText: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    marginLeft: 8,
  },
  pagination: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  paginationLabel: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  paginationDropdown: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
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