import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { Card, Badge } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { BookingBaseUrl } from "../../../URL/userBaseUrl";
import Colors from "../../../../constants/Colors.ts"; // Assuming colors are stored here
import { useFonts } from "expo-font";
import { setAllProviderBookings } from "../../../redux/bookingSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "expo-router";

const ServiceProviderBookings = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { allProviderBookings } = useSelector((store) => store.bookings);
  const dispatch = useDispatch();

  // Filter bookings to show only those with status "Pending"
  const pendingBookings = allProviderBookings.filter(
    (booking) => booking.status === "Pending"
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${BookingBaseUrl}/getproviderbookings`);
        dispatch(setAllProviderBookings(response.data.bookings));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Pending Service Bookings</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loader} />
      ) : (
        <FlatList
          data={pendingBookings} // Use the filtered list
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.push("detail-booking-page", {
                  bookingId: item?._id,
                })
              }
            >
              <Card style={styles.card}>
                <Card.Content>
                  <Text style={styles.title}>{item.service.serviceName}</Text>
                  <Text style={styles.detail}>
                    <FontAwesome name="user" size={14} color={Colors.GRAY} /> {item.user.fullName}
                  </Text>
                  <Text style={styles.detail}>
                    <FontAwesome name="phone" size={14} color={Colors.GRAY} /> {item.user.phoneNumber}
                  </Text>
                  <Text style={styles.detail}>
                    <FontAwesome name="map-marker" size={14} color={Colors.GRAY} /> {item.user.area}, {item.user.city}
                  </Text>
                  <Text style={styles.detail}>
                    <FontAwesome name="dollar" size={14} color={Colors.GRAY} /> {item.service.price}
                  </Text>
                  <Text style={styles.detail}>
                    <FontAwesome name="calendar" size={14} color={Colors.GRAY} /> {new Date(item.date).toDateString()} | {item.timeSlot}
                  </Text>

                  <View style={[styles.roleBadgeContainer, { marginTop: 15 }]}>
                    <Text style={styles.roleBadge}>{item?.status}</Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
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
    backgroundColor: Colors.LIGHT_GRAY,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontFamily: "outfit-Bold",
    color: Colors.BLACK,
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
    padding: 12,
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
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginVertical: 3,
  },
  roleBadgeContainer: {
    fontSize: 10,
    fontFamily: "outfit",
    padding: 3,
    color: Colors.PRIMARY,
    backgroundColor: "#FFA726",
    borderRadius: 5,
    alignSelf: "center", // Center the badge horizontally
    paddingHorizontal: 5,
    marginTop: 5,
  },
  roleBadge: {
    fontSize: 14,
    color: Colors.WHITE, // Text color inside the badge
    fontFamily: "outfit-Medium",
  },
});

export default ServiceProviderBookings;