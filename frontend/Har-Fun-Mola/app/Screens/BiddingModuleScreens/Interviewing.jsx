import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Colors from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BiddingModelBaseUrl } from "../../URL/userBaseUrl";
import { useSelector } from "react-redux";

const Interviewing = () => {
  const userId = useSelector((store) => store.auth.user._id);
  const navigation = useNavigation();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviewingOffers = async () => {
      try {
        const response = await axios.get(`${BiddingModelBaseUrl}/get-interviewing-offers/${userId}`);
        const offers = response.data.offers;

        if (offers && offers.length > 0) {
          setOffers(offers); // Store all offers
        } else {
          Alert.alert("No Offers", "No interviewing offers found for this user.");
        }
      } catch (error) {
        console.error("Error fetching offers:", error.response?.data || error.message || error);
        Alert.alert("Error", "Failed to load offer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewingOffers();
  }, [userId]);

  const handlePress = (offer) => {
    navigation.navigate("interview-screen", { offer });
    console.log(offer)
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No offer details available.</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      {offers.map((offer) => (
        <TouchableOpacity
          key={offer._id}
          style={styles.card}
          onPress={() => handlePress(offer)}
        >
          <Text style={styles.serviceName}>{offer.bidId?.serviceType || "Service Title"}</Text>
          <Text style={styles.providerName}>{offer.serviceProviderId?.fullName || "Provider"}</Text>
          <Text style={styles.status}>{offer.status}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Interviewing;

const styles = StyleSheet.create({
  card: {
    margin: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 6,
  },
  providerName: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
