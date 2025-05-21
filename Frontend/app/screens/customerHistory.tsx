import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Modal, Dimensions, ActivityIndicator, Share } from 'react-native';
import { Appbar, Text, Button, useTheme, Card, Chip, Searchbar, Menu, Divider } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { getHistoryData, MilkmanHistory, Customer } from '../types';
import useMilkmanHistoryManagement from '../hooks/useMilkmanHistoryManagement';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { formatDateForDisplay, formatDateToLocalTimezone, formatEndOfDayDateToLocalTimezone, getCurrentDate, getMinimumSelectableDate } from '../utils/dateUtils';

const screenWidth = Dimensions.get('window').width;
const baseFont = screenWidth < 350 ? 12 : 15;

export default function CustomerHistoryScreen() {
  const { milkmanId, customerId, customerName, customerPhone, customerAddress, customerRate } = useLocalSearchParams();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(formatEndOfDayDateToLocalTimezone(getCurrentDate()));
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [historyData, setHistoryData] = useState<MilkmanHistory[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const theme = useTheme();
  const { handleGetHistory } = useMilkmanHistoryManagement();
  const [displayedItems, setDisplayedItems] = useState<MilkmanHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredHistory = React.useMemo(() => {
    let filtered = historyData.filter(item => {
      if (statusFilter === null) return true;
      
      // Normalize both the item status and filter status for comparison
      const itemStatus = item.delivery_status.trim().toUpperCase();
      const filterStatus = statusFilter.trim().toUpperCase();
      
      // Handle both "DELIVERED" and "NOT DELIVERED" cases
      if (filterStatus === 'DELIVERED') {
        return itemStatus === 'DELIVERED';
      } else if (filterStatus === 'NOT DELIVERED') {
        return itemStatus === 'NOT DELIVERED' || itemStatus === 'NOT_DELIVERED';
      }
      
      return false;
    });

    // Sort by date
    return filtered.sort((a, b) => {
      const dateA = new Date(a.delivery_date).getTime();
      const dateB = new Date(b.delivery_date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [historyData, statusFilter, sortOrder]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);

  // Update displayed items when page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedItems(filteredHistory.slice(startIndex, endIndex));
  }, [currentPage, filteredHistory]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of visible pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the start
      if (currentPage <= 2) {
        endPage = 4;
      }
      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const handleFromDateChange = (event: any, selectedDate?: Date) => {
    setShowFromDatePicker(false);
    if (selectedDate) {
      // Create a new date object in local timezone
      
      const localDate = formatDateToLocalTimezone(selectedDate);
      setFromDate(localDate);
    }
  };

  const handleToDateChange = (event: any, selectedDate?: Date) => {
    setShowToDatePicker(false);
    if (selectedDate) {
      // Create a new date object in local timezone
      const localDate = formatEndOfDayDateToLocalTimezone(selectedDate);
      console.log('localToDate', localDate);
      setToDate(localDate);
    }
  };

  const getHistory = async () => {
    console.log('Fetching history for:', {
      milkmanId,
      customerId,
      fromDate,
      toDate
    });
    const historyData: getHistoryData = {
      customerId: customerId as string,
      milkmanId: milkmanId as string,
      fromDate: formatDateToLocalTimezone(fromDate),
      toDate: formatEndOfDayDateToLocalTimezone(toDate)
    };
    const result = await handleGetHistory(historyData);
    setHistoryData(result);
    // Update to use filteredHistory instead of result directly
    setDisplayedItems(filteredHistory.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  const handleScroll = useCallback((event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    if (isCloseToBottom && displayedItems.length < filteredHistory.length) {
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * ITEMS_PER_PAGE;
      setDisplayedItems(filteredHistory.slice(startIndex, endIndex));
      setCurrentPage(nextPage);
    }
  }, [currentPage, displayedItems.length, filteredHistory]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return '#4CAF50';
      case 'NOT DELIVERED':
      case 'NOT_DELIVERED':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const calculateTotalAmount = () => {
    console.log("historyData", historyData.filter(item => item.delivery_status.toUpperCase() === ("DELIVERED")));
    
    return historyData
      .filter(item => item.delivery_status.toUpperCase() === ('DELIVERED'))
      .reduce((total, item) => total + item.due_amount, 0);
  };

  const generatePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Create HTML content for the PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body {
                font-family: 'Helvetica';
                padding: 20px;
                color: #333;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #1976D2;
                padding-bottom: 20px;
              }
              .customer-info {
                margin-bottom: 30px;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 8px;
              }
              .statement-period {
                margin-bottom: 20px;
                color: #666;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th {
                background-color: #1976D2;
                color: white;
                padding: 12px;
                text-align: left;
              }
              td {
                padding: 12px;
                border-bottom: 1px solid #ddd;
              }
              .total-amount {
                text-align: right;
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
                padding: 10px;
                background-color: #f8f9fa;
                border-radius: 8px;
              }
              .status-delivered {
                color: #2e7d32;
                background-color: #d4f5dd;
                padding: 4px 8px;
                border-radius: 4px;
                display: inline-block;
              }
              .status-not-delivered {
                color: #c62828;
                background-color: #ffd6d6;
                padding: 4px 8px;
                border-radius: 4px;
                display: inline-block;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Delivery Statement</h1>
            </div>
            
            <div class="customer-info">
              <h2>${customerName}</h2>
              <p>Phone: ${customerPhone}</p>
              <p>Address: ${customerAddress}</p>
              <p>Rate: ₹${customerRate}/L</p>
            </div>

            <div class="statement-period">
              <p>Period: ${fromDate} - ${toDate}</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${filteredHistory.map(item => `
                  <tr>
                    <td>${item.delivery_date}</td>
                    <td>${item.quantity} L @ ₹${item.milk_rate}/L</td>
                    <td>
                      <span class="${item.delivery_status.toUpperCase().includes('DELIVERED') ? 'status-delivered' : 'status-not-delivered'}">
                        ${item.delivery_status}
                      </span>
                    </td>
                    <td>₹${item.due_amount}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="total-amount">
              Total Amount: ₹${calculateTotalAmount()}
            </div>
          </body>
        </html>
      `;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        width: 612, // US Letter width in points
        height: 792, // US Letter height in points
      });

      // Share the PDF
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Delivery Statement',
        UTI: 'com.adobe.pdf'
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderCustomerDetails = () => (
    <Card style={styles.customerDetailsCard}>
      <Card.Content>
        <View style={styles.customerInfo}>
          <View style={styles.customerHeader}>
            <MaterialCommunityIcons name="account" size={24} color="#1976D2" />
            <Text style={styles.customerName}>{customerName}</Text>
          </View>
          <View style={styles.customerDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="phone" size={20} color="#666" />
              <Text style={styles.detailText}>{customerPhone}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
              <Text style={styles.detailText} numberOfLines={2}>{customerAddress}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="currency-inr" size={20} color="#666" />
              <Text style={styles.detailText}>Rate: ₹{customerRate}/L</Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderStatementHeader = () => (
    <Card style={styles.statementHeader}>
      <Card.Content>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Delivery Statement</Text>
            <Text style={styles.headerSubtitle}>Period: {formatDateForDisplay(fromDate)} - {formatDateForDisplay(toDate)}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.totalAmount}>Total Amount</Text>
            <Text style={styles.amountValue}>₹{calculateTotalAmount()}</Text>
            <Button
              mode="contained"
              onPress={generatePDF}
              loading={isGeneratingPDF}
              disabled={isGeneratingPDF || filteredHistory.length === 0}
              style={styles.downloadButton}
              labelStyle={styles.downloadButtonLabel}
              icon="download"
              compact
            >
              Download
            </Button>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderTransactionRow = (item: MilkmanHistory, index: number) => (
    <View key={item.order_id} style={styles.tableRow}>
      <Text style={styles.tableCellDate} numberOfLines={1} ellipsizeMode='tail'>
        {item.delivery_date}
      </Text>
      <View style={styles.tableCellDetails}>
        <Text style={styles.detailsText} numberOfLines={2} ellipsizeMode='tail'>
          {item.quantity} L @ ₹{item.milk_rate}/L
        </Text>
        <Text
          style={[
            styles.statusChip,
            item.delivery_status.toUpperCase().includes('DELIVERED')
              ? styles.statusDelivered
              : styles.statusNotDelivered
          ]}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {item.delivery_status}
        </Text>
      </View>
      <Text style={styles.tableCellAmount} numberOfLines={1} ellipsizeMode='tail'>
        ₹{item.due_amount}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={['#FFFFFF', '#E3F2FD', '#BBDEFB']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.container}>
          <Appbar.Header style={styles.appbar}>
            <Appbar.BackAction onPress={() => router.back()} />
            <Appbar.Content title="Delivery Statement" titleStyle={styles.appbarTitle} />
          </Appbar.Header>

          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            onScroll={handleScroll}
            scrollEventThrottle={400}
          >
            {renderCustomerDetails()}

            <View style={styles.formContainer}>
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerRow}>
                  <View style={styles.datePickerColumn}>
                    <Text style={styles.label}>From Date</Text>
                    <Button
                      mode="outlined"
                      onPress={() => setShowFromDatePicker(true)}
                      style={styles.dateButton}
                      icon="calendar"
                      textColor="#000000"
                      labelStyle={styles.dateButtonLabel}
                    >
                      {fromDate ? formatDateForDisplay(fromDate) : 'Select Date'}
                    </Button>
                  </View>
                  <View style={styles.datePickerColumn}>
                    <Text style={styles.label}>To Date</Text>
                    <Button
                      mode="outlined"
                      onPress={() => setShowToDatePicker(true)}
                      style={styles.dateButton}
                      icon="calendar"
                      textColor="#000000"
                      labelStyle={styles.dateButtonLabel}
                    >
                      {toDate ? formatDateForDisplay(toDate) : 'Select Date'}
                    </Button>
                  </View>
                </View>
              </View>

              <Button
                mode="contained"
                onPress={getHistory}
                style={styles.historyButton}
                labelStyle={styles.historyButtonLabel}
                icon="history"
              >
                Get Statement
              </Button>
            </View>

            {historyData.length > 0 && (
              <View style={styles.statementSection}>
                {renderStatementHeader()}
                
                <View style={styles.filterContainer}>
                  <View style={styles.filterSortRow}>
                    <Menu
                      visible={showStatusMenu}
                      onDismiss={() => setShowStatusMenu(false)}
                      anchor={
                        <Button
                          mode="outlined"
                          onPress={() => setShowStatusMenu(true)}
                          style={styles.filterButton}
                          icon="filter"
                          textColor="#000000"
                          labelStyle={styles.buttonLabel}
                        >
                          {statusFilter || 'Filter by Status'}
                        </Button>
                      }
                    >
                      <Menu.Item
                        onPress={() => {
                          setStatusFilter(null);
                          setShowStatusMenu(false);
                        }}
                        title="All"
                      />
                      <Menu.Item
                        onPress={() => {
                          setStatusFilter('DELIVERED');
                          setShowStatusMenu(false);
                        }}
                        title="Delivered"
                      />
                      <Menu.Item
                        onPress={() => {
                          setStatusFilter('NOT DELIVERED');
                          setShowStatusMenu(false);
                        }}
                        title="Not Delivered"
                      />
                    </Menu>

                    <Button
                      mode="outlined"
                      onPress={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                      style={styles.sortButton}
                      icon={sortOrder === 'asc' ? 'sort-calendar-ascending' : 'sort-calendar-descending'}
                      textColor="#000000"
                      labelStyle={styles.buttonLabel}
                    >
                      {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                    </Button>
                  </View>
                </View>

                <Card style={styles.transactionsCard}>
                  <Card.Content>
                    <View style={styles.transactionHeader}>
                      <Text style={styles.headerText}>Date</Text>
                      <Text style={styles.headerText}>Details</Text>
                      <Text style={styles.headerText}>Amount</Text>
                    </View>
                    <Divider style={styles.divider} />
                    {displayedItems.map(renderTransactionRow)}
                    {displayedItems.length > 0 && (
                      <View style={styles.paginationContainer}>
                        <Button
                          mode="outlined"
                          onPress={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          style={styles.paginationButton}
                          icon="chevron-left"
                          textColor="#000000"
                          labelStyle={styles.paginationButtonLabel}
                        >
                          Previous
                        </Button>
                        
                        <View style={styles.pageNumbersContainer}>
                          {getPageNumbers().map((page, index) => (
                            page === '...' ? (
                              <Text key={`ellipsis-${index}`} style={styles.ellipsis}>...</Text>
                            ) : (
                              <Button
                                key={page}
                                mode={currentPage === page ? "contained" : "outlined"}
                                onPress={() => handlePageChange(page as number)}
                                style={[
                                  styles.pageNumberButton,
                                  currentPage === page && styles.activePageNumberButton
                                ]}
                                textColor={currentPage === page ? "#FFFFFF" : "#000000"}
                                labelStyle={[
                                  styles.pageNumberLabel,
                                  currentPage === page && styles.activePageLabel
                                ]}
                              >
                                {page}
                              </Button>
                            )
                          ))}
                        </View>
                        
                        <Button
                          mode="outlined"
                          onPress={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          style={styles.paginationButton}
                          icon="chevron-right"
                          textColor="#000000"
                          labelStyle={styles.paginationButtonLabel}
                        >
                          Next
                        </Button>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              </View>
            )}

            {/* Date Pickers Modal */}
            <Modal
              visible={showFromDatePicker}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowFromDatePicker(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowFromDatePicker(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.calendarContainer}>
                      <View style={styles.calendarHeader}>
                        <Button
                          mode="text"
                          onPress={() => setShowFromDatePicker(false)}
                          icon="close"
                          textColor="#666"
                        >
                          Close
                        </Button>
                      </View>
                      <DateTimePicker
                        value={fromDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={handleFromDateChange}
                        maximumDate={new Date()}
                        minimumDate={new Date(2020, 0, 1)}
                        textColor="#000000"
                        accentColor="#1976D2"
                        style={styles.calendar}
                        themeVariant="light"
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <Modal
              visible={showToDatePicker}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowToDatePicker(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowToDatePicker(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.calendarContainer}>
                      <View style={styles.calendarHeader}>
                        <Button
                          mode="text"
                          onPress={() => setShowToDatePicker(false)}
                          icon="close"
                          textColor="#666"
                        >
                          Close
                        </Button>
                      </View>
                      <DateTimePicker
                        value={toDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={handleToDateChange}
                        maximumDate={new Date()}
                        minimumDate={new Date(2020, 0, 1)}
                        textColor="#000000"
                        accentColor="#1976D2"
                        style={styles.calendar}
                        themeVariant="light"
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </ScrollView>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  customerDetailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 16,
    elevation: 2,
  },
  customerInfo: {
    gap: 12,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  customerDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  datePickerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  datePickerColumn: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateButton: {
    borderColor: '#1976D2',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
  },
  dateButtonLabel: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  historyButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 2,
  },
  historyButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
  statementSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  statementHeader: {
    backgroundColor: 'white',
    marginBottom: 16,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterSortRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    borderColor: '#1976D2',
    minWidth: 150,
  },
  sortButton: {
    borderColor: '#1976D2',
    minWidth: 150,
  },
  transactionsCard: {
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 16,
    marginBottom: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fafbfc',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  divider: {
    marginVertical: 8,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  tableCellDate: {
    flex: 1.4,
    fontSize: baseFont,
    color: '#222',
    textAlign: 'center',
    paddingHorizontal: 4,
    minWidth: 100,
  },
  tableCellDetails: {
    flex: 2.2,
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 120,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  detailsText: {
    fontSize: baseFont,
    color: '#444',
    marginBottom: 2,
    textAlign: 'center',
  },
  statusChip: {
    fontSize: baseFont - 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 2,
    minWidth: 60,
    textAlign: 'center',
    overflow: 'hidden',
  },
  statusDelivered: {
    backgroundColor: '#d4f5dd',
    color: '#2e7d32',
  },
  statusNotDelivered: {
    backgroundColor: '#ffd6d6',
    color: '#c62828',
  },
  tableCellAmount: {
    flex: 1,
    fontSize: baseFont + 1,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 4,
    minWidth: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: Platform.OS === 'ios' ? '90%' : '95%',
    maxWidth: 400,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  calendar: {
    width: '100%',
    height: Platform.OS === 'ios' ? 350 : 300,
    backgroundColor: 'white',
    color: '#000000',
    alignSelf: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  paginationButton: {
    borderColor: '#1976D2',
    minWidth: 100,
  },
  paginationButtonLabel: {
    color: '#000000',
    fontSize: 14,
  },
  pageNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageNumberButton: {
    minWidth: 40,
    height: 40,
    marginHorizontal: 2,
    borderColor: '#1976D2',
    backgroundColor: '#FFFFFF',
  },
  activePageNumberButton: {
    backgroundColor: '#1976D2',
  },
  pageNumberLabel: {
    fontSize: 14,
    color: '#000000',
  },
  activePageLabel: {
    color: '#FFFFFF',
  },
  ellipsis: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 4,
  },
  downloadButton: {
    marginTop: 8,
    backgroundColor: '#1976D2',
    height: 36,
    borderRadius: 18,
    minWidth: 100,
    maxWidth: 150,
    alignSelf: 'flex-end',
  },
  downloadButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingHorizontal: 8,
  },
  buttonLabel: {
    color: '#000000',
    fontSize: 14,
  },
}); 