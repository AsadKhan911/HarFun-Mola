import React, { useId, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Image, Alert, Modal, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../../../constants/Colors.ts';
import { Heading } from '../../../../components/Heading.jsx';
import useGetFetchBookingDetails from '../../../../customHooks/useGetFetchBookingDetails.jsx';
import useGetBookingAcceptedToInProgress from '../../../../customHooks/useGetBookingAcceptedToInProgress.jsx'; //custom hook
import { useNavigation } from '@react-navigation/native';
import { startLocationUpdates } from '../../../../utils/getLocation.js'; // Import tracking functions
import startUserLocationUpdates from '../../../../utils/getUserLocation.js'; // Import tracking functions
import { requestLocationPermission } from '../../../../utils/locationPermission.js';  // Update the path if necessary

const ActiveDetailsBookingPage = ({ route, handleCloseModal }) => {
  const { bookingId } = route.params;
  const bookingDetails = useSelector((store) => store.bookings.singleBooking);
  const serviceUser = useSelector((store) => store.bookings.singleBooking?.user);
  const providerId = useSelector((store) => store.bookings.singleBooking?.service?.created_by?.firebaseUID)
  const userId = useSelector((store)=> store.bookings.singleBooking?.user?.firebaseUID)
  console.log("UserId ", userId)
  console.log("ProviderId ", providerId)

  const [isLoading, setIsLoading] = useState(false); // For loading spinner
  // const [isServiceStarted, setIsServiceStarted] = useState(false); // For loading spinner
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // For loading spinner
  const { updateBookingStatus, loading } = useGetBookingAcceptedToInProgress(); // Use the custom hook
  const navigation = useNavigation();

  useGetFetchBookingDetails(bookingId);

  const handleStartService = async () => {
    setIsLoading(true); // Show loading spinner

    const bookingDate = new Date(bookingDetails.date);
    const [hour, minute] = bookingDetails.timeSlot.split(/:| /);
    const isPM = bookingDetails.timeSlot.includes('PM');
    let bookingHour = parseInt(hour, 10);
    if (isPM && bookingHour !== 12) bookingHour += 12;
    if (!isPM && bookingHour === 12) bookingHour = 0;
    bookingDate.setHours(bookingHour, parseInt(minute, 10), 0, 0);

    const now = new Date();
    const twoHoursBefore = new Date(bookingDate);
    twoHoursBefore.setHours(bookingDate.getHours() - 2);

    if (now < twoHoursBefore) {
      Alert.alert("Too Early", "You can't start the service more than two hours before the scheduled time.");
      setIsLoading(false);
      return;
    }

    const { success, message } = await updateBookingStatus(bookingId, 'In-Progress');

    if (success) {
      Alert.alert("Service Started", "Service has been started. Wish you the best of luck!");

      // **Start Location Tracking**
      console.log(providerId)
      startLocationUpdates(providerId);
      startUserLocationUpdates(userId)

      // useEffect(() => {
      //   const checkPermission = async () => {
      //     const permissionGranted = await requestLocationPermission();
      //     if (permissionGranted) {
      //       // Proceed with location updates
      //       startLocationUpdates(providerId);
      //     }
      //   };
      //   checkPermission();
      // }, []);

      navigation.push('inprogress-detail-booking-page', { bookingId: bookingId });
    } else {
      alert(message);
    }

    setIsLoading(false);
  };


  const handleConfirmation = () => {
    if (bookingDetails.status === 'In-Progress') {
      navigation.push('inprogress-detail-booking-page', { bookingId: bookingId });
    } else {
      setShowConfirmationModal(true)
    }
  };

  const handleConfirmStartService = () => {
    setShowConfirmationModal(false)
    handleStartService();
  };

  const handleMessage = () => {
    console.log("message done")
  }

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
          <Text style={styles.fieldName}>Order No: <Text style={styles.fieldValue}>{bookingDetails.orderNumber}</Text></Text>
          <Text style={styles.fieldName}>Date: <Text style={styles.fieldValue}>{new Date(bookingDetails.date).toDateString()}</Text></Text>
          <Text style={styles.fieldName}>Time Slot: <Text style={styles.fieldValue}>{bookingDetails.timeSlot}</Text></Text>
          <Text style={styles.fieldName}>Address: <Text style={styles.fieldValue}>{bookingDetails.address}</Text></Text>
          <Text style={styles.fieldName}>Status: <Text style={styles.fieldValue}>{bookingDetails.status}</Text></Text>
          <Text style={styles.fieldName}>Instructions: <Text style={styles.fieldValue}>{bookingDetails?.instructions || "No instructions given by user"}</Text></Text>
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
            onPress={handleConfirmation}
            disabled={loading || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.WHITE} />
            ) : (
              <>
                <Ionicons name="rocket-outline" size={18} color={Colors.WHITE} />
                <Text style={styles.buttonText}>
                  {bookingDetails.status === 'In-Progress' ? 'View Order Activity' : 'Start Service'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        {
          bookingDetails.status === 'Confirmed' ?
            <View style={styles.disclaimerContainer}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.PRIMARY} />
              <Text style={styles.disclaimerText}>
                The service can be started up to two hours before the scheduled time slot. For example, if the time slot is 9:00 AM, you can start the service at 7:00 AM, but not before that.
              </Text>
            </View> : null
        }
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure?</Text>
            <Text style={styles.modalText}>Do you want to start the service?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonNo]}
                onPress={() => setShowConfirmationModal(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonYes]}
                onPress={handleConfirmStartService}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  actionButtons: {
    marginBottom: 15,
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
    fontSize: 13,
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
    padding: 11,
    marginTop: 5,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disclaimerText: {
    fontSize: 14,
    paddingHorizontal: 0,
    color: Colors.DARK_GRAY,
    fontFamily: 'outfit-medium',
    marginLeft: 2
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    color: Colors.BLACK,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: Colors.DARK_GRAY,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonYes: {
    backgroundColor: Colors.PRIMARY,
  },
  modalButtonNo: {
    backgroundColor: Colors.GRAY,
  },
  modalButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: 'outfit-bold',
  },
});

export default ActiveDetailsBookingPage;