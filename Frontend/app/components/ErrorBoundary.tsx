import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Card>
            <Card.Content>
              <Title>Something went wrong</Title>
              <Paragraph style={styles.errorText}>
                {this.state.error?.message || 'An unexpected error occurred'}
              </Paragraph>
              <Button
                mode="contained"
                onPress={() => this.setState({ hasError: false, error: null })}
                style={styles.button}
              >
                Try again
              </Button>
            </Card.Content>
          </Card>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    marginVertical: 16,
    color: '#f44336',
  },
  button: {
    marginTop: 16,
  },
});

export default ErrorBoundary; 