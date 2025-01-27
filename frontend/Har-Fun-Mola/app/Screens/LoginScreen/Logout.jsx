import React from 'react';
import { View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Clear the token from AsyncStorage
      await AsyncStorage.removeItem('jwt_token');
  
      // Remove the Authorization header from axios interceptor
      delete axios.defaults.headers['Authorization'];
  
      // Show a success alert
      Alert.alert("Success", "You have been logged out successfully.");
  
      // Redirect the user to the login screen or home screen
      navigation.replace('Login'); // Adjust the screen as needed
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  

  return (
    <View>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default LogoutButton;
