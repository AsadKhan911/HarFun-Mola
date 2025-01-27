import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors.ts';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const fullName = useSelector(state => state.auth.user?.fullName);
  const role = useSelector(state => state.auth.user?.role); // Get the role from the Redux state

  const profileMenu = [
    { id: 1, name: 'View Profile', icon: 'person' },
    { id: 2, name: 'My Booking', icon: 'bookmark-sharp' },
    { id: 3, name: 'Feedback', icon: 'chatbubble' },
  ];

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Clear the token from AsyncStorage
      await AsyncStorage.removeItem('jwt_token');
  
      // Remove the Authorization header from axios interceptor
      delete axios.defaults.headers['Authorization'];
  
      // Show a success alert
      Alert.alert("Logged out", "You have been logged out successfully.");
  
      // Redirect the user to the login screen or home screen
      navigation.replace('Login'); // Adjust the screen as needed
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // Define event handlers for each menu item
  const handleMenuItemPress = (itemName) => {
    switch (itemName) {
      case 'View Profile':
        // Navigate to ProfileDetails screen
        navigation.navigate('view-profile');
        break;

      case 'My Booking':
        // Logic for viewing bookings
        Alert.alert('My Booking', 'You can see your bookings here.');
        break;

      case 'Feedback':
        // Logic for providing feedback
        Alert.alert('Feedback', 'You can provide your feedback here.');
        break;
        
      default:
        break;
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.LIGHT_GRAY }}>
      {/* Header Section with Gradient Background */}
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.headerContainer}>
        <Text style={styles.headerText}>Profile</Text>
      </LinearGradient>

      {/* User Profile Info */}
      <View style={styles.innerContainer}>
        <Image source={require('../../../assets/images/mypic.png')} style={styles.imgStyle} />
        <Text style={styles.userName}>{fullName}</Text>

        {/* Role Badge */}
        <View style={styles.roleBadgeContainer}>
          <Text style={styles.roleBadge}>{role}</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>4</Text>
          <Text style={styles.statsLabel}>Bookings</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>2</Text>
          <Text style={styles.statsLabel}>Messages</Text>
        </View>
      </View>

      {/* Profile Menu List */}
      <View style={{ paddingTop: 20 }}>
        <FlatList
          data={profileMenu}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.flatListContainer}
              onPress={() => handleMenuItemPress(item.name)} // Trigger the specific event handler
            >
              <Ionicons name={item.icon} size={35} color={Colors.PRIMARY} />
              <Text style={styles.flatListText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Logout Button */}
      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={Colors.WHITE} />
          <Text style={{ color: Colors.WHITE, marginLeft: 8 }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PRIMARY,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    fontSize: 33,
    fontFamily: 'outfit-bold',
    color: Colors.WHITE,
    textAlign: 'center',
  },
  innerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imgStyle: {
    width: 90,
    height: 90,
    borderRadius: 99,
  },
  userName: {
    fontSize: 26,
    marginTop: 8,
    fontFamily: 'outfit-Bold',
    color: '#36454F',
  },
  roleBadgeContainer: {
    fontSize: 10,
    fontFamily: 'outfit',
    padding: 3,
    color: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY_LIGHT,
    borderRadius: 5,
    alignSelf: 'center',  // Center the badge horizontally
    paddingHorizontal: 5,
    marginTop: 5, 
  },
  
  roleBadge: {
    fontSize: 14,
    color: Colors.PRIMARY, // Text color inside the badge
    fontFamily: 'outfit-Medium',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statsCard: {
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    padding: 15,
    borderRadius: 10,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  statsValue: {
    fontSize: 22,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
  },
  statsLabel: {
    fontSize: 14,
    color: Colors.GRAY,
  },
  flatListContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center', // Centering horizontally
    alignItems: 'center',      // Centering vertically
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  flatListText: {
    fontFamily: 'outfit',
    fontSize: 20,
    marginLeft: 10, // Adding space between icon and text
  },
  divider: {
    height: 1,
    backgroundColor: Colors.LIGHT_GRAY,
    marginHorizontal: 20,
  },
  logoutButtonContainer: {
    marginTop: 20, // Add some space above the button
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: -10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
