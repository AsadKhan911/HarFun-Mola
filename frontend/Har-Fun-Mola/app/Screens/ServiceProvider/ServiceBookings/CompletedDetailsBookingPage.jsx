import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { Card } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "expo-router";
import { setAllProviderBookings } from "../../../redux/bookingSlice.js";
import { Heading } from "../../../../components/Heading.jsx";
import Colors from "../../../../constants/Colors.ts";
import { BookingBaseUrl } from "../../../URL/userBaseUrl";
import { Ionicons } from "@expo/vector-icons";

const CompletedDetailsBookingPage = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { allProviderBookings } = useSelector((store) => store.bookings);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        dispatch(setAllProviderBookings([]));
        const response = await axios.get(`${BookingBaseUrl}/getproviderbookings`);
        if (response.data.success) {
          dispatch(setAllProviderBookings(response.data.bookings));
        } else {
          console.log("No bookings available");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on "Completed" status
  const filteredBookings = allProviderBookings.filter(
    (booking) => booking.status === "Completed"
  );

  // Function to determine badge color based on booking status
  const getStatusBadgeColor = (status) => {
    if (status === "Completed") {
      return "#4A90E2"; // Color for completed status
    }
    return Colors.GRAY;
  };

  const formatElapsedTime = (elapsedTime) => {
    if (!elapsedTime) {
      return 'Not Available'; // Return a default value if elapsedTime is null or undefined
    }

    // Assuming elapsedTime is in the format "hh:mm:ss"
    const timeParts = elapsedTime.split(':'); // Split the time by ':'

    if (timeParts.length === 3) {
      const hours = parseInt(timeParts[0], 10); // Get hours
      const minutes = parseInt(timeParts[1], 10); // Get minutes
      const seconds = parseInt(timeParts[2], 10); // Get seconds

      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
    }

    return 'Invalid Time Format'; // Return this if the time format is not as expected
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} onPress={() => navigation.goBack()} style={{ marginTop: 2, marginRight: 5 }} />
        <Text style={styles.CompleteBookingText}>Completed Bookings</Text>
      </View>

      {/* List of Completed Bookings */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loader} />
      ) : filteredBookings.length === 0 ? (
        <Text style={styles.noBookingsText}>No completed bookings available yet</Text>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item._id}
          style={{ marginTop: 20 }}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                {/* Service Name */}
                <Text style={styles.title}>{item.service.serviceName}</Text>

                {/* Order Number */}
                <Text style={styles.detail}>
                  <Text style={styles.label}>Order Number: </Text>
                  {item.orderNumber}
                </Text>

                {/* Date and Time Slot */}
                <Text style={styles.detail}>
                  <Text style={styles.label}>Booking Date: </Text>
                  {new Date(item.date).toDateString()} | {item.timeSlot}
                </Text>

                {/* Completed Time */}
                <Text style={styles.detail}>
                  <Text style={styles.label}>Completed On: </Text>
                  {new Date(item.completedTime).toLocaleString('en-PK', {
                    weekday: 'short', // 'Mon'
                    year: 'numeric',  // '2025'
                    day: 'numeric',   // '10'
                    month: 'short',   // 'Feb'
                    hour: '2-digit',  // '08'
                    minute: '2-digit',// '54'
                    hour12: true      // 'AM/PM'
                  })}
                </Text>


                {/* Elapsed Time */}
                <Text style={styles.detail}>
                  <Text style={styles.label}>Total Service Time: </Text>
                  {formatElapsedTime(item.elapsedTime)}
                </Text>

                {/* User Info */}
                <Text style={styles.detail}>
                  <Text style={styles.label}>Customer Name: </Text>
                  {item.user.fullName}
                </Text>

                <Text style={styles.detail}>
                  <Text style={styles.label}>Address: </Text>
                  {item.user.area}, {item.user.city}
                </Text>

                {/* Service Price */}
                <Text style={styles.detail}>
                  <Text style={styles.label}>Price: </Text>
                  ₹{item.service.price}
                </Text>

                {/* Status */}
                <View style={[styles.roleBadgeContainer, { backgroundColor: getStatusBadgeColor(item?.status), marginTop: 15 }]}>
                  <Text style={styles.roleBadge}>{item?.status}</Text>
                </View>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  CompleteBookingText: {
    fontSize: 23,
    fontFamily: 'outfit-Medium'
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
    padding: 16,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: "outfit-Medium",
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  detail: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.DARK_GRAY,
    marginVertical: 4,
  },
  label: {
    fontFamily: "outfit-Medium",
    color: Colors.BLACK,
  },
  roleBadgeContainer: {
    padding: 6,
    borderRadius: 5,
    alignSelf: "flex-start", // Align badge to the left
    marginTop: 10,
    marginHorizontal: 'auto'
  },
  roleBadge: {
    fontSize: 14,
    color: Colors.WHITE,
    fontFamily: "outfit-Medium",
  },
  noBookingsText: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.GRAY,
    marginTop: 20,
  },
});

export default CompletedDetailsBookingPage;