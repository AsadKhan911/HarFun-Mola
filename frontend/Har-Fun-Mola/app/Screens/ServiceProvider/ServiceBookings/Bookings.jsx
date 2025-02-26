import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { Card } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { BookingBaseUrl } from "../../../URL/userBaseUrl";
import Colors from "../../../../constants/Colors.ts"; // Assuming colors are stored here
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "expo-router";
import { setAllProviderBookings } from "../../../redux/bookingSlice.js";

const ServiceProviderBookings = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Pending"); // Default selected tab
  const { allProviderBookings } = useSelector((store) => store.bookings);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        dispatch(setAllProviderBookings([]))
        const response = await axios.get(`${BookingBaseUrl}/getproviderbookings`);
        if (response.data.success) {
          dispatch(setAllProviderBookings(response.data.bookings));
        }
        else {
          console.log("No bookings available")
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedTab]);


  // Filter bookings based on selectedTab
  const filteredBookings = allProviderBookings.filter((booking) => {
    if (selectedTab === "Pending") return booking.status === "Pending";
    if (selectedTab === "Active") return booking.status === "Confirmed"; // Adjust based on your DB status
    if (selectedTab === "On-Going") return booking.status === "In-Progress";
    if (selectedTab === "Cancelled") return booking.status === "Cancelled";
    return false;
  });

  // Define the action when a booking is clicked based on selectedTab
  const handlePress = (item) => {
    if (selectedTab === "Pending") {
      navigation.push("pending-detail-booking-page", {
        bookingId: item?._id,
      });
    } else if (selectedTab === "Active") {
      navigation.push("active-detail-booking-page", {
        bookingId: item?._id,
      });
    } else if (selectedTab === "On-Going") {
      navigation.push("active-detail-booking-page", {
        bookingId: item?._id,
      });
    // } else if (selectedTab === "On-Going") {
    //   navigation.push("inprogress-detail-booking-page", {
    //     bookingId: item?._id,
    //   });
    } else if (selectedTab === "Cancelled") {
      return null
    }
  };

  // Function to determine badge color based on booking status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return 'orange'; // Keep the same color for pending
      case "Confirmed":
        return Colors.PRIMARY; 
      case "In-Progress":
        return '#4A90E2'; // Green for completed
      case "Cancelled":
        return 'red'; // Red for cancelled
      default:
        return Colors.GRAY; // Default fallback color
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Tab Navigation */}
      <View style={styles.tabContainer}>
        {["Pending", "Active", "On-Going", "Cancelled"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List of Bookings */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loader} />

      ) : filteredBookings.length === 0 ? (
        <Text style={styles.noBookingsText}>No bookings available yet</Text>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <Card style={styles.card}>
                <Card.Content>
                  <Text style={styles.title}>{item.service.serviceName}</Text>
                  <Text style={styles.detail}>
                    {
                      item?.orderNumber && (
                        <>
                          <FontAwesome name="first-order" size={14} color={Colors.GRAY} /> {item.orderNumber}
                        </>
                      )
                    }
                  </Text>

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
                    <FontAwesome name="credit-card" size={14} color={Colors.GRAY} /> {item.paymentMethod}
                  </Text>
                  <Text style={styles.detail}>
                    <FontAwesome name="calendar" size={14} color={Colors.GRAY} /> {new Date(item.date).toDateString()} | {item.timeSlot}
                  </Text>

                  <View style={[styles.roleBadgeContainer, { backgroundColor: getStatusBadgeColor(item?.status), marginTop: 15 }]}>
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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.WHITE,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.PRIMARY,
  },
  tabText: {
    fontSize: 16,
    color: Colors.GRAY,
    fontFamily: "outfit-Medium",
  },
  activeTabText: {
    color: Colors.WHITE,
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
  noBookingsText: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.GRAY,
    marginTop: 20
  },

});

export default ServiceProviderBookings;
