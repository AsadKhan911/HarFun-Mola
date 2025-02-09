import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from 'expo-router';
import Colors from '../../../../constants/Colors.ts';
import axios from 'axios';
import { BookingBaseUrl } from '../../../URL/userBaseUrl.js';

const Header = () => {
  const { fullName, profile } = useSelector(state => state.auth.user);
  const [completedBookingsCount, setCompletedBookingsCount] = useState(0); // State to store the completed bookings count
  const navigation = useNavigation();
  const {token} = useSelector((store) => store.auth.user)

  useEffect(() => {
    // Fetch all bookings from the backend
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${BookingBaseUrl}/get`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token here
          },
        });
        console.log("Bookings Response:", response.data); // Log the response
        if (response.data.success) {
          const completedBookings = response.data.bookings.filter(
            booking => booking.status === 'Completed'
          );
          setCompletedBookingsCount(completedBookings.length);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error.response?.data || error.message);
      }
    };

    fetchBookings();
  }, []);

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: profile?.profilePic }} style={styles.userImage} />
        <View>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.userName}>{fullName}</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <TouchableOpacity onPress={() => { navigation.push('completed-booking'); }}>
            <Text style={styles.statValue}>{completedBookingsCount}</Text> {/* Display the actual completed bookings count */}
            <Text style={styles.statLabel}>Completed Bookings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statBox}>
          <TouchableOpacity>
            <Text style={styles.statValue}>$5,250</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.PRIMARY,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 99,
  },
  welcomeText: {
    color: Colors.WHITE,
    fontFamily: 'outfit',
  },
  userName: {
    color: Colors.WHITE,
    fontSize: 20,
    fontFamily: 'outfit-Medium',
  },
  statsContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'outfit-Bold',
    color: Colors.PRIMARY,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: Colors.GRAY,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default Header;