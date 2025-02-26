import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Colors from "../../../constants/Colors.ts";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import useGetCancelOrder from "../../../customHooks/ServiceUser/useGetCancelOrder.jsx"; // Import custom hook
import { LinearGradient } from "expo-linear-gradient"; // For gradient buttons
import { PaymentBaseUrl } from "../../URL/userBaseUrl.js";
import axios from "axios";

const ConfirmedOrderDetailed = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { booking } = route.params;
  const { handleAction, loading } = useGetCancelOrder(booking?._id);  // Use custom hook

  const handleCancelOrder = async () => {
    try {
    const response = await handleAction("Reject");

    if (!response.success) {
      alert("Failed to cancel the order. Please try again.");
      return;
  }

    // Step 2: Unauthorize the payment
    await axios.post(`${PaymentBaseUrl}/cancel-payment`, { paymentIntentId: booking?.paymentIntentId });

    // Step 3: Alert success after both actions are done
    alert("Order has been canceled and payment is reversed successfully.");
        
    // Step 4: Navigate back
    navigation.goBack();
    }
    catch (error) {
      console.error("Error canceling order:", error);
      alert(error.response?.data?.error || "Something went wrong while canceling the order.");
  }
  };

  const handleViewProfile = () => {
    navigation.navigate("ProviderProfile", { providerId: booking?.service?.created_by?._id });
  };

  const handleMessageProvider = () => {
    navigation.navigate("MessageProvider", { providerId: booking?.service?.created_by?._id });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Go Back Icon */}
      <TouchableOpacity style={styles.goBackContainer} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={Colors.BLACK} />
      </TouchableOpacity>

      {/* Service Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: booking?.service?.created_by?.profile?.profilePic }} style={styles.image} />
      </View>

      {/* Details Card */}
      <View style={styles.detailsCard}>
        {/* Order Number */}
        <Text style={styles.orderNumber}>📦 <Text style={styles.ON}>Order Number: </Text> {booking?.orderNumber}</Text>

        <Text style={styles.serviceName}>{booking?.service?.serviceName}</Text>
        <Text style={styles.providerName}>By {booking?.service?.created_by?.fullName}</Text>

        <Text style={styles.sectionTitle}>Order Details</Text>
        <View style={styles.detailRow}>
          <FontAwesome6 name="location-dot" size={16} color={Colors.PRIMARY} />
          <Text style={styles.detailLabel}>Your Address: </Text>
          <Text style={styles.detailText}>{booking?.address}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome6 name="calendar-alt" size={16} color={Colors.PRIMARY} />
          <Text style={styles.detailLabel}>Booking Date: </Text>
          <Text style={styles.detailText}>{new Date(booking.date).toDateString()}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome6 name="clock" size={16} color={Colors.PRIMARY} />
          <Text style={styles.detailLabel}>Time Slot: </Text>
          <Text style={styles.detailText}>{booking?.timeSlot}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome6 name="credit-card" size={16} color={Colors.PRIMARY} />
          <Text style={styles.detailLabel}>Payment Type: </Text>
          <Text style={styles.detailText}>{booking?.paymentMethod}</Text>
        </View>

        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: booking?.status === "Confirmed" ? "green" : "#FFA000" }]}>
          <Text style={styles.statusText}>{booking?.status}</Text>
        </View>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <View style={styles.rowButtons}>
          <TouchableOpacity style={styles.profileButton} onPress={handleViewProfile}>
            <LinearGradient colors={[Colors.PRIMARY, "#6C63FF"]} style={styles.gradientButton}>
              <Text style={styles.buttonText}>View Profile</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.messageButton} onPress={handleMessageProvider}>
            <LinearGradient colors={[Colors.BLACK, Colors.GRAY]} style={styles.gradientButton}>
              <Text style={styles.buttonText}>Message Provider</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Cancel Order Button */}
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder} disabled={loading}>
          <LinearGradient colors={["#FF4B4B", "#FF6B6B"]} style={styles.gradientButton}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.cancelText}>Cancel Order</Text>}
          </LinearGradient>
        </TouchableOpacity>
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
    width: "100%",
    height: 250,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  detailsCard: {
    backgroundColor: Colors.WHITE,
    padding: 24,
    borderRadius: 16,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  serviceName: {
    fontSize: 24,
    fontFamily: "outfit-Bold",
    color: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: 8,
  },
  providerName: {
    fontSize: 16,
    fontFamily: "outfit-Medium",
    color: Colors.GRAY,
    textAlign: "center",
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 20,
    fontFamily: "outfit-Medium",
    color: Colors.DARK_GRAY,
    textAlign: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'outfit-Bold',
    fontSize: 18,
    color: Colors.DARK_GRAY,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontFamily: 'outfit-Medium',
    fontSize: 14,
    color: Colors.DARK_GRAY,
    marginLeft: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginLeft: 5,
  },
  statusBadge: {
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "center",
    marginTop: 16,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "outfit-Bold",
    color: Colors.WHITE,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  gradientButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  profileButton: {
    width: "48%",
    borderRadius: 30,
    overflow: "hidden",
  },
  messageButton: {
    width: "48%",
    borderRadius: 30,
    overflow: "hidden",
  },
  cancelButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "outfit-Bold",
    color: Colors.WHITE,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: "outfit-Bold",
    color: Colors.WHITE,
  },
  goBackContainer: {
    position: "absolute",
    top: 20,
    left: 18,
    zIndex: 1,
  },
  ON: {
    fontFamily: 'outfit-Bold'
  },
});

export default ConfirmedOrderDetailed;