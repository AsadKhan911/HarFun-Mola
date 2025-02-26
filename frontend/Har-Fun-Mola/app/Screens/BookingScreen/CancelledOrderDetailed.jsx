import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Colors from "../../../constants/Colors.ts";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";

const CancelledOrderDetailed = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { booking } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
  
      {/* Go Back Icon */}
      <TouchableOpacity style={styles.goBackContainer} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={Colors.BLACK} />
      </TouchableOpacity>
      
      {/* Order Details Card */}
      <View style={styles.detailsCard}>

        <Text style={styles.serviceName}>{booking?.service?.serviceName}</Text>
        <Text style={styles.providerName}>By {booking?.service?.created_by?.fullName}</Text>

        <Text style={{ fontFamily: 'outfit-Medium', fontSize: 20, marginBottom: 10 }}>Order Details</Text>
        
        {/* Order Details Rows */}
        <View style={styles.detailRow}>
          <FontAwesome6 name="box" size={16} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: 'outfit-Medium' }}>  Order No: </Text>
          <Text style={styles.detailText}>{booking?.orderNumber}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome6 name="location-dot" size={16} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: 'outfit-Medium' }}>  Your Address: </Text>
          <Text style={styles.detailText}>{booking?.address}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome6 name="calendar-alt" size={16} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: 'outfit-Medium' }}>  Booking Date: </Text>
          <Text style={styles.detailText}>{new Date(booking.date).toDateString()}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome6 name="clock" size={16} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: 'outfit-Medium' }}>   Time Slot: </Text>
          <Text style={styles.detailText}>{booking?.timeSlot}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome6 name="credit-card" size={16} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: 'outfit-Medium' }}>   Payment Status: </Text>
          <Text style={styles.detailText}>{booking?.paymentStatus}</Text>
        </View>

        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: 'red' }]} >
          <Text style={styles.statusText}>{booking?.status}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 16,
  },
  goBackContainer: {
    position: "absolute",
    top: 20,
    left: 18,
    zIndex: 1,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "90%",
    height: 200,
    borderRadius: 12,
    resizeMode: "contain"
  },
  detailsCard: {
    marginTop: '50%',
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 12,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  serviceName: {
    fontSize: 22,
    fontFamily: "outfit-Bold",
    color: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: 6,
  },
  providerName: {
    fontSize: 16,
    fontFamily: "outfit-Medium",
    color: Colors.GRAY,
    textAlign: "center",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.DARK_GRAY,
    marginLeft: 5,
  },
  statusBadge: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "center",
    marginTop: 12,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "outfit-Medium",
    color: Colors.WHITE,
  },
});

export default CancelledOrderDetailed;

