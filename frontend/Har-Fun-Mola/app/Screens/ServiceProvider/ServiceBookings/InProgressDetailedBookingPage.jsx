import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native'; // Import navigation
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icon library
import useGetFetchBookingDetails from '../../../../customHooks/useGetFetchBookingDetails.jsx';
import { BookingBaseUrl, PaymentBaseUrl } from '../../../URL/userBaseUrl.js';
import Colors from '../../../../constants/Colors.ts';
import { Heading } from '../../../../components/Heading.jsx';
import { stopLocationUpdates } from '../../../../utils/getLocation.js';
import RatingModal from '../../../Modals/RatingModal.jsx';

const InProgressDetailBookingPage = ({ route }) => {
  const { bookingId } = route.params;
  const navigation = useNavigation(); // Initialize navigation

  const bookingDetails = useSelector((state) => state.bookings.singleBooking);
  const serviceUser = useSelector((state) => state.bookings.singleBooking?.user);
  const userUid = useSelector((state) => state.bookings.singleBooking?.user?.firebaseUID);
  const providerUid = useSelector((state) => state.bookings.singleBooking?.service?.created_by?.firebaseUID);
  const serviceProviderStripeId = useSelector((state) => state.bookings.singleBooking?.service?.created_by?.stripeAccountId);
  const amount = useSelector((state) => state.bookings.singleBooking?.service?.price);


  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [completedTime, setCompletedTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  let intervalRef = null; // Store interval reference

  useGetFetchBookingDetails(bookingId);

  useEffect(() => {
    fetchBookingStartTime();
    return () => clearInterval(intervalRef); // Cleanup interval on unmount
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
        setElapsedTime(0);
        startElapsedTime();
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  const startElapsedTime = () => {
    if (!startTime) return;

    intervalRef = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor((now - new Date(startTime)) / 1000);
      setElapsedTime(diffInSeconds);
    }, 1000);
  };

  useEffect(() => {
    if (startTime && !completedTime) {
      startElapsedTime();
    }
  }, [startTime]);

  const formatTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} hours ${minutes} min ${secs} sec`;
  };

  const handleCompleteService = () => {
    Alert.alert(
      "Confirm Completion",
      "Do you want to complete the service?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: completeService },
      ]
    );
  };

  const completeService = async () => {
    try {
      setIsCompleted(true);

      const now = new Date(); // Current time
      const elapsedSeconds = Math.floor((now - new Date(startTime)) / 1000); // Total time in seconds

      // Convert elapsed time into HH:mm:ss format
      const hours = Math.floor(elapsedSeconds / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((elapsedSeconds % 3600) / 60).toString().padStart(2, '0');
      const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
      const elapsedTime = `${hours}:${minutes}:${seconds}`; // Formatted duration

      const completedTime = now.toISOString(); // Store full completion time

      // Immediately update state for UI responsiveness
      setCompletedTime(completedTime);
      clearInterval(intervalRef); // Stop timer

      // Call stopLocationUpdates to stop location tracking when the service is completed
      // stopLocationUpdates();

      // Send both elapsedTime and completedTime to the backend

      // Get the paymentIntentId from booking details
      const paymentIntentId = bookingDetails?.paymentIntentId;
      if (!paymentIntentId) {
        Alert.alert("Error", "No payment intent found for this booking.");
        setIsCompleted(false);
        return;
      }

      //Capture Payment
      // Capture Payment
      const paymentResponse = await axios.post(`${PaymentBaseUrl}/capture-payment`, {
        paymentIntentId,
      });

      if (paymentResponse.status !== 200) {
        Alert.alert("Failed to capture payment.");
        return; // Stop here if capturing payment fails
      }

      // Ensure captured before transferring
      if (paymentResponse.data.success) {
        const transferPayment = await axios.post(`${PaymentBaseUrl}/transfer-payment`, {
          serviceProviderStripeId,
          amount,
        });

        if (transferPayment.status !== 200) {
          Alert.alert("Failed to transfer payment.");
        }
      }



      const response = await axios.patch(`${BookingBaseUrl}/updateBooking/${bookingId}`, {
        status: "Completed",
        elapsedTime, // Send formatted duration
        completedTime, // Send exact timestamp
        paymentStatus: "Completed"
      });

      if (response.status === 200) {
        Alert.alert(
          "Service Completed",
          `The service has been marked as completed after ${elapsedTime}.`,
          [
            {
              text: "OK",
              onPress: () => setShowRatingModal(true), // Switch to home tab
            }
          ]
        );
      }
    } catch (error) {
      console.error("Error completing service:", error);
      Alert.alert("Error", "Failed to complete the service. Please try again.");

      // Rollback completed time if API fails
      setCompletedTime(null);
      startElapsedTime(); // Restart timer if API fails
    } finally {
      setIsCompleted(false);
    }
  };

  const handleViewLocation = () => {
    // Navigate to the map screen with the user's location
    navigation.navigate('user-pin-location', {
      userUid: userUid, providerUid: providerUid // Pass the user's address or coordinates
    });
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
      <View style={styles.timerContainer}>
        <Text>Booking Starts At:</Text>
        <Text style={styles.fieldName}>
          <Text style={[styles.fieldValue, { fontSize: 13 }]}>
            {new Date(startTime).toLocaleString()}
          </Text>
        </Text>
        <Text style={styles.timerLabel}>Service Started Since</Text>
        {loading ? <ActivityIndicator size="large" color={Colors.PRIMARY} /> : <Text style={styles.timer}>{formatTimer(elapsedTime)}</Text>}
      </View>

      <View style={styles.orderDetailsContainer}>
        <Heading text="Booking Information" />
        <View style={styles.card}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: serviceUser.profile.profilePic || "PROFILE PIC" }}
              style={styles.profilePic}
            />
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ fontFamily: 'outfit-Medium', fontSize: 18, marginLeft: -5 }}>{serviceUser.fullName}</Text>
              <Text style={{ fontFamily: 'outfit-Medium', fontSize: 13, marginLeft: -5 }}>{serviceUser.phoneNumber}</Text>
            </View>
          </View>
          <Text style={styles.fieldName}>Service: <Text style={styles.fieldValue}>{bookingDetails.service?.serviceName}</Text></Text>
          <Text style={styles.fieldName}>Order No: <Text style={styles.fieldValue}>{bookingDetails.orderNumber}</Text></Text>
          <Text style={styles.fieldName}>Date: <Text style={styles.fieldValue}>{new Date(bookingDetails.date).toDateString()}, {bookingDetails.timeSlot}</Text></Text>
          <Text style={styles.fieldName}>Address: <Text style={styles.fieldValue}>{bookingDetails.address}</Text></Text>
          <Text style={styles.fieldName}>Instructions: <Text style={styles.fieldValue}>{bookingDetails?.instructions || "No instructions given by user"}</Text></Text>

          {/* Add a button to view user's location on map */}
          <TouchableOpacity style={styles.locationButton} onPress={handleViewLocation}>
            <Icon name="location-on" size={24} color={Colors.PRIMARY} />
            <Text style={styles.locationButtonText}>View Client's Location</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.completeButton} onPress={handleCompleteService}>
        <Text style={styles.completeButtonText}>{isCompleted ? <ActivityIndicator /> : "Complete Service"}</Text>
      </TouchableOpacity>

      {/* Rating Modal */}
      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={() => navigation.getParent()?.jumpTo('home')}
        userToReviewId={serviceUser._id}
        bookingId={bookingId}
      />
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
    backgroundColor: Colors.PRIMARY_LIGHT,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  card: {
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes the image circular
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  fieldName: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.DARK_GRAY,
    fontFamily: 'outfit-bold',
  },
  fieldValue: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    fontFamily: 'outfit-medium',
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
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  locationButtonText: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: Colors.PRIMARY,
    marginLeft: 10,
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

