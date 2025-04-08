// BidListScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";
import { BiddingModelBaseUrl } from "../../../URL/userBaseUrl";
import { useNavigation } from "expo-router";

const RecentJobs = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation()
  useEffect(() => {
    axios.get(`${BiddingModelBaseUrl}/get-bid`) 
      .then(response => {
        setBids(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching bids:", error);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity  onPress={() => navigation.navigate('job-details', { job: bids })}  style={styles.card}>
      <Text style={styles.serviceType}>{item.serviceType}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.postedBy}>Posted by: {item.customerId?.fullName || "Unknown"}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={bids}
      keyExtractor={item => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  serviceType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  postedBy: {
    fontSize: 12,
    color: "#999",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecentJobs;