import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Appbar, Text, Surface, useTheme, Portal, Modal, Button, TextInput } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useUserManagement from '../hooks/useUserManagement';
import useMilkmanSettingsManagement from '../hooks/useMilkmanSettingsManagement';

export default function MilkmanSettingsScreen() {
  const { id } = useLocalSearchParams();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const { handleLogout } = useUserManagement();
  const { userDetails, setUserId, handleUserEdit, handleAccountCancellation } = useMilkmanSettingsManagement();
  const theme = useTheme();

  // Set userId when component mounts
  React.useEffect(() => {
    if (id) {
      setUserId(id as string);
    }
  }, [id]);

  const handleEditInformation = () => {
    setName(userDetails?.name || '');
    setEmail(userDetails?.email || '');
    setAddress(userDetails?.address || '');
    setShowEditModal(true);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleSaveChanges = async () => {
    if (!id) return;
    
    const updatedData = {
      name,
      email,
      address,
    };

    try {
      await handleUserEdit(id as string, updatedData);
      setShowEditModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update information. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!id) return;

    try {
      await handleAccountCancellation(id as string);
      handleLogout();
      router.push('/screens/landingPage');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#E3F2FD', '#BBDEFB']}
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Settings" titleStyle={styles.appbarTitle} />
        </Appbar.Header>

        <ScrollView style={styles.scrollView}>
          {/* Current Information Card */}
          <Surface style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons name="account-circle" size={40} color="#1976D2" />
              <Text style={styles.infoTitle}>Current Information</Text>
            </View>
            
            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account" size={24} color="#1976D2" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{userDetails?.name || 'Not set'}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="email" size={24} color="#1976D2" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{userDetails?.email || 'Not set'}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="phone" size={24} color="#1976D2" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Phone Number</Text>
                  <Text style={styles.infoValue}>{userDetails?.phoneNumber || 'Not set'}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="map-marker" size={24} color="#1976D2" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{userDetails?.address || 'Not set'}</Text>
                </View>
              </View>
            </View>
          </Surface>

          {/* Options Card */}
          <Surface style={styles.optionsCard}>
            <TouchableOpacity style={styles.optionCard} onPress={handleEditInformation}>
              <View style={styles.optionContent}>
                <MaterialCommunityIcons name="account-edit" size={32} color="#1976D2" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Edit Information</Text>
                  <Text style={styles.optionDescription}>Update your personal details</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#1976D2" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.optionCard} onPress={handleDeleteAccount}>
              <View style={styles.optionContent}>
                <MaterialCommunityIcons name="delete" size={32} color="#D32F2F" />
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: '#D32F2F' }]}>Delete Account</Text>
                  <Text style={styles.optionDescription}>Permanently delete your account</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#D32F2F" />
            </TouchableOpacity>
          </Surface>
        </ScrollView>

        {/* Edit Information Modal */}
        <Portal>
          <Modal
            visible={showEditModal}
            onDismiss={() => setShowEditModal(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Surface style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Information</Text>
                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.formScrollView}>
                <View style={styles.formContainer}>
                  <TextInput
                    label="Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    mode="outlined"
                    textColor="#000000"
                    theme={{ colors: { primary: '#000000', onSurface: '#000000' } }}
                  />
                  <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    textColor="#000000"
                    theme={{ colors: { primary: '#000000', onSurface: '#000000' } }}
                  />
                  <TextInput
                    label="Phone Number"
                    value={userDetails?.phoneNumber || 'Not set'}
                    disabled
                    style={styles.input}
                    mode="outlined"
                    textColor="#000000"
                    theme={{ 
                      colors: { 
                        primary: '#000000', 
                        onSurface: '#000000',
                        onSurfaceDisabled: '#000000',
                        onSurfaceVariant: '#000000'
                      } 
                    }}
                  />
                  <TextInput
                    label="Address"
                    value={address}
                    onChangeText={setAddress}
                    style={styles.input}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    textColor="#000000"
                    theme={{ colors: { primary: '#000000', onSurface: '#000000' } }}
                  />
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setShowEditModal(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSaveChanges}
                  style={[styles.modalButton, styles.saveButton]}
                >
                  Save Changes
                </Button>
              </View>
            </Surface>
          </Modal>
        </Portal>

        {/* Delete Account Modal */}
        <Portal>
          <Modal
            visible={showDeleteModal}
            onDismiss={() => setShowDeleteModal(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Surface style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Delete Account</Text>
                <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.deleteWarningContainer}>
                <MaterialCommunityIcons name="alert-circle" size={48} color="#D32F2F" />
                <Text style={styles.deleteWarningTitle}>Are you sure?</Text>
                <Text style={styles.deleteWarningText}>
                  This action cannot be undone. All your data will be permanently deleted.
                </Text>
              </View>

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setShowDeleteModal(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleConfirmDelete}
                  style={[styles.modalButton, styles.deleteButton]}
                  buttonColor="#D32F2F"
                >
                  Delete Account
                </Button>
              </View>
            </Surface>
          </Modal>
        </Portal>
      </View>
    </LinearGradient>
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
  infoCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginLeft: 12,
  },
  infoContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  optionsCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 2,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E3F2FD',
    marginHorizontal: 16,
  },
  modalContainer: {
    margin: 20,
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    minWidth: 100,
  },
  saveButton: {
    backgroundColor: '#1976D2',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
  },
  deleteWarningContainer: {
    alignItems: 'center',
    padding: 20,
  },
  deleteWarningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginTop: 16,
    marginBottom: 8,
  },
  deleteWarningText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  formScrollView: {
    maxHeight: 400,
  },
}); 