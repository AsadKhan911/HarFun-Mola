import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import BookingListItem from "../BookingScreen/BookingListItem.jsx";
import Colors from "@/constants/Colors";
import useGetUserBooking from '../../../hooks/useGetUserBooking.jsx'

const Booking = () => {


  const { allBookings } = useSelector((store) => store.bookings);
  const [selectedTab, setSelectedTab] = useState("Upcoming"); // Default selected tab

  useGetUserBooking({ selectedTab });

  // Filter bookings based on selectedTab
  const filteredBookings = allBookings?.filter((booking) => {
    if (selectedTab === "Upcoming") return ["Pending", "Confirmed"].includes(booking.status);
    if (selectedTab === "Ongoing") return booking.status === "In-Progress";
    if (selectedTab === "Completed") return booking.status === "Completed";
    if (selectedTab === "Cancelled") return booking.status === "Cancelled";
    return false;
  });

  return (
    <View style={styles.container}>
      {/* Top Tab Navigation */}
      <View style={styles.tabContainer}>
        {["Upcoming", "Ongoing", "Completed", "Cancelled"].map((tab) => (
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
      {filteredBookings.length === 0 ? (
        <Text style={styles.emptyText}>No bookings found</Text>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <BookingListItem booking={item} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.WHITE,
    paddingVertical: 12,
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
    paddingHorizontal: 8,
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
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: Colors.GRAY,
  },
});

export default Booking;
