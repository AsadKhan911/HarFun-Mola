import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Use axios for API calls
import useGetFetchBookingDetails from '../../../../customHooks/useGetFetchBookingDetails.jsx';
import { BookingBaseUrl } from '../../../URL/userBaseUrl.js';
import Colors from '../../../../constants/Colors.ts';

const InProgressDetailBookingPage = ({ route }) => {
  const { bookingId } = route.params;
  const bookingDetails = useSelector((state) => state.bookings.singleBooking);
  const serviceUser = useSelector((state) => state.bookings.singleBooking?.user);

  const [elapsedTime, setElapsedTime] = useState(0); // Timer in seconds
  const [startTime, setStartTime] = useState(null);
  const [completedTime, setCompletedTime] = useState(null);

  useGetFetchBookingDetails(bookingId);

  useEffect(() => {
    fetchBookingStartTime();
  }, []);

  const fetchBookingStartTime = async () => {
    try {
      const response = await axios.get(`${BookingBaseUrl}/getBooking/${bookingId}`);
      const { startTime, completedTime } = response.data.booking;

      if (completedTime) {
        setCompletedTime(completedTime);
        return;
      }

      if (startTime) {
        setStartTime(new Date(startTime));
        updateElapsedTime();
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  const updateElapsedTime = () => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor((now - new Date(startTime)) / 1000);
      setElapsedTime(diffInSeconds);
    }, 1000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (startTime && !completedTime) {
      updateElapsedTime();
    }
  }, [startTime]);

  // Helper function to format the timer as HH:MM:SS
  const formatTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} hours ${minutes} min ${secs} sec`
;
  };
  

  const handleCompleteService = () => {
    Alert.alert(
      'Complete Service',
      'Are you sure you want to mark this service as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: completeService },
      ]
    );
  };

  const completeService = async () => {
    try {
      const now = new Date().toISOString();
      await axios.patch(`${BookingBaseUrl}/updateBooking/${bookingId}`, { completedTime: now });

      setCompletedTime(now);
      Alert.alert('Service Completed', 'The service has been marked as completed.');
    } catch (error) {
      console.error('Error completing service:', error);
    }
  };

  if (!bookingDetails || !serviceUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.noBookingText}>No booking details found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Timer Section */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Service Started Since</Text>
        <Text style={styles.timer}>{formatTimer(elapsedTime)}</Text>
      </View>

      {/* Order Details Section */}
      <View style={styles.orderDetailsContainer}>
        <Text style={styles.orderDetailsTitle}>Order Details</Text>

        {/* Booking ID */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Booking ID:</Text>
          <Text style={styles.detailValue}>{bookingDetails?.orderNumber}</Text>
        </View>

        {/* Service User */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Service User:</Text>
          <Text style={styles.detailValue}>{bookingDetails?.user?.fullName || 'N/A'}</Text>
        </View>

        {/* Service Type */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Service:</Text>
          <Text style={styles.detailValue}>{bookingDetails?.service?.serviceName || 'N/A'}</Text>
        </View>

        {/* Service Start Time */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Start Time:</Text>
          <Text style={styles.detailValue}>{new Date(startTime).toLocaleString()}</Text>
        </View>
      </View>

      {/* Complete Service Button */}
      <TouchableOpacity style={styles.completeButton} onPress={handleCompleteService}>
        <Text style={styles.completeButtonText}>Complete Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 20,
  },
  timerContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  timerLabel: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: Colors.DARK_GRAY,
    marginBottom: 10,
  },
  timer: {
    fontSize: 25,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    letterSpacing: 1,
    textAlign: 'center',
  },
  orderDetailsContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  orderDetailsTitle: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    color: Colors.DARK_GRAY,
    marginBottom: 10,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: Colors.DARK_GRAY,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: Colors.BLACK,
    flex: 2,
  },
  completeButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  completeButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: 'outfit-bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBookingText: {
    fontSize: 18,
    color: Colors.GRAY,
    fontFamily: 'outfit-medium',
  },
});

export default InProgressDetailBookingPage;
