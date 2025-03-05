import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Easing } from 'react-native';
import {Image} from 'expo-image'
import { useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Colors from '../../../../constants/Colors.ts';
import { BookingBaseUrl } from '../../../URL/userBaseUrl.js';
import axios from 'axios';

const Header = () => {
  const { fullName, profile, token, role } = useSelector(state => state.auth.user);
  const [completedBookingsCount, setCompletedBookingsCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);  // State for total earnings
  const [isModalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current; // Sidebar starts off-screen
  const navigation = useNavigation();

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${BookingBaseUrl}/getserviceprovider`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.success) {
        const completedBookings = response.data.bookings.filter(
          booking => booking.status === 'Completed'
        );
        setCompletedBookingsCount(completedBookings.length);


        // Calculate total earnings from completed bookings
        const earnings = completedBookings.reduce((total, booking) => {
          return total + parseFloat(booking.selectedPricingOption.price); // Accumulate the price of each booking
        }, 0);

        // Format earnings with commas (for thousands, lakhs, etc.)
        const formattedEarnings = new Intl.NumberFormat('en-IN').format(earnings);

        setTotalEarnings(formattedEarnings); // Set formatted total earnings
      }
    } catch (error) {
      console.error('Error fetching bookings:', error.response?.data || error.message);
    }
  };

  // Use useFocusEffect to re-fetch bookings every time the user navigates back
  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const toggleModal = () => {
    if (!isModalVisible) {
      setModalVisible(true); // Show modal first, then animate
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => setModalVisible(false)); // Hide modal after animation completes
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0, // Slide in from the left
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300, // Slide out smoothly to the left
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => setModalVisible(false)); // Hide modal after animation completes
    }
  }, [isModalVisible]);

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <TouchableOpacity style={styles.profileContainer} onPress={toggleModal}>
        <Image source={{ uri: profile?.profilePic }} style={styles.userImage} />
        <View>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.userName}>{fullName}</Text>
        </View>
      </TouchableOpacity>

      {/* Sidebar Menu (Modal) */}
      {isModalVisible && (
        <Modal transparent animationType="none">
          <TouchableOpacity style={styles.overlay} onPress={toggleModal} activeOpacity={1}>
            <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
              {/* User Info */}
              <View style={styles.profileSection}>
                <Image source={{ uri: profile?.profilePic }} style={styles.modalUserImage} />
                <Text style={styles.modalUserName}>{fullName}</Text>
                <Text style={styles.modalUserRole}>{role}</Text>
              </View>

              {/* Menu Options */}
              <TouchableOpacity style={styles.menuItem}>
                <FontAwesome6 name="user" size={20} color={Colors.PRIMARY} />
                <Text style={styles.menuText}>Profile</Text>
                <FontAwesome6 name="angle-right" size={18} color={Colors.WHITE} style={styles.menuArrow} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <FontAwesome6 name="chart-line" size={20} color={Colors.PRIMARY} />
                <Text style={styles.menuText}>My Stats</Text>
                <FontAwesome6 name="angle-right" size={18} color={Colors.WHITE} style={styles.menuArrow} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <FontAwesome6 name="file-invoice" size={20} color={Colors.PRIMARY} />
                <Text style={styles.menuText}>Reports</Text>
                <FontAwesome6 name="angle-right" size={18} color={Colors.WHITE} style={styles.menuArrow} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <FontAwesome6 name="gavel" size={20} color={Colors.PRIMARY} />
                <Text style={styles.menuText}>My Requests</Text>
                <FontAwesome6 name="angle-right" size={18} color={Colors.WHITE} style={styles.menuArrow} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <FontAwesome6 name="cogs" size={20} color={Colors.PRIMARY} />
                <Text style={styles.menuText}>Settings</Text>
                <FontAwesome6 name="angle-right" size={18} color={Colors.WHITE} style={styles.menuArrow} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <FontAwesome6 name="question-circle" size={20} color={Colors.PRIMARY} />
                <Text style={styles.menuText}>Help & Support</Text>
                <FontAwesome6 name="angle-right" size={18} color={Colors.WHITE} style={styles.menuArrow} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <FontAwesome6 name="moon" size={20} color={Colors.PRIMARY} />
                <Text style={styles.menuText}>Theme: Auto</Text>
                <FontAwesome6 name="angle-right" size={18} color={Colors.WHITE} style={styles.menuArrow} />
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity style={styles.logoutButton}>
                <FontAwesome6 name="sign-out-alt" size={20} color={Colors.GREEN} />
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <TouchableOpacity onPress={() => { navigation.push('completed-booking'); }}>
            <Text style={styles.statValue}>{completedBookingsCount}</Text>
            <Text style={styles.statLabel}>Completed Bookings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statBox}>
          <TouchableOpacity>
            <Text style={styles.statValue}>Rs {totalEarnings}</Text>  {/* Display total earnings */}
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
    paddingTop:50
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: '75%',
    height: '100%',
    backgroundColor: Colors.BLACK,
    padding: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    position: 'absolute',
    left: 0,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  modalUserImage: {
    width: 70,
    height: 90,
    borderRadius: 99,
    marginTop: 20,
  },
  modalUserName: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: 'outfit',
    marginTop: 10,
  },
  modalUserRole: {
    color: Colors.WHITE,
    fontSize: 14,
    fontFamily: 'outfit',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  menuText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: 'outfit',
    marginLeft: 15,
  },
  menuArrow: {
    marginLeft: 'auto',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  logoutText: {
    color: Colors.GREEN,
    fontSize: 18,
    fontFamily: 'outfit',
    marginLeft: 10,
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
    padding: 25,
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