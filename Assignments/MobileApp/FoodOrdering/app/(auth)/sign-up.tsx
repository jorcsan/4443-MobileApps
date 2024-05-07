import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import { Link } from 'expo-router';

const SignUpScreen = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);
  const [userId, setUserId] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://143.198.158.17:8084/register', {
        first_name,
        last_name,
        username,
        email,
        password,
        userId,
      });

      if (response.data.success) {
        const { user_id } = response.data;
        setUserId(user_id);
        setIsSignUpSuccessful(true); // Set signup success before showing alert
        Alert.alert('Success', 'Account created successfully');
      } else {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {isSignUpSuccessful ? (
        <View>
          <Text style={styles.label}>Account created successfully!</Text>
          <Link href="/(tabs)" asChild style={styles.textButton}>
            <Button text="Go to Tabs" />
          </Link>
        </View>
      ) : (
        <View>
          <Text style={styles.label}>Registration</Text>
          <TextInput
            placeholder="First Name"
            value={first_name}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <TextInput
            placeholder="Last Name"
            value={last_name}
            onChangeText={setLastName}
            style={styles.input}
          />
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            style={styles.input}
            secureTextEntry
          />
          <Button text="Create Account" onPress={handleSignUp} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default SignUpScreen;
