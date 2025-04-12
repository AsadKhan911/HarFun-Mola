import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveJob } from "../../../redux/biddingSlice.js";
import { BiddingModelBaseUrl } from "../../../URL/userBaseUrl";
import Colors from "../../../../constants/Colors.ts";

const RecentJobs = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const savedJobs = useSelector((state) => state.bidding?.savedJobs || {});
  const user = useSelector((state) => state.auth?.user); // Assuming you have user info stored here

  useEffect(() => {
    axios
      .get(`${BiddingModelBaseUrl}/get-bid`)
      .then((response) => {
        setBids(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bids:", error);
        setLoading(false);
      });
  }, []);

  const handleSaveJob = async (job) => {
    if (!user?._id) {
      Alert.alert("Login Required", "Please log in to save jobs.");
      return;
    }

    try {
      const response = await axios.post(`${BiddingModelBaseUrl}/saved-jobs`, {
        userId: user._id,
        jobId: job._id,
      });

      if (response.status === 201) {
        dispatch(toggleSaveJob(job));; // Update Redux only after backend success
        console.log("Saved Jobs:", job);
      } else {
        Alert.alert("Already Saved", "This job is already saved.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "Job is already saved."
      ) {
        Alert.alert("Already Saved", "This job is already saved.");
      } else {
        console.error("Error saving job:", error);
        Alert.alert("Error", "Failed to save job. Try again later.");
      }
    }
  };

  const renderItem = ({ item }) => {
    const isSaved = !!savedJobs[item._id];

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("job-details", { job: item })}
        style={styles.card}
      >
        <View style={styles.headerRow}>
          <Text style={styles.serviceType}>{item.serviceType}</Text>
          <TouchableOpacity
           onPress={() => handleSaveJob(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isSaved ? Colors.PRIMARY : "#ccc"}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.postedBy}>
          Posted by: {item.customerId?.fullName || "Unknown"}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <FlatList
      data={bids}
      keyExtractor={(item) => item._id}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
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
