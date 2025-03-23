import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, List, Divider } from 'react-native-paper';
import { UserListProps } from '../types';

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
  return (
    <Card style={styles.container}>
      <Card.Content>
        <Title style={styles.title}>Users List</Title>
        {users.map((user) => (
          <React.Fragment key={user.id}>
            <List.Item
              title={user.name}
              description={() => (
                <View style={styles.description}>
                  <Paragraph>{user.email}</Paragraph>
                  <Paragraph>{user.phoneNumber}</Paragraph>
                  <Paragraph>{user.address}</Paragraph>
                </View>
              )}
              right={() => (
                <View style={styles.actions}>
                  <Button
                    mode="contained"
                    onPress={() => onEdit(user)}
                    style={[styles.button, styles.editButton]}
                  >
                    Edit
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => onDelete(user.id!)}
                    style={[styles.button, styles.deleteButton]}
                  >
                    Delete
                  </Button>
                </View>
              )}
            />
            <Divider />
          </React.Fragment>
        ))}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  title: {
    marginBottom: 16,
  },
  description: {
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
});

export default UserList; 