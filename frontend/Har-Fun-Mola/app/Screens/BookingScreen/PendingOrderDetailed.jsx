import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import  useGetCancelOrder  from "../../../customHooks/ServiceUser/useGetCancelOrder.jsx"; // Import custom hook

const PendingOrderDetailed = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { booking } = route.params;
  const { handleAction, loading } = useGetCancelOrder(booking?._id);  // Use custom hook

  const handleCancelOrder = async () => {
    const response = await handleAction("Reject");
    if (response.success) {
      alert(response.message);
      navigation.goBack(); // Navigate back after canceling
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Service Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: booking?.service?.created_by?.profile?.profilePic }} style={styles.image} />
      </View>

      {/* Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.serviceName}>{booking?.service?.serviceName}</Text>
        <Text style={styles.providerName}>By {booking?.service?.created_by?.fullName}</Text>

        <Text style={{ fontFamily: 'outfit-Medium', fontSize: 20, marginBottom: 10 }}>Order Details</Text>
        <View style={styles.detailRow}>
          <FontAwesome6 name="location-dot" size={16} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: 'outfit-Medium' }}> Your Address: </Text>
          <Text style={styles.detailText}>{booking?.address}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome6 name="calendar-alt" size={16} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: 'outfit-Medium' }}> Booking Date: </Text>
          <Text style={styles.detailText}>{booking?.date}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome6 name="clock" size={16} color={Colors.PRIMARY} />
          <Text style={{ fontFamily: 'outfit-Medium' }}>  Time Slot: </Text>
          <Text style={styles.detailText}>{booking?.timeSlot}</Text>
        </View>

        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: booking?.status === "Cancelled" ? "red" : "#FFA500" }]}>
          <Text style={styles.statusText}>{booking?.status}</Text>
        </View>
      </View>

      {/* Centered Cancel Order Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.cancelText}>Cancel Order</Text>}
        </TouchableOpacity>
      </View>

      {/* Disclaimer Card */}
      <View style={styles.disclaimerCard}>
        <Ionicons name="information-circle" size={20} color={Colors.PRIMARY} style={styles.disclaimerIcon} />
        <Text style={styles.disclaimerText}>
          Your order has been sent to the service provider
          <Text style={{ fontFamily: "outfit-Bold" }}> {booking?.service?.created_by?.fullName} </Text>
          and we are waiting for their confirmation. In the meantime, please wait until your order is confirmed.
          We will notify you via email once the confirmation is successful.
        </Text>
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
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontFamily: "outfit-Bold",
    color: Colors.WHITE,
  },
  disclaimerCard: {
    flexDirection: "row",
    backgroundColor: Colors.WHITE,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    alignItems: "center",
  },
  disclaimerIcon: {
    marginRight: 10,
  },
  disclaimerText: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.DARK_GRAY,
    flex: 1,
  },
});

export default PendingOrderDetailed;
