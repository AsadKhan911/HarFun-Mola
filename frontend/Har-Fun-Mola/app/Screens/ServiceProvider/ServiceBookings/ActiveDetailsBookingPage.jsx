import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Image } from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../../../constants/Colors.ts';
import { Heading } from '../../../../components/Heading.jsx';
import useGetFetchBookingDetails from '../../../../customHooks/useGetFetchBookingDetails.jsx';
import useGetBookingAcceptedToInProgress from '../../../../customHooks/useGetBookingAcceptedToInProgress.jsx'; //custom hook
import { useNavigation } from '@react-navigation/native';

const ActiveDetailsBookingPage = ({ route, handleCloseModal }) => {
  const { bookingId } = route.params;
  const bookingDetails = useSelector((state) => state.bookings.singleBooking);
  const serviceUser = useSelector((state) => state.bookings.singleBooking?.user);

  const [isServiceStarted, setIsServiceStarted] = useState(false);
  const { updateBookingStatus, loading } = useGetBookingAcceptedToInProgress(); // Use the custom hook
  const navigation = useNavigation();

  useGetFetchBookingDetails(bookingId);

  const handleStartService = async () => {
    const { success, message } = await updateBookingStatus(bookingId, 'In-Progress');
    if (success) {
      setIsServiceStarted(true); // Change the button state
      navigation.push('final-page'); // Navigate to the desired page after starting the service
    } else {
      alert(message); // Show an error message if the update fails
    }
  };

  const handleViewProfile = () => {
    console.log('View Profile');
  };

  const handleMessage = () => {
    console.log('Message User');
  };

  if (!bookingDetails || !serviceUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.noBookingText}>No booking details found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={handleCloseModal}>
          <Ionicons name="arrow-back-outline" size={30} color={Colors.BLACK} />
          <Text style={styles.headerText}>Booking Details</Text>
        </TouchableOpacity>

        {/* Booking Details */}
        <Heading text="Booking Information" />
        <View style={styles.card}>
          <Text style={styles.fieldName}>Service: <Text style={styles.fieldValue}>{bookingDetails.service?.serviceName}</Text></Text>
          <Text style={styles.fieldName}>Date: <Text style={styles.fieldValue}>{new Date(bookingDetails.date).toLocaleDateString()}</Text></Text>
          <Text style={styles.fieldName}>Time Slot: <Text style={styles.fieldValue}>{bookingDetails.timeSlot}</Text></Text>
          <Text style={styles.fieldName}>Address: <Text style={styles.fieldValue}>{bookingDetails.address}</Text></Text>
          <Text style={styles.fieldName}>Status: <Text style={styles.fieldValue}>{bookingDetails.status}</Text></Text>
        </View>

        {/* Service User Details */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: serviceUser.profile.profilePic || "PROFILE PIC" }} 
            style={styles.profilePic}
          />
          <Text style={{ fontFamily: 'outfit-Medium', fontSize: 18, marginLeft: -5 }}>Service Client</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.fieldName}>Name: <Text style={styles.fieldValue}>{serviceUser.fullName}</Text></Text>
          <Text style={styles.fieldName}>Email: <Text style={styles.fieldValue}>{serviceUser.email}</Text></Text>
          <Text style={styles.fieldName}>Phone: <Text style={styles.fieldValue}>{serviceUser.phoneNumber}</Text></Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.button, styles.messageButton]} onPress={handleMessage}>
            <Ionicons name="chatbox-outline" size={18} color={Colors.PRIMARY} />
            <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>Message Client</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.profileButton]}
            onPress={handleStartService}
            disabled={loading}
          >
            <Ionicons name="rocket-outline" size={18} color={Colors.WHITE} />
            <Text style={styles.buttonText}>
              {isServiceStarted ? 'View Order Activity' : 'Start Service'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.PRIMARY} />
          <Text style={styles.disclaimerText}>
            The service can be started up to two hours before the scheduled time slot. For example, if the time slot is 9:00 AM, you can start the service at 7:00 AM, but not before that.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  scrollView: {
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 26,
    fontFamily: 'outfit-bold',
    marginLeft: 15,
    color: Colors.BLACK,
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes the image circular
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  actionButtons: {
    marginBottom:15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
    width: '48%',
    justifyContent: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileButton: {
    backgroundColor: Colors.PRIMARY,
  },
  messageButton: {
    backgroundColor: Colors.WHITE,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: 'outfit-bold',
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
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disclaimerText: {
    fontSize: 14,
    color: Colors.DARK_GRAY,
    fontFamily: 'outfit-medium',
    marginLeft: 10,
  },
});

export default ActiveDetailsBookingPage;
