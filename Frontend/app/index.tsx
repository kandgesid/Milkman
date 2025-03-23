import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from "@react-native-material/core";
import { router } from 'expo-router';

export default function LandingPage() {
  const handleRoleSelect = (role: 'milkman' | 'customer') => {
    router.push(`/auth/login?role=${role}`);
  };

  return (
    <View style={styles.container}>
      <Surface
        elevation={2}
        category="medium"
        style={styles.header}
      >
        <Text variant="h4" style={styles.headerText}>
          Welcome to MilkMate
        </Text>
      </Surface>

      <View style={styles.buttonContainer}>
        <Button
          title="🧑‍🌾 I am a Milkman"
          variant="contained"
          color="#2196F3"
          tintColor="#fff"
          onPress={() => handleRoleSelect('milkman')}
          // style={styles.button}
          uppercase={false}
        />

        <Button
          title="🧑 I am a Customer"
          variant="contained"
          color="#2196F3"
          tintColor="#fff"
          onPress={() => handleRoleSelect('customer')}
          // style={styles.button}
          uppercase={false}
        />
      </View>

      <View style={styles.footer}>

        <Surface
          elevation={1}
          category="medium"
          style={styles.registerSection}
        >
          <Text variant="subtitle1" style={styles.footerText}>
            New to MilkMate?
          </Text>
          <Button
            title="Register Now"
            variant="contained"
            color="#4CAF50"
            tintColor="#fff"
            onPress={() => router.push('/auth/register')}
            style={styles.registerButton}
            uppercase={false}
          />
        </Surface>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  headerText: {
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    height: 50,
  },
  footer: {
    marginBottom: 40,
    gap: 20,
  },
  loginSection: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerSection: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  footerText: {
    color: '#666',
    marginBottom: 10,
  },
  registerButton: {
    height: 45,
  },
});
