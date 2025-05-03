import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CustomPaginationProps {
  page: number;
  numberOfPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination = ({ 
  page, 
  numberOfPages, 
  onPageChange,
}: CustomPaginationProps) => {
  return (
    <View style={styles.paginationContainer}>
      <View style={styles.customPagination}>
        <View style={styles.paginationControls}>
          <TouchableOpacity 
            onPress={() => onPageChange(page - 1)}
            disabled={page === 0}
            style={[styles.paginationButton, page === 0 && styles.paginationButtonDisabled]}
          >
            <Text style={[styles.paginationButtonText, page === 0 && styles.paginationButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>
          <Text style={styles.paginationText}>
            Page {page + 1} of {numberOfPages}
          </Text>
          <TouchableOpacity 
            onPress={() => onPageChange(page + 1)}
            disabled={page === numberOfPages - 1}
            style={[styles.paginationButton, page === numberOfPages - 1 && styles.paginationButtonDisabled]}
          >
            <Text style={[styles.paginationButtonText, page === numberOfPages - 1 && styles.paginationButtonTextDisabled]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    marginHorizontal: 16,
    marginTop: -8,
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  customPagination: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    width: '100%',
  },
  paginationText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#1976D2',
    minWidth: 100,
  },
  paginationButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  paginationButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  paginationButtonTextDisabled: {
    color: '#9E9E9E',
  },
});

export default CustomPagination; 