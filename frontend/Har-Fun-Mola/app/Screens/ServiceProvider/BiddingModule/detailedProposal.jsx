import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../../constants/Colors.ts";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

const DetailedProposal = () => {
  const { responses } = useRoute().params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  
  const userId = useSelector((state) => state.auth.user._id);

  // Assuming you're using `responses` as the offer data
  const offer = responses;

  useEffect(() => {
    setLoading(false);
  }, []);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (!offer) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No offer details available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Interviewing</Text>
      <Text style={styles.subText}>Here are the user and job details:</Text>

      <View style={styles.card}>
        <Text style={styles.label}>User Name:</Text>
        <Text style={styles.value}>{offer.customerId?.fullName}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{offer.customerId?.email}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{offer.customerId?.phoneNumber}</Text>

        <Text style={styles.label}>Offered Price:</Text>
        <Text style={styles.value}>${offer.agreedPrice || offer.proposedPrice}</Text>

        <Text style={styles.label}>Job Description:</Text>
        <Text style={styles.value}>{offer.bidId?.description}</Text>

        <Text style={styles.label}>Contract Status:</Text>
        <Text style={styles.status}>{offer.status}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.messageButton}>
          <Ionicons name="chatbox-ellipses-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hireButton}
          disabled={loading}
        >
          <Ionicons name="briefcase-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {loading ? "Processing..." : "View Profile"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailedProposal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: '50%',
    padding: 20,
    backgroundColor: "#f0f4f7",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
  value: {
    fontSize: 15,
    color: "#222",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  messageButton: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    flex: 0.48,
  },
  hireButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    flex: 0.48,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});